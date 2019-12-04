<template>
  <section class="ura-login">
    <div class="ura-login-container">
      <div class="ura-login-header">
        <h2>固件版本管理系统</h2>
      </div>
      <el-form class="ura-login-body" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <el-form-item prop="account">
          <el-input name="account" type="text" v-model="loginForm.account" @keyup.enter.native="handleLogin" placeholder="账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            @keyup.enter.native="handleLogin" />
        </el-form-item>
      </el-form>
      <div class="ura-login-footer">
        <el-button class="btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>
.ura-login{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: #f0f2f5 url('../../assets/images/background.svg') no-repeat 50%;
  background-size: 100%;
}
.ura-login-container{
  width: 350px;
  height: 420px;
  font-size: 16px;
  font-family: 微软雅黑;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.35);
  margin-top: -120px;
  background: #fff;
  padding: 15px 20px;
  user-select: none;
}
.ura-login-header{
  text-align: center;
  padding: 30px 0;
  & img{
    vertical-align: middle;
  }
}
.ura-login-body{
  & .el-form-item{
    margin-bottom: 24px;
  }
}
.ura-login-footer{
  & .btn {
    padding: 12px 15px;
    width: 100%;
  }
  .ura-login-way {
    text-align: center;
    font-size: 12px;
    color: #7F7F7F;
    padding: 2px;
    margin-top: 25px;
    cursor: pointer;
  }
}
</style>

<script>
export default {
  name: 'login',
  data () {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: 'OnBright',
        password: '12345678'
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('loginByAccount', this.loginForm).then(response => {
            this.loading = false
            this.$router.push({path: '/'})
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

