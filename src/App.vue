<script setup lang="ts">

</script>

<template>
  <div class="max-w-screen min-h-screen overflow-hidden bg-violet-50">
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-tap-highlight-color: transparent;
}

:root {
  color-scheme: only light;
}

@font-face {
  font-family: pokemon;
  src: "./assets/PocketMonk-15ze.ttf";
}

html {
  height: 100%;
  overflow: auto;
}

body {
  height: 100%;
}

button,
a {
  user-select: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.clip {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}

.check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
}

.ellips {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
</style>