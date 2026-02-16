import { db } from "../database"

export async function seedEquipment() {
  const database = await db

  await database.run(`
INSERT OR IGNORE INTO equipment(code,name,bonus_exp,bonus_stats)
VALUES
("RING_BASIC","Beginner Ring",1.1,'{"STR":1}'),
("BOOK_INT","Magic Book",1.15,'{"INT":2}'),
("BOOT_DEX","Swift Boots",1.1,'{"DEX":1}')
`)
}
