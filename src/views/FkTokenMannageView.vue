<template>
    <el-space warp>
        <el-button @click="checkAll">检查全部 token</el-button>

        <el-text type="info">{{ plusTokens.size }}</el-text>

        <el-input v-model="userInput" style="min-width: 50px;" />
        <el-button @click="handleNewToken">添加</el-button>

        <el-button @click="saveToken">保存</el-button>
        <el-button @click="cleanInvalid">清除无效token</el-button>
    </el-space>

    <el-table :data="showData" height="650px" style="width: 100%">
        <el-table-column label="TOKEN" prop="slice"></el-table-column>

        <el-table-column label="ACTIONS">
            <template #default="scope" style="display: flex; align-items: center">
                <el-button @click="deleteToken(scope.row.token)">删除</el-button>
                <el-button @click="checkToken(scope.row.token)">检查</el-button>
                <el-button @click="copyToken(scope.row.token)">复制</el-button>
            </template>
        </el-table-column>

        <el-table-column label="LINKS">
            <template #default="scope" style="display: flex; align-items: center">
                <el-button @click="openToken(scope.row.token, 0)">aivvm</el-button>
                <el-button @click="openToken(scope.row.token, 1)">oaifree</el-button>
            </template>
        </el-table-column>

        <el-table-column label="STATUS" prop="status"></el-table-column>
    </el-table>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, onMounted, computed } from 'vue';
import { apiPrefix, auth } from '../const/commom';
import { ElMessage, ElMessageBox } from 'element-plus';

const CHECK = "https://chat.oaifree.com/token/info/";
const INPUT_PREFIX = "https://plus.aivvm.com/auth/login_share?token=";

const plusTokens = ref([]);
const userInput = ref("")

const showData = computed(() => {
    return plusTokens.value.map(token => ({
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

function openToken(token, i = 0) {
    const prefixes = ["https://plus.aivvm.com/auth/login_share?token=", "https://new.oaifree.com/auth/login_share?token="]
    window.open(prefixes[i] + token)
}

function deleteToken(token) {
    plusTokens.value = plusTokens.value.filter(t => t !== token);
}

function handleNewToken() {
    const fks = userInput.value.match(/https:\/\/\S+/g) || []
    userInput.value = ""
    fks.forEach(token => {
        if (token !== "") {
            plusTokens.value.push(token.replace(INPUT_PREFIX, ""))
        }
    })
    ElMessage.success(`add ${fks.length} ${fks.length > 1 ? 'tokens' : 'token'}`)
}

function saveToken() {
    ElMessageBox.alert('这将会覆盖云端配置，确定继续？', '保存Token信息', {
        confirmButtonText: 'OK',
        callback: (action) => {
            if (action == 'confirm') {
                axios.post(apiPrefix + "/upstash/plus", plusTokens.value, {
                    headers: { "Authorization": auth.value, "Content-Type": "application/json" }
                }).then(r => ElMessage.success(r.data)).catch(e => ElMessage.error(e))
            } else {
                ElMessage.info("已取消保存")
            }
        }
    })
}

async function copyToken(token) {
    cacheStatusPromise(token, navigator.clipboard.writeText(token).then(() => "copied"))
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
        checkToken(token)
    })
}

function cleanInvalid() {
    const len = plusTokens.value.length
    plusTokens.value.forEach(token => {
        if (status.get(token) !== "ok" && status.get(token) !== "waiting") {
            deleteToken(token)
        }
    })
    ElMessage.success(`Remove ${len - plusTokens.value.length} token`)
}

onMounted(() => {
    axios.get(apiPrefix + "/upstash/plus").then(r => r.data).then(d => {
        d.forEach(v => {
            plusTokens.value.push(v.replace(INPUT_PREFIX, ""));
        });
    })
});
</script>