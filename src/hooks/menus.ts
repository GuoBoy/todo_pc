import { MenuItem } from "@/model/menu";

export const menus: MenuItem[] = [
  {
    title: "四象限法",
    name: "four-quadrant",
    ComponentDir: "FourQuadrant"
  },
  {
    title: "todo管理",
    name: "todo-manage",
    ComponentName: "TodoManage",
    icon: "device-ssd"
  }, {
    title: "回收站",
    name: "recycle-bin",
    ComponentName: "RecycleBin"
  }, {
    title: "书籍日志",
    name: "book-manage",
    ComponentName: "BookNote",
    icon: "house-door"
  },
  {
    title: "数据库测试",
    name: "db-test",
    ComponentName: "DbTest"
  }, {
    title: "排序测试",
    name: "sort-test",
    ComponentName: "TestSort"
  }
]
