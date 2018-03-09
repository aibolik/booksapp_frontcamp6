const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const BlogModel = require('../models/blog');
const authMiddleware = require('../middlewares/authMiddleware');

mongoose.connect('mongodb://localhost:27017/frontcamp');
const db = mongoose.connection;

/* GET blogs in database. */
router.get('/', (req, res) => {
  BlogModel.find({}).populate('author').then(articles => {
    // res.render('articles', {articles});
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.send({items: articles});
  });
});

/* GET blog instanace by ID. */
router.get('/:id', (req, res, next) => {
  BlogModel.findById(req.params.id).then(blog => {
    if (!blog) {
      let err = new Error('Not found');
      err.status = 404;
      next(err);
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.send(blog);
  }).catch(err => {
    err.status = 404;
    next(err)
  });
});

/* POST create a blog instance */
router.post('/', authMiddleware, (req, res) => {
  let blog = new BlogModel(req.body);
  blog.save().then(createdBlog => {
    BlogModel.findById(createdBlog._id).populate('author').then(foundBlog => {
      res.setHeader('Allow', '*');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Content-Type', 'application/json');
      res.json(foundBlog);
    })
  })
});

/* PUT update a blog instance */
router.put('/:id', authMiddleware, (req, res, next) => {
  BlogModel.findByIdAndUpdate(req.params.id, req.body, {new: true, upsert: true})
    .then(blog => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.json(blog);
    }).catch(err => {
    err.status = 404;
    next(err);
  });
});

/* DELETE delete a blog instance */
router.delete('/:id', authMiddleware, (req, res, next) => {
  let token = req.headers['authorization'].split(' ')[1];

  let payload = jwt.decode(token);

  BlogModel.findById(req.params.id)
    .then(blog => {

      if (blog.author.toString() === payload.sub) {
        blog.remove().then(deletedBlog => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          res.json({
            id: deletedBlog.id
          });
        })
      } else {
        res.status(403).json({
          success: false,
          message: 'You can not delete other\'s posts'
        });
      }
    }).catch(err => {
    err.status = 404;
    next(err);
  });
});

module.exports = router;
