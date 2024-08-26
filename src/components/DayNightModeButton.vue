<template>
    <div class="components">
        <!-- Main button -->
        <div class="main-button" @click="toggleEventHandler" @mousemove="mousemoveEventHandler"
            @mouseout="mouseoutEventHandler">
            <div class="moon"></div>
            <div class="moon"></div>
            <div class="moon"></div>
        </div>

        <!-- Daytime background shadows -->
        <div class="daytime-background"></div>
        <div class="daytime-background"></div>
        <div class="daytime-background"></div>

        <!-- Clouds -->
        <div class="cloud">
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
        </div>

        <!-- Cloud light shadows -->
        <div class="cloud-light">
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
        </div>

        <!-- Stars -->
        <div class="stars">
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
            isMoved: false, // Track day/night state, default is day
            isClicked: false, // Track if the button was just clicked
            cloudTimer: undefined,
        };
    },
    methods: {
        toggleEventHandler() {
            this.isMoved = !this.isMoved;

            // Trigger change event to notify parent component about day/night switch
            this.$emit('change', this.isMoved ? 'night' : 'day');

            if (this.isMoved) {
                this.setNightMode();
            } else {
                this.setDayMode();
            }

            this.isClicked = true;
            setTimeout(() => {
                this.isClicked = false;
            }, 500);
        },
        setDayMode() {
            this.mainButton.style.transform = "translateX(0)";
            this.mainButton.style.backgroundColor = "rgba(255, 195, 35,1)";
            this.mainButton.style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.5), inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset 4px 5px 2px -2px rgba(255, 230, 80,1)";
            this.daytimeBackground[0].style.transform = "translateX(0)";
            this.daytimeBackground[1].style.transform = "translateX(0)";
            this.daytimeBackground[2].style.transform = "translateX(0)";
            this.cloud.style.transform = "translateY(10px)";
            this.cloudLight.style.transform = "translateY(10px)";
            this.components.style.backgroundColor = "rgba(70, 133, 192,1)";
            this.moon[0].style.opacity = "0";
            this.moon[1].style.opacity = "0";
            this.moon[2].style.opacity = "0";
            this.stars.style.transform = "translateY(-125px)";
            this.stars.style.opacity = "0";
            // document.body.style.backgroundColor = "aliceblue";
        },
        setNightMode() {
            this.mainButton.style.transform = "translateX(110px)";
            this.mainButton.style.backgroundColor = "rgba(195, 200,210,1)";
            this.mainButton.style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.5), inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset 4px 5px 2px -2px rgba(255, 255, 210,1)";
            this.daytimeBackground[0].style.transform = "translateX(110px)";
            this.daytimeBackground[1].style.transform = "translateX(80px)";
            this.daytimeBackground[2].style.transform = "translateX(50px)";
            this.cloud.style.transform = "translateY(80px)";
            this.cloudLight.style.transform = "translateY(80px)";
            this.components.style.backgroundColor = "rgba(25,30,50,1)";
            this.moon[0].style.opacity = "1";
            this.moon[1].style.opacity = "1";
            this.moon[2].style.opacity = "1";
            this.stars.style.transform = "translateY(-62.5px)";
            this.stars.style.opacity = "1";
            // document.body.style.backgroundColor = "#424242";
        },
        mousemoveEventHandler() {
            if (this.isClicked) return;

            if (this.isMoved) {
                this.mainButton.style.transform = "translateX(100px)";
                this.daytimeBackground[0].style.transform = "translateX(100px)";
                this.daytimeBackground[1].style.transform = "translateX(73px)";
                this.daytimeBackground[2].style.transform = "translateX(46px)";
                this.updateStarPositions(true);
            } else {
                this.mainButton.style.transform = "translateX(10px)";
                this.daytimeBackground[0].style.transform = "translateX(10px)";
                this.daytimeBackground[1].style.transform = "translateX(7px)";
                this.daytimeBackground[2].style.transform = "translateX(4px)";
                this.updateCloudPositions(true);
            }
        },
        mouseoutEventHandler() {
            if (this.isClicked) return;

            if (this.isMoved) {
                this.mainButton.style.transform = "translateX(110px)";
                this.daytimeBackground[0].style.transform = "translateX(110px)";
                this.daytimeBackground[1].style.transform = "translateX(80px)";
                this.daytimeBackground[2].style.transform = "translateX(50px)";
                this.updateStarPositions(false);
            } else {
                this.mainButton.style.transform = "translateX(0px)";
                this.daytimeBackground[0].style.transform = "translateX(0px)";
                this.daytimeBackground[1].style.transform = "translateX(0px)";
                this.daytimeBackground[2].style.transform = "translateX(0px)";
                this.updateCloudPositions(false);
            }
        },
        updateStarPositions(expand) {
            const positions = expand
                ? [
                    { top: "10px", left: "36px" },
                    { top: "40px", left: "87px" },
                    { top: "26px", left: "16px" },
                    { top: "38px", left: "63px" },
                    { top: "20.5px", left: "72px" },
                    { top: "51.5px", left: "35px" },
                ]
                : [
                    { top: "11px", left: "39px" },
                    { top: "39px", left: "91px" },
                    { top: "26px", left: "19px" },
                    { top: "37px", left: "66px" },
                    { top: "21px", left: "75px" },
                    { top: "51px", left: "38px" },
                ];

            this.star.forEach((star, index) => {
                star.style.top = positions[index].top;
                star.style.left = positions[index].left;
            });
        },
        updateCloudPositions(expand) {
            const positions = expand
                ? [
                    { right: "-24px", bottom: "10px" },
                    { right: "-12px", bottom: "-27px" },
                    { right: "17px", bottom: "-43px" },
                    {
                        right: "46px", bottom: "-39px"
                    },
                    { right: "70px", bottom: "-65px" },
                    { right: "109px", bottom: "-54px" },
                ]
                : [
                    { right: "-20px", bottom: "10px" },
                    { right: "-10px", bottom: "-25px" },
                    { right: "20px", bottom: "-40px" },
                    { right: "50px", bottom: "-35px" },
                    { right: "75px", bottom: "-60px" },
                    { right: "110px", bottom: "-50px" },
                ];

            this.cloudList.forEach((cloud, index) => {
                cloud.style.right = positions[index].right;
                cloud.style.bottom = positions[index].bottom;
            });
        },
        select(selector) {
            let dom = document.querySelectorAll(selector);
            return dom.length === 1 ? dom[0] : dom;
        },
        getRandomDirection() {
            const directions = ["2px", "-2px"];
            return directions[Math.floor(Math.random() * directions.length)];
        },
        moveElementRandomly(element) {
            const randomDirectionX = this.getRandomDirection();
            const randomDirectionY = this.getRandomDirection();
            element.style.transform = `translate(${randomDirectionX}, ${randomDirectionY})`;
        },
    },
    mounted() {
        this.mainButton = this.select(".main-button");
        this.daytimeBackground = this.select(".daytime-background");
        this.cloud = this.select(".cloud");
        this.cloudList = this.select(".cloud-son");
        this.cloudLight = this.select(".cloud-light");
        this.components = this.select(".components");
        this.moon = this.select(".moon");
        this.stars = this.select(".stars");
        this.star = this.select(".star");

        this.cloudSons = this.select(".cloud-son");
        this.cloudTimer = setInterval(() => {
            this.cloudSons.forEach(this.moveElementRandomly);
        }, 1000);
    },
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    transition: 0.7s;
}

