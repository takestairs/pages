<template>
    <DayNightModeButton />
    <h1>Hello UIs!</h1>
    <p>仓库地址: <a href="https://github.com/takestairs/pages">https://github.com/takestairs/pages</a> <strong>Current route path:</strong> {{ $route.fullPath }}</p>
    
    <nav>
        <a href="/public/js/vpss.js">VPS填单</a>
        <a href="/public/js/plusvv.js">Plus跳转</a>
        <a href="/public/js/teacherTraining.js">教师研修</a>
        <a href="/public/cf-ip-scanner.html">Cloudflare IP 扫描器</a>
    </nav>

    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/dream">梦想成真计算器</RouterLink>
        <RouterLink to="/form">表单收集 DEMO</RouterLink>
        <RouterLink to="/weather">天气查询</RouterLink>
        <RouterLink to="/ask">Yes or No</RouterLink>
        <RouterLink to="/fk">fk-token 管理</RouterLink>
    </nav>

    <main v-if="$route.fullPath !== '/'">
        <router-view v-slot="{ Component }">
            <keep-alive include="FkTokenMannageView">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </main>

    <hr />
    <OneSentence />
</template>

<script setup>
import OneSentence from "./components/OneSentence.vue"
import DayNightModeButton from "./components/DayNightModeButton.vue"
import { KeepAlive } from "vue";

</script>


<style>
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
</style>