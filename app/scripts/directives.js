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
         .directive('conMenu',function($modalStack)
        {
            return{
                restrict:"E",
                templateUrl: 'views/contextMenu.html',
                link: function (scope, element, attrs)
                {
                    var modalwidth = 400;
                    var modalheight = 500  
                    var windowwidth = $(window).width();
                    var windowheight = $(window).height();
                    var posleft = (windowwidth - modalwidth)/2;
                    var postop = (windowheight - modalheight)/2;
                       
                    var stylestring3 = "left:" + posleft + "px;top:" + postop +'px;'; 
                    $("<style/>",{text:'.mymodal{'+ stylestring3 +'} '}).appendTo('head');

                    $('body').on('click', function (event)
                    {
                        if( event.target.id.match(/contextMenu/) === null)
                        {
                            if( document.getElementById('contextMenu') !== null )
                            {
                                $modalStack.dismissAll();
                            }
                        }
                    });
                }
            };
        })

         .directive('hisMenu',function($modalStack)
        {
            return{
                restrict:"E",
                templateUrl: 'views/historyMenu.html',
                link: function (scope, element, attrs)
                {
                    var modalwidth = 400;
                    var modalheight = 500  
                    var windowwidth = $(window).width();
                    var windowheight = $(window).height();
                    var posleft = (windowwidth - modalwidth)/2;
                    var postop = (windowheight - modalheight)/2;
                       
                    var stylestring3 = "left:" + posleft + "px;top:" + postop +'px;'; 
                    $("<style/>",{text:'.mymodal{'+ stylestring3 +'} '}).appendTo('head');

                    $('body').on('click', function (event)
                    {
                        if( event.target.id.match(/historyMenu/) === null)
                        {
                            if( document.getElementById('historyMenu') !== null)
                            {
                                $modalStack.dismissAll();
                            }
                        }
                    });
                }
            };
        }); 

        

        






})();