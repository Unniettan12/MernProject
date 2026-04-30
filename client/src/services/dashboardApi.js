import axios from "axios";

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const auth = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

const dashboard = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/dashboard`,
  withCredentials: true,
});

dashboard.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error?.response?.data?.code;

    if (code === "INVALID_TOKEN" || code === "NO_TOKEN") {
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

auth.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      //   localStorage.removeItem("token");
      // onUnauthorized();
    }
    return Promise.reject(err);
  },
);
export default auth;
