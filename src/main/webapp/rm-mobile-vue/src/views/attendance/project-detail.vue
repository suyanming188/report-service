<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" :rightBtn="type === 'late' ? headerBar.rightBtn : {}" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="date">{{ queryData.beginDate === queryData.endDate ? queryData.endDate : queryData.beginDate + ' 至 ' + queryData.endDate }}</div>
      <div class="select-project">{{ queryData.department }}</div>
      <ul class="filter-list">
        <li :class="filter === 0 ? 'green' : ''" @click="filterData(0)">全部</li>
        <li :class="filter === 1 ? 'green' : ''" @click="filterData(1)">场所</li>
        <li :class="filter === 2 ? 'green' : ''" @click="filterData(2)">秩序</li>
        <li :class="filter === 3 ? 'green' : ''" @click="filterData(3)">管家</li>
        <li :class="filter === 4 ? 'green' : ''" @click="filterData(4)">业务支持</li>
        <li :class="filter === 5 ? 'green' : ''" @click="filterData(5)">综合</li>
      </ul>
      <ul class="list mt0" v-if="listData.length > 0">
        <li v-for="item in listData">
          <columns :options="columnConfig" :name="item.name" :belong="item.department" :attendance="item.shift" :jobName="item.jobName" :affair="item.affair" :state="item.date"></columns>
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
          },
          rightBtn: {
            icon: true,
            class: 'rank'
          }
        },
        columnConfig: {
          avatar: {
            display: false
          }
        },
        type: '',
        filter: 0,
        listData: [],
        queryData: {}
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
        if (this.$route.params.name) {
          this.$router.push({
            name: this.$route.params.name,
            params: this.$route.params
          })
        }
      },
      rightBtnClick () {
        this.$route.params.name = 'projectDetail'
        this.$router.push({
          name: 'lateRanking',
          params: this.$route.params
        })
      },
      filterData (filter) {
        let type = this.type
        let filterData = []
        if (filter === 0) {
          this.listData = this.params.listData[type].details
          return
        }
        this.params.listData[type].details.forEach(function (item, index, arr) {
          if (item.jobType === filter) {
            filterData.push(item)
          }
        })
        this.filter = filter
        this.listData = filterData
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
          case 'overtime':
            this.headerBar.title = '加班'
            break
          default:
            break
        }
      },
      processData () {
        let type = this.type
        let department = this.queryData.departmentId
        let beginDate = this.queryData.beginDate
        let endDate = this.queryData.endDate
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
          if (type === 'overtime') {
            item.shift = item.shiftName
            item.affair = '加班' + item.duration + '分钟'
          }
          if (department > 0) {
            item.department = ''
          }
          if (beginDate === endDate) {
            item.date = ''
          }
          return item
        })
      }
    }
  }
</script>