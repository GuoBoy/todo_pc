<template>
  <div class="booknote">
    <!-- 日志列表 -->
    <!-- <ul class="booknote-list">
      <li class="booknote-list-item">1</li>
      <li>2</li>
      <li>3</li>
    </ul> -->
    <div class="funcs">
      <el-button type="primary" size="small" @click="newBookVisable = true" :icon="Plus"></el-button>
      <el-button type="primary" size="small" @click="onRefresh" :icon="Refresh"></el-button>
    </div>
    <el-table :data="searchResBookNotes" empty-text="还没有哦" size="small" @expand-change="onExpandChange"
      class="note-table">
      <el-table-column type="expand">
        <template #default="props">
          <el-card>
            <template #header>
              <h3>详情</h3>
            </template>
            <div class="detail-container">
              <div class="detail-row">
                <div style="display: flex;align-items: center;">
                  <h4>书名</h4>
                  <el-input v-model="tempBookName"></el-input>
                  <el-button size="small" type="primary" @click="onUpdateBookname(props.row.id)">确认修改</el-button>
                </div>
              </div>
              <div class="detail-row">
                <div style="display: flex;align-items: center;">
                  <h4>笔记&nbsp; {{ hasEdited ? "*" : "" }}</h4><el-button size="small" type="primary"
                    @click="editable = true" id="open-btn" v-if="!editable">开启编辑</el-button>
                </div>
                <div class="edit-container">
                  <textarea class="note" v-model="tempNote" rows="4" :disabled="!editable"
                    @input="hasEdited = true"></textarea>
                  <el-button size="small" v-if="editable" type="primary"
                    @click="onUpdateNote(props.row.id)">提交</el-button>
                </div>
              </div>
              <div class="detail-row">
                <div style="display: flex;align-items: center;">
                  <h4>源地址</h4>
                  <el-input v-model="tempSourceLink"></el-input>
                  <el-button size="small" type="primary" @click="onUpdateSourceLink(props.row.id)">确认修改</el-button>
                </div>
              </div>
              <h4>附件列表</h4>
              <el-table :data="props.row.attachments" size="small" empty-text="没有附件">
                <el-table-column label="id" prop="filename" />
                <el-table-column label="文件名" prop="origin_name" />
                <el-table-column label="大小" prop="filesize" />
                <el-table-column prop="created_at" label="创建时间" />
                <el-table-column label="操作">
                  <template #header>
                    <el-button type="primary" size="small" @click="fileUploadRef?.click(); currentBookId = props.row.id"
                      :icon="Upload"></el-button>
                  </template>
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="downloadAttachment(scope.row.filename)"
                      :icon="Download"></el-button>
                    <el-button type="danger" size="small" @click="onDelAttachment(scope.row.filename)"
                      :icon="Delete"></el-button>
                    <el-button size="small" @click="" disabled>预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column prop="book_name" label="书名"></el-table-column>
      <el-table-column prop="note" label="笔记"></el-table-column>
      <el-table-column prop="source_link" label="源地址"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" label="更新时间"></el-table-column>
      <el-table-column>
        <template #header>
          <el-input placeholder="书名搜索" size="small" clearable v-model="searchKey"></el-input>
        </template>
        <template #default="scope">
          <el-button type="danger" size="small" @click="onDelBooknote(scope.row.id, scope.row.book_name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 新建对话框 -->
  <el-dialog title="新建书籍" v-model="newBookVisable" width="70%">
    <el-form v-model="newBookForm" label-width="60px">
      <el-form-item label="书名">
        <el-input v-model="newBookForm.book_name" clearable></el-input>
      </el-form-item>
      <el-form-item label="笔记">
        <!-- <textarea v-model="newBookForm.note" cols="90" rows="6"></textarea> -->
        <el-input v-model="newBookForm.note" type="textarea" rows="6" placeholder="输入笔记" clearable></el-input>
      </el-form-item>
      <el-form-item label="源地址">
        <el-input v-model="newBookForm.source_link" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="newBookVisable = false">取消</el-button>
        <el-button type="primary" @click="onNewBooknote">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 文件附件-->
  <input type="file" name="file-upload" ref="fileUploadRef" @change="onUpload" hidden />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { Attachment, BookNote } from "@/model/book"
import { Plus, Refresh, Download, Delete, Upload } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus";
import { apiAddBooknote, apiGetBooknotes, apiUpdateBookNameByID, apiDelBooknoteByID, apiDelBookAttachmentByFilename, apiUpdateBooknoteByID, apiUpdateBookSourceLinkByID, apiAddBookAttachmentByID } from "@/api/book"
import { useSettingStore } from "@/store";
import { useLogStore } from "@/store/logs";
import { LogType } from "@/model/system";

const settingStore = useSettingStore()
const logStore = useLogStore()

