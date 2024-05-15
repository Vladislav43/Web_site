import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import instance from './../axios.js';

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:7300/auth/login', params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const selectUserData = state => state.auth.userData;

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await instance.get('http://localhost:7300/auth/me');
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister',async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:7300/auth/register', params);

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  data: null,
  status: 'idle',
  authError: null,
  authloading : false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = 'idle';
      state.authError = null;
    },
  },
  extraReducers: {
    [fetchUserData.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
      state.authError = null;
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.authError = null;
    },
    [fetchUserData.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.authError = action.payload;
    },
    [fetchAuthMe.pending]: (state) => {
      state.authloading = true;
      state.status = 'loading';
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.authloading = false;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = 'failed';
      state.data = null;
      state.authloading = false;

    },
    [fetchRegister.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = 'failed';
      state.data = null;
    }
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectAuthError = (state) => state.auth.authError;
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
