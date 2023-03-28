<template>
    <div class="anime-detail-page">
        <button @click="$router.go(-1)" class="back">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xitongfanhui"></use>
            </svg>
            <span>返回</span>
        </button>
        <div class="top">
            <div class="posters">
                <div class="poster" v-for="poster in anime?.posters" :key="poster.id">
                    <img :src="formatposter(poster.path)" alt="" />
                </div>
            </div>
            <div class="text-info">
                <h3 class="title">{{ anime.title }}</h3>
                <p class="alias">又名：{{ anime.alias }}</p>
                <p class="watch-count">观看次数：{{ anime.watch_count }}</p>
                <div class="tags">
                    类型：
                    <span class="category" v-for="cat in anime?.categories" :key="cat.name">{{ cat.name }}</span>
                </div>
                <p class="rating">评分：{{ anime.rating }}</p>
                <p class="region">地区：{{ anime.region }}</p>
                <p class="year">时间：{{ anime.year }}</p>
                <p class="release_date">发布日期：{{ anime.release_date }}</p>
                <p class="end_date">完结日期：{{ anime.end_date }}</p>
                <p class="stuido">动画公司：{{ anime.studio }}</p>
                <p class="watch_dates">观看日期：{{ anime.watch_dates }}</p>
                <p class="desc">故事简介：{{ anime.description }}</p>
            </div>
        </div>
        <button @click="showUpdateModal = true">修改记录</button>
        <Teleport to="#app">
            <UpdateAnime :show="showUpdateModal" :anime="anime" @submit="handleSubmit" @cancel="showUpdateModal = false"></UpdateAnime>
        </Teleport>
    </div>
</template>

<script setup>
import { getAnime } from '../request/api'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import formatposter from '../fn'
import UpdateAnime from './UpdateAnime.vue'
const anime = ref({})

const route = useRoute()
const stopWatch = watch(
    () => route.params.anime_id,
    async (anime_id) => {
        try {
            const { data: data } = await getAnime(anime_id)
            // console.log(data)
            anime.value = { ...data }
        } catch (err) {
            console.log(err)
        } finally {
            stopWatch()
        }
    },
    {
        immediate: true,
    }
)

const showUpdateModal = ref(false)

const handleSubmit = (newAnime) => {
    // console.log(newAnime)
    anime.value = { ...newAnime }
    showUpdateModal.value = false
}
</script>

<style scoped>
.anime-detail-page {
    width: 80%;
    margin: 0 auto;
}

.back {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    background-color: #f2f2f2;
    padding: 4px 8px;
    border-radius: 4px;
    color: #222;
    font-weight: 400;
}
.back svg {
    margin-right: 4px;
}
.back:hover {
    background-color: #e2e2e2;
}
.top {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.top p {
    line-height: 1.5;
}

.poster {
    width: 320px;
    height: 480px;
}
.poster > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.text-info {
    margin-left: 20px;
}
</style>
