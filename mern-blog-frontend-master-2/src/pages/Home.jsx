import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { fetchAuthMe } from './../redux/slices/auth'; // Імпорт thunk-функції для отримання даних авторизації
import backgroundImage from './../photo/nature-pirs-more-priboi-rozovii-105616.jpeg';

export const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => Boolean(state.auth.data));

  useEffect(() => {
    dispatch(fetchAuthMe()); // Виклик thunk-функції для отримання даних авторизації
  }, [dispatch]);

  return (
    <div className={styles.root}
     style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h1>Знайди свою другу половинку</h1>
          <p>
            VoJeD - це найпопулярніший додаток для знайомств у світі. Створюйте
            нові зв'язки, зустрічайтеся з новими людьми та знаходьте кохання.
          </p>
        </div>
        <Link to={isAuthenticated ? "/anceta" : "/login"} className={styles.loginButton}>
          {isAuthenticated ? "До анкети" : "Увійти"}
        </Link>
      </div>
    </div>
  );
};
