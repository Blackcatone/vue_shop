<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>      
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="romoveUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-s-operation" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
         label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.number="addForm.mobile"></el-input>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
        @click="editDialogClosed">

      <el-form :model="editForm" 
      :rules="editFormRules"
      ref="editFormRef" 
      label-width="70px">

        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        close="setRoleDialogClose">
        <div>
          <p>当前的用户: {{userInfo.username}}</p>
          <p>当前的角色: {{userInfo.role_name}}</p>
          <p>分配新角色: 
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option
              v-for="item in Rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {

      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 是否显示用户对话框
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名在3~10个字符之间', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '密码在6~15个字符之间', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur'}
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur' }
        ]        
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询的用户信息对象
      editForm: {},
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的信息
      userInfo:{},
      // 所有角色的数据列表
      Rolelist: [],
      // 已选中的角色id
      selectRole: '',

    };
  },

  created() {
    this.getUserList();
    
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关状态的改变
    async userStateChanged(userinfo) {     
        const{ data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status !== 200){
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮确定添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid=>{
      if(!valid) return
      // 发起添加用户的请求
      const{data:res} = await this.$http.post('users', this.addForm)
          
      if(res.meta.status !== 201) {
        this.$message.error('添加用户失败')
      }

      this.$message.success('添加用户成功')
      this.addDialogVisible = false
      this.getUserList()
      })
    },
    // 修改用户信息
    async showEditDialog(id) {   
      console.log(id);
         
      const{data:res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200){
        this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      console.log(res);
      
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        // 发起修改用户信息的数据请求
        const{data:res} = await this.$http.put('users/' + this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status == !200) {
          return this.$message.error('更新用户信息失败')          
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
        
      })
    },
    // 根据id删除对应用户的信息
    async romoveUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
        
    // 发起用户删除请求
    const{data:res} = await this.$http.delete('users/' + id)
      if(res.meta.status == !200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo

      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        this.$message.error('获取角色失败')
      }
      this.Rolelist = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配权限
    async saveRoleInfo() {
      if(!this.selectRole){
        return this.$message.error('请选择要分配的角色')
      }

      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRole
      })
      if(res.meta.status !== 200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClose() {
      this.selectRole = ''
      this.userInfo = ''
    }
    
  }
};
</script>

<style lang="scss" scoped>

</style>
