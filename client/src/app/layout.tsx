'use client'

import "./globals.css";
import { Provider } from 'react-redux';

import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner';
import { persistor, store } from "../../store/store";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only render PersistGate on client
  }, []);

  return (
    <html lang="en">
      <body>   <Provider store={store}>
        {isMounted ? (
          <PersistGate loading={null} persistor={persistor}>
            {children}
            <Toaster richColors position="top-right" />
          </PersistGate>
        ) : null}
      </Provider>
      </body>
    </html>
  );
}
