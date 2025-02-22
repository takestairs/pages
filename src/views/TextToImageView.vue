<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="Flux 系列模型" name="flux">
            <FluxInteraction></FluxInteraction>
        </el-tab-pane>
        <el-tab-pane label="Stable Diffusion 3.5 系列模型" name="sd-3.5">
            <StableDiffusionV35Interaction />
        </el-tab-pane>
        <el-tab-pane label="Stable Diffusion 1.5 系列模型" name="sd-1.5">
            <StableDiffusionV15Interaction />
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import FluxInteraction from '../components/FluxInteraction.vue';
import StableDiffusionV35Interaction from '../components/StableDiffusionV35Interaction.vue';
import StableDiffusionV15Interaction from "../components/StableDiffusionV15Interaction.vue"

const activeName = ref('flux')
</script>