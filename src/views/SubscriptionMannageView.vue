<template>
    <el-space warp>
        <el-select v-model="branch" placeholder="Select a Branch" style="width: 80px">
            <el-option label="自建" value="private" />
            <el-option label="公共" value="public" />
        </el-select>
        <el-button @click="getSubcription">获取结点</el-button>
        <el-text type="info">*{{ nodeUrlSet.size }}</el-text>
    
        <el-input v-model="userInput" />
        <el-button @click="addNodeInfo">添加结点</el-button>
        <el-button @click="nodeUrlSet.clear()">清空结点</el-button>
        <el-button @click="saveSubcription">保存结点</el-button>
        <el-text type="info">{{ status.get("SAVE") }}</el-text>

        <el-button @click="copyAll">复制全部</el-button>
        <el-text type="info">{{ status.get("COPYALL") }}</el-text>
    </el-space>

    <el-table :data="showData" height="650px" style="width: 100%">
        <el-table-column label="NODE" prop="slice"></el-table-column>

        <el-table-column label="ACTIONS">
            <template #default="scope" style="display: flex; align-items: center">
                <el-button @click="deleteNodeUrl(scope.row.url)">删除</el-button>
                <el-button @click="copyNodeUrl(scope.row.url)">复制</el-button>
            </template>
        </el-table-column>

        <el-table-column label="STATUS" prop="status"></el-table-column>
    </el-table>
    <!-- <table>
        <thead>
            <th>NODE</th>
            <th>ACTIONS</th>
            <th>STATUS</th>
        </thead>
        <tr v-for="(nodeUrl, index) in Array.from(nodeUrlSet)" :key="index">
            <td>{{ getNodeName(nodeUrl) }}</td>
            <td>
                <button @click="deleteNodeUrl(nodeUrl)">删除</button>
                <button @click="copyNodeUrl(nodeUrl)">复制</button>
            </td>
            <td>
                <template v-if="status.has(nodeUrl)">{{ status.get(nodeUrl) }}</template>
            </td>
        </tr>
    </table> -->
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { auth } from './const';

// 使用 ref 定义局部可变数据
const nodeUrlSet = ref(new Set())
const userInput = ref("")
const branch = ref("")

const upstashKey = computed(() => {
    return {
        "public": "subscription:public",
        "private": "subscription"
    }[branch.value]
})

const showData = computed(() => {
    return Array.from(nodeUrlSet.value).map(url => ({
        slice: getNodeName(url),
        token: url,
        status: status.get(url)
    }))
})

watch(branch, (n) => localStorage.setItem("branch", n))
onMounted(() => {
    auth.value = localStorage.getItem("auth")
    branch.value = localStorage.getItem("branch")
})

const status = reactive(new Map());
/**
 * 缓存 promise，当 promise 兑现时，会触发status的响应式。
 * 需要响应式的地方： {{ status.get(name) }}
 * promise 的地方：cacheStatusPromise(name, promise)
 * @param {Promise<string> | Function} provider 
 */
function cacheStatusPromise(name, provider) {
    if (provider instanceof Promise) {
        status.set(name, "waiting")
        provider.then(v => {
            status.set(name, v)
        })
    } else if (provider instanceof Function) {
        status.set(name, provider())
    }
}

function getSubcription() {
    axios.get(`https://api.274452.xyz/upstash/${upstashKey.value}`, {
        headers: {
            Authorization: auth.value
        }
    }).then(r => r.data).then(d => {
        d.forEach((v) => {
            nodeUrlSet.value.add(v);
        })
    })
}

function addNodeInfo() {
    nodeUrlSet.value.add(userInput.value)
    userInput.value = ""
}

function getNodeName(nodeUrl) {
    let n = decodeURIComponent(nodeUrl.substring(nodeUrl.indexOf("#") + 1))
    if (n.startsWith("http")) {
        n = new URL(n).hostname
    }
    return n
}

function saveSubcription() {
    cacheStatusPromise("SAVE", axios.post(`https://api.274452.xyz/upstash/${upstashKey.value}`, Array.from(nodeUrlSet.value), {
        headers: { "Authorization": auth.value, "Content-Type": "application/json" }
    }).then(r => r.data.result).catch(e => e))
}

function deleteNodeUrl(nodeUrl) {
    nodeUrlSet.value.delete(nodeUrl);
}

function copyNodeUrl(nodeUrl) {
    cacheStatusPromise(nodeUrl, navigator.clipboard.writeText(nodeUrl).then(() => "copied"))
}

function copyAll() {
    cacheStatusPromise("COPYALL", navigator.clipboard.writeText(Array.from(nodeUrlSet).join("")).then(() => "copied"))
}
</script>

<!-- <style scoped>
/* 重置默认样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 基本布局 */
div {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #2c3e50;
}

input[type="password"],
input[type="text"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex-grow: 1;
    min-width: 150px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 14px;
}

th,
td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}

/* 特定样式 */
label {
    margin-left: 0.5rem;
    color: #2c3e50;
    align-self: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
    div {
        flex-direction: column;
        gap: 15px;
    }

    input[type="password"],
    input[type="text"] {
        width: 100%;
    }

    button {
        width: 100%;
        padding: 0.75rem;
    }

    table {
        font-size: 12px;
    }
}
</style> -->
