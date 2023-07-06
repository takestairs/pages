<template>
    <div class="container">
        <h2>SimpleGPT</h2>
        <p>使用网页逆向API搭建，使用access_token。支持历史记录（使用LocalStorage）</p>
        <div v-for="(message, index) in historyInfo.messages" :key="index" @change="isAllMessageChecked" class="message">
            <input type="checkbox" class="messageCheck" v-show="false"><!-- 待办，先隐藏 -->
            <GptMessageShow :messageObj="message"></GptMessageShow>
        </div>

        <input type="textarea" v-model="question" placeholder="试一下，反正free。shift+enter快捷发送" @keydown.shift.enter="ask"><button @click="ask">ASK</button>
        <h3>{{status}}</h3>
        <div class="settings">
            请求携带的历史消息数：<input type="number" v-model="historyInfo.maxSendingLength">
            <!-- TODO：支持选择性地保存与删除聊天记录 -->

            <br><!-- 聊天记录的保存与删除 -->
            <button @click='saveHistory'>保存历史聊天至本地</button>
            <button @click='deleteHistory'>删除本地聊天记录</button>
        </div>
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
            status : "",
            historyInfo : {
                messages : [],
                maxSendingLength : 5,
            }
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
    mounted(){
        this.historyInfo = this.getHistory()
    },
    components : {
        // 用以展示一条message的组件
        GptMessageShow
    },
    methods : {
        // 添加历史聊天到数组末尾
        putHistotyMessage(messageObj){
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
            // 当用户输入有效时，将用户输入追加到历史消息末尾，同时清空用户输入
            if(this.question.trim()!=""){
                // 2. 存储用户输入至历史记录
                let userMessage = {
                    role : "user",
                    content : this.question
                }
                this.putHistotyMessage(userMessage);
                // 3. 清空输入框
                this.question = "";
            }
            // 4. 发起请求，从历史消息数组中解析需要发送的消息
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
        },
        // 保存历史记录
        saveHistory(){
            localStorage.setItem("history", JSON.stringify(this.historyInfo))
        },
        // 删除历史记录
        deleteHistory(){
            localStorage.clear()
        },
        // 解析历史记录，无历史记录时返回默认值
        getHistory(){
            let localHistory = JSON.parse(localStorage.getItem("history"));
            if(!localHistory){
                // 本地历史为空，返回默认值
                return {
                    messages : [],
                    maxSendingLength : 5,
                }
            }
            return localHistory;
        },
        // @NotUsed
        // 全选或取消全选 消息框
        selectAll(){
            if(!this.isAllMessageChecked()){
                $(".messageCheck").attr("checked",true)
            }
        },
        // 是否全部消息复选框已勾选，返回 true | false。作为计算属性无效？
        // 附带修改全选按钮文本
        isAllMessageChecked(){
            console.log("isAllMessageChecked...");
            let boxes = $(".messageCheck")
            for(let i = 0; i < boxes.length; i++){
                if(boxes[i].checked == false){
                    this.settingInfo.selectText = "全选历史消息"
                    return false;
                }
            }
            this.settingInfo.selectText = "取消全选历史消息"
            return true
        }
    }
}
</script>

<style scoped>
    .container {
        /* max-width: 600px; */
        margin: 0 auto;
        padding: 20px;
    }

    h2 {
        color: #333;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    h3 {
        font-size: 18px;
        margin-top: 10px;
    }
    p {
        color: #666;
        font-size: 16px;
        margin-bottom: 10px;
    }

    input[type="number"] {
        width: 50px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    input[type="textarea"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 20px;
    }
    button {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #337ab7;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .message {
        margin-top: 20px;
        background-color: #f5f5f5;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .settings {
        margin-top: 20px;
    }
</style>