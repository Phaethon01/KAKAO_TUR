import React from 'react';
import { Dialog } from '../../design-system/index.js';
import { CONTACTS } from '../data/contacts.js';

export function ContactsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Контакты">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
          Ответим в мессенджере в течение рабочего дня. Пункт отправления —
          Минск, центральный автовокзал.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONTACTS.map(c => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-body)',
              }}
            >
              {c.label}
              <span style={{ color: 'var(--text-tertiary)' }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
