import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.scss";
import instance from "../../redux/axios";
import { Container } from "@mui/material";
import avatarImage from './../../../src/pages/OnBoarding/user-128-512.png'
import photoicon from './loading-7528_512.gif'
export const UserInfo = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedFullName, setEditedFullName] = useState("");

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

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedEmail(userData.email);
    setEditedFullName(userData.fullname);
  };

  const handleSaveChanges = async () => {
    try {
      await instance.put(
        "http://localhost:7300/auth/update",
        {
          email: editedEmail,
          password: editedPassword,
          fullname: editedFullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData({
        ...userData,
        email: editedEmail,
        fullname: editedFullName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (!userData) {
    return <div className={styles.Loading}>
      <img src={photoicon} alt="" />
    </div>;
  }

  return (
    <Container>
      <div className={styles.Info}>
    <div className={styles.root}>
      <div className={styles.userInfo}>
        <img src={userData.url}
          className={styles.avatar}
          alt={userData.fullname}
        />
        <div className={styles.details}>
          <div className={styles.field}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>
              {isEditing ? (
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className={styles.input}
                />
              ) : (
                userData.email
              )}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>About:</span>
            <span className={styles.value}>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                />
              ) : (
                userData.about
              )}
            </span>
          </div>


          <div className={styles.field}>
            <span className={styles.label}>Gender:</span>
            <span className={styles.value}>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                />
              ) : (
                userData.gender_identity
              )}
            </span>
          </div>



          <div className={styles.field}>
            <span className={styles.label}>Gender_interest:</span>
            <span className={styles.value}>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                />
              ) : (
                userData.gender_interest
              )}
            </span>
          </div>

          <div className={styles.field}>
    <span className={styles.label}>Data Birthday:</span>
    <span className={styles.value}> 
        {isEditing ? (
            <input
                type="text"
                className={styles.input}
            />
        ) : (
            `0${userData.dob_day}.0${userData.dob_month}.${userData.dob_year}`
                  )}
              </span>
          </div>
          </div>
          </div>
          </div>
          </div>
    </Container>
  );
};
