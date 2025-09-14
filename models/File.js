const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
require('dotenv').config();

const fileSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true

    },
    imageUrl :{
        type : String,
    },
    videoUrl:{
        type : String,
    },
    tags :{
        type: [String],
    },
    email:{
        type: String,
      
    }
})


//post middleware 
fileSchema.post('save', async function(doc){
    try{
        console.log("DOC ",doc)

        // create transporter
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS

            },
        })
        // send mail
        let info = await transporter.sendMail({
            from : `Varun Malewar`,
            to : doc.email,
            subject : "File Uploaded Successfully",
            text : `Your file ${doc.name} has been uploaded successfully. You can view the file at ${doc.imageUrl || doc.videoUrl }`,
        })
        console.log("Message sent ", info);
     
    

    }
    catch(err){
        console.log(err);
    }
})

module.exports = mongoose.model("file", fileSchema);