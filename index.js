var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
// const upload = multer({ dest: './public/data/uploads/' })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
var app = express();

app.use(cors());

// use body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))





// URL Shortener
var mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
console.log(mySecret);
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });


let URLSchema = new mongoose.Schema({
  url: {
      type: String,
  }
})

let URL = mongoose.model('URL', URLSchema);

function isValidURL(str) {
  var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(str)) {
      return false;
  } else {
      return true;
  }
}

app.post('/api/shorturl', function(req, res) {
  let new_url = req.body.url;

  if (isValidURL(new_url)) {
      let doc = new URL({
          url: req.body.url,
      })
      doc.save((err, data) => {
          if (err) return console.error(err);
          res.json({
              original_url: data.url,
              short_url: data.id
          })
      });
  } else {
      res.json({ error: 'invalid url' })
  }

})

app.get('/api/shorturl/:ref', function(req, res) {
  URL.findById({ _id: req.params.ref }, (err, data) => {
      if (err) return console.log(err)
      else {
          res.redirect(data.url)
      }
  });
});











app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});









// File Meta
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res) {
  const fileName = req.file.originalname;
  const fileType = req.file.mimetype;
  const fileSize = req.file.size;
  res.json({name: fileName, type: fileType, size: fileSize})
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Your app is listening on port ' + port)
});
