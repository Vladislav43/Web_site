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
import FavoriteIcon from '@mui/icons-material/Favorite';
import { keyframes } from '@mui/system';

// Додаємо анімацію для сердечка біля логотипу
const heartBeat = keyframes`
  0% { transform: scale(1);}
  10% { transform: scale(1.18);}
  20% { transform: scale(0.95);}
  30% { transform: scale(1.13);}
  40% { transform: scale(1);}
  100% { transform: scale(1);}
`;

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(window.localStorage.getItem('token'));

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await dispatch(fetchAuthMe()).unwrap();
      } catch (e) {
        window.localStorage.removeItem('token');
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [dispatch, token]);

  useEffect(() => {
    const handleStorage = () => {
      setToken(window.localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const onClickLogout = async () => {
    if (window.confirm('Вийти?')) {
      await dispatch(logout());
      window.localStorage.removeItem('token');
      setToken(null); // Оновлюємо стан токена вручну
    }
  };

  return (
    <div
      className={styles.root}
      style={{
        background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
        padding: '10px 0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <div className={styles.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link className={styles.logo} to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>VoJeD</div>
            <FavoriteIcon
              sx={{
                color: '#ff5f6d',
                fontSize: 30,
                ml: 1,
                animation: `${heartBeat} 1.2s infinite`,
                transition: 'transform 0.3s cubic-bezier(.47,1.64,.41,.8)',
                verticalAlign: 'middle',
              }}
            />
          </Link>
          <div className={styles.buttons} style={{ display: 'flex', gap: '10px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} style={{ color: '#fff' }} />
                <span style={{ marginLeft: '8px', color: '#fff' }}>Loading...</span>
              </div>
            ) : isAuth ? (
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
                <Link to="/login" style={{ textDecoration: 'none' }}>
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
                <Link to="/register" style={{ textDecoration: 'none' }}>
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
          </div>
        </div>
      </Container>
    </div>
  );
};