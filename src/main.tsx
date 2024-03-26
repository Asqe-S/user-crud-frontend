import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import store from "@/components/redux/store.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <ToastContainer
            theme="colored"
            stacked
            hideProgressBar
            closeOnClick
            draggable
            transition={Zoom}
          />
          <div className="p-2">
            <App />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
