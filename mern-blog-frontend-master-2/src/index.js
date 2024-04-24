import React from "react";
import ReactDOM from "react-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from 'react-router-dom';
import "./index.scss";
// import { ThemeProvider } from "@mui/material";
// import { theme } from "./theme";
import { Provider } from "react-redux";
import store from "./redux/store.js"
import App from "./App.js";

ReactDOM.render(

  <React.StrictMode>
    <Provider store={store}>
    <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
