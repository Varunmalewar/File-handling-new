// app create 
const express = require('express');
require('dotenv').config();
const app = express();

//Port find karna hai 
const PORT = process.env.PORT || 5000;


// middleware add karna hai 
app.use(express.json()); 
const fileUpload = require('express-fileupload'); // server uplaod pr upload karta hai 
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
})); // ye temp files ko use karega

// db se connect 
const db = require('./config/database');
db();






// cloud se connect karna hai 
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();



// api route mount 
const upload = require('./routes/FileUpload');
app.use('/api/v1/upload', upload);



// actiivate the server 
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})