import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap and BootstrapVueNext CSS files
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

// Import BootstrapVueNext and components


// Create your app instance
const app = createApp(App);

// Use BootstrapVueNext
// app.use(BootstrapVueNext);
app.use(router)


app.mount('#app');

// createApp(App).use(router).mount('#app')
