var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/cool', (req, res, next) => {
  res.send('You are aint so COOOOOOOL!')
})

module.exports = router;
