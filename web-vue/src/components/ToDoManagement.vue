<template>
  <div class="container">
    <!-- 각 카테고리에 대해 반복하며 컴포넌트 생성 -->
    <div v-for="(items, category) in categorys" :key="category" class="component" :style="{ width: calculateWidth() }">
      <div class="header">
        <h1 class="title">{{ category }}</h1>
        <button class="plus-button" @click="showAddItemForm(category)">+</button>
      </div>
      <ul class="content-list">
        <li v-for="(item, index) in items" :key="index" class="list-item">
          <div class="list-item__text">
            <div class="list-item__date">{{ item.startTime }} ~ {{ item.endTime }}</div>
            <div class="list-item__title">{{ item.title }}</div>
          </div>
          <button class="edit-button" @click="editItem(category, index)">수정</button>
        </li>
        <li class="list-item" v-if="newItem.adding && newItem.category === category">
          <div class="list-item__text">
            <input class="list-item__date" type="date" v-model="newItem.endTime">
            <input class="list-item__title" type="text" placeholder="할 일 제목 입력" v-model="newItem.title">
          </div>
          <button class="complete-button" @click="completeAddingItem">완료</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { getCategories, updateCategories } from '@/api/index';

// 컴포넌트가 마운트될 때 카테고리 데이터를 불러옴
onMounted(async () => {
  try {
    this.categories.value = await getCategories();
  } catch (error) {
    console.error('카테고리 데이터 불러오기 실패:', error);
  }
});

