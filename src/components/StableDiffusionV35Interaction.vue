<template>
    <div class="container">
        <el-form label-position="top" class="responsive-form">

            <!-- Prompt 输入 -->
            <el-form-item label="提示词 Prompt" required>
                <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="input.prompt" placeholder="请输入生成图片的描述..."
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="负面提示词 Prompt">
                <el-input type="textarea" :autosize="{ minRows: 1 }" v-model="input.negative_prompt" placeholder=""
                    clearable></el-input>
            </el-form-item>

            <el-form-item label="Prompt 列表" v-show="input.prompt.length == 0">
                <el-select @change="selectPrompt">
                    <el-option v-for="item in prompts" :key="item" :value="item"
                        :label="item.prompt" />
                </el-select>
            </el-form-item>

            <!-- 图片参考 -->
            <el-form-item label="参照图片">
                <el-input v-model="input.init_image" placeholder="输入图片网址" clearable style="width: 60%;" />

                <el-upload action="#" :auto-upload="false" :on-change="selectPic" :show-file-list="false"
                    accept="image/*" style="margin-left: 10%; width: 30%;">
                    <el-button type="primary">选择图片</el-button>
                </el-upload>

                <el-image v-if="input.init_image.length" :src="input.init_image" fit="scale-down"
                    style="margin-top: 10px; height: 300px;"></el-image>
            </el-form-item>

            <!-- 参数调节区域 -->
            <el-row :gutter="20">
                <!-- 左侧参数列 -->
                <el-col :xs="24" :sm="12">
                    <el-form-item label="生成模型" required>
                        <el-select v-model="model">
                            <el-option v-for="item in models" :key="item" :value="item" :lable="item" />
                        </el-select>
                    </el-form-item>

                    <el-space>
                        <el-form-item label="图片宽">
                            <el-input-number v-model="parameters.width" :min="512" :max="1024"
                                :step="128"></el-input-number>
                        </el-form-item>

                        <el-form-item label="图片宽">
                            <el-input-number v-model="parameters.height" :min="512" :max="1024"
                                :step="128"></el-input-number>
                        </el-form-item>
                    </el-space>

                    <el-tooltip trigger="hover" placement="top-start" content="图片生成时候的种子值，如果不提供，则算法自动用一个随机生成的数字作为种子。">

                        <el-form-item label="随机种子" required>
                            <el-input v-model="parameters.seed" style="max-width: 60%;"></el-input>
                            <el-button @click="parameters.seed = Math.floor(Math.random() * 4294967290)"
                                style="margin-left: 20px">随机
                            </el-button>
                        </el-form-item>
                    </el-tooltip>
                </el-col>

                <!-- 右侧参数列 -->
                <el-col :xs="24" :sm="12">

                    <el-tooltip trigger="hover" placement="top-start"
                        content="图片生成的推理步数，如果不提供，则默认为30。 flux-schnell 模型官方默认 steps 为4，flux-dev 模型官方默认 steps 为50。">
                        <el-form-item label="推理步数">
                            <el-slider v-model="parameters.steps" :min="1" :max="500" :step="1" show-input></el-slider>
                        </el-form-item>
                    </el-tooltip>

                    <el-tooltip trigger="hover" placement="top-start"
                        content="用于指导生成的结果与用户输入的prompt的贴合程度，越高则生成结果与用户输入的prompt更相近。目前默认4.5，倾向于输入4～5内的值。">
                        <el-form-item label="指导强度">
                            <el-slider v-model="parameters.cfg" :min="1" :max="10" :step="0.1" show-input></el-slider>
                        </el-form-item>
                    </el-tooltip>

                    <el-tooltip trigger="hover" placement="top-start" content="偏移量，用于调整生成内容的某些特性或参数。默认为3.0。">
                        <el-form-item label="偏移量">
                            <el-slider v-model="parameters.shift" :min="1" :max="10" :step="0.1" show-input></el-slider>
                        </el-form-item>
                    </el-tooltip>
                </el-col>
            </el-row>


            <!-- 生成按钮 -->
            <el-button type="primary" @click="generateImage" :loading="isGenerating" style="width: 60%;">
                生成图片
            </el-button>
            <el-text v-if="imageUrl" type="info" style="margin-left: 20px">耗时{{ timeCost }}秒</el-text>

            <!-- 图片显示 -->
            <el-image v-if="imageUrl" :src="imageUrl" fit="contain"
                style="margin-top: 40px; align-items: center;"></el-image>
        </el-form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { apiPrefix, auth } from "../const/commom";
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import prompts from "../const/sdPrompts"

const models = [
    "stable-diffusion-3.5-large",
    "stable-diffusion-3.5-large-turbo"
]

const input = reactive({
    "prompt": "",
    "negative_prompt": "",
    "init_image": ""
})
const model = ref("")

const parameters = reactive({
    "width": 768,
    "height": 1024,
    "steps": 40,
    "seed": Math.floor(Math.random() * 4294967290),
    "cfg": 4.5,
    "shift": 3.0
})

const isGenerating = ref(false)
const imageUrl = ref(null)
const timeCost = ref(0)

onMounted(() => {
    model.value = models[0]
})

function selectPrompt(p) {
    input.prompt = p.prompt
    input.negative_prompt = p.negative_prompt || ""
}
function selectPic(uploadFile) {
    const file = uploadFile.raw;

    if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择有效的图片文件');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        input.init_image = e.target.result;
    };
    reader.readAsDataURL(file);
}
function generateImage() {
    axios.post(apiPrefix + "/aigc/text_to_image/image-synthesis", {
        "model": model.value,
        "input": input,
        "parameters": {
            "size": `${parameters.width}*${parameters.height}`,
            "steps": parameters.steps,
            "seed": parameters.seed,
            "cfg": parameters.cfg,
            "shift": parameters.shift
        }
    }, {
        headers: {
            "Authorization": auth.value
        }
    }).then(({ data }) => {
        if (data.message) {
            ElMessage.error(data.message)
            return
        } else {
            isGenerating.value = true
            return data.output.task_id
        }
    }).then(id => {
        if (!id) return

        const tid = setInterval(() => {
            axios.get(`${apiPrefix}/aigc/text_to_image/${id}`).then(({ data }) => {
                const task_status = data.output.task_status
                if (task_status === "PENDING" || task_status === "RUNNING") {
                    return
                }
                if (task_status === "SUCCEEDED") {
                    imageUrl.value = data.output.results[0].url
                    timeCost.value = (Date.parse(data.output.end_time) - Date.parse(data.output.submit_time)) / 1000
                } else {
                    ElMessage.error(data.output.message || `task_status: ${task_status}`)
                }
                isGenerating.value = false
                clearInterval(tid)
            })
        }, 3000)
    })
}
</script>