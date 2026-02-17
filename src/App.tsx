// App.js
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useLocation } from 'react-router-dom';

import store, { persistor } from './redux/store';
import Loader from './common/Loader';
import AppContent from './AppContent'; // Create this as a child component
import { SocketProvider } from './components/Generic/SocketContext';
import Announcement from 'react-announcement';
import { AutoLogoutComponent } from './components/Generic/AutoLogout';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <AutoLogoutComponent />
          <AppContent /> {/* Moving socket logic here */}
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
