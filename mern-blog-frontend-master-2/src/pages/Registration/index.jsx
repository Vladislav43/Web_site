import React,{useEffect} from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { fetchRegister,fetchAuthMe } from './../../redux/slices/auth.js';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
export const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState(null);
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
        navigate('/');
      }
    } catch (error) {
      if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError('Невідома помилка');
      }
    }
  };
  // useEffect(() => {
  //   // Перевірка статусу авторизації при завантаженні компонента
  //   if (fetchAuthMe) {
  //     // Якщо користувач вже авторизувався, перенаправляємо його на головну сторінку
  //     navigate('/');
  //   }
  // }, [fetchAuthMe, navigate]);
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
              <Button type="submit" size="large" variant="contained" fullWidth >
          Зареєструватися
        </Button>
      </form>
    </Paper>
  );
};
