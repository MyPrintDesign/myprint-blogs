import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {mountMessageBox} from "./components/install.ts";

const app = createApp(App);
mountMessageBox(app)
app.mount('#app')
