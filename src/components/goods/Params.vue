<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

      
    <el-card>
      <!-- 卡片视图区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon :closable='false'> </el-alert>
        <el-row class="cat_opt">
            <el-col>
              <span>选择商品分类：</span>
              <el-cascader :options="catelist" :props='cateProps' expand-trigger="hover"
               v-model="selectedCateKeys" @change="handleChange"></el-cascader>
            </el-col>
        </el-row>

      <!-- tab区域  -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" round size="mini" :disabled="isBtnDisabled"
          @click="addDialogp">添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table :data="manyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag type="warning" v-for="(itme, i) in scope.row.attr_vals"
                  :key="i" closable @close="handleClose(i, scope.row)">{{itme}}</el-tag>
                  <!-- 动态输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBtn(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditBtn(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>         
            </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" round size="mini" :disabled="isBtnDisabled"
          @click="addDialogp">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag type="warning" v-for="(itme, i) in scope.row.attr_vals"
                  :key="i" closable @close="handleClose(i, scope.row)">{{itme}}</el-tag>
                  <!-- 动态输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBtn(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditBtn(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>         
            </el-table>
        </el-tab-pane>
      </el-tabs>
      
    </el-card>
    <!-- 弹出添加对话框 -->
    <el-dialog
      :title="'添加' + titleTest "
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">

      <el-form :model="addForm" :rules="addFormRules"
       ref="addFormRef" label-width="100px">
        <el-form-item :label="titleTest" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑属性 -->
    <el-dialog
      :title="'编辑' + titleTest "
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">

      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item :label="titleTest" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      // 商品分类列表
      catelist:[],
      // 商品分类列表配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys:[],
      // tab区域选中
      activeName: 'many',
      // tab数据存储
      manyTableData:[],
      onlyTableData:[],
      // 控制添加弹出对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数表单的数据对象
      addForm:{
        attr_name:''
      },
      // 添加表单的校验规则
      addFormRules:{
        attr_name: [{required: true, message:'请输入参数名称', 
        trigger:'blur'}]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改表单的数据对象
      editForm: {
        attr_name:''
      },
      // 修改表单的校验规则
      editFormRules: {
          attr_name: [{required: true, message:'请输入参数名称', 
        trigger:'blur'}]
      },

    }
  },

  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const{data:res} = await this.$http.get('categories') 
      if(res.meta.status !== 200){
        return this.$message.error('获取商品列表失败')
      }
      this.catelist = res.data
    },
    // 级联选择框中项变化，会出发这个change事件
    handleChange() {
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }      
      this.getParamsData()
      
    },
    // tab组件
    handleTabClick() {
      this.getParamsData()
      
    },
    // 获取参数列表数据
    async getParamsData() {
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return
      }
      console.log(this.selectedCateKeys[2]);
      
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
      {params: {sel:this.activeName}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        
        res.data.forEach(itme =>{
          itme.attr_vals = itme.attr_vals ? itme.attr_vals.split(' ') : []
          itme.inputVisible = false
          itme.inputValue = ''
        })
        console.log(res.data);
        
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }
        
    },
    addDialogp() {
      this.addDialogVisible = true
      console.log(this.activeName);
      
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      // 通过验证规则后发生添加请求.

      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
        
      })
    },
    // 控制显示与隐藏
    async showEditBtn(attr_id) {
      
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
      {params: {attr_sel: this.activeName}})
      if(res.meta.status !== 200){
        return this.$message.error('获取参数失败')
      }
      
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击发送修改事件
    editParams() {
      this.$refs.editFormRef.validate(async valid =>{
        if (!valid) return
        const{data:res} = await this.$http.put(`categories/${this.cateId}
        /attributes/${this.editForm.attr_id}`,
        {attr_name: this.editForm.attr_name, attr_sel:this.activeName})
        console.log(this.activeName);
        
         console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }

        this.$message.success('获取参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
      
    },
    // 删除商品分类属性
    async deleteEditBtn(attr_id) {
      const isDelete = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (isDelete === 'cancel') {
          return this.$message.info('用户取消了删除')
        }
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.info('删除参数失败')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()   
    },
    // 文本框失去焦点，或按下了enter键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 将用户添加的内容添加到数组
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)

    },
    // 显示文本框
    showInput(row) {
      row.inputVisible = true
      // $nextTick 方法的作用，就是当页面上的元素被重新渲染好了之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveAttrVals(row) {
      // 发起请求，保存用户的这个操作
      const {data:res} = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        console.log(res);
        
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数项失败')
        }
        this.$message.success('修改参数项成功')
    },
    // 删除对应参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  

  },
  computed: {
    // 如果按钮需要被禁用返回true否则false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取选中三级链表的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleTest() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt{
  margin-top: 20px;
}
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 120px;
}

</style>
