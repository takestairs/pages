<template>
    <el-space warp>
        <el-text>AUTH: </el-text> <el-input type="password" v-model="auth" placeholder="输入鉴权密钥" show-password />
    </el-space>
</template>

<script setup>
import { onMounted } from 'vue';
import { auth } from './const';

onMounted(() => auth.value = localStorage.getItem("auth"))
</script>