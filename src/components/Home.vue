<template>
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <img src="../assets/images/logo.png" alt="logo">
        <span>商城后台管理系统</span>
        <el-button type="info" @click="loginout">退出</el-button>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse ? '64px' : '200px' ">
          <div class="toggle-button" @click="togglecollapse"><i class="el-icon-s-grid"></i></div>
      <el-menu
      default-active="2"
      background-color="rgb(51,55,68)"
      text-color="#fff"
      active-text-color="#26bbe9"
      unique-opened 
      :collapse-transition="false" 
      :collapse="iscollapse"
      router
      :default-active="activePath"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconobj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
      <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path" 
        v-for="subitem in item.children" 
        :key="subitem.id"
        @click="saveNavState('/' + subitem.path)">
          <template slot="title">
            <i class="el-icon-copy-document"></i>
            <span>{{ subitem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 右侧主体内容区域 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
 
</template>

<script type="text/javascript">
export default {
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 列表功能存储
      menuList: [],
      // 饿了么图标替换
      iconobj: {
        '125':'el-icon-user-solid',
        '103':'el-icon-s-tools',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-claim',
        '145':'el-icon-s-data'       
      },
      // 是否折叠
      iscollapse: false,
      // 保存链接
      activePath: '',
    }
  },
  methods:{
    loginout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取功能列表
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')       
      if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg)
      this.menuList = res.data      
    },
    // 折叠侧边栏功能
    togglecollapse(){
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活码
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.home_container{
  height: 100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(102,102,102);
  color: #ffffff;
  font-size: 20px;


  img{
    width: 70px;
    height: 70px;
  }
  

}
.el-aside{
  background-color: rgb(51,55,68);
  
  .el-menu{
    border-right: none;
  }

}
.el-main{
  background-color: #eaeaea;

}
.toggle-button{
  background-color: #4a5064;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
</style>
