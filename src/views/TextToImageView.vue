<template>
    <div class="container">
        <el-form label-position="top" class="responsive-form">

            <!-- 长文本输入 -->
            <el-form-item label="提示词 Prompt" required>
                <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="inputText"
                    placeholder="请输入生成图片的描述..." clearable></el-input>
            </el-form-item>

            <el-form-item label="Prompt 列表" v-show="inputText.length == 0">
                <el-select v-model="inputText">
                    <el-option v-for="item in prompts" :key="item" :value="item" />
                </el-select>
            </el-form-item>

            <!-- 参数调节区域 -->
            <el-row :gutter="20">
                <!-- 左侧参数列 -->
                <el-col :xs="24" :sm="12">
                    <el-form-item label="生成模型">
                        <el-select v-model="model">
                            <el-option label="flux-schnell" value="flux-schnell" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="图片尺寸">
                        <el-select v-model="parameters.size">
                            <el-option label="512*1024" value="512*1024" />
                            <el-option label="768*512" value="768*512" />
                            <el-option label="768*1024" value="768*1024" />
                            <el-option label="1024*576" value="1024*576" />
                            <el-option label="576*1024" value="576*1024" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="随机种子">
                        <el-input-number v-model="parameters.seed" :min="0" controls-position="right"
                            style="width: 70%"></el-input-number>
                        <el-button @click="parameters.seed = Math.floor(Math.random() * Date.now())"
                            style="margin-left: 20px">随机
                        </el-button>
                    </el-form-item>
                </el-col>

                <!-- 右侧参数列 -->
                <el-col :xs="24" :sm="12">
                    <el-form-item label="生成步数">
                        <el-slider v-model="parameters.steps" :min="1" :max="10" :step="1" show-input></el-slider>
                    </el-form-item>

                    <el-form-item label="引导强度">
                        <el-slider v-model="parameters.guidance" :min="1" :max="5" :step="0.1" show-input></el-slider>
                    </el-form-item>

                    <el-form-item label="显存优化">
                        <el-switch v-model="parameters.offload"></el-switch>
                    </el-form-item>

                    <el-form-item label="包含元数据">
                        <el-switch v-model="parameters.add_sampling_metadata"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 生成按钮 -->
            <el-button type="primary" @click="generateImage" :loading="isGenerating" style="width: 70%;">
                生成图片
            </el-button>
            <el-text type="info" style="margin-left: 20px">耗时{{ timeCost }}秒</el-text>

            <!-- 图片显示 -->
            <el-image :src="imageUrl" fit="contain" style="margin-top: 40px; align-items: center;"></el-image>
        </el-form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { apiPrefix, auth } from "../const/commom";
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';


const inputText = ref('')
const prompts = [
    "A chaotic cityscape bathed in the neon glow of streetlights is torn apart by a wild street race, cars launching off ramps and skidding through intersections at breakneck speed. In the foreground, a tricked-out muscle car with oversized rear tires and flaming exhaust burns rubber, leaving a trail of smoke and sparks. The city skyline behind is shattered, as if the force of the speed has cracked reality itself. A metal skull with a checkered bandana grins wickedly from the hood of the lead car, its empty sockets reflecting the chaos.",
    "A silhouette of a person walking away from a birdcage, holding a string attached to a single red balloon, against a pastel sky with clouds, minimalist style, vector illustration",
    "A majestic cat sitting serenely, with a regal expression, adorned with a crown made of intricately intertwined twigs and branches. The cat's dark fur has a glossy sheen, and its piercing, intelligent eyes convey both wisdom and authority. Perched on the cat's shoulder is a small owl, with brown and white speckled feathers, looking curious and observant. The owl's gaze adds to the sense of mysticism in the scene. The background is abstract and neutral, with soft, swirling tones of gray and subtle textures that blend into the atmosphere, creating an ethereal, natural feel. The overall scene conveys a mystical and natural theme, with a harmonious balance between the powerful presence of the cat and the gentle curiosity of the owl, <lora:aidmaImageUpraderv0.3:0.4> aidmaimageupgrader,  <lora:aidmaMJ6.1v0.4:0.6> aidmaMJ6.1,  <lora:cheats:1>",
]
const model = ref("flux-schnell")
const parameters = reactive({
    "size": "768*1024",
    "seed": null,
    "steps": 4,
    "guidance": 3.5,
    "offload": true,
    "add_sampling_metadata": false
})
const isGenerating = ref(false)
const imageUrl = ref("https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg")
const timeCost = ref(0)

function generateImage() {
    axios.post(apiPrefix + "/aigc/text_to_image", {
        "model": "flux-schnell",
        "input": {
            "prompt": inputText.value
        },
        "parameters": parameters
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