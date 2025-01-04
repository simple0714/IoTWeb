"use client";

import { Provider } from 'react-redux';
// import { store } from '../store/store';
import { IntersectionObserverProvider } from '../utils/IntersectionObserverContext';
import "../css/globals.css";
import "../css/lib/setup.css";
import "../css/lib/layout.css";
import "../css/lib/style.css";
// import "../css/lib/setup.js";
// import "/fonts/Chillax-Variable.woff";

export default function Layout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>SOFT-LAB HUM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* <Provider store={store}> */}
          <IntersectionObserverProvider>
            {children}
          </IntersectionObserverProvider>
        {/* </Provider> */}
      </body>
    </html>
  );
}


