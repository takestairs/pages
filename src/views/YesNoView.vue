<template>
    <el-card style="max-width: 480px">
        <el-space warp>
            <el-input clearable type="text" v-model="question" placeholder="你想问什么？" @focus="clear"
                @keydown.enter="ask"></el-input>
            <el-button @click="ask">ASK</el-button>

            <h4 v-if="answer">{{ answer.toLocaleUpperCase() }}</h4>
        </el-space>

        <template v-if="gif" #footer>
            <img :src="gif">
        </template>

    </el-card>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            question: "",
            answer: "",
            gif: "",
            querying: null
        }
    },
    methods: {
        clear() {
            this.answer = ""
            this.gif = ""
            this.question = ""
        },
        ask() {
            if (this.querying) {
                return
            }
            this.querying = axios.get(`https://yesno.wtf/api?_=${new Date().getTime()}`).then(r => r.data).then(data => {
                this.answer = data.answer;
                this.gif = data.image;
                this.querying = null
            })
        }
    }
}
</script>
