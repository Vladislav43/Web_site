import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth, fetchAuthMe } from '../../redux/slices/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false); // State to handle button hiding during transitions

  useEffect(() => {
    const checkAuthStatus = async () => {
      await dispatch(fetchAuthMe());
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [dispatch]);

  const onClickLogout = async () => {
    if (window.confirm('Вийти?')) {
      setIsTransitioning(true); // Temporarily hide buttons
      await dispatch(logout());
      window.localStorage.removeItem('token');
      setTimeout(async () => {
        await dispatch(fetchAuthMe()); // Verify status after logout
        setIsTransitioning(false); // Show appropriate buttons
      }, 5000); // Wait for 5 seconds before showing buttons
    }
  };

  const onLoginOrRegister = async () => {
    setIsTransitioning(true); // Temporarily hide buttons
    setTimeout(async () => {
      await dispatch(fetchAuthMe()); // Verify status after login/register
      setIsTransitioning(false); // Show appropriate buttons
    }, 5000); // Wait for 5 seconds before showing buttons
  };

  return (
    <div
      className={styles.root}
      style={{
        background: 'linear-gradient(135deg, #ff5f6d, #ffc371)', // Gradient background
        padding: '10px 0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <div className={styles.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link className={styles.logo} to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>VoJeD</div>
          </Link>
          <div className={styles.buttons} style={{ display: 'flex', gap: '10px' }}>
            {isLoading || isTransitioning ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} style={{ color: '#fff' }} />
                <span style={{ marginLeft: '8px', color: '#fff' }}>Loading...</span>
              </div>
            ) : (
              <>
                {isAuth ? (
                  <>
                    <Link to="/anceta" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        startIcon={<ListIcon />}
                        sx={{
                          border: '2px solid',
                          borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '5px 15px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                            color: '#fff',
                          },
                        }}
                      >
                        До анкет
                      </Button>
                    </Link>
                    <Link to="/user_info" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        startIcon={<PersonIcon />}
                        sx={{
                          border: '2px solid',
                          borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '5px 15px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                            color: '#fff',
                          },
                        }}
                      >
                        Особистий кабінет
                      </Button>
                    </Link>
                    <Link to="/fill_out_a_form" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{
                          border: '2px solid',
                          borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '5px 15px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                            color: '#fff',
                          },
                        }}
                      >
                        Добавити анкету
                      </Button>
                    </Link>
                    <Button
                      onClick={onClickLogout}
                      variant="outlined"
                      startIcon={<LogoutIcon />}
                      sx={{
                        border: '2px solid',
                        borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                        color: '#fff',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        padding: '5px 15px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                          color: '#fff',
                        },
                      }}
                    >
                      Вийти
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ textDecoration: 'none' }} onClick={onLoginOrRegister}>
                      <Button
                        variant="outlined"
                        startIcon={<LoginIcon />}
                        sx={{
                          border: '2px solid',
                          borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '5px 15px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                            color: '#fff',
                          },
                        }}
                      >
                        Увійти
                      </Button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }} onClick={onLoginOrRegister}>
                      <Button
                        variant="outlined"
                        startIcon={<AppRegistrationIcon />}
                        sx={{
                          border: '2px solid',
                          borderImage: 'linear-gradient(135deg, #ff5f6d, #ffc371) 1',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '5px 15px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
                            color: '#fff',
                          },
                        }}
                      >
                        Створити акаунт
                      </Button>
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