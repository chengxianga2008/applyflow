import axios from 'axios'

export default {

    url: process.env.VUE_APP_API_URL,

    getToken(api_key) {

        return axios.get(`${this.url}/v1/auth`, {
            headers: {
                "api-key": api_key
            }
        });
    }
}