<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>               
            </el-col>

        </el-row>
       <!-- 表格  -->
    <tree-table :data="catelist" show-index index-text="#" :columns="columns" 
    :selection-type='false' :expand-type='false' border class="treeTable">
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
        <i class="el-icon-error" v-else style="color: red"></i>
      </template>

      <template slot="order" slot-scope="scope">
        <el-tag size="min" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>

      <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger " icon="el-icon-delete" size="mini">删除</el-button>
      </template>

    </tree-table>


       <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 8, 10]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    </el-card>
        <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addCateDialogClose">
      <!-- 分类名称 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" 
        ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
              <el-cascader expand-trigger="hover"
              v-model="selectedkeys"
              :options="ParentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select>
              </el-cascader>
          </el-form-item>          
        </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    

  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      // 商品分类数据请求参数
      querInfo:{
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的默认数据列表，默认空
      catelist:[],
      // 总数
      total: 0,
      // 为table指定列定义
      columns:[
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
        ],
        // 分类对话框
        addDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 需要添加分类的名字
          cat_name:'',
          // 父级分类的id
          cat_pid:0,
          // 分类的等级，默认一级
          cat_level:0
        },
        // 添加分类的表单校验规则
        addCateFormRules:{
          cat_name:[
            {required:true, message:'请输入分类名称',trogger:'blur'}
          ]
        },
        // 父级分类的数据对象
        ParentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps:{
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 获取点击分类id
        selectedkeys:[]
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    async getCatelist() {
      const {data:res} = await this.$http.get('categories', {params: this.querInfo})
      if(res.meta.status !== 200){
        return this.$message.error('请求商品分类失败')
      }
      // 获取分类lenth         
      this.total = res.data.total  
      // 获取分类列表数据
      this.catelist = res.data.result 
      

    },
    //  监听pagesize的改变
    handleSizeChange(newSize){
      this.querInfo.pagesize = newSize
      this.getCatelist()
    },
    // 监听peagnum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCatelist()
    },
    // 添加分类
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据
    async getParentCateList() {
      const {data:res} = await this.$http.get('categories', {params: {type:2}})
      if(res.meta.status !== 200){
        return this.$message.error('获取父级分类数据失败')
      }
      console.log(res);
      
      this.ParentCateList = res.data
    },
    // 选择项发生变化是触发
    parentCateChanged() {
      console.log(this.selectedkeys);
      if(this.selectedkeys.length > 0){
        this.addCateForm.cat_pid = this.selectedkeys[this.selectedkeys.length-1]
        this.addCateForm.cat_level = this.selectedkeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid =>{
        if(!valid) return
      const {data:res} = await this.$http.post('categories', 
      this.addCateForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCatelist()
        this.addDialogVisible = false

      })
      
    },
    // 监听对话框关闭事件，重置表单
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedkeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.treeTable{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
