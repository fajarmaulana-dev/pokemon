import { createApp } from '@vue/runtime-dom';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/style.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import { useRegisterSW } from 'virtual:pwa-register/vue';
useRegisterSW({ immediate: true });

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
