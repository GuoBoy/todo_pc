import CryptoJS from "crypto-js"

import { CryptedDataModel, DecryptedRespModel } from "@/model/crypt"

export const makeMd5 = (s: string): string => {
  return CryptoJS.MD5(s).toString()
}

const aesKey = makeMd5("woshiyigebigpig")

export const aesEncrypt = (s: string) => {
  return CryptoJS.AES.encrypt(s, CryptoJS.enc.Utf8.parse(aesKey), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

export const aesDecrypt = (s: string) => {
  return CryptoJS.AES.decrypt(s, CryptoJS.enc.Utf8.parse(aesKey), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}

// 这里直接响应解析好的数据
export const decryptResp = (res: DecryptedRespModel): any | Error => {
  if (res.code !== 200) return Error("请求错误！")
  var dt = aesDecrypt(res.data.data)
  if (makeMd5(dt) === res.data.hc) {
    // 这里的result为最终解析的加密数据
    return JSON.parse(dt)
  }
  return Error("数据被篡改了")
}

export const encryptToForm = (data: any): CryptedDataModel => {
  const dt = JSON.stringify(data)
  return {
    data: aesEncrypt(dt),
    hc: makeMd5(dt)
  }
}