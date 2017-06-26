<template>
  <div class="inner-panel">
    <button class="ev-btn ev-btn--defualt">
      btn-defualt
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--defualt disabled">btn-defualt disabled</a>
    <button class="ev-btn ev-btn--warn">
      ev-btn--warn
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--warn disabled">ev-btn--warn disabled</a>
    <div class="flexbox">
      <div class="flex">
        <div class="inner">
          <span class="ev-btn ev-btn--primary">确认</span>
        </div>
      </div>
      <div class="flex">
        <div class="inner">
          <span class="ev-btn ev-btn--primary disabled">取消</span>
        </div>
      </div>
    </div>
    <button class="ev-btn ev-btn--primary ev-btn-small">
      btn-defualt
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--warn ev-btn-small disabled">btn-defualt disabled</a>

    <button class="ev-btn ev-btn--primary">
      ev-btn--primary
    </button>
    <a href="javascript:;" class="ev-btn ev-btn-plain--warn">ev-btn-plain--warn</a>
    <a href="javascript:;" class="ev-btn ev-btn-plain--primary">ev-btn-plain--primary</a>
  </div>
</template>
<style lang="scss" scoped>
  .inner-panel .ev-btn {
    margin-bottom: 15px;
  }
</style>
