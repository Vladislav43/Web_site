import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { fetchRegister, fetchUserData } from './../../redux/slices/auth.js';
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

  const onSubmit = async (values) => {
    try {
      const response = await dispatch(fetchRegister(values));
      const data = response.payload;
      if ('errors' in data) {
        setAuthError(data.errors.join(', '));
      } else if ('token' in data) {
        window.localStorage.setItem('token', data.token);
        setCookie('user_id', data.user_id, { path: '/' });
        navigate('/');
      }
    } catch (error) {
      setAuthError(error.message || 'Невідома помилка');
    }
    const data = await dispatch(fetchUserData(values));
    setCookie('token', data.payload.token);
    setCookie('user_id', data.payload._id);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
        padding: '20px',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        style={{
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#fff',
        }}
      >
        Створення облікового запису
      </Typography>
      {authError && (
        <div
          style={{
            background: '#ff5f6d',
            color: '#fff',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <Typography variant="body1">{authError}</Typography>
        </div>
      )}
      <Avatar
        sx={{
          width: 100,
          height: 100,
          marginBottom: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <TextField
          label="Повне ім'я"
          fullWidth
          {...register('fullname', { required: 'Вкажіть повне ім\'я' })}
          error={Boolean(errors.fullname)}
          helperText={errors.fullname?.message}
          style={{
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
          }}
          InputProps={{
            style: {
              borderRadius: '30px',
              color: '#fff',
            },
          }}
          InputLabelProps={{
            style: {
              color: '#fff',
            },
          }}
        />
        <TextField
          label="Електронна пошта"
          fullWidth
          {...register('email', { required: 'Вкажіть пошту' })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          style={{
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
          }}
          InputProps={{
            style: {
              borderRadius: '30px',
              color: '#fff',
            },
          }}
          InputLabelProps={{
            style: {
              color: '#fff',
            },
          }}
        />
        <TextField
          label="Пароль"
          fullWidth
          type="password"
          {...register('password', { required: 'Вкажіть пароль' })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          style={{
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
          }}
          InputProps={{
            style: {
              borderRadius: '30px',
              color: '#fff',
            },
          }}
          InputLabelProps={{
            style: {
              color: '#fff',
            },
          }}
        />
        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
          style={{
            background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '30px',
            padding: '15px',
            textTransform: 'none',
            fontSize: '18px',
          }}
        >
          Зареєструватися
        </Button>
      </form>
    </div>
  );
};