<template>
    <el-aside>
        <el-menu :collapse="isAsideCollapse" router>
            <el-menu-item index="/">
                <h1>UIs</h1>
            </el-menu-item>
            <el-menu-item v-for="view in views" :key="view.path" :index="view.path">
                <el-icon>
                    <component :is="view.icon" />
                </el-icon>
                <template #title>{{ view.text }}</template>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { Cloudy, Connection, Finished, Help, Link, Picture, Tickets } from '@element-plus/icons-vue';
import { apiPrefix, isAsideCollapse } from "../const/commom";
import { onMounted, reactive } from 'vue';
import { auth } from '../const/commom';
import axios from 'axios';

const views = reactive([
    // { path: '/', text: 'Home' },
    { path: '/dream', text: '梦想成真计算器', icon: Finished },
    { path: '/form', text: '表单收集', icon: Tickets },
    { path: '/weather', text: '天气查询', icon: Cloudy },
    { path: '/ask', text: 'Yes or No', icon: Help },
    // { path: '/fk', text: 'fk-token 管理', icon: Coin },
    { path: '/text2image', text: '文生图', icon: Picture },
])
const authViews = [
    { path: '/subscription', text: '结点订阅管理', icon: Link },
    { path: '/apiendpoint', text: 'API端点管理', icon: Connection },
]
onMounted(() => {
    auth.value = localStorage.getItem("auth")

    axios.get(apiPrefix + '/oauth', {
        headers: { "Authorization": auth.value }
    }).then(res => {
        if (res.data) {
            views.push(...authViews)
        }
    })
})
</script>

<style scoped>
.el-aside {
    width: auto;
}

.el-menu--collapse {
    width: 0;
    border-right: none;
}
</style>