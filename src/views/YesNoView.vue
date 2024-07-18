<template>
    <input type="text" v-model="question" placeholder="你想问什么？" @focus="clear" @keydown.enter="ask"> <button
        @click="ask">ASK</button>
    <h4 v-if="answer">{{ answer.toLocaleUpperCase() }}</h4>
    <img v-if="gif" :src="gif">
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
