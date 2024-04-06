import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.scss";
import instance from "../../redux/axios";

export const UserInfo = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get("http://localhost:7300/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserData(response.data.userData);
        console.log("Response data:", response.data);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className={styles.root}>
      <div>Email: {userData.email}</div>
      <img
        className={styles.avatar}
        src={userData.avatarUrl || "https://www.footaj.ru/assets/img/noavatar.png"}
        alt={userData.fullname}
      />
              <span className={styles.userName}>Дата приєднання : {userData.createdAt}</span>
      <div className={styles.userDetails}>
        <span className={styles.userName}>Full Name: {userData.fullname}</span>
        <span className={styles.additional}>{userData.additionalText}</span>
      </div>
    </div>
  );
};
