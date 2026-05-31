import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import DreamCometrueCalculatorView from '../views/DreamCometrueCalculatorView.vue'
import WeatherReportView from '../views/WeatherReportView.vue'
import YesNoView from '../views/YesNoView.vue'
import SubscriptionMannageView from '../views/SubscriptionMannageView.vue'
import HomeView from '../views/HomeView.vue'
import TextToImageView from '../views/TextToImageView.vue'
import Mix172DownloaderView from '../views/Mix172DownloaderView.vue'
import T from '../views/T.vue'

export const routes = [
    // { path: '/:pathMatch(.*)', component: NotFoundComponent },
    { path: '/', component: HomeView },
    { path: '/dream', component: DreamCometrueCalculatorView },
    { path: '/weather', component: WeatherReportView },
    { path: '/ask', component: YesNoView },
    { path: '/subscription', component: SubscriptionMannageView },
    { path: '/text2image', component: TextToImageView },
    { path: '/172mix', component: Mix172DownloaderView },
    { path: '/test', component: T },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})