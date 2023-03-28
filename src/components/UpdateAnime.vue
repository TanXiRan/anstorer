<template>
    <Transition name="modal">
        <div class="modal-mask" v-if="show" @click.self="handleCancel">
            <div class="modal-container">
                <div class="form">
                    <div class="left">
                        <label for="title">
                            动漫名称：
                            <input type="text" id="title" v-model="form.title" ref="titleRef" @input="handleInputTitle" />
                        </label>
                        <label for="alias">
                            又名：
                            <input type="text" id="alias" v-model="form.alias" />
                        </label>
                        <label for="year">
                            发布时间：
                            <input type="text" id="year" v-model="form.year" />
                        </label>
                        <label for="watch-count">
                            观看次数：
                            <input type="number" id="watch-count" v-model="form.watch_count" />
                        </label>
                        <label for="rating">
                            星星数：
                            <input type="number" id="rating" v-model="form.rating" />
                        </label>
                        <label for="region">
                            地区：
                            <input type="text" id="region" v-model="form.region" />
                        </label>
                        <label for="studio">
                            动画公司：
                            <input type="text" id="studio" v-model="form.studio" />
                        </label>
                        <label for="watch-dates">
                            观看日期：
                            <input type="text" id="watch-dates" v-model="form.watch_dates" />
                        </label>
                        <label for="release_date">
                            发布日期：
                            <input type="text" id="release_date" v-model="form.release_date" />
                        </label>
                        <label for="end_date">
                            完结日期：
                            <input type="text" id="end_date" v-model="form.end_date" />
                        </label>
                        <label for="categories-select">
                            分类：
                            <select v-model="form.categories" id="categories-select" multiple>
                                <option value="none" selected disabled hidden>请选择选项</option>
                                <option v-for="cat in categories" :value="cat?.name" :selected="form.categories.indexOf(cat?.name) !== -1" :key="cat.name">
                                    {{ cat?.name }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <div class="right">
                        <div class="desc">
                            <p>剧情简介：</p>
                            <textarea name="desc" id="desc"></textarea>
                        </div>
                        <div class="posters">
                            <label class="upload-icon" for="upload-input">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-cloudupload"></use>
                                </svg>
                                <p>上传海报</p>
                            </label>
                            <input type="file" multiple id="upload-input" accept="image/*" @change="updateImageDisplay" />
                            <div class="banner">
                                <template v-for="(poster, index) in posters" :key="index">
                                    <div class="poster">
                                        <img :src="formatposter(poster)" alt="" />
                                        <svg class="icon delete-icon" aria-hidden="true" @click="remove1(poster)">
                                            <use xlink:href="#icon-shanchu"></use>
                                        </svg>
                                    </div>
                                </template>
                                <template v-for="(path, key) in postersObj" :key="key">
                                    <div class="poster">
                                        <img :src="path" alt="" />
                                        <svg class="icon delete-icon" aria-hidden="true" @click="remove2(key)">
                                            <use xlink:href="#icon-shanchu"></use>
                                        </svg>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <button class="cancle" type="button" @click="handleCancel">取消</button>
                    <button class="confirm" type="button" @click="handleSubmit">添加</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getCategories, updateAnime, uploadPosters } from '../request/api'
import formatposter from '../fn'

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    anime: {
        type: Object,
        required: true,
    },
})

const emits = defineEmits(['submit', 'cancel'])
const titleRef = ref(null)

const form = ref({
    title: '',
    alias: '',
    year: '',
    watch_count: 1,
    rating: 10,
    region: '',
    studio: '',
    watch_dates: '',
    release_date: '',
    end_date: '',
    categories: [],
    posters: [],
})

const posters = computed(() => form.value.posters)

const anime_id = ref(null)
const categories = ref([])

onMounted(async () => {
    try {
        const { data: data } = await getCategories()
        // console.log(data)
        categories.value.push(...data)
    } catch (err) {
        console.error('出错啦！', err)
    }
})
watch(
    () => props.anime,
    (animeObj) => {
        // console.log(animeObj)
        anime_id.value = animeObj.id
        Object.keys(form.value).forEach((key) => {
            if (key === 'categories') {
                const cat_ls = []
                animeObj[key].forEach((item) => {
                    cat_ls.push(item.name)
                })
                form.value[key] = cat_ls
            } else if (key === 'posters') {
                const poster_ls = []
                animeObj[key].forEach((item) => {
                    poster_ls.push(item.path)
                })
                form.value[key] = poster_ls
            } else {
                form.value[key] = animeObj[key]
            }
        })
    }
)

