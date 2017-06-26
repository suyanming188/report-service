<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick"
                @rightBtnClick="rightDone"></header-bar>
    <div class="content">
      <ul class="list">
        <li class="list-item list-item-touch-active">
          <a @click="continueApply" class="list-item-inner">
              继续添加休假申请
            <div class="list-item-right icon-angle-right">
            </div>
          </a>
        </li>
      </ul>
      <div class="pt5 pb15 tc gray">
        申请休假时长共计 <span class="color-primary">{{listData.totalHours}}</span>
      </div>
      <div class="bg-white p15 px-tb mb15" v-for="item in listData.holidayInfo">
        <div class="box-justify">
          <span class="color-primary">{{item.date}}</span>
        </div>
        <ul class="list list-corner" v-if="item.hasAlternateHoliday == 1">
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right">
                月休
              </div>
            </div>
          </li>
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                无需请假
              </div>
            </div>
          </li>
        </ul>
        <ul class="list list-corner" v-for="shiftObj in item.shiftData" v-if="item.hasAlternateHoliday != 1">
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                岗位
              </div>
              <div class="list-item-right">
                {{ shiftObj.postShortName }}
              </div>
            </div>
          </li>
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right">
                {{shiftObj.shift}} {{shiftObj.onDutyTime | cutMinute}}-{{shiftObj.offDutyTime | cutMinute}}
              </div>
            </div>
          </li>
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                休假类型
              </div>
              <div class="list-item-right">
                {{ shiftObj.vacationType }}
              </div>
            </div>
          </li>
          <li class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                时间
              </div>
              <div class="list-item-right">
                {{shiftObj.beginTime | cutMinute}}-{{shiftObj.endTime | cutMinute}}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="p15 bg-white mt15 px-tb">
        <div class="f16">休假说明</div>
        <div class="gray mt5">{{listData.vacationExplain}}</div>
      </div>
      <!-- 审批人 -->
      <div class="employee-group px-tb">
        <div class="employee-title px-b">审批</div>
        <ul class="employee-list">
          <li class="" v-for="(item, index) in employeeGroup.approval" @click="addEmploye(index, 'approval', item)">
            <div class="text-overflow gray pr5">{{item.workJob || '&nbsp;'}}</div>
            <span class="employee-author" :class="{'add': item.name == null}" :style="face(item.avatar)"></span>{{item.name
            || '&nbsp;'}}
          </li>
        </ul>
      </div>

      <!-- 抄送人 -->
      <div class="employee-group px-tb">
        <div class="employee-title px-b">抄送人</div>
        <ul class="employee-list">
          <li class="" v-for="(item,index) in employeeGroup.ccMan" @click="addEmploye(index, 'ccMan', item)">
            <div class="text-overflow gray pr5">{{item.workJob || '&nbsp;'}}</div>
            <span class="employee-author" :class="{'add': item.name == null}" :style="face(item.avatar)"></span>{{item.name
            || '&nbsp;'}}
          </li>
        </ul>
      </div>
      <div class="inner-padding">
        <button type="button" class="ev-btn ev-btn--primary ev-btn-small" @click="action">提交</button>
      </div>
    </div>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
