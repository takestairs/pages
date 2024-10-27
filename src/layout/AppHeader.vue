<template>
    <el-header>
        <el-scrollbar>

            <el-menu mode="horizontal" :ellipsis="false">
                <el-menu-item>
                    <el-icon @click="isAsideCollapse = !isAsideCollapse">
                        <Expand v-show="isAsideCollapse" />
                        <Fold v-show="!isAsideCollapse" />
                    </el-icon>
                </el-menu-item>

                <el-sub-menu index="1">
                    <template #title>权威文档</template>
                    <el-menu-item>
                        <el-link target="_blank" href="https://element-plus.org/zh-CN/">Element-plus</el-link>
                    </el-menu-item>
                    <el-menu-item>
                        <el-link target="_blank" href="https://router.vuejs.org/zh/">Vue-Router</el-link>
                    </el-menu-item>
                    <el-menu-item>
                        <el-link target="_blank" href="https://gopl-zh.github.io/">Go</el-link>
                    </el-menu-item>
                    <el-menu-item>
                        <el-link target="_blank" href="https://docker-practice.github.io/zh-cn/">Docker</el-link>
                    </el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="2">
                    <template #title>油猴脚本</template>
                    <el-menu-item>
                        <el-link target="_blank" href="/js/vpss.js">VPS填单</el-link>
                    </el-menu-item>
                    <el-menu-item>
                        <el-link target="_blank" href="/js/plusvv.js">Plus镜像</el-link>
                    </el-menu-item>
                    <el-menu-item>
                        <el-link target="_blank" href="/js/teacherTraining.js">教师研修</el-link>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item>
                    <el-link target="_blank" href="/cf-ip-scanner.html">Cloudflare IP 扫描器</el-link>
                </el-menu-item>

                <el-menu-item>
                    <el-link target="_blank" href="https://crypt-aax.pages.dev">加密猫</el-link>
                </el-menu-item>

                <el-menu-item style="margin-left: auto;">
                    <DayNightModeButton style="scale: 50% 55%;" @change="console.log" />
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </el-header>
</template>

<script setup>
import DayNightModeButton from "../components/DayNightModeButton.vue"

import { Expand, Fold } from "@element-plus/icons-vue";
import { isAsideCollapse } from "../util/const"

</script>