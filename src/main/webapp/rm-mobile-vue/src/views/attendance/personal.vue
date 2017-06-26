<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick" :closeWindow="closeWindow"></header-bar>
    <div class="content">
      <div class="date flex">
        <button type="button" @click="prevAttendance">
          <i class="icon-arrow-left"></i>
        </button>
        <div>{{ queryData.beginDate }} 至 {{ queryData.endDate }}</div>
        <button type="button" @click="nextAttendance">
          <i class="icon-arrow-right"></i>
          </button>
      </div>
      <div class="select-project">{{ queryData.department }}</div>
      <ul class="list mt0">
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'late', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">迟到</div>
          <div class="list-item-right f12 gray">{{ listData.late.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'early', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">早退</div>
          <div class="list-item-right f12 gray">{{ listData.early.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'missSignIn', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">漏签到</div>
          <div class="list-item-right f12 gray">{{ listData.missSignIn.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'haveSigned', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">已补签</div>
          <div class="list-item-right f12 gray">{{ listData.haveSigned.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'absent', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">旷工</div>
          <div class="list-item-right f12 gray">{{ listData.absent.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'leave', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">休假</div>
          <div class="list-item-right f12 gray">{{ listData.leave.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'goOut', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">外出</div>
          <div class="list-item-right f12 gray">{{ listData.goOut.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'alterNate', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">月休</div>
          <div class="list-item-right f12 gray">{{ listData.alterNate.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'workDayOvertime', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">工作日加班</div>
          <div class="list-item-right f12 gray">{{ listData.workDayOvertime.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'holidayOvertime', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">休息日加班</div>
          <div class="list-item-right f12 gray">{{ listData.holidayOvertime.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'personalDetail', params: {type: 'vacationOvertime', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">法定节假日加班</div>
          <div class="list-item-right f12 gray">{{ listData.vacationOvertime.total }}人次</div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import * as utils from '../../utils/util'
  export default {
    data () {
      return {
        headerBar: {
          title: '考勤汇总',
          leftBtn: {
            text: ''
          },
          rightBtn: {
            icon: true,
            class: 'rank'
          }
        },
        listData: [],
        queryData: {},
        closeWindow: false
      }
    },
    created () {
      let list = {
        late: {
          total: 2,
          details: [
            {
              shiftName: 'CS7中15:00-23:00',
              duration: 49,
              date: '2017-05-30'
            },
            {
              shiftName: 'CS7中15:00-23:00',
              duration: 49,
              date: '2017-05-30'
            }
          ]
        },
        early: {
          total: 0,
          details: []
        },
        missSignIn: {
          total: 0,
          details: []
        },
        haveSigned: {
          total: 0,
          details: []
        },
        absent: {
          total: 0,
          details: []
        },
        leave: {
          total: 1,
          details: [
            {
              leaveType: '调休假',
              duration: 49,
              date: '2017-05-30'
            }
          ]
        },
        goOut: {
          total: 0,
          details: []
        },
        alterNate: {
          total: 1,
          details: [
            {
              shiftName: 'CS7中15:00-23:00',
              duration: 49,
              date: '2017-05-30'
            }
          ]
        },
        workDayOvertime: {
          total: 1,
          details: [
            {
              shiftName: 'CS7中15:00-23:00',
              duration: 213,
              date: '2017-05-30'
            }
          ]
        },
        holidayOvertime: {
          total: 0,
          details: []
        },
        vacationOvertime: {
          total: 1,
          details: [
            {
              shiftName: 'CS7中15:00-23:00',
              duration: 22,
              date: '2017-05-30'
            }
          ]
        }
      }
      this.listData = list
      // 初始化
      this.userInfo = this.$store.state.userInfo
      if (!this.$route.params.type) {
        this.queryData = {
          employeeId: this.userInfo.id,
          department: this.userInfo.department,
          beginDate: this.getSevenDaybefore(this.getToday()),
          endDate: this.getToday()
        }
        this.search()
      } else {
        this.queryData = this.$route.params.queryData
        this.listData = this.$route.params.listData
      }
      if (!this.$route.params.name) {
        this.closeWindow = true
      } else {
        this.headerBar.leftBtn.text = '返回'
      }
    },
    components: {
      HeaderBar
    },
    methods: {
      leftBtnClick () {
        if (this.$route.params.name) {
          this.$router.push({
            name: 'attendanceSummary'
          })
        }
      },
      rightBtnClick () {
        this.$router.push({
          name: 'lateRanking',
          params: {
            name: 'personalAttendance'
          }
        })
      },
      search () {
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.personalAttendance, {
        //     params: this.queryData
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.listData = res.data
        //     }
        //   })
        // }, 200)
      },
      prevAttendance () {
        this.queryData.endDate = this.queryData.beginDate
        this.queryData.beginDate = this.getSevenDaybefore(this.queryData.endDate)
        this.search()
      },
      nextAttendance () {
        this.queryData.beginDate = this.queryData.endDate
        this.queryData.endDate = this.getSevenDayAfter(this.queryData.beginDate)
        this.search()
      },
      getToday () {
        return utils.fmtDate(new Date(), 'yyyy-MM-dd')
      },
      getSevenDaybefore (date) {
        let end = new Date(date).getTime()
        let begin = end - 7 * 24 * 60 * 60 * 1000
        return utils.fmtDate(new Date(begin), 'yyyy-MM-dd')
      },
      getSevenDayAfter (date) {
        let begin = new Date(date).getTime()
        let end = begin + 7 * 24 * 60 * 60 * 1000
        return utils.fmtDate(new Date(end), 'yyyy-MM-dd')
      }
    }
  }
</script>