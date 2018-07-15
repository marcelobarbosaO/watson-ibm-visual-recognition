const express = require('express');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const port = 5000;

function detectImage(res, image){
  var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'deaa5I_M6x5JPew6B8eLVNWQQStsaxoPPr6Ppy-8MHSb'
  });
  
  var params = {
    url: image
  };
  
  visualRecognition.detectFaces(params, function(err, response) {
    if (err)
      res.send(err);
    else
      res.send(response);
  });
}
//configurando o body parser para pegar POSTS routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/api/getDataImage', (req, res) => {
  var url_image = req.body.image_url;
  detectImage(res, url_image);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});