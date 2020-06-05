<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
    
     <!-- 警告提示条 -->
      <el-alert
        title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>  
      
          <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px" label-position="top">
        <el-tabs tab-position='left' v-model="activeIndex" :before-leave="beforeTableave" @tab-click="tabCliked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item> 
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item> 
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange">      
                </el-cascader>
            </el-form-item>
               
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox :label="gd" border v-for="(gd, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>              
            </el-form-item>
            
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>        
            </el-form-item>
            
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handersuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" @click="add" class="addBtton">添加商品</el-button>
              
          </el-tab-pane>
        </el-tabs>
      </el-form>
        
      
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgDialogVisible"
      width="50%"
      center>
      <img :src="previePath" class="previeImg">
    </el-dialog>
 
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      activeIndex:'0',
      addForm:{
        goods_name:'',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]

      },
      // 添加商品的校验规则
      addFormRules:{
        goods_name:[
          {required:true,message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
          {required:true,message:'请输入商品价格',trigger:'blur'}
        ],
        goods_number:[
          {required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_weight:[
          {required:true,message:'请输入商品重量',trigger:'blur'}
        ],                
        children:[
          {required:true,message:'请输入商品分类',trigger:'blur'}
        ]
      },
      // 获取分类列表
      catelist:[],
      cateProps:{
        label:'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTabData:[],
      onlyTabData:[],
      // upload上传地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 设置上传图片的请求头
      headersObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览路径
      previePath:'',
      // 图片预览框的显示与隐藏
      imgDialogVisible:false,

    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.catelist =  res.data
      console.log(this.catelist);
      
    },
    // 级联选择器发送变化会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      
    },
    // 阻止切换
    beforeTableave(activeName, oldActiveName) {
      // console.log('即将离开的标签页'+oldActiveName);
      // console.log('即将进入的标签页'+activeName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 获取动态参数
    async tabCliked(){
      console.log(this.activeIndex);
      
      if (this.activeIndex === '1') {
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
        {params:{sel:'many'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] :item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
        console.log(res);
        
      }
      // 获取静态属性
      if (this.activeIndex === '2') {
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}})
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性失败')
          }
          console.log(res);
          
          this.onlyTabData = res.data
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.previePath = file.response.data.url
      this.imgDialogVisible = true
    },
    // 处理图片移除
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm);
      
    },
    // 监听图片上传成功实践
    handersuccess(response){
      const picInfo = {pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);
      console.log(response);
      
    },
    // 点击添加商品
    add() {
      console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        const addform = this.addForm
        
        // 深拷贝数组
        const form = JSON.parse(JSON.stringify(addform))
        form.goods_cat = form.goods_cat.join(',')       
        // console.log(addform);     
        // console.log(form);
        // 处理动态参数
        this.manyTabData.forEach(item =>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
            }
          this.addForm.attrs.push(newInfo)
        })
        // console.log(this.manyTabData);
        
        // 处理静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form);
        const {data:res} = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push({ name:'goods' })
      })
      
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.previeImg{
  width: 100%;
}
.addBtton{
  margin-top: 20px;;
}

</style>
