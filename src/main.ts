import { createApp } from '@vue/runtime-dom';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
