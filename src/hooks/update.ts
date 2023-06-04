import { apiGetLatestVersion } from "@/api";
import { useLogStore } from "@/store/logs";
import { ElMessageBox } from "element-plus";
import { Verison } from "./version"

// 更新检查
export const checkAppUpdate = (isFirst: boolean = false) => {
  const logStore = useLogStore()
  apiGetLatestVersion().then((res: any) => {
    if (res.code === 200 && parseInt(res.v.replaceAll(".", "")) > parseInt(Verison.replaceAll(".", ""))) {
      ElMessageBox.alert(`有新版本可以更新了，要不要试一试，下载地址：${res.link}`, "注意了！", { confirmButtonText: "知道了！" })
      logStore.add("有新版本可以更新了")
    } else {
      if (isFirst) return
      alert("已是最新版")
      logStore.add("已是最新版")
    }
  })
}