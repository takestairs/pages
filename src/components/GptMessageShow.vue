<template>
    <span v-if="messageObj">
        <span :class="name">{{name}}</span>
        <div class="content" v-html="contentHTML"></div>
    </span>
</template>

<script>
const marked = require('marked');
export default {
    data(){
        return {
            "roleName": {
                "assistant" : "GPT",
                "user" : "User"
            }
        }
    },
    props : ["messageObj"],
    computed : {
        name(){
            return this.roleName[this.messageObj.role]
        },
        contentHTML(){
            return marked.parse(this.messageObj.content)
        }
    }
}
</script>

<style scoped>
    .User {
        color: #333;
        font-weight: bold;
    }
    .GPT {
        color: #337ab7;
        font-weight: bold;        
    }
    .content {
        margin-top: 5px;
        width: auto;
    }
</style>