export interface CryptedDataModel {
  data: string
  hc: string
}

export interface DecryptedRespModel {
  code: number  // 状态码
  data: {
    data: any  // 解密后响应数据
    hc: string // 验证hash
  }
  msg: string // 消息
}