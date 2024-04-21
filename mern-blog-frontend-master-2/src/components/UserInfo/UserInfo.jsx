import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.scss";
import instance from "../../redux/axios";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className={styles.root}>
      <div>
        Email:{" "}
        {isEditing ? (
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        ) : (
          userData.email
        )}
      </div>
      <img
        className={styles.avatar}
        src={userData.avatarUrl || "https://www.seekpng.com/ima/u2e6y3e6q8r5q8a9/"}
        alt={userData.fullname}
      />
      <span className={styles.userName}>
        Дата приєднання : {userData.createdAt}
      </span>
      <div className={styles.userDetails}>
        <span className={styles.userName}>
          Full Name:{" "}
          {isEditing ? (
            <input
              type="text"
              value={editedFullName}
              onChange={(e) => setEditedFullName(e.target.value)}
            />
          ) : (
            userData.fullname
          )}
        </span>
        <span className={styles.additional}>{userData.additionalText}</span>
      </div>
      {isEditing ? (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
          />
          <button onClick={handleSaveChanges}>Save Changes</button>
        </>
      ) : (
        <button onClick={handleEditClick}>Edit Profile</button>
      )}
    </div>
  );
};