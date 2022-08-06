const express = require('express')
require('../src/DB/DB')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const user_router = require('../src/routers/user-router')
//const post_router = require('../src/routers/post-router')
//const item_router = require('../src/routers/item-router')
const options = {
	definition: {
		openapi: "3.0.n",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);
const app = express()
const port = process.env.PORT || 3000
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json())
app.use(user_router)
//app.use(post_router)
//app.use(item_router)

app.listen(port, ()=> {
    console.log('server is up on port ' + port )
})


