<template>
    <button @click="checkAll">检查全部 token</button>
    <div><input v-model="newToken" /><button @click="addToken">添加</button></div>
    <div>
        <input type="password" v-model="auth" />
        <button @click="saveToken">保存</button>
        <label>{{ status.get("SAVE_TOKEN") }}</label>
    </div>
    <table>
        <thead>
            <th>TARGET</th>
            <th>ACTIONS</th>
            <th>STATUS</th>
        </thead>
        <tr v-for="(token, index) in Array.from(plusTokens)" :key="index">
            <td><a :href="`${LOGIN}${token}`">{{ token.slice(-7) }}</a></td>
            <td>
                <button @click="deleteToken(token)">删除</button>
                <button @click="checkToken(token)">检查</button>
            </td>
            <td>
                <p v-if="status.has(token)">{{ status.get(token) }}</p>
            </td>
        </tr>
    </table>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';
// import { Reactive } from "@vue/reactivity/dist/reactivity.d.ts"

const CHECK = "https://chat.oaifree.com/token/info/";
const LOGIN = "https://plus.aivvm.com/auth/login_share?token=";

const plusTokens = ref(new Set());
const newToken = ref("")
const auth = ref("")

const status = reactive(new Map());
/**
 * 缓存 promise，当 promise 兑现时，会触发status的响应式。
 * 需要响应式的地方： {{ status.get(name) }}
 * promise 的地方：cacheStatusPromise(name, promise)
 * @param {Promise<string>} promise 
 */
function cacheStatusPromise(name, promise) {
    status.set(name, "checking")
    promise.then(v => {
        status.set(name, v)
    })
}

function deleteToken(token) {
    plusTokens.value.delete(token);
}

function addToken() {
    if (newToken.value !== "" && !plusTokens.value.has(newToken)) {
        plusTokens.value.add(newToken.value.replace(LOGIN, ""))
    }
    newToken.value = ""
}

function saveToken() {
    cacheStatusPromise("SAVE_TOKEN", axios.post("https://api.274452.xyz/upstash/plus", Array.from(plusTokens.value).map(token => LOGIN + token), {
        headers: { "Authorization": auth.value, "Content-Type": "application/json" }
    }).then(r => r.data.result).catch(e => e))
}

async function checkToken(token) {
    cacheStatusPromise(token, axios.get(`${CHECK}${token}`).then(r => r.data).then(result => {
        if (result && result.expire_at > Math.ceil(Date.now() / 1000)) {
            return 'ok'; // 标记为检查完成
        } else {
            return 'expired'; // 可以根据具体逻辑调整
        }
    }).catch(e => e))
}

function checkAll() {
    plusTokens.value.forEach(token => {
        checkToken(token);
    });
}

onMounted(() => {
    axios.get("https://api.274452.xyz/upstash/plus").then(r => r.data).then(d => {
        d.forEach((v) => {
            plusTokens.value.add(v.replace(LOGIN, ""));
        });
    })
});
</script>

<style scoped>
/* 重置默认样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 基本布局 */
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

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
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
a {
    color: #42b983;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

label {
    margin-left: 0.5rem;
    color: #2c3e50;
}
</style>