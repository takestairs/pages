<template>
  <div class="components">
    <!-- 组件所有元素 -->
    <div
      class="main-button"
      @click="toogleEventHandler"
      @mousemove="mousemoveEventHandler"
      @mouseout="mouseoutEventHandler"
    >
      <!-- 按钮主体(圆) -->
      <div class="moon"></div>
      <div class="moon"></div>
      <div class="moon"></div>
      <!-- 月亮上的陨石坑 -->
    </div>
    <div class="daytime-backgrond"></div>
    <div class="daytime-backgrond"></div>
    <div class="daytime-backgrond"></div>
    <!-- 按钮底层的三个虚影 -->
    <div class="cloud">
      <!-- 所有的云 -->
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
    </div>
    <div class="cloud-light">
      <!-- 云的虚影 -->
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
    </div>
    <div class="stars">
      <!-- 所有星星，每一个星星由四个div拼合而成 -->
      <div class="star big">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star big">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star medium">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star medium">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainButton: {},
      daytimeBackgrond: {},
      cloud: {},
      cloudList: {},
      cloudLight: {},
      components: {},
      moon: {},
      stars: {},
      star: {},
      isMoved: false, //按钮状态，判断是否白天黑夜,默认为白天
      isClicked: false, // 新变量，用于跟踪是否刚刚发生了鼠标点击事件
      cloudSons: {},
      cloudTimer: undefined,
    };
  },
  methods: {
    select: function (s) {
      let dom = document.querySelectorAll(s);
      return dom.length == 1 ? dom[0] : dom;
    },
    getRandomDirection() {
      const directions = ["2px", "-2px"];
      return directions[Math.floor(Math.random() * directions.length)];
    },
    moveElementRandomly(element) {
      const randomDirectionX = this.getRandomDirection(); // 获取随机的X方向
      const randomDirectionY = this.getRandomDirection(); // 获取随机的Y方向
      element.style.transform = `translate(${randomDirectionX}, ${randomDirectionY})`; // 将随机方向应用到元素的transform属性
    },
    toogleEventHandler() {
      if (this.isMoved) {
        //白天按钮样式
        this.mainButton.style.transform = "translateX(0)"; //水平平移距离为0px
        this.mainButton.style.backgroundColor = "rgba(255, 195, 35,1)"; //按钮主体的背景颜色变为黄色(太阳)
        // 盒子阴影
        this.mainButton.style.boxShadow =
          "3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 230, 80,1)";
        //云朵上升-云朵显示
        this.daytimeBackgrond[0].style.transform = "translateX(0)";
        this.daytimeBackgrond[1].style.transform = "translateX(0)";
        this.daytimeBackgrond[2].style.transform = "translateX(0)";
        this.cloud.style.transform = "translateY(10px)";
        this.cloudLight.style.transform = "translateY(10px)";
        this.components.style.backgroundColor = "rgba(70, 133, 192,1)";
        //月亮陨石坑完全透明-隐藏
        this.moon[0].style.opacity = "0";
        this.moon[1].style.opacity = "0";
        this.moon[2].style.opacity = "0";
        //星星上升-星星隐藏
        this.stars.style.transform = "translateY(-125px)";
        this.stars.style.opacity = "0";
        //网页背景颜色变为浅色
        document.body.style.backgroundColor = "aliceblue";
      } else {
        //黑夜按钮样式
        this.mainButton.style.transform = "translateX(110px)"; //水平平移距离为110px
        this.mainButton.style.backgroundColor = "rgba(195, 200,210,1)"; //按钮主体的背景颜色变为黄色(月亮)
        // 盒子阴影
        this.mainButton.style.boxShadow =
          "3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 255, 210,1)";
        //云朵下降-云朵隐藏
        this.daytimeBackgrond[0].style.transform = "translateX(110px)";
        this.daytimeBackgrond[1].style.transform = "translateX(80px)";
        this.daytimeBackgrond[2].style.transform = "translateX(50px)";
        this.cloud.style.transform = "translateY(80px)";
        this.cloudLight.style.transform = "translateY(80px)";
        this.components.style.backgroundColor = "rgba(25,30,50,1)";
        //月亮陨石坑完全不透明-显示
        this.moon[0].style.opacity = "1";
        this.moon[1].style.opacity = "1";
        this.moon[2].style.opacity = "1";
        //星星下降-星星显示
        this.stars.style.transform = "translateY(-62.5px)";
        this.stars.style.opacity = "1";
        //网页背景颜色变为深色
        document.body.style.backgroundColor = "#424242";
      }
      // 黑夜关闭云朵定时器
      // clearInterval(this.cloudTimer);
      // 检测鼠标是否点击,默认已经点击
      this.isClicked = true;
      // 计时器，当0.5秒后，点击状态变成非点击
      setTimeout(function () {
        this.isClicked = false;
      }, 500);
      this.isMoved = !this.isMoved;
    },
    mousemoveEventHandler() {
      // 当按钮为点击状态时，退出
      if (this.isClicked) return;

      if (this.isMoved) {
        // 当黑夜状态时，鼠标挪入按钮
        // 按钮和背后的虚影向左平移10像素
        this.mainButton.style.transform = "translateX(100px)";
        this.daytimeBackgrond[0].style.transform = "translateX(100px)";
        this.daytimeBackgrond[1].style.transform = "translateX(73px)";
        this.daytimeBackgrond[2].style.transform = "translateX(46px)";
        // 星星向外扩散
        this.star[0].style.top = "10px";
        this.star[0].style.left = "36px";
        this.star[1].style.top = "40px";
        this.star[1].style.left = "87px";
        this.star[2].style.top = "26px";
        this.star[2].style.left = "16px";
        this.star[3].style.top = "38px";
        this.star[3].style.left = "63px";
        this.star[4].style.top = "20.5px";
        this.star[4].style.left = "72px";
        this.star[5].style.top = "51.5px";
        this.star[5].style.left = "35px";
        // star[1].style.transform = "translate(-4px,1px)";
        // star[2].style.transform = "translate(-3px,0px)";
        // star[3].style.transform = "translate(-3px,1px)";
        // star[4].style.transform = "translate(-3px,-0.5px)";
        // star[5].style.transform = "translate(-3px,0.5px)";
      } else {
        // 当白天状态时，鼠标挪入按钮
        // 按钮和背后的虚影向右平移10像素
        this.mainButton.style.transform = "translateX(10px)";
        this.daytimeBackgrond[0].style.transform = "translateX(10px)";
        this.daytimeBackgrond[1].style.transform = "translateX(7px)";
        this.daytimeBackgrond[2].style.transform = "translateX(4px)";
        // 云层外扩
        this.cloudList[0].style.right = "-24px";
        this.cloudList[0].style.bottom = "10px";
        this.cloudList[1].style.right = "-12px";
        this.cloudList[1].style.bottom = "-27px";
        this.cloudList[2].style.right = "17px";
        this.cloudList[2].style.bottom = "-43px";
        this.cloudList[3].style.right = "46px";
        this.cloudList[3].style.bottom = "-39px";
        this.cloudList[4].style.right = "70px";
        this.cloudList[4].style.bottom = "-65px";
        this.cloudList[5].style.right = "109px";
        this.cloudList[5].style.bottom = "-54px";
        this.cloudList[6].style.right = "-23px";
        this.cloudList[6].style.bottom = "10px";
        this.cloudList[7].style.right = "-11px";
        this.cloudList[7].style.bottom = "-26px";
        this.cloudList[8].style.right = "18px";
        this.cloudList[8].style.bottom = "-42px";
        this.cloudList[9].style.right = "47px";
        this.cloudList[9].style.bottom = "-38px";
        this.cloudList[10].style.right = "74px";
        this.cloudList[10].style.bottom = "-64px";
        this.cloudList[11].style.right = "110px";
        this.cloudList[11].style.bottom = "-55px";
      }
    },
    mouseoutEventHandler() {
      // 当按钮为点击状态时，退出
      if (this.isClicked) {
        return;
      }
      if (this.isMoved) {
        // 当黑夜状态时，鼠标挪出按钮
        // 按钮和背后的虚影向右平移10像素
        this.mainButton.style.transform = "translateX(110px)";
        this.daytimeBackgrond[0].style.transform = "translateX(110px)";
        this.daytimeBackgrond[1].style.transform = "translateX(80px)";
        this.daytimeBackgrond[2].style.transform = "translateX(50px)";
        // 星星归位
        this.star[0].style.top = "11px";
        this.star[0].style.left = "39px";
        this.star[1].style.top = "39px";
        this.star[1].style.left = "91px";
        this.star[2].style.top = "26px";
        this.star[2].style.left = "19px";
        this.star[3].style.top = "37px";
        this.star[3].style.left = "66px";
        this.star[4].style.top = "21px";
        this.star[4].style.left = "75px";
        this.star[5].style.top = "51px";
        this.star[5].style.left = "38px";
      } else {
        // 当白天状态时，鼠标挪出按钮
        // 按钮和背后的虚影向左平移10像素
        this.mainButton.style.transform = "translateX(0px)";
        this.daytimeBackgrond[0].style.transform = "translateX(0px)";
        this.daytimeBackgrond[1].style.transform = "translateX(0px)";
        this.daytimeBackgrond[2].style.transform = "translateX(0px)";
        // 云层归位
        this.cloudList[0].style.right = "-20px";
        this.cloudList[0].style.bottom = "10px";
        this.cloudList[1].style.right = "-10px";
        this.cloudList[1].style.bottom = "-25px";
        this.cloudList[2].style.right = "20px";
        this.cloudList[2].style.bottom = "-40px";
        this.cloudList[3].style.right = "50px";
        this.cloudList[3].style.bottom = "-35px";
        this.cloudList[4].style.right = "75px";
        this.cloudList[4].style.bottom = "-60px";
        this.cloudList[5].style.right = "110px";
        this.cloudList[5].style.bottom = "-50px";
        this.cloudList[6].style.right = "-20px";
        this.cloudList[6].style.bottom = "10px";
        this.cloudList[7].style.right = "-10px";
        this.cloudList[7].style.bottom = "-25px";
        this.cloudList[8].style.right = "20px";
        this.cloudList[8].style.bottom = "-40px";
        this.cloudList[9].style.right = "50px";
        this.cloudList[9].style.bottom = "-35px";
        this.cloudList[10].style.right = "75px";
        this.cloudList[10].style.bottom = "-60px";
        this.cloudList[11].style.right = "110px";
        this.cloudList[11].style.bottom = "-50px";
      }
    },
  },
  mounted() {
    this.mainButton = this.select(".main-button"); //获取按钮主体
    this.daytimeBackgrond = this.select(".daytime-backgrond"); //获取按钮背后的虚影
    this.cloud = this.select(".cloud"); //获取云层
    this.cloudList = this.select(".cloud-son"); //获取全部云
    this.cloudLight = this.select(".cloud-light"); //获取云层虚影
    this.components = this.select(".components"); //获取最外层元素
    this.moon = this.select(".moon"); //获取陨石坑
    this.stars = this.select(".stars"); //获取所有星星
    this.star = this.select(".star"); //获取每个星星

    this.cloudSons = this.select(".cloud-son");
    this.cloudTimer = setInterval(() => {
      this.cloudSons.forEach(this.moveElementRandomly); // 每秒将每一个.cloud-son元素移动到随机方向
    }, 1000);
  },
};
</script>

