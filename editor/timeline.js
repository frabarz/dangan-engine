function TimelineController($scope) {
    $scope.timeline = discusion;
    
    var animaster = new Animacion();
    
    $scope.playTimeline = function() {
        console.log($scope.timeline);
        animaster.loadScript($scope.timeline);
    };
    
    $scope.stopTimeline = function() {
        cancelAnimationFrame(DR.Animacion.cuadro);
    };
}