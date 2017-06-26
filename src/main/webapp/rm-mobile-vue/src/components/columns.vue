<template>
  <div class="columns">
      <div v-if="avatar || name || belong" class="column column-left" :style="options.avatar && options.avatar.display ? 'flex: 2.2;' : 'flex: 1'">
        <div v-if="options.avatar && options.avatar.display" class="avatar" :style="face(avatar)"></div>
        <div v-if="name" :class="options.name && options.name.class ? options.name.class : 'item'">{{ options.name && options.name.ellipsis ? ellipsis(name, options.name.ellipsis) : ellipsis(name, 5) }}</div>
        <div v-if="belong" :class="options.belong && options.belong.class ? options.belong.class : 'item-sub'">{{ options.belong && options.belong.ellipsis ? ellipsis(belong, options.belong.ellipsis) : ellipsis(belong, 6) }}</div>
      </div>
      <div v-if="attendance || jobName" class="column column-mid">
        <div v-if="attendance" :class="options.attendance && options.attendance.class ? options.attendance.class : 'item'">{{ options.attendance && options.attendance.ellipsis ? ellipsis(attendance, options.attendance.ellipsis) : attendance }}</div>
        <div v-if="jobName" :class="options.jobName && options.jobName.class ? options.jobName.class : 'item-sub'">{{ options.jobName && options.jobName.ellipsis ? ellipsis(jobName, options.jobName.ellipsis) : jobName }}</div>
      </div>
      <div v-if="affair || state" class="column column-right">
        <div v-if="affair" :class="options.affair && options.affair.class ? options.affair.class : 'item'">{{ options.affair && options.affair.ellipsis ? ellipsis(affair, options.affair.ellipsis) : affair }}</div>
        <div v-if="state" :class="options.state && options.state.class ? options.state.class : 'item-sub'">{{ options.state && options.state.ellipsis ? ellipsis(state, options.state.ellipsis) : state }}</div>
      </div>
  </div>
</template>
<script>
  export default {
    props: {
      options: {
        type: Object,
        default () {
          return {
            avatar: {
              display: false,
              ellipsis: 0
            },
            name: {
              class: '',
              ellipsis: 0
            },
            belong: {
              class: '',
              ellipsis: 0
            },
            attendance: {
              class: '',
              ellipsis: 0
            },
            jobName: {
              class: '',
              ellipsis: 0
            },
            affair: {
              class: '',
              ellipsis: 0
            },
            state: {
              class: '',
              ellipsis: 0
            }
          }
        }
      },
      avatar: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      belong: {
        type: String,
        default: ''
      },
      attendance: {
        type: String,
        default: ''
      },
      jobName: {
        type: String,
        default: ''
      },
      affair: {
        type: String,
        default: ''
      },
      state: {
        type: String,
        default: ''
      }
    },
    methods: {
      ellipsis (string, limit) {
        if (string && string.length > limit) {
          return string.substring(0, limit) + '...'
        } else {
          return string
        }
      },
      face (url) {
        if (url) {
          return 'background-image: url(' + url + ')'
        } else {
          return null
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/Common/_variables';
  .columns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: rem(30px);
    .column-left {
      text-align: left;
      flex: 1.8;
    }
    .column-mid {
      flex: 1.8;
    }
    .column-right {
      flex: 1;
      text-align: right;
    }
    .item {
      font-size: 13px;
    }
    .item-sub {
      font-size: 12px;
      color: $gray-light;
    }
  }
</style>