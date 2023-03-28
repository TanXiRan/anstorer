<script setup>
import AddModal from './AddModal.vue'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { getCategories } from '../request/api'

const categories = ref([])
const instance = getCurrentInstance()
const showAddModal = ref(false),
    showSearchCategories = ref(false)

const keyword = ref('')

const handleSubmit = (anime) => {
    showAddModal.value = false
    console.log('handleSubmit', anime)
}
const handleTagSearch = (tag) => {
    console.log(tag)
    if (tag !== '') {
        showSearchCategories.value = false
        instance?.proxy?.$emitter.emit('searchAnime', tag)
    }
}

const handleSearch = () => {
    if (keyword.value !== '') {
        showSearchCategories.value = false
        instance?.proxy?.$emitter.emit('searchAnime', keyword.value)
        keyword.value = ''
    }
}

onMounted(async () => {
    try {
        const { data: data } = await getCategories()
        categories.value.push(...data)
    } catch (err) {
        console.error('出错啦！', err)
    }
})
</script>

<template>
    <header ref="headerRef">
        <div class="site-name">
            <img src="../assets/vite.svg" alt="" />
            <h2>STORE YOUR ANIMES</h2>
        </div>
        <div class="actions">
            <div class="search">
                <div class="search-btn-input">
                    <!--  -->
                    <input
                        type="text"
                        placeholder="请输入...."
                        @change="handleSearch"
                        @blur="showSearchCategories = false"
                        v-model="keyword"
                        @input="showSearchCategories = true" />
                    <svg class="icon search-icon" aria-hidden="true" @click="handleSearch">
                        <use xlink:href="#icon-sousuo-"></use>
                    </svg>
                </div>
                <div class="search-categories" v-show="showSearchCategories">
                    <span v-for="cat in categories" :key="cat.id" class="cat" @click="handleTagSearch(cat.name)">{{ cat.name }}</span>
                </div>
            </div>

            <svg @click="showAddModal = true" class="icon" aria-hidden="true">
                <use xlink:href="#icon-tianjia1"></use>
            </svg>
        </div>
    </header>
    <Teleport to="#app">
        <AddModal :show="showAddModal" :categories="categories" @submit="handleSubmit" @cancel="showAddModal = false"></AddModal>
    </Teleport>
    <main>
        <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
                <KeepAlive include="AnimeList">
                    <component :is="Component" />
                </KeepAlive>
            </Transition>
        </RouterView>
    </main>
</template>

<style scoped>
main {
    max-width: 1200px;
    margin: 110px auto 0;
    padding-bottom: 80px;
    position: relative;
}

.flex {
    display: flex;
    align-items: center;
}

header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 80px;
    padding: 20px 30px;
    background-color: #fff;
    box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
    display: -webkit-flex; /* 兼容 Safari */
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-transition: all 0.25s ease-in-out; /* 兼容 Safari */
    transition: all 0.25s ease-in-out;
}

.site-name {
    display: flex;
    align-items: center;
    justify-content: left;
}

.site-name h2 {
    letter-spacing: 1px;
    margin-left: 6px;
    font-weight: 600;
}

.actions {
    display: flex;
    align-items: center;
    justify-content: right;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1px;
}

.icon {
    font-size: 32px;
    cursor: pointer;
}

.search {
    margin-right: 16px;
    display: inline-block;
    position: relative;
}

.search-btn-input {
    display: flex;
    align-items: center;
}
.search-btn-input input {
    height: 28px;
    border-radius: 40px;
    width: 200px;
    padding: 4px 10px;
    background-color: #e26969;
    border: 1px solid transparent;
    -webkit-appearance: none; /* 兼容 Safari */
    appearance: none;
    outline: none;
    margin-right: 5px;
    color: #fff;
}
.search-btn-input input::-webkit-input-placeholder {
    /* 兼容 Safari */
    color: #f0f0f0;
}
.search-btn-input input::placeholder {
    color: #f0f0f0;
}

.search-categories {
    position: fixed;
    top: 60px;
    width: 240px;
    font-size: 12px;
    background-color: #f1f2f3;
    padding: 22px 12px 12px 12px;
    border-radius: 8px;
}

.search-categories .cat {
    background-color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 400;
    margin-bottom: 10px;
    margin-right: 10px;
    display: inline-block;
}

.search-categories .cat:hover {
    color: red;
}
.fade-enter-active,
.fade-leave-active {
    -webkit-transition: opacity 0.2s ease; /* 兼容 Safari */
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* main {
    max-width: 1200px;
    margin: 110px auto 40px;
}

.flex {
    display: flex;
    align-items: center;
}

header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 80px;
    padding: 20px 30px;
    background-color: #fff;
    box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s ease-in-out;
}

.site-name {
    display: flex;
    align-items: center;
    justify-content: left;
}

.site-name h2 {
    letter-spacing: 1px;
    margin-left: 6px;
    font-weight: 600;
}
.actions {
    display: flex;
    align-items: center;
    justify-content: right;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1px;
}

.icon {
    font-size: 32px;
    cursor: pointer;
}

.search {
    margin-right: 16px;
    display: inline-block;
    position: relative;
}

.search-btn-input {
    display: flex;
    align-items: center;
}
.search-btn-input input {
    height: 28px;
    border-radius: 40px;
    width: 200px;
    padding: 4px 10px;
    background-color: #e26969;
    border: 1px solid transparent;
    appearance: none;
    outline: none;
    margin-right: 5px;
    color: #fff;
}
.search-btn-input input::placeholder {
    color: #f0f0f0;
}

.search-categories {
    position: fixed;
    top: 60px;
    width: 240px;
    font-size: 12px;
    background-color: #f1f2f3;
    padding: 22px 12px 12px 12px;
    border-radius: 8px;
}

.search-categories .cat {
    background-color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 400;
    margin-bottom: 10px;
    margin-right: 10px;
    display: inline-block;
}

.search-categories .cat:hover {
    color: red;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
} */
</style>
