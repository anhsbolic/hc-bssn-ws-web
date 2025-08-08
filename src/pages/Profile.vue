<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

      <div v-if="auth.user">
        <p><strong>ID:</strong> {{ auth.user.id }}</p>
        <p><strong>Username:</strong> {{ auth.user.username }}</p>
        <p><strong>Role:</strong> {{ auth.user.role }}</p>
      </div>
      <div v-else>
        <p>Memuat data pengguna...</p>
      </div>

      <button
          @click="logout"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from "../stores/auth";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const logout = async () => {
  await auth.logout();
  router.push("/login-cookie");
};

onMounted(async () => {
  if (!auth.accessToken) {
    await auth.refreshToken();
  }
  await auth.fetchUser();
});
</script>
