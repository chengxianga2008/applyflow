import axios from 'axios'

export default {

    url: process.env.VUE_APP_API_URL,

    getSkills() {
        return axios.get(`${this.url}/v1/skills`);
    }
}