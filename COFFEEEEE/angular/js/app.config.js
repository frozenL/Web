angular.
module("COFFEEEEE").
config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider){
			$locationProvider.hashPrefix('!');
			$routeProvider.
	when('/', {
		templateUrl: '/modules/status/status.template.html',
          controller: 'StatusController'
	}).
when('/leaderboard', {
        templateUrl: '/modules/leaderboard/leaderboard.template.html',
        controller: 'LeaderboardController'
}).
when('/aboutus', {
        templateUrl: '/modules/aboutus/aboutUs.template.html'
//		template: 'hi, this is aboutus'
//	template: '<aboutus-screen></aboutus-screen>'
}).
otherwise('/');
		}]);

