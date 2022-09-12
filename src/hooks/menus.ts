interface FunctionItem {
  title: string
  path: string
  iconName?: string
  componentPath: string
  meta?: { requireAuth: boolean }
}

export const Menus: FunctionItem[] = [{
  title: "首页",
  path: "home",
  iconName: "home",
  componentPath: "../components/Home.vue"
}, {
  title: "分割视频",
  path: "split_video",
  iconName: "split",
  componentPath: "../components/SplitVideo.vue"
}, {
  title: "AI Make",
  path: "ai_make",
  componentPath: "../components/AiMake.vue"
}, {
  title: "设置",
  path: "setting",
  componentPath: "../components/Setting.vue"
}]