<style>
* {
  margin: 5;
  padding: 2;
  transition: 0.7s;
}

body {
  background-color: aliceblue; /* 白天默认背景颜色 */
}

/* 最外层元素样式 */
.components {
  position: fixed; /* 固定定位 */
  top: 10%;
  left: 90%;
  margin-left: -90px;
  margin-top: -35px; /* 按钮在页面中居中 */
  width: 180px;
  height: 70px;
  background-color: rgba(70, 133, 192, 1); /* 按钮背景颜色 */
  border-radius: 100px;
  box-shadow: inset 0 0 5px 3px rgba(0, 0, 0, 0.5); /* 按钮的内阴影,实现立体感 */
  overflow: hidden;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(
    0,
    0.5,
    1,
    1
  ); /* 过渡时间贝塞尔曲线,实现非线性动画 */
}

/* 主要按钮样式 */
.main-button {
  margin: 7.5px 0 0 7.5px;
  width: 55px;
  height: 55px;
  background-color: rgba(255, 195, 35, 1);
  border-radius: 50%;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5),
    inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5),
    inset 4px 5px 2px -2px rgba(255, 230, 80, 1);
  cursor: pointer;
  transition: 1s;
  transition-timing-function: cubic-bezier(
    0.56,
    1.35,
    0.52,
    1
  ); /* 加入回弹动画 */
}

