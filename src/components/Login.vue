<template>
  <div class="login_contaniner">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/images/Konachan_01_04.gif" alt="logo">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginformRef" class="login_form" :model="formdata" :rules="loginfromRules" label-width="0px">
          <!-- 登录 -->
        <el-form-item prop="username">
          <el-input v-model="formdata.username" prefix-icon="iconfont icon-yonghu2"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="formdata.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>  
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      formdata: {
        username:'admin',
        password:'123456'
      },
      // 用户校验
      loginfromRules: {
        username:[
           { required: true, message: '请输入用户名称', trigger: 'blur' },
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入用户密码', trigger: 'blur' },
           { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }          
        ]
      }
    }
  },
  methods:{
    // 登录重置
    resetLoginForm() {
      this.$refs.loginformRef.resetFields()
      
    },
    login(){
      this.$refs.loginformRef.validate((valid)=>{
        console.log(valid);
        
      })
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.login_contaniner{
  background-color: #5e6875;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      background-color: #fff;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #dddddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
