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
import { Cloudy, Coin, Finished, Help, Link, Tickets } from '@element-plus/icons-vue';
import { isAsideCollapse } from "../const";

const views = [
    // { path: '/', text: 'Home' },
    { path: '/dream', text: '梦想成真计算器', icon: Finished },
    { path: '/form', text: '表单收集', icon: Tickets },
    { path: '/weather', text: '天气查询', icon: Cloudy },
    { path: '/ask', text: 'Yes or No', icon: Help },
    { path: '/fk', text: 'fk-token 管理', icon: Coin },
    { path: '/subscription', text: '结点订阅管理', icon: Link },
]
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