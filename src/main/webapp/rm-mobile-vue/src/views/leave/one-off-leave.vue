<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <div class="item-box">
            <h4>开始时间</h4>
            <span>
              <datetime :placeholder="startDate" v-model="startDate" format="YYYY-MM-DD HH:mm"
                        @on-change="onStartDateChange" :title="''" year-row="{value}" month-row="{value}"
                        day-row="{value}" day-hour="{value}" day-minute="{value}" confirm-text="完成" cancel-text="取消"
                        :start-date="minStartDate" :end-date="maxEndDate" :limit-minute="true"></datetime>
            </span>
          </div>
          <div class="item-box">
            <h4>结束时间</h4>
            <span>
              <datetime :placeholder="endDate" v-model="endDate" format="YYYY-MM-DD HH:mm" @on-change="onEndDateChange"
                        :title="''" year-row="{value}" month-row="{value}" day-row="{value}" day-hour="{value}"
                        day-minute="{value}" confirm-text="完成" cancel-text="取消" :start-date="startDate"
                        :end-date="maxEndDates" :limit-minute="true"></datetime>
            </span>
          </div>
          <div class="item-box">
            <h4>休假类型</h4>
            <span class="disabled">{{ holidayType }}</span>
          </div>
          <div class="item-box margin-top arrow-right" @click="fillExplain">
            <h4>休假理由</h4>
            <span class="explain">{{ vacationExplainTextOverflow }}</span>
          </div>
          <div class="item-box margin-top">
            <h4>休假时长</h4>
            <span class="disabled">{{ duration }} {{ quotaType }}</span>
          </div>
          <div class="item-box margin-top no-flex">
            <h4>审批人</h4>
            <div class="approval-box">
              <div class="approval" v-if="firstApproval" @click="firstApproval ? firstApproval = null : '' ">
                <h5 class="color-gray">{{ textOverflow(firstApproval.workJob) || '&nbsp;' }}</h5>
                <span class="avatar" :style="face(firstApproval.avatar)"></span>
                <h4>{{ firstApproval.name || '' }}</h4>
              </div>
              <div class="add-approval" v-if="!firstApproval">
                <h5 class="color-gray">&nbsp;</h5>
                <span class="employee-author add" @click="searchApproval('firstApproval')"></span>
              </div>
              <div class="approval" v-if="secondApproval" @click="secondApproval ? secondApproval = null : ''">
                <h5 class="color-gray">{{ textOverflow(secondApproval.workJob) || '&nbsp;' }}</h5>
                <span class="avatar" :style="face(secondApproval.avatar)"></span>
                <h4>{{ secondApproval.name || '' }}</h4>
              </div>
              <div class="add-approval" v-if="!secondApproval">
                <h5 class="color-gray">&nbsp;</h5>
                <span class="employee-author add" @click="searchApproval('secondApproval')"></span>
              </div>
            </div>
          </div>
          <span class="tips color-gray">点击头像可删除</span>
          <div class="item-box margin-top no-flex">
            <h4>抄送人</h4>
            <div class="approval-box">
              <div class="approval" v-if="ccApproval" @click="ccApproval ? ccApproval = null : ''">
                <h5 class="color-gray">{{ textOverflow(ccApproval.workJob) || '&nbsp;' }}</h5>
                <span class="avatar" :style="face(ccApproval.avatar)"></span>
                <h4>{{ ccApproval.name || '' }}</h4>
              </div>
              <div class="add-approval" v-if="!ccApproval">
                <h5 class="color-gray">&nbsp;</h5>
                <span class="employee-author add" @click="searchApproval('ccApproval')"></span>
              </div>
            </div>
          </div>
          <span class="tips color-gray">点击头像可删除</span>
          <button class="btn btn-submit" @click="submitApply">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import { Datetime } from 'vux'
