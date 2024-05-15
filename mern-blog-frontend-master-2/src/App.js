import { Routes, Route } from 'react-router-dom'
import { Header } from "./components";
import { Home, Registration, Login } from "./pages";
import React from "react";
import { fetchAuthMe } from "./redux/slices/auth";
import {UserInfo} from './components/UserInfo/UserInfo.jsx'
import OnBoarding from './pages/OnBoarding/OnBoarding.jsx'
import { useDispatch, useSelector } from "react-redux";
import { Anceta } from './pages/anceta/Anceta.jsx';
function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/user_info" element={<UserInfo />} />
          <Route path="/fill_out_a_form" element={<OnBoarding/>} />
          <Route path="/anceta" element={<Anceta/>} />
        </Routes>
    </>
  );
}

export default App;
