<template>
  <div>
    <el-form :inline="true" :model="attrForm">
      <el-form-item label="一级分类">
        <el-select v-model="attrForm.category1Id" placeholder="请选择" @change="changeCategory1">
          <!-- value是要被收集到v-model指定的内容,label是要显示的文字 -->
          <!-- 展示的就是一级分类的名字lable,收集的就是value为一级分分类的id -->
          <el-option v-for="c1 in category1List" :key="c1.id" :value="c1.id" :label="c1.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="attrForm.category2Id" placeholder="请选择" @change="changeCategory2">
          <el-option v-for="c2 in category2List" :key="c2.id" :value="c2.id" :label="c2.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="attrForm.category3Id" placeholder="请选择" @change="changeCategory3">
          <el-option v-for="c3 in category3List" :key="c3.id" :value="c3.id" :label="c3.name" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      attrForm: {
        category1Id:'',
        category2Id:'',
        category3Id:''
      },
      category1List:[],
      category2List:[],
      category3List:[]
    }
  },
  mounted(){
    // 获取到一级分类的数据就可以直接展示了
    this.getCategory1List()
  },
  methods: {
    async getCategory1List(){
      const result = await this.$API.category.getCategorys1()
      // 其实这里不需要判断也可以,因为在响应拦截器中,如果不等于200,算是错误,直接返回一个状态为失败的Promise实例,导致返回的结果为失败状态的Promise,可以用try-catch处理
      if(result.code === 200) {
        this.category1List = result.data
      }
    },
    // 点击一级分类获取二级分类数据
    async changeCategory1(category1Id) {
      // 重新点击一级分类,因为要重新收集,所以将以前收集到的2id和3id以及2list和3list重新清空
      this.attrForm.category2Id = ''
      this.attrForm.category3Id = ''
      this.category2List = []
      this.category3List = []
      // 通知父组件我被选中了
      this.$emit('changeCategory',{categoryId:category1Id,level:1})
      const result = await this.$API.category.getCategorys2(category1Id)
      if(result.code === 200) {
        this.category2List = result.data
      }
    },
    // 点击二级分类获取三级分类数据
    async changeCategory2(category2Id){
      this.attrForm.category3Id = ''
      this.category3List = []
      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategorys3(category2Id)
      if(result.code === 200) {
        this.category3List = result.data
      }
    },
    // 点击三级分类,通知父组件发送请求
    changeCategory3(category3Id){
      // 通知父组件我被选中了,如果当前选中的是三级分类则发送请求获取列表数据
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
      
    }
  }
}
</script>
