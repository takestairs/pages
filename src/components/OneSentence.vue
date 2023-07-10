<template>
    <div>
        <div>{{content}}</div>
        <div style="text-align: right;">{{author}}</div>
        <button @click=getCont>换一句</button>&nbsp;&nbsp;&nbsp;
        <button @click="changeLang">换种语言</button>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    data(){
        return {
            content : ""
            ,author: ""
            ,lang : "zh"
            ,supported_lang : ["zh","en"]
        }
    },
    mounted(){
        this.getCont()
    },
    methods: {
        getCont(){
            let lang = this.lang;
            if(lang == "zh") {
                this.explain(this.getChinese());
            } else if(lang = "en"){
                this.explain(this.getEnglish());
            } else {
                this.explain(this.getError());
            }
        }
        ,getEnglish(){
            let res = {content:"",author:""};
            $.ajax({
                type:"GET"
                ,url: "https://api.quotable.io/random"
                ,data : "_="+ new Date().getTime()
                ,async : false
                ,success : function(json){
                    res.content = json.content;
                    res.author = "——"+json.author;
                }
            })
            return res;
        }
        ,getChinese(){
            let res = {content:"",author:""};
            $.ajax({
                type:"GET"
                ,url: "https://v1.hitokoto.cn"
                ,data : "_="+ new Date().getTime()
                ,async : false
                ,success : function(json){
                    res.content = json.hitokoto;
                    let suffix = json.from_who;
                    if(suffix == null || suffix == "佚名") {
                        suffix = "";
                    } else {
                        suffix = " by "+suffix;
                    }
                    res.author = json.from + suffix;
                }
            })
            return res;
        }
        ,getError(){
            return {
                content:"出错了"
                ,author:"稍后再试吧"
            }
        }
        ,explain(response){
            this.content = response.content;
            this.author = response.author;
        }
        ,changeLang(){
            let langlist = this.supported_lang;
            while(true){
                let index = Number.parseInt(Math.random()*langlist.length);
                if(langlist[index] != this.lang) {
                    this.lang = langlist[index];
                    this.getCont()
                    break;
                }
            }
        }
    }
}
</script>
