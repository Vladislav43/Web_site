import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Avatar,
  Paper,
} from '@mui/material';
import usericon from './user-149.svg';

const OnBoarding = () => {
  const reader = new FileReader();
  const [cookies] = useCookies(null);
  const [formData, setFormData] = useState({
    user_id: cookies.user_id,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
    matches: [],
    telegramUrl: "",
    instagramUrl: ""
  });

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitted formData:', formData);

    try {
      const response = await axios.put('http://localhost:7300/updateUser', { ...formData });
      console.log('Response from server:', response);
      if (response.status === 200) navigate('/');
    } catch (error) {
      console.log('Error submitting data:', error);
    }
  };

  const handleChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const name = event.target.name;
    console.log('Change detected:', name, value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
        padding: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: 4,
          borderRadius: 6,
          backgroundColor: '#ffffff',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box textAlign="center" mb={4}>
          <Avatar
            src={formData.url || usericon}
            alt="Profile Preview"
            sx={{
              width: 100,
              height: 100,
              margin: '0 auto',
              border: '3px solid #ff5f6d',
            }}
          />
          <Typography variant="h4" fontWeight="bold" color="#ff5f6d" mt={2}>
            Create Your Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Let others know more about you!
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                  },
                }}
              />
            </Grid>

            {/* Birthday */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Birthday
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  label="Day"
                  type="number"
                  name="dob_day"
                  required
                  value={formData.dob_day}
                  onChange={handleChange}
                  sx={{
                    width: "30%",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '30px',
                    },
                  }}
                />
                <TextField
                  label="Month"
                  type="number"
                  name="dob_month"
                  required
                  value={formData.dob_month}
                  onChange={handleChange}
                  sx={{
                    width: "30%",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '30px',
                    },
                  }}
                />
                <TextField
                  label="Year"
                  type="number"
                  name="dob_year"
                  required
                  value={formData.dob_year}
                  onChange={handleChange}
                  sx={{
                    width: "40%",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '30px',
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Gender
              </Typography>
              <RadioGroup
                row
                name="gender_identity"
                value={formData.gender_identity}
                onChange={handleChange}
              >
                <FormControlLabel value="man" control={<Radio />} label="Man" />
                <FormControlLabel value="woman" control={<Radio />} label="Woman" />
                <FormControlLabel value="more" control={<Radio />} label="More" />
              </RadioGroup>
            </Grid>

            {/* Show Gender */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="show_gender"
                    checked={formData.show_gender}
                    onChange={handleChange}
                  />
                }
                label="Show Gender on my Profile"
              />
            </Grid>

            {/* Show Me */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Show Me
              </Typography>
              <RadioGroup
                row
                name="gender_interest"
                value={formData.gender_interest}
                onChange={handleChange}
              >
                <FormControlLabel value="man" control={<Radio />} label="Man" />
                <FormControlLabel value="woman" control={<Radio />} label="Woman" />
                <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
              </RadioGroup>
            </Grid>

            {/* Profile Photo */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Profile Photo
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: '0.3s ease-in-out',
                    },
                  }}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                      reader.onloadend = () => {
                        const base64String = btoa(reader.result);
                        setFormData({ ...formData, url: `data:image/jpeg;base64,${base64String}` });
                      };
                      reader.readAsBinaryString(e.target.files[0]);
                    }}
                  />
                </Button>
                <Avatar
                  src={formData.url || usericon}
                  alt="Profile Preview"
                  sx={{
                    width: 80,
                    height: 80,
                    border: '2px solid #ff5f6d',
                  }}
                />
              </Box>
            </Grid>

            {/* About Me */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About Me"
                name="about"
                required
                multiline
                rows={3}
                placeholder="I like long walks..."
                value={formData.about}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                  },
                }}
              />
            </Grid>

            {/* Telegram URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telegram URL"
                name="telegramUrl"
                placeholder="Enter Telegram link"
                value={formData.telegramUrl}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                  },
                }}
              />
            </Grid>

            {/* Instagram URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instagram URL"
                name="instagramUrl"
                placeholder="Enter Instagram link"
                value={formData.instagramUrl}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                  },
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: '0.3s ease-in-out',
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default OnBoarding;
