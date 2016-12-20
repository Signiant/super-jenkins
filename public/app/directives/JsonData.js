angular.module('superJenkins').directive('jsonData', [ function(){
  return {
    restrict: 'A',
    link: function(scope, element, attributes, controller){
      var jobs;
      try{
        var jobList = JSON.parse(element.html());
        jobs = jobList.jobs;
      }catch(e){
        jobs = [];
      }
      scope[attributes.ngModel] = jobs;
    }
  }
}]);
