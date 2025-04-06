import React, { useEffect, useState } from "react";
import instance from "../../redux/axios";
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Box, Button, Typography,InputLabel,Select, MenuItem } from '@mui/material';

import { Container, IconButton, Tooltip } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite'; // імпортуємо іконку сердечка
import styles from './Anceta.module.scss';
import photo from './user-505.svg';
export const Anceta = ({ token }) => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([])
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
        setFilteredUsers(response.data)
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchUsersData();
  }, [token]);

  const handleLike = async (userId, currentLikes) => {
    try {
      // Перевіряємо, чи лайкнув користувач цю анкету раніше
      if (likedAnkets.includes(userId)) {
        return; // Якщо так, виходимо з функції
      }

      const updatedLikes = parseInt(currentLikes) + 1;
      await instance.post("http://localhost:7300/updateLikes", {
        userId,
        liked: true,
      });
      
      // Додаємо ID анкети до списку лайкнутих анкет
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
console.log(usersData);
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prevFilters) => ({
    ...prevFilters,
    [name]: value
  }));
};

// Функція для фільтрації користувачів
const filterUsers = () => {
  return (usersData||[]).filter(user => {
    // Фільтрація по likes
    if (filters.likes && filters.likes !== '' && (filters.likes === '0' && user.likes !== 0 || filters.likes === 'more' && user.likes <= 0)) {
      return false;
    }

    // Фільтрація по dob_year
    if (filters.dob_year && filters.dob_year !== '' && user.dob_year !== parseInt(filters.dob_year)) {
      return false;
    }

    // Фільтрація по gender_identity
    if (filters.gender_identity && filters.gender_identity !== '' && user.gender_identity !== filters.gender_identity) {
      return false;
    }

    // Фільтрація по gender_interest
    if (filters.gender_interest && filters.gender_interest !== '' && user.gender_interest !== filters.gender_interest) {
      return false;
    }

    // Фільтрація по instagramUrl
    if (filters.instagramUrl && filters.instagramUrl === '' ) {
      return false;
    }

    // Фільтрація по telegramUrl
    if (filters.telegramUrl && filters.telegramUrl === '' ) {
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

useEffect(() => {document.body.style.overflow = 'auto'}, [])

  return (
    <Container>
       <h2>Фільтрація користувачів</h2>
       <form>
        {/* Likes */}
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

        {/* dob_year */}
        {/* <FormControl fullWidth margin="normal">
          <TextField
            label="Рік народження"
            name="dob_year"
            type="number"
            sx={{background: 'white'}}
            value={filters.dob_year}
            onChange={handleFilterChange}
            placeholder="Введіть рік"
            fullWidth
          />
        </FormControl> */}
<FormControl fullWidth margin="normal">
          <InputLabel>Рік народження</InputLabel>
          <Select
            label="Рік народження"
            name="dob_year"
            value={filters.dob_year}
            onChange={handleFilterChange}
            sx={{ backgroundColor: 'white' }}
          >
            {generateYears().map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* gender_identity */}
        <FormControl component="fieldset" margin="normal">
          <Typography variant="body1">Гендерна ідентичність:</Typography>
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

        {/* gender_interest */}
        <FormControl component="fieldset" margin="normal">
          <Typography variant="body1">Гендерні уподобання:</Typography>
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

        {/* Кнопка для застосування фільтрів */}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => {
            setFilteredUsers(filterUsers() || [])
          }}>
            Застосувати фільтри
          </Button>
        </Box>
      </form>

{/* <form>
  <div>
    <label>Likes:</label>
    <input type="radio" name="likes" value="0" checked={filters.likes === '0'} onChange={handleFilterChange} /> 0 лайків
    <input type="radio" name="likes" value="more" checked={filters.likes === 'more'} onChange={handleFilterChange} /> Більше 0 лайків
  </div>

  <div>
    <label>Рік народження:</label>
    <input type="number" name="dob_year" value={filters.dob_year} onChange={handleFilterChange} placeholder="Введіть рік" />
  </div>

  <div>
    <label>Гендерна ідентичність:</label>
    <input type="radio" name="gender_identity" value="man" checked={filters.gender_identity === 'man'} onChange={handleFilterChange} /> Чоловік
    <input type="radio" name="gender_identity" value="woman" checked={filters.gender_identity === 'woman'} onChange={handleFilterChange} /> Жінка
  </div>

  <div>
    <label>Гендерні уподобання:</label>
    <input type="radio" name="gender_interest" value="man" checked={filters.gender_interest === 'man'} onChange={handleFilterChange} /> Чоловіки
    <input type="radio" name="gender_interest" value="woman" checked={filters.gender_interest === 'woman'} onChange={handleFilterChange} /> Жінки
  </div>


</form> */}
      <div className={styles.ancetaContainer}>
        <div className={styles.ancetaGrid}>
          {filteredUsers
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
