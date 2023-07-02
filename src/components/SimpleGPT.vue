<template>
    <div>
        <h2>SimpleGPT</h2>
        <p>使用网页逆向API搭建，使用access_token。支持历史记录，但不支持缓存（cookie），刷新就没了。</p>

        <div v-for="(message, index) in historyInfo.messages" :key="index">
            <GptMessageShow :messageObj="message"></GptMessageShow>
        </div>

        <input type="text" v-model="question" placeholder="试一下，反正free" @keydown.enter="ask"><button @click="ask">ASK</button>
        <h3>{{status}}</h3>
    </div>
</template>

<script>
import $ from 'jquery'
import GptMessageShow from './GptMessageShow.vue'

export default {
    data() {
        return {
            question : "",
            respose : {},
            historyInfo : {
                messages : [
                    {
                        role : "user",
                        content : "这是一条测试消息"
                    },
                    {
                        role : "assistant",
                        content : "这是一条测试消息"
                    }
                ],
                maxSendingLength : 5,
            },
            status : ""
        }
    },
    computed : {        
        // 真正用以发送的message
        sendMessageArrayStr(){
            let subMessage = this.historyInfo.messages.slice(-this.historyInfo.maxSendingLength);            
            return JSON.stringify(subMessage);
        },
        // ajax 的请求体
        requestBody(){
            return `
            {
                "messages": ${this.sendMessageArrayStr},
                "stream": false,
                "model": "gpt-3.5-turbo",
                "temperature": 1,
                "presence_penalty": 0
            }`;
        }
    },
    components : {
        // 用以展示一条message的组件
        GptMessageShow
    },
    methods : {
        // 添加历史聊天到数组末尾
        putHistotyMessage(messageObj){
            /*
            {
                "role": "assistant",
                "content": "Hello! How can I assist you today?"
            }
            */
            // 存储有效聊天历史
            if(messageObj){
                this.historyInfo.messages.push(messageObj);
            }
        },
        // 迭代方式获取级联属性，一旦为 undefined 立即返回，避免报错
        getSubProto(obj, keyArray){
            let temp = obj;
            for (let i = 0; i < keyArray.length; i++) {
                temp = temp[keyArray[i]];
                // debugger
                if(!temp){
                    return undefined;
                }
            }
            return temp;
        },
        // 发起 AJAX，获取 API 响应
        ask(){
            // 1. 修改状态，提示用户
            this.status = "GPT思考中..."
            // 2. 存储用户输入至历史记录
            let userMessage = {
                role : "user",
                content : this.question
            }
            debugger
            this.putHistotyMessage(userMessage);
            // 3. 清空输入框
            this.question = "";
            // 4. 发起请求
            $.post({
                url : "https://api-gpt.274452.eu.org/v1/chat/completions",
                data : this.requestBody,
                // contentType : "application/json",
                dataType : "json",
                context : this,
                error(){
                    this.status = "GPT繁忙...等会再来吧"
                },
                success : function(jsonObj){
                    // 更新状态，提示用户
                    this.status = "GPT已答复"
                    // 记录这一次的响应
                    this.respose = jsonObj;
                    // 直接记录响应的消息到历史记录
                    this.putHistotyMessage(this.getSubProto(jsonObj,["choices","0","message"]));
                }
            })
        }
    }
}
</script>

<style>

</style>