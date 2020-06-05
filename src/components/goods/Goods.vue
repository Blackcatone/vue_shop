<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片视图区域 -->
        <el-card>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="handleCurrentChange(1)">
              <el-button slot="append" icon="el-icon-search"  @click="getGoodslist"></el-button>
              </el-input>              
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addGoodsList">添加商品</el-button>
            </el-col>
          </el-row>
       <!-- 表格  -->
          <el-table :data="goodsList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight" width="75px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="150px">
              <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGoods(scope.row)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>   
              </template>
            </el-table-column>
            
          </el-table>
          


       <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>

      <!-- 修改商品区域 -->
      <!-- 修改商品接口有问题 -->
       <el-dialog
        title="修改商品"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="editForm.goods_weight"></el-input>
          </el-form-item>                    
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editInfo">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      queryInfo: {
        query:'',
        pagenum: 1,
        pagesize: 10,
      },
      goodsList:[],
      total: 0,
      // 控制修改商品弹框的显示与隐藏
      editDialogVisible:false,
      // 修改商品的数据对象
      editForm:{
        goods_name:'',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0
      },
      editId:'',
      editFormRules:{
        goods_name:[
          {required:true, message:'请输入商品名称',trogger:'blur'}
        ],
        goods_price:[
          {required:true, message:'请输入商品价格',trogger:'blur'}
        ],
        goods_weight:[
          {required:true, message:'请输入商品重量',trogger:'blur'}
        ]
      }
    }
  },
  created() {
    this.getGoodslist()
    
  },
  methods: {
    async getGoodslist() {
      const {data:res} = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // console.log(res);
      
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      
    },

    // 获取分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodslist()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodslist()
    },
    // 
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑商品提交
    editGoods(row) {
      this.editId = row.goods_id
      this.editForm.goods_number = row.goods_number

      this.editDialogVisible = true
      
      console.log(this.editForm);
      
      
    },
    editInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if (!valid) {
          return this.$message.error('修改商品参数错误')
        }
        const {data:res} = await this.$http.put('goods/'+ this.editId,{
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_weight: this.editForm.goods_weight,
          goods_number: this.editForm.goods_number,
          goods_introduce: '',
          pics: {},
          attrs: []
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品失败')
        }
        
        
      })
    },
    //删除商品
    async deleteGoods(id) {
      const {data:res} = await this.$http.delete('goods/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodslist()
    },
    // 添加商品
    addGoodsList() {
      this.$router.push({ name:'add' })
    }
    
  },
  
}
</script>

<style lang="scss" scoped>
</style>
