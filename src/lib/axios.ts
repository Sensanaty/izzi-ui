import axios, { AxiosInstance } from "axios";

const $axios: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:8000/" : "https://api.invois.me/",
  headers: {
    "Content-Type": "application/json"
  }
});

export default $axios;
