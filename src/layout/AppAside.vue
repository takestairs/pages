<template>
    <el-aside>
        <el-menu :collapse="isAsideCollapse" router>
            <el-menu-item index="/">
                <h1>UIs</h1>
            </el-menu-item>
            <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                <el-icon v-if="item.icon">
                    <component :is="item.icon" />
                </el-icon>
                <template #title>{{ item.text }}</template>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { apiPrefix, isAsideCollapse, auth } from "../const/commom";
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import { getAuthMenuItems, getMenuItems } from '../router/routes';

const menuItems = reactive(getMenuItems())
onMounted(() => {
    axios.get(apiPrefix + '/oauth', {
        headers: { "Authorization": auth.value }
    }).then(res => {
        if (res.data) {
            menuItems.push(...getAuthMenuItems())
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
