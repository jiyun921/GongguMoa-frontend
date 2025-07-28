import axios from "axios";

const api = axios.create({
  baseURL: "https://gonggumoa.o-r.kr",
  withCredentials: true,
});

export default api;
