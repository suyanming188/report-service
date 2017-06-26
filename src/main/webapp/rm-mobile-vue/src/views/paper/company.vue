<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="back()">
    </header-bar>
    <div class="content">
      <div class="title-datetime">
        <div class="left-triangle-arrow">
          <icon name="caret-left" class="color-gray"></icon>
        </div>
        <div class="lastday" @click="setLastDay">
          前一天
        </div>
        <div class="datetime">
          <datetime v-model="datetime" :title="('Birthday')" :show="showDatetime" format="YYYY-MM-DD" class="text-center" confirm-text="确定" cancel-text="取消">
            {{datetime}}
          </datetime>
        </div>
        <div class="nextday" @click="setNextDay">
          后一天
        </div>
        <div class="right-triangle-arrow">
          <icon name="caret-right" class="color-gray"></icon>
        </div>
      </div>
      <div class="title-department">
        <div class="flex">
          {{companyName}}
        </div>
        <div class="flex right">
          考勤异常率：1.18%
        </div>
      </div>
      <div class="chart-priod">
        <div class="flex f12">点击柱状图可查看该项目详情</div>
        <div class="chart-btn-group">
          <div class="flex" @click="selectPriod(item, $index)" v-for="(item, $index) in priods" :class="{'priodsActive':item.active,'unactive':!item.active}">{{item.name}}</div>
        </div>
      </div>
      <div class="" id="chart"></div>
      <div class="no-schedule arrow-right">
        <router-link tag="div" :to="{name: 'unarrangedAttendance',params:{name: 'paperCompany',unarranged: unarranged}}">未排班值班经理10人/场所90人/秩序20人</router-link>
      </div>
      <div class="row-item attendance-abnormal">
        <div class="flex" v-for="(item,$index) in attendanceAbnormalNum" :class="{'active':item.active,'unactive':!item.active}" @click="selectStyle (item, $index) ">
          {{item.number}} <br> {{item.type}}
        </div>
      </div>
      <div class="row-item job">
        <div class="flex" @click="selectJob (item, $index)" v-for="(item, $index) in jobs" :class="{'jobActive':item.active,'unactive':!item.active}">{{item.name}}</div>
      </div>
      <div class="list-person">
        <div class="list-item">
          <div class="flex">夏校园</div>
          <div class="flex2">CS715:00-23:00</div>
          <div class="flex">迟到15分钟</div>
        </div>
        <div class="list-item">
          <div class="flex">夏校园</div>
          <div class="flex2">CS715:00-23:00</div>
          <div class="flex">迟到15分钟</div>
        </div>
      </div>
      <div class="show-more">
        <div class="icon"><icon name="caret-down" class="color-gray"></icon></div> 显示更多
      </div>
    </div>
  </div>
