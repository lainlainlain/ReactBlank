import axios from "axios"
import cookie from 'js-cookie'
import { apiUrl } from "../constants/constants";

const instance = axios.create({
    baseURL:apiUrl
});

instance.interceptors.request.use(
    config => {
        let token = cookie.get('token')
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status !== 401 || error.response.headers['token-expired'] !== 'true') {
            return Promise.reject(error)
        }

        // Try request again with new token
        return api.login(cookie.get('login')!, cookie.get('password')!)
            .then(res => {
                // New request with new token
                const config = error.config
                cookie.set('token', res.token)
                config.headers['Authorization'] = 'Bearer ' + res.token

                return new Promise((resolve, reject) => {
                    axios.request(config).then(response => {
                        resolve(response)
                    }).catch((error) => {
                        reject(error);
                    })
                })

            })
            .catch(error => {
                Promise.reject(error);
            })
    }
)

export const api = {
    login(login: string, password: string) {
        return instance.post('users/auth', {
            login: login,
            password: password
        })
            .then(res => {
                return res.data
            })
            .catch(err => {
                console.log(err)
            })
    },

    getObjects(tbl: string) {
        return instance.get('objects/' + tbl)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    getObjectsWithOptions(name: string, options: any) {
        return instance.post('objects/' + name + '/loadoptions', options)

            .then(res => res.data)
            .catch(err => console.log(err))
    },

    addObject(tbl: string, dataRow: any) {
        return instance.post('objects/' + tbl, dataRow)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    editObject(tbl: string, dataRow: any) {
        return instance.put('objects/' + tbl, dataRow)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    deleteObject(tbl: string, code: any) {
        return instance.delete('objects/' + tbl + "/" + code)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    getObjectDataRow(tbl: string, code: any) {
        return instance.get('objects/' + tbl + '/' + code)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    getObjectFields(tbl: string) {
        return instance.get('objects/' + tbl + '/fields')
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    addRepoFile(obj: string, obj_code: string, file: File) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('obj', obj)
        formData.append('obj_code', obj_code)

        return instance.post('repo/upload', formData)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    getRepoFile(code: string) {
        return instance.get('repo/' + code)
            .then(res => res.data)
            .catch(err => console.log(err))
    },

    deleteRepoFile(code: string) {
        return instance.delete('repo/' + code)
            .then(res => res.data)
            .catch(err => console.log(err))
    },
}