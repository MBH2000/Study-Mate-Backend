const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017',{
    useNewUrlParser : true
})
//mongodb+srv://MBH:petstore2022@app.hsv9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority