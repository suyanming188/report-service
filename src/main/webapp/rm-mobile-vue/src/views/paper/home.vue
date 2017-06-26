<template>
  <div>
    <header-bar :title="headerBar.title" :closeWindow="headerBar.closeWindow">
    </header-bar>
    <div class="content">
      <ul class="list mt0">
        <router-link tag="li" :to="{path: '/paper/department', query: {department: departmentName}}" class="list-item">
          <div class="list-item-inner">
            <div>
              <p class="f16">项目考勤日报</p>
              <p class="gray">2015-07-02 09:30:01</p>
            </div>
          </div>
        </router-link>
        <router-link tag="li" to="/paper/company" class="list-item">
          <div class="list-item-inner">
            <div>
              <p class="f16">管理中心考勤日报</p>
              <p class="gray">2015-07-02 09:30:01</p>
            </div>
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
export default {
  data () {
    return {
      headerBar: {
        closeWindow: true,
        title: '我的资源服务'
      },
      departmentName: ''
    }
  },
  mounted () {
    this.departmentName = this.$store.state.userInfo.departmentName
  },
  components: {
    HeaderBar
  }
}

</script>
