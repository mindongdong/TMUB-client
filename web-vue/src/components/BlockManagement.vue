<template>
  <div class="container">
    <div class="dropdown-container" v-if="selectedUser == ''">
      <label for="user-select">Select User:</label>
      <select id="user-select" v-model="selectedUser" @change="onUserSelect">
        <option value="" disabled selected>Please Select User</option>
        <option v-for="user in recordedUsers" :key="user" :value="user">{{ user }}</option>
      </select>
    </div>
    <vue-cal v-else class="vuecal--green-theme vuecal--full-height-delete" hide-weekends show-time-in-cells
      :time-from="9 * 60" :time-to="24 * 60" :time-step="30" :special-hours="specialHours" :transitions="false"
      active-view="month" :disable-views="['years', 'year']" :min-date="minDate" :max-date="maxDate"
      :events="allRecords" :editable-events="{ title: true, drag: false, resize: true, delete: true, create: false }">
    </vue-cal>
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
// import { reactive } from 'vue';
// import { getAllRecords, getRecordedDates, getRecordsByDate } from '@/api/index';
import { getRecordedDates, getRecordedUsers, getRecoredByDates } from '@/api/index';

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      allRecords: [],
      recordedDates: [],
      recordedUsers: [],
      selectedUser: '',
    };
  },
  async mounted() {
    try {
      // this.allRecords = await getAllRecords();
      // console.log(this.allRecords);
      this.recordedUsers = await getRecordedUsers();
      console.log(this.recordedUsers);
      this.recordedDates = await getRecordedDates();
      console.log(this.recordedDates);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  },
  methods: {
    onDateSelect(date) {
      console.log('Selected date:', date);
    },
    async onUserSelect() {
      console.log('Selected user:', this.selectedUser);
      try {
        this.allRecords = await getRecoredByDates(this.selectedUser, this.minDate, this.maxDate);
        console.log(this.allRecords);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    },
    // YYYY-MM-DD 형식의 string 데이터를 VueCal에서 사용하는 Date 객체로 변환
    convertDate(date) {
      const [year, month, day] = date.split('-');
      return new Date(year, month - 1, day);
    },
  },
  computed: {
    minDate() {
      if (this.recordedDates.length > 0) {
        return this.convertDate(this.recordedDates[0]);
      }
      return null;
    },
    maxDate() {
      if (this.recordedDates.length > 0) {
        return this.convertDate(this.recordedDates[this.recordedDates.length - 1]);
      }
      return null;
    },
  },
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}

.dropdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dropdown-container label {
  margin-right: 1rem;
}

.dropdown-container select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}

.vuecal__cell--disabled {
  text-decoration: line-through;
}

.vuecal__cell--before-min {
  color: #008b8b;
}

.vuecal__cell--after-max {
  color: #008b8b;
}

.vuecal__event {
  padding: 1rem;
  background-color: #ff6666d9;
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
  cursor: pointer;
}

.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
}

.icon{
  width: 1rem;
  height: 1rem;
  object-fit: contain;
}
</style>