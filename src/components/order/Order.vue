<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
      <el-card>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>              
            </el-col>
          </el-row>

        <el-table :data="orderList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status"></el-table-column>
          <el-table-column label="是否发货" prop="is_send">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.is_send === '1'">已付款</el-tag>
              <el-tag type="warning" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button type="success" size="mini" icon="el-icon-location" @click="logistics"></el-button>
            </template>
          </el-table-column>
          
          
        </el-table>
        
       <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>


      </el-card>
      <!-- 时间线 -->
      <el-dialog
        title="物流进度"
        :visible.sync="logisticsVisible"
        width="50%"
        >
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
  
      </el-dialog>
  </div>
</template>

<script type="text/javascript">

export default {
  data() {
    return {
      querInfo:{
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      orderList:[],
      total:0,
      logisticsVisible:false,
      logisticsInfo:{}
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const{data:res} = await this.$http.get('orders',{
        params: this.querInfo
      })
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList);
      
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.orderList()
    },
    // 物流
    async logistics() {
     const{data:res} = await this.$http.get('kuaidi/1106975712662')
     console.log(res);
      this.logisticsInfo = res.data
     this.logisticsVisible = true
     
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
