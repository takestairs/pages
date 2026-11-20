<template>
    <div class="container">
        <el-space warp>
            <el-select v-model="selectedCategory" placeholder="选择一个分类" style="width: 100px" @change="getNavs">
                <el-option v-for="c in categories" :key="c" :label="c" :value="c"></el-option>
            </el-select>
            <el-text type="info">共 {{ items.length }} 个站点</el-text>

            <el-button @click="saveNavs">保存站点</el-button>
        </el-space>

        <el-table :data="items" fit stripe table-layout="auto">
            <el-table-column label="站点信息">
                <template #default="{ row }">
                    <el-form :model="row" label-width="auto" >
                        <el-form-item label="Title">
                            <el-input v-model="row.title" />
                        </el-form-item>
                        <el-form-item label="Desc">
                            <el-input v-model="row.desc" />
                        </el-form-item>
                        <el-form-item label="Link">
                            <el-input v-model="row.link" />
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>

            <el-table-column label="logo">
                <template #default="{ row }">
                    <el-image :src="row.logo" fit="contain" class="logo-img">
                        <!-- <template #error>
                            <el-input v-model="row.logo"></el-input>
                        </template> -->
                    </el-image>
                </template>
            </el-table-column>

            <el-table-column label="actions">
                <template #default="{ row }">
                    <el-space direction="vertical" alignment="flex-start">
                        <el-button @click="visitLink(row.link)">访问</el-button>
                        <el-button @click="findLogo(row)">查找logo</el-button>
                        <el-button type="danger" @click="removeNavItem(row)">删除</el-button>
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

const selectedCategory = makeRefWithLocalStorge("", "selectedCategory")
const categories = ref([])
const items = ref([{
    "title": "测试",
    "desc": "",
    "link": "https://example.com",
    "logo": "https://example.com/logo.png"
}])

onMounted(() => {
    getCategories()
    getNavs()
})

function getNavs() {
    axios.get(apiPrefix + "/resource/nav/" + selectedCategory.value, {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        items.value = res.data
        ElMessage.success("获取成功")
    })
}
function saveNavs() {
    axios.post(apiPrefix + "/resource/nav/" + selectedCategory.value, items.value, { headers: {
        "Authorization": auth.value,
        "Content-Type": "application/json"    
    }}).then(res => {
        categories.value = res.data
        ElMessage.success("获取成功")
    })
}

function getCategories(){
    axios.get(apiPrefix + "/resource/nav:categories", {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        categories.value = res.data
        ElMessage.success("获取成功")
    })
}
function removeNavItem(item) {
    items.value.splice(items.value.indexOf(item), 1)
}
function visitLink(link) {
    window.open(link, '_blank', 'noopener,noreferrer')
}
function findLogo(item) {
    item.logo = `https://a.favicon.im/${new URL(item.link).hostname}`
}
</script>

<style scoped>
.logo-img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
}
</style>