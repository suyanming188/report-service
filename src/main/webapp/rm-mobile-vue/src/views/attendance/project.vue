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
      <div class="chart">
        <ul class="twotabs small">
          <li class="twotabs-btn left-btn" :class="active === 'left' ? 'active' : ''" @click="checkUnusual">异常率</li>
          <li class="twotabs-btn right-btn" :class="active === 'right' ? 'active' : ''" @click="checkSign">签到率</li>
        </ul>
        <div class="main"></div>
      </div>
      <ul class="list mt0">
        <router-link tag="li" :to="{name: 'unarrangedAttendance', params: {name: 'projectAttendance', unarranged: unarranged, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">未排班</div>
          <div class="list-item-right f12 red">{{ unarranged.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'late', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">迟到</div>
          <div class="list-item-right f12 gray">{{ listData.late.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'early', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">早退</div>
          <div class="list-item-right f12 gray">{{ listData.early.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'missSignIn', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">漏签到</div>
          <div class="list-item-right f12 gray">{{ listData.missSignIn.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'haveSigned', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">补签</div>
          <div class="list-item-right f12 gray">{{ listData.haveSigned.total }}人次</div>
        </router-link>
        <router-link tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'absent', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">旷工</div>
          <div class="list-item-right f12 gray">{{ listData.absent.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'workDayOvertime', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">加班</div>
          <div class="list-item-right f12 gray">{{ listData.overtime.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'leave', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f14">休假</div>
          <div class="list-item-right f12 gray">{{ listData.leave.total }}人次</div>
        </router-link>
        <router-link v-if="showMoreDetails" tag="li" :to="{name: 'projectDetail', params: {name: 'projectAttendance', type: 'goOut', listData: listData, queryData: queryData}}" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
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
        listData: [],
        unarranged: {},
        showMoreProject: false,
        showMoreDetails: false,
        queryData: {}
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
      // 初始化
      this.userInfo = this.$store.state.userInfo
      this.queryData = this.$route.params.queryData
    },
    components: {
      HeaderBar,
      TwoTabs,
      Columns,
      echarts
    },
    methods: {
      leftBtnClick () {
        if (this.$route.params.name) {
          this.$router.push({
            name: this.$route.params.name
          })
        }
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
        let unusualData = [
          {
            departmentId: 1,
            department: '松山湖',
            rates: [93.45, 99.18, 98.99, 99.01, 91.5, 97.68, 92.34]
          }
        ]
        this.initChart(unusualData, 'unusual')
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
            rates: [90.45, 94.18, 92.99, 97.01, 93.5, 95.68, 99.34]
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
      createIntervalDays (begin, num) {
        let array = []
        let current = new Date(begin).getTime()
        for (let i = 0; i < num; i++) {
          array[i] = utils.fmtDate(new Date(current), 'M月d日')
          current += 24 * 60 * 60 * 1000
        }
        return array
      },
      initChart (data, type) {
        this.myChart = null
        let beginDate = this.queryData.beginDate || this.getSevenDaybefore(this.getToday())
        let xAxisData = {}
        let yAxis = []
        let seriesData = []
        yAxis.min = data[0].rates.reduce(function (prev, next) {
          return Math.min(prev, next)
        })
        yAxis.max = data[0].rates.reduce(function (prev, next) {
          return Math.max(prev, next)
        })
        yAxis.min = Math.floor(yAxis.min)
        yAxis.max = Math.ceil(yAxis.max)
        seriesData = data[0].rates
        xAxisData = this.createIntervalDays(beginDate, 7)
        let options = {
          title: {
            text: '项目考勤趋势',
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
            top: 10,
            left: 35,
            right: 10,
            bottom: 50
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: [0, '100%'],
            nameLocation: 'start',
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
              interval: 0,
              textStyle: {
                color: '#494949'
              }
            }
          },
          yAxis: {
            type: 'value',
            min: yAxis.min,
            max: yAxis.max,
            splitNumber: 10,
            nameGap: 5,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#A8A8A9'
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [{
            type: 'line',
            smooth: true,
            symbolSize: 8,
            label: {
              normal: {
                show: true,
                formatter: '{c}%'
              }
            },
            itemStyle: {
              normal: {
                color: '#4DB87F'
              }
              // emphasis: {
              //   color: '#4DB87F'
              // }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(77, 184, 127, .2)'
                }, {
                  offset: 0.7,
                  color: 'transparent'
                }])
              }
            },
            data: seriesData
          }]
        }
        if (type === 'unusual') {
          options.visualMap = null
          options.series[0].markLine = null
          options.series[0].areaStyle = {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(77, 184, 127, .2)'
              }, {
                offset: 0.7,
                color: 'transparent'
              }])
            }
          }
        }
        if (type === 'sign') {
          options.visualMap = {
            show: false,
            pieces: [{
              gt: 95,
              lte: 100,
              color: '#4DB87F'
            }],
            outOfRange: {
              color: '#E65045'
            }
          }
          options.series[0].markLine = {
            symbol: 'none',
            label: {
              normal: {
                show: false
              }
            },
            data: [{
              yAxis: 95
            }],
            lineStyle: {
              normal: {
                color: '#E65045',
                type: 'dashed'
              }
            }
          }
          options.series[0].areaStyle = null
        }
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.querySelector('.chart .main'))
        this.myChart.setOption(options)
      }
    },
    mounted () {
      let unusualData = [
        {
          departmentId: 1,
          department: '松山湖',
          rates: [93.45, 99.18, 98.99, 99.01, 91.5, 97.68, 92.34]
        }
      ]
      this.initChart(unusualData, 'unusual')
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
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  .select-project.arrow-right:before {
    right: rem(30px);
  }
  .main {
    height: 15em;
  }
  .twotabs.small {
    margin-top: 0;
    padding-top: rem(20px);
    padding-right: rem(20px);
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