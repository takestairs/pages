<template>
    <h2>梦想成真计算器</h2>
    <Line ref="lineChart"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData">
    </Line>
    <div class="settings">
        <span>
            我的目标是：<input type="number" v-model="userData.fv">元。
            我的已存了：<input type="number" v-model="userData.cf0">元
        </span>
        <span>
            打算每月存：<input type="number" v-model="userData.cfi">元。
            期望年利率：<input type="number" v-model="userData.yearRate">%
        </span>
        <button @click="calculate">算一下</button>
    </div>
    <div class="output">
        <span>
            我还需要坚持存<input type="number" v-model="userData.monthNeeded" readonly>月，
            折合<input type="number" v-model="simpleNeed.year" readonly>年<input type="number" v-model="simpleNeed.month" readonly>月
        </span>
    </div>

</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

import { computed, reactive, ref } from 'vue';

import LabelsUtil from '../util/Labels.js'

export default {
    name : "DreamCometrueCaculator",
    components : {Line},
    setup() {
        // data
        let userData = reactive({
            fv : 1000,
            cf0 : 100,
            cfi : 100,
            yearRate : 5,
            monthNeeded : 0
        })
        let lineChart = ref(null)        
        // 无响应式，直接操作chart对象完成更新
        let chartData = {
            labels: [ 'January', 'February', 'March' ],
            datasets: [
                {
                    data : [40,  59,  81],
                    label : 'test',
                    backgroundColor: ['rgb(75, 192, 192)','rgb(75, 252, 192)','rgb(75, 192, 0)']
                }
            ]
        }
        // 无响应式，不更改这个数据
        let chartOptions= {
            responsive: true
        }

        // computed
        let simpleNeed = computed(()=>{
            let monthTotal = userData.monthNeeded
            return {
                year : Math.floor(monthTotal / 12),
                month : monthTotal%12
            }
        })

        // methods
        let calculate = function(){
            let i = userData.yearRate/1200 // 月利率(%)
            let fvs_liner = [userData.cf0] // 不计算利率
            let fvs_rater = [userData.cf0] // 计算利率

            // 计算各个月的fv，记录完成的最少月份数
            let count = 0
            // 简名
            let fv = userData.fv
            let cfi = userData.cfi
            while(fvs_rater[count] < fv){ // 比较最新的fv
                fvs_liner.push(fvs_liner[count]+cfi) // 线性递增，不计算利率
                fvs_rater.push(fvs_rater[count]*(1+i)+cfi)

                count++
            }
            userData.monthNeeded = count

            // 往后扩展 1/9 个月份
            for(let j=1;j<=Math.ceil(count/9);j++){
                fvs_liner.push(fvs_liner[count]+cfi) // 线性递增，不计算利率
                fvs_rater.push(fvs_rater[count]*(1+i)+cfi)

                count++
            }

            // 获取chart对象
            let chart = lineChart.value.chart
            // 直接操作chart完成更新，绕过诡异的响应式
            chart.data.labels = LabelsUtil.getYearMonthLabels(count+1,"年","月")
            chart.data.datasets = [
                {
                    data:fvs_liner,
                    label : "累计本金",
                    borderColor: 'rgb(0, 0, 0, 0.1)',
                    tension: 0.1,
                    backgroundColor : 'rgb(0, 0, 0, 0.1)'
                },
                {
                    data:fvs_rater,
                    label : "连带利息",
                    borderColor: 'rgb(75, 192, 192, 0.6)',
                    tension: 0.1,                    
                    backgroundColor : LabelsUtil.getArray(count+1,'rgb(75, 192, 192, 0.9)',[userData.monthNeeded],['rgb(255, 51, 51, 0.9)'])
                }
            ]            
            chart.update()
        }

        return {userData, chartData, chartOptions, simpleNeed, lineChart, calculate}
    }
}
</script>

<style scoped>
.settings {
    width: 70%;
    margin: 0 auto;
}
.settings > button {
    display: block;
    margin: 5px auto;
}

.output {
    color: rgb(75, 192, 192);
    width: 70%;
    margin: 0 auto;
    margin-top: 1%;
}

div > span {
    display: block;
    text-align: center;
    margin: 0 auto;
}
.output input {
    width : 5%;
}
.settings input {
    width : 10%;
}
</style>