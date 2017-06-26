<template>
  <div>
    <header-bar :title="headerBar.title" :leftBtn="headerBar.leftBtn" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <ul class="list mt0" v-if="listData">
        <li v-for="item in listData.manager">
          <columns :options="columnConfig" :name="item.name" :belong="item.department" :jobName="item.jobName" :state="item.date"></columns>
        </li>
      </ul>
      <ul class="list mt0" v-if="listData">
        <li v-for="item in listData.place">
          <columns :options="columnConfig" :name="item.name" :belong="item.department" :jobName="item.jobName" :state="item.date"></columns>
        </li>
      </ul>
      <ul class="list mt0" v-if="listData">
        <li v-for="item in listData.order">
          <columns :options="columnConfig" :name="item.name" :belong="item.department" :jobName="item.jobName" :state="item.date"></columns>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '../../components/header.vue'
  import Columns from '../../components/columns.vue'
  export default {
    data () {
      return {
        headerBar: {
          title: '',
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '未排班详情'
          }
        },
        columnConfig: {
          avatar: {
            display: false
          },
          jobName: {
            class: 'item'
          },
          state: {
            class: 'item'
          }
        },
        listData: {}
      }
    },
    created () {
      this.params = this.$route.params
      this.listData = this.params.unarranged
    },
    components: {
      HeaderBar,
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
      }
    }
  }
</script>