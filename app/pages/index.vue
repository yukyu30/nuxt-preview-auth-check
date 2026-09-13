<script setup lang="ts">
const count = ref(0);
</script>
<template>
  <main>
    <p>Nuxt プレビュー認証の検証</p>
    <h1>認証後のページ</h1>
    <p>パスワード制限を試すためのサンプルサイトです。</p>
    <button @click="count++">カウント {{ count }}</button>
    <p><NuxtLink to="/about">別のページへ</NuxtLink></p>
    <p><a href="/sample.txt">静的ファイルを開く</a></p>
  </main>
</template>
<style>
body {
  font-family: system-ui, sans-serif;
  background: #f4f7f4;
  color: #173d32;
  margin: 0;
  padding: 48px 24px;
}
main {
  max-width: 640px;
  margin: auto;
  background: white;
  border: 1px solid #d9e5db;
  padding: 32px;
  border-radius: 20px;
}
button {
  padding: 12px 20px;
  font: inherit;
  cursor: pointer;
}
a {
  color: #176c53;
}
</style>