const handleInputTitle = (evt) => {
    console.log(evt)
}

const handleSubmit = async () => {
    if (form.value.title === '') {
        const title = document.querySelector('#title')
        if (title) {
            title.classList.add('miss')
            title.focus()
        }
        window.alert('请至少输入动漫名称！')
        return
    }
    const newposters = Object.keys(postersObj.value)
    // console.log(newposters)
    form.value.posters.push(...newposters)
    // console.log(anime_id.value, form.value)
    const res = await updateAnime(anime_id.value, form.value)
    // console.log(res.data)
    emits('submit', res.data)
}

const handleCancel = () => {
    emits('cancel')
}
const Urlposter = (poster) => {
    let url = null
    if (window.URL !== null) {
        url = window.URL.createObjectURL(poster)
    } else if (window.createObjectURL !== null) {
        url = window.createObjectURL(poster)
    } else if (window.webkitURL !== null) {
        url = window.webkitURL.createObjectURL(poster)
    }
    return url
}

const postersObj = ref({})
const updateImageDisplay = async (evt) => {
    // console.log(evt.target.files)
    const posterfiles = evt.target.files
    const formData = new FormData()
    for (let i = 0; i < posterfiles.length; i++) {
        formData.append(`files`, posterfiles[i])
    }
    try {
        const { data: res } = await uploadPosters(formData)
        // console.log(res)
        if (res.status === 'success') {
            const pathes = res.poster_pathes
            // form.posters.push(...pathes)
            for (let i = 0; i < posterfiles.length; i++) {
                postersObj.value[pathes[i]] = Urlposter(posterfiles[i])
            }
            // for (let poster of posterfiles) {
            //     console.log(poster)
            //     postersObj.value[poster.name] = Urlposter(poster)
            // }
        }
    } catch (err) {
        console.log(err)
    }
}

const remove1 = (poster) => {
    const index = form.value.posters.indexOf(poster)
    form.value.posters.splice(index, 1)
}

const remove2 = (key) => {
    delete postersObj.value[key]
    console.log(postersObj.value)
}
</script>

<style scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-container {
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}
.form {
    display: flex;
    margin-bottom: 20px;
}

.left {
    margin-right: 20px;
}

.right {
    width: 240px;
}

.desc {
    margin-bottom: 10px;
}

.desc textarea {
    appearance: none;
    outline: none;
    margin-top: 5px;
    border-radius: 12px;
    padding: 6px 10px;
    font-size: 14px;
    border: 2px solid transparent;
    background-color: #f9f9f9;
    resize: none;
    transition: border-color 0.25s ease;
    width: 100%;
    height: 160px;
}
.desc textarea:focus {
    border-color: rgb(80, 109, 255);
}

.desc textarea:hover {
    border-color: rgb(80, 109, 255);
}
.posters .upload-icon {
    border-radius: 12px;
    background-color: #f7f7f7;
    cursor: pointer;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px dotted transparent;
    transition: border-color 0.25s ease;
    margin-bottom: 14px;
}

.posters .upload-icon:hover {
    background-color: #f0f0f0;
    border-color: rgb(80, 109, 255);
}

.posters input {
    display: none;
}

.banner .poster {
    width: 100%;
    height: 100px;
    overflow: hidden;
    position: relative;
}

.poster > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.poster .delete-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 24px;
    cursor: pointer;
}

.btns {
    display: flex;
    align-items: center;
    justify-content: center;
}
.confirm {
    margin-left: 20px;
}
label {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 8px;
    justify-content: space-between;
}
label:last-child {
    margin-bottom: 0;
}

input {
    appearance: none;
    outline: none;
    border: 1px solid rgb(115, 114, 114);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 16px;
    color: #333;
    width: 240px;
}
input:focus {
    border-color: rgb(80, 109, 255);
}
input::placeholder {
    color: darkgray;
    font-size: 14px;
}

input.miss {
    border-color: red;
}
select {
    appearance: none;
    outline: none;
    width: 240px;
    border: 1px solid rgb(115, 114, 114);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 16px;
}

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
}
</style>
