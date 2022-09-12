import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import router from './router'
const pinia = createPinia()
createApp(App).use(pinia).use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
