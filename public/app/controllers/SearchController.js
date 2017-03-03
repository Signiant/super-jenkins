angular.module('superJenkins').controller('SearchController', ['$scope', 'pinStorage', function($scope, pinStorage){

  $scope.pinned = pinStorage.getPins('pins') || [];
  $scope.jobs;
  $scope.results;
  $scope.showPinned = pinStorage.getDisplay() || false;

  $scope.$watch('jobs', function(){
    $scope.jobs.forEach(function(job){
      job.pinned = $scope.pinned.includes(job.url);
    })

    $scope.results = $scope.jobs.sort(function(a, b){
      var A = a.name.toUpperCase();
      var B = b.name.toUpperCase();
      if(A < B)
        return -1;
      if (A > B)
        return 1;
      return 0;
    })

    // Filter out jobs that appear in 3 or more masters (i.e. common template jobs)
    for(var i = 0; i < $scope.results.length - 1; i++){
      let count = 1;
      while($scope.results[i].name == $scope.results[i + count].name) count++
      if(count >= 3)  $scope.results.splice(i--, count);
    }

    $scope.fuse = new Fuse($scope.jobs, {
      keys: ["name"],
      threshold: 0.3,
      distance: 300
    });
  });

  $scope.inputChanged = function(){
    if($scope.searchText.trim().length === 0)
      $scope.results = $scope.jobs;
    else
      $scope.results = $scope.fuse.search($scope.searchText);
  }

  $scope.togglePin = function($index){
    $scope.results[$index].pinned = !$scope.results[$index].pinned;
    if($scope.results[$index].pinned)
      $scope.pinned.push($scope.results[$index].url);
    else{
      var sIdx = $scope.pinned.indexOf($scope.results[$index].url);
      if(sIdx > -1)
        $scope.pinned.splice(sIdx, 1);
    }

    pinStorage.setPins($scope.pinned);


  }

  $scope.toggleShowPinned = function(){
    $scope.showPinned = !$scope.showPinned;
    pinStorage.setDisplay($scope.showPinned);
  }
}]);
