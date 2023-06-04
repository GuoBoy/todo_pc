// 附件
export interface Attachment {
  book_id?: number
  created_at?: string
  filename?: string
  filesize: number
  origin_name: string
}

// 书籍
export interface BookNote {
  id?: number
  book_name: string
  note?: string
  source_link?: string
  created_at?: string
  updated_at?: string
  attachments?: Attachment[]
}

