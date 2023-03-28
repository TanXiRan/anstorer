<template>
    <Transition name="modal">
        <div class="modal-mask" v-if="show">
            <div class="modal-container">
                <div class="search-card">
                    <div class="search-input">
                        <input type="text" @change="handleSearch" v-model="searchkey" />
                        <button @click="handleSearch">搜素</button>
                    </div>
                    <div class="search-categories"></div>
                </div>
            </div>
        </div>
    </Transition>
    <div></div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
    show: {
        type: Boolean,
        required: true,
    },
})

const emits = defineEmits(['search'])

const searchkey = ref('')
const handleSearch = () => {
    if (searchkey.value === '') return
    emits('search', searchkey.value)
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
