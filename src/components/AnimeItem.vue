<template>
    <div class="anime-item" @click="handleClick">
        <div class="poster">
            <img :src="formatposter(anime?.posters[0]?.path)" alt="anime poster" />
        </div>
        <!-- <img :src="formatposter(anime?.posters[0]?.path)" alt="anime poster" class="poster" /> -->
        <h4 class="title">{{ anime.title }}</h4>
    </div>
</template>

<script setup>
import formatposter from '../fn'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    anime: {
        type: Object,
        required: true,
    },
})

const handleClick = () => {
    router.push({ name: 'anime', params: { anime_id: props.anime.id } })
}
</script>

<style scoped>
.anime-item {
    width: 180px;
}
.anime-item:hover {
    cursor: pointer;
}
.anime-item:hover .poster {
    -webkit-box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
    -moz-box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
    box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
}

.anime-item:hover .title {
    color: rgb(80, 109, 255);
}
.poster {
    width: 100%;
    height: 240px;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 10px;
    /* background: #e0e0e0; */
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all 0.25s ease-out;
    -moz-transition: all 0.25s ease-out;
    transition: all 0.25s ease-out;
}
.poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
/* 
.anime-item:hover .poster {
    -webkit-box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
    -moz-box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
    box-shadow: 10px 10px 22px #e8e8e8, -10px -10px 22px #e8e8e8;
}

.anime-item:hover .title {
    color: rgb(80, 109, 255);
}
.poster {
    width: 180px;
    height: 260px;
    border-radius: 6px;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
    object-fit: cover;
    margin-bottom: 10px;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all 0.25s ease-out;
    -moz-transition: all 0.25s ease-out;
    transition: all 0.25s ease-out;
} */

.desc {
    text-align: left;
    line-height: 1.5;
}
.title {
    padding: 0 2px;
    color: #222;
    font-weight: 400;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
