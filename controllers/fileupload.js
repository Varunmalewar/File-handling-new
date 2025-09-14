 const File = require('../models/File');
 const cloudinary = require('cloudinary').v2;



 //localFileHandler -> handler function

 exports.localFileUpload = async (req, res) => {
    try{
        //fetch file
        const file = req.files.file;
        console.log("File aayegi jee -> ",file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path ->",path);

        file.mv(path, (err) => {
            console.log(err);
        })
        res.json({
            success: true,
            message: "File uploaded successfully",
            path : path
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }
 }


function isFileTypeSupported(type , supportedTypes){
    return supportedTypes.includes(type);

}

// to uplaod file in cloudinary we will write function which is ame for image and video both 
async function uploadFileToCloudinary(file, folder,quality){
    const options = {folder};
    options.resource_type = "auto"; // ye image and video dono ke liye kaam karega
    
    if(quality){
        options.quality = quality;
    }

    
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


 //image upload ka handler 
 exports.imageUpload = async (req, res)=>{
    try{
       //data fetch
       const {name, tags , email} = req.body;
       console.log(name, tags, email);
       
       //file fetch
         const file = req.files.imageFile; 
         console.log(file);

         //validation
         const supportedTypes = ['png', 'jpeg', 'jpg'];
         const fileType = file.name.split('.')[1].toLowerCase();

         if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
         }



         // file uplaod to cloudinary
         const  response = await uploadFileToCloudinary(file ,"DJ" );

         // db me save karna hai
         const fileData = await File.create({
            name,
            imageUrl : response.secure_url,
            tags : tags ? tags.split(',') : [],
            email
        });

        res.status(201).json({
            success: true,
            message: "File data saved successfully",
            imageUrl : response.secure_url,
        })
      

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })



    }
 }

 //video upload ka handler

 exports.videoUpload = async (req, res)=>{
    try{
         //data fetch
            const {name, tags , email} = req.body;

            //video file fetch
            const file = req.files.videoFile;

            //validation
            const supportedTypes = ['mp4','mp3','mkv', 'mov','avi'];
            const fileType = file.name.split('.')[1].toLowerCase();

            if(!isFileTypeSupported(fileType, supportedTypes)){
                return res.status(400).json({
                    success: false,
                    message: "File type not supported"
                })
            }

            // file upllaod to cloudinary
            const  response = await uploadFileToCloudinary(file ,"DJ", 300, "auto" );

            // db me save karna hai
            const fileData = await File.create({
                name,
                videoUrl : response.secure_url,
                tags : tags ? tags.split(',') : [],
                email
            });

            res.status(201).json({
                success: true,
                message: "File data saved successfully",
                videoUrl : response.secure_url,
            })

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }

 }

 exports.imageSizeReducer = async (req, res)=>{
    try{
        //data fetch
        const {name, tags , email} = req.body;
        console.log(name, tags, email);

        //file fetch
          const file = req.files.imageFilereduce; 
          console.log(file);    

            //validation
            const supportedTypes = ['png', 'jpeg', 'jpg'];
            const fileType = file.name.split('.')[1].toLowerCase();


            if(!isFileTypeSupported(fileType, supportedTypes)){
                return res.status(400).json({
                    success: false,
                    message: "File type not supported"
                })
            }


            // file upllaod to cloudinary
            const  response = await uploadFileToCloudinary(file ,"DJ", 30, "auto" );
            console.log("Response from cloudinary -> ", response);
            res.json({
                success: true,
                message: "Image uploaded successfully",
                data: response
            })      

         

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
 }