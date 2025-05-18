import React, { useEffect, useState } from "react";
import instance from "../../redux/axios";
import { FormControl, FormControlLabel, Radio, RadioGroup, Box, Button, Typography, InputLabel, Select, MenuItem, IconButton, Tooltip, Collapse, Switch, Slider, Fade } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WcIcon from '@mui/icons-material/Wc';
import InterestsIcon from '@mui/icons-material/Interests';
import CakeIcon from '@mui/icons-material/Cake';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Pagination from '@mui/material/Pagination';
import { keyframes } from '@mui/system';
import styles from './Anceta.module.scss';
import photo from './user-505.svg';



export const Anceta = ({ token }) => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [likedAnkets, setLikedAnkets] = useState({});
  const [filters, setFilters] = useState({
    likes: '',
    dob_year: '',
    gender_identity: '',
    gender_interest: '',
    instagramUrl: '',
    telegramUrl: ''
  });
  const [dobYearRange, setDobYearRange] = useState([1960, 2025]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const usersPerPage = 9;

  const fetchUsersData = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get("http://localhost:7300/anceta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsersData(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [token]);

  useEffect(() => {
    const stored = localStorage.getItem("likedAnkets");
    setLikedAnkets(stored ? JSON.parse(stored) : {});
  }, []);

  useEffect(() => {
    localStorage.setItem("likedAnkets", JSON.stringify(likedAnkets));
  }, [likedAnkets]);

  const handleLike = async (userId) => {
    const isLiked = likedAnkets[userId];
    setLikedAnkets(prev => ({
      ...prev,
      [userId]: !isLiked
    }));

    setUsersData(prev =>
      prev.map(user =>
        user._id === userId
          ? { ...user, likes: user.likes + (isLiked ? -1 : 1) }
          : user
      )
    );
    setFilteredUsers(prev =>
      prev.map(user =>
        user._id === userId
          ? { ...user, likes: user.likes + (isLiked ? -1 : 1) }
          : user
      )
    );

    try {
      await instance.post("http://localhost:7300/updateLikes", {
        userId,
        liked: !isLiked,
      });
    } catch (error) {
      setLikedAnkets(prev => ({
        ...prev,
        [userId]: isLiked
      }));
      setUsersData(prev =>
        prev.map(user =>
          user._id === userId
            ? { ...user, likes: user.likes + (isLiked ? 1 : -1) }
            : user
        )
      );
      setFilteredUsers(prev =>
        prev.map(user =>
          user._id === userId
            ? { ...user, likes: user.likes + (isLiked ? 1 : -1) }
            : user
        )
      );
      console.error("Error updating likes:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      likes: '',
      dob_year: '',
      gender_identity: '',
      gender_interest: '',
      instagramUrl: '',
      telegramUrl: ''
    });
    setDobYearRange([1960, 2025]);
    setFilteredUsers(usersData);
  };

  const handleDobYearSlider = (event, newValue) => {
    setDobYearRange(newValue);
    setFilters(prev => ({
      ...prev,
      dob_year: ''
    }));
  };

  const filterUsers = () => {
    return usersData.filter(user => {
      if (filters.likes && filters.likes !== '' && (filters.likes === '0' && user.likes !== 0 || filters.likes === 'more' && user.likes <= 0)) {
        return false;
      }
      if (filters.dob_year && filters.dob_year !== '' && user.dob_year !== parseInt(filters.dob_year)) {
        return false;
      }
      if (!filters.dob_year && (user.dob_year < dobYearRange[0] || user.dob_year > dobYearRange[1])) {
        return false;
      }
      if (filters.gender_identity && filters.gender_identity !== '' && user.gender_identity !== filters.gender_identity) {
        return false;
      }
      if (filters.gender_interest && filters.gender_interest !== '' && user.gender_interest !== filters.gender_interest) {
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const paginatedUsers = filteredUsers
    .filter(user => user.about)
    .slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
        padding: 4,
      }}
    >
      {/* Персональний пошук партнера - стильна табличка з фільтрами */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          mb: 4,
          borderRadius: '18px',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
          background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: { xs: 2, md: 5 },
          py: { xs: 3, md: 3 },
          gap: 2,
          border: '2px solid #ff5f6d',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterAltIcon sx={{ fontSize: 40, color: '#ff5f6d' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#ff5f6d',
                fontFamily: "'Montserrat', 'Roboto', sans-serif",
                letterSpacing: 1,
                textShadow: '0 2px 8px #ffc37155',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Персональний пошук партнера
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#444',
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.15rem' },
              maxWidth: 500,
              textAlign: { xs: 'left', md: 'left' },
              opacity: 0.85,
              mt: 1,
            }}
          >
            Обирай ідеального співрозмовника за допомогою сучасних фільтрів. Знайди свою людину серед анкет нижче!
          </Typography>
        </Box>
        {/* Фільтри прямо в табличці */}
        <Box sx={{
          flex: 2,
          minWidth: 320,
          width: '100%',
          maxWidth: 600,
          ml: { md: 4 },
          mt: { xs: 3, md: 0 },
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '14px',
          boxShadow: '0 2px 12px 0 rgba(255,95,109,0.08)',
          p: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {/* Likes Switch */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThumbUpAltIcon sx={{ color: '#e53935', fontSize: 28 }} />
            <Typography sx={{ fontWeight: 500, color: '#444', fontSize: '16px', mr: 2 }}>
              Тільки з лайками
            </Typography>
            <Switch
              checked={filters.likes === 'more'}
              onChange={e => setFilters(prev => ({
                ...prev,
                likes: e.target.checked ? 'more' : ''
              }))}
              color="success"
              sx={{
                '& .MuiSwitch-thumb': { background: '#e53935' },
                '& .MuiSwitch-track': { background: '#ffc371' }
              }}
            />
            <Typography sx={{ fontWeight: 500, color: '#444', fontSize: '16px', ml: 2 }}>
              Тільки без лайків
            </Typography>
            <Switch
              checked={filters.likes === '0'}
              onChange={e => setFilters(prev => ({
                ...prev,
                likes: e.target.checked ? '0' : ''
              }))}
              color="warning"
              sx={{
                '& .MuiSwitch-thumb': { background: '#bdbdbd' },
                '& .MuiSwitch-track': { background: '#ff5f6d' }
              }}
            />
          </Box>
          {/* DOB Year Range Slider */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <CakeIcon sx={{ color: '#ff9800', fontSize: 26 }} />
              <Typography sx={{ fontWeight: 500, color: '#444', fontSize: '16px' }}>
                Рік народження: <b style={{ color: '#4CAF50' }}>{dobYearRange[0]}</b> — <b style={{ color: '#4CAF50' }}>{dobYearRange[1]}</b>
              </Typography>
            </Box>
            <Slider
              value={dobYearRange}
              onChange={handleDobYearSlider}
              min={1960}
              max={2025}
              step={1}
              marks={[
                { value: 1960, label: '1960' },
                { value: 2025, label: '2025' }
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                height: 8,
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  border: '2px solid #4CAF50',
                  boxShadow: '0 2px 8px rgba(76,175,80,0.2)',
                  transition: '0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(76,175,80,0.3)' },
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: '#bdbdbd',
                },
              }}
            />
          </Box>
          {/* Gender Identity */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <WcIcon sx={{ color: '#1976d2', fontSize: 26 }} />
              <Typography sx={{ fontWeight: 500, color: '#444', fontSize: '16px' }}>
                Гендерна ідентичність
              </Typography>
            </Box>
            <RadioGroup
              name="gender_identity"
              value={filters.gender_identity}
              onChange={handleFilterChange}
              row
            >
              <FormControlLabel value="man" control={<Radio sx={{
                color: '#1976d2',
                '&.Mui-checked': { color: '#1976d2' }
              }} />} label="Чоловік" />
              <FormControlLabel value="woman" control={<Radio sx={{
                color: '#e91e63',
                '&.Mui-checked': { color: '#e91e63' }
              }} />} label="Жінка" />
            </RadioGroup>
          </Box>
          {/* Gender Interest */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <InterestsIcon sx={{ color: '#ff9800', fontSize: 26 }} />
              <Typography sx={{ fontWeight: 500, color: '#444', fontSize: '16px' }}>
                Гендерні уподобання
              </Typography>
            </Box>
            <RadioGroup
              name="gender_interest"
              value={filters.gender_interest}
              onChange={handleFilterChange}
              row
            >
              <FormControlLabel value="man" control={<Radio sx={{
                color: '#1976d2',
                '&.Mui-checked': { color: '#1976d2' }
              }} />} label="Чоловіки" />
              <FormControlLabel value="woman" control={<Radio sx={{
                color: '#e91e63',
                '&.Mui-checked': { color: '#e91e63' }
              }} />} label="Жінки" />
            </RadioGroup>
          </Box>
          {/* Filter Buttons */}
          <Box mt={1} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFilteredUsers(filterUsers() || [])}
              sx={{
                '&:hover': {
                  transform: 'scale(1.07)',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                },
                background: 'linear-gradient(135deg, #4CAF50, #81C784)',
                padding: '8px 22px',
                fontWeight: 'bold',
                fontSize: '15px',
                borderRadius: '30px',
                boxShadow: '0 2px 10px 0 rgba(76,175,80,0.15)',
                transition: 'all 0.3s cubic-bezier(.47,1.64,.41,.8)',
              }}
            >
              Застосувати фільтри
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetFilters}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                  color: '#fff',
                  borderColor: '#ff5f6d',
                  transform: 'scale(1.07)',
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                },
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '15px',
                borderColor: '#ff5f6d',
                color: '#ff5f6d',
                padding: '8px 22px',
                transition: 'all 0.3s cubic-bezier(.47,1.64,.41,.8)',
              }}
            >
              Скинути фільтри
            </Button>
          </Box>
        </Box>
      </Box>



      <Box sx={{ marginTop: 0, width: '100%', maxWidth: '1200px' }}>
        {isLoading ? (
          <Typography align="center" sx={{ fontSize: '18px', color: '#ffffff' }}>Loading...</Typography>
        ) : (
          <>
            <Box 
              display="grid" 
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
              gap={3}
            >
              {paginatedUsers.map((user, index) => (
                <Box key={index} sx={{
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:active': { transform: 'scale(0.98)' },
                  fontFamily: "'Roboto', sans-serif",
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}>
                  <img
                    src={user.url || photo}
                    alt="User"
                    width="100%"
                    height="40%"
                    style={{ borderRadius: '10px', objectFit: 'cover', maxHeight: '275px'}}
                  />
                  <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{user.fullname}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2, fontSize: '14px', color: '#666' }}>{user.about}</Typography>
                  <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>Gender: {user.gender_identity}</Typography>
                  <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>Interest: {user.gender_interest}</Typography>
                  <Typography variant="body2" color="textPrimary" sx={{ fontSize: '14px', color: '#444' }}>DOB: {`0${user.dob_day}.0${user.dob_month}.${user.dob_year}`}</Typography>

                  <Box display="flex" justifyContent="center" gap={2} sx={{ marginTop: 'auto' , alignItems:'center'}}>
                    <Tooltip title={!user.telegramUrl ? "No Telegram info provided" : ""}>
                      <IconButton
                        color="primary"
                        onClick={() => window.open(user.telegramUrl, "_blank")}
                        disabled={!user.telegramUrl}
                      >
                        <TelegramIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={!user.instagramUrl ? "No Instagram info provided" : ""}>
                      <IconButton
                        color="secondary"
                        onClick={() => window.open(user.instagramUrl, "_blank")}
                        disabled={!user.instagramUrl}
                      >
                        <InstagramIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={() => handleLike(user._id)}
                      sx={{
                        color: likedAnkets[user._id] ? '#e53935' : '#bdbdbd',
                        transition: 'color 0.2s'
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <Typography variant="body" color="textPrimary" sx={{ color: '#444' }}>{user.likes}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" mt={4} gap={1}>
              {/* Анімоване сердечко між сторінками */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#ff5f6d', fontSize: 18, mr: 1 }}>
                  {page > 1 ? `Сторінка ${page - 1}` : ''}
                </Typography>
               

              </Box>
              <Pagination
                count={Math.ceil(filteredUsers.filter(user => user.about).length / usersPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    fontSize: '1.1rem',
                  }
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
