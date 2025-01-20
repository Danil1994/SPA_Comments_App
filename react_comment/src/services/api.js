import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/comments";

// Get comments
export const fetchComments = (page = 1, sortBy = "created_at", order = "desc") =>
  axios.get(`${API_URL}?page=${page}&sort_by=${sortBy}&order=${order}`);

// Add new comment
export const addComment = (data) => axios.post(API_URL, data);

// Get answers to comment
export const fetchReplies = (parentId, limit = 10) =>
  axios.get(`${API_URL}/${parentId}/replies?limit=${limit}`);
