import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';
import styles from "./Login.module.scss";

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };


  console.log(errors);

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
