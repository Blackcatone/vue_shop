<template>
  <div class="home">
    <el-button type="info" @click="loginout">退出</el-button>
    
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {

    }
  },
  methods:{
    loginout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  components: {

  }
}
</script>

<style lang="stylus" scoped>
</style>
