<template>
  <div>
    <!-- 三级连动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addShowDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table border style="margin-top: 20px" :data="attrList">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          />
          <el-table-column label="属性名称" width="200" prop="attrName" />
          <!-- 每一列的内部都能收到attrlist,在内部进行遍历,所以能够生成很多行 -->
          <el-table-column label="属性值列表">
            <!-- 属性值列表的展示,用el-tag,需要额外的结构,attrList生成很多行,每一行接收到的就是数组的每一项,就是row -->
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 6px"
                type="info"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row }">
              <HintButton
                title="修改属性"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateShowDiv(row)"
              />
              <el-popconfirm :title="`确定要删除${row.attrName}吗?`" @onConfirm="deleteAttr(row)">
                <HintButton
                title="删除属性"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :inline="true" :data="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrForm.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          />
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              />
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确认要删除${row.valueName}吗?`"
                @onConfirm="removeAttrValue($index)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  title="删除"
                  icon="el-icon-delete"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true,
      // 要收集的数据格式
      attrForm: {
        attrName: '',
        attrValueList: [
          // {
            // attrId: 0, 属性值所在属性的id
            // id: 0,
            // valueName: ''
          // }
        ],
        categoryId: 0,
        categoryLevel: 3,
        // id: 0  就是这个id,有这个id是修改,么有就是添加
      }
    }
  },
  methods: {
    // 无论是点击一级分类,二级分类,还是三级分类都会触发这个事件
    changeCategory({ categoryId, level }) {
      // 如果点击的是一级分类存储id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        // 如果点击的是二级分类,存储id
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else {
        // 如果点击的是三级分类,存储id,发送请求
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 点击添加属性按钮
    addShowDiv(){
      this.isShowList = false
      // 清除之前残留的,将对象赋值为空
      this.attrForm = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id, // 这里是固定的,但是不能在data中赋值,因为data中不能用this
        categoryLevel: 3,
      }
    },
    // 点击添加属性值按钮
    addAttrValue(){
      // 这里是push进去的必须有响应式
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // attrId为外层整个属性对象的id,如果有就是修改,没有就是添加
        valueName: '',
        isEdit:true
      })
      // 点击添加属性值之后获取焦点,没个input都有ref,找最后一个
      this.$nextTick(()=>{
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },
    // 点击修改按钮
    updateShowDiv(row){
      this.isShowList = false
      this.attrForm = cloneDeep(row)
      this.attrForm.attrValueList.forEach(item=>{
        // 对象中后添加的属性么有响应式,要用this.$set添加
        this.$set(item,'isEdit',false)
      })
    },
    // 切换为查看模式
    toLook(row){
      // 切换为查看模式要判断,不能有重复的
      const valueName = row.valueName
      if(!valueName.trim()) {
        this.$message.info('添加的属性值不能为空')
        row.valueName = ''
        return
      }
      // 也不能是已经存在的
      const isRepeat = this.attrForm.attrValueList.some(item=>{
        // 因为已经push进去了,所以先排除当前的
        if(item !== row) {
          return item.valueName === valueName
        }
      })
      if(isRepeat) {
        this.$message.info('添加的属性值不能重复')
        this.$row.valueName = ''
        return
      }
      row.isEdit = false
    },
    // 切换为编辑模式
    toEdit(row,index) {
      row.isEdit = true
      // 获取变为编辑模式要获取焦点,因为为true之后dom异步跟新,下面直接获取获取不到,所以nexttick()
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    removeAttrValue(index){
      this.attrForm.attrValueList.splice(index,1)
    },
    // 点击保存按钮发送请求进行修改或者添加
    async saveAttr(){
      // 收集参数
      const attr = this.attrForm
      // filter方法返回新的数组重新赋值
      attr.attrValueList = attr.attrValueList.filter(item=>{
        // 如果不等于空字符串,把isEdit属性删除,然后得到过滤的数组
        if(item !== '') {
          delete item.isEdit
          return true
        }
      })
      // 属性值列表的数组没有属性也取消操作
      if(attr.attrValueList.length === 0) {
        return this.$message.info('属性必须有属性值')
      }
      try {
        await this.$API.attr.addOrUpdate(attr)
        this.$message.success(attr.id ? '修改成功': '添加成功')
        this.isShowList = true
        this.getAttrList()
      } catch (error) {
        this.$message.info(attr.id ? '修改失败': '删除失败')
      }
    },
    // 删除属性
    async deleteAttr(row) {
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功')
        this.getAttrList()
      } catch (error) {
        this.$message.info('删除失败')
      }
    }

  }
}
</script>
