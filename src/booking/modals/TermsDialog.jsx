import React from 'react';
import { Dialog } from '../../design-system/index.js';

export function TermsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Условия возврата и обмена">
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-body)' }}>
        <li>Билет можно вернуть без объяснения причин не позднее чем за 24 часа до отправления — комиссия сервиса не возвращается.</li>
        <li>Возврат менее чем за 24 часа до отправления или после отправления не производится.</li>
        <li>Обмен на другую дату или рейс возможен при наличии мест; разница в цене доплачивается, но не возвращается.</li>
        <li>При отказе в пересечении границы стоимость билета не возвращается.</li>
        <li>Для возврата или обмена напишите нам в Telegram или WhatsApp, указав номер билета.</li>
      </ul>
    </Dialog>
  );
}
