<template>
    <el-space warp>
        <el-select v-model="branch" placeholder="Select a Branch" style="width: 80px" @change="getEndpoints">
            <el-option label="全部" value="endpoints" />
            <el-option label="失败" value="failed_endpoints" />
            <el-option label="可用" value="successful_endpoints" />
        </el-select>
        <el-button @click="getEndpoints">获取端点</el-button>
        <el-button @click="clean">清空端点</el-button>

        <!-- <el-text type="info">{{ nodeUrlSet.size }}</el-text>

        <el-input v-model="userInput" />
        <el-button @click="addNodeInfo">添加结点</el-button>
        <el-button @click="nodeUrlSet.clear()">清空结点</el-button>
        <el-button @click="saveSubcription">保存结点</el-button>
        <el-button @click="copyAll">复制全部</el-button> -->
    </el-space>
    <el-divider />
    <el-row :gutter="20">
        <el-col :span="6">
            <el-text type="info">Endpoints List ({{ endpoints.length }})</el-text>

            <el-table :data="showEndpointInfos" height="450px" highlight-current-row @current-change="selectChange">
                <el-table-column type="index" width="50px" />
                <el-table-column label="src" prop="src" show-overflow-tooltip></el-table-column>
                <el-table-column label="hash" prop="hash" show-overflow-tooltip></el-table-column>
            </el-table>

        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="6">
            <el-card style="max-height: 450px" v-show="selectedEndpointHash">
                <template #header>
                    <el-space warp>
                        <el-text type="primary">src: </el-text><el-text>{{ selectedEndpoint.src }}</el-text>
                        <el-divider direction="vertical" />
                        <el-text type="info">hash: </el-text>
                        <el-text>{{ djb2Hash(selectedEndpoint.src + selectedEndpoint.key) }}</el-text>
                    </el-space>
                </template>

                <el-text type="danger">base_url: </el-text><br><el-text>{{ selectedEndpoint.base_url }}</el-text>
                <br>
                <el-text type="danger">key: </el-text><br><el-text truncated>{{ selectedEndpoint.key }}</el-text>

                <el-table :data="selectedEndpointModelMappingArray" height="200px">
                    <el-table-column label="models" prop="model"></el-table-column>
                    <el-table-column label="mappings" prop="mapping" show-overflow-tooltip></el-table-column>
                    <el-table-column label="actions">
                        <template #default="scope">
                            <el-button @click="checkModel(scope.row.mapping)">check</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <template #footer>
                    <el-button @click="copyEndpoint(selectedEndpoint)">复制这个Endpoint</el-button>
                </template>
            </el-card>
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="6">
            <el-card style="max-height: 450px" v-show="selectedEndpointHash">
                <template #header>
                    Prompt: <el-input v-model="prompt" style="width: 240px" />
                </template>

                <p>hash: <el-text type="info">{{ lastCheckResult.endpointHash }}</el-text></p>
                <p>prompt: {{ lastCheckResult.checkPrompt }}</p>
                <p>checkModel: <el-text type="info">{{ lastCheckResult.checkModel }}</el-text></p>
                <p>responseModel:
                    <el-text :type="lastCheckResult.responseModel == lastCheckResult.checkModel ? 'success' : 'danger'">
                        {{ lastCheckResult.responseModel }}</el-text>
                </p>
                <el-divider />
                <el-text type="info">{{ lastCheckResult.responseContent }}</el-text>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import axios from 'axios';
import { auth } from '../util/const';
import { computed, onMounted, reactive, ref } from 'vue';
import { makeRefWithLocalStorge } from '../util/ReactiveUtil';
import { ElMessage } from 'element-plus';

const branch = makeRefWithLocalStorge("", "endpoints-branch")
const selectedEndpoint = ref({
    "src": "",
    "base_url": "",
    "key": "",
    "model_mapping": {},
    "models": []
});
const endpoints = ref([])
const showEndpointInfos = computed(() => {
    return endpoints.value.map((endpoint, index) => {
        return {
            src: endpoint.src,
            index,
            hash: djb2Hash(endpoint.src + endpoint.key)
        }
    })
})
const selectedEndpointModelMappingArray = computed(() => {
    const mappingModels = []
    for (let e of selectedEndpoint.value.models) {
        mappingModels.push({
            model: e,
            mapping: selectedEndpoint.value.model_mapping[e] || e
        })
    }
    return mappingModels
})
const selectedEndpointHash = computed(() => djb2Hash(selectedEndpoint.value.src + selectedEndpoint.value.key))
const lastCheckResult = ref({
    "endpointHash": 0,
    "checkModel": "",
    "checkPrompt": "",
    "responseModel": "",
    "responseContent": ""
})
const prompt = ref("just say 1")
function djb2Hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
    }
    return hash >>> 0; // 使用无符号右移将结果转换为32位无符号整数
}
function selectChange(endpoint) {
    if (endpoint) {
        selectedEndpoint.value = endpoints.value[endpoint.index]
    }
}
function clean() {
    selectedEndpoint.value = {
        "src": "",
        "base_url": "",
        "key": "",
        "model_mapping": {},
        "models": []
    }
    lastCheckResult.value = {
        "endpointHash": 0,
        "checkModel": "",
        "checkPrompt": "",
        "responseModel": "",
        "responseContent": ""
    }
    endpoints.value = []
}
function checkModel(realModel) {
    axios.post(selectedEndpoint.value.base_url + "/v1/chat/completions", {
        "model": realModel,
        "messages": [
            {
                "role": "user",
                "content": prompt.value
            }
        ],
        "stream": false
    }, {
        headers: {
            Authorization: "Bearer " + selectedEndpoint.value.key
        }
    }).then(res => {
        lastCheckResult.value = {
            "endpointHash": selectedEndpointHash.value,
            "checkModel": realModel,
            "checkPrompt": prompt.value,
            "responseModel": res.data.model,
            "responseContent": res.data.choices[0].message.content
        }
        ElMessage.success("检查成功: " + res.data.choices[0].message.content)
    })
}
function getEndpoints() {
    axios.get("https://api.274452.xyz/upstash/" + branch.value, {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        clean()
        endpoints.value = res.data
        ElMessage.success("获取成功")
    })
}
function copyEndpoint(e) {
    navigator.clipboard.writeText(JSON.stringify(e)).then(() => ElMessage.success("复制成功"))
}
onMounted(() => {
    branch.value = localStorage.getItem("endpoints-branch")
    getEndpoints()
})
</script>
