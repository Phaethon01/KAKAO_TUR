import React from 'react';

const ModalContext = React.createContext(null);

export function ModalProvider({ children }) {
  const [open, setOpen] = React.useState(null); // 'info' | 'contacts' | 'terms' | null

  const value = React.useMemo(() => ({
    open,
    openInfo: () => setOpen('info'),
    openContacts: () => setOpen('contacts'),
    openTerms: () => setOpen('terms'),
    close: () => setOpen(null),
  }), [open]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModals() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error('useModals must be used within a ModalProvider');
  return ctx;
}
