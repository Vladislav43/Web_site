import React from 'react';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h1>Знайди свою другу половинку</h1>
          <p>
            Tinder - це найпопулярніший додаток для знайомств у світі. Створюйте
            нові зв'язки, зустрічайтеся з новими людьми та знаходьте кохання.
          </p>
        </div>
        <Link to="/login" className={styles.loginButton}>
          Увійти
        </Link>
      </div>
    </div>
  );
};