<template>
    <div>
        <div>{{ content }}</div>
        <div id="author">{{ author }}</div>
        <button @click=updateSentence>换一句</button>&nbsp;&nbsp;&nbsp;
        <select v-model="lang" @change=updateSentence>
            <option>zh</option>
            <option>en</option>
        </select>
    </div>
</template>

<script>
import axios from 'axios'

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

<style>
#author {
    text-align: right;
}
</style>