<template>
    <div class="anime-list">
        <AnimeItem v-for="anime in AnimeArray" :key="anime.title" :anime="anime"></AnimeItem>
        <BottomLoader v-if="showLoading"></BottomLoader>
    </div>
</template>

<script setup>
import AnimeItem from './AnimeItem.vue'
import BottomLoader from './BottomLoader.vue'
import { getAnimes, searchAnime } from '../request/api'
import { ref, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'

const next_url = ref('')
let debounceTimer

function debounce(func, ms) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        func()
    }, ms)
}

const getAnime = async () => {
    try {
        const { data: animes, headers } = await getAnimes(next_url.value)
        AnimeArray.value.push(...animes)
        next_url.value = headers?.next_url
        console.log(next_url.value)
    } catch (err) {
        console.log(err)
    } finally {
        showLoading.value = false
    }
}

const handleScroll = async () => {
    if (document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
        if (next_url.value) {
            showLoading.value = true
            debounce(getAnime, 2000)
        }
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

const instance = getCurrentInstance()

const AnimeArray = ref([])

const showLoading = ref(false)

onMounted(async () => {
    await getAnime()
    window.addEventListener('scroll', handleScroll)
    instance?.proxy?.$emitter.on('pushAnime', (anime) => {
        AnimeArray.value.push(anime)
    })
    instance?.proxy?.$emitter.on('searchAnime', async (key) => {
        try {
            const { data: data } = await searchAnime({ category: key })
            AnimeArray.value = data
        } catch (err) {
            console.log(err)
        }
    })
})
</script>

<style scoped>
.anime-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
}

.anime-item {
    margin-right: 20px;
    margin-bottom: 20px;
}
.anime-item:last-child {
    margin-right: 0;
}
</style>
