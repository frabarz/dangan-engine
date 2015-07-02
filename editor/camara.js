/* global Coordenada */
/* global DR */
function CamaraController($scope) {

    $scope.opacidad = 0;
    $scope.fov = 40;
    $scope.look = new Coordenada(1, 0, 17);
    $scope.position = new Coordenada(25, 0, 30);
    $scope.up = new Coordenada(0, 0, 1);
    $scope.include = {
        look: false,
        pos: false,
        up: false
    };

    $scope.getCurrentState = function () {
        prompt('Estado actual');
    };

    $scope.$watch('opacidad', function (newValue) {
        var video = document.getElementById('video');
        video.style.opacity = newValue;
        video.style.visibility = newValue == 0 ? 'hidden' : 'visible';
        video = null;
    });

    $scope.$watch('fov', function (newValue) {
        DR.camara.fov = newValue;
        DR.camara.updateProjectionMatrix();
        requestAnimationFrame(DR.renderizar);
    });

    $scope.$watchCollection('look', function () {
        DR.camara.lookAt($scope.look.vectorThree);
        requestAnimationFrame(DR.renderizar);
    });

    $scope.$watchCollection('position', function () {
        DR.camara.position.copy($scope.position);
        DR.camara.lookAt($scope.look.vectorThree);
        requestAnimationFrame(DR.renderizar);
    });

    $scope.$watchCollection('up', function () {
        DR.camara.up.copy($scope.up);
        requestAnimationFrame(DR.renderizar);
    });
}