import axios from "axios";

const api = axios.create({
  baseURL: "https://gonggumoa.o-r.kr",
  withCredentials: true,
});

const getAT = () => localStorage.getItem("accessToken");
const getRT = () => localStorage.getItem("refreshToken");

api.interceptors.request.use((config) => {
  const at = getAT();
  if (at) {
    config.headers.Authorization = `Bearer ${at}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

let isRefreshing = false;
let waiters: Array<(t: string) => void> = [];
const notify = (t: string) => { waiters.forEach(w => w(t)); waiters = []; };

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as typeof err.config & { _retry?: boolean };

    // 401이고, /api/users/login 자체에 대한 응답이 아니며, 아직 재시도 안 했을 때만
    if (err.response?.status === 401 && !original._retry && !original.url?.includes("/api/users/login")) {
      original._retry = true;

      if (isRefreshing) {
        const newAT = await new Promise<string>((r) => waiters.push(r));
        original.headers = { ...original.headers, Authorization: `Bearer ${newAT}` };
        return api(original);
      }

      try {
        isRefreshing = true;
        const rt = getRT();
        if (!rt) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }

        // “로그인2” : refreshToken으로 동일 로그인 엔드포인트 호출
        const { data } = await api.post("/api/users/login", { identifier: rt });
        

        localStorage.setItem("accessToken", data.data.accessToken);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);

        notify(data.data.accessToken);

        original.headers = { ...original.headers, Authorization: `Bearer ${data.data.accessToken}` };
        return api(original);
      } catch (e) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
