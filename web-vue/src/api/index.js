// api/index.js
import axios from 'axios';

// API 서버의 기본 URL 설정
const API_BASE_URL = 'http://localhost:3000';

// 카테고리 데이터를 불러오는 함수
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todo/categories`);
    return response.data;
  } catch (error) {
    console.error('getCategories 에러:', error);
    throw error;
  }
};

// 카테고리 데이터를 수정하는 함수
export const updateCategories = async (updatedData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todo/categories`, updatedData);
    return response.data;
  } catch (error) {
    console.error('updateCategories 에러:', error);
    throw error;
  }
};
