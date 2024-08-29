<template>
    <el-space warp>
        <el-button @click="checkAll">检查全部 token</el-button>

        <el-text type="info">{{ plusTokens.size }}</el-text>

        <el-input v-model="userInput" />
        <el-button @click="handleNewToken">添加</el-button>


        <el-button @click="saveToken">保存</el-button>
    </el-space>

    <el-table :data="showData" height="650px" style="width: 100%">
        <el-table-column label="TOKEN" prop="slice"></el-table-column>

        <el-table-column label="ACTIONS">
            <template #default="scope" style="display: flex; align-items: center">
                <el-button @click="deleteToken(scope.row.token)">删除</el-button>
                <el-button @click="checkToken(scope.row.token)">检查</el-button>
            </template>
        </el-table-column>

        <el-table-column label="STATUS" prop="status"></el-table-column>
    </el-table>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, onMounted, computed } from 'vue';
import { auth } from './const';
import { ElMessage, ElMessageBox } from 'element-plus';

const CHECK = "https://chat.oaifree.com/token/info/";
const LOGIN = "https://plus.aivvm.com/auth/login_share?token=";

const plusTokens = ref(new Set());
const userInput = ref("")

const showData = computed(() => {
    return Array.from(plusTokens.value).map(token => ({
        slice: token.slice(-7),
        token,
        status: status.get(token)
    }))
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

function deleteToken(token) {
    plusTokens.value.delete(token);
}

function handleNewToken() {
    const fks = userInput.value.match(/https:\/\/\S+/g) || []
    userInput.value = ""

    fks.forEach(token => {
        if (token !== "" && !plusTokens.value.has(token)) {
            plusTokens.value.add(token.replace(LOGIN, ""))
        }
    })
    ElMessage.success(`add ${fks.length} ${fks.length > 1 ? 'tokens' : 'token'}`)
}

function saveToken() {
    ElMessageBox.alert('这将会覆盖云端配置，确定继续？', '保存Token信息', {
        confirmButtonText: 'OK',
        callback: (action) => {
            if (action == 'confirm') {
                axios.post("https://api.274452.xyz/upstash/plus", Array.from(plusTokens.value), {
                    headers: { "Authorization": auth.value, "Content-Type": "application/json" }
                }).then(r => ElMessage.success(r.data.result)).catch(e => ElMessage.error(e))
            } else {
                ElMessage.info("已取消保存")
            }
        }
    })
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