/* 陨石坑样式 */
.moon {
  position: absolute;
  background-color: rgba(150, 160, 180, 1);
  box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: 0.5s;
  opacity: 0;
}

/* 第一个陨石坑 */
.moon:nth-child(1) {
  top: 7.5px;
  left: 25px;
  width: 12.5px;
  height: 12.5px;
}

/* 第二个陨石坑 */
.moon:nth-child(2) {
  top: 20px;
  left: 7.5px;
  width: 20px;
  height: 20px;
}

/* 第三个陨石坑 */
.moon:nth-child(3) {
  top: 32.5px;
  left: 32.5px;
  width: 12.5px;
  height: 12.5px;
}

/* 按钮背后的虚影 */
.daytime-backgrond {
  position: absolute;
  border-radius: 50%;
  transition: 1s;
  transition-timing-function: cubic-bezier(
    0.56,
    1.35,
    0.52,
    1
  ); /* 加入回弹动画 */
}

/* 按钮背后的第一个虚影 */
.daytime-backgrond:nth-child(2) {
  top: -20px;
  left: -20px;
  width: 110px;
  height: 110px;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: -2;
}

/* 按钮背后的第二个虚影 */
.daytime-backgrond:nth-child(3) {
  top: -32.5px;
  left: -17.5px;
  width: 135px;
  height: 135px;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: -3;
}

