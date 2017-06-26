<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <two-tabs :active="twotabs.active" :leftBtn="twotabs.leftBtn" :rightBtn="twotabs.rightBtn" @leftTabClick="leftTabClick" @rightTabClick="rightTabClick"></two-tabs>
      <ul class="list mt0 late-ranking" v-if="!networkError">
        <li v-for="each in listData">
          <columns :options="columnConfig" :avatar="each.avatar" :name="each.name" :belong="each.department" :jobName="each.jobName" :affair="each.duration" :state="each.count"></columns>
        </li>
      </ul>
      <p class="note">按累计迟到分钟数排序，显示全部人员</p>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import TwoTabs from '../../components/twoTabs.vue'
  import Columns from '../../components/columns.vue'
  export default {
    data () {
      return {
        headerBar: {
          title: '迟到榜',
          leftBtn: {
            text: '返回'
          }
        },
        twotabs: {
          active: 'left',
          leftBtn: {
            text: '本月'
          },
          rightBtn: {
            text: '本季'
          }
        },
        columnConfig: {
          avatar: {
            display: true
          },
          jobName: {
            class: 'item',
            ellipsis: 6
          }
        },
        listData: [],
        networkError: false
      }
    },
    created () {
      let list = [
        {
          employeeId: 1,
          name: '小小元',
          avatar: 'http://b.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=f0c5c08030d3d539c16807c70fb7c566/8ad4b31c8701a18bbef9f231982f07082838feba.jpg',
          department: '松山湖1号花园',
          jobName: '业务支持系统负责人',
          duration: 200,
          count: 10
        },
        {
          employeeId: 2,
          name: '臧三',
          avatar: 'http://b.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=f0c5c08030d3d539c16807c70fb7c566/8ad4b31c8701a18bbef9f231982f07082838feba.jpg',
          department: '松山湖1号花园',
          jobName: '业务支持系统负责人',
          duration: 180,
          count: 12
        },
        {
          employeeId: 3,
          name: '新疆的长名字家伙',
          avatar: '',
          department: '乌鲁木齐金域花园',
          jobName: '业务支持系统负责人',
          duration: 165,
          count: 11
        }
      ]
      this.queryData = {
        'employeeId': this.$store.state.userInfo.id,
        'period': 0
      }
      this.listData = list.map(function (item, index, arr) {
        item.duration = item.duration + '分钟'
        item.count = item.count + '次'
        return item
      })
      this.search()
    },
    components: {
      HeaderBar,
      TwoTabs,
      Columns
    },
    methods: {
      leftBtnClick () {
        if (this.$route.params.name) {
          this.$router.push({
            name: this.$route.params.name,
            params: this.$route.params
          })
        }
      },
      leftTabClick () {
        this.queryData.period = 0
        this.search()
      },
      rightTabClick () {
        this.queryData.period = 1
        this.search()
      },
      search () {
        // setTimeout(() => {
        //   this.$axios.get(this.$appConfig.api.lateRanking, {
        //     params: this.queryData
        //   })
        //   .then((res) => {
        //     if (res.data) {
        //       this.listData = res.data.map(function (item, index, arr) {
        //         item.duration = '迟到' + item.duration + '分钟'
        //         return item
        //       })
        //     }
        //   })
        // }, 200)
      }
    }
  }
</script>