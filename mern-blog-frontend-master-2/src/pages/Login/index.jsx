import React from "react";
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, selectIsAuth, selectAuthError } from "./../../redux/slices/auth.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";

export const Login = () => {
  //const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false); // Доданий стан для відстеження показу пароля

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await dispatch(fetchUserData(values)).unwrap();
      setAuthError(null);
      navigate('/'); 
    } catch (error) {
      if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError('Невідома помилка');
      }
    }
    const data = await dispatch(fetchUserData(values))
    if ('token' in data.payload){
      window.localStorage.setItem('token',data.payload.token)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід в обліковий запис
      </Typography>
      {authError && (
        <div className={styles.alert}>
          <Typography variant="body1">{authError}</Typography>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Електронна пошта"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Вкажіть пошту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type={showPassword ? 'text' : 'password'} 
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Вкажіть пароль' })}
          fullWidth
          InputProps={{
            endAdornment: (
              <Button onClick={togglePasswordVisibility} variant="text" size="small">
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </Button>
            ),
          }}
        />
        <Button type="submit" size="large" variant="contained" fullWidthn>
          Увійти
        </Button>
      </form>
    </Paper>
  );
};
