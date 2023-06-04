
// 获取当前的日期时间
export const getNowDateTimeString = (): string => {
  let dateObj = new Date()
  return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`
}

// 合并uri
export const concatURIs = (...uris: string[]) => {
  uris = uris.map(v => v.replace(/^\/+|\/+$/g, '')) // 删除开头或结尾所有/
  return uris.join("/")
}