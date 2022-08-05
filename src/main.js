const express = require('express')
require('../src/DB/DB')
const swaggerjsdoc = require('swagger-jsdoc')
const swaggerui = require('swagger-ui-express')
const user_router = require('../src/routers/user-router')
//const post_router = require('../src/routers/post-router')
//const item_router = require('../src/routers/item-router')
const options ={
    definition: {
        openapi : "3.0.0",
        info:{
            title : "pet api",
            version:"1.0.0",
            description :"done"
        },
        servers :[
            {
                url: "http://localhost:3000"
            }
        ],
    },
        apis :["./routers/user-router.js"]    
}
const specs = swaggerjsdoc(options)
const app = express()
const port = process.env.PORT || 3000
app.use("/api-docs" , swaggerui.serve , swaggerui.setup(specs))
app.use(express.json())
app.use(user_router)
//app.use(post_router)
//app.use(item_router)

app.listen(port, ()=> {
    console.log('server is up on port ' + port )
})


