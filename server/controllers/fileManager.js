const express = require('express');
const cors = require('cors');
const multer = require('multer');
const uuid = require("uuid").v4;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const encryption = require('../functions/fileEncryption');
const File = require('../model/file');
const mongodb = require('mongodb')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE = process.env.DATABASE_URL;
const FILE_KEY = process.env.FILE_KEY;
const cipher = require('../functions/cipherMessage')
mongoose.connect(DATABASE);

const createFile = async(userId, key) => {
    const directory = __dirname.replace('controllers', '')
    let path = directory+'/files/'+userId;
    console.log(path)
    const extensions = ['.json','.pmf'];
    const data = [{
        email: '',
        username: '',
        password: '',
        url: ''
    }];
    try{
        fs.writeFileSync(path+extensions[0], JSON.stringify(data), "utf-8")
        console.log('Archivo '+userId+'.json creado!')
        //Proceso para encriptar el archivo
        let fileToEncrypt = fs.readFileSync(path+extensions[0], "utf-8");
        let encrypted = encryption.encrypt(fileToEncrypt, key)
        fs.writeFileSync(path+extensions[1], encrypted, (err, file) =>{
            if(err) return console.error(err.message);
            if(file){
                console.log('File Encrypted successfully')
            }
        })
        //Se borra el archivo .json
        fs.unlinkSync(path+extensions[0])
        //let fileToStore = fs.readFileSync(path+extensions[1], "utf-8");
        //console.log(fileToStore)
        
        // let file = binary(fileToStore)
        //let file = fileToStore
        // console.log('buff')
        // let file = new Buffer.from(a.data, 'base64')
        //Se almacena el archivo en la base de datos
        path = path+extensions[1];
        console.log('path: '+path)
        await File.create({
            userId, path
        })
        // await File.insertOne(file)
        // console.log('archivo guardado')
    }
    catch(err) {
        // Falló la escritura
        console.log('error')
        console.log(err)
    }
}

const updateFile = async(req, res) => {
    try{
        const token = jwt.verify(req.body.token, JWT_SECRET);
        const data = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            url: req.body.url
        }
        let userId = token.userId
        let user = await File.findOne({userId}).exec();
        let userFile = user.file
        let decryptedFile = encryption.decrypt(userFile, token.password)
        let file2 = JSON.parse(decryptedFile);
        console.dir(file2)
        file2.push(data) 
        userFile = JSON.stringify(file2);
        let encryptedFile = encryption.encrypt(userFile, token.password)
        console.log('Archivo encriptado')
        await File.updateOne({userId},{$set: {"file": encryptedFile}})

        console.log('check')
        let show = await File.findOne({userId}).exec();
        let show2 = encryption.decrypt(show.file, token.password)
        let show3 = JSON.parse(show2)
        console.log(show3)
        // fs.writeFileSync(path, file, "utf-8")
        // console.log('Archivo '+userId+'.json creado!')

        // let fileToEncrypt = fs.readFileSync(path+extensions[0], "utf-8");
        // let encrypted = encryption.encrypt(fileToEncrypt, key)
        // fs.writeFileSync(path+extensions[1], encrypted, (err, file) =>{
        //     if(err) return console.error(err.message);
        //     if(file){
        //         console.log('File Encrypted successfully')
        //     }
        // })
        // fs.unlinkSync(path+extensions[0])
        // let fileToSote = fs.readFileSync(path+extensions[1], "utf-8");
        // const obj = {
        //     userId: userId,
        //     file : fileToSote
        // }
        // const response = await File.create(obj, (err, item) =>{
        //     if(err){ console.error(err);}
        //     else{ console.log('Archivo almacenado con exito!')}
        // })
        
        // res.send('ok')
    }
    catch(err) {
        // Falló la escritura
        console.log('error')
        console.log(err)
    }
}

const getFile = async(req, res) => {
    try{
        console.log(req.body)
        console.log('achu')
        const token = jwt.verify(req.body.user.token, JWT_SECRET);
        console.dir(token)
        let userId = token.id
        let user = await File.findOne({userId}).exec();
        let userFilePath = user.path
        console.log('file: '+userFilePath)
        let userFile = fs.readFileSync(userFilePath, (err, file)=>{
            if(err) return console.error(err.message);
            if(file){
                console.log('File read')

            }
        });
        let decryptedFile = encryption.decrypt(userFile, token.password)
        console.log('desencriptado')
        console.dir(decryptedFile)
        let file2 = JSON.parse(decryptedFile);
        console.log('json parse')
        console.dir(file2)
        
        
        let encryptedPasswords = cipher.encryptMessage(file2, FILE_KEY)
        res.send({satus: 'OK', data: encryptedPasswords})
        //res.send({status: 'OK', data: file2})
    }
    catch(err) {
        // Falló la escritura
        console.log('error')
        console.log(err)
        res.send({status: 'NO', message: 'Error al leer el archivo'})
    }
}

module.exports = {createFile, updateFile, getFile}