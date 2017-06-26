<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="date">{{ queryData.beginDate }} 至 {{ queryData.endDate }}</div>
      <div class="select-project">{{ queryData.department }}</div>
      <ul class="list mt0">
        <li v-if="listData.length > 0" v-for="item in listData">
          <columns :options="columnConfig" :attendance="item.shift" :jobName="item.date" :affair="item.affair"></columns>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import Columns from '../../components/columns.vue'
  export default {
    data () {
      return {
        headerBar: {
          title: '',
          leftBtn: {
            text: '返回'
          }
        },
        columnConfig: {
          avatar: {
            display: false
          }
        },
        queryData: {},
        listData: {}
      }
    },
    created () {
      this.params = this.$route.params
      this.type = this.params.type
      this.queryData = this.params.queryData
      this.switchPage()
      this.processData()
    },
    components: {
      HeaderBar,
      Columns
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          name: 'personalAttendance',
          params: this.$route.params
        })
      },
      switchPage () {
        let type = this.type
        switch (type) {
          case 'late':
            this.headerBar.title = '迟到'
            break
          case 'early':
            this.headerBar.title = '早退'
            break
          case 'missSignIn':
            this.headerBar.title = '漏签到'
            break
          case 'haveSigned':
            this.headerBar.title = '已补签'
            break
          case 'absent':
            this.headerBar.title = '旷工'
            break
          case 'leave':
            this.headerBar.title = '休假'
            break
          case 'goOut':
            this.headerBar.title = '外出'
            break
          case 'alterNate':
            this.headerBar.title = '月休'
            break
          case 'workDayOvertime':
            this.headerBar.title = '工作日加班'
            break
          case 'holidayOvertime':
            this.headerBar.title = '休息日加班'
            break
          case 'vacationOvertime':
            this.headerBar.title = '法定节假日加班'
            break
          default:
            break
        }
      },
      processData () {
        let type = this.type
        this.listData = this.params.listData[type].details.map(function (item, index, arr) {
          if (type === 'late') {
            item.shift = item.shiftName
            item.affair = '迟到' + item.duration + '分钟'
          }
          if (type === 'early') {
            item.shift = item.shiftName
            item.affair = '早退' + item.duration + '分钟'
          }
          if (type === 'missSignIn') {
            item.shift = item.shiftName
            item.affair = '漏签到' + item.duration + '分钟'
          }
          if (type === 'haveSigned') {
            item.shift = item.shiftName
            item.affair = '已补签' + item.duration + '分钟'
          }
          if (type === 'absent') {
            item.shift = item.shiftName
            item.affair = '旷工' + item.duration + '分钟'
          }
          if (type === 'leave') {
            item.shift = item.leaveType
            item.affair = '休假' + item.duration + '分钟'
          }
          if (type === 'goOut') {
            item.shift = item.goOutType
            item.affair = '外出' + item.duration + '分钟'
          }
          if (type === 'alterNate') {
            item.shift = item.shiftName
            item.affair = '月休' + item.duration + '分钟'
          }
          if (type.indexOf('Overtime') > -1) {
            item.shift = item.shiftName
            item.affair = '加班' + item.duration + '分钟'
          }
          return item
        })
      }
    }
  }
</script>