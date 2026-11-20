import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { getRoutes } from './routes'

export default createRouter({
    history: createWebHashHistory(),
    routes: getRoutes(),
})