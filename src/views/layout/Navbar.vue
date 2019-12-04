<template>
  <section>
    <ura-brand></ura-brand>
    <nav class="navbar navbar-static-top is-dialog">
      <div class="navbar-custom-menu">
        <el-dropdown trigger="click" class="uv-user-menu" @command="handleCommand">
          <el-button class="uv-menu-btn">
            <div class="user uv-user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <span class="hidden-xs">{{name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </a>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <ura-nav-menu class="navbar-menu-nav"></ura-nav-menu>
    </nav>
  </section>
</template>

<script>
import UraBrand from '@/views/layout/Brand.vue'
import UraNavMenu from '@/views/layout/NavMenu.vue'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: false
    }
  },
  components: { UraBrand, UraNavMenu },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
  },
  methods: {
    handleCommand (command) {
      command === 'logout' && this.logout()
    },
    switchSidebarCollapse () {
      this.$store.dispatch('switchSidebarCollapse', !this.sidebarCollapse)
    },
    logout () {
      this.$store.dispatch('logOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>
