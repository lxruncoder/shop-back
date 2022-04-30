<template>
  <div>
    <!-- 指定一个label-width就能实现在一行显示 -->
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 收集的spuName -->
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 收集的是tmId -->
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <!-- 这里展示trademark列表,但是外层的select收集的是被选中的value,也就是spuForm.tmId,最终收集到spuForm中 -->
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :value="trademark.id"
            :label="trademark.tmName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 收集的的描述部分,直接就能收集到spuForm中 -->
        <el-input
          v-model="spuForm.description"
          placeholder="spu描述"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 直接将图片的列表给file-list属性即可,前提是每一个图片对象中有name和url属性,这我们已经改造过了 -->
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 因为暂时不知道收集什么所以在data中定义一个spuSaleAttrId用来临时收集 -->
        <!-- 现在来展示计算出来的当前spu没有的销售属性 -->
        <el-select
          v-model="spuSaleAttrIdOrName"
          :placeholder="
            unUseSpuSaleAttrList.length > 0
              ? `还有${unUseSpuSaleAttrList.length}个没有选择`
              : '没有了'
          "
        >
          <el-option
            v-for="unUseSpuSaleAttr in unUseSpuSaleAttrList"
            :key="unUseSpuSaleAttr.id"
            :value="`${unUseSpuSaleAttr.id}:${unUseSpuSaleAttr.name}`"
            :label="unUseSpuSaleAttr.name"
          />
        </el-select>
        <el-button
          style="margin-left: 12px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!spuSaleAttrIdOrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <!-- 展示已经存在当前spuForm中的销售属性 -->
        <el-table border style="margin: 20px 0" :data="spuForm.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="属性名" width="200" prop="saleAttrName" />
          <el-table-column label="属性值名称列表">
            <!-- 销售属性值列表使用el-tag,这里的row是每一个spuSaleAttrList中的销售属性对象,内部包含销售属性值列表 -->
            <template slot-scope="{ row }">
              <!-- closeable表示有关闭按钮,:disable-transitions="false"表示有过渡效果 -->
              <!--  @close="handleClose(tag)" -->
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <!-- v-if表示是编辑模式还是查看模式,这个编辑模式不同之前,之前是每个属性值有一个编辑模式,但是在这里,每一个属性才有编辑模式,而row表示每一个属性,所以将控制是否是编辑模式还是输入的value都暂时添加在row上 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ $index }">
              <HintButton
                type="danger"
                size="mini"
                title="删除"
                icon="el-icon-delete"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: 0,
        // id: 0,  这个id不需要
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],

        spuSaleAttrList: [
          // 这里的外层大对象表示每一个销售属性,内部的对象表示销售属性的值
          // {
          //   baseSaleAttrId: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   id: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
          // {
          // }
        ]
      },
      // 先定义一个数据,展示当前spu没有的销售属性暂时收集,现在修改了因为这里负责收集id和name
      spuSaleAttrIdOrName: '',
      // 上传图片组件需要的数据
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储额外获取的数据,这些数据最终需要重新整理
      imageList: [],
      trademarkList: [],
      baseSaleAttrList: [],
      // 定义一个category3id用来呗初始化
      category3Id: ''
    }
  },
  computed: {
    // 计算没有使用的销售属性
    unUseSpuSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        // filter表示过滤出满足条件的,什么样的是满足条件的呢,baseSaleAttr中的任何一个,在this.spuForm.spuSaleAttrList都没有
        return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
          // 全局的name都不能与已有的saleAttrName才被计算出来
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName
        })
      })
    }
  },
  methods: {
    // 上传图片组件需要的两个函数,这个是移出一张图片的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.imageList = fileList
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.imageList = fileList
    },
    // 放大镜效果
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 修改spu需要初始化数据的方式
    async initUpdateSpuFormData(row) {
      this.category3Id = row.category3Id
      // 接收参数包含spu的id
      // 需要发送四个请求:获取所有品牌列表数据和获取所有销售属性属性数据和图片列表和spu的详情(后两个需要根据spu的id来获取)
      // 获取spu的详情
      const result = await this.$API.spu.get(row.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }
      // 获取图片列表:这个请求接口函数在sku之中
      const imgageResult = await this.$API.sku.getSpuImageList(row.id)
      if (imgageResult.code === 200) {
        const imageList = imgageResult.data
        // 因为上传图片组件,需要展示的数组中的每个对象需要包含name和url属性,在这里将请求来的数据改造之后在赋值
        imageList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 这样能保证imageList整体都是一个响应式数据
        this.imageList = imageList
      }
      // 获取所有的品牌,后续两个请求在添加初始化的时候也要发送
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 添加spu需要初始化数据的方法
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id
      // 需要发送两个请求:获取所有品牌列表数据和获取所有销售属性属性数据
      // 获取所有的品牌
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdOrName.split(':')
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      // 添加之后将输入框清空
      this.spuSaleAttrIdOrName = ''
    },
    // 点击el-tag的添加按钮展示input输入框
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      // inpuot自动获取焦点，因为每个一行中只有一个input所以可以直接获取
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // input失去焦点或者回车
    handleInputConfirm(row) {
      // 添加属性值需要baseSaleAttrId
      const saleAttrValueName = row.inputValue
      const baseSaleAttrId = row.baseSaleAttrId
      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        return
      }
      // 排除重复的,这里不需要,这里不需要排除自己,因为还没有添加进去
      const isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName
      })
      if (isRepeat) {
        this.$message.info('不添加重复属性值')
        return
      }
      // 构造对象添加进去
      const obj = {
        saleAttrValueName,
        baseSaleAttrId
      }
      row.spuSaleAttrValueList.push(obj)
      // 清空输入框
      row.inputValue = ''
      // 隐藏input
      row.inputVisible = false
    },
    // 点击保存按钮进行添加操作
    async save() {
      const { category3Id, spuForm, imageList } = this
      // 整理图片
      spuForm.spuImageList = imageList.map((item) => {
        // map方法构造一个新的对象返回,如果是原始的图片还是新的图片都有name,原始的图片有imgUrl新的图片的url在reponse.data主公
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })
      // 删除自己添加的属性
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible
        delete item.inputValue
      })
      // 整理category3id,这个id是父组件传递过来的,在发送四个请求之前进行初始化
      spuForm.category3Id = category3Id
      try {
        await this.$API.spu.addUpdate(spuForm)
        // 给出提示
        this.$message.success(spuForm.id ? '修改成功' : '添加成功')
        // 会到父组件
        this.$emit('update:visible', false)
        // 通知父组件成功
        this.$emit('successBack')
        // 清空data中的所有数据
        this.resetData()
      } catch (error) {
        this.$message.error(spuForm.id ? '修改失败' : '添加失败')
      }
    },
    resetData() {
      this.spuForm = {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: 0,
        // id: 0,  这个id不需要
        spuImageList: [],
        spuSaleAttrList: []
      }
      // 先定义一个数据,展示当前spu没有的销售属性暂时收集,现在修改了因为这里负责收集id和name
      this.spuSaleAttrIdOrName= '',
      // 上传图片组件需要的数据
      this.dialogImageUrl= '',
      this.dialogVisible=false,
      // 存储额外获取的数据,这些数据最终需要重新整理
      this.imageList= [],
      this.trademarkList=[],
      this.baseSaleAttrList=[],
      // 定义一个category3id用来呗初始化
      this.category3Id=''
    },
    // 点击取消
    cancel(){
      // 回到父组件
      this.$emit('update:visible', false)
      // 告诉父组件清空标识,因为我最后没改
      this.$emit('cancelBack')
      // 并且要重置数据,否则第一次点修改,第二次点击添加,数据都残留了
      this.resetData()
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
