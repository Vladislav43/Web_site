import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { fetchRegister,fetchUserData } from './../../redux/slices/auth.js';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const Registration = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['user_id', 'token']);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
  });

  // Use useCookies hook to access cookies and setCookie function

  const onSubmit = async (values) => {
    try {
      const response = await dispatch(fetchRegister(values));
      const data = response.payload;
      // const data2 = await dispatch(fetchUserData(values))
      // setCookie('token', data2.payload.token)
      // setCookie('user_id',data2.payload._id)
      if ('errors' in data) {
        setAuthError(data.errors.join(', '));
      } else if ('token' in data) {
        window.localStorage.setItem('token', data.token);
        
        // Save user_id in a cookie
        setCookie('user_id', data.user_id, { path: '/' }); // Example: Set cookie with path '/'

        navigate('/');
      }
    } catch (error) {
      if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError('Невідома помилка');
      }
    }
    const data = await dispatch(fetchUserData(values))
    setCookie('token', data.payload.token)
    setCookie('user_id',data.payload._id)
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення облікового запису
      </Typography>
      {authError && (
        <div className={`${styles.alert} ${styles.errorAlert}`}>
          <Typography variant="body1">{authError}</Typography>
        </div>
      )}

      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Повне ім'я"
          fullWidth
          {...register('fullname', { required: 'Вкажіть повне ім\'я' })}
          error={Boolean(errors.fullname)}
          helperText={errors.fullname?.message}
        />
        <TextField
          className={styles.field}
          label="Електронна пошта"
          fullWidth
          {...register('email', { required: 'Вкажіть пошту' })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          type="password"
          {...register('password', { required: 'Вкажіть пароль' })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зареєструватися
        </Button>
      </form>
    </Paper>
  );
};