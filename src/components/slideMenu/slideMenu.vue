<template>
  <div class="slide">
    <div
      style="height:80px; background: #ff0000;display:flex;position:relative;align-items:center;justify-content:center;"
    >
      <img width="24px" height="24px" src="@/assets/logo.png" style>
    </div>
    <Menu accordion theme="dark" :active-name="activeName" width="auto" @on-select="changeMenu">
      <div v-for="(item,index) in menuList" :key="index">
        <!-- <MenuItem v-if="item.checked" :name="item.url"> -->
        <MenuItem
          :name="item.url"
          v-if="item.checked == 1 || item.child[0].checked == 1 || item.child[1].checked == 1|| item.child[2].checked == 1|| item.child[3].checked == 1|| item.child[4].checked == 1|| item.child[5].checked == 1|| item.child[6].checked == 1|| item.child[7].checked == 1|| item.child[8].checked == 1"
        >
          <!-- <Icon :type="item.icon"></Icon> -->
          <p class="icon" :class="item.icon"></p>
          <p>{{ item.menu_name }}</p>
        </MenuItem>
      </div>
      <!-- <div v-for="(item,index) in menuList" :key="index">
        <MenuItem :name="item.toName">
          <Icon :type="item.icon"></Icon>
          <p>{{ item.title }}</p>
        </MenuItem>
      </div>-->
    </Menu>
  </div>
</template>

<script>
import { pagesRouter } from "@/router/index";
export default {
  name: "slideMenu",
  data() {
    // var pagesRouters = JSON.parse(localStorage.getItem("menuInfo"));
    return {
      activeName: localStorage.getItem("menuName"),
      menuList: [],
      checkedBoolean: ""
      // menuList: []
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.menuList = JSON.parse(localStorage.getItem("menuInfo"));

    console.log(this.menuList);
  },
  methods: {
    changeMenu(name) {
      localStorage.setItem("menuName", name);
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
  border-right: none;
}
.slide {
  position: fixed;
  width: 100px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 2;
  overflow: auto;
  background: #14141d;
}
.icon {
  height: 28px;
}
//首页
.home {
  background: url("../../assets/ic_home.png") center center no-repeat;
}
.ivu-menu-item-active .home {
  background: url("../../assets/home_cur.png") center center no-repeat;
}
//用户管理
.person-stalker {
  background: url("../../assets/ic_user.png") center center no-repeat;
}
.ivu-menu-item-active .person-stalker {
  background: url("../../assets/ic_use_selectr.png") center center no-repeat;
}
//权限管理
.levels {
  background: url("../../assets/ic_jurisdiction.png") center center no-repeat;
}
.ivu-menu-item-active .levels {
  background: url("../../assets/ic_jurisdiction_select.png") center center
    no-repeat;
}
//消息管理
.paper-airplane {
  background: url("../../assets/ic_message.png") center center no-repeat;
}
.ivu-menu-item-active .paper-airplane {
  background: url("../../assets/ic_message_select.png") center center no-repeat;
}
//任务管理
.pricetag {
  background: url("../../assets/ic_mission.png") center center no-repeat;
}
.ivu-menu-item-active .pricetag {
  background: url("../../assets/ic_mission_select.png") center center no-repeat;
}
//积分管理
.integal {
  background: url("../../assets/ic_medal.png") center center no-repeat;
}
.ivu-menu-item-active .integal {
  background: url("../../assets/ic_medal_select.png") center center no-repeat;
}
//优惠券管理
.bookmark {
  background: url("../../assets/ic_coupon.png") center center no-repeat;
}
.ivu-menu-item-active .bookmark {
  background: url("../../assets/ic_coupon_select.png") center center no-repeat;
}
//财务管理
.podium {
  background: url("../../assets/ic_finance.png") center center no-repeat;
}
.ivu-menu-item-active .podium {
  background: url("../../assets/ic_finance_select.png") center center no-repeat;
}
//商城管理
.briefcase {
  background: url("../../assets/ic_shopping.png") center center no-repeat;
}
.ivu-menu-item-active .briefcase {
  background: url("../../assets/ic_shopping_select.png") center center no-repeat;
}
//排行榜管理
.rank {
  background: url("../../assets/rank.png") center center no-repeat;
}
.ivu-menu-item-active .rank {
  background: url("../../assets/rank_select.png") center center no-repeat;
}
//系统管理
.gear-b {
  background: url("../../assets/ic_mission.png") center center no-repeat;
}
.ivu-menu-item-active .gear-b {
  background: url("../../assets/ic_mission_select.png") center center no-repeat;
}
//固件升级
.firmware {
  background: url("../../assets/fileware.png") center center no-repeat;
}
.ivu-menu-item-active .firmware {
  background: url("../../assets/fileware_select.png") center center no-repeat;
}
</style>
