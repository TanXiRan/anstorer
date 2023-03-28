import { createRouter, createWebHistory } from 'vue-router'
import AnimeList from '../components/AnimeList.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: AnimeList,
    },
    {
        path: '/animes/:anime_id',
        name: 'anime',
        component: () => import('../components/AnimePage.vue'),
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior(to, from, savedPositon) {
        if (savedPositon) return savedPositon
        return { top: 0 }
    },
})

export default router
