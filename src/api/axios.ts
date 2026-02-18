// src/api/axios.ts
import axios from 'axios';
// const BASE_URL = "http://localhost:8080/api";
// export const SOCKET_URL = "http://localhost:8080";

//  const BASE_URL = "https://45.159.223.118:8443";
// export const MEETING_URL = "https://lmsapi.duckdns.org/join";
//  const BASE_URL = "https://lmsapi.duckdns.org/api";
// export const SOCKET_URL = "https://lmsapi.duckdns.org";

const BASE_URL = 'http://62.171.177.9:8080/api';
export const SOCKET_URL = 'http://62.171.177.9:8080';
export const MEETING_URL = 'http://62.171.177.9:8080/join';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
