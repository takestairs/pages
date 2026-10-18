<template>
    <div class="container">
        <el-space warp>
            <el-select v-model="chosen_category" placeholder="选择一个分类" style="width: 100px" @change="getNavs">
                <el-option v-for="c in categories" :key="c" :label="c" :value="c"></el-option>
            </el-select>
            <el-text type="info">共 {{ items.length }} 个站点</el-text>

            <el-button @click="getNavs">获取信息</el-button>
            <el-button @click="clearNavs">清空站点</el-button>
            <el-button @click="saveNavs">保存站点</el-button>
        </el-space>
        <el-table :data="items" fit table-layout="auto">
            <el-table-column prop="title" label="title">
                <template #default="{ row }">
                    <el-input v-model="row.title"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="desc" label="desc">
                <template #default="{ row }">
                    <el-input v-model="row.desc"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="link" label="link">
                <template #default="{ row }">
                    <el-input v-model="row.link"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="logo" label="logo">
                <template #default="{ row }">
                    <el-image v-if="row.logo" :src="row.logo"></el-image>
                    <el-input v-model="row.logo" placeholder="logo URL"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="actions">
                <template #default="{ row }">
                    <el-space direction="vertical" alignment="flex-start">
                        <el-button @click="visitLink(row.link)">visit link</el-button>
                        <el-button @click="inferLogo(row)">get logo</el-button>
                        <el-button type="danger" @click="removeNavItem(row)">delete</el-button>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { apiPrefix, auth } from '../const/commom';
import { makeRefWithLocalStorge } from '../util/ReactiveUtil';
import { el } from 'element-plus/es/locales.mjs';

const chosen_category = makeRefWithLocalStorge("", "chosen_category")
const categories = ref([
    "AI Chat",
    "AI Chat/三方",
    "AI Chat/镜像",
])
const items = ref([{
    "title": "测试",
    "desc": "",
    "link": "https://example.com",
    "logo": "https://example.com/logo.png"
}])

onMounted(() => {
    chosen_category.value = localStorage.getItem("chosen_category")
    getCategories()
    getNavs()
})

function getNavs() {
    axios.get(apiPrefix + "/tools/nav/" + chosen_category.value, {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        items.value = res.data
        ElMessage.success("获取成功")
    })
}
function saveNavs() {
    axios.post(apiPrefix + "/tools/nav/" + chosen_category.value, items.value, { headers: {
        "Authorization": auth.value,
        "Content-Type": "application/json"    
    }}).then(res => {
        categories.value = res.data
        ElMessage.success("获取成功")
    })
}

function getCategories(){
    axios.get(apiPrefix + "/tools/nav:categories", {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        categories.value = res.data
        ElMessage.success("获取成功")
    })
}
function clearNavs() {
    items.value = []
}
function removeNavItem(item) {
    items.value.splice(items.value.indexOf(item), 1)
}
function visitLink(link) {
    window.open(link, '_blank', 'noopener,noreferrer')
}
function inferLogo(item) {
    if (!item.logo) {
        item.logo = new URL(item.link).origin + '/favicon.ico'
    } else if (item.logo.endsWith('/favicon.ico')) {
        item.logo = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(item.link).hostname}`
    }
}
</script>
