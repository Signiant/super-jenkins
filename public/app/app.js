angular.module('superJenkins', [])
.factory('pinStorage', [function(){
    return {
      getPins: function(){
        return JSON.parse(localStorage.getItem('pinned'));
      },
      setPins: function( data){
        localStorage.setItem('pinned', JSON.stringify(data));
      },
      getDisplay: function(){
        return JSON.parse(localStorage.getItem('showPinned'))
      },
      setDisplay: function(data){
        localStorage.setItem('showPinned', data);
      }
    }
}])
.config(function($interpolateProvider){
  $interpolateProvider.startSymbol("{[{");
  $interpolateProvider.endSymbol("}]}");
});
