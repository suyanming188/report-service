<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <two-tabs :active="twotabs.active" :leftBtn="twotabs.leftBtn" :rightBtn="twotabs.rightBtn" @leftTabClick="leftTabClick" @rightTabClick="rightTabClick"></two-tabs>
      <div class="date flex">
        <button type="button" @click="prevAttendance">
          <i class="icon-arrow-left"></i>
        </button>
        <div>{{ queryData.beginDate }} 至 {{ queryData.endDate }}</div>
        <button type="button" @click="nextAttendance">
          <i class="icon-arrow-right"></i>
          </button>
      </div>
      <router-link tag="div" :to="{name: 'selectProject', params: queryData}" class="select-project arrow-right">{{ queryData.department }}</router-link>
      <ul class="twotabs small">
        <li class="twotabs-btn left-btn" :class="active === 'left' ? 'active' : ''" @click="checkUnusual">异常率</li>
        <li class="twotabs-btn right-btn" :class="active === 'right' ? 'active' : ''" @click="checkSign">签到率</li>
      </ul>
      <div class="chart">
        <div class="main"></div>
      </div>
      <div class="chart" v-if="unusual.length > 0">
        <div class="chart-items">
          <div class="chart-item" v-for="each in unusual">
            <div class="label f12 text-overflow">{{ each.department }}</div>
            <div class="progress"><div :style="'width: ' + each.progress + '%;'"></div></div>
            <div class="value">{{ each.rate }}</div>
          </div>
        </div>
        <div class="xAxis">
          <div class="showmore f12 green tc" @click="showMoreProject ? showMoreProject = false : showMoreProject = true">{{ showMoreProject ? '收起项目' : '查看全部项目'}}</div>
          <div class="scale">
            <span v-for="item in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]">
              {{ step * item }}
            </span>
          </div>
        </div>
      </div>
      <div class="chart" v-if="sign.length > 0">
        <div class="chart-items">
          <div class="chart-item" v-for="each in sign">
            <div class="label">{{ each.department }}</div>
            <div class="progress"><div :style="'width: ' + each.progress + '%;'"></div><span>{{ each.rate }}</span></div>
          </div></div>
        <div class="xAxis">
          <div class="showmore f12 green" @click="showMoreProject ? showMoreProject = false : showMoreProject = true">{{ showMoreDetails ? '收起项目' : '查看全部项目'}}</div>
          <div class="scale">
            <span v-for="item in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]">
              {{ step * item }}
            </span>
          </div>
        </div>
      </div>
      <ul class="list mt0">
        <router-link tag="li" :to="{name: 'unarrangedAttendance', params: {name: 'attendanceSummary', unarranged: unarranged, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">未排班</div>
          <div class="list-item-right f12 red">{{ unarranged.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'late', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">迟到</div>
          <div class="list-item-right f12 gray">{{ listData.late.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'early', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">早退</div>
          <div class="list-item-right f12 gray">{{ listData.early.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'missSignIn', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">漏签到</div>
          <div class="list-item-right f12 gray">{{ listData.missSignIn.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'haveSigned', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">补签</div>
          <div class="list-item-right f12 gray">{{ listData.haveSigned.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'absent', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">旷工</div>
          <div class="list-item-right f12 gray">{{ listData.absent.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {type: 'workDayOvertime', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">加班</div>
          <div class="list-item-right f12 gray">{{ listData.overtime.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'leave', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">休假</div>
          <div class="list-item-right f12 gray">{{ listData.leave.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {name: 'attendanceSummary', type: 'goOut', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">外出</div>
          <div class="list-item-right f12 gray">{{ listData.goOut.total }}人次</div>
        </router-link>
        <li class="more f12 green" @click="showMoreDetails ? showMoreDetails = false : showMoreDetails = true"><i :class="showMoreDetails ? 'icon-arrow-up' : 'icon-arrow-down'"></i>{{ showMoreDetails ? '收起' : '查看全部'}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import TwoTabs from '../../components/twoTabs.vue'
  import Columns from '../../components/columns.vue'
  import echarts from 'echarts'
  import * as utils from '../../utils/util'
  export default {
    data () {
      return {
        headerBar: {
          title: '考勤汇总',
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            icon: true,
            class: 'rank'
          }
        },
        twotabs: {
          active: 'left',
          leftBtn: {
            text: '团队'
          },
          rightBtn: {
            text: '我的'
          }
        },
        active: 'left',
        step: 0,
        listData: [],
        unarranged: {},
        showMoreProject: false,
        showMoreDetails: false,
        queryData: {},
        unusual: [],
        sign: []
      }
    },
    created () {
      let list = {
        late: {
          total: 2,
          details: [
            {
              employeeId: 1,
              name: '王哈桑',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobType: 1,
              jobName: '业务支持系统负责人',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 2,
              name: '王尼玛',
              department: '金域蓝湾',
              jobType: 1,
              shiftName: 'CS7中15:00-23:00',
              jobName: '场所岗',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 3,
              name: '王尼玛',
              department: '金域蓝湾',
              jobType: 2,
              shiftName: 'CS7中15:00-23:00',
              jobName: '秩序岗位',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 4,
              name: '王尼玛',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobType: 3,
              jobName: '管家',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 5,
              name: '王尼玛',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobType: 4,
              jobName: '业务支持系统负责人',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 6,
              name: '王尼玛',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobType: 5,
              jobName: '综合',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 7,
              name: '王尼玛',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobType: 5,
              jobName: '综合',
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
              employeeId: 2,
              name: '王尼玛',
              department: '金域蓝湾',
              leaveType: '调休假',
              jobName: '业务支持系统负责人',
              duration: 49,
              date: '2017-05-30'
            },
            {
              employeeId: 2,
              name: '王尼玛',
              department: '金域蓝湾',
              leaveType: '调休假',
              jobName: '业务支持系统负责人',
              duration: 8,
              date: '2017-05-20'
            }
          ]
        },
        goOut: {
          total: 0,
          details: []
        },
        overtime: {
          total: 1,
          details: [
            {
              employeeId: 2,
              name: '王尼玛',
              department: '金域蓝湾',
              shiftName: 'CS7中15:00-23:00',
              jobName: '业务支持系统负责人',
              duration: 8,
              date: '2017-05-20'
            }
          ]
        }
      }
      let unarranged = {
        total: 20,
        manager: [
          {
            employeeId: 1,
            name: '何妮浩',
            department: '四季花城',
            jobName: '业务支持系统负责人',
            date: '2017-05-05'
          },
          {
            employeeId: 1,
            name: '何妮浩',
            department: '四季花城',
            jobName: '业务支持系统负责人',
            date: '2017-05-05'
          }
        ],
        place: [
          {
            employeeId: 1,
            name: '何妮浩',
            department: '四季花城',
            jobName: '车性出入口',
            date: '2017-05-05'
          },
          {
            employeeId: 1,
            name: '何妮浩',
            department: '四季花城',
            jobName: '车性出入口',
            date: '2017-05-05'
          }
        ]
      }
      this.listData = list
      this.unarranged = unarranged
      this.unusualData = [
        {
          departmentId: 1,
          department: '松山湖',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 2,
          department: '金鱼兰苑',
          rates: [99.18, 97.99, 99.01]
        },
        {
          departmentId: 3,
          department: '金域蓝湾',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 4,
          department: '万科城',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 5,
          department: '四季花城',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 6,
          department: '万科云城',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 7,
          department: '万科麓城',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 8,
          department: '世界山水',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 9,
          department: '城市花园',
          rates: [99.18, 98.99, 99.01]
        },
        {
          departmentId: 10,
          department: '森林公园',
          rates: [99.18, 96.99, 96.01]
        },
        {
          departmentId: 11,
          department: '乌鲁木齐四季花城',
          rates: [99.18, 95.99, 95.01]
        }
      ]
      this.initChart(this.unusualData, 'unusual')
      // 初始化
      this.userInfo = this.$store.state.userInfo
      if (!this.$route.params.department) {
        this.queryData = {
          departmentId: 0,
          department: '全部项目',
          beginDate: this.getSevenDaybefore(this.getToday()),
          endDate: this.getToday()
        }
        this.search()
      } else {
        this.queryData = this.$route.params
      }
      // setTimeout(() => {
      //   this.$axios.get(this.$appConfig.api.unusualAttendance, {
      //     params: this.queryData
      //   })
      //   .then((res) => {
      //     if (res.data) {
      //       this.initChart(res.data, 'unusual')
      //     }
      //   })
      // }, 200)
    },
    components: {
      HeaderBar,
      TwoTabs,
      Columns,
      echarts
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          name: 'attendanceHome'
        })
      },
      rightBtnClick () {
        this.$router.push({
          name: 'diligentRanking'
        })
      },
      leftTabClick () {
        this.$router.push({
          name: 'attendanceSummary'
        })
      },
      rightTabClick () {
        this.$router.push({
          name: 'personalAttendance',
          params: {
            name: 'personalAttendance'
          }
        })
      },
      search () {
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.attendanceSummary, {
        //     params: this.queryData
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.listData.push({departmentId: 0, department: '全部项目'})
        //       this.listData = this.listData.concat(res.data)
        //     }
        //   })
        // }, 200)
      },
      checkUnusual () {
        this.active = 'left'
        this.initChart(this.unusualData, 'unusual')
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.unusualAttendance, {
        //     params: this.queryData
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.initChart(res.data, 'unusual')
        //     }
        //   })
        // }, 200)
      },
      checkSign () {
        this.active = 'right'
        let signData = [
          {
            departmentId: 1,
            department: '松山湖',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 2,
            department: '金鱼兰苑',
            rates: [99.18, 97.99, 99.01]
          },
          {
            departmentId: 3,
            department: '金域蓝湾',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 4,
            department: '万科城',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 5,
            department: '四季花城',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 6,
            department: '万科云城',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 7,
            department: '万科麓城',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 8,
            department: '世界山水',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 9,
            department: '城市花园',
            rates: [99.18, 98.99, 99.01]
          },
          {
            departmentId: 10,
            department: '森林公园',
            rates: [99.18, 96.99, 96.01]
          },
          {
            departmentId: 11,
            department: '乌鲁木齐四季花城',
            rates: [99.18, 95.99, 95.01]
          }
        ]
        this.initChart(signData, 'sign')
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.signAttendance, {
        //     params: this.queryData
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.initChart(res.data, 'sign')
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
      },
      initChart (data, type) {
        // let maxRate
        // let chartData = []
        // data.forEach(function (item, index, arr) {
        //   let sum = item.rates.reduce(function (prev, next) {
        //     return prev + next
        //   })
        //   let rate = (sum / item.rates.length).toFixed(2)
        //   if (index === 0) {
        //     let rateString = '' + rate
        //     let firstNum = rateString.slice(0, 1)
        //     let secondNum = rateString.split('.')[0].slice(-1, -2)
        //     maxRate = secondNum >= 5 ? (parseInt(firstNum) + 1) + '0' : firstNum + '5'
        //   }
        //   chartData.push({
        //     department: item.department,
        //     progress: (rate / maxRate).toFixed(2) * 100,
        //     rate: rate
        //   })
        // })
        // this.step = maxRate / 10
        // this[type] = chartData
        // console.log(maxRate, this.step)
      }
    },
    mounted () {
      let unusualData = [
        {
          departmentId: 1,
          department: '松山湖',
          rates: [99, 99, 99]
        },
        {
          departmentId: 2,
          department: '金鱼兰苑',
          rates: [98.8, 98.5, 98.3]
        },
        {
          departmentId: 3,
          department: '金域蓝湾',
          rates: [98, 98, 98.01]
        },
        {
          departmentId: 4,
          department: '万科城',
          rates: [97.8, 97.6, 97.5]
        },
        {
          departmentId: 5,
          department: '四季花城',
          rates: [97, 97, 97]
        },
        {
          departmentId: 6,
          department: '万科云城',
          rates: [97.18, 96.6, 96.5]
        },
        {
          departmentId: 7,
          department: '万科麓城',
          rates: [96, 96, 96]
        },
        {
          departmentId: 8,
          department: '世界山水',
          rates: [95.5, 95.8, 95.5]
        },
        {
          departmentId: 9,
          department: '城市花园',
          rates: [95, 95, 95]
        },
        {
          departmentId: 10,
          department: '森林公园',
          rates: [94.5, 94.6, 94.8]
        },
        {
          departmentId: 11,
          department: '乌鲁木齐四季花城',
          rates: [94, 94, 94]
        }
      ]
      let seriesData = []
      let yAxisData = []
      let colors = []
      unusualData.forEach(function (item, index, arr) {
        let sum = item.rates.reduce(function (prev, next) {
          return prev + next
        })
        let rate = (sum / item.rates.length).toFixed(2)
        if (index < 3) {
          colors.unshift('#4DB87F')
        } else {
          colors.unshift('#A8A8A9')
        }
        let option = {
          name: item.department,
          value: rate,
          label: {
            normal: {
              show: true,
              position: 'right',
              textStyle: {
                color: index > 2 ? '#A8A8A9' : '#4DB87F',
                fontSize: 14
              }
            }
          }
        }
        yAxisData.push(item.department)
        seriesData.push(option)
      })
      let options = {
        title: {
          text: '项目考勤排行',
          textAlign: 'center',
          left: '50%',
          bottom: '0%',
          textStyle: {
            color: '#A8A8A9',
            fontWeight: 'normal',
            fontSize: 12
          }
        },
        textStyle: {
          fontSize: 12
        },
        grid: {
          show: false,
          top: 0,
          left: 70,
          right: 40,
          bottom: 50
        },
        xAxis: {
          type: 'value',
          min: Math.floor(seriesData[seriesData.length - 1].value - 1),
          max: 100,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#A8A8A9'
            }
          },
          axisLabel: {
            interval: 0
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: yAxisData.reverse(),
          axisTick: {
            show: false,
            interval: 1
          },
          axisLine: {
            lineStyle: {
              color: '#A8A8A9'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#494949'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barMinHeight: 60,
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = colors
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            data: seriesData.reverse()
          }
        ]
      }
      let _this = this
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.querySelector('.chart .main'))
      this.myChart.on('click', function (params) {
        _this.queryData.department = params.name
        _this.$router.push({
          name: 'projectAttendance',
          params: {
            name: 'attendanceSummary',
            queryData: _this.queryData
          }
        })
      })
      this.myChart.setOption(options)
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  .select-project.arrow-right:before {
    right: rem(30px);
  }
  .chart {
    .main {
      height: 16em;
    }
  }
  .chart {
    padding: 0 rem(30px);
    .chart-item {
      & > div {
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
      .label {
        width: 7em;
        text-align: right;
      }
      .progress {
        width: 50%;
        border-left: 1px solid $border-color;
        margin-right: .5em;
        div {
          display: inline-block;
          height: 1em;
          background: $gray;
        }
        div:nth-child(1),
        div:nth-child(2),
        div:nth-child(3), {
          background: $themes-color;
        }
      }
    }
    .xAxis {
      border-top: 1px solid $border-color;
      & > div {
        display: inline-block;
      }
      .showmore {
        width: 7em;
      }
      .scale {
        width: 50%;
      }
    }
  }
  .twotabs.small {
    background: #fff;
    margin: 0;
    padding-top: rem(20px);
    padding-right: rem(20px);
    padding-bottom: rem(30px);
    font-size: 12px;
    text-align: right;
    li.twotabs-btn {
      padding: 0 1em;
    }
    .twotabs-btn.left-btn:not(.active) {
      padding-right: 1.5em;
    }
    .twotabs-btn.right-btn:not(.active) {
      padding-left: 1.5em;
    }
  }
</style>