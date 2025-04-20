import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.scss";
import instance from "../../redux/axios";
import { Container, Box, Typography, Button, TextField, Avatar, CircularProgress, Grid, Paper } from "@mui/material";
import avatarImage from './../../../src/pages/OnBoarding/user-128-512.png';
import photoicon from './loading-7528_512.gif';
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../../redux/slices/auth";

export const UserInfo = ({ token }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState("");
  const [editedAbout, setEditedAbout] = useState("");
  const [editedGenderIdentity, setEditedGenderIdentity] = useState("");
  const [editedGenderInterest, setEditedGenderInterest] = useState("");
  const [editedDobDay, setEditedDobDay] = useState("");
  const [editedDobMonth, setEditedDobMonth] = useState("");
  const [editedDobYear, setEditedDobYear] = useState("");

  const userData = data?.userData;

  useEffect(() => {
    try {
      dispatch(fetchAuthMe());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFullName(userData.fullname);
    setEditedAbout(userData.about);
    setEditedGenderIdentity(userData.gender_identity);
    setEditedGenderInterest(userData.gender_interest);
    setEditedDobDay(userData.dob_day);
    setEditedDobMonth(userData.dob_month);
    setEditedDobYear(userData.dob_year);
  };

  const handleSaveChanges = async () => {
    try {
      await instance.put(
        "http://localhost:7300/auth/update",
        {
          fullname: editedFullName,
          about: editedAbout,
          gender_identity: editedGenderIdentity,
          gender_interest: editedGenderInterest,
          dob_day: editedDobDay,
          dob_month: editedDobMonth,
          dob_year: editedDobYear,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state with new data
      dispatch(fetchAuthMe());
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const getDisplayValue = (value) => {
    return value || "Відсутня інформація"; // Return "Відсутня інформація" if value is empty or undefined
  };

  if (!userData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ff5f6d, #ffc371)", // Gradient background for the entire page
          padding: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff5f6d, #ffc371)", // Gradient background for the entire page
        padding: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: "translateY(-2.3cm)", // Move the table up slightly
          borderRadius: 4,
          padding: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 6,
            backgroundColor: "#ffffff", // Remove gradient from the table
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={4}>
            <Avatar
              src={userData.url || avatarImage}
              alt={getDisplayValue(userData.fullname)}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: "3px solid #ff5f6d",
              }}
            />
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ff5f6d", textAlign: "center" }}>
              {getDisplayValue(userData.fullname)}
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {/* Full Name */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#ff5f6d", textAlign: "center" }} // Center text
                gutterBottom
              >
                Full Name
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedFullName}
                  onChange={(e) => setEditedFullName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#333", textAlign: "center" }}>
                  {getDisplayValue(userData.fullname)}
                </Typography>
              )}
            </Grid>

            {/* About */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#ffc371", textAlign: "center" }} // Center text
                gutterBottom
              >
                About
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedAbout}
                  onChange={(e) => setEditedAbout(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#333", textAlign: "center" }}>
                  {getDisplayValue(userData.about)}
                </Typography>
              )}
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#ff5f6d", textAlign: "center" }} // Center text
                gutterBottom
              >
                Gender
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedGenderIdentity}
                  onChange={(e) => setEditedGenderIdentity(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#333", textAlign: "center" }}>
                  {getDisplayValue(userData.gender_identity)}
                </Typography>
              )}
            </Grid>

            {/* Gender Interest */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#ffc371", textAlign: "center" }} // Center text
                gutterBottom
              >
                Gender Interest
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedGenderInterest}
                  onChange={(e) => setEditedGenderInterest(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#333", textAlign: "center" }}>
                  {getDisplayValue(userData.gender_interest)}
                </Typography>
              )}
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#ff5f6d", textAlign: "center" }} // Center text
                gutterBottom
              >
                Date of Birth
              </Typography>
              {isEditing ? (
                <Box display="flex" gap={1} justifyContent="center">
                  <TextField
                    value={editedDobDay}
                    onChange={(e) => setEditedDobDay(e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Day"
                    sx={{
                      width: "30%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                    }}
                  />
                  <TextField
                    value={editedDobMonth}
                    onChange={(e) => setEditedDobMonth(e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Month"
                    sx={{
                      width: "30%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                    }}
                  />
                  <TextField
                    value={editedDobYear}
                    onChange={(e) => setEditedDobYear(e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Year"
                    sx={{
                      width: "40%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body1" sx={{ color: "#333", textAlign: "center" }}>
                  {userData.dob_day && userData.dob_month && userData.dob_year
                    ? `0${userData.dob_day}.0${userData.dob_month}.${userData.dob_year}`
                    : "Відсутня інформація"}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