export default {
  data() {
    return {
      categorys: {
        'Lifestyle': [
          { startTime: '01.01', endTime: '01.02', title: 'New Year Celebration' },
          { startTime: '02.14', endTime: '02.14', title: 'Valentine\'s Day' }
        ],
        'Work': [
          { startTime: '01.01', endTime: '01.02', title: 'New Year Celebration' },
          { startTime: '02.14', endTime: '02.14', title: 'Valentine\'s Day' }
        ],
        'Study': [
          { startTime: '01.01', endTime: '01.02', title: 'New Year Celebration' },
          { startTime: '02.14', endTime: '02.14', title: 'Valentine\'s Day' }
        ]
      },
      newItem: reactive({
        category: '',
        endTime: '',
        title: '',
        adding: false,
        editing: false,
      })
    };
  },
  methods: {
    updateCategories() {
      // 카테고리 데이터를 업데이트
      updateCategories(this.categorys);
    },
    calculateWidth() {
      // Calculate the width for each component based on N
      return (100 / 3) + '%';
    },
    showAddItemForm(category) {
      this.newItem.category = category;
      this.newItem.adding = true;
    },
    completeAddingItem() {
      if (this.newItem.endTime && this.newItem.title) {
        const currentTime = new Date();
        const formatNumber = (num) => num.toString().padStart(2, '0'); // 숫자를 두 자리 형식으로 포맷
        const startDate = this.convertDate(currentTime);
        const originalEndTime = new Date(this.newItem.endTime);
        const endDate = this.convertDate(originalEndTime);

        if (new Date(`${currentTime.getFullYear()}-${formatNumber(currentTime.getMonth() + 1)}-${formatNumber(currentTime.getDate())}`) <=
          new Date(`${originalEndTime.getFullYear()}-${formatNumber(originalEndTime.getMonth() + 1)}-${formatNumber(originalEndTime.getDate())}`)) {
          const newItem = {
            startTime: startDate,
            endTime: endDate,
            title: this.newItem.title
          };
          this.categorys[this.newItem.category].push(newItem);
          this.resetNewItem();
          return newItem;
        } else {
          alert('시작 날짜가 종료 날짜보다 늦습니다. 다시 입력해주세요.');
          if (this.newItem.editing) {
            this.categorys[this.newItem.category].push({
              startTime: this.newItem.startTime,
              endTime: this.newItem.endTime,
              title: this.newItem.title
            });
          }
        }
      } else {
        alert('모든 필드를 입력해주세요.');
      }
      this.resetNewItem();
    },
    resetNewItem() {
      this.newItem.category = '';
      this.newItem.endTime = '';
      this.newItem.title = '';
      this.newItem.adding = false;
      updateCategories(this.categorys);
    },
    editItem(category, index) {
      // 선택한 항목의 데이터를 가져와서 수정 준비
      const item = this.categorys[category][index];
      console.log(item.endTime);
      this.newItem.endTime = this.convertDate(item.endTime); // 선택한 항목의 종료 시간을 새 항목에 설정
      this.newItem.title = item.title; // 선택한 항목의 제목을 새 항목에 설정
      this.newItem.editing = true; // 수정 모드로 변경
      this.categorys[category].splice(index, 1); // 기존 항목 삭제
      // 수정 폼을 보여주는 함수 실행
      this.showAddItemForm(category);
    },
    convertDate(input) {
      if (typeof input === 'string') {
        // 입력이 문자열 "MM.DD" 형식일 경우 "YYYY-MM-DD" 문자열로 변환
        const parts = input.split('.');
        const year = new Date().getFullYear(); // 현재 연도 사용
        const month = parts[0]; // 월
        const day = parts[1]; // 일
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else if (input instanceof Date) {
        // 입력이 Date 객체일 경우 "MM.DD" 문자열 형식으로 변환
        const formatNumber = (num) => num.toString().padStart(2, '0');
        const month = formatNumber(input.getMonth() + 1); // getMonth()는 0부터 시작하므로 1을 더함
        const day = formatNumber(input.getDate());
        return `${month}.${day}`;
      } else {
        throw new Error('입력 형식이 올바르지 않습니다.');
      }
    },
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  /* 컴포넌트 간 간격 */
  background-color: #121212;
  /* 배경색 (다크 모드) */
  color: #e0e0e0;
  /* 글자색 (다크 모드) */
  padding: 2rem 4rem;
  box-sizing: border-box;
}

.component {
  min-width: 440px;
  height: 100%;
  /* 각 분할된 컴포넌트의 높이 */
  border: 1px solid #333;
  /* 컴포넌트 테두리 */
  box-sizing: border-box;
}

.header {
  height: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  /* 헤더 하단 테두리 */
  padding: 0.5rem;
}

.title {
  text-align: center;
  /* 타이틀 텍스트 중앙 정렬 */
  flex-grow: 1;
}

.plus-button,
.edit-button,
.complete-button {
  margin-right: 0;
  /* 버튼 우측 정렬 */
  background-color: #333;
  /* 버튼 배경색 */
  color: #fff;
  /* 버튼 글자색 */
  border: none;
  cursor: pointer;
}

.content-list {
  width: calc(100% - 0.75rem); /* 스크롤바 공간을 고려하여 전체 너비에서 20px 빼기 */
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: calc(100% - 1.5rem);
  overflow-y: auto; /* 내용이 넘칠 때 스크롤바 자동 생성 */
  box-sizing: border-box; /* 패딩과 테두리가 너비에 포함되도록 설정 */
  scrollbar-width: thin; /* 스크롤바 너비를 얇게 조정 */
  scrollbar-color: #646464 #202020; /* 스크롤바 색상과 스크롤바 트랙 색상 설정 */
}

/* 웹킷 기반 브라우저용 스크롤바 스타일 */
.content-list::-webkit-scrollbar {
  width: 8px; /* 스크롤바의 너비 */
}

.content-list::-webkit-scrollbar-track {
  background: #202020; /* 스크롤바 트랙의 배경 색상 */
}

.content-list::-webkit-scrollbar-thumb {
  background-color: #646464; /* 스크롤바 썸(핸들)의 색상 */
  border-radius: 4px; /* 스크롤바 썸의 모서리 둥글게 */
  border: 2px solid #202020; /* 스크롤바 썸과 트랙 간의 경계선 */
}

.list-item {
  height: 2rem;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  /* 아이템 하단 테두리 */
}

.list-item__text {
  display: flex;
  align-items: center;
}

.list-item__date {
  font-size: 1rem;
  border-right: 1px solid #333;
  /* 날짜와 제목 구분선 */
  padding-right: 0.5rem;
  margin-right: 0.5rem;
}

.list-item__title {
  font-size: 1rem;
}
</style>