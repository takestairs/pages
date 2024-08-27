<template>
    <div class="card">
        <div class="search">
            <input type="text" placeholder="请输入城市名字" spellcheck="false" v-model="userCityName">
            <button @click="serchWeather"><img src="/images/search.png"></button>
        </div>
        <div class="weather">
            <img :src="weatherIconSrc" class="weather-icon">
            <h1 class="temp">{{ temp }}</h1>
            <h2 class="city">{{ cityName }}</h2>
            <div class="details">
                <div class="col">
                    <img src="/images/humidity.png" />
                    <div>
                        <p class="humidity">{{ humidity }}</p>
                        <p>湿度</p>
                    </div>
                </div>
                <div class="col">
                    <img src="/images/wind.png">
                    <div>
                        <p class="wind">{{ windSpeed }}</p>
                        <p>风力</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
export default {
    data() {
        return {
            userCityName: "赣州",
            lon: 0,
            lat: 0,

            cityName: "",
            icon: "",
            temp: "",
            humidity: "",
            windSpeed: "",

            apikey: "d75241a328ce0013a2b9650ed78a6935"
        }
    },
    computed: {
        weatherIconSrc() {
            if (!this.icon) {
                return ""
            }
            return `https://openweathermap.org/img/wn/${this.icon}@4x.png`
        }
    },
    methods: {
        serchWeather() {
            // 1. 发起请求，获取经纬度
            axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${this.userCityName}&limit=1&appid=${this.apikey}`).then(
                response => {
                    // console.log(response);                    
                    this.lat = response.data[0].lat
                    this.lon = response.data[0].lon

                    this.getWeatherInfo()
                },
                error => {
                    console.log(error);
                }
            )
        },
        getWeatherInfo() {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}`).then(
                response => {
                    // console.log(response);
                    this.icon = response.data.weather[0].icon
                    this.temp = response.data.main.temp + "°c"
                    this.humidity = response.data.main.humidity + "%"
                    this.windSpeed = response.data.wind.speed + "米/秒"

                    // 查询成功，清空用户输入
                    this.cityName = this.userCityName
                    this.userCityName = ""
                },
                error => {
                    console.log(error);
                }
            )
        }
    },
    mounted() {
        // 执行依次查询，初始化
        this.serchWeather()
    }
}
</script>

<style scoped>
* {
    position: relative;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
}

body {
    background: #222;
}

.card {
    /* scale: 50%; */
    /* width: 70%; */
    max-width: 470px;
    background: linear-gradient(135deg, #00feba, #5b548a);
    color: #fff;
    margin: 0 auto 0;
    border-radius: 5%;
    padding: 5% 3%;
    text-align: center;
}

/*搜索框样式*/
.search {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.search input {
    border: 0;
    outline: 0;
    background: #ebfffc;
    color: #555;
    padding: 10px 25px;
    height: 60px;
    border-radius: 30px;
    flex: 1;
    margin-right: 16px;
    font-size: 18px;
}

.search button {
    border: 0;
    outline: 0;
    background: #ebfffc;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    cursor: pointer;
}

.search button img {
    width: 16px;
}

/*天气样式*/
.weather-icon {
    width: 170px;
    margin-top: 30px;
}

.weather h1 {
    font-size: 80px;
    font-weight: 500;
}

.weather h2 {
    font-size: 45px;
    font-weight: 400;
    margin-top: -10px;
}

.details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 50px;
}

.col {
    display: flex;
    align-items: center;
    text-align: left;
}

.col img {
    width: 40px;
    margin-right: 10px;
}

.humidity,
.wind {
    font-size: 28px;
    margin-top: -6px;
}
</style>

<style>
#app {
    margin: 2%
}
</style>