// create web server
const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');
const { auth } = require('../middleware/auth');

//=================================
//             Comments
//=================================

// save comment
router.post('/saveComment', auth, (req, res) => {
  // save comment information to database
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    // if there's an error, send error message
    if (err) return res.json({ success: false, err });

    // if there's no error, send success message
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        // if there's an error, send error message
        if (err) return res.json({ success: false, err });

        // if there's no error, send result
        return res.status(200).json({ success: true, result });
      });
  });
});

// get comments
router.post('/getComments', (req, res) => {
  // get comments from database
  Comment.find({ postId: req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
      // if there's an error, send error message
      if (err) return res.status(400).send(err);

      // if there's no error, send success message
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;