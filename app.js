// MusiFX
// Coded by Mike McClure
// Exploration of particle gameplay with music responsiveness
var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

app.get('/', function (req, res){
  res.render('/musifx');
});



















// PORT **************************************
app.listen(process.env.PORT || 3000, function(){
  console.log("I HEAR MUSAK... localhost:3000");
});