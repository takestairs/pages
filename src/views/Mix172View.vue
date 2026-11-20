<template>
    <h2 size="large">172MIX 下载器</h2>
    <el-divider />
    <el-form :model="form">
        <el-form-item>
            <el-input v-model="form.url" placeholder="请输入网页链接"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleDownload" :loading="loading">下载文件</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { apiPrefix } from '../const/commom';

const form = ref({
    url: ''
});
const loading = ref(false);

// 模拟获取文件信息的函数
async function getFileInfo(url) {

    return fetch(`${apiPrefix}/tools/proxy.transparent/${url}`,{
        headers: {
            "x-user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0"
        }
    }).then(r => r.text()).then(html => {
        const scripts = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('script');

        let mediaObj = {}
        // 遍历 script 标签，寻找 media 变量
        scripts.forEach(script => {
            const scriptContent = script.textContent.trim();
            console.log(scriptContent);

            if (scriptContent.startsWith("var media = {")) {
                
                const getMedia = new Function(scriptContent.split("$")[0] + ' return media;')

                mediaObj = getMedia()
            }
        })
        console.log(mediaObj)
        return {
            "downloadUrl": mediaObj.src,
            "fileName": mediaObj.name
        }
    })
}
// 下载文件
async function handleDownload() {
    if (!form.value.url) {
        ElMessage.warning('请输入文件URL');
        return;
    }
    loading.value = true;
    try {
        // 调用获取文件信息的函数
        const { downloadUrl, fileName } = await getFileInfo(form.value.url);
        if (!downloadUrl) {
            ElMessage.warning('链接解析失败');
            return;
        }

        const response = await fetch(`${apiPrefix}/tools/proxy.transparent/${downloadUrl}`, {
            method: 'GET',
            headers: {
                // 尝试请求时告知来源，部分 CDN 会校验此项
                'x-referer': 'https://www.172mix.com/',
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // 将响应转换为 Blob 对象
        const blob = await response.blob();
        // 创建一个指向 Blob 的 URL
        const blobUrl = window.URL.createObjectURL(blob);

        // 创建一个隐藏的 a 标签并模拟点击
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName; // 设置下载后的文件名
        document.body.appendChild(a);
        a.click();

        // 清理内存
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);

        ElMessage.success('文件下载开始');
    } catch (error) {
        console.error(error)
        ElMessage.error('文件下载失败');
    } finally {
        loading.value = false;
    }
}
</script>