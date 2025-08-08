import axios from "axios";
import {useAuthStore} from "../stores/auth";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                const success = await authStore.refreshToken();
                isRefreshing = false;
                pendingRequests.forEach((cb) => cb());
                pendingRequests = [];
                if (success) {
                    return api(originalRequest);
                }
            } else {
                return new Promise((resolve) => {
                    pendingRequests.push(() => resolve(api(originalRequest)));
                });
            }
        }

        return Promise.reject(error);
    }
);

export default api;
