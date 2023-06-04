// 象限类型
enum QuadrantTypes {
  OneOne = 1,
  OneTwo,
  TwoOne,
  TwoTwo
}

// 象限todo模型
interface QTodoModel {
  id?: number
  detail: string
  updated_at?: string
  quadrant_type: number
  user_id?: number
  hashcode?: string
}