import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createGlobalStyle } from 'styled-components';

/* ================= GLOBAL STYLES ================= */

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
    background: #f5f7fb;
    color: #111;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Prevent layout shift (navbar + bottom nav space) */
  #root {
    display: flex;
    flex-direction: column;
  }

  /* Scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  /* Mobile safe area (important for phones) */
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

/* ================= ERROR BOUNDARY ================= */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("App Crash:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px"
        }}>
          Something went wrong. Please refresh.
        </div>
      );
    }

    return this.props.children;
  }
}

/* ================= RENDER ================= */

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStyle />
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);