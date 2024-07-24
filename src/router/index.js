import { createMemoryHistory, createRouter } from 'vue-router'

import DreamCometrueCalculatorView from '../views/DreamCometrueCalculatorView.vue'
import FormCollectView from '../views/FormCollectView.vue'
import WeatherReportView from '../views/WeatherReportView.vue'
import YesNoView from '../views/YesNoView.vue'
import FkTokenMannageView from '../views/FkTokenMannageView.vue'

export const routes = [
    { path: '/dream', component: DreamCometrueCalculatorView },
    { path: '/form', component: FormCollectView },
    { path: '/weather', component: WeatherReportView },
    { path: '/ask', component: YesNoView },
    { path: '/fk', component: FkTokenMannageView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router