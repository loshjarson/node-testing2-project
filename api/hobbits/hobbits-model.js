const db = require('../../data/dbConfig.js')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('hobbits')
}

function getById(id) {
  return db('hobbits').where({id}).first()
}

async function insert(hobbit) {
  const [id] = await db("hobbits").insert(hobbit)
  return db("hobbits").where({id}).first()
}

async function update(id, changes) {
  const updated = await db("hobbits").update(changes).where({id})
  return updated
}

async function remove(id) {
  const deleted = await getById(id)
  await db("accounts").where("id",id).delete()
  return deleted
}