import addPerson from '../../components/addPerson.vue'
import * as util from '../../utils/util'
// const aa = {
//   'code': 200,
//   'statutoryAnnual': '0',
//   'adjustable': '0.0',
//   'payAnnual': '0',
//   'holidayInfo': [{'date': '2017/05/26', 'isopen': true, 'shiftData': [{'shift': 'CS7中', 'postShortName': '班长（出入口）', 'postId': 17278, 'hasShift': false, 'disableFirstShift': false, 'leaveTimes': '整班次休假', 'onDutyTime': '15:00:00', 'offDutyTime': '23:00:00', 'vacationType': '普通病假或医疗期外', 'beginTime': '15:00:00', 'endTime': '23:00:00', 'diningDuration': 1, 'diningStartDatetime': '20:00:00', 'diningEndDatetime': '21:00:00', 'timeRange': 7}]
//   }],
//   'errorMessage': null,
//   'allWorkingHourAndW': false,
//   'beginDate': '2017/05/26',
//   'endDate': '2017/05/26',
//   'vacationExplain': 'asd',
//   'totalHours': 7
// }
const emptyParams = {
  avatar: null,
  employeeId: null,
  name: null,
  workJob: null
}
export default {
  data () {
    return {
      listData: JSON.parse(JSON.stringify(this.$store.state.leave.cache)),
      // listData: aa,
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: ''
        },
        title: '我要休假'
      },
      employeeGroup: {},
      addPersonState: false,
      fetchData: null,
      cacheEmploye: null,
      addApprovalIndex: null,
      employeType: null
    }
  },
  created () {
    let params = {
      departments: this.$store.state.userInfo.departmentId,
      loginMobile: this.$store.state.userInfo.mobile
    }
    this.$axios.get(this.$appConfig.api.searchDefaultApprovalAndCCMan, {params: params})
    .then(res => {
      console.log(res)
      this.employeeGroup = res
      this.buildApproval(this.employeeGroup.approval)
      this.buildCCMan(this.employeeGroup.ccMan)
    })
  },
  mounted () {
    // console.log(aa)
  },
  components: {
    HeaderBar,
    addPerson
  },
  methods: {
    leftBtnClick () {
      if (this.addPersonState) {
        this.addPersonState = false
      } else {
        this.$router.push({
          path: 'action',
          query: {
            back: true
          }
        })
      }
    },
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
    },
    addEmploye (id, type, item) {
      if (item.department) {
        this.$toast('默认人员不可修改')
        return false
      }
      this.employeType = type
      this.addApprovalIndex = id
      this.addPersonState = true
      this.headerBar.rightBtn.text = '确定'
      this.fetchData = this.$appConfig.api.searchLeaders + '?loginMobile='
    },
    getApprovalPersons (data) {
      this.cacheEmploye = data
    },
    continueApply () {
      this.$router.push({
        path: 'action',
        query: {
          step: 1
        }
      })
    },
    buildApproval (item) {
      if (util.isEmpty(item)) {
        item.push(emptyParams)
        item.push(emptyParams)
      } else if (item.length === 1) {
        item.push(emptyParams)
      }
    },
    buildCCMan (item) {
      if (util.isEmpty(item)) {
        item.push(emptyParams)
      }
    },
    rightDone () {
      if (this.addPersonState) {
        this.headerBar.rightBtn.text = ''
        this.addPersonState = false
        let selectedEmploye = {
          avatar: this.cacheEmploye.avatarUrl,
          employeeId: this.cacheEmploye.employeeId,
          workJob: this.cacheEmploye.jobName,
          name: this.cacheEmploye.name
        }
        if (this.employeType === 'ccMan') {
          this.employeeGroup.ccMan[0] = selectedEmploye
        } else {
          this.employeeGroup.approval[this.addApprovalIndex] = selectedEmploye
        }
        return false
      }
    },
    action () {
      let dateArr = []
      for (let i = 0, arr = this.listData.holidayInfo, len = arr.length; i < len; i++) {
        if (arr[i].hasTrip) {
          dateArr.push(arr[i].date)
        }
      }
      let str = '本次申请休假总时长为' + this.listData.totalHours + '小时,'
      if (dateArr.length) {
        str += dateArr.join(',') + '中安排了外勤/出差,'
      }
      str += '是否确定提交申请？'
      if (window.confirm(str)) {
        // this.$router.push({
        //   path: 'action-post'
        // })
        this.save()
      }
    },
    save () {
      let params = {
        vacationExplain: this.listData.vacationExplain,
        employeeId: this.$store.state.userInfo.id,
        firstApprovalId: this.employeeGroup.approval[0].employeeId,
        secondApprovalId: this.employeeGroup.approval[1].employeeId,
        ccApprovalId: this.employeeGroup.ccMan[0].employeeId
      }
      if (!params.firstApprovalId || !params.secondApprovalId) {
        this.$toast('请选择审批人员')
        return false
      }
      let holidayInfo = JSON.parse(JSON.stringify(this.listData.holidayInfo))
      params.holidayInfo = holidayInfo.filter(out => {
        if (!out.hasAlternateHoliday) {
          out.date = out.date.replace(/\//g, '-')
          out.shiftData.map(inner => {
            inner.vacationType = util.findId(util.leaveType(), 'id', 'name', inner.vacationType)
            if (inner.leaveTimes === '自定义时间') {
              inner.operationType = 0
            } else if (inner.leaveTimes === '整班次休假') {
              inner.operationType = 1
            } else if (inner.leaveTimes === '前半班次休假') {
              inner.operationType = 2
            } else if (inner.leaveTimes === '后半班次休假') {
              inner.operationType = 3
            }
          })
          return true
        } else {
          return false
        }
      })
      this.$toast({
        msg: '提交中..',
        type: 'loading',
        time: 7000
      })
      this.$axios.post(this.$appConfig.api.vacation, params).then(response => {
        if (response.errorMessage) {
          this.$toast(response.errorMessage)
          return
        }
        this.$parent.transformData = {}
        this.$store.dispatch('UPDATE_CACHE', null)
        this.$toast({
          msg: '提交成功',
          type: 'succes',
          time: 2000
        })
        setTimeout(() => {
          this.$router.push({
            path: '/leave/'
          })
        }, 500)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .list.list-corner {
    background-color: #f1f1f1;
  }

  .inner-padding {
    padding: .4rem
  }
</style>
