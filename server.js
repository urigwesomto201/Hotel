const express = require('express');
require('./config/database');
const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const roomRouter = require("./routes/roomRoutes")
const PORT = process.env.PORT
const app = express();

app.use(express.json());  
app.use(userRouter);  
app.use(categoryRouter);
app.use(roomRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT :${PORT}`)
})

 
