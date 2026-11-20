import { Cloudy, Compass, Connection, Download, Finished, Help, Link, Picture, QuestionFilled, Tickets } from '@element-plus/icons-vue';
import { markRaw } from 'vue';

import DreamCometrueCalculatorView from '../views/DreamView.vue'
import WeatherReportView from '../views/WeatherReportView.vue'
import YesNoView from '../views/YesNoView.vue'
import SubscriptionMannageView from '../views/SubscriptionView.vue'
import HomeView from '../views/HomeView.vue'
import TextToImageView from '../views/TextToImageView.vue'
import Mix172DownloaderView from '../views/Mix172View.vue'
import NavSiteView from '../views/NavSiteView.vue'
import T from '../views/T.vue'

const routes = [
    // { path: '/:pathMatch(.*)', component: NotFoundComponent },
    { path: '/', component: HomeView},
    { path: '/dream', component: DreamCometrueCalculatorView, text: '梦想成真计算器', icon: markRaw(Finished) },
    { path: '/weather', component: WeatherReportView, text: '天气查询', icon: markRaw(Cloudy) },
    { path: '/ask', component: YesNoView, text: 'Yes or No', icon: markRaw(Compass) },
    { path: '/text2image', component: TextToImageView },
    { path: '/172mix', component: Mix172DownloaderView, text: '172mix下载', icon: markRaw(Download) },
    { path: '/test', component: T },
]

const authRoutes = [
    { path: '/subscription', component: SubscriptionMannageView, text: '结点订阅管理', icon: markRaw(Link) },
    { path: '/nav', component: NavSiteView, text: 'Nav Site', icon: markRaw(Compass) },
]

export function getRoutes() {
    const rs = []
    for(let r of [...routes, ...authRoutes]) {
        rs.push({ path: r["path"], component: r["component"]})
    }
    return rs
}
export function getRoutePath() {
    const rs = []
    for(r of [...routes, ...authRoutes]) {
        rs.push(r["path"])
    }
    return rs
}
export function getMenuItems() {
    const rs = []
    for(let r of routes) {
        if(r["text"] && r["icon"]) rs.push({ path: r["path"], text: r["text"], icon: r["icon"] })
    }
    return rs
}
export function getAuthMenuItems() {
    const rs = []
    for(let r of authRoutes) {
        if(r["text"] && r["icon"]) rs.push({ path: r["path"], text: r["text"], icon: r["icon"] })
    }
    return rs
}