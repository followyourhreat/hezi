<template>
  <div class="login">
    <div class="login-main" @keyup.enter="handleLogin">
      <div class="logo">智能牙刷运营平台</div>
      <Form class="loginForm" ref="form" :model="formData" :rules="rules" :label-width="0">
        <FormItem label prop="username">
          <Input v-model.trim="formData.username" placeholder="请输入用户名">
            <span slot="prepend">用户名：</span>
          </Input>
        </FormItem>
        <FormItem label prop="password" v-if="!eye">
          <Input
            v-model.trim="formData.password"
            placeholder="请输入密码"
            type="password"
            :maxlength="18"
          >
            <span slot="prepend">密码：</span>
            <span slot="append">
              <Icon type="eye-disabled" @click.native="handleEye"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem label prop="password" v-if="eye">
          <Input v-model.trim="formData.password" placeholder="请输入密码" :maxlength="18">
            <span slot="prepend">密码：</span>
            <span slot="append">
              <Icon type="eye" @click.native="handleEye"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem label prop="remember">
          <div class="remember">
            <Checkbox v-model="remember">记住密码</Checkbox>
            <div style="cursor: pointer" @click="handleRouter('forget')">忘记密码</div>
          </div>
        </FormItem>
        <FormItem label>
          <Button type="primary" long @click="handleLogin">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eye: false,
      remember: true,
      formData: {
        username: "",
        password: ""
      },
      rules: {}
    };
  },
  mounted() {
    this.remember = localStorage.getItem("remember") == "true" ? true : false;
    if (this.remember) {
      this.formData.username = localStorage.getItem("username");
      this.formData.password = localStorage.getItem("password");
    }
  },
  methods: {
    handleEye() {
      this.eye = !this.eye;
    },
    handleLogin() {
      //缓存
      localStorage.setItem("remember", this.remember ? "true" : "false");
      localStorage.setItem("username", this.formData.username);
      localStorage.setItem("password", this.formData.password);
      this.$post("admin/login", this.formData).then(res => {
        this.$store.dispatch("setUserInfoAction", res.data);
        this.$post("menu/usermenu", {}).then(res2 => {
          //注释该段代码  权限菜单ok
          // res2.data.forEach(item => {
          //   if (item.child) {
          //     var checked = item.child.some(item2 => {
          //       return item2.checked;
          //     });
          //     item.checked = checked ? 1 : 0;
          //   }
          // });
          this.$store.dispatch("setMenuInfoAction", res2.data);
          localStorage.setItem("menuName", "home-index");
          this.$router.push({ name: "home-index" });
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  min-width: 1200px;
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: url("../../assets/bg.png") center center no-repeat;
  background-size: cover;
  .login-main {
    background-color: #171721;
    position: absolute;
    width: 400px;
    height: 480px;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -220px;
    .logo {
      width: 260px;
      font-size: 30px;
      height: 55px;
      margin: 58px auto 48px;
    }
    .loginForm {
      margin: 20px 30px;
    }
    .remember {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
