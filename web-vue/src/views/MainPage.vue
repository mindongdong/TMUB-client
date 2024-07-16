<template>
    <div class="layout">
      <!-- <div class="top-component-container">
        <ToDoManagement />
      </div> -->
      <div class="bottom-component-container">
        <BlockManagement />
      </div>
    </div>
</template>

<script>
// import ToDoManagement from '@/components/ToDoManagement.vue'
import BlockManagement from '@/components/BlockManagement.vue'

export default {
    name: 'MainPage',
    components: {
        // ToDoManagement,
        BlockManagement,
    }
}
</script>

<style scoped>
.layout{
  width: 100%;
  height: 100%;
}
.top-component-container{
  width: 100%;
  height: 30%;
}
.bottom-component-container{
  width: 100%;
  height: 100%;
}
</style>