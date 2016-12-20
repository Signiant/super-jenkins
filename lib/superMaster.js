var request = require('request');
var async = require('async');

function SuperMaster(masters){
    this.cache = {};
    this.masters = masters;

    // Initialize cache with empty list for each master
    masters.forEach((master) => { this.cache[master.name] = [] });
}

SuperMaster.prototype.getJobs = function(callback){
  var self = this;

  async.map(self.masters, (master, callback) => {
    // Issue request against each master
    request.get(master.endpoint + "/api/json", (err, res, body) => {
      var jobs;
      if(err || res.statusCode != 200 ){
        if(res && res.statusCode != 200)
          err = new Error(res.statusMessage);
        console.warn("Request to", master.name, "failed.\nMessage:", err.message);
        jobs = self.cache[master.name]; // Set jobs from cache

        jobs.forEach((job) => {
          job.cached = true;
        });
      }else{
        jobs = JSON.parse(body).jobs;

        jobs.forEach((job) => {
          job.master = master.name;
          job.icon = master.icon || "";
        });

        // Update cached job list for master
        self.cache[master.name] = jobs;
      }

      callback(null, jobs);
    });

  }, (err, jobs) => {
    callback(err, [].concat.apply([], jobs) || []);
  });
}

module.exports = SuperMaster;
