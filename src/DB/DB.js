const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.0',{
    useNewUrlParser : true
})
//'mongodb+srv://MBH:Avatarpower2012@app.hsv9n.mongodb.net/?retryWrites=true&w=majority'