<template>
    <div>
        <form>
            <h2>{{msg}}</h2>
            <hr>
            用户名：<input type="text" v-model.lazy="registInfo.username"><br>
            <br>
            密码：<input type="password" v-model.lazy="registInfo.password"><br>
            <br>
            年龄：<input type="number" v-model.lazy="registInfo.age"><br>
            <br>
            性别：<input type="radio" v-model="registInfo.gender" value="1">男
            <input type="radio" v-model="registInfo.gender" value="0">女<br>
            <br>
            爱好：<input type="checkbox" v-model="registInfo.interest" value="smoke">抽烟 
            <input type="checkbox" v-model="registInfo.interest" value="drink">喝酒 
            <input type="checkbox" v-model="registInfo.interest" value="hair">烫头 
            <br>
            学历：
            <select v-model="registInfo.grade">
                <option value="">请选择学历</option>
                <option value="bk">本科</option>
                <option value="zk">专科</option>
                <option value="ss">硕士</option>
            </select>
            <br><br>
            简介：<textarea cols="25" rows="15" v-model.lazy="registInfo.introduce"></textarea><br>
            <br>
            <input type="checkbox" v-model="isAgree">阅读并接受协议<br>
            <br>
            <button @click.prevent="checkProtocol">注册</button>
        </form>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    data(){
        return {
            msg : 'Vue 表单收集',
            registInfo : {
                username : "",
                password : "",
                age : "",
                gender : "",
                interest : [],
                grade : "",
                introduce : "暂时还没有填写"                        
            },
            isAgree : false
        }
    },
    methods: {
        checkProtocol(){
            if(!this.isAgree){
                alert("请先同意用户协议")
            } else {
                console.log("发生请求",JSON.stringify(this.registInfo));
            }
        }
    }
}
</script>
