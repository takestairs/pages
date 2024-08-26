<template>
    <el-container>
        <h1>UIs</h1>
        <el-header>
            <el-menu mode="horizontal">
                <el-sub-menu index="1">
                    <template #title>油猴脚本</template>
                    <el-menu-item index="1-1">
                        <el-link target="_blank" href="/js/vpss.js">VPS填单</el-link>
                    </el-menu-item>
                    <el-menu-item index="1-2">
                        <el-link target="_blank" href="/js/plusvv.js">Plus镜像</el-link>
                    </el-menu-item>
                    <el-menu-item index="1-3">
                        <el-link target="_blank" href="/js/teacherTraining.js">教师研修</el-link>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item index="2">
                    <el-link target="_blank" href="/cf-ip-scanner.html">Cloudflare IP 扫描器</el-link>
                </el-menu-item>

                <el-menu-item index="3">
                    <el-link target="_blank" href="https://crypt-aax.pages.dev">加密猫</el-link>
                </el-menu-item>
            </el-menu>
            <DayNightModeButton @change="console.log"/>
        </el-header>

        <el-container>
            <el-aside width="200px">
                <el-menu>
                    <el-menu-item v-for="view in views" :key="view.path" @click="$router.push(view.path)">
                        <template #title>{{ view.text }}</template>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-container>
                <el-main>
                    <router-view v-slot="{ Component }">
                        <keep-alive include="FkTokenMannageView">
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </el-main>

                <el-footer>
                    <OneSentence />
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup>
import OneSentence from "./components/OneSentence.vue"
import DayNightModeButton from "./components/DayNightModeButton.vue"
import { KeepAlive, ref } from "vue";

const views = [
    { path: '/', text: 'Home' },
    { path: '/dream', text: '梦想成真计算器' },
    { path: '/form', text: '表单收集' },
    { path: '/weather', text: '天气查询' },
    { path: '/ask', text: 'Yes or No' },
    { path: '/fk', text: 'fk-token 管理' },
    { path: '/subscription', text: '结点订阅管理' },
]
</script>

<!-- <style>
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --text-color: #333;
    --background-color: #f5f5f5;
    --link-color: #2980b9;
    --link-hover-color: #1abc9c;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    padding: 20px;
}

h1 {
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 20px;
}

p {
    text-align: center;
    margin-bottom: 30px;
}

a {
    color: var(--link-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: var(--link-hover-color);
}

nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 30px;
}

nav a {
    background-color: var(--primary-color);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

nav a:hover {
    background-color: var(--secondary-color);
}

main {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 30px 0;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        align-items: center;
    }

    nav a {
        width: 100%;
        text-align: center;
    }
}
</style> -->