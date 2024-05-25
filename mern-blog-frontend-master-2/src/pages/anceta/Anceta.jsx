import React, { useEffect, useState } from "react";
import instance from "../../redux/axios";
import { Container, IconButton, Tooltip } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite'; // імпортуємо іконку сердечка
import styles from './Anceta.module.scss';
import photo from './user-505.svg';

export const Anceta = ({ token }) => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await instance.get("http://localhost:7300/anceta", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(response.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchUsersData();
  }, [token]);

  const handleLike = async (userId, currentLikes) => {
    try {
      // Перетворюємо поточну кількість лайків на число і додаємо 1
      const updatedLikes = parseInt(currentLikes, 10) + 1;
      await instance.post("http://localhost:7300/updateLikes", {
        userId,
        likes: updatedLikes,
      });
      setUsersData(prevState =>
        prevState.map(user =>
          user._id === userId ? { ...user, likes: updatedLikes } : user
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };
  

  return (
    <Container>
      <div className={styles.ancetaContainer}>
        <div className={styles.ancetaGrid}>
          {usersData
            .filter(user => user.about)
            .map((user, index) => (
              <div key={index} className={styles.ancetaCard}>
                <img
                  width={'100px'}
                  src={user.url || photo}
                  alt="User"
                  className={styles.ancetaImage}
                />
                <p><strong>Full name:</strong> {user.fullname}</p>
                <p><strong>About:</strong> {user.about}</p>
                <p><strong>Gender:</strong> {user.gender_identity}</p>
                <p><strong>Gender Interest:</strong> {user.gender_interest}</p>
                <p><strong>Date of Birth:</strong> {`0${user.dob_day}.0${user.dob_month}.${user.dob_year}`}</p>
                <div className={styles.buttonContainer}>
                  <Tooltip title={!user.telegramUrl ? "Користувач ще не надав інформації про Telegram" : ""}>
                    <span>
                      <IconButton 
                        color="primary" 
                        onClick={() => window.open(user.telegramUrl, "_blank")}
                        disabled={!user.telegramUrl}
                      >
                        <TelegramIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={!user.instagramUrl ? "Користувач ще не надав інформації про Instagram" : ""}>
                    <span>
                      <IconButton 
                        color="secondary" 
                        onClick={() => window.open(user.instagramUrl, "_blank")}
                        disabled={!user.instagramUrl}
                      >
                        <InstagramIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <div className={styles.likeContainer}>
                    <IconButton 
                      color="error" 
                      onClick={() => handleLike(user._id, user.likes)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <span>{user.likes}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
};
