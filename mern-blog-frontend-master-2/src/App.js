import { Routes, Route } from 'react-router-dom';
import { Header } from "./components";
import { Home, Registration, Login, Anceta } from "./pages";
import React, { useState, useEffect } from "react";
import { fetchAuthMe } from "./redux/slices/auth";
import { UserInfo } from './components/UserInfo/UserInfo.jsx';
import OnBoarding from './pages/OnBoarding/OnBoarding.jsx';
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false); // State to track if auth check is complete
  const isAuth = useSelector((state) => Boolean(state.auth.data));

  useEffect(() => {
    dispatch(fetchAuthMe()).finally(() => {
      setIsAuthChecked(true); // Set to true once auth check is complete
    });
  }, [dispatch]);

  if (!isAuthChecked) {
    // Show a loading spinner or blank screen while auth state is being checked
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user_info" element={<UserInfo />} />
        <Route path="/fill_out_a_form" element={<OnBoarding />} />
        <Route path="/anceta" element={<Anceta />} />
      </Routes>
    </>
  );
}

export default App;
