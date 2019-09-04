require('dotenv').config();
import msg from '../data/msgModel.js';

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../data/functions.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/:to/:from', (req, res) => {
  const body = req.params;
  msg.find({to: body.to, from: body.from})
    .then(msgs => res.status(200).json(msgs))
    .catch(err => res.status(500).send(err))
})

router.post('/send', (req, res) => {
  const body = req.body
  msg.insertOne(body)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).send(err))
})

router.delete('/:to/:from', (req, res) => {
  const body = req.params;
  msg.deleteMany({to: body.to, from: body.from})
    .then(deleted => res.status(200).json(deleted))
    .catch(err => res.status(500).send(err))
})

module.exports = router;
