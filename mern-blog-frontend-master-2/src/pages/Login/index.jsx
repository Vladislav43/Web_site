import React from 'react';
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { fetchUserData } from "./../../redux/slices/auth.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

export const Login = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['user_id', 'token']);
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const data = await dispatch(fetchUserData(values)).unwrap();
      setAuthError(null);
      setCookie('token', data.token);
      setCookie('user_id', data._id);
      window.localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      setAuthError(error.message || 'Невідома помилка');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={styles.root}
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
          transform: 'translateY(-1cm)', // Move text up by 2cm
        }}
      >
        Вхід в обліковий запис
      </Typography>
      {authError && (
        <div
          style={{
            background: '#ff5f6d',
            color: '#ff5f6d',
            padding: '10px',
            borderRadius: '1440px',
            marginBottom: '20px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <Typography variant="body1">{authError}</Typography>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: '100%',
          maxWidth: '700px', // Expand form width by 10cm (from 400px to 600px)
        }}
      >
        <TextField
          label="Електронна пошта"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Вкажіть пошту' })}
          fullWidth
          style={{
            marginBottom: '50px',
            background: 'rgba(255, 255, 255, 0.2)', // Transparent background
            borderRadius: '30px',
          }}
          InputProps={{
            style: {
              borderRadius: '30px',
              color: '#fff', // White text
            },
          }}
          InputLabelProps={{
            style: {
              color: '#fff', // White label
            },
          }}
        />
        <TextField
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Вкажіть пароль' })}
          fullWidth
          style={{
            marginBottom: '50px',
            background: 'rgba(133, 54, 54, 0.2)', // Transparent background
            borderRadius: '30px',
          }}
          InputProps={{
            endAdornment: (
              <Button onClick={togglePasswordVisibility} variant="text" size="small" style={{ color: '#fff' }}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </Button>
            ),
            style: {
              borderRadius: '30px',
              color: '#fff', // White text
            },
          }}
          InputLabelProps={{
            style: {
              color: '#fff', // White label
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
          Увійти
        </Button>
      </form>
    </div>
  );
};