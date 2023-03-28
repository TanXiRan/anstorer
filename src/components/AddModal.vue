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
                            <select v-model="form.categories" id="categories-select">
                                <option value="none" selected disabled hidden>请选择选项</option>
                                <option v-for="cat in categories" :value="cat?.name" :key="cat.name">
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
                                <!-- <div class="poster" v-for="(poster, index) in poster_urls" :key="index">
                                    <img :src="poster" alt="" />
                                    <svg class="icon delete-icon" aria-hidden="true" @click="handleremove(poster)">
                                        <use xlink:href="#icon-shanchu"></use>
                                    </svg>
                                </div> -->
                                <template v-for="(path, key) in postersObj" :key="key">
                                    <div class="poster">
                                        <img :src="path" alt="" />
                                        <svg class="icon delete-icon" aria-hidden="true" @click="handleremove(key)">
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
import { reactive, ref, getCurrentInstance } from 'vue'
import { uploadPosters, createAnime } from '../request/api'

defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
})
const instance = getCurrentInstance()
const emits = defineEmits(['submit', 'cancel'])
const titleRef = ref(null)
const form = reactive({
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

const handleInputTitle = (evt) => {
    if (evt.target.classList.contains('miss')) {
        evt.target.classList.remove('miss')
    }
}

const handleSubmit = async () => {
    if (form.title === '') {
        if (titleRef.value) {
            titleRef.value.focus()
            titleRef.value.classList.add('miss')
        }
        window.alert('请至少输入动漫名称！')
        return
    }
    try {
        console.log(form)
        const { data: anime } = await createAnime(form)
        // console.log(anime)
        Object.keys(form).forEach((key) => {
            if (key === 'categories' || key === 'posters') form[key] = []
            else if (key === 'rating') form[key] = 10
            else if (key === 'watch_count') form[key] = 1
            else form[key] = ''
        })
        poster_urls.value = []
        postersObj.value = {}
        // console.log(form)
        instance?.proxy?.$emitter.emit('pushAnime', anime)
        emits('submit', anime)
    } catch (err) {
        window.alert('出错啦！', err)
    }
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
const poster_urls = ref([])
const updateImageDisplay = async (evt) => {
    console.log(evt.target.files)
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
            form.posters.push(...pathes)
            for (let i = 0; i < posterfiles.length; i++) {
                postersObj.value[pathes[i]] = Urlposter(posterfiles[i])
            }

            // for (let poster of posterfiles) {
            //     poster_urls.value.push(Urlposter(poster))
            // }
        }
    } catch (err) {
        console.log(err)
    }
}

const handleremove = (key) => {
    delete postersObj.value[key]
    // console.log(postersObj.value)
    const index = form.posters.indexOf(key)
    form.posters.splice(index, 1)
    // console.log(form.posters)
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
    color: #333;
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
    background-color: #fff;
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
    background-color: #fff;
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
