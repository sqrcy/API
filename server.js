require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")

mongoose.connect('[key here]')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Mongoose | Connected to Database"))

app.use((req, res, next) => {

    const auth = {login: '[user here]', password: '[pass here]'} 
  
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  
    if (login && password && login === auth.login && password === auth.password) {
      return next()
    }
  
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send('Unable to Authenticate User') 
  
  })

app.use(express.json())

const milesRouter = require('./routes/miles')
app.use('/miles', milesRouter)

app.listen(3000, () => console.log(`API | Server has been started`))
