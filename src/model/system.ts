import { getNowDateTimeString } from "@/hooks/utils"

// 日志模型
export class LogModel {
  readonly datetime: string
  readonly info: string
  readonly type: LogType

  constructor(ifn: string, tp?: LogType, dt?: string) {
    this.datetime = dt ?? getNowDateTimeString()
    this.info = ifn
    this.type = tp ?? LogType.info
  }

  toString() {
    return `${this.datetime}>>>${this.info}`
  }

  color(): string {
    switch (this.type) {
      case LogType.success:
        return "green"
      case LogType.info:
        return "#000"
      case LogType.error:
        return "red"
    }
  }
}

export enum LogType {
  success,
  info,
  error
}
