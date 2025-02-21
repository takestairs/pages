import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import DreamCometrueCalculatorView from '../views/DreamCometrueCalculatorView.vue'
import FormCollectView from '../views/FormCollectView.vue'
import WeatherReportView from '../views/WeatherReportView.vue'
import YesNoView from '../views/YesNoView.vue'
import FkTokenMannageView from '../views/FkTokenMannageView.vue'
import SubscriptionMannageView from '../views/SubscriptionMannageView.vue'
import HomeView from '../views/HomeView.vue'
import ApiEndpointsMannageView from '../views/ApiEndpointsMannageView.vue'
import TextToImageView from '../views/TextToImageView.vue'

export const routes = [
    // { path: '/:pathMatch(.*)', component: NotFoundComponent },
    { path: '/', component: HomeView },
    { path: '/dream', component: DreamCometrueCalculatorView },
    { path: '/form', component: FormCollectView },
    { path: '/weather', component: WeatherReportView },
    { path: '/ask', component: YesNoView },
    { path: '/fk', component: FkTokenMannageView },
    { path: '/subscription', component: SubscriptionMannageView },
    { path: '/apiendpoint', component: ApiEndpointsMannageView },
    { path: '/text2image', component: TextToImageView },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router