import axios from "axios";

const BaseURL = "http://13.76.46.159:8000/api/v1";

export const Api = {
  login: (phonenumber, password) => {
    return axios.post(`${BaseURL}/users/login`, {
      phonenumber: phonenumber,
      password: password,
    });
  },
  register: (phonenumber, password, username) => {
    return axios.post(`${BaseURL}/users/register`, {
      phonenumber,
      password,
      username,
    });
  },
  createPost: (token, described, images, videos, onSend) => {
    return axios({
      method: "post",
      url: `${BaseURL}/posts/create`,
      data: {
        described,
        images,
        videos,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
      onUploadProgress: onSend,
    });
  },
  editPost: (token, id, described, images, videos, onSend) => {
    return axios({
      method: "post",
      url: `${BaseURL}/posts/edit/${id}`,
      data: {
        described,
        images,
        videos,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
      onUploadProgress: onSend,
    });
  },
  getComment: (token, postId) => {
    return axios({
      method: "get",
      url: `${BaseURL}/postComment/list/${postId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    });
  },
  createComment: (token, postId, content) => {
    let commentAnswered = null;
    return axios({
      method: "post",
      url: `${BaseURL}/postComment/create/${postId}`,
      data: {
        content,
        commentAnswered,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    });
  },
  createReport: (token, postId, subject, details) => {
    return axios({
      method: "post",
      url: `${BaseURL}/postReport/create/${postId}`,
      data: {
        subject: subject,
        details: details,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    });
  },
  getPosts: (token) => {
    return axios.get(`${BaseURL}/posts/list`, {
      headers: {
        authorization: token,
      },
    });
  },
  getMe: (token) => {
    return axios.get(`${BaseURL}/users/show`, {
      headers: {
        authorization: token,
      },
    });
  },
  getUser: (token, id) => {
    return axios.get(`${BaseURL}/users/show/${id}`, {
      headers: {
        authorization: token,
      },
    });
  },
  getChats: (token) => {
    return axios({
      method: "get",
      url: `${BaseURL}/chats/getChats`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  deleteChat: (token, chatId) => {
    return axios({
      method: "delete",
      url: `${BaseURL}/chats/deleteChat/${chatId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },
  getMessages: (token, chatId) => {
    return axios({
      method: "get",
      url: `${BaseURL}/chats/getMessages/${chatId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },
  getPostsById: (token, id) => {
    return axios.get(`${BaseURL}/posts/list?userId=${id}`, {
      headers: {
        authorization: token,
      },
    });
  },
  editUser: (token, data) => {
    return axios.post(
      `${BaseURL}/users/edit`,
      {
        ...data,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  setBlockDiary: (token, userId, type) => {
    // type = true (block) or false (unblock)
    return axios({
      method: "post",
      url: `${BaseURL}/users/set-block-diary`,
      data: {
        user_id: userId,
        type: type,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },
  // setBlock
  changePassword: (token, currentPassword, newPassword) => {
    return axios({
      method: "post",
      url: `${BaseURL}/users/change-password`,
      data: {
        currentPassword,
        newPassword,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  getUserByPhone: (token, phonenumber) => {
    return axios({
      method: "get",
      url: `${BaseURL}/users/showbyphone/${phonenumber}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  getFriendStatus: (token, friendId) => {
    return axios({
      method: "get",
      url: `${BaseURL}/friends/status/${friendId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  sendFriendRequest: (token, friendId) => {
    return axios({
      method: "post",
      url: `${BaseURL}/friends/set-request-friend`,
      data: {
        user_id: friendId,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  sendAcceptFriendRequest: (token, friendId) => {
    return axios({
      method: "post",
      url: `${BaseURL}/friends/set-accept`,
      data: {
        user_id: friendId,
        is_accept: "1",
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  sendRejectFriendRequest: (token, friendId) => {
    return axios({
      method: "post",
      url: `${BaseURL}/friends/set-accept`,
      data: {
        user_id: friendId,
        is_accept: "2",
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },

  sendCancelFriendRequest: (token, friendId) => {
    return axios({
      method: "post",
      url: `${BaseURL}/friends/cancel-request`,
      data: {
        user_id: friendId,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "a " + token,
      },
    });
  },
  searchFriendAndMessage: (token, key) => {
    return axios({
      method: "get",
      url: `${BaseURL}/search/${key}`,
      headers: {
        authorization: "a " + token,
      },
    });
  },
};
