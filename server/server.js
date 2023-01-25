const express = require('express');
const cors = require('cors');
const multer = require('multer');
const uuid = require("uuid").v4;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect("mongodb://127.0.0.1:27017/password_manager");

const JWT_SECRET = process.env.JWT_SECRET;
const authRoutes = require("./routes/auth.js");
const changePasswordRoutes = require("./routes/change-password.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;
    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.get('/img', (req,res)=>{
    res.sendFile(__dirname+'/img/latest.jpg');
});

app.get('/icon', (req,res)=>{
    res.sendFile(__dirname+'/img/laptop.PNG');
});

app.use('/auth', authRoutes);

app.post('/login/verify', (req,res)=>{
    try{
        const token = jwt.verify(req.body.token+'1', JWT_SECRET);
        console.dir(token)
    }catch(error){
        res.json({message: "invalid token"})
    }
    
});

app.use('/change-password', changePasswordRoutes);

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const {originalname} = file;
//         console.log(id)
// ;        const {ids} = id;
        // cb(null, `${uuid()}-${originalname}`);
        cb(null, `${uuid()}-${originalname}`);

    }
})


const fileFilter = (req, file, cb) =>{
    if(file.mimetype.split("/")[0]==='image'){
        cb(null, true)
    }
    else{
        cb(new Error("file is not of the correct type"), false)
    }
}
const upload = multer({storage, fileFilter, limits: { fileSize: 1000000000, files: 1 }});

app.post('/upload', upload.array("file"), (req, res) =>{
    // const { id,  } = req.body.id;
    // client.user('123').update({ image: cookies.get('avatarURL'), });
    res.json({ status: "success"});
})

// const storage = multer.diskStorage({
// 	destination: `${_dirname}/uploads/`,
// 	filename: (req, file, cb) =>{
// 		const fileName = `${Date.now()}${path.extname(file.orginalname)}`;
// 		cb(null, fileName);
// 	}

// })

// const uploadImage = multer({storage}).single('photo');


// app.post('/image', uploadImage, (req,res) =>{
// 	console.log(req.file);
// 	if(req.file) return res.json({msg: 'uploaded'});

// 	res.send('Error');
// })


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));