const booknotes = ref<BookNote[]>([])
const searchKey = ref("")
const searchResBookNotes = computed(() => booknotes.value.filter(v => !searchKey.value || v.book_name.toUpperCase().includes(searchKey.value.toUpperCase())))

const newBookVisable = ref(false)
const newBookForm = reactive<BookNote>({ book_name: "", note: "", source_link: "" })
// 重置新建表单数据
const resetNewBookForm = () => {
  newBookForm.book_name = ""
  newBookForm.note = ""
  newBookForm.source_link = ""
}
// 新建书籍
const onNewBooknote = () => {
  if (newBookForm.book_name === "") {
    ElMessage.error("请输入正确书籍名称！")
    return
  }
  apiAddBooknote(newBookForm).then((res: any) => {
    booknotes.value.push(<BookNote>{ ...newBookForm, id: res.id, created_at: res.created_at })
    resetNewBookForm()
    newBookVisable.value = false
    logStore.add("书籍 添加成功")
  })
}

// 刷新
const onRefresh = () => {
  apiGetBooknotes().then((res: any) => {
    if (res.length !== 0) booknotes.value = res.data
    logStore.add("书籍列表 刷新成功")
  })
}

//删除
const onDelBooknote = (id: number, name: string) => {
  ElMessageBox.confirm(`确定要删除:${name}?`, '提示', { confirmButtonText: "确定", cancelButtonText: "我再想一想", type: 'warning' }).then(_ => {
    apiDelBooknoteByID(id).then((res: any) => {
      if (res.code !== 200) {
        logStore.add(`${name} 删除失败`, LogType.error)
        return
      }
      booknotes.value = booknotes.value.filter(v => v.id !== id)
      logStore.add(`${name} 删除成功`)
    })
  }).catch(_ => {
    ElMessage.warning("取消删除")
  })
}
onMounted(() => {
  onRefresh()
})

// 笔记编辑
const editable = ref(false) // 是否可编辑
const hasEdited = ref(false) // 编辑状态还未保存
const tempNote = ref("") // 临时note
const onExpandChange = (_: any, b: BookNote[]) => { // 行展开或关闭事件
  // 切换默认禁止编辑
  editable.value = false
  hasEdited.value = false
  if (b.length) {
    tempNote.value = b[0].note + ""
    tempSourceLink.value = b[0].source_link + ""
    tempBookName.value = b[0].book_name + ""
  } else {
    tempNote.value = ""
    tempSourceLink.value = ""
    tempBookName.value = ""
  }
}
// 更新书籍名称
const tempBookName = ref("")
const onUpdateBookname = (id: number) => {
  apiUpdateBookNameByID(id, tempBookName.value).then((_) => {
    booknotes.value.map(v => v.id === id ? v.book_name = tempBookName.value + "" : "")
    logStore.add("书籍名称 更新成功")
  })
}
//更新note
const onUpdateNote = (id: number) => {
  editable.value = false
  apiUpdateBooknoteByID(id, tempNote.value).then((_) => {
    editable.value = true
    hasEdited.value = false
    booknotes.value.map(v => v.id === id ? v.note = tempNote.value + "" : "")
    logStore.add("note 更新成功")
  })
}
// 更新source_link
const tempSourceLink = ref("")
const onUpdateSourceLink = (id: number) => {
  apiUpdateBookSourceLinkByID(id, tempSourceLink.value).then((_) => {
    booknotes.value.map(v => v.id === id ? v.source_link = tempSourceLink.value + "" : "")
    logStore.add("source_link 更新成功")
  })
}
// 附件
// 上传
const fileUploadRef = ref<HTMLInputElement>()
const currentBookId = ref(0)
const onUpload = (e: Event) => {
  var form = new FormData()
  // @ts-ignore
  var file = e.target.files[0] as File
  form.append("file", file)
  apiAddBookAttachmentByID(currentBookId.value, form).then((res: any) => {
    booknotes.value.map(v => v.id === currentBookId.value ? v.attachments?.push(<Attachment>{ book_id: currentBookId.value, created_at: Date(), filename: res.data.filename, filesize: file.size, origin_name: file.name }) : "")
    logStore.add(res.msg, res.code === 200 ? LogType.success : LogType.error)
  })
}
// 下载附件
const downloadAttachment = (fn: string) => {
  let a = document.createElement("a")
  a.href = settingStore.serverAddr + `/book/attachment/${fn}`
  a.click()
}
// 删除
const onDelAttachment = (fn: string) => {
  apiDelBookAttachmentByFilename(fn).then(() => {
    booknotes.value.map(v => v.attachments = v.attachments?.filter(vv => vv.filename !== fn))
    logStore.add("删除附件成功")
  })
}
</script>

<style scoped lang="scss">
.note-table {
  height: 93vh;
}

.detail-container {
  .edit-container {
    display: flex;
    flex-direction: column;

    .note {
      margin: 0 4px 2px 2px;
    }
  }
}
</style>