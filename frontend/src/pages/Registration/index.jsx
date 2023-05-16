import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";

export const Registration = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
    defaultValues: {
      email: 'natalya12@test.ru', password: '123456', fullName: 'natalya23'
    }, mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))
    if (data?.payload?.token) {
      window.localStorage.setItem('token', data?.payload?.token)
    } else {
      alert('register has been failed')
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{root: styles.root}}>
      <Typography classes={{root: styles.title}} variant="h5">
        Create account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{width: 100, height: 100}}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          {...register('fullName', {required: 'set name'})}
          className={styles.field} label="Full name" fullWidth/>
        <TextField
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          {...register('email', {required: 'set email'})}
          className={styles.field} label="E-Mail" fullWidth/>
        <TextField
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          type="password"
          {...register('password', {required: 'set password'})}
          className={styles.field} label="password" fullWidth/>
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
