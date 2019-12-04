<template>
  <div class="device smart  ui-container" :style="{height: layoutHeight + 'px'}">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入料号" v-model="search.materialNo"></el-input>
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入版本" v-model="search.versionNo"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="obicon obicon-cloud-download" @click="dialogVisible = true">版本上传</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog  v-if="dialogVisible" top="10%" width="660px" title="上传版本" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="upload" autoComplete="on" :rules="modelRules" :model="model" label-width="80px" style="width: 90%; margin: 0 auto;">
        <el-form-item label="料号" prop="materialNo">
          <el-input v-model="model.materialNo" placeholder="输入料号"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="log">
          <el-input v-model="model.log" placeholder="输入描述信息"></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <span class="file-name">{{fileName}}</span>
          <el-upload
            class="upload-btn"
            ref="uploadBtn"
            accept=".bin"
            :data="uploadData"
            :show-file-list="false"
            :on-change="onUploadChange"
            :before-upload="onBeforeUpload"
            :on-success="onUploadSuccess"
            :on-error="onUploadFail"
            :auto-upload="false"
            action="/consumer/image/uploadFirmware">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload()">上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SystemAPI from '@/api/system'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      total: 0,
      search: {
        materialNo: '',
        versionNo: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      dialogVisible: false,
      model: {
        materialNo: '',
        log: '',
        file: ''
      },
      modelRules: {
        materialNo: [{ required: true, message: '料号不能为空', trigger: 'blur' }],
        log: [{ required: true, message: '描述信息不能为空', trigger: 'blur' }],
        file: [{ required: true, message: '文件不能为空', trigger: 'change' }],
      },
      uploadData: {
        access_token: ''
      },
      fileName: '请选择文件'
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getVersionList()
  },
  computed: {
    layoutHeight () {
      return this.tableHeight + 180
    }
  },
  watch: {
    dialogVisible (val) {
      if (val === false) {
        this.$refs.upload.resetFields()
        this.$refs.uploadBtn.clearFiles()
        this.fileName = '请选择文件'
      }
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20
    },
    getColumns () {
      return [{
        label: '料号',
        prop: 'materialNo',
        align: 'center'
      }, {
        label: '版本',
        prop: 'versionNo',
        align: 'center'
      }, {
        label: '存储路径',
        prop: 'url',
        align: 'center'
      }, {
        label: '描述',
        prop: 'log',
        align: 'center'
      }, {
        label: '更新时间',
        prop: 'optTime',
        align: 'center',
        formatter (val) {
          return val && Helper.parseTime(val)
        }
      }, {
        label: '操作',
        prop: 'operator',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [<el-button size="tiny" icon="obicon obicon-trash" title='删除' onClick={() => this.handleRemove(row)}></el-button>]
    },
    getVersionList () {
      this.tableLoading = true
      SystemAPI.getVersionList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
        }
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getVersionList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getVersionList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getVersionList()
    },
    handleUpload () {
      const that = this
      this.$refs.upload.validate(valid => {
        if (valid) {
          that.uploadData = {...that.uploadData, ...that.model}
          that.$refs.uploadBtn.submit()
        }
      })
    },
    onUploadChange (file, fileList) {
      if (file) {
        this.fileName = file.name
        this.model.file = file.name
      } else {
        this.model.file = ''
      }
    },
    onBeforeUpload (file) {
      if (!file) {
        return this.$message({
          title: false,
          type: 'warning',
          message: '请选择文件'
        })
      }
      const suffix = file.name && file.name.slice(file.name.lastIndexOf('.') + 1)
      if (!['bin'].includes(suffix)) {
        this.$message({
          type: 'error',
          message: '文件类型错误'
        })
        return false
      }
      this.loader = this.$loading({
        text: '文件上传中'
      })
    },
    onUploadSuccess (response, file, fileList) {
      this.loader && this.loader.close()
      this.dialogVisible = false
      this.getVersionList()
    },
    onUploadFail (response, file, fileList) {
      this.loader && this.loader.close()
      this.$message({
        type: 'error',
        message: '上传失败'
      })
    },
    handleRemove (row) {
      this.$confirm('确认删除料号？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (id) {
      SystemAPI.deleteVersion(id).then(resp => {
        if (resp.status === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '服务异常'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-btn{
    float: right;
  }
</style>
