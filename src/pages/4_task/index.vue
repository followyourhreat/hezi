<template>
  <div class="page">
    <Tabs :animated="false">
      <TabPane label="任务管理" name="name1" v-if="tab[0].checked"><manage /></TabPane>
      <TabPane label="任务类型" name="name2" v-if="tab[1].checked"><type /></TabPane>
      <TabPane label="任务banner" name="name3" v-if="tab[2].checked"><banner /></TabPane>
    </Tabs>
  </div>
</template>
<script>
  import banner from './banner.vue'
  import type from './type.vue'
  import manage from './manage.vue'
  export default {
    components: {
      banner,
      type,
      manage
    },
    data () {
      var pagesRouter = JSON.parse(localStorage.getItem("menuInfo"))
      return {
        tab: pagesRouter[4].child
      }
    },

    mounted () {

    },

    methods: {
    
    },
  };
</script>