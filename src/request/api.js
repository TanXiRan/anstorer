import instance from '.'

export function uploadPosters(posters) {
    return instance({
        method: 'post',
        url: '/file/posters',
        data: posters,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export function createAnime(form) {
    return instance({
        method: 'post',
        url: '/animes',
        data: form,
    })
}

export function getAnimes(next_url) {
    return instance({
        method: 'get',
        url: next_url ? next_url : '/animes',
    })
}

export function searchAnime(form) {
    const keys = Object.keys(form)
    let parameters = `?${keys[0]}=${form[keys[0]]}`
    for (let i = 1; i < keys.length; i++) {
        parameters = parameters + `&${keys[i]}=${form[keys[i]]}`
    }
    console.log(parameters)
    return instance({
        method: 'get',
        url: `/animes${parameters}`,
    })
}

export function getAnime(anime_id) {
    return instance({
        method: 'get',
        url: `/animes/${anime_id}`,
    })
}

export function deleteAnime(anime_id) {
    return instance({
        method: 'delete',
        url: `/animes/${anime_id}`,
    })
}

export function updateAnime(anime_id, form) {
    return instance({
        method: 'patch',
        url: `/animes/${anime_id}`,
        data: form,
    })
}

export function getPoster(poster_name) {
    return instance({
        method: 'get',
        url: `/file/posters/${poster_name}`,
    })
}

export function createCategory() {
    return instance({
        method: 'post',
        url: '/categories/',
    })
}

export function getCategories() {
    return instance({
        method: 'get',
        url: '/categories/',
        token: false,
    })
}

export function deleteCategory(cat_id) {
    return instance({
        method: 'delete',
        url: `/categories/${cat_id}`,
    })
}

export function getCategory(cat_id) {
    return instance({
        method: 'get',
        url: `/categories/${cat_id}`,
    })
}