</template>
<style scoped>
.chart-priod{
  padding: 10px 15px;
  background: white;
  display: flex;
  justify-content: flex-end;
}
.chart-btn-group{
  width: 100px;
  display: flex;
  border: 1px solid green;
  border-radius: 15px;
  color: green;
}
.chart-btn-group div{
  display: flex;
  justify-content: center;
  align-item: center;
}
.chart-btn-group div.priodsActive{
  background: green;
  color: white;
  border-radius: 15px;
}
.show-more{
  background: white;
  padding: 5px;
  color: green;
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-item: center;
}
.show-more .icon{
  display: flex;
  padding-right: 10px;
  justify-content: center;
  align-item: center;
}
.echarts {
  height: 300px;
}
.title-datetime,.title-department,.no-schedule,.row-item{
  display: flex;
  /*padding: 0.3rem 0.3rem;*/
  background-color: white;
}
.title-department .right{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.row-item{
  padding: 10px 15px;
  text-align: center;
  border-bottom: 1px solid lightgray;
}
.attendance-abnormal{
  padding: 0 30px;
}
.list-person{
  padding-left: 15px;
  background: white;
}
.list-person .list-item:last-child{
  border-bottom: none;
}
.list-item{
  padding: 10px 15px 10px 0;
  border-bottom: 1px solid lightgray;
  display: flex;
}
.attendance-abnormal .flex{
  padding-top: 10px;
  padding-bottom: 10px;
}
.job{
  padding: 15px 15px;
}
.job div{
  border-right: 1px solid lightgray;
}
.job div:last-child{
  border-right: none;
}
/*.job .flex::after,.job .flex2::after{
  content: '|';
  position: relative;
  left: 5px;
}
.job .flex:last-child::after{
  display: none;
}*/
.job .flex,.job .flex2{
  white-space: nowrap;
  padding: 0 5px;
  line-height: 0.8;
}
.flex2{
  flex: 2;
}
.active{
  color: green;
  border-bottom: 1px solid green;
}
.jobActive{
  color: green;
}
.no-schedule{
  padding: 10px 15px;
  border-bottom: 1px solid lightgray;
  color: red;
}
.no-schedule::before{
  right: 15px;
}
.title-department{
  padding: 10px 15px;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}
.flex{
  flex: 1
}
.text-right{
  text-align: right;
}
.left-triangle-arrow{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lastday{
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.datetime{
  flex: 4;
  text-align: center;
  color: limegreen;
}
.text-center{
  text-align: center;
  display: inline-block;
}
.nextday{
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.right-triangle-arrow{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
#chart{
  height: 300px;
}
</style>
<script>
import HeaderBar from '../../components/header.vue'
import { Datetime, Group, XButton } from 'vux'
import 'vue-awesome/icons'
import * as util from '../../utils/util'
import Vue from 'vue'
import echarts from 'echarts'

export default {
  data () {
    return {
      cache: {},
      headerBar: {
        title: '管理中心考勤日报',
        leftBtn: {
          text: '返回'
        }
      },
      prevPage: null,
      datetime: '2015-11-12',
      startDate: '2015-11-12',
      endDate: '2017-11-12',
      showDatetime: true,
      departmentName: '',
      unarranged: {
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
      },
      priods: [{
        name: '人次',
        active: true
      }, {
        name: '比例'
      }],
      attendanceAbnormalNum: [{
        type: '迟到早退',
        number: '3'
      }, {
        type: '漏签到',
        number: '5'
      }, {
        type: '补签',
        number: '4'
      }],
      jobs: [{
        name: '全部'
      }, {
        name: '场所'
      }, {
        name: '秩序'
      }, {
        name: '管家'
      }, {
        name: '业务支持'
      }, {
        name: '综合'
      }]
    }
  },
  components: {
    HeaderBar,
    Datetime,
    Group,
    XButton
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevPage = from.fullPath
    })
  },
  created () {
    this.companyName = this.$store.state.userInfo.companyName
    Vue.set(this.attendanceAbnormalNum[0], 'active', true)
    Vue.set(this.jobs[0], 'active', true)
  },
  mounted () {
    let _this = this
    let myChart = echarts.init(document.getElementById('chart'))
    myChart.on('click', function (params) {
      _this.$router.push({
        path: 'department',
        query: {
          department: params.name
        }
      })
    })
    myChart.setOption({
      backgroundColor: 'white',
      title: {
        text: '项目考勤异常排行（人次即异常总人次）',
        left: 'center',
        bottom: 'bottom',
        textStyle: {
          color: 'gray',
          fontSize: '12',
          fontWeight: 'normal'
        }
      },
      tooltip: {},
      grid: {
        left: '2%',
        top: '0%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: false,
        splitNumber: 5,
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: (value, index) => {
            if (index === 4) {
              return value + '（人次）'
            } else {
              return value
            }
          },
          textStyle: {
            fontSize: 8
          }
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'gray'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: ['金域蓝湾', '深圳璞悦山', '深圳金色家园2', '深圳万科城', '城市花园', '森林公园', '东莞松山湖'],
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'gray'
          }
        },
        axisLabel: {
          textStyle: {
            fontSize: 8
          },
          formatter: function (value, index) {
            return value.length > 6 ? (value.substring(0, 6) + '...') : value
          }
        }
      },
      series: [{
        name: '',
        type: 'bar',
        barCategoryGap: '35%',
        data: [{
          value: 5,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }, {
          value: 15,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }, {
          value: 21,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }, {
          value: 23,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }, {
          value: 28,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          itemStyle: {
            normal: {
              color: 'green'
            }
          }
        }, {
          value: 32,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          itemStyle: {
            normal: {
              color: 'green'
            }
          }
        }, {
          value: 37,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          itemStyle: {
            normal: {
              color: 'green'
            }
          }
        }],
        itemStyle: {
          normal: {
            color: 'gray',
            borderWidth: '2'
          }
        },
        markPoint: {
          itemStyle: {
            normal: {
              color: 'green',
              borderColor: 'green'
            }
          }
        }
      }]
    })
  },
  methods: {
    back () {
      this.$router.push({
        path: this.prevPage
      })
    },
    setLastDay () {
      let date = new Date(this.datetime)
      this.datetime = util.fmtDate(date.setDate(date.getDate() - 1), 'yyyy-MM-dd')
    },
    setNextDay () {
      let date = new Date(this.datetime)
      this.datetime = util.fmtDate(date.setDate(date.getDate() + 1), 'yyyy-MM-dd')
    },
    selectStyle (item, index) {
      this.$nextTick(function () {
        this.attendanceAbnormalNum.forEach(function (item) {
          Vue.set(item, 'active', false)
        })
        Vue.set(item, 'active', true)
      })
    },
    selectJob (item, index) {
      this.$nextTick(function () {
        this.jobs.forEach(function (item) {
          Vue.set(item, 'active', false)
        })
        Vue.set(item, 'active', true)
      })
    },
    selectPriod (item, index) {
      this.$nextTick(function () {
        this.priods.forEach(function (item) {
          Vue.set(item, 'active', false)
        })
        Vue.set(item, 'active', true)
      })
    },
    jobFilter (type) {
      if (type) {
        console.log('1')
      }
    }
  }
}

</script>


