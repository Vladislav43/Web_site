import Container from "@mui/material/Container";
import { Routes, Route } from 'react-router-dom'
import { Header } from "./components";
import { Home, Registration, Login } from "./pages";
import React, { useEffect } from "react";
import { fetchAuthMe, selectIsAuth, } from "./redux/slices/auth";
import {UserInfo} from './components/UserInfo/UserInfo.jsx'

import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/user_info" element={<UserInfo />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
