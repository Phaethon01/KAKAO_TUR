# KAKAO-TUR

Online bus ticket booking for the Minsk–Moscow route, built from the
[KAKAO-TUR Design System](https://claude.ai/design/p/28c152e3-982f-4a3b-b844-0b9dd2263143).

React + Vite SPA implementing the full search → seats → passenger details →
payment → confirmation booking flow, backed by a small in-house component
library (`src/design-system`) covering buttons, cards, form controls,
tabs, dialogs, and tooltips.

## Structure

- `src/design-system/` — tokens (color, type, spacing) and reusable UI
  components.
- `src/booking/` — the booking flow: shared chrome (header/footer/step
  indicator), the price calendar field, and one screen per step under
  `screens/`.
- `src/App.jsx` — routes (`react-router-dom`) mapping each step to a URL.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```