/* body { */
    /* background-color: aliceblue; */
/* } */

/* Main container */
.components {
    position: fixed;
    top: 10%;
    left: 90%;
    margin-left: -90px;
    margin-top: -35px;
    width: 180px;
    height: 70px;
    background-color: rgba(70, 133, 192, 1);
    border-radius: 100px;
    box-shadow: inset 0 0 5px 3px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: 0.7s;
    transition-timing-function: cubic-bezier(0, 0.5, 1, 1);
}

/* Main button */
.main-button {
    margin: 7.5px 0 0 7.5px;
    width: 55px;
    height: 55px;
    background-color: rgba(255, 195, 35, 1);
    border-radius: 50%;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5), inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset 4px 5px 2px -2px rgba(255, 230, 80, 1);
    cursor: pointer;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}

/* Moon craters */
.moon {
    position: absolute;
    background-color: rgba(150, 160, 180, 1);
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transition: 0.5s;
    opacity: 0;
}

.moon:nth-child(1) {
    top: 7.5px;
    left: 25px;
    width: 12.5px;
    height: 12.5px;
}

.moon:nth-child(2) {
    top: 20px;
    left: 7.5px;
    width: 20px;
    height: 20px;
}

.moon:nth-child(3) {
    top: 32.5px;
    left: 32.5px;
    width: 12.5px;
    height: 12.5px;
}

/* Daytime background shadows */
.daytime-background {
    position: absolute;
    border-radius: 50%;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}

.daytime-background:nth-child(2) {
    top: -20px;
    left: -20px;
    width: 110px;
    height: 110px;
    background-color: rgba(255, 255, 255, 0.2);
    z-index: -2;
}

.daytime-background:nth-child(3) {
    top: -32.5px;
    left: -17.5px;
    width: 135px;
    height: 135px;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: -3;
}

.daytime-background:nth-child(4) {
    top: -45px;
    left: -15px;
    width: 160px;
    height: 160px;
    background-color: rgba(255, 255, 255, 0.05);
    z-index: -4;
}

/* Cloud styles */
.cloud,
.cloud-light {
    transform: translateY(10px);
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}

.cloud-son {
    position: absolute;
    background-color: #fff;
    border-radius: 50%;
    z-index: -1;
    transition: transform 6s, right 1s, bottom 1s;
}

.cloud-son:nth-child(6n + 1) {
    right: -20px;
    bottom: 10px;
    width: 50px;
    height: 50px;
}

.cloud-son:nth-child(6n + 2) {
    right: -10px;
    bottom: -25px;
    width: 60px;
    height: 60px;
}

.cloud-son:nth-child(6n + 3) {
    right: 20px;
    bottom: -40px;
    width: 60px;
    height: 60px;
}

.cloud-son:nth-child(6n + 4) {
    right: 50px;
    bottom: -35px;
    width: 60px;
    height: 60px;
}

.cloud-son:nth-child(6n + 5) {
    right: 75px;
    bottom: -60px;
    width: 75px;
    height: 75px;
}

.cloud-son:nth-child(6n + 6) {
    right: 110px;
    bottom: -50px;
    width: 60px;
    height: 60px;
}

.cloud {
    z-index: -2;
}

.cloud-light {
    position: absolute;
    right: 0px;
    bottom: 25px;
    opacity: 0.5;
    z-index: -3;
}

/* Star styles */
.stars {
    transform: translateY(-125px);
    z-index: -2;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}

.big {
    --size: 7.5px;
}

.medium {
    --size: 5px;
}

.small {
    --size: 3px;
}

.star {
    position: absolute;
    width: calc(2 * var(--size));
    height: calc(2 * var(--size));
}

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

.star-son {
    width: var(--size);
    height: var(--size);
    background-image: radial-gradient(circle var(--size) at var(--pos), transparent var(--size), #fff);
}

.star {
    transform: scale(1);
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
    transition: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: linear;
}

.twinkle {
    transform: scale(0);
}
</style>