//   import * as util from '../../utils/util.js'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          title: '我要休假'
        },
        leaveInfo: '',
        networkError: false,
        startDate: '',
        endDate: '',
        minStartDate: '',
        maxEndDate: '',
        holidayType: '',
        holidayTypeId: '',
        vacationExplain: '',
        vacationExplainTextOverflow: '',
        duration: '',
        quotaType: '',
        firstApproval: null,
        secondApproval: null,
        ccApproval: null,
        minutes: ['00', '30']
      }
    },
    components: {
      HeaderBar,
      Datetime
    },
    created () {
      this.userInfo = this.$store.state.userInfo
      if (this.$route.params.oneOffVacation) {
        this.startDate = this.$route.params.oneOffVacation.startDate
        this.endDate = this.$route.params.oneOffVacation.endDate
        this.holidayType = this.$route.params.oneOffVacation.holidayType
        this.holidayTypeId = this.$route.params.oneOffVacation.holidayTypeId
        this.vacationExplain = this.$route.params.vacationExplain
        this.minStartDate = this.$route.params.leaveInfo.effectiveDate
        this.maxEndDate = this.$route.params.leaveInfo.expiryDate
        if (this.vacationExplain.length > 20) {
          this.vacationExplainTextOverflow = this.vacationExplain.slice(0, 21) + '...'
        } else {
          this.vacationExplainTextOverflow = this.vacationExplain
        }
        this.duration = this.$route.params.oneOffVacation.duration
        this.quotaType = this.$route.params.oneOffVacation.quotaType
        this.firstApproval = this.$route.params.firstApproval
        this.secondApproval = this.$route.params.secondApproval
        this.ccApproval = this.$route.params.ccApproval
        this.leaveInfo = this.$route.params.leaveInfo
      } else {
        this.leaveInfo = this.$route.params
        this.minStartDate = this.$route.params.effectiveDate
        this.maxEndDate = this.$route.params.expiryDate
        this.startDate = this.$route.params.effectiveDate + ' 00:00'
        // this.endDate = this.$route.params.expiryDate + ' 23:59'
        this.holidayType = this.leaveInfo.holidayType
        this.holidayTypeId = this.leaveInfo.holidayTypeId
        this.duration = this.leaveInfo.leftQuota
        this.quotaType = this.leaveInfo.quotaType
        this.getDefaultApprovalAndCCMan()
      }
    },
    computed: {
      maxEndDates () {
        let start = new Date(this.dash(this.startDate))
        let max = new Date(this.dash(this.maxEndDate + ' 23:30'))
        let end = null
        if (this.$route.params.oneOffVacation) {
          this.endDate = this.$route.params.oneOffVacation.endDate
        } else {
          if (this.leaveInfo.quotaType === '天') {
            let autoEnd = new Date(start.setDate(start.getDate() + this.leaveInfo.quota))
            if (autoEnd > max) {
              end = max
            } else {
              end = autoEnd
            }
            this.endDate = this.$appConfig.fmtDate(end, 'yyyy-MM-dd hh:mm')
          } else {
            let autoEnd = start.getTime() + (this.leaveInfo.quota * 3600000)
            if (autoEnd > max.getTime()) {
              end = max
            } else {
              end = new Date(autoEnd)
            }
            this.endDate = this.$appConfig.fmtDate(end, 'yyyy-MM-dd hh:mm')
          }
        }
        return this.$appConfig.fmtDate(max, 'yyyy-MM-dd')
      }
    },
    methods: {
      dash (data) {
        return data ? data.replace(/-/g, '/') : null
      },
      leftBtnClick () {
        this.$router.push({
          path: '/leave/balance'
        })
      },
      getDefaultApprovalAndCCMan () {
        setTimeout(() => {
          this.$axios.get(this.$appConfig.api.searchDefaultApprovalAndCCMan, {
            params: {
              departments: this.userInfo.departmentId,
              loginMobile: this.userInfo.mobile
            }
          })
          .then((res) => {
            this.firstApproval = res.approval[0]
            this.secondApproval = res.approval[1]
            this.ccApproval = res.ccMan[0]
          })
        }, 200)
      },
      submitApply () {
        if (!this.startDate) {
          this.$toast('请选择开始时间')
          return
        }
        if (!this.endDate) {
          this.$toast('请选择结束时间')
          return
        }
        if (!this.firstApproval || !this.secondApproval) {
          this.$toast('请选择审批人')
          return
        }
        if (!this.ccApproval) {
          this.$toast('请选择抄送人')
          return
        }
        let effectiveDate = new Date(this.fmtDate(this.leaveInfo.effectiveDate)).getTime()
        let expiryDate = new Date(this.fmtDate(this.leaveInfo.expiryDate)).getTime()
        let start = new Date(this.fmtDate(this.startDate)).getTime()
        let end = new Date(this.fmtDate(this.endDate)).getTime()
        if (start < effectiveDate) {
          this.$toast('开始时间不能在有效期外')
          return
        }
        if (end > (expiryDate + 86400000 - 1)) {
          this.$toast('结束时间不能在有效期外')
          return
        }
        if ((end - start) < 0) {
          this.$toast('结束时间不能小于开始时间')
          return
        }
        let params = {
          employeeId: this.userInfo.id,
          firstApprovalId: parseInt(this.firstApproval.employeeId),
          secondApprovalId: parseInt(this.secondApproval.employeeId),
          ccApprovalId: parseInt(this.ccApproval.employeeId),
          vacationExplain: this.vacationExplain,
          oneOffVacation: {
            startDate: this.startDate,
            endDate: this.endDate,
            holidayType: this.holidayTypeId,
            duration: this.duration
          }
        }
        this.$toast({
          msg: '提交中...',
          type: 'loading',
          time: 7000
        })
        this.$axios.post(this.$appConfig.api.vacation, params)
        .then((res) => {
          if (res.status === 'success') {
            this.$toast({
              msg: '提交成功',
              type: 'succes'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'leaveBalance'
              })
            }, 1000)
          } else {
            this.$toast(res.errorMessage)
          }
        })
      },
      searchApproval (person) {
        let params = Object.assign({
          page: 'leaveOneOff',
          selected: person
        }, this.getParams())
        this.$router.push({
          name: 'searchStaff',
          params: params
        })
      },
      fillExplain () {
        this.$router.push({
          name: 'leaveExplain',
          params: this.getParams()
        })
      },
      getParams () {
        return {
          firstApproval: this.firstApproval ? this.firstApproval : '',
          secondApproval: this.secondApproval ? this.secondApproval : '',
          ccApproval: this.ccApproval ? this.ccApproval : '',
          vacationExplain: this.vacationExplain || '',
          leaveInfo: this.leaveInfo,
          oneOffVacation: {
            startDate: this.startDate || '',
            endDate: this.endDate || '',
            holidayType: this.holidayType || '',
            holidayTypeId: this.holidayTypeId || '',
            duration: this.duration || '',
            quotaType: this.quotaType || ''
          }
        }
      },
      onStartDateChange (value) {
        this.startDate = value
        this.validateDate()
      },
      onEndDateChange (value) {
        this.endDate = value
        this.validateDate()
      },
      validateDate () {
        if (this.startDate && this.endDate) {
          let start = new Date(this.fmtDate(this.startDate)).getTime()
          let end = new Date(this.fmtDate(this.endDate)).getTime()
          let step = end - start
          if (step < 0) {
            this.$toast('结束时间不能小于开始时间')
            return
          }
          if (this.leaveInfo.quotaType === '天') {
            let left = this.leaveInfo.leftQuota
            step = Math.ceil(step / (24 * 60 * 60 * 1000))
            if (step > left) {
              this.$toast('所选择的休假时长大于额度时长，请重新选择时间')
            }
          }
        }
      },
      getDate () {
        let now = new Date()
        let newDate = ''
        newDate += now.getFullYear() + '-'
        newDate += (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
        newDate += (now.getDate() < 10 ? '0' + now.getDate() : now.getDate()) + ' '
        newDate += (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ':'
        newDate += now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
        return newDate
      },
      face (url) {
        if (url) {
          return 'background-image: url(' + url + ')'
        } else {
          return null
        }
      },
      fmtDate (date) {
        return date.replace(/-/g, '/')
      },
      textOverflow (string) {
        if (string.length > 5) {
          return string.slice(0, 5) + '...'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';
  $padding: rem($inner-width);
  h3, h4, h5 {
    padding: 0;
    margin: 0;
    font-weight: normal;
  }
  .flex-start {
    .item-box {
      display: flex;
      justify-content: center;
      align-item: center;
      background: white;
      padding: .4rem $padding;
      border-bottom: 1px solid $border-color;
      &.no-flex {
        display: block;
      }
      h4 {
        flex: 1.5;
      }
      span {
        flex: 5;
        text-align: right;
      }
      .explain {
        flex: 5;
        color: $gray;
        text-align: left;
        padding-right: 10px;
        height: 1.2em;
        overflow: hidden;
        text-align: right;
      }
      .weui-cell {
        padding: 0;
      }
    }
    .approval-box {
      clear: both;
      border-top: 1px solid $border-color;
      display: flex;
      margin-top: .3rem;
    }
    .approval,
    .add-approval {
      width: 2.4rem;
      height: 2.4rem;
      text-align: center;
      margin-top: .2rem;
    }
    .approval {
      h5 {
        font-size: 12px;
      }
      .avatar {
        display: block;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        margin: .1rem auto;
        background-image: url('../../assets/images/default-head.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      h4 {
        font-size: 14px;
      }
    }
    .arrow-right:before {
      right: $padding;
    }
    .margin-top {
      margin-top: .3rem;
    }
    .disabled {
      color: #999;
    }
    .color-gray {
      color: #bbb;
      font-size: 14px;
    }
    .tips {
      padding-top: .1rem;
      padding-left: $padding;
    }
  }
  .btn-submit {
    width: 90%;
    background: $theme-primary;
    margin: .5rem auto;
  }
</style>
