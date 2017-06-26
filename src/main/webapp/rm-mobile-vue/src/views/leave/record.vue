<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <div class="page-loading" v-if="!pageLoading">
            <span class="m-loading"></span>
          </div>
          <transition name="fadeUp">
            <div v-if="pageLoading">
              <div>
                <div class="box-white px-tb">
                  <ul class="box-gray list-box">
                    <li class="px-b">申请休假时长<span>{{detail.durationStr}}</span></li>
                    <li>提交时间<span>{{ detail.datetime.replace(/-/g,'/') }}</span></li>
                  </ul>
                  <div :class="detail.state == 3 ? 'state fail' : 'state'">
                    <i :class="detail.state == 1 ? 'iconfont icon-approvaled' : ''"></i>
                    <i :class="detail.state == 2 ? 'iconfont icon-passed' : ''"></i>
                    <i :class="detail.state == 3 ? 'iconfont icon-failed' : ''"></i>
                    <i :class="detail.state == 4 ? 'iconfont icon-revoked' : ''"></i>
                    {{ switchState(detail.state) }}
                  </div>
                </div>
                <div class="box-white px-tb" v-if="detail.beginDateTime && detail.endDateTime">
                  <div>
                    <span class="f14">休假类型</span>
                    <p class="gray fr">{{ detail.approvals[0].vacationType | filterLeaveType }}</p>
                  </div>
                  <div class="green mt5">{{ detail.beginDateTime | cutMinute}} 至 {{ detail.endDateTime | cutMinute }}
                  </div>
                </div>
                <div class="box-white px-tb" v-for="day in days" v-if="!detail.beginDateTime && !detail.endDateTime">
                  <h3 class="time-title">{{ fmtDate(day, 'yyyy/MM/dd') }}</h3>
                  <ul class="box-gray list-box" v-for="approval in detail.approvals">
                    <li class="px-b" v-if="approval.regularBeginTime">岗位<span>{{ approval.postShortName }}</span></li>
                    <li class="px-b" v-if="approval.regularBeginTime">班次<span>{{ approval.shift }} {{ fmtDate(approval.regularBeginTime, 'hh:mm') }}-{{ fmtDate(approval.regularEndTime, 'hh:mm') }}</span>
                    </li>
                    <li class="px-b">休假类型<span>{{ approval.vacationType | filterLeaveType }}</span></li>
                    <li>
                      时间<span>{{ fmtDate(approval.beginTime, 'hh:mm') }} - {{ fmtDate(approval.endTime, 'hh:mm') }}</span>
                    </li>
                  </ul>
                </div>
                <div class="box-white px-tb" v-if="detail.remark">
                  <h3 class="remark-title px-b">休假说明</h3>
                  <p class="gray">{{ detail.remark }}</p>
                </div>
                <div class="box-white px-tb">
                  <ul class="process-list">
                    <li v-if="detail.state == 4" class="nostate">
                      <h3>{{ detail.name }}&nbsp;&nbsp;* {{ detail.job }}</h3>
                      <p class="process-state">{{ detail.updateTime }}
                        <span>撤销审批</span>
                      </p>
                    </li>
                    <li v-for="process in detail.process"
                        :class="process.state == 1 && detail.state != 4 ? '' : 'nostate'"
                        v-if="!(process.state == 1 && detail.state == 4)">
                      <h3>{{ process.name }}&nbsp;&nbsp;* {{ process.job }}</h3>
                      <p class="process-state">{{ process.date }}
                        <span>
                          <i :class="process.state == 1 ? 'iconfont icon-approvaled' : ''"></i>
                          <i :class="process.state == 2 ? 'iconfont icon-passed' : ''"></i>
                          <i :class="process.state == 3 ? 'iconfont icon-failed' : ''"></i>
                          <i :class="process.state == 4 ? 'iconfont icon-revoked' : ''"></i>
                          {{ switchState(process.state) }}
                        </span>
                      </p>
                      <p v-if="process.remark" class="process-remark px-t">{{ process.remark }}</p>
                    </li>
                    <li :class="detail.process.length == 0 ? '' : 'nostate'">
                      <h3>{{ detail.name }}&nbsp;&nbsp;* {{ detail.job }}</h3>
                      <p class="process-state">{{ detail.datetime }}
                        <span>发起审批</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="detail.state == 1">
                <div class="box-white repeal-btn px-tb" @click="open()">撤销申请</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import Model from '../../components/model.vue'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          title: '休假详情'
        },
        detail: {},
        days: [],
        pageLoading: false,
        networkError: false,
        model: {
          state: false,
          title: '',
          content: ''
        },
        modelMutils: null,
        fmtDate (dateString, format) {
          if (dateString) {
            return this.$appConfig.fmtDate(dateString, format)
          } else {
            return null
          }
        },
        switchState (state) {
          let stateName = ''
          switch (state) {
            case 1:
            case '1': stateName = '审批中'
              break
            case 2:
            case '2': stateName = '审批通过'
              break
            case 3:
            case '3': stateName = '审批不通过'
              break
            case 4:
            case '4': stateName = '已撤销'
              break
            default:
              break
          }
          return stateName
        }
      }
    },
    components: {
      HeaderBar,
      Model
    },
    created () {
      this.$axios.get(this.$appConfig.api.getLeaveRecord, {
        params: {
          'mobile': this.$store.state.userInfo.mobile,
          'id': this.$route.query.id
        }
      }).then((res) => {
        this.pageLoading = true
        if (res.status === 'fail') {
          this.networkError = true
          this.$toast(res.errorMessage)
        } else {
          this.detail = res
          this.detail.process.reverse()
          let dayLen = this.detail.approvals.length
          for (let i = 0; i < dayLen; i++) {
            let day = this.detail.approvals[i].onDutyDay
            if (this.days.length !== 0) {
              let hasDay = this.days.some(function (item, index, arr) {
                if (item === day) return true
              })
              if (!hasDay) this.days.push(day)
            } else {
              this.days.push(day)
            }
          }
        }
      })
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          name: 'leaveList',
          params: {
            refresh: false,
            holidayTypeCode: this.$route.params.holidayTypeCode
          }
        })
      },
      repealLeave () {
        this.$axios.post(this.$appConfig.api.repealLeave, {
          id: this.$route.query.id
        }).then((res) => {
          if (res.status === 'success') {
            this.$toast({
              msg: '撤销成功',
              type: 'succes',
              time: 2000
            })
            setTimeout(() => {
              this.$router.push({
                name: 'leaveList',
                params: {
                  refresh: false,
                  holidayTypeCode: this.$route.params.holidayTypeCode
                }
              })
            }, 2000)
          }
        })
      },
      open (id) {
        this.model = {
          state: true,
          content: '是否确定撤销该休假申请？',
          noTitle: true
        }
        this.modelMutils = id
      },
      onConfirm () {
        this.model.state = false
        this.repealLeave()
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';

  .flex-start {
    .state {
      text-align: right;
      margin: .5em 0 -.5em;
      color: $primaryBg;
      &.fail {
        color: $warnBg;
      }
    }
    .repeal-btn {
      color: $primaryBg;
      font-size: 120%;
      text-align: center;
      cursor: pointer;
    }
  }

  .sec-detail {
    width: 100%;
    height: 100%;
  }

  .box-white {
    background-color: white;
    padding: rem($inner-width) rem($inner-width);
    margin: rem(20px) 0;
  }

  .box-gray {
    background: $defaultDisabledBg;
    border-radius: .3em;
    margin-top: 1em;
    &:first-child {
      margin-top: 0;
    }
  }

  .time-title,
  .remark-title {
    font-size: 110%;
    font-weight: normal;
    margin: 0;
  }

  .time-title {
    color: $primaryBg;
    margin-bottom: .5em;
  }

  .remark-title {
    padding-bottom: .5em;
  }

  .remark-title + p {
    padding-top: .5em;
  }

  .list-box {
    box-sizing: border-box;
    padding: .2em .8em;
    li {
      line-height: 2.8;
      span {
        float: right;
        color: #999;
      }
    }
  }

  .process-list {
    border-left: 1px solid $border-color;
    margin-left: 1em;
    li {
      margin-top: 2em;
      h3 {
        line-height: 1.2;
        font-weight: normal;
        margin: 0;
        &::before {
          display: inline-block;
          content: '';
          width: 1.3em;
          height: 1.3em;
          border-radius: 50%;
          background: $primaryBg;
          background-image: radial-gradient(circle, transparent, transparent 35%, hsla(0, 0%, 100%, .82) 0);
          transform: translateX(-50%) translateY(-10%);
          vertical-align: middle;
        }
      }
      p {
        font-size: 90%;
        margin-left: 1.5em;
      }
      .process-state {
        line-height: 2.4;
        height: 30px;
        color: $primaryBg;
        span {
          float: right;
        }
      }
      .process-remark {
        padding-top: .5em;
      }
      &:first-child {
        margin-top: .2em;
      }
      &.nostate {
        color: #BCBCBC;
        h3::before {
          color: inherit;
          background: currentColor;
          background-image: radial-gradient(circle, transparent, transparent 35%, hsla(0, 0%, 100%, .82) 0);
        }
        .process-state {
          color: inherit;
        }
      }
    }
  }
</style>
