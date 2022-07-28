var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

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
