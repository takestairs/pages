<template>
    <el-text tag="div" type="info">{{ content }}</el-text>
    <el-text tag="div" type="info" style="text-align: right;">{{ author }}</el-text>

    <el-space wrap>
        <el-select v-model="lang" @change=updateSentence style="width: 80px" size="small">
            <el-option value="zh" label="中文"></el-option>
            <el-option value="en" label="英文"></el-option>
        </el-select>

        <el-button :icon="Refresh" @click=updateSentence circle size="small">
            <el-icon>
                <Refresh />
            </el-icon>
        </el-button>
    </el-space>
</template>

<script>
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            content: "",
            author: "",
            lang: "zh"
        }
    },
    mounted() {
        this.updateSentence()
    },
    methods: {
        updateSentence() {
            if (this.lang == "zh") {
                this.getChineseContent().then(s => {
                    this.content = s.content
                    this.author = s.author
                })
            } else if (this.lang = "en") {
                this.getEnglishContent().then(s => {
                    this.content = s.content
                    this.author = s.author
                })
            } else {
                const s = { content: "未知语言", author: "" }
                this.content = s.content
                this.author = s.author
            }
        },
        async getEnglishContent() {
            try {
                const res = await axios.get(`https://api.quotable.io/random?_=${new Date().getTime()}`);
                const data = res.data;
                return { content: data.content, author: "by " + data.author };
            } catch (error) {
                console.error(error);
                return { content: "Error, try again.", author: "" };
            }
        },
        async getChineseContent() {
            try {
                const r = await axios.get(`https://v1.hitokoto.cn?_=${new Date().getTime()}`);
                const data = r.data;
                let suffix = data.from_who;
                if (suffix == null || suffix === "佚名" || suffix === "原创") {
                    suffix = "";
                } else {
                    suffix = " by " + suffix;
                }
                return { content: data.hitokoto, author: data.from + suffix };
            } catch (error) {
                console.error(error);
                return { content: "出错了，请重试。", author: "" };
            }
        }
    }
}
</script>