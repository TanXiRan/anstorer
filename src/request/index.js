import axios from 'axios'

const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use((config) => {
    if (config.method === 'post') {
        console.log(config.data, config.headers['Content-Type'])
    }
    return config
})

export default instance
