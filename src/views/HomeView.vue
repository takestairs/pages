<template>
    <el-space warp>
        <el-text type="info">AUTH: </el-text> <el-input type="password" v-model="auth" placeholder="输入鉴权密钥" show-password />
    </el-space>

    <p style="margin-top: 40px; text-indent: 2em;">Web 页面练习站点，管理一些数据，提供一些操作面板，存放一些外链、静态文件。使用 Vue3 + Element-UI 编写。</p>
</template>

<script setup>
import {auth} from "../const/commom"
</script>