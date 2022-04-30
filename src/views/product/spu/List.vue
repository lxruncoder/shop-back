<template>
  <div>
    <el-card>
      <CategorySelector
        :is-show-list="isShowList"
        @changeCategory="changeCategory"
      />
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表展示部分 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
        >添加SPU</el-button>
        <!-- 列表展示部分 -->
        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="primary"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU列表"
              />
              <el-popconfirm
                :title="`确认要删除${row.spuName}吗?`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[5, 7, 9]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->,sizes, total"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- SpuForm展示部分 -->
      <!-- sync实现父组同步的原理 -->
      <!-- <SpuForm v-show="isShowSpuForm" ref="spu" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event" /> -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
        @successBack="successBack"
        @cancelBack="cancelBack"
      />
      <!-- SkuForm展示部分 -->
      <SkuForm v-show="isShowSkuForm" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm.vue'
import SkuForm from '@/views/product/components/SkuForm.vue'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 三级分类列表传递过来的数据
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 存储列表展示数据的容器
      spuList: [],
      // 控制三级联动的可操作性,这个其实么用,但是如果不传递,三级联动就无法显示了,因为组件内部用这个数组来控制了form的可操作性
      // 这里传递的是true,但是三级联动组件内部取反了,为false,所以没有禁用
      isShowList: true,
      // 分页的数据
      page: 1,
      limit: 5,
      total: 0,
      // 控制添加spu和sku展示部分的数据
      isShowSpuForm: false,
      isShowSkuForm: false
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category3Id = ''
        this.spuList = []
      } else {
        // 点击三级分类发送请求
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(page = 1) {
      this.page = page
      const result = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.category3Id
      )
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条数
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 切换页面
    handleCurrentChange(page) {
      this.getSpuList(page)
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true
      // 这里将category3id传递过去用来在整理参数的时候用
      this.$refs.spu.initAddSpuFormData(this.category3Id)
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row) {
      // 添加一个标识,我是修改跳转到修改部分
      this.flag = row.id
      this.isShowSpuForm = true
      // 点击修改按钮,弹出修改部分,直接调用子组件的方法发送请求,修改数据的请求需要spu的id,所以将参数传递过去
      this.$refs.spu.initUpdateSpuFormData(row)
    },
    // 成功回到父组件:区分是修改回来,还是添加回来
    successBack() {
      if (this.flag) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.flag = null
    },
    // 取消
    cancelBack() {
      this.flag = null
    },
    // 删除spu
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id)
        this.$message.success('删除成功')
        this.getSpuList(this.spuList > 1 ? this.page : this.page -1)
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 点击添加sku按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true
    }
  }
}
</script>
