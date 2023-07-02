<template>
    <div v-if="messageObj">
        <h3 :class="name">{{name}}</h3>
        <p class="content">{{messageObj.content}}</p>
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
</style>