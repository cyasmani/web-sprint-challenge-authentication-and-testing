const db = require("../../data/dbConfig")

module.exports = {
    add,
    find,
    findBy,
    findById
}

function find() {
    return db('users').orderBy("id")
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id")
}

function findById(id) {
    return db("users").where({id}).first()
}

 async function add(joke) {
    try{
        const [id] = await db("users").insert(joke, "id")
        return findById(id)
    } catch(error) {
        throw error;
    }
}