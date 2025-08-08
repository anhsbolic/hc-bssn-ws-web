import {defineStore} from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: null,
        user: null,
        loading: false,
        error: null,
    }),
    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post("/api/cookie/login", credentials, {
                    withCredentials: true, // kirim cookie HttpOnly
                });
                this.accessToken = res.data.data.access_token;
                await this.fetchUser();
            } catch (err) {
                this.error =
                    err.response?.data?.message || "Login gagal, coba lagi.";
            } finally {
                this.loading = false;
            }
        },

        async refreshToken() {
            try {
                const res = await api.post("/api/cookie/refresh-token", {}, {
                    withCredentials: true,
                });
                this.accessToken = res.data.data.access_token;
                return true;
            } catch (err) {
                this.accessToken = null;
                this.user = null;
                return false;
            }
        },

        async fetchUser() {
            if (!this.accessToken) return;
            try {
                const res = await api.get("/api/cookie/me", {
                    headers: {Authorization: `Bearer ${this.accessToken}`},
                    withCredentials: true,
                });
                this.user = res.data.data;
                console.log(this.user);
            } catch (err) {
                this.user = null;
            }
        },

        async logout() {
            await api.post("/api/cookie/logout", {}, {withCredentials: true});
            this.accessToken = null;
            this.user = null;
        },
    },
});
