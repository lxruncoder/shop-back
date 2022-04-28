<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="showAddDialog"
    >添加</el-button>
    <!-- table的border属性可以添加边框,data为要展示的数据,必须是一个数组 -->
    <el-table border :data="trademarkList" style="margin: 20px 0">
      <!-- 每一个column代表一列,而不是一行 -->
      <!-- label表示每一列的标题,width如果指定了长度就是指定的长度,没有指定为平均分配,type表示该列会自动生成序号,align表示该列的对齐方式 -->
      <el-table-column label="序号" width="80" align="center" type="index" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌logo">
        <template slot-scope="{ row }">
          <!-- 可以验证得到的是数组中的每一个对象,可以展示名字 -->
          <!-- <p>{{row.tmName}}</p> -->
          <img style="width: 100px; height: 100px" :src="row.logoUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showAddDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paginatoin分页组件:手动添加style让其居中显示,pager-count就是连续页,大于等于5的奇数,并且必须是数字类型 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 7, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> ,sizes, total"
      :total="total"
      :pager-count="5"
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
    />
    <!-- 点击添加和修改的弹出层 -->
    <!-- 动态设置这里的标题,如果有tmId,表示修改,没有就是添加数据 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- style指定form部分的大小,model表示收集数据的对象 -->
      <el-form ref="tmF" :model="tmForm" style="width: 80%" :rules="rules">
        <!-- label-width指定标题部分的大小,要带有单位 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 将input输入的数据收到的tmFrom中的tmName中,这里的名称是固定的,因为后台就需要包含tmName和logoUrl的对象 -->
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- action中写上传图片的接口,原来的是假的拿到的是本地的路径 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2m
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    // 注意这里是在方法中,而不是对象中用方法赋值
    var validataTmName = (rule, value, callback) => {
      // 如果点击添加之后,点击取消,再次点击添加这里会自动执行,value为undefined,会报错,所以如果value有值才进行校验
      if (value) {
        if (value.length < 2 || value.length > 10) {
          // 没通过校验给出的提示
          callback(new Error('长度必须在2-10之间'))
        } else {
          // 通过校验放行
          callback()
        }
      }
    }
    return {
      page: 1, // 自己指定用来默认的显示
      limit: 5, // 自己指定用来默认显示
      total: 0, // 返回的数据存储该数据
      // 返回的数据中的列表部分
      trademarkList: [],
      // 控制显示和隐藏
      dialogFormVisible: false,
      // 收集的数据,如果是添加品牌,则没有id,如果是修改品牌则有id(自动就会有了)
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 定义校验规则,校验规则是一个对象,需要给form指定rules属性,其中每一项是一个数组,表示一个校验的字段,需要给每一item项配置prop属性
      rules: {
        /*
          required表示校验规则,可以定义多种校验规则,在官网可查看
          message:表示没有通过校验规则显示的提示
          trigger:表示触发校验的时机,总共有三种一种是blur,一种是change,还有一种是整体校验
        */
        tmName: [
          { required: true, message: '必须填写品牌的名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度必须在2-10之间', trigger: 'change' }
          // 使用自定义的校验规则
          { validator: validataTmName, trigger: 'change' }
        ],
        // 这个验证规则,需要的触发时机是整体校验的时候
        logoUrl: [{ required: true, message: '请选择需要上传的图片',trigger:'change'}]
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    // 发送请求获取数据
    async getTrademarkList(page = 1) {
      this.page = page // 将切换页面合并到该函数中
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      )
      // 这里只考虑了成功的情况,如果失败了会在浏览器抛出错误,可以用try-catch语法,捕获到抛出的错误对象,这里没有这样做
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条目数,参数是每条页数
    handleSizeChange(limit) {
      this.limit = limit
      this.getTrademarkList()
    },
    // 切换页码,参数是当前页
    /* handleCurrentChange(page) {
      this.page = page
      this.getTrademarkList()
    } */
    // 图片上传成功的回调函数
    handleAvatarSuccess(res, file) {
      // res.data和file.response.data返回的就是图片存户的数据
      this.tmForm.logoUrl = res.data
    },
    // 品牌上传之前的检查
    beforeAvatarUpload(file) {
      const imageArr = ['image/jpeg', 'image/png']
      // const isJPG = file.type === 'image/jpeg'
      const isJPGOrPNG = imageArr.indexOf(file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGOrPNG && isLt2M
    },
    // 点击添加按钮,弹出层的显示
    showAddDialog() {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 点击修改按钮,弹出层的显示
    showAddDialog(row) {
      this.dialogFormVisible = true
      // 专业就导致this.tmForm和row的内存地址相同,其实是一份数据,而row是要展示的数据,在输入框中输入内容,导致tmForm收集到,从而影响到展示的数据
      // this.tmForm = row
      this.tmForm = { ...row } // 浅拷贝,都是基本数据类型,将数据拷贝一份给tmForm,tmForm发生改变就不会影响row的数据展示
    },
    // 点击确认按钮真正添加或者修改品牌
    addOrUpdate() {
      this.$refs.tmF.validate(async(valid) => {
        if (valid) {
          try {
            await this.$API.trademark.addOrUpdate(this.tmForm)
            this.$message.success(
              this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            )
            // 先让弹出层关闭
            this.dialogFormVisible = false
            // 如果是添加数据则回到第一页,如果是修改数据停留在当前页
            const page = this.tmForm.id ? this.page : 1
            this.getTrademarkList(page)
          } catch (error) {
            // 响应拦截器通过返回失败状态的promise,让返回的promise状态为失败,我们可以在这里接收抛出的错误对象,但是在响应拦截器中也做出了错误的提示工作,我们这里不用提示也可以
            // 但是如果不用catch捕获这个错误,就会有在浏览器出现一片红色的错误提示
            this.$message.error(
              this.tmForm.id ? '修改品牌失败' : '添加品牌失败'
            )
          }
        } else {
          this.$message.info('请完整的输入内容')
        }
      })
    },
    // 点击删除按钮进行删除操作
    deleteTrademark(row) {
      this.$confirm(`此操作将永久删除该${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await this.$API.trademark.delete(row.id)
            this.$message.success('删除品牌成功')
            this.getTrademarkList(
              this.trademarkList > 1 ? this.page : this.page - 1
            )
          } catch (error) {
            this.$message.error('删除品牌失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
/* upload的样式,这里如果添加了scoped则显示不全 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
