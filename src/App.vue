<template>
    <div>
        <p>Github 仓库地址: <a href="https://github.com/takestairs/pages">https://github.com/takestairs/pages</a></p>
        <p>我知道页面粗糙，css太难写了，作为练习凑合吧。</p>
        
        <input type="checkbox" :checked="getProto('DayNightToogleButton')" @change="reverseProto('DayNightToogleButton')">日夜模式开关（不适用手机端），
        原作者仓库：<a href="https://github.com/Xiumuzaidiao/Day-night-toggle-button">https://github.com/Xiumuzaidiao/Day-night-toggle-button</a>
        <DayNightToogleButton v-show="getProto('DayNightToogleButton')"></DayNightToogleButton>
        <br><br>

        <input type="checkbox" :checked="getProto('Static')" @change="reverseProto('Static')">Static<br>
        <template v-if="getProto('Static')">
            <h3>一些纯html静态页面，放网络资源或者笔记。</h3>
            <ol>
                <li><a href="./html/static/MOOC.html">安全与急救</a>dddd</li>
                <li><a href="./html/static/直线与圆锥曲线.html">数学三：直线与圆锥曲线</a></li>
            </ol>
        </template>
        <hr>

        <input type="checkbox" :checked="getProto('YesOrNo')" @change="reverseProto('YesOrNo')">YesOrNo<br>
        <YesOrNo v-if="getProto('YesOrNo')"></YesOrNo>
        <hr>

        <input type="checkbox" :checked="getProto('FormCollect')" @change="reverseProto('FormCollect')">FormCollect<br>
        <FormCollect v-if="getProto('FormCollect')"></FormCollect>
        <hr>

        <input type="checkbox" :checked="getProto('OneSentence')" @change="reverseProto('OneSentence')">OneSentence<br>
        <OneSentence v-if="getProto('OneSentence')"></OneSentence>
        <hr>

        <input type="checkbox" :checked="getProto('SimpleGPT')" @change="reverseProto('SimpleGPT')">SimpleGPT（接口已下线，有需要联系我）<br>
        <SimpleGPT v-if="getProto('SimpleGPT')"></SimpleGPT>
        <hr>

        <input type="checkbox" :checked="getProto('WeatherReport')" @change="reverseProto('WeatherReport')">天气情况<br>
        <WeatherReport v-show="getProto('WeatherReport')"></WeatherReport>
        <hr>

        <input type="checkbox" :checked="getProto('DreamCometrueCaculator')" @change="reverseProto('DreamCometrueCaculator')">梦想成真计算器<br>
        <DreamCometrueCaculator v-show="getProto('DreamCometrueCaculator')"></DreamCometrueCaculator>
    </div>
</template>

<script>
import DayNightToogleButton from './components/DayNightToogleButton.vue'
import OneSentence from './components/OneSentence.vue'
import YesOrNo from './components/YesOrNo.vue'
import FormCollect from './components/FormCollect.vue'
import SimpleGPT from './components/SimpleGPT.vue'
import WeatherReport from './components/WeatherReport.vue'
import DreamCometrueCaculator from './components/DreamCometrueCalculator.vue';

export default {
    data(){
        return {
            enableComponent : {
                "Static" : false,
                "DayNightToogleButton" : false,
                "OneSentence" : true,
                "YesOrNo" : false,
                "FormCollect" : false,
                'SimpleGPT' : true,
                'WeatherReport' : false,
                'DreamCometrueCaculator' : true
            }
        }
    },
    components : {
        SimpleGPT,
        YesOrNo,
        FormCollect,
        OneSentence,
        DayNightToogleButton,
        WeatherReport,
        DreamCometrueCaculator
    },
    methods : {
        reverseProto(proto){
            this.enableComponent[proto]=!this.enableComponent[proto]
        },
        getProto(proto){
            return this.enableComponent[proto]
        }
    }
}
</script>