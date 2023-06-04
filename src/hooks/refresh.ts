import { apiGetAllGroups } from '@/api/group'
import { apiCheckItemUpdate, apiGetAllToDoItems } from '@/api'
import { useGroupItemStore } from '@/store/groupItem'
import { useLogStore } from '@/store/logs'
import { LogType } from '@/model/system'

export const useRefreasher = () => {
  const groupItemStore = useGroupItemStore()
  const logStore = useLogStore()

  const refreshItems = () => {
    apiCheckItemUpdate().then((cRes: any) => {
      switch (cRes.code) {
        case 302:
          apiGetAllGroups().then((res: any) => {
            if (res.code === 200 && (res.data ?? []).length !== 0) {
              // 刷新后默认打开第一个
              groupItemStore.addGroups(res.data, cRes['update_time'])
              logStore.add("刷新分组成功！")
            }
          })
          break;
        case 403:
          logStore.add("刷新分组失败！", LogType.error)
          break
        default:
          logStore.add("刷新分组：已与服务器保持同步！")
      }
    })
  }
  // 刷新分组列表
  const refreshGroups = () => {
    apiGetAllGroups().then((res: any) => {
      groupItemStore.addGroups(res.data ?? [], 0)
      // 关闭items
      groupItemStore.currentGroup = undefined
      logStore.add("刷新分组成功！")
    })
  }
  // 刷新分组数据
  const refreshGroupByID = (gid: number) => {
    apiGetAllToDoItems(gid).then((res: any) => {
      if (res.length !== 0) {
        groupItemStore.setItems(gid, res.data)
      }
      logStore.add(`刷新分组 ${groupItemStore.groups.find(v => v.id === gid)?.name} 成功`)
    })
  }
  return {
    refreshItems, refreshGroups, refreshGroupByID
  }
}