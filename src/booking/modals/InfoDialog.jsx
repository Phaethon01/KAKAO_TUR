import React from 'react';
import { Dialog } from '../../design-system/index.js';

export function InfoDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="О сервисе">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-body)' }}>
        <p style={{ margin: 0 }}>
          KAKAO-TUR — сервис онлайн-продажи автобусных билетов на направлении
          Минск — Москва. Мы объединяем несколько проверенных перевозчиков
          (Visit Tour, Intercars), чтобы вы могли сравнить рейсы по времени и
          цене, выбрать место в салоне и оплатить билет картой или через ЕРИП
          — без очередей и звонков в кассу.
        </p>
        <p style={{ margin: 0 }}>
          Электронный билет приходит на телефон сразу после оплаты и
          действителен для посадки без распечатки.
        </p>
      </div>
    </Dialog>
  );
}
