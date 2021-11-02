import axios from 'axios';

const BaseURL = "http://13.76.46.159:8000/api/v1"

const config = (token)=>{
    return {
        headers: {
            authorization: "a "+token,
        }
    }
}

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
    },
    createPost: (token, described, images, videos,onSend) => {
         return axios({
            method: 'post',
            url: `${BaseURL}/posts/create`,
            data: {
                described, 
                images, 
                videos
            },
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', authorization: "a "+token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000,
            onUploadProgress: onSend
        })
    },
    editPost: (token,id, described, images, videos,onSend) => {
        return axios({
           method: 'post',
           url: `${BaseURL}/posts/edit/${id}`,
           data: {
               described, 
               images, 
               videos
           },
           headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', authorization: "a "+token },
           maxContentLength: 100000000,
           maxBodyLength: 1000000000,
           onUploadProgress: onSend
       })
   },
    getComment: (token, postId) => {
        return axios({
            method: 'get',
            url: `${BaseURL}/postComment/list/${postId}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', authorization: "a "+token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
        })
    },
    createComment: (token, postId, content) => {
        let commentAnswered = null;
        return axios({
            method: 'post',
            url: `${BaseURL}/postComment/create/${postId}`,
            data: {
                content,
                commentAnswered
            },
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', authorization: "a "+token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
        })
    },
    createReport: (token, postId, subject, details) => {
        return axios({
            method: 'post',
            url: `${BaseURL}/postReport/create/${postId}`,
            data: {
                subject: subject,
                details: details
            },
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', authorization: "a "+token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
        })
    },
    getPosts: (token) =>{
        return axios.get(`${BaseURL}/posts/list`,{
            "headers": {
                "authorization":token
            }
        })
    },
    getMe: (token)=> {
        return axios.get(`${BaseURL}/users/show`,{
            "headers": {
                "authorization":token
            }
        })
    }
}

