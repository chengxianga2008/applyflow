import axios from 'axios'

export default {

    url: process.env.VUE_APP_API_URL,

    getCandidate(id) {
        return axios.get(`${this.url}/v1/candidate/${id}`);
    },

    postCandidate(id, token, params) {
        return axios.post(`${this.url}/v1/candidate/${id}`, params, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }
}