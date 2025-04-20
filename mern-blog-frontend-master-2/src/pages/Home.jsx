import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { fetchAuthMe } from './../redux/slices/auth';
import backgroundImage from './../photo/nature-pirs-more-priboi-rozovii-105616.jpeg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupIcon from '@mui/icons-material/Group'; // Replace Diversity1Icon with GroupIcon
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => Boolean(state.auth.data));

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <div
        className={styles.container}
        style={{
          background: 'rgba(255, 255, 255, 0.9)', // Brighter window
          padding: '30px',
          borderRadius: '20px',
          maxWidth: '700px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
          animation: `${fadeIn} 1s ease-in-out`,
        }}
      >
        <div className={styles.info}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff5f6d',
              animation: `${pulse} 2s infinite`,
            }}
          >
            Знайомства, які змінюють життя
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '30px',
              color: '#333',
              animation: `${fadeIn} 1.5s ease-in-out`,
            }}
          >
            VoJeD - це платформа для знайомств, яка допомагає людям знайти справжні зв'язки. Ми прагнемо створити безпечне та комфортне середовище для спілкування та знайомств.
          </p>
        </div>
        <Link
          to={isAuthenticated ? '/anceta' : '/login'}
          className={styles.loginButton}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '30px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '18px',
            transition: 'transform 0.3s ease',
            animation: `${bounce} 2s infinite`,
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {isAuthenticated ? 'До анкети' : 'Увійти'}
        </Link>
      </div>

      {/* Updated Features Section */}
      <div
        className={styles.features}
        style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: <FavoriteIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Справжні зв’язки' },
          { icon: <PersonSearchIcon style={{ fontSize: '40px', color: '#ffc371' }} />, label: 'Пошук партнерів' },
          { icon: <VerifiedIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Перевірені профілі' },
          { icon: <GroupIcon style={{ fontSize: '40px', color: '#ffc371' }} />, label: 'Різноманітність' },
          { icon: <EventAvailableIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Події та зустрічі' },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              width: '150px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
              animation: `${fadeIn} 1s ease-in-out ${index * 0.2}s`,
            }}
          >
            {feature.icon}
            <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
