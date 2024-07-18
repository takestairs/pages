    <template>
        <DayNightModeButton />
        <h1>Hello Pages!</h1>
        <p>仓库地址: <a href="https://github.com/takestairs/pages">https://github.com/takestairs/pages</a></p>
        <p>我知道页面粗糙，css太难写了，作为练习凑合吧。</p>
        <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/dream">梦想成真计算器</RouterLink>
            <RouterLink to="/form">表单收集 DEMO</RouterLink>
            <RouterLink to="/weather">天气查询</RouterLink>
            <RouterLink to="/ask">Yes or No</RouterLink>
            
        </nav>

        <main v-if="$route.fullPath !== '/'">
            <RouterView />
        </main>

        <OneSentence class="border" />
    </template>

<script setup>
import OneSentence from "./components/OneSentence.vue"
import DayNightModeButton from "./components/DayNightModeButton.vue"

</script>

<style scoped>
nav,
main,
.border {
    border: 2px solid #000;
    margin-bottom: 10px;
    padding: 10px;
}

nav>a+a {
    margin-left: 10px;
}

h2 {
    border-bottom: 1px solid #ccc;
    margin: 0 0 20px;
}
</style>