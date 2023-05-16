import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";


import styles from "./Login.module.scss";
import {fetchUserData, selectIsAuth} from "../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";


export const Login = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
    defaultValues: {
      email: 'test@test.ru', password: '12345'
    }, mode: 'onChange'
  })


  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values))
    if (data?.payload?.token) {
      window.localStorage.setItem('token', data?.payload?.token)
    } else {
      alert('login has been failed')
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (<Paper classes={{root: styles.root}}>
    <Typography classes={{root: styles.title}} variant="h5">
      Login
    </Typography>
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        label="E-Mail"
        error={!!errors.email?.message}
        helperText={errors.email?.message}
        {...register('email', {required: 'set email'})}

        fullWidth
        type="email"
      />
      <TextField
        type="password"
        className={styles.field}
        label="Password" fullWidth
        helperText={errors.password?.message}
        error={!!errors.password?.message}
        {...register('password', {required: 'set password'})}
      />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Login
      </Button>
    </form>
  </Paper>);
};
