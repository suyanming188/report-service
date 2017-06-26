<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <ul class="list mt0" v-if="!networkError">
        <li v-for="each in listData" class="list-item project-item" :class="each.departmentId == selectedProject ? 'active' : ''" @click="selectProject(each)">
          {{ each.department }}
        </li>
      </ul>
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>网络错误，点击重新加载！
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  export default {
    data () {
      return {
        headerBar: {
          title: '项目选择',
          leftBtn: {
            text: '返回'
          }
        },
        listData: [],
        selectedProject: 0,
        timer: false,
        networkError: false
      }
    },
    created () {
      var de = [
        {
          departmentId: 1,
          department: '背景四级化成'
        },
        {
          departmentId: 2,
          department: '东莞南四级化成'
        },
        {
          departmentId: 3,
          department: '深圳四级化成'
        },
        {
          departmentId: 4,
          department: '深圳金域华府'
        },
        {
          departmentId: 5,
          department: '背景四级化成'
        },
        {
          departmentId: 6,
          department: '背景四级化成'
        }
      ]
      this.listData.push({departmentId: 0, department: '全部项目'})
      this.listData = this.listData.concat(de)
      // 初始化加载项目
      this.search()
      this.params = this.$route.params
      this.selectedProject = this.params.departmentId || 0
    },
    components: {
      HeaderBar
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          name: 'attendanceSummary'
        })
      },
      search () {
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.project, {
        //     params: {
        //       'employeeId': this.$store.state.userInfo.id
        //     }
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.listData.push({departmentId: 0, department: '全部项目'})
        //       this.listData = this.listData.concat(res.data)
        //     }
        //   })
        // }, 200)
      },
      selectProject (project) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.selectedProject = project.departmentId
        this.params.departmentId = project.departmentId
        this.params.department = project.department
        this.timer = setTimeout(() => {
          this.$router.push({
            name: 'attendanceSummary',
            params: this.params
          })
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  .list-item {
    cursor: pointer;
  }
</style>