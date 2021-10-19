import axios from 'axios';

const BaseURL = "http://13.76.46.159:8000/api/v1"

export const Api = {
    login: (phonenumber, password) => {
        return axios.post(`${BaseURL}/users/login`,{
            phonenumber : phonenumber,
            password: password,
        })
    },
    register: (phonenumber, password, username) => {
        return axios.post(`${BaseURL}/users/register`,{
            phonenumber,
            password,
            username
        })
    }
}

