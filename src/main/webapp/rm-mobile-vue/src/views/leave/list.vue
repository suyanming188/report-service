<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content" v-scroll-record>
      <ul class="list list-full mt0">
        <router-link tag="li" v-for="item in listData" class="list-item list-item-touch-active list-angle-right"
                     :to="{name: 'leaveRecord', query: {id: item.id}, params: {holidayTypeCode: holidayTypeCode}}">
          <div class="list-item-inner ">
            <div class="flex">
              <div class="f16" v-for="vacationType in removeRepetition(item.appHolidayDateTimeDTOs)">
                {{ vacationType | filterLeaveType }}
              </div>
              <p class="gray mt5 f14">{{ fmtDate(item.beginDate, 'yyyy/MM/dd') }}-{{ fmtDate(item.endDate, 'yyyy/MM/dd')
            }}</p>
            </div>
            <div style="padding-right: 30px">
              <span :class="{'red': item.state == '3'}">{{ switchState(item.state) }}</span>
            </div>
          </div>
        </router-link>
      </ul>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="spiral">
          <span slot="no-results">
            暂无请假记录
          </span>
          <span slot="no-more">
            暂无更多
          </span>
      </infinite-loading>
    </div>
    <ul v-show="isShowCheckBox" class="checkbox">
      <li class="px-t" v-for="(item, index) in leaveType"><input type="checkbox" :value="item.id" name="leavetType"
                                                                 :id="'type' + index" v-model="holidayTypeCode"><label
        :for="'type' + index">{{ item.name }}</label></li>
    </ul>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import * as utils from '../../utils/util'
  import InfiniteLoading from 'vue-infinite-loading'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '筛选'
          },
          title: '我的休假'
        },
        listData: [],
        leaveType: [],
        queryData: {},
        showMore: false,
        isShowCheckBox: false,
        holidayTypeCode: [],
        fmtDate (dateString, format) {
          return this.$appConfig.fmtDate(new Date(dateString), format)
        },
        switchState (state) {
          let stateName = ''
          switch (state) {
            case 1: stateName = '审批中'
              break
            case 2: stateName = '审批通过'
              break
            case 3: stateName = '审批不通过'
              break
            case 4: stateName = '已撤销'
              break
            default:
              break
          }
          return stateName
        },
        removeRepetition (dtos) {
          let leaves = []
          let newLeaves = []
          dtos.forEach(function (leave) {
            leaves.push(leave.vacationType)
          })
          for (let i = 0; i < leaves.length; i++) {
            if (newLeaves.indexOf(leaves[i]) < 0) {
              newLeaves.push(leaves[i])
            }
          }
          return newLeaves
        }
      }
    },
    components: {
      HeaderBar,
      InfiniteLoading
    },
    created () {
      this.userInfo = this.$store.state.userInfo
      this.pageCount = 10
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          path: '/leave/'
        })
      },
      rightBtnClick () {
        this.showCheckBox()
      },
      showCheckBox () {
        if (!this.isShowCheckBox) {
          this.headerBar.rightBtn.text = '确定'
          this.leaveType = utils.leaveType()
          this.isShowCheckBox = true
        } else {
          this.headerBar.rightBtn.text = '筛选'
          this.isShowCheckBox = false
          this.listData = []
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          this.onInfinite()
        }
      },
      onInfinite () {
        if (this.$route.params.refresh === false) {
          this.holidayTypeCode = this.$route.params.holidayTypeCode
          this.$route.params.refresh = true
        }
        setTimeout(() => {
          this.queryData = {
            'mobile': this.$store.state.userInfo.mobile,
            'start': this.listData.length,
            'length': this.pageCount,
            'holidayTypeCode': this.holidayTypeCode.join()
          }
          this.$axios.get(this.$appConfig.api.getLeaveList, {
            params: this.queryData
          })
          .then((res) => {
            if (this.listData.length < res.pageCount) {
              this.listData = this.listData.concat(res.appHolidayCheckDTOs)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              if (this.listData.length / 10 === 10) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          })
        }, 200)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  .checkbox {
    position: fixed;
    top: 1.3rem;
    bottom: 20%;
    overflow-y: scroll;
    right: 0;
    background: #666;
    padding: .5em .8em;
    border-radius: 2px;
    color: white;
    line-height: 2.5;
    font-size: 100%;
    text-align: right;
    z-index: 10;
    li {
      &:first-child {
        border-top: none;
      }
      label::after {
        font-family: "iconfont" !important;
        content: "\e65a";
        width: 1em;
        margin-left: .5em;
        opacity: 0;
      }
      [type=checkbox] {
        position: absolute;
        clip: rect(0, 0, 0, 0);
        &:checked + label::after {
          opacity: 1;
        }
      }
    }
  }

  @media screen and (-webkit-min-device-pixel-ratio: 2) {
    .checkbox li:first-child {
      background-image: none;
    }
  }
</style>
