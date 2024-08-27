<template>
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

            <el-sub-menu index="4">
                <template #title>权威文档</template>
                <el-menu-item index="4-1">
                    <el-link target="_blank" href="https://element-plus.org/zh-CN/">Element-plus</el-link>
                </el-menu-item>
                <el-menu-item index="4-2">
                    <el-link target="_blank" href="https://router.vuejs.org/zh/">Vue-Router</el-link>
                </el-menu-item>
                <el-menu-item index="4-3">
                    <el-link target="_blank" href="https://gopl-zh.github.io/">Go</el-link>
                </el-menu-item>
                <el-menu-item index="4-3">
                    <el-link target="_blank" href="https://docker-practice.github.io/zh-cn/">Docker</el-link>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
        <DayNightModeButton @change="console.log" />
    </el-header>
</template>

<script setup>
import DayNightModeButton from "../components/DayNightModeButton.vue"
</script>