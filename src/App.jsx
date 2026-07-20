import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BookingProvider } from './booking/BookingContext.jsx';
import { ModalProvider, useModals } from './booking/ModalContext.jsx';
import { Header, Footer, BookingSteps } from './booking/Chrome.jsx';
import { InfoDialog } from './booking/modals/InfoDialog.jsx';
import { ContactsDialog } from './booking/modals/ContactsDialog.jsx';
import { TermsDialog } from './booking/modals/TermsDialog.jsx';
import { SearchScreen } from './booking/screens/SearchScreen.jsx';
import { ResultsScreen } from './booking/screens/ResultsScreen.jsx';
import { SeatSelectionScreen } from './booking/screens/SeatSelectionScreen.jsx';
import { PassengerScreen } from './booking/screens/PassengerScreen.jsx';
import { PaymentScreen } from './booking/screens/PaymentScreen.jsx';
import { ConfirmationScreen } from './booking/screens/ConfirmationScreen.jsx';

const STEP_BY_PATH = { '/results': 0, '/seats': 1, '/checkout': 2, '/payment': 3 };

function ModalHost() {
  const { open, close } = useModals();
  return (
    <>
      <InfoDialog open={open === 'info'} onClose={close} />
      <ContactsDialog open={open === 'contacts'} onClose={close} />
      <TermsDialog open={open === 'terms'} onClose={close} />
    </>
  );
}

function Layout() {
  const location = useLocation();
  const step = STEP_BY_PATH[location.pathname];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      {step !== undefined ? <BookingSteps current={step} /> : null}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<SearchScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/seats" element={<SeatSelectionScreen />} />
          <Route path="/checkout" element={<PassengerScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/confirmation" element={<ConfirmationScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ModalHost />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <ModalProvider>
        <Layout />
      </ModalProvider>
    </BookingProvider>
  );
}
