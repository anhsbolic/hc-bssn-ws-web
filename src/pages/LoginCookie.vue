<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920244.png"
              alt="Logo Imigrasi"
              class="w-16 h-16"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Login Petugas Imigrasi</h1>
        <p class="text-gray-500 mt-2">
          Masuk ke dashboard internal untuk verifikasi data kedatangan
        </p>
      </div>

      <!-- Form -->
      <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <Field
              name="email"
              type="email"
              placeholder="Masukkan email"
              class="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm"/>
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <Field
              name="password"
              type="password"
              placeholder="Masukkan password"
              class="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm"/>
        </div>

        <button
            type="submit"
            :disabled="auth.loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          <span v-if="auth.loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </Form>

      <div v-if="error" class="mt-4 text-red-500 text-sm">
        {{ error }}
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        © 2025 Sistem Imigrasi Kedatangan
      </div>
    </div>
  </div>
</template>

<script setup>
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from "yup";
import {useAuthStore} from "../stores/auth";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();
const auth = useAuthStore();
const error = ref(null);

// Yup schema
const schema = yup.object({
  email: yup.string().required("Email wajib diisi").email("Format email tidak valid"),
  password: yup.string().required("Password wajib diisi"),
});

// Submit
const onSubmit = async (values) => {
  error.value = null;
  await auth.login(values);
  if (auth.error) {
    error.value = auth.error;
  } else {
    router.push("/profile");
  }
};
</script>

<style>
body {
  font-family: "Lato", sans-serif;
}
</style>
