'use strict';

const express = require('express');
const authRouter = express.Router();

const Image = require('../src/models/imageModel');
const User = require('../src/models/userModel');
const auth = require('../src/auth/middleware');

/**
 * @route : /signup
 * @params : user
 * @input : request
 */
authRouter.post('/signup', (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then((user) => {
            req.token = user.generateToken();
            req.user = user;
            res.set('token', req.token);
            res.cookie('auth', req.token);
            res.send(req.token);
        }).catch(next);
});

/**
 * @route : /signup
 * @params : user
 * @input : request
 */
authRouter.post('/signin', auth, (req, res, next) => {
    res.cookie('auth', req.token);
    res.send(req.token);
});

/**
 * @route : /images
 * @params : req
 * @input : {}
 */
authRouter.get('/images', (req, res, next) => {
    Image.find({})
        .then(data => {
            res.send(data);
        })
        .catch(() => res.send('no images found '))
})

/**
 * @route : /image/:id
 * @params : user _id
 * @input : request
 */
authRouter.get('/image/:id', (req, res, next) => {
    Image.findOne({
            _id: (req.params.id)
        })
        .then(foundImg => {
            res.send(foundImg);
        })
})

/**
 * @route : /images/:userId
 * @params : userId
 * @input : request
 */
authRouter.get('/images/:userId', (req, res, next) => {
    Image.find({
            userId: (req.params.userId)
        })
        .then(foundImg => {
            res.send(foundImg);
        })
})

/**
 * @route : /images
 * @params : new Image
 * @input : request
 */
authRouter.post('/images', (req, res, next) => {
    let image = new Image(req.body);
    image.save()
        .then(savedImg => {
            res.send(savedImg);
        })
})

/**
 * @route : /images/:id
 * @params : id
 * @input : request
 */
authRouter.put('/images/:id', async (req, res, next) => {
    const image = await Image.findByIdAndUpdate({
        _id: req.params.id
    }, req.body, {})
    image.save()
    res.send(image)
})

/**
 * @route : /image/:id
 * @params : id
 * @input : request
 */
authRouter.delete('/image/:id', (req,res,next) => {
    Image.remove({id: req.params.id})
        .then(res.send('Successfully Deleted'))
})



module.exports = authRouter;