<template>
  <div class="page">
    <Tabs :animated="false">
      <TabPane label="账号管理" name="name1" v-if="tab[0].checked == 1">
        <account/>
      </TabPane>
      <TabPane label="角色管理" name="name2" v-if="tab[1].checked == 1">
        <role/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import account from "./account.vue";
import role from "./role.vue";
export default {
  components: {
    account,
    role
  },
  data() {
    var pagesRouter = JSON.parse(localStorage.getItem("menuInfo"));
    return {
      tab: pagesRouter[2].child
      // tab: []
    };
  },

  mounted() {
    // this.getMenuList();
  },

  methods: {
    // getMenuList() {
    //   this.$post("menu/usermenu", {}).then(res => {
    //     let menuList = res.data;
    //     this.tab = menuList[2].child;
    //   });
    // }
  }
};
</script>