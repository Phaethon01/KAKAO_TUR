const API_URL = 'https://kakao-tur.by/api.php';
const FROM_CITY = 'Минск';
const TO_CITY = 'Москва';

// TODO(security): these credentials are sent as a Basic Auth header directly
// from the browser, which means they're readable by anyone via devtools'
// Network tab or the bundled JS. Fine for now to get the integration proven
// end-to-end, but this needs to move behind a server-side proxy (e.g. a
// single Vercel serverless function that holds the credential and forwards
// the request) before this ships to real users.
const AUTH_HEADER = `Basic ${btoa('kakao:tur2024')}`;

function formatDuration(startStr, endStr) {
  const start = new Date(startStr.replace(' ', 'T'));
  const end = new Date(endStr.replace(' ', 'T'));
  const minutes = Math.round((end - start) / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}ч ${m}м` : `${h}ч`;
}

function timeOf(dateTimeStr) {
  return dateTimeStr.split(' ')[1]?.slice(0, 5) ?? '';
}

// routes.res is an array of groups; each group is an array of entries keyed
// by route name (e.g. "Минск - Москва") plus an "other" key holding a
// duplicate of the same pricing info — that one's ignored. routes.info is
// just request/debug metadata (url, http_code, ...), not trip data.
function flattenRoutes(payload) {
  const groups = payload?.routes?.res ?? [];
  const raw = [];
  for (const group of groups) {
    for (const entry of group) {
      for (const [key, value] of Object.entries(entry)) {
        if (key === 'other') continue;
        raw.push(value);
      }
    }
  }
  return raw;
}

function mapTripToUiShape(raw) {
  return {
    id: raw.id,
    depart: timeOf(raw.reis_time_city),
    arrive: timeOf(raw.reis_time_city_end),
    duration: formatDuration(raw.reis_time_city, raw.reis_time_city_end),
    operator: raw.reisCarrier,
    arriveStation: raw.reis_address_b,
    price: Number(raw.price?.BYN?.cost ?? 0),
    seatsLeft: raw.reis_free_place ?? 0,
    // Total physical seats on the bus. Any seat number in [1, capacity] not
    // present in `freeSeats` is occupied — see freeSeats below.
    capacity: Number(raw.countPlaceBus ?? raw.bus?.autobus_place ?? 0),
    // Currently free/sellable seats, keyed by seat number (string) -> real
    // backend { id, number }. Confirmed by inspecting a real response: this
    // object's entry count exactly matched reis_free_place, so it's the
    // free-seat list, not a full seat map — any seat number from 1 to
    // `capacity` missing here is sold/unavailable. The `id` (not the visible
    // number) is what a real reservation call would need.
    freeSeats: raw.place ?? {},
  };
}

export async function searchTrips(dateISO) {
  const url = `${API_URL}?action=routeInfo&from=${encodeURIComponent(FROM_CITY)}&to=${encodeURIComponent(TO_CITY)}&date=${encodeURIComponent(dateISO)}`;

  let response;
  try {
    response = await fetch(url, { headers: { Authorization: AUTH_HEADER } });
  } catch (err) {
    // A fetch() that rejects before producing any Response is, in every
    // browser, indistinguishable from a network failure — except that a
    // blocked CORS request is by far the most common cause when the target
    // is a third-party API you don't control. TypeError is what both
    // Chrome and Firefox throw for CORS blocks, DNS failures, and refused
    // connections alike, so we can't be 100% certain — but flagging CORS
    // as the prime suspect here saves a debugging cycle.
    if (err instanceof TypeError) {
      console.error(
        '[searchTrips] request failed before a response arrived — likely a CORS block (kakao-tur.by/api.php probably needs to send an Access-Control-Allow-Origin header for this site\'s origin). Could also be DNS/network failure.',
        err,
      );
    } else {
      console.error('[searchTrips] unexpected error before a response arrived', err);
    }
    throw err;
  }

  if (response.status === 401 || response.status === 403) {
    console.error(`[searchTrips] request reached the server but auth was rejected (HTTP ${response.status}) — check the kakao:tur2024 credentials`);
    throw new Error(`searchTrips: auth failed (HTTP ${response.status})`);
  }
  if (!response.ok) {
    console.error(`[searchTrips] request reached the server but failed (HTTP ${response.status})`);
    throw new Error(`searchTrips: HTTP ${response.status}`);
  }

  const data = await response.json();
  return flattenRoutes(data).map(mapTripToUiShape);
}
