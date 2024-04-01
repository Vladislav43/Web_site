import React from "react";
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";

import { useNavigate } from "react-router-dom";


import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useDispatch,useSelector } from "react-redux";
import { fetchUserData, selectIsAuth } from "./../../redux/slices/auth.js";


export const Login = () => {
  const IsAuth=useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'lol52a3@3example.com',
      password: 'secur2233epa4ss',
    },
  });

  const onSubmit = (values) => {
    dispatch(fetchUserData(values))
  };

  console.log('IsAuth',IsAuth);

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід в обліковий запис
      </Typography>
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
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Вкажіть пароль' })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Увійти
        </Button>
      </form>
    </Paper>
  );
};