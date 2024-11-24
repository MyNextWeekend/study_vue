import { createApp } from 'vue'
import App from './App.vue'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'view-ui-plus/dist/styles/viewuiplus.css'



createApp(App).use(router).use(ViewUIPlus).use(VueAxios, axios).mount('#app')