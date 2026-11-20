<template>
    <el-space warp>
        <el-select v-model="selectedToken" placeholder="Select a Token" style="width: 80px">
            <el-option v-for="t in tokens" :value="t" />
        </el-select>
        <el-button @click="getSubcription">获取结点</el-button>

        <el-text type="info">{{ nodeUrlSet.size }}</el-text>

        <el-input v-model="userInput" />
        <el-button @click="addNodeInfo">添加结点</el-button>
        <el-button @click="nodeUrlSet.clear()">清空结点</el-button>
        <el-button @click="saveSubcription">保存结点</el-button>
        <el-button @click="copyAll">复制全部</el-button>
    </el-space>

    <el-table :data="showData" height="450px">
        <el-table-column label="NODE" prop="slice" show-overflow-tooltip></el-table-column>

        <el-table-column label="ACTIONS">
            <template #default="scope">
                <el-button @click="deleteNodeUrl(scope.row.url)">删除</el-button>
                <el-button @click="copyNodeUrl(scope.row.url)">复制</el-button>
                <el-button v-if="scope.row.url.startsWith('sub64://')" @click="checkSubUrl(scope.row.url)">测活</el-button>
            </template>
        </el-table-column>

        <el-table-column label="STATUS" prop="status"></el-table-column>
    </el-table>
</template>

<script setup>
import axios from 'axios';
import { computed, reactive, ref, onMounted } from 'vue'
import { apiPrefix, auth } from "../const/commom";
import { globleStatus, makeRefWithLocalStorge, setGlobleStatus } from '../util/ReactiveUtil';
import { ElMessage, ElMessageBox } from 'element-plus';

const nodeUrlSet = ref(new Set())
const userInput = ref("")
const selectedToken = makeRefWithLocalStorge("public", "selectedToken")

const tokens = reactive([])
onMounted(()=>{
    axios.get(`${apiPrefix}/subcription`, {
        headers: {
            Authorization: auth.value
        }
    }).then(r => r.data).then(data => {
        tokens.push(...data)
        ElMessage.success(`获取类别${data.length}个`)
    }).catch(e => ElMessage.error(e))
})

const showData = computed(() => {
    return Array.from(nodeUrlSet.value).map(url => ({
        slice: getNodeName(url),
        url: url,
        status: globleStatus.get(url)
    }))
})

function getSubcription() {
    axios.get(`${apiPrefix}/subcription/${selectedToken.value}`, {
        headers: {
            Authorization: auth.value
        }
    }).then(r => r.data).then(d => {
        d.forEach((v) => {
            nodeUrlSet.value.add(v);
        })
        ElMessage.success(`获取结点${d.length}个`)
    }).catch(e => ElMessage.error(e))
}

function addNodeInfo() {
    const s = nodeUrlSet.value.size
    const nodes = userInput.value.match(/\w+:\/\/\S+/g) || []
    userInput.value = ""

    nodes.forEach(n => nodeUrlSet.value.add(n))
    const newAdd = nodeUrlSet.value.size - s
    if (newAdd) ElMessage.success(`新增${newAdd}个结点`)
    const repeat = nodes.length - newAdd
    if (repeat) ElMessage.warning(`${repeat}个结点重复`)
}

function getNodeName(nodeUrl) {
    let n = decodeURIComponent(nodeUrl.substring(nodeUrl.indexOf("#") + 1))
    if (n.startsWith("http")) {
        n = new URL(n).hostname
    } else if (n.startsWith("sub64://")) {
        n = "sub64://" + new URL(n.replace("sub64://")).hostname
    } else if (n.startsWith("vmess")) {
        function base64ToBytes(base64) {
            const binString = atob(base64);
            return Uint8Array.from(binString, (m) => m.codePointAt(0));
        }
        const o = JSON.parse(new TextDecoder().decode(base64ToBytes(n.substring(8))))

        n = o["ps"]
    }
    return n
}

function saveSubcription() {
    ElMessageBox.alert('这将会覆盖云端配置，确定继续？', '保存订阅信息', {
        confirmButtonText: 'OK',
        callback: (action) => {
            if (action == 'confirm') {
                axios.post(`${apiPrefix}/subcription/${selectedToken.value}`, Array.from(nodeUrlSet.value), {
                    headers: { "Authorization": auth.value, "Content-Type": "application/json" }
                }).then(r => ElMessage.success(`成功保存 ${nodeUrlSet.value.size} 个结点`)).catch(e => ElMessage.error(e))
            } else {
                ElMessage.info("已取消保存")
            }
        }
    })
}

function deleteNodeUrl(nodeUrl) {
    nodeUrlSet.value.delete(nodeUrl);
}

function copyNodeUrl(nodeUrl) {
    setGlobleStatus(nodeUrl, navigator.clipboard.writeText(nodeUrl).then(() => "copied"))
}

function copyAll() {
    navigator.clipboard.writeText(Array.from(nodeUrlSet).join("")).then(() => ElMessage.success("copied"))
}

function checkSubUrl(url) {
    window.open(url.replace("sub64://", ""), "_blank")
    globleStatus.set(url, "tested")
    // cacheStatusPromise(url, axios.get(url).then(r => r.data)) // need CORS
}
</script>