import axios from "axios";

const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:8000/" : "https://api.izzicup.net/";

export const api = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" } }
);
