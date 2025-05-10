<template>
    <div class="container">
        <el-space warp>
            <el-select v-model="branch" placeholder="选择一个分支" style="width: 100px" @change="getEndpoints">
                <el-option label="全部" value="endpoints" />
                <el-option label="失败" value="failed_endpoints" />
                <el-option label="可用" value="successful_endpoints" />
            </el-select>
            <el-button @click="getEndpoints">获取端点</el-button>
            <el-input v-model="prompt" style="width: 240px" />
        </el-space>

        <el-card shadow="hover">
            <el-scrollbar height="300px">
                <div v-for="item in items" :key="item.src" class="list-item"
                    :class="{ 'selected': isSelectedItem(item) }" @click="selectItem(item)">
                    <div class="item-header">
                        <span class="src">{{ item.src }}</span>
                        <el-tag type="info">{{ item.models[0] }}</el-tag>
                    </div>

                    <el-descriptions :column="1" border v-if="isSelectedItem(item)">
                        <el-descriptions-item label="Base URL">{{ selectedItem.base_url }}</el-descriptions-item>
                        <el-descriptions-item label="API Key">{{ maskKey(selectedItem.key) }}</el-descriptions-item>
                        <el-descriptions-item label="可用模型">
                            <el-tag v-for="model in selectedItem.models" :key="model" type="info" class="model-tag">
                                {{ model }}
                            </el-tag>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-scrollbar>
        </el-card>

        <el-card class="detail-card" v-if="selectedItem">
            <template #header>
                <div class="card-header">
                    <span>详细信息 - {{ selectedItem.src }}</span>
                </div>
            </template>

            <el-descriptions :column="1" border>
                <el-descriptions-item label="Base URL">{{ selectedItem.base_url }}</el-descriptions-item>
                <el-descriptions-item label="API Key">{{ maskKey(selectedItem.key) }}</el-descriptions-item>
                <el-descriptions-item label="可用模型">
                    <el-tag v-for="model in selectedItem.models" :key="model" type="info" class="model-tag">
                        {{ model }}
                    </el-tag>
                </el-descriptions-item>
            </el-descriptions>

            <div class="action-buttons">
                <el-button type="primary" @click="testModel" :loading="testing">
                    测试聊天接口
                </el-button>

                <el-button type="success" @click="fetchModels" :loading="fetching">
                    更新模型列表
                </el-button>
            </div>

            <div v-if="testResult" class="result-section">
                <el-divider />
                <h3>测试结果：</h3>
                <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
            </div>
        </el-card>

        <el-dialog v-model="errorVisible" title="错误提示" width="80%">
            <el-alert type="error" :closable="false">
                {{ errorMessage }}
            </el-alert>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { apiPrefix, auth } from '../const/commom';
import { makeRefWithLocalStorge } from '../util/ReactiveUtil';

const branch = makeRefWithLocalStorge("", "endpoints-branch")
const items = ref([])
const prompt = ref("just say 1")

const selectedItem = ref(null)
const testResult = ref(null)
const testing = ref(false)
const fetching = ref(false)
const errorVisible = ref(false)
const errorMessage = ref('')

const selectItem = (item) => {
    selectedItem.value = item
    testResult.value = null
}

const maskKey = (key) => {
    return key.slice(0, 6) + '*'.repeat(key.length - 10) + key.slice(-4)
}

const testModel = async () => {
    testing.value = true
    try {
        const response = await axios.post(
            `${selectedItem.value.base_url}/v1/chat/completions`,
            {
                model: selectedItem.value.models[0],
                messages: [{ role: 'user', content: 'Hello!' }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${selectedItem.value.key}`
                }
            }
        )
        testResult.value = response.data
    } catch (error) {
        showError('接口测试失败：' + error.message)
    } finally {
        testing.value = false
    }
}

const fetchModels = async () => {
    fetching.value = true
    try {
        const response = await axios.get(
            `${selectedItem.value.base_url}/v1/models`,
            {
                headers: {
                    'Authorization': `Bearer ${selectedItem.value.key}`
                }
            }
        )
        selectedItem.value.models = response.data.data.map(m => m.id)
        ElMessage.success('模型列表更新成功')
    } catch (error) {
        showError('获取模型失败：' + error.message)
    } finally {
        fetching.value = false
    }
}

const showError = (msg) => {
    errorMessage.value = msg
    errorVisible.value = true
}

function getEndpoints() {
    axios.get(apiPrefix + "/upstash/" + branch.value, {
        headers: {
            Authorization: auth.value
        }
    }).then(res => {
        items.value = res.data
        ElMessage.success("获取成功")
    })
}

function isSelectedItem(item) {
    if (selectItem.value == null) return false
    return selectItem.value.base_url == item.base_url && selectItem.value.key == item.key
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.detail-card {
    flex: 2;
}

.list-item {
    padding: 12px;
    margin: 4px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.list-item:hover {
    background-color: #f5f7fa;
}

.selected {
    border-color: #409eff;
    background-color: #ecf5ff;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.src {
    font-weight: 500;
}

.action-buttons {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.model-tag {
    margin: 2px;
}

.result-section pre {
    background: #f8f8f8;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
}

@media (max-width: 768px) {
    .container {
        padding: 8px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .src {
        font-size: 14px;
    }

    :deep(.el-descriptions__label) {
        width: 80px;
    }
}
</style>