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
          {{departmentName}}项目
        </div>
        <div class="flex text-right">
          考勤异常率：1.18%
        </div>
      </div>
      <div class="chart-priod">
        <div class="chart-btn-group">
          <div class="flex" @click="selectPriod(item, $index)" v-for="(item, $index) in priods" :class="{'priodsActive':item.active,'unactive':!item.active}">{{item.name}}</div>
        </div>
      </div>
      <div class="" id="chart"></div>
      <div class="no-schedule arrow-right">
        未排班值班经理10人/场所90人/秩序20人
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
  width: 80px;
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
      headerBar: {
        title: '项目考勤日报',
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
      priods: [{
        name: '周',
        active: true
      }, {
        name: '月'
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
    Vue.set(this.attendanceAbnormalNum[0], 'active', true)
    Vue.set(this.jobs[0], 'active', true)
  },
  mounted () {
    this.departmentName = this.$route.query.department
    let myChart = echarts.init(document.getElementById('chart'))
    myChart.setOption({
      backgroundColor: 'white',
      title: {
        text: '考勤异常趋势',
        left: 'center',
        bottom: 'bottom',
        textStyle: {
          color: 'gray',
          fontSize: '14',
          fontWeight: 'normal'
        }
      },
      grid: {
        left: '2%',
        top: '5%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['5月8号', '5月9号', '5月10号', '5月11号', '5月12号', '5月13号', '5月14号'],
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          rotate: 0,
          textStyle: {
            fontSize: 8
          }
        },
        axisLine: {
          lineStyle: {
            color: 'gray'
          }
        }
      },
      yAxis: {
        boundaryGap: false,
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
        }
      },
      series: [{
        name: '',
        type: 'line',
        smooth: true,
        data: [{
          value: 5,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 15,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 21,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 12,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 18,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 22,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }, {
          value: 17,
          symbol: 'emptyCircle',
          symbolSize: '10'
        }],
        lineStyle: {
          normal: {
            color: 'green',
            width: '1',
            shadowColor: 'green',
            shadowBlur: 10,
            shadowOffsetY: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'green',
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

