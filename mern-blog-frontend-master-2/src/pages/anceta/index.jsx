import React, { useEffect, useState } from "react";
import instance from "../../redux/axios";
import { FormControl, FormControlLabel, Radio, RadioGroup, Box, Button, Typography, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styles from './Anceta.module.scss';
import photo from './user-505.svg';

export const Anceta = ({ token }) => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [likedAnkets, setLikedAnkets] = useState([]);
  const [filters, setFilters] = useState({
    likes: '',
    dob_year: '',
    gender_identity: '',
    gender_interest: '',
    instagramUrl: '',
    telegramUrl: ''
  });

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await instance.get("http://localhost:7300/anceta", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchUsersData();
  }, [token]);

  const handleLike = async (userId, currentLikes) => {
    try {
      if (likedAnkets.includes(userId)) {
        return;
      }
      const updatedLikes = parseInt(currentLikes) + 1;
      await instance.post("http://localhost:7300/updateLikes", {
        userId,
        liked: true,
      });

      setLikedAnkets(prevState => [...prevState, userId]);
      setUsersData(prevState =>
        prevState.map(user =>
          user._id === userId ? { ...user, likes: updatedLikes } : user
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filterUsers = () => {
    return (usersData || []).filter(user => {
      if (filters.likes && filters.likes !== '' && (filters.likes === '0' && user.likes !== 0 || filters.likes === 'more' && user.likes <= 0)) {
        return false;
      }
      if (filters.dob_year && filters.dob_year !== '' && user.dob_year !== parseInt(filters.dob_year)) {
        return false;
      }
      if (filters.gender_identity && filters.gender_identity !== '' && user.gender_identity !== filters.gender_identity) {
        return false;
      }
      if (filters.gender_interest && filters.gender_interest !== '' && user.gender_interest !== filters.gender_interest) {
        return false;
      }
      if (filters.instagramUrl && filters.instagramUrl === '') {
        return false;
      }
      if (filters.telegramUrl && filters.telegramUrl === '') {
        return false;
      }
      return true;
    });
  };

  const generateYears = () => {
    const years = [];
    for (let year = 1950; year <= 2025; year++) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <Box p={4} sx={{ background: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" sx={{
        marginBottom: 3, fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#2d2d2d', fontSize: '32px'
      }}>
        Фільтрація користувачів
      </Typography>

      {/* Фільтрація всередині віконця */}
      <Box sx={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', marginBottom: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', fontSize: '16px' }}>Фільтрація</Typography>
        
        {/* Likes */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            Фільтр за лайками
          </Typography>
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              name="likes"
              value={filters.likes}
              onChange={handleFilterChange}
              row
            >
              <FormControlLabel value="0" control={<Radio />} label="0 лайків" />
              <FormControlLabel value="more" control={<Radio />} label="Більше 0 лайків" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* dob_year */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            Рік народження
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Рік народження</InputLabel>
            <Select
              label="Рік народження"
              name="dob_year"
              value={filters.dob_year}
              onChange={handleFilterChange}
              sx={{ backgroundColor: '#fff', color: '#333' }}
            >
              {generateYears().map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* gender_identity */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            Гендерна ідентичність
          </Typography>
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              name="gender_identity"
              value={filters.gender_identity}
              onChange={handleFilterChange}
              row
            >
              <FormControlLabel value="man" control={<Radio />} label="Чоловік" />
              <FormControlLabel value="woman" control={<Radio />} label="Жінка" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* gender_interest */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            Гендерні уподобання
          </Typography>
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              name="gender_interest"
              value={filters.gender_interest}
              onChange={handleFilterChange}
              row
            >
              <FormControlLabel value="man" control={<Radio />} label="Чоловіки" />
              <FormControlLabel value="woman" control={<Radio />} label="Жінки" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Кнопка для застосування фільтрів */}
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFilteredUsers(filterUsers() || [])}
            sx={{
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out',
              },
              background: '#4CAF50',
              padding: '10px 20px',
              fontWeight: 'bold',
            }}
          >
            Застосувати фільтри
          </Button>
        </Box>
      </Box>

      {/* Картки користувачів */}
      <Box sx={{ marginTop: 4 }}>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
          {filteredUsers
            .filter(user => user.about)
            .map((user, index) => (
              <Box key={index} sx={{
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#fff',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
                '&:active': { transform: 'scale(0.98)' },
                fontFamily: "'Roboto', sans-serif"
              }}>
                <img
                  src={user.url || photo}
                  alt="User"
                  width="100%"
                  height="auto"
                  style={{ borderRadius: '10px' }}
                />
                <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{user.fullname}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2, fontSize: '14px', color: '#666' }}>{user.about}</Typography>
                <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>Gender: {user.gender_identity}</Typography>
                <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>Interest: {user.gender_interest}</Typography>
                <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>DOB: {`0${user.dob_day}.0${user.dob_month}.${user.dob_year}`}</Typography>

                <Box display="flex" justifyContent="center" gap={2} sx={{ marginTop: 2 }}>
                  <Tooltip title={!user.telegramUrl ? "Користувач ще не надав інформації про Telegram" : ""}>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(user.telegramUrl, "_blank")}
                      disabled={!user.telegramUrl}
                    >
                      <TelegramIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={!user.instagramUrl ? "Користувач ще не надав інформації про Instagram" : ""}>
                    <IconButton
                      color="secondary"
                      onClick={() => window.open(user.instagramUrl, "_blank")}
                      disabled={!user.instagramUrl}
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    color="error"
                    onClick={() => handleLike(user._id, user.likes)}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
