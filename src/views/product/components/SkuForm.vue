<template>
  <div>
    <el-form label-width="100px" :model="skuInfo">
      <!-- spu名称根据父组件传递来的参数来展示 -->
      <el-form-item label="SPU名称">spuName</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="请输入SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="请输入价格"
          type="number"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuInfo.weight"
          placeholder="请输入终量"
          type="number"
        />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          rows="5"
          placeholder="请输入描述"
        />
      </el-form-item>
      <!-- 嵌套form表单 -->
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item label="屏幕尺寸">
            <el-select placeholder="请选择">
              <el-option value="" label="" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 嵌套form表单 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item label="版本">
            <el-select placeholder="请选择">
              <el-option value="" label="" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 嵌套表格 -->
      <el-form-item label="图片列表">
        <el-table border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      skuInfo: {
        // 下面3个数据从父组件传入收集
        category3Id: null, // 3级分类ID
        spuId: null, // SPU的id
        tmId: null, // 品牌ID

        // 下面4个通过v-model收集
        skuName: null, // sku的名称
        skuDesc: null, // sku的描述
        price: null, // sku的价格
        weight: null, // sku的重量

        skuDefaultImg: null, // sku的默认图片
        skuAttrValueList: [], // sku的属性值列表
        skuSaleAttrValueList: [], // sku属性属性值列表
        skuImageList: [] // 选择的spu图片列表
      }
    }
  }
}
</script>
