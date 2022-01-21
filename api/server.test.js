const request = require("supertest")
const db = require("../data/dbConfig.js")
const server = require("./server.js")
const Hobbits = require("./hobbits/hobbits-model")

const frodo = {name:"Frodo"}
const sam = {name:"Sam"}
const jimbo = {name:"jimbo"}

beforeAll(async ()=>{
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async ()=>{
    await db("hobbits").truncate()
})
afterAll(async ()=>{
    await db.destroy()
})

describe("server",()=>{
    describe("[GET] /hobbits", ()=>{
        it("responds with 200 ok", async ()=>{
            const res = await request(server).get("/hobbits")
            expect(res.status).toEqual(200)
        })
        it("returns right number of hobbits", async ()=>{
            let res
            await db("hobbits").insert(frodo)
            res = await request(server).get("/hobbits")
            expect(res.body).toHaveLength(1)

            await db("hobbits").insert(sam)
            res = await request(server).get("/hobbits")
            expect(res.body).toHaveLength(2)
        })
        it("returns right format for hobbits",async ()=>{
            await db("hobbits").insert(frodo)
            await db("hobbits").insert(sam)
            const res = await request(server).get("/hobbits")
            expect(res.body[0]).toMatchObject({id:1,...frodo})
            expect(res.body[1]).toMatchObject({id:2,...sam})
        })
    })
    describe("[POST] /hobbits",()=>{
        it("responds with newly created hobbit", async ()=>{
            let res
            res = await request(server).post("/hobbits").send(frodo)
            expect(res.body).toMatchObject({id:1,...frodo})

            res = await request(server).post("/hobbits").send(sam)
            expect(res.body).toMatchObject({id:2,...sam})
        })
        it("new hobbit is added to the database", async ()=>{
            const res = await request(server).post("/hobbits").send(jimbo)

            const updated = await db("hobbits").where({name:"jimbo"}).first()
            expect(updated.name).toEqual("jimbo")
        })
    })
})