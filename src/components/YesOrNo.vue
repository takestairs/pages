<template>
    <div>
        <h2>问一个问题，以“?”结尾</h2>
        <input type="text" v-model="question" placeholder="你想问什么？" @focus="clear" @keydown.enter="check">
        <h4 v-if="respose">{{respose}}</h4>
        <img v-if="gif" :src="gif">
    </div>
</template>

<script>
import $ from 'jquery';
export default {
    data(){
        return {
            question : "",
            respose : "",
            gif : ""
        }
    },
    methods: {
        check(){
            this.respose = this.checkQuestion();
        }
        ,clear(){
            this.respose = "";
            this.gif = ""
        }
        ,checkQuestion(){
            let c = this.question.charAt(this.question.length-1);
            if(this.question.length < 2){
                return "问题太短";
            } else if (c == '?' || c == "？") {
                return "正在思考";
            } else {
                return "请以?结尾哦";
            }
        }
        ,query(){            
            $.get({
                url : "https://yesno.wtf/api",
                data : "_="+ new Date().getTime(),
                async : true,
                context: this,
                success : function(json){
                    this.respose = json.answer;
                    this.gif = json.image;
                }
            })

        }
    },
    watch: {
        respose : function(newR, oldR){
            // this.respose == newR
            if(newR == "正在思考") {
                this.query()
            }
        }
    }
}
</script>
