<template>
  <ul class="twotabs">
    <li class="twotabs-btn left-btn" :class="active === 'left' ? 'active' : ''" @click="leftTabClick">{{ leftBtn.text }}</li>
    <li class="twotabs-btn right-btn" :class="active === 'right' ? 'active' : ''" @click="rightTabClick">{{ rightBtn.text }}</li>
  </ul>
</template>
<script>
  export default {
    props: {
      leftBtn: {
        type: Object,
        default () {
          return {
            text: ''
          }
        }
      },
      rightBtn: {
        type: Object,
        default () {
          return {
            text: ''
          }
        }
      }
    },
    data () {
      return {
        active: 'left'
      }
    },
    methods: {
      leftTabClick () {
        this.active = 'left'
        this.$emit('leftTabClick')
      },
      rightTabClick () {
        this.active = 'right'
        this.$emit('rightTabClick')
      }
    }
  }
</script>