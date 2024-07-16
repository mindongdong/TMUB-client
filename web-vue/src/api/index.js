// api/index.js
import axios from "axios";

// API 서버의 기본 URL 설정
const API_BASE_URL = process.env.API_URL || "/tmub/api";

// 카테고리 데이터를 불러오는 함수
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todo/categories`);
    return response.data;
  } catch (error) {
    console.error("getCategories 에러:", error);
    throw error;
  }
};

// 카테고리 데이터를 수정하는 함수
export const updateCategories = async (updatedData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/todo/categories`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("updateCategories 에러:", error);
    throw error;
  }
};

// 모든 유저의 출퇴근 시간을 조회하는 함수
export const getAllRecords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discord/all-records`);
    return response.data;
  } catch (error) {
    console.error("getAllRecords 에러:", error);
    throw error;
  }
};

// 출근 시간이 기록된 날짜들을 조회하는 함수
export const getRecordedDates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discord/recorded-dates`);
    return response.data;
  } catch (error) {
    console.error("getRecordedDates 에러:", error);
    throw error;
  }
};

// 출퇴근 시간이 기록된 유저 목록을 조회하는 함수
export const getRecordedUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discord/recorded-users`);
    return response.data;
  } catch (error) {
    console.error("getRecordedUsers 에러:", error);
    throw error;
  }
};

// 특정 날짜 범위 안의 특정 유저의 출퇴근 시간을 조회하는 함수(요청 쿼리 사용)
export const getRecoredByDates = async (username, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/discord/records-by-date`,
      {
        params: { username, startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error("getRecoredByDates 에러:", error);
    throw error;
  }
}
