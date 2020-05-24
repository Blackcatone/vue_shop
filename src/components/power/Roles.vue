<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 一级权限 -->
                <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                    <el-col :span="5">
                        <el-tag closable>{{ item1.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                      <!-- 二级权限 -->
                      <el-row :class="[i2 === 0 ? '' :'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                        <el-col :span="6">                       
                        <el-tag type="success" closable>{{ item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                        </el-col>
                      <!-- 三级权限 -->
                      <el-col :span="18">
                        <el-tag type="warning" closable @close="removRightsById(scope.row, item3.id)" v-for="(item3) in item2.children" :key="item3.id">{{ item3.authName}}</el-tag>                
                      </el-col>

                      </el-row>                     
                    </el-col>
                    <el-col :span="9"></el-col>                   
                </el-row>
                
            </template>

        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="children" width="285px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="openDelete(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        width="50%"
        @close="addRolesDialogVisibleClose"
      >
        <el-form
          :model="addRolesForm"
          :rules="addRolesFormRules"
          ref="addRolesFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

        <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRolesDialogVisible"
        width="50%"
      >
        <el-form
          :model="editRolesForm"
          :rules="editRolesFormRules"
          ref="editRolesFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="SetRightDialogVisible"
          width="50%" @close="SetRightDialogClose">
        <!-- tree型控件 -->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" 
        default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>


          <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>

    </el-card>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
        // 所有角色列表数据
        rolelist:[],
        // 控制对话框显示与隐藏
        addRolesDialogVisible: false,
        // 控制分配权限对话框的显示与隐藏
        SetRightDialogVisible: false,
        // 所有权限的数据
        rightslist: [],
        // 树形控件的属性绑定对象
        treeProps:{
          label: 'authName',
          children: 'children'
        },
        // 默认选中节点id值数组
        defkeys: [],
        // 当前即将分配权限的id
        roleId: '',
        // 添加角色数据
        addRolesForm:{
            roleName: '',
            roleDesc: ''
        },
        // 修改角色数据
        editRolesForm:{},
        editRolesDialogVisible: false,
        // 添加角色规则
        addRolesFormRules: {
            roleName:[
                { required: true, message: '角色名称不能为空'}
            ]
        },
        editRolesFormRules: {
            roleName:[
                { required: true, message: '角色名称不能为空'}
            ]   
        }
    }
  },
  created() {
      this.getRolesList()
  },
  methods: {
      // 发起获取角色列表请求
      async getRolesList() {
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status == !200) {
            this.$message.error('获取角色列表失败')
        }
        this.rolelist = res.data       
      },
      // 添加角色
        addRoles() {
            // 校验角色规则
            this.$refs.addRolesFormRef.validate(async valid=>{
            if(!valid) return
            // 发起添加角色请求
            const {data:res} = await this.$http.post('roles', this.addRolesForm)
            if(res.meta.status !== 200) {
                this.$message.error('添加角色失败')
            }
            this.$message.success('添加角色成功')
            this.addRolesDialogVisible = false
            this.getRolesList()            

            })

           
        },
      // 监听用户关闭事件
        addRolesDialogVisibleClose() {           
            this.$refs.addRolesFormRef.resetFields()
      },
      // 获取编辑角色数据
      async showEditRoles(id){
        const {data:res} = await this.$http.get('roles/' + id)
        if(res.meta.status == !200){
            this.$message.error(res.meta.msg)
        }
        this.editRolesForm = res.data
        this.editRolesDialogVisible = true              
      },
      // 编辑角色信息
       editRolesInfo() {
           this.$refs.editRolesFormRef.validate(async valid=>{
            if (!valid) return
            const {data:res} = await this.$http.put(
                'roles/' + this.editRolesForm.roleId,
                {
                    roleName: this.editRolesForm.roleName,
                    roleDesc: this.editRolesForm.roleDesc
                }
            )
            if(res.meta.status == !200){
            this.$message.error('更新角色信息失败')
            }                                       
                this.editRolesDialogVisible = false
                this.getRolesList()
                this.$message.success('更新角色信息成功')
        })
      },
      // 删除角色
      async openDelete(id) {
            const delRole = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch( error => error)

                if(delRole !== 'confirm'){
                   return this.$message.error('删除角色失败')
                }
            const {data:res} = await this.$http.delete('roles/' + id)           
                if(res.meta.status == !200) {
                    this.$message.error(res.meta.msg)
                }
                this.getRolesList()
                
      },
      // 根据id删除对应用户权限
      async removRightsById(role, rightId) {

        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        if(confirmResult !== 'confirm'){
          return this.$message.info("取消了删除")
        }

        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除权限失败')
        }
        // 直接赋值给children属性，防止页面刷新，提升用户体验
        role.children = res.data
      },
      // 获取所有权限功能树形列表
      async showSetRightDialog(role) {
        this.roleId = role.id
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200){
          return this.$message.error('请求权限数据失败')
        }
        this.rightslist = res.data
        // 递归获取三级权限的id
        this.getLeafkeys(role, this.defkeys)

        this.SetRightDialogVisible = true
      },
      // 通过递归获取角色权限下的所有三级权限的id，并保存到defkeys里
      getLeafkeys(node, arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(itme => {
          this.getLeafkeys(itme, arr)
        });
      },
      // 监听分配权限对话框的关闭事件
      SetRightDialogClose() {
        this.defkeys = []
      },
      // 点击为角色分配权限
      async allotRights() {
        const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()          
        ]
        const idStr = keys.join(',')
      
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if(res.meta.status !== 200){
          return  this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.SetRightDialogVisible = false
      }          
  }
}
</script>

<style lang="scss" scoped>

.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>