/* 按钮背后的第三个虚影 */
.daytime-backgrond:nth-child(4) {
  top: -45px;
  left: -15px;
  width: 160px;
  height: 160px;
  background-color: rgba(255, 255, 255, 0.05);
  z-index: -4;
}

/* 云和云层虚影的初始位置 */
.cloud,
.cloud-light {
  transform: translateY(10px);
  transition: 1s;
  transition-timing-function: cubic-bezier(
    0.56,
    1.35,
    0.52,
    1
  ); /* 加入回弹动画 */
}

/* 云和虚影统一样式 */
.cloud-son {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
  transition: transform 6s, right 1s, bottom 1s;
}

/* 云和虚影由6个圆形组成，第1个圆形和第7个圆形大小相同 */
.cloud-son:nth-child(6n + 1) {
  right: -20px;
  bottom: 10px;
  width: 50px;
  height: 50px;
}

/* 云和虚影由6个圆形组成，第2个圆形和第8个圆形大小相同 */
.cloud-son:nth-child(6n + 2) {
  right: -10px;
  bottom: -25px;
  width: 60px;
  height: 60px;
}

/* 云和虚影由6个圆形组成，第3个圆形和第9个圆形大小相同 */
.cloud-son:nth-child(6n + 3) {
  right: 20px;
  bottom: -40px;
  width: 60px;
  height: 60px;
}

