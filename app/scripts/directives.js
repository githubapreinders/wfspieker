(function ()
{
    'use strict';

    angular.module('confab')

        

        .directive('registerKeystrokes', function ()
        {
            console.log('register keystrokes...');
            return {
                restrict: "A",
                link: function (scope, element, attrs)
                {
                    $('body').on('keyup', function (event)
                    {
                        var code = event.which || event.keyCode || eventt.charCode ;
                        
                        scope.$broadcast('letterAdded' , {'letter':code});
                        
                    });
                   

                }
            };
        })

        

        






})();