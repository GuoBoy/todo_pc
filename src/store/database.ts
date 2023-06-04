import { GroupModel } from '@/model/item_group'
import { ToDoItemModel } from '@/model/todo_item';
import Database from 'tauri-plugin-sql-api'

let db: Database
// sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
// 数据库文件名进行隔离
const db_filename = import.meta.env.PROD ? "aes_encrypted_data.db" : "dev_aes_encrypted_data.db"

export const initDB = async () => {
  db = await Database.load('sqlite:' + db_filename)
  db.execute(`CREATE TABLE IF NOT EXISTS item_groups(id INTEGER PRIMARY KEY, updated_at VARCHAR, name VARCHAR);
  CREATE TABLE IF NOT EXISTS todo_items(id INTEGER PRIMARY KEY, updated_at VARCHAR, detail Text, hashcode VARCHAR, group_id INTEGER, checked INTEGER);
  CREATE TABLE IF NOT EXISTS q_items(id INTEGER PRIMARY KEY, updated_at VARCHAR, detail Text, hashcode VARCHAR,quadrant_type INTEGER);`)
  // console.log("初始化db", db.path);
}

export const getGroups = async (): Promise<GroupModel[]> => {
  return await db.select("select * from item_groups")
}
// 插入小组数据
export const insertGroups = async (gps: GroupModel[]) => {
  var tmpSql: string[] = []
  gps.map(g => tmpSql.push(`('${g.id}','${g.name}','${g.updated_at ?? ''}')`))
  if (tmpSql.length !== 0) {
    const sql = "insert into item_groups (id, name, updated_at) values " + tmpSql.join(",") + ";"
    await db.execute(sql)
  }
}

export const DelGroups = async (gid: number = -1) => {
  var sql = `delete from item_groups ${gid > 0 ? 'where id=' + gid : ''};`
  await db.execute(sql);
  // 删除对应items
  clearItemsByGid(gid)
}

export const upGroupName = async (gid: number, name: string) => {
  await db.execute("update item_groups set name = $1 where id = $2", [name, gid]);
}

export const getItems = async (gid: number): Promise<ToDoItemModel[]> => {
  return await db.select("select * from todo_items where group_id = $1", [gid])
}

export const searchItem = async (key: string): Promise<ToDoItemModel[]> => {
  return await db.select("select * from todo_items where detail like '%" + key + "%'")
}

export const insertItems = async (itms: ToDoItemModel[]) => {
  var tmpSql: string[] = []
  itms.map(itm => tmpSql.push(`('${itm.id}','${itm.detail}','${itm.hashcode}','${itm.updated_at}','${itm.group_id}','${Number(itm.checked)}')`))
  if (tmpSql.length !== 0) {
    const sql = "insert into todo_items (id,detail,hashcode,updated_at, group_id, checked) values " + tmpSql.join(",") + ";"
    await db.execute(sql)
  }
}

export const removeItem = async (id: number) => {
  await db.execute("delete from todo_items where id = $1", [id])
}

export const updateItem = async (item: ToDoItemModel) => {
  await db.execute("update todo_items set updated_at=$1,detail=$2,hashcode=$3, checked=$4 where id=$5", [item.updated_at, item.detail, item.hashcode, Number(item.checked), item.id])
}

export const initItems = async (itms: ToDoItemModel[], gid: number) => {
  clearItemsByGid(gid)
  var tmpSql: string[] = []
  itms.map(itm => tmpSql.push(`('${itm.id}','${itm.detail}','${itm.hashcode}','${itm.updated_at}','${itm.group_id}','${Number(itm.checked)}')`))
  if (tmpSql.length !== 0) {
    const sql = "insert into todo_items (id,detail,hashcode,updated_at, group_id, checked) values " + tmpSql.join(",") + ";"
    await db.execute(sql)
    // console.log(sql);
  }
}

export const clearItemsByGid = async (gid: number = -1) => {
  var sql = `delete from todo_items ${gid > 0 ? 'where group_id=' + gid : ''}`
  await db.execute(sql);
}
// 清空数据
export const delAllData = async () => {
  await db.execute("drop table item_groups;drop table todo_items;drop table q_items;")
  await db.close()
  await initDB()
}

// 执行脚本
export const executer = async (sql: string) => {
  return await db.execute(sql)
}

// 执行select脚本
export const executeSelect = async (sql: string) => {
  return await db.select(sql)
}

/**
 * q items
 */
// 清空象限数据
export const clearQuadrant = async (id: number) => {
  var sql = `delete from q_items ${id > 0 ? 'where quadrant_type=' + id : ''}`
  await db.execute(sql);
}
// 插入q items
export const insertQItems = async (q: number, items: QTodoModel[], cls = true) => {
  if ((items ?? []).length === 0) return
  if (cls) clearQuadrant(q)
  var tmpSql: string[] = []
  items.map(itm => tmpSql.push(`('${itm.id}','${itm.detail}','${itm.hashcode}','${itm.updated_at}','${itm.quadrant_type}')`))
  if (tmpSql.length !== 0) {
    const sql = "insert into q_items (id,detail,hashcode,updated_at, quadrant_type) values " + tmpSql.join(",") + ";"
    await db.execute(sql)
  }
}
// 获取items
export const getItemByQuadrant = async (id: number) => {
  return await db.select("select * from q_items where quadrant_type = $1", [id])
}
// 删除q item
export const deleteQItem = async (id: number) => {
  return await db.execute("delete from q_items where id=$1", [id])
}
// 更新q item
export const updateQitemDetail = async (id: number, hashcode: string, updated_at: string, detail: string) => {
  return await db.execute("UPDATE q_items SET detail = $1,hashcode=$2,updated_at=$3 WHERE id= $4", [detail, hashcode, updated_at, id])
}