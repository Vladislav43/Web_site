import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from 'react-router-dom';
import "./index.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Provider } from "react-redux";
import store from "./redux/store.js"

ReactDOM.render(

  <React.StrictMode>
    <Provider store={store}>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
