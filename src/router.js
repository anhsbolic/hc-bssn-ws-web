import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from "@/stores/auth.js";
import Login from './pages/Login.vue'
import ArrivalForm from './pages/ArrivalForm.vue'
import Dashboard from './pages/Dashboard.vue'
import ArrivalDetail from './pages/ArrivalDetail.vue'
import LoginCookie from "@/pages/LoginCookie.vue";
import Profile from "@/pages/Profile.vue";

const routes = [
    {path: '/', component: ArrivalForm},
    {path: '/login', component: Login},
    {path: '/dashboard', component: Dashboard},
    {path: '/arrivals/:id', component: ArrivalDetail},
    {path: '/login-cookie', component: LoginCookie},
    {path: '/profile', component: Profile, meta: {requiresAuth: true}},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.accessToken) {
        const success = await auth.refreshToken();
        if (!success) return next("/login-cookie");
    }
    next();
});

export default router
