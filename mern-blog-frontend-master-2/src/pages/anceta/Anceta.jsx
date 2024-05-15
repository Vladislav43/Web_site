import React, { useEffect, useState } from "react";
import instance from "../../redux/axios";
import { Container } from "@mui/material";
import styles from './Anceta.module.scss';
import photo from'./user-505.svg'
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

  return (
    <Container max-width = '100%'>
      <div className={styles.ancetaContainer}>
        <div className={styles.ancetaGrid}>
          {usersData
            .filter(user => user.about)
            .map((user, index) =>
              console.log(user)|| (
              <div key={index} className={styles.ancetaCard}>
                <img
                  width={'100px'}
                  src={user.url||photo}
                  alt="User"
                  className={styles.ancetaImage}
                />
                <p><strong>Full name:</strong> {user.fullname}</p>
                <p><strong>About:</strong> {user.about}</p>
                <p><strong>Gender:</strong> {user.gender_identity}</p>
                <p><strong>Gender Interest:</strong> {user.gender_interest}</p>
                <p><strong>Date of Birth:</strong> {`0${user.dob_day}.0${user.dob_month}.${user.dob_year}`}</p>
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
};