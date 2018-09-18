(function()
{
    var app = angular.module('confab',['ngAnimate', 'ui.bootstrap','ui.router' , 'ngCookies', 'angularLocalStorage']);


app.config(function ($stateProvider, $urlRouterProvider)
{
    console.log('Application config...')
    $stateProvider

    // route for the home page
        .state('app', {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'views/home2.html',
                    controller: 'IndexController as vm'
                }
            }
        })
    ;
    $urlRouterProvider.otherwise('/');
})

})();