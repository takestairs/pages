<template>
    <el-aside width="200px">
        <el-menu>
            <el-menu-item>
                <h1>UIs</h1>
            </el-menu-item>
            <el-menu-item v-for="view in views" :key="view.path" @click="$router.push(view.path)">
                <template #title>{{ view.text }}</template>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
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