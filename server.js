var config = require('./config/masters');
var express = require('express');
var hbars = require('express-handlebars');
var path = require('path');
var SuperMaster = require('./lib/superMaster.js');

var jenkins = new SuperMaster(config.masters);
var port = process.env.PORT || 8080;
var app = express();

// Configure templating engine
app.engine('handlebars', hbars());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'public'));

// Static assets
app.use('/', express.static(path.resolve(__dirname, "public")));

// index.html
app.get('/', (req, res) => {
  jenkins.getJobs((err, jobs) => {
    // Inject list of jobs into page
    res.render('index', { jobs: JSON.stringify({ "jobs": jobs }) } );
  });
});

app.listen(port);
console.info("Listening on port", port);
