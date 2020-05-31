<template>
  <div class="app">
      <el-button type="success" @click="test">点击</el-button>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {

    }
  },
  methods: {
      test: function() {
      let a = 1
      return function() {
        a++
        console.log(a);
        
      }
      // 函数返回了上面这个匿名函数后test函数已经弹出执行上下文栈(销毁),但是因为返回的匿名函数的作用域链里面有变量a一直没被销毁
    }()

  }
}
</script>

<style lang="scss" scoped>
</style>
