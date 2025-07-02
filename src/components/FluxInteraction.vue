<template>
    <div class="container">
        <el-form label-position="top" class="responsive-form">

            <!-- 长文本输入 -->
            <el-form-item label="提示词 Prompt" required>
                <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="inputText" placeholder="请输入生成图片的描述..."
                    clearable></el-input>
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
                    <el-form-item label="生成模型" required>
                        <el-select v-model="model">
                            <el-option label="flux-dev" value="flux-dev" />
                            <el-option label="flux-schnell" value="flux-schnell" />
                            <el-option label="flux-merged" value="flux-merged" />
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

                    <el-tooltip trigger="hover" placement="top-start" content="图片生成时候的种子值，如果不提供，则算法自动用一个随机生成的数字作为种子。">

                        <el-form-item label="随机种子">
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
                            <el-slider v-model="parameters.steps" :min="1" :max="100" :step="1" show-input></el-slider>
                        </el-form-item>
                    </el-tooltip>

                    <el-tooltip trigger="hover" placement="top-start"
                        content="指导度量值，用于在图像生成过程中调整模型的创造性与文本指导的紧密度。较高的值会使得生成的图像更忠于文本提示，但可能减少多样性；较低的值则允许更多创造性，增加图像变化。默认值为3.5。">
                        <el-form-item label="指导强度">
                            <el-slider v-model="parameters.guidance" :min="1" :max="5" :step="0.1"
                                show-input></el-slider>
                        </el-form-item>
                    </el-tooltip>

                    <!-- <el-form-item label="显存优化">
                        <el-switch v-model="parameters.offload"></el-switch>
                    </el-form-item>

                    <el-form-item label="包含元数据">
                        <el-switch v-model="parameters.add_sampling_metadata"></el-switch>
                    </el-form-item> -->
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


const inputText = ref('')
const prompts = [
    "A chaotic cityscape bathed in the neon glow of streetlights is torn apart by a wild street race, cars launching off ramps and skidding through intersections at breakneck speed. In the foreground, a tricked-out muscle car with oversized rear tires and flaming exhaust burns rubber, leaving a trail of smoke and sparks. The city skyline behind is shattered, as if the force of the speed has cracked reality itself. A metal skull with a checkered bandana grins wickedly from the hood of the lead car, its empty sockets reflecting the chaos.",
    "A silhouette of a person walking away from a birdcage, holding a string attached to a single red balloon, against a pastel sky with clouds, minimalist style, vector illustration",
    "A majestic cat sitting serenely, with a regal expression, adorned with a crown made of intricately intertwined twigs and branches. The cat's dark fur has a glossy sheen, and its piercing, intelligent eyes convey both wisdom and authority. Perched on the cat's shoulder is a small owl, with brown and white speckled feathers, looking curious and observant. The owl's gaze adds to the sense of mysticism in the scene. The background is abstract and neutral, with soft, swirling tones of gray and subtle textures that blend into the atmosphere, creating an ethereal, natural feel. The overall scene conveys a mystical and natural theme, with a harmonious balance between the powerful presence of the cat and the gentle curiosity of the owl",
    "ppstorybook,A towering wizard's tower rising from the depths of an enchanted swamp, its stone walls covered in moss and vines,  glowing lanterns illuminate the tower windows, casting eerie reflections on the murky water,  will-o'-the-wisps flicker in the swamp mist,  strange and wondrous plants grow in the murky depths,  intricate details of wizard's tower architecture, swamp vegetation, and magical lighting, the background a mysterious and atmospheric swamp landscape filled with secrets and magic, rendered in a detailed storybook illustration style with dark, moody colors and soft, glowing highlights.",
    "A beautiful and artistic paper cutout composition depicting a samurai warrior on a horse in an elegant, handcrafted style. The compositions are intricately cut from high-quality textured paper, with soft shadows cast onto the background, adding depth and dimension. Surrounding the samurai warrior are delicate paper cutout bonsai, and swirling decorative elements, creating a sense of traditional japanese art and craftsmanship. The lighting is soft and warm, enhancing the texture of the paper and giving the scene a handmade aesthetic. The background is a pale rising sun in a softly blurred gradient to keep the focus on the intricate details of the paper art",
    "Midday in a Greek Island Village. The whitewashed terraces of a Greek island village gleam under the relentless midday sun. A woven sun hat, long abandoned, rests on a stone ledge, its brim fluttering in the warm breeze. The deep blue Aegean Sea stretches endlessly below, shimmering beneath the bright sky. Pink bougainvillea cascades down sun-bleached walls, their petals drifting lazily across empty streets. A wooden door stands ajar, revealing only shadows within. The scent of salt and jasmine fills the air, but the village remains utterly still, as if waiting. The scene is bathed in warm golden and orange hues, with soft light reflecting off the rippling water. The foreground features grand buildings with ornate domes and towers, surrounded by lush greenery. A bustling waterfront with small boats and bridges connects various districts, filled with people dressed in elegant attire. The background displays rolling hills and distant mountains under a sky dotted with fluffy clouds. The overall aesthetic combines a painterly impressionism with hyperrealist details, evoking a sense of wonder and vibrant life."
]
const model = ref("")
const parameters = reactive({
    "size": "768*1024",
    "seed": null,
    "steps": 30,
    "guidance": 3.5,
    "offload": true,
    "add_sampling_metadata": false
})
const isGenerating = ref(false)
const imageUrl = ref(null)
const timeCost = ref(0)

watch(model, (value) => {
    if (value === "flux-schnell") {
        parameters.steps = 4
    } else if (value === "flux-dev") {
        parameters.steps = 50
    } else if (value === "flux-merged") {
        parameters.steps = 30
    }
})
onMounted(() => {
    model.value = "flux-dev"
})

function generateImage() {
    axios.post(apiPrefix + "/aigc/text_to_image/image-synthesis", {
        "model": model.value,
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