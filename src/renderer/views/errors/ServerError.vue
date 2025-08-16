<template>
    <div class="p-8 text-center">
        <h1 class="text-3xl font-bold mb-4">500 — Sunucu Hatası</h1>
        <p class="mb-6">Uygulama yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
        <button @click="$router.go(0)" class="text-amber-600 underline">Yeniden Dene</button>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
