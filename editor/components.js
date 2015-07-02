angular.module('components', ['jkuri.slimscroll'])
//http://blog.revolunet.com/blog/2013/11/28/create-resusable-angularjs-input-component/
.directive('inputParametro', function() {
    return {
        restrict: 'E',
        scope: {
            label: '='
        },
        require: 'ngModel',
        link: function(scope, iElement, iAttrs, ngModelController) {
            ngModelController.$render = function() {
                iElement.find('.parametro-value').val(ngModelController.$viewValue);
            };
            
            function updateModel(offset) {
                ngModelController.$setViewValue(ngModelController.$viewValue + offset);
                ngModelController.$render();
            }
        },
        templateUrl: 'input-parametro.html'
    };
});