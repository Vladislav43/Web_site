
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth, fetchAuthMe } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      dispatch(fetchAuthMe()).then(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [dispatch]);

  const onClickLogout = () => {
    if (window.confirm('Вийти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>VOJED</div>
          </Link>
          <div className={styles.buttons}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} />
                <span style={{ marginLeft: '8px' }}>Завантаження...</span>
              </div>
            ) : (
              <>
                {isAuth ? (
                  <>
                     <Link to="/anceta">
                      <Button variant="contained">До анкет</Button>
                    </Link>   
                    <Link to="/user_info">
                      <Button variant="contained">Особистий кабінет</Button>
                    </Link>
                    <Link to="/fill_out_a_form">
                      <Button variant="contained">Добавити анкету</Button>
                    </Link>
                    <Button onClick={onClickLogout} variant="contained" color="error">
                      Вийти
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="contained">Увійти</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="contained">Створити акаунт</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};