blackjack.controller('authCtrl', ['atuh', function(){
    $scope.login = function  () {
        Security.login(user, function  (res) {
            $location.path('/dashboard');
        });
    };
}]);
