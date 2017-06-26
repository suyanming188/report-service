<template>
  <div>
    <header-bar :title="headerBar.title" :closeWindow="headerBar.closeWindow"></header-bar>
    <div class="content">
      <ul class="list mt0" v-if="!networkError">
        <router-link tag="li" :to="{name: 'attendanceSummary'}"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            考勤汇总
          </div>
          </router-link>
      </ul>
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>网络错误，点击重新加载！
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  export default {
    data () {
      return {
        networkError: false,
        headerBar: {
          title: '移动考勤',
          closeWindow: true
        }
      }
    },
    created () {
    },
    components: {
      HeaderBar
    }
  }
</script>