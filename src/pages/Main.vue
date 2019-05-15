<template>
  <div class="main">
    <dt-slideMenu/>
    <div class="main-header">
      <div class="main-left">
        <span>后台管理</span>
        <span>Operating The Background</span>
      </div>
      <div class="main-title">
        <span>
          <p>{{pageTitle}}</p>
        </span>
      </div>
      <div class="main-right" style="top: 10px">
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
        <Poptip trigger="click" placement="bottom-end" width="100px">
          <span class="user">{{userInfo.real_name}}</span>
          <span class="user" style="font-size: 12px;color: #899ABE;">{{userInfo.role_name}}</span>
          <div class="tips" slot="content">
            <!-- <div class="tip-item" @click="handleRouter('user-index')">用户信息</div>
            <div class="tip-item" @click="handleRouter('user-index2')">修改密码</div>-->
            <div class="tip-item" @click="handleLogout">退出登录</div>
          </div>
        </Poptip>
        
      </div>
    </div>
    <div class="main-body">
      <transition name="singlePage">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    var pagesRouter = JSON.parse(localStorage.getItem("menuInfo"));
    return {
      pageTitle: "",
      subList: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getPath();
  },
  methods: {
    handleLogout() {
      this.$post("admin/logout", {}).then(res => {
        this.$router.push({ name: "login" });
        console.log("---退出登录---");
      });
    },

    getPath() {
      if (this.$route.name == "home-index") {
        this.pageTitle = "后台首页";
      } else if (this.$route.name == "user-list") {
        this.pageTitle = "用户管理";
      } else if (this.$route.name == "authority-index") {
        this.pageTitle = "权限管理";
      } else if (this.$route.name == "integral-list") {
        this.pageTitle = "积分管理";
      } else if (this.$route.name == "coupon-list") {
        this.pageTitle = "优惠券管理";
      } else if (this.$route.name == "shop-index") {
        this.pageTitle = "商城管理";
      } else if (this.$route.name == "rank-index") {
        this.pageTitle = "排行榜管理";
      } else if (this.$route.name == "system-index") {
        this.pageTitle = "配置管理";
      } else if (this.$route.name == "message-index") {
        this.pageTitle = "资讯推送";
      } else if (this.$route.name == "firmware-index") {
        this.pageTitle = "固件升级";
      }
    }
  },
  watch: {
    $route: "getPath"
  }
};
</script>

<style lang="less">
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 1200px;
}
.main-header {
  z-index: 1;
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  height: 80px;
  padding-left: 200px;
  box-shadow: 0 2px 1px 1px hsla(0, 0%, 39%, 0.1);
  background: #171721;
  .main-icon {
    display: inline-block;
    .ivu-btn-text {
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
  .main-title {
    position: absolute;
    left: 380px;
    top: 20px;
    // transform: translate(-50%, -50%);

    span {
      color: #ff0000;
      font-size: 18px;
      display: block;

      width: auto;
      p {
        padding: 0 10px 6px;
      }
    }
    span::after {
      display: block;
      width: 100%;
      height: 8px;

      background: #ff0000;
      content: "";
      border-radius: 4px;
      opacity: 0.5;
    }
  }

  .main-left {
    position: absolute;
    top: 20px;
    left: 150px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    font-size: 14px;
    span {
      display: block;
      font-size: 12px;
    }
    span:first-child {
      font-size: 21px;
      margin-bottom: 4px;
    }
  }
  .main-right {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    font-size: 14px;
    .ivu-avatar-image{
      width:53px;
      height:58px;
      border-radius:0 !important;
    }
  }
 
  .user {
    cursor: pointer;
    display:block;
    margin-left:10px;
  }
  .tips {
    color: #333;
    text-align: center;
    .tip-item {
      padding: 5px 0px;
      cursor: pointer;

      &:hover {
        color: #f29100;
      }
    }
  }
}
.main-body {
  position: absolute;
  left: 100px;
  top: 80px;
  right: 0px;
  bottom: 0px;
  padding: 20px;
  background-color: #0a0b11;
  transition: left 0.3s;
  overflow: auto;
}
.ivu-poptip-rel{
  top:15px;
}
</style>
