var express = require('express'); 
var fs = require('fs');
var cors = require('cors');

var app = express();
app.use(cors());

var state = false;

var arduinoRequest = new Date();

function appendObject(obj) {

  var config = JSON.parse(fs.readFileSync('./data.txt'));
  config['logs'].push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('./data.txt', configJSON);

}

app.get('/', function(req, res) {
  res.send(state);
});

app.post('/', function (req, res) {
  res.send(state = !state);
  appendObject({
    "date" : new Date(),
    "state": state
  });
});

app.get('/dispositivo/', function(req, res) {
  if((new Date() - arduinoRequest) > 1000)
    res.status(500).send('Device Not Conected');
  else
    res.status(200).send('OK');
});

app.get('/data/', function (req, res) {
  res.send(JSON.parse(fs.readFileSync('./data.txt')));
});

app.get('/:quem', function (req, res) {
  
  if (req.params.quem === "arduino")
    arduinoRequest = new Date();

  res.send(state);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('web app listening on port 3000!');
});
