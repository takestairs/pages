<template>
    <div>
        <h2>SimpleGPT</h2>
        <p>使用网页逆向API搭建，使用access_token</p>
        <input type="text" v-model="question" placeholder="试一下，反正free" @keydown.enter="ask"><button @click="ask">ASK</button>

        <template v-if="status">
            <h3>GPT {{status}}</h3>
            <div>{{content}}</div>
        </template>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    data() {
        return {
            question : "",
            respose : { },
            status : ""
        }
    },
    computed : {
        content(){
            return this.getSubProto(this.respose,["choices","0","message","content"])
            // this.respose.choices[0].message.content;
        }
    },
    methods : {
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
        ask(){
            $.post({
                url : "http://[2001:470:1f21:114::87]/v1/chat/completions",
                data :
                `{
                    "model": "text-davinci-002-render-sha",
                    "messages": [
                        {"role": "user", "content": "${this.question}"}
                    ]
                }`,
                // contentType : "application/json",
                dataType : "json",
                context : this,

                beforeSend: function(xhr){
                    this.status = "思考中..."
                },
                success : function(jsonObj){
                    this.status = "says:"
                    this.respose = jsonObj;
                    /*
                        {
                            "id": "chatcmpl-QXlha2FBbmROaXhpZUFyZUF3ZXNvbWUK",
                            "object": "chat.completion",
                            "created": 0,
                            "model": "gpt-3.5-turbo-0301",
                            "usage": {
                                "prompt_tokens": 0,
                                "completion_tokens": 0,
                                "total_tokens": 0
                            },
                            "choices": [
                                {
                                    "index": 0,
                                    "message": {
                                        "role": "assistant",
                                        "content": "Hello! How can I assist you today?"
                                    },
                                    "finish_reason": null
                                }
                            ]
                        }
                     */
                }
            })
        }
    }
}
</script>

<style>

</style>