const express = require('express')
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/express');
const { Schema } = mongoose;

app.use(express.json())

const userSchema = new Schema({
    name: mongoose.Schema.Types.String,
    age: mongoose.Schema.Types.Number,
    address: mongoose.Schema.Types.String,
    gender: mongoose.Schema.Types.String,
    album: mongoose.Schema.Types.Array,
});

const userModel = mongoose.model('user', userSchema);

router.post('/users', async (req, res) => {
    try {
        if (!req.body.name || !req.body.age || !req.body.address || !req.body.gender) {
            return res.send('Nhập hết tên tuổi số nhà giới tính đi thằng ngu! ')
        }

        const user = await userModel.create({
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
            gender: req.body.gender,
            album: req.body.album,
        })
        res.send(user)


    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})




router.get('/users', async (req, res) => {
    try {
        const user = await userModel.find({})
        if (user.length == 0) {
            res.send("Empty Data!")
        } else {
            res.send(user)
        }

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


router.patch('/users/:userId', async (req, res) => {
    try {
        let userId = await userModel.findById(req.params.userId)
        Object.assign(userId, req.body)
        userId.save()
        res.send(userId)

    } catch (error) {
        console.log(error);
        res.status(404).send('Không tìm thấy userID của mày đang tìm đâu!')
    }
})




router.delete('/users/:userId', async (req, res) => {
    try {
        await userModel.deleteOne(req.params)
        res.send("Đã xóa cái thằng User mày tìm rồi!")

    } catch (error) {
        console.log(error);
        res.status(404).send('Không tìm thấy userID của mày đang tìm đâu!')
    }
})

router.patch('/users/:userId/album', async (req, res) => {
    try {
        const userId = await userModel.findById(req.params.userId)
        const album = userId.album
        const song = {
            id: uuidv4(),
            name: req.body.name,
            author: req.body.author,
            kind: req.body.kind
        }
        album.push(song)
        userId.save()
        res.send(userId)

    } catch (error) {
        console.log(error);
        res.status(404).send('Không tìm thấy userID của mày đang tìm đâu!')
    }
})


router.delete('/users/:userId/album/:songId', async (req, res) => {
    try {
        const userId = await userModel.findById(req.params.userId)
        const album = userId.album
        const song = album.findIndex((song) => song.id == req.params.songId)
        album.splice(song, 1)
        userId.save()
        res.send("đã xóa bài đấy rồi nhé!")
    } catch (error) {
        console.log(error);
        res.status(404).send('Không tìm thấy userID của mày đang tìm đâu!')
    }
})

module.exports = router
