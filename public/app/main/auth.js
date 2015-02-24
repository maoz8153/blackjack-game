blackjack.service('User', ['$localStorage', function ($localStorage) {
    this.$storage = $localStorage;

    this.setUserDetails = function  (userDetails) {
        this.$storage.userDetails = userDetails;
    };

    this.clear = function  () {
        delete this.$storage.userDetails;
    };

}]);

blackjack.service('Security', ['$http', 'User', function ($http, User) {

    this.status = function  (success, error) {
        $http.get('/status').success(function  (res) {
            User.setDetails(res);
            success();
        }).error(error);

    };

    this.login = function  (user, success, error) {
        $http.post('/login', user).success(function  (res) {
            User.setDetails(res);
            success();
        }).error(error);
    };

    this.logout = function  (success, error) {
        $http.post('/logout').success(function  (res) {
            User.clear();
            success();
        }).error(error);
    };

}]);

blackjack.factory('AuthInterceptor', ['$q' , '$rootScope',  function ($q, $rootScope) {
    return {
        'resonseErrror' : function  (rejetion) {
            if (rejetion.status === 401) {
                $rootScope.$broadcast('Auth:Failed');
            }
            return $q.reject(rejetion);
        }
    };
}]);

blackjack.$rootScope.$on('Auth:Failed', function  () {
    User.clearUser();
    $location.path('/login');
})