/* 云和虚影由6个圆形组成，第4个圆形和第10个圆形大小相同 */
.cloud-son:nth-child(6n + 4) {
  right: 50px;
  bottom: -35px;
  width: 60px;
  height: 60px;
}

/* 云和虚影由6个圆形组成，第5个圆形和第11个圆形大小相同 */
.cloud-son:nth-child(6n + 5) {
  right: 75px;
  bottom: -60px;
  width: 75px;
  height: 75px;
}

/* 云和虚影由6个圆形组成，第6个圆形和第12个圆形大小相同 */
.cloud-son:nth-child(6n + 6) {
  right: 110px;
  bottom: -50px;
  width: 60px;
  height: 60px;
}

/* 云层在-2层 */
.cloud {
  z-index: -2;
}

/* 云层虚影在云层下方,并且整体上移,逆时针旋转5度 */
.cloud-light {
  position: absolute;
  right: 0px;
  bottom: 25px;
  opacity: 0.5;
  z-index: -3;
  /*transform: rotate(-5deg);*/
}

/* 所有星星样式 */
.stars {
  transform: translateY(-125px);
  z-index: -2;
  transition: 1s;
  transition-timing-function: cubic-bezier(
    0.56,
    1.35,
    0.52,
    1
  ); /* 加入回弹动画 */
}

/* 大星星的宽高 */
.big {
  --size: 7.5px;
}

/* 中星星的宽高 */
.medium {
  --size: 5px;
}

/* 小星星的宽高 */
.small {
  --size: 3px;
}

/* 星星绝对定位 */
.star {
  position: absolute;
  width: calc(2 * var(--size));
  height: calc(2 * var(--size));
}

/* 所有星星的位置 */
.star:nth-child(1) {
  top: 11px;
  left: 39px;
  animation-name: star;
  animation-duration: 3.5s;
}

.star:nth-child(2) {
  top: 39px;
  left: 91px;
  animation-name: star;
  animation-duration: 4.1s;
}

.star:nth-child(3) {
  top: 26px;
  left: 19px;
  animation-name: star;
  animation-duration: 4.9s;
}

.star:nth-child(4) {
  top: 37px;
  left: 66px;
  animation-name: star;
  animation-duration: 5.3s;
}

.star:nth-child(5) {
  top: 21px;
  left: 75px;
  animation-name: star;
  animation-duration: 3s;
}

.star:nth-child(6) {
  top: 51px;
  left: 38px;
  animation-name: star;
  animation-duration: 2.2s;
}

@keyframes star {
  0%,
  20% {
    transform: scale(0);
  }
  20%,
  100% {
    transform: scale(1);
  }
}

/* 每一个星星由四个div向左浮动,拼合而成 */
.star-son {
  float: left;
}

.star-son:nth-child(1) {
  --pos: left 0;
}

.star-son:nth-child(2) {
  --pos: right 0;
}

.star-son:nth-child(3) {
  --pos: 0 bottom;
}

.star-son:nth-child(4) {
  --pos: right bottom;
}

/* 星星 */
.star-son {
  width: var(--size);
  height: var(--size);
  background-image: radial-gradient(
    circle var(--size) at var(--pos),
    transparent var(--size),
    #fff
  );
}

/* 将星星闪烁动画应用于所有的star元素 */
.star {
  transform: scale(1);
  transition-timing-function: cubic-bezier(
    0.56,
    1.35,
    0.52,
    1
  ); /* 加入回弹动画 */
  transition: 1s;
  /* 无限次重复动画 */
  animation-iteration-count: infinite;
  /* 动画在每个循环中正反交替播放 */
  animation-direction: alternate;
  animation-timing-function: linear;
}

/* 添加星星闪烁动画 */
.twinkle {
  transform: scale(0);
}
</style>