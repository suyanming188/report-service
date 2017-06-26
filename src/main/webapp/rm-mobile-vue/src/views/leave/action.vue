<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick" @rightBtnClick="saveLocal"></header-bar>
    <div class="page-loading" v-show="!pageLoading">
          <span class="m-loading">
          </span>
    </div>
    <div class="content" v-show="pageLoading">
      <ul class="list">
        <li class="list-item list-item-touch-active" v-if="!listData.allWorkingHourAndW">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              调休假
            </div>
            <div class="list-item-right gray">
              <div>剩余 <span class="red">{{ listData.adjustable }}小时</span></div>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              法定年休假
            </div>
            <div class="list-item-right gray">
              剩余 <span class="red">{{ listData.statutoryAnnual }}天</span>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              额外带薪年休假
            </div>
            <div class="list-item-right gray">
              剩余 <span class="red">{{ listData.payAnnual }}天</span>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openDatetimes()">
            <div class="list-item-left">
              日期<span class="red">*</span>
            </div>
            <div class="list-item-right gray">
              <span>{{listData.beginDate}}—{{listData.endDate}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="bg-white inner-padding mb15 px-tb" v-for="(item, outterIndex) in listData.holidayInfo">
        <div class="box-justify" @click="item.isopen = !item.isopen">
          <span class="color-primary">{{ item.date }}</span>
          <span class="icon-angle-top mr5"></span>
        </div>
        <!-- 月休-->
        <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1"
             v-if="item.hasAlternateHoliday == 1 && item.isopen">
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right gray">
                月休
              </div>
            </div>
          </div>
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                无需请假
              </div>
            </div>
          </div>
          <div class="red f12 pa" v-if="item.shiftData.length"><i class="iconfont">&#xe606;</i>已安排
            <span v-for="(shift, innerIndex) in item.shiftData">{{shift.onDutyTime | cutMinute}}-{{shift.offDutyTime | cutMinute}} &nbsp;&nbsp;</span>加班,请联系项目人事修改排班
          </div>
        </div>
        <!-- 做2休1-->
        <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1"
             v-if="item.hasWorkTwoOrOneRestOne == 1 && item.isopen">
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right gray">
                做2休1/做1休1
              </div>
            </div>
          </div>
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                无需请假
              </div>
            </div>
          </div>
          <div class="red f12 pa" v-if="item.shiftData.length"><i class="iconfont">&#xe606;</i>已安排
            <span v-for="(shift, innerIndex) in item.shiftData">{{shift.onDutyTime | cutMinute}}-{{shift.offDutyTime | cutMinute}} &nbsp;&nbsp;</span>加班,请联系项目人事修改排班
          </div>
        </div>
        <div v-if="item.hasAlternateHoliday != 1 && item.hasWorkTwoOrOneRestOne != 1 && item.isopen"
             v-for="(shift, innerIndex) in item.shiftData">
          <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1">
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openPosts(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  岗位<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{ shift.postShortName }}
                  <i class="icon-angle-right" v-if="!shift.hasShift && innerIndex == 0 && !shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openShifts(outterIndex, innerIndex, shift, item.date)">
                <div class="list-item-left">
                  班次<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  <span v-if="shift.shift">{{shift.shift}} {{shift.onDutyTime | cutMinute}}-{{shift.offDutyTime | cutMinute}}</span>
                  <span v-if="shift.leaveTimes == '整班次休假' && shift.diningStartDatetime && shift.diningEndDatetime">(休{{shift.diningStartDatetime | cutMinute}}-{{shift.diningEndDatetime | cutMinute}})</span>
                  <i class="icon-angle-right" v-if="!shift.hasShift && innerIndex == 0 && !shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openLeaveType(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  休假类型<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{ shift.vacationType }}<i class="icon-angle-right" v-show="!shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openLeaveTimes(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  休假方式<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{shift.leaveTimes}}<i class="icon-angle-right" v-show="!shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openDatetime(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  时间<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  <span v-if="shift.beginTime">{{shift.beginTime | cutMinute}}-{{shift.endTime | cutMinute}}</span>
                  <i class="icon-angle-right" v-if="(shift.leaveTimes == '自定义时间') && !shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="flexbox bottom-btn">
            <div class="flex pr5">
              <div class="ev-btn ev-btn-small"
                   :class="{'btn-success': canAddShiftLeave(outterIndex, innerIndex, shift)}"
                   @click="addShiftLeave(outterIndex, innerIndex, shift)">添加本班次休假
            </div>
            </div>
            <div class="flex pl5">
              <div class="ev-btn ev-btn--warn ev-btn-small" @click="delShiftLeave(outterIndex, innerIndex)">
              删除
            </div>
          </div>
        </div>
        </div>
      </div>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="modelData.state = true">
            <div class="list-item-left">
              休假说明<span class="red">*</span>
            </div>
            <div class="list-item-right text-overflow w60 gray">
              {{listData.vacationExplain}}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <transition name="fadeUp">
      <div class="picker-model" v-if="pickerState">
        <picker :slots="Slots" @change="onValuesChange" :showToolbar="true" rotate-effect :visible-item-count="5"
                ref="picker">
          <!-- Toolbar items -->
          <div class="picker-bar">
            <button class="fl button" @click="pickerState = !pickerState">取消</button>
            <button class="fr button" @click="ok()">确定</button>
          </div>
        </picker>
      </div>
    </transition>
    <transition name="model-fade">
      <div class="ev-model" v-show="modelData.state">
        <div class="ev-mask"></div>
        <div class="ev-model-box">
          <div class="ev-model-content ">
            <textarea v-model="vacationExplain" class="model-textarea" name="" id="" placeholder="请输入休假理由:"></textarea>
          </div>
          <div class="ev-model-btn flexbox ev__jc">
            <div class="flex model-btn-cancel" @click="modelData.state = false">取消</div>
            <div class="flex model-btn-ok color-primary" @click="save()">保存</div>
          </div>
        </div>
      </div>
    </transition>
    <datetime :show="datatimeShow" @pickerdate="getDatetime"></datetime>
  </div>
</template>
<script>
import Picker from 'mint-picker'
import Datetime from '../../components/datetime'
import HeaderBar from '../../components/header.vue'
import * as utils from '../../utils/util'
// 休假类型数组 法定年休假、额外带薪年休假、调休假、春节调休假、结转年休假、事假、普通病假或医疗期外、法定病假医疗期、法定工伤医疗期、其他带薪假
const leaveType = [{
  flex: 1,
  values: ['调休假', '法定年休假', '额外带薪年休假', '结转年休假', '事假', '普通病假或医疗期外'],
  defaultIndex: 0,
  textAlign: 'center'
}]
// 拼凑班次数组
const leaveTimes = [{
  flex: 1,
  values: ['整班次休假', '前半班次休假', '后半班次休假', '自定义时间'],
  defaultIndex: 0,
  textAlign: 'center'
}]
// 时间picker，24小时制
const hoursArray = []
for (let i = 0; i < 24; i++) {
  let str = null
  str = i < 10 ? '0' + i : ('' + i)
  hoursArray.push(str)
}
const datetime = [
  {
    flex: 1,
    values: hoursArray,
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['00', '30'],
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['-'],
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: hoursArray,
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['00', '30'],
    defaultIndex: 0,
    textAlign: 'center'
  }
]
export default {
  data () {
    return {
      pageLoading: false,
      listData: {
      },
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: '保存'
        },
        title: '我要休假'
      },
      shifts: {
        flex: 1,
        values: [],
        defaultIndex: 0,
        textAlign: 'center'
      },
      posts: {
        flex: 1,
        values: [],
        defaultIndex: 0,
        textAlign: 'center'
      },
      innerIndex: 0, // 内层索引值
      outterIndex: 0, // 外层索引
      datatimeShow: false,
      pickerState: false,
      pickerType: null, // picker类型
      pickerValue: null, // picker值
      Slots: [],
      leaveDate: {
        beginDate: '',
        endDate: ''
      },
      modelData: {
        state: false
      },
      vacationExplain: ''
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    // let cacheData = this.$store.state.leave.cache
    if (this.$route.query.back) {
      // this.$appConfig.sortBy(cacheData.holidayInfo, 'date', true)
      this.listData = this.$store.state.leave.cache
      this.$store.dispatch('UPDATE_CACHE', null)
      this.pageLoading = true
      this.adjustable = this.listData.adjustable || 0
      this.statutoryAnnual = this.listData.statutoryAnnual || 0
      this.payAnnual = this.listData.payAnnual || 0
      this.carryOver = this.listData.carryOver || 0
      this.notFullShiftBalance = this.listData.notFullShiftBalance || 0
    } else {
      // 请求默认日期
      this.$axios.get(this.$appConfig.api.defaultDate, {
        params: {
          loginMobile: this.userInfo.mobile
        }
      }).then(response => {
        this.leaveDate.beginDate = this.$appConfig.fmtDate(new Date(response.defaultDate), 'yyyy/MM/dd')
        this.leaveDate.endDate = this.$appConfig.fmtDate(new Date(response.defaultDate), 'yyyy/MM/dd')
        this.getVacationDetails()
      })
    }
    // 请求班次组数据
    this.$axios.get(this.$appConfig.api.postsGroup, {params: {
      loginMobile: this.userInfo.mobile
    }}).then(response => {
      this.postGroup = response.posts || []
      if (!this.postGroup.length) {
        this.$toast('请设置该项目下的岗位规则')
      }
      this.postGroup.forEach(v => {
        this.posts.values.push(v.postShortName)
      })
    })
  },
  components: {
    Picker,
    Datetime,
    HeaderBar
  },
  methods: {
    leftBtnClick () {
      if (this.datatimeShow) {
        this.datatimeShow = false
        this.headerBar.rightBtn.text = '保存'
        this.headerBar.title = '我要休假'
      } else if (this.$route.query.step) {
        this.$router.push({
          path: 'action-list-check'
        })
      } else {
        this.$store.dispatch('UPDATE_CACHE', null)
        this.$router.push({
          path: '/leave/'
        })
      }
    },
    // 获取完整班次时长
    getShiftHours (shift) {
      let result = 0
      for (let i = 0, len = this.shiftsGroup.length; i < len; i++) {
        if (this.shiftsGroup[i].label === shift) {
          result = getTimeDiff(this.shiftsGroup[i].onDutyTime, this.shiftsGroup[i].offDutyTime) - this.shiftsGroup[i].diningDuration
          break
        }
      }
      return result
    },
    dealHolidayInfo (data) {
      let beginDate = new Date(this.leaveDate.beginDate)
      let endDate = new Date(this.leaveDate.endDate)
      let oneDay = 24 * 60 * 60 * 1000
      let len = (endDate - beginDate) / oneDay
      let obj
      let date
      data.holidayInfo = data.holidayInfo || []
      let tempArr = []
      let hasFind
      for (let i = 0; i <= len; i++) {
        date = this.$appConfig.fmtDate(new Date(+new Date(beginDate) + i * oneDay), 'yyyy/MM/dd')
        obj = {
          date: date,
          isopen: true,
          shiftData: [{
            shift: '',
            postShortName: '',
            postId: '',
            hasShift: false,
            disableFirstShift: false,
            leaveTimes: '',
            onDutyTime: '',
            offDutyTime: '',
            vacationType: '',
            beginTime: '',
            endTime: ''
          }]
        }
        if (data.holidayInfo.length) {
          hasFind = false
          data.holidayInfo.map((outv, outIndex) => {
            outv.date = outv.date.replace(/-/g, '/')
            if (outv.date === date) {
              hasFind = true
              outv.isopen = true
              outv.shiftData = outv.shiftData || [{
                shift: '',
                postShortName: '',
                postId: '',
                hasShift: false,
                disableFirstShift: false,
                leaveTimes: '',
                onDutyTime: '',
                offDutyTime: '',
                vacationType: '',
                beginTime: '',
                endTime: ''
              }]
              outv.shiftData.map((inv, index) => {
                inv.hasShift = inv.shift !== ''
                inv.disableFirstShift = false
                inv.leaveTimes = ''
                inv.vacationType = ''
              })
              tempArr.push(JSON.parse(JSON.stringify(outv)))
            }
          })
          if (!hasFind) {
            tempArr.push(obj)
          }
        } else {
          obj.date = date
          tempArr.push(obj)
        }
      }
      data.holidayInfo = tempArr
    },
    getParams () {
      return {
        loginMobile: this.userInfo.mobile,
        beginDate: this.leaveDate.beginDate.replace(/\//g, '-'),
        endDate: this.leaveDate.endDate.replace(/\//g, '-')
      }
    },
    getVacationDetails () {
      this.$axios.get(this.$appConfig.api.vacation, {params: this.getParams()}).then(response => {
        this.pageLoading = true
        if (response.errorMessage) {
          this.$toast(response.errorMessage)
          this.listData = response
          this.listData.holidayInfo = []
          this.listData.beginDate = this.leaveDate.beginDate
          this.listData.endDate = this.leaveDate.endDate
          return
        }
        if (response.allWorkingHourAndW !== false) {
          leaveType[0].values = ['法定年休假', '额外带薪年休假', '结转年休假', '事假', '普通病假或医疗期外']
        }
        this.dealHolidayInfo(response)
        // this.$appConfig.sortBy(response.holidayInfo, 'date', true)
        this.listData = response
        this.adjustable = this.listData.adjustable
        this.notFullShiftBalance = this.listData.notFullShiftBalance
        this.statutoryAnnual = this.listData.statutoryAnnual
        this.payAnnual = this.listData.payAnnual
        this.carryOver = this.listData.carryOver
        this.notFullShiftBalance = this.listData.notFullShiftBalance
        this.listData.beginDate = this.leaveDate.beginDate
        this.listData.endDate = this.leaveDate.endDate
        let cacheData = this.$store.state.leave.cache
        if (cacheData) {
          this.adjustable = this.listData.adjustable - this.getUsedVacation('调休假', cacheData.holidayInfo)
          this.statutoryAnnual = this.listData.statutoryAnnual - this.getUsedVacation('法定年休假', cacheData.holidayInfo)
          this.payAnnual = this.listData.payAnnual - this.getUsedVacation('额外带薪年休假', cacheData.holidayInfo)
          this.notFullShiftBalance = this.listData.notFullShiftBalance - this.getOffQuota(0, cacheData.holidayInfo)
          this.listData.vacationExplain = cacheData.vacationExplain
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    canAddShiftLeave (outer, inner, shift) {
      let shiftData = this.listData.holidayInfo[outer].shiftData[inner]
      if (inner > 0) {
        let lastShiftData = this.listData.holidayInfo[outer].shiftData[inner - 1]
        if (shiftData.shift === lastShiftData.shift) {
          return false
        }
      }
      return !shift.disableFirstShift && shiftData.beginTime && shiftData.endTime && !(shiftData.beginTime === shiftData.onDutyTime && shiftData.endTime === shiftData.offDutyTime)
    },
    addShiftLeave (outer, inner, shift) {
      let shiftData = this.listData.holidayInfo[outer].shiftData[inner]
      if (!(this.canAddShiftLeave(outer, inner, shift))) {
        return false
      }
      const newItem = {
        postId: shift.postId,
        postShortName: shift.postShortName,
        shift: shift.shift,
        onDutyTime: shift.onDutyTime,
        offDutyTime: shift.offDutyTime,
        diningDuration: shift.diningDuration,
        diningStartDatetime: shift.diningStartDatetime,
        diningEndDatetime: shift.diningEndDatetime,
        vacationType: '',
        leaveTimes: '',
        beginTime: '',
        endTime: ''
      }
      shiftData.disableFirstShift = true
      this.listData.holidayInfo[outer].shiftData.splice(inner + 1, 0, newItem)
    },
    delShiftLeave (outer, inner) {
      let shiftData = this.listData.holidayInfo[outer].shiftData
      if (!window.confirm('删除后班次中将不申请休假，是否确定删除？')) {
        return false
      }
      if (inner > 0) {
        shiftData[inner - 1].disableFirstShift = false
      }
      if (shiftData.length === 1) {
        this.listData.holidayInfo.splice(outer, 1)
      } else {
        this.listData.holidayInfo[outer].shiftData.splice(inner, 1)
      }
    },
    openDatetimes () {
      this.datatimeShow = true
      // this.listData.isBack = false
      this.headerBar.rightBtn.text = ''
      this.headerBar.title = '选择日期'
    },
    isInDateRange (rangeBegin, rangeEnd, beginDate, endDate) {
      return new Date(rangeBegin) <= new Date(endDate) && new Date(rangeEnd) >= new Date(beginDate)
    },
    getDatetime (msg) {
      let cache = this.$store.state.leave.cache
      let beginDate = this.$appConfig.fmtDate(msg[0], 'yyyy/MM/dd')
      let endDate = this.$appConfig.fmtDate(msg[1], 'yyyy/MM/dd')
      if (cache) {
        let repeatDate = this.getRepeatDate(beginDate, endDate, cache.holidayInfo)
        if (repeatDate.length && !this.$route.query.back) {
          this.$toast('申请日期' + repeatDate.join(',') + '重复，请选择其它日期')
          return false
        }
      }
      this.leaveDate.beginDate = beginDate
      this.leaveDate.endDate = endDate
      this.getVacationDetails()
      setTimeout(() => {
        this.datatimeShow = false
        this.headerBar.rightBtn.text = '保存'
        this.headerBar.title = '我要休假'
      }, 300)
    },
    getRepeatDate (rangeBegin, rangeEnd, dateArr1) {
      let flag = []
      dateArr1.map(v => {
        if (this.isInDateRange(rangeBegin, rangeEnd, v.date, v.date)) {
          flag.push(v.date)
        }
      })
      return flag
    },
    isByHours (type) {
      return type === '调休假' || type === '事假' || type === '普通病假或医疗期外'
    },
    saveLocal () {
      if (!this.isItemsFinished()) {
        this.$toast('请填写完整休假申请信息')
        return false
      }
      let cacheData = this.$store.state.leave.cache
      if (cacheData) {
        let repeatDate = this.getRepeatDate(this.listData.beginDate, this.listData.endDate, cacheData.holidayInfo)
        if (repeatDate.length && !this.$route.query.back) {
          this.$toast('申请日期' + repeatDate.join(',') + '重复，请选择其它日期')
          return false
        }
        this.listData.holidayInfo = this.listData.holidayInfo.concat(cacheData.holidayInfo)
      }
      let sum1 = 0
      let sum2 = 0
      leaveType[0].values.forEach(v => {
        if (this.isByHours(v)) {
          sum1 += this.getUsedVacation(v, this.listData.holidayInfo)
        } else {
          sum2 += this.getUsedVacation(v, this.listData.holidayInfo)
        }
      })
      sum1 = sum1 ? (sum1 + '小时') : ''
      sum2 = sum2 ? (sum2 + '天') : ''
      this.listData.totalHours = sum2 + sum1
      this.$store.dispatch('UPDATE_CACHE', this.listData)
      this.$router.push({
        path: 'action-list-check'
      })
    },
    isItemsFinished () {
      let flag = true
      let count = 0
      if (!this.listData.vacationExplain) {
        return false
      }
      this.listData.holidayInfo.forEach(outV => {
        if (+outV.hasAlternateHoliday !== 1 && outV.shiftData.length) {
          outV.shiftData.forEach(innerV => {
            if (isEmptyField(innerV.beginTime) || isEmptyField(innerV.endTime)) {
              flag = false
            }
          })
          count++
        }
      })
      return flag && count > 0
    },
    onValuesChange (picker, values) {
      switch (this.pickerType) {
        case 'timeRange':
          this.pickerValue = values
          break
        default:
          this.pickerValue = values[0]
          break
      }
    },
    openShifts (outter, inner, shift, date) {
      if (shift.hasShift || inner > 0 || shift.disableFirstShift) {
        return false
      }
      if (!shift.hasShift && !shift.postShortName) {
        this.$toast('请先选择岗位')
        return false
      }
      this.pickerType = 'shift'
      // 请求班次组数据
      this.$axios.get(this.$appConfig.api.shiftsGroup, {params: {
        loginMobile: this.userInfo.mobile,
        postId: shift.postId,
        onDutyDay: date.replace(/\//g, '-')
      }}).then(response => {
        this.shiftsGroup = response.shifts || []
        let arr = []
        this.shiftsGroup.forEach(v => {
          arr.push(v.label + ' ' + v.onDutyTime.slice(0, -3) + '-' + v.offDutyTime.slice(0, -3))
        })
        this.shifts.values = arr
        if (!this.shiftsGroup.length) {
          this.$toast('请设置改岗位的上岗规则')
          return false
        }
        let selected = shift.shift ? this.shifts.values.indexOf(shift.shift + ' ' + shift.onDutyTime.slice(0, -3) + '-' +
          shift.offDutyTime.slice(0, -3)) : 0
        this.$set(this.shifts, 'defaultIndex', selected)
        this.outterIndex = outter
        this.innerIndex = inner
        this.Slots = []
        this.Slots[0] = this.shifts
        this.pickerState = true
      })
    },
    openPosts (outter, inner, shift) {
      if (shift.hasShift || inner > 0 || shift.disableFirstShift) {
        return false
      }
      this.pickerType = 'post'
      let selected = shift.postShortName ? this.posts.values.indexOf(shift.postShortName) : 0
      this.$set(this.posts, 'defaultIndex', selected)
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = []
      this.Slots[0] = this.posts
      this.pickerState = true
    },
    openLeaveType (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.shift) {
        this.$toast('请先选择班次')
        return false
      }
      this.pickerType = 'vacationType'
      let selected = shift.vacationType ? leaveType[0].values.indexOf(shift.vacationType) : 0
      this.$set(leaveType[0], 'defaultIndex', selected)
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = leaveType
      this.pickerState = true
    },
    openLeaveTimes (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.vacationType) {
        this.$toast('请先选择休假类型')
        return false
      }
      this.pickerType = 'leaveTimes'
      let selected = shift.leaveTimes ? leaveTimes[0].values.indexOf(shift.leaveTimes) : 0
      this.$set(leaveTimes[0], 'defaultIndex', selected)
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = leaveTimes
      this.pickerState = true
    },
    openDatetime (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.leaveTimes) {
        this.$toast('请先选择休假方式')
        return false
      }
      if (shift.leaveTimes !== '自定义时间') {
        return false
      }
      if (shift.beginTime && shift.endTime) {
        let beginTimeArr = shift.beginTime.split(':')
        let endTimeArr = shift.endTime.split(':')
        this.$set(datetime[0], 'defaultIndex', hoursArray.indexOf(beginTimeArr[0]))
        this.$set(datetime[1], 'defaultIndex', ['00', '30'].indexOf(beginTimeArr[1]))
        this.$set(datetime[3], 'defaultIndex', hoursArray.indexOf(endTimeArr[0]))
        this.$set(datetime[4], 'defaultIndex', ['00', '30'].indexOf(endTimeArr[1]))
      } else {
        let onDutyTimeArr = shift.onDutyTime.split(':')
        let offDutyTimeArr = shift.offDutyTime.split(':')
        this.$set(datetime[0], 'defaultIndex', hoursArray.indexOf(onDutyTimeArr[0]))
        this.$set(datetime[1], 'defaultIndex', ['00', '30'].indexOf(onDutyTimeArr[1]))
        this.$set(datetime[3], 'defaultIndex', hoursArray.indexOf(offDutyTimeArr[0]))
        this.$set(datetime[4], 'defaultIndex', ['00', '30'].indexOf(offDutyTimeArr[1]))
      }
      this.pickerType = 'timeRange'
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = datetime
      this.pickerState = true
    },
    isInTimeRange (beginTime, endTime, pickerTimeBegin, pickerTimeEnd) {
      let acrossDay = beginTime > endTime
      if (acrossDay) {
        let endTimeArr = endTime.split(':')
        if (pickerTimeBegin < beginTime) {
          pickerTimeBegin = (+pickerTimeBegin.split(':')[0] + 24) + ':' + pickerTimeBegin.split(':')[1] + ':00'
        }
        if (pickerTimeEnd && pickerTimeEnd < beginTime) {
          pickerTimeEnd = (+pickerTimeEnd.split(':')[0] + 24) + ':' + pickerTimeEnd.split(':')[1] + ':00'
        }
        endTime = (+endTimeArr[0] + 24) + ':' + endTimeArr[1] + ':00'
      }
      if (pickerTimeEnd) {
        return pickerTimeBegin < pickerTimeEnd && pickerTimeEnd <= endTime && pickerTimeBegin >= beginTime
      } else {
        return pickerTimeBegin <= endTime && pickerTimeBegin >= beginTime
      }
    },
    getOffQuota (isFull, holidayInfoArr = this.listData.holidayInfo) {
      let result = 0
      holidayInfoArr.forEach(outV => {
        outV.shiftData.forEach(innerV => {
          if (innerV.vacationType === '调休假' && innerV.timeRange) {
            if ((isFull === 1 && innerV.leaveTimes !== '自定义时间') || (isFull === 0 && innerV.leaveTimes === '自定义时间')) {
              result += innerV.timeRange
            }
          }
        })
      })
      return result
    },
    // 获取额外带薪年休假已用额度
    getUsedVacation (type, holidayInfoArr = this.listData.holidayInfo) {
      let result = 0
      if (this.isByHours(type)) {
        holidayInfoArr.forEach(outV => {
          outV.shiftData.forEach(innerV => {
            if (innerV.vacationType === type && innerV.timeRange) {
              result += innerV.timeRange
            }
          })
        })
      } else {
        holidayInfoArr.forEach(outV => {
          outV.shiftData.forEach(innerV => {
            if (innerV.vacationType === type) {
              if (innerV.leaveTimes === '整班次休假') {
                result += 1
              } else if (innerV.leaveTimes === '前半班次休假' || innerV.leaveTimes === '后半班次休假') {
                result += 0.5
              }
            }
          })
        })
      }
      return result
    },
    adjustEnoughTime (vacationType) {
      if (vacationType === '调休假' && this.notFullShiftBalance < this.getOffQuota(0)) {
        return '剩余“非整班次”调休额度为' + this.notFullShiftBalance + '小时，额度不足。另有整班次调休额度' + (this.adjustable - this.notFullShiftBalance - this.getOffQuota(1)) + '小时'
      }
      if (vacationType === '调休假' && this.adjustable < this.getUsedVacation('调休假')) {
        return '调休假余额仅剩' + this.adjustable + '小时，超过时间请选择法定年休假'
      }
      if (vacationType === '法定年休假' && this.statutoryAnnual < this.getUsedVacation('法定年休假')) {
        return '法定年休假余额仅剩' + this.statutoryAnnual + '天，超过天数请选择额外带薪年休假'
      }
      if (vacationType === '额外带薪年休假' && this.payAnnual < this.getUsedVacation('额外带薪年休假')) {
        return '额外带薪年休假余额不足，请选择其它类型'
      }
      if (vacationType === '结转年休假' && this.carryOver < this.getUsedVacation('结转年休假')) {
        return '结转年休假额度不足，请选择其它类型'
      }
      return false
    },
    ok () {
      const shiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex]
      let pickerValue = this.pickerValue
      switch (this.pickerType) {
        case 'post':
          (() => {
            shiftData.postShortName = pickerValue || this.$refs.picker.getValues().toString()
            shiftData.postId = utils.findId(this.postGroup, 'postId', 'postShortName', shiftData.postShortName)
            shiftData.beginTime = ''
            shiftData.endTime = ''
            shiftData.leaveTimes = ''
            shiftData.shift = ''
            shiftData.onDutyTime = ''
            shiftData.offDutyTime = ''
          })()
          break
        case 'shift':
          let pickerValueArr = (pickerValue || this.$refs.picker.getValues().toString()).split(' ')
          let onDutyTime = pickerValueArr[1].split('-')[0] + ':00'
          let offDutyTime = pickerValueArr[1].split('-')[1] + ':00'
          let params = {
            loginMobile: this.userInfo.mobile,
            onDutyTime: onDutyTime,
            offDutyTime: offDutyTime,
            date: this.listData.holidayInfo[this.outterIndex].date.replace(/\//g, '-')
          }
          this.$axios.get(this.$appConfig.api.shiftOverlay, {params: params}).then(response => {
            if (response.status !== 'success') {
              this.$toast(response.errorMessage)
              return false
            }
            shiftData.shift = pickerValueArr[0]
            shiftData.onDutyTime = onDutyTime
            shiftData.offDutyTime = offDutyTime
            shiftData.diningDuration = utils.findId(this.shiftsGroup, 'diningDuration', 'label', pickerValueArr[0])
            shiftData.diningStartDatetime = utils.findId(this.shiftsGroup, 'diningStartDatetime', 'label', pickerValueArr[0])
            shiftData.diningEndDatetime = utils.findId(this.shiftsGroup, 'diningEndDatetime', 'label', pickerValueArr[0])
          })
          shiftData.beginTime = ''
          shiftData.endTime = ''
          shiftData.leaveTimes = ''
          break
        case 'vacationType':
          (() => {
            let vacationType = pickerValue || this.$refs.picker.getValues().toString()
            shiftData.beginTime = ''
            shiftData.endTime = ''
            shiftData.leaveTimes = ''
            let restadjustEnoughTime = this.adjustEnoughTime(vacationType)
            if (restadjustEnoughTime) {
              this.$toast(restadjustEnoughTime)
              return false
            }
            let halfShiftHours = (getTimeDiff(shiftData.onDutyTime, shiftData.offDutyTime) - shiftData.diningDuration || 0) / 2
            if ((vacationType === '额外带薪年休假' || vacationType === '法定年休假') && (this.adjustable - this.getUsedVacation('调休假')) >= halfShiftHours) {
              this.$toast('调休假仍有余额，请优先选择调休假')
              return false
            }
            if (vacationType === '额外带薪年休假' && (this.statutoryAnnual - this.getUsedVacation('法定年休假')) >= 0.5) {
              this.$toast('法定年休假假仍有余额，请优先选择法定年休假')
              return false
            }
            shiftData.vacationType = vacationType
          })()
          break
        case 'leaveTimes':
          (() => {
            let leaveTime = pickerValue || this.$refs.picker.getValues().toString()
            if (leaveTime === '自定义时间') {
              shiftData.beginTime = ''
              shiftData.endTime = ''
              if (shiftData.vacationType !== '调休假' && shiftData.vacationType !== '事假' && shiftData.vacationType !== '普通病假或医疗期外' && shiftData.vacationType !== '法定病假医疗期') {
                this.$toast(shiftData.vacationType + '请选择整班次或半个班次')
                return false
              }
            }
            shiftData.leaveTimes = leaveTime
            if (leaveTime === '整班次休假') {
              if (this.innerIndex > 0) {
                let lastShiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                if (shiftData.shift === lastShiftData.shift) {
                  this.$toast('请选择其他休假方式')
                  shiftData.beginTime = ''
                  shiftData.endTime = ''
                  shiftData.leaveTimes = ''
                  return false
                }
              }
              shiftData.beginTime = shiftData.onDutyTime
              shiftData.endTime = shiftData.offDutyTime
            } else if (leaveTime !== '自定义时间') {
              let dutyTimes = getTimeDiff(shiftData.onDutyTime, shiftData.offDutyTime)
              let dir = dutyTimes / 2
              let onDutyTimeArr = shiftData.onDutyTime.split(':')
              let middleTime = ''
              if (!shiftData.diningStartDatetime && !shiftData.diningEndDatetime) {
                if (dutyTimes.toString().indexOf('.5') >= 0) {
                  dir = 4
                }
                if ((+onDutyTimeArr[0] + dir) > 24) {
                  if (dir.toString().indexOf('.5') >= 0) {
                    if (onDutyTimeArr[1] >= 30) {
                      middleTime = (+onDutyTimeArr[0] + dir - 24 + 0.5) + ':00:' + onDutyTimeArr[2]
                    } else {
                      middleTime = (+onDutyTimeArr[0] + dir - 24 - 0.5) + ':30:' + onDutyTimeArr[2]
                    }
                  } else {
                    middleTime = (+onDutyTimeArr[0] + dir - 24) + ':' + onDutyTimeArr[1] + ':' + onDutyTimeArr[2]
                  }
                } else {
                  if (dir.toString().indexOf('.5') >= 0) {
                    if (onDutyTimeArr[1] >= 30) {
                      middleTime = (+onDutyTimeArr[0] + dir + 0.5) + ':00:' + onDutyTimeArr[2]
                    } else {
                      middleTime = (+onDutyTimeArr[0] + dir - 0.5) + ':30:' + onDutyTimeArr[2]
                    }
                  } else {
                    middleTime = (+onDutyTimeArr[0] + dir) + ':' + onDutyTimeArr[1] + ':' + onDutyTimeArr[2]
                  }
                }
                let mt1 = middleTime.split(':')
                if (mt1[0] < 10) {
                  middleTime = '0' + middleTime
                }
              }
              if (leaveTime === '前半班次休假') {
                shiftData.beginTime = shiftData.onDutyTime
                if (shiftData.diningStartDatetime) {
                  shiftData.endTime = shiftData.diningStartDatetime
                } else {
                  shiftData.endTime = middleTime
                }
              }
              if (leaveTime === '后半班次休假') {
                shiftData.endTime = shiftData.offDutyTime
                if (shiftData.diningEndDatetime) {
                  shiftData.beginTime = shiftData.diningEndDatetime
                } else {
                  shiftData.beginTime = middleTime
                }
              }
              if (this.innerIndex > 0) {
                let lastShiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                let rangeBegin
                let rangeEnd
                if (lastShiftData.shift === shiftData.shift) {
                  if (lastShiftData.endTime === lastShiftData.offDutyTime) {
                    rangeBegin = lastShiftData.onDutyTime
                    rangeEnd = lastShiftData.beginTime
                  } else {
                    rangeBegin = lastShiftData.endTime
                    rangeEnd = lastShiftData.offDutyTime
                  }
                  if (!this.isInTimeRange(rangeBegin, rangeEnd, shiftData.beginTime, shiftData.endTime)) {
                    this.$toast('休假区间有误，请选择其他休假类型')
                    shiftData.beginTime = ''
                    shiftData.endTime = ''
                    shiftData.leaveTimes = ''
                    return false
                  }
                }
              }
            }
            shiftData.timeRange = getTimeDiff(shiftData.beginTime, shiftData.endTime)
            if (leaveTime === '整班次休假' && shiftData.diningDuration) {
              shiftData.timeRange -= shiftData.diningDuration
            }
            let notEnough = this.adjustEnoughTime(shiftData.vacationType)
            if (notEnough) {
              this.$toast(shiftData.vacationType + '额度不足')
              shiftData.leaveTimes = ''
              shiftData.beginTime = ''
              shiftData.endTime = ''
              shiftData.timeRange = 0
              return false
            }
          })()
          break
        case 'timeRange':
          (() => {
            pickerValue = this.$refs.picker.getValues()
            if (pickerValue) {
              let pickBeginTime = pickerValue[0] + ':' + pickerValue[1] + ':00'
              let pickEndTime = pickerValue[3] + ':' + pickerValue[4] + ':00'
              if (this.isInTimeRange(shiftData.onDutyTime, shiftData.offDutyTime, pickBeginTime, pickEndTime)) {
                if (shiftData.onDutyTime !== pickBeginTime && shiftData.offDutyTime !== pickEndTime) {
                  this.$toast('休假区间选择有误')
                  return false
                }
                if (this.innerIndex > 0) {
                  let lastShiftData1 = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                  let rangeBegin1
                  let rangeEnd1
                  if (lastShiftData1.shift === shiftData.shift) {
                    if (lastShiftData1.endTime === lastShiftData1.offDutyTime) {
                      rangeBegin1 = lastShiftData1.onDutyTime
                      rangeEnd1 = lastShiftData1.beginTime
                    } else {
                      rangeBegin1 = lastShiftData1.endTime
                      rangeEnd1 = lastShiftData1.offDutyTime
                    }
                    if (!this.isInTimeRange(rangeBegin1, rangeEnd1, pickBeginTime, pickEndTime)) {
                      this.$toast('休假区间有误，请选择其他时间段')
                      shiftData.beginTime = ''
                      shiftData.endTime = ''
                      shiftData.leaveTimes = ''
                      return false
                    }
                  }
                }
                shiftData.beginTime = pickBeginTime
                shiftData.endTime = pickEndTime
                shiftData.timeRange = getTimeDiff(shiftData.beginTime, shiftData.endTime)
                let notEnough = this.adjustEnoughTime(shiftData.vacationType)
                if (notEnough) {
                  this.$toast(notEnough)
                  shiftData.beginTime = ''
                  shiftData.endTime = ''
                  shiftData.timeRange = 0
                  return false
                }
              } else {
                this.$toast('班次中间时间不可申请休假')
                return false
              }
            }
          })()
          break
      }
      this.pickerValue = null
      this.pickerState = false
    },
    save () {
      if (this.vacationExplain.length > 200) {
        this.$toast('字数不能大于200字')
        return false
      }
      this.modelData.state = false
      this.listData.vacationExplain = this.vacationExplain
      this.$parent.slide = 'slide-left'
    }
  }
}
function isEmptyField (field) {
  return field === undefined || field === '' || field === null
}
// 获取2个时间的时长差
function getTimeDiff (begin, end) {
  if (!begin || !end) {
    return 0
  }
  let tempStr = (begin + ':' + end).split(':')
  if (begin > end) {
    tempStr[3] = 24 + Number(tempStr[3])
  }
  return Number(tempStr[3] - tempStr[0]) + Number(tempStr[4] - tempStr[1]) / 60
}
</script>

<style lang="scss">
  @import "../../assets/scss/Common/_variables.scss";

  .inner-padding {
    padding: rem(30px);
  }
  .model-textarea {
    background: #ccc;
    border: 0;
    height: 100px;
    padding: 10px;
    border-radius: 4px;
    display: block;
    width: 100%;
  }
</style>
