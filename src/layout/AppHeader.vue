<template>
    <el-header>
        <el-scrollbar>

            <el-menu mode="horizontal" :ellipsis="false">
                <el-menu-item index="toggle-aside">
                    <el-icon @click="isAsideCollapse = !isAsideCollapse">
                        <Expand v-show="isAsideCollapse" />
                        <Fold v-show="!isAsideCollapse" />
                    </el-icon>
                </el-menu-item>

                <el-sub-menu index="1">
                    <template #title>相关文档</template>
                    <el-menu-item index="element-plus">
                        <el-link target="_blank" href="https://element-plus.org/zh-CN/">Element-plus</el-link>
                    </el-menu-item>
                    <el-menu-item index="vue-router">
                        <el-link target="_blank" href="https://router.vuejs.org/zh/">Vue-Router</el-link>
                    </el-menu-item>
                    <el-menu-item index="vue3">
                        <el-link target="_blank" href="https://cn.vuejs.org/">Vue3</el-link>
                    </el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="2">
                    <template #title>油猴脚本</template>
                    <el-menu-item index="teacher-training">
                        <el-link target="_blank" href="/js/teacherTraining.user.js">教师研修</el-link>
                    </el-menu-item>
                    <el-menu-item index="pecec">
                        <el-link target="_blank" href="/js/pecec.js">人教师苑</el-link>
                    </el-menu-item>
                </el-sub-menu>
                
                <el-menu-item index="crypt-aax">
                    <el-link target="_blank" href="https://crypt-aax.pages.dev">加密猫</el-link>
                </el-menu-item>

                <el-menu-item index="day-night-mode" style="margin-left: auto;">
                    <DayNightModeButton style="scale: 50% 55%;" @change="console.log" />
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </el-header>
</template>

<script setup>
import DayNightModeButton from "../components/DayNightModeButton.vue"

import { Expand, Fold } from "@element-plus/icons-vue";
import { isAsideCollapse } from "../const/commom"

</script>
