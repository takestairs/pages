<template>
    <div v-if="messageObj">
        <span :class="name">{{name}}</span>
        <span class="content">{{messageObj.content}}</span>
    </div>
</template>

<script>
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
        }
    }
}
</script>

<style scoped>
    .GPT {
        color: aqua;
        text-align: left;
    }
    .User {
        color: cadetblue;
        text-align: left;
    }
    .content{
        color: black;
    }
</style>