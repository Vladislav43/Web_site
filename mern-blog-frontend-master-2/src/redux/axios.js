import axios from "axios";

const token = window.localStorage.getItem('token');

const instance = axios.create({
  baseURL: "http://localhost:7300"
});
instance.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;

  }
  return config;
});


export default instance;
