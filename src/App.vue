<template>
    <el-container>
        <AppAside></AppAside>

        <el-container>
            <AppHeader></AppHeader>

            <el-main>
                <router-view v-slot="{ Component }">
                    <keep-alive include="FkTokenMannageView,SubscriptionMannageView,ApiEndpointsMannageView">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </el-main>

            <el-footer>
                <OneSentence />
            </el-footer>
        </el-container>
    </el-container>
</template>

<script setup>
import { KeepAlive } from "vue";

import AppAside from "./layout/AppAside.vue";
import AppHeader from "./layout/AppHeader.vue";

import OneSentence from "./components/OneSentence.vue"
</script>

<style lang="css">
* {
    padding: 0px;
    margin: 0px;
}
</style>