const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    //console.log(con.connections)
    console.log('DB CONNECTION SUCCESFULL')
}).catch(err => {
    console.log(err)
})

// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// }).then(() => console.log('DB CONNECTION SUCCESFULL'))
// .catch((err) => console.log(err))

const PORT = process.env.PORT || 5001

app.listen(PORT, ()=> console.log(`App running on Port ${PORT}`))