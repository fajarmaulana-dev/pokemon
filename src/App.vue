<script setup lang="ts">
</script>

<template>
  <div class="max-w-screen min-h-screen overflow-hidden bg-white">
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

input[type=text],
textarea {
  caret-color: rgb(30, 41, 59) !important;
  -webkit-box-shadow: 0 0 0 30px #FFFFFF inset !important;
  -webkit-text-fill-color: rgb(30, 41, 59) !important;
  -webkit-background-clip: text;
  background-clip: text;
  box-shadow: 0 0 0 30px #FFFFFF inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

input[type=text]::placeholder,
textarea {
  color: rgb(30, 41, 59);
  opacity: .75;
}

.panelayer {
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, .25);
  scale: 0;
  opacity: 0;
  transition: opacity .25s;
}

.panelayer.is-active {
  scale: 1;
  opacity: 1;
}

.paneline {
  position: absolute;
  width: 64px;
  height: 4px;
  border-radius: 2px;
  background-color: rgb(195, 196, 199);
  top: 8px;
  left: calc(50% - 32px);
}
</style>