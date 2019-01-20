(function ()
{
    'use strict';

    angular.module('confab')
        .controller('IndexController', function ($scope, $log, $modal, WordService, StorageFactory )
        {
            console.log('IndexController....');
            var vm = this;
            vm.changeGame = changeGame;
            vm.newword='';
            vm.newword_shadow=[];
            vm.wordset = null;
            vm.reset = reset;
            vm.resetMove = resetMove;
            vm.changeletterset = changeletterset;
            vm.changeName = changeName;
            vm.givefocus = givefocus;
            vm.blurelem = blurelem;
            vm.pencilclicked = false;
            StorageFactory.initialise(WordService.fillWords());
            loadCurrentGame();  
            vm.themoves = StorageFactory.getMoves();
            vm.thegames = StorageFactory.getKeys(); 
            vm.openGamesModal = openGamesModal;
            vm.openHistoryModal = openHistoryModal;
            vm.filterTotal = filterTotal;

            vm.wordlist=[];
            vm.wordlistfiltered=[];
            vm.inputbox='';
            vm.listtype="2LW"
            vm.togglelist = togglelist;
        
            getWordlist();



            function getWordlist()
            {
                WordService.getWordlist(vm.listtype).then(function(thelist)
                {
                    vm.wordlist = thelist;
                    vm.wordlistfiltered = thelist;
                });
            }

            function togglelist()
            {
                if(vm.listtype==="2LW")
                {
                    vm.listtype="3LW";
                    getWordlist();
                }
                else
                {
                    vm.listtype="2LW";
                    getWordlist();  
                }
            }

            function changeletterset(index)
            {
                vm.newword_shadow[index].blurred = !(vm.newword_shadow[index].blurred); 
                console.log("helper: ", vm.newword_shadow[index]);
            }    


            function openGamesModal()
            {
              console.log("open games modal...");
              $modal.open({
                  template: '<con-menu></con-menu>',
                  controller:'modalController as vm2',
                  windowClass: 'mymodal',
                  animation:false,
                  resolve:{ controllerscope:function(){return $scope;}}
              });
            }

            function openHistoryModal()
            {
                console.log("open history modal...");
                $modal.open({
                template: '<his-menu></his-menu>',
                controller:'historyController as vm3',
                windowClass: 'mymodal',
                animation:false,
                resolve:{ controllerscope:function(){return $scope;}}
              });
            }

            
            //example of model in the ...as vm notation
            $scope.$watch(function() 
            {
                return vm.inputbox;
            }, 
            function(current, original) 
            {
                vm.wordlistfiltered=[];
                vm.wordlist.forEach(function(word)
                {
                    if(word.includes(current))
                    {
                        vm.wordlistfiltered.push(word);
                    }
                });
            },true);

            
            //listening to letter/enter/backspace clicks on the keyboard 
            $scope.$on('letterAdded' , function(event, obj)
            {
                if(vm.pencilclicked)
                {
                    return;
                }
                if(obj.letter === 13)//Enter key
                {
                    console.log("enter keyy.....");
                    
                    vm.submitForm(true);
                }
                else if(obj.letter === 8)//Backspace key
                {
                    vm.substractletter(true);
                }
                else if(obj.letter > 64 && obj.letter < 91 )//letters
                {
                    vm.addLetter(String.fromCharCode(obj.letter).toLowerCase(), true);
                }
            }); 

            function blurelem(index)
            {
                var elem = document.getElementById('button' + index);
                elem.blur();
            }

            function changeGame(game)
            {
                console.log(game);
                vm.thisgame = game;
                vm.newword = '';
                vm.wordset = StorageFactory.switchKey(game);
                vm.themoves = StorageFactory.getMoves();
                var el = document.getElementById('myinputbox');
                el.value = vm.thisgame;
                vm.pencilclicked = false;
                console.log("changed to " , vm.thisgame ," : ", vm.wordset, vm.themoves);
                console.log("changed to: ", StorageFactory.getCurrentKey(), StorageFactory.getKeys());
            }


            function changeName(name)
            {
                vm.pencilclicked = false;
                var el = document.getElementById('myinputbox');
                if(el.value === vm.thisgame)
                {
                    return;
                }
                if(el.value.length > 2 && !inArray(el.value))
                {
                    var slot = StorageFactory.getGetter(vm.thisgame)(); //get the real slotname
                    StorageFactory.getSetter(el.value)(slot); //create a new slot : newslotname - realslotname
                    StorageFactory.getSetter(vm.thisgame)(); //delete the old slot
                    vm.thegames.splice(vm.thegames.indexOf(vm.thisgame),1, el.value);//delete old value from the dropdown
                    //vm.thegames.push(el.value);//add the new value to the dropdown.
                    vm.thisgame = el.value;
                    vm.themoves = StorageFactory.getMoves();
                    console.log("changed to :",vm.themoves, vm.thisgame, StorageFactory.getCurrentKey(),StorageFactory.getKeys());
                }
                console.log(vm.thegames);
            }  

            function inArray(value)
            {
             var double;   
                vm.thegames.forEach(function(val)
                {
                    if(val === value)
                    {
                        double = true;
                    }
                });
                return double;
            }


            function givefocus()
            {
                var el = document.getElementById('myinputbox');
                console.log('give focus', el);
                el.focus();
                el.select();
            }

            function loadCurrentGame()
            {
                var thekey = StorageFactory.getKeys()[StorageFactory.getCurrentKey()];
                vm.wordset = StorageFactory.getGetter(StorageFactory.getGetter(thekey)())();
                WordService.setWords(vm.wordset);
                vm.newword = '';
                vm.thisgame = thekey;
                console.log("Current game :",vm.thisgame );
            }


            function reset()
            {
                var theslot = StorageFactory.getGetter(vm.thisgame)();
                StorageFactory.getSetter(theslot)(WordService.fillWords());
                StorageFactory.getSetter('slot' + (StorageFactory.getCurrentKey() + 1) + '_moves')("");
                StorageFactory.getSetter('slot' + (StorageFactory.getCurrentKey() + 1) + '_shadowmoves')("");
                vm.wordset = StorageFactory.getGetter(StorageFactory.getGetter(vm.thisgame)())();
                vm.themoves = StorageFactory.getMoves();
                vm.newword = '';
                vm.newword_shadow = [];
            }

            vm.parse = function(value)
            {
                return Number(value);
            };

            vm.addLetter = function(letter , fromdirective)
            {
                if(isPossibleToAdd(letter))
                {
                    vm.newword += letter;
                    vm.newword_shadow.push({letter:letter, blurred : false});
                    //console.log(vm.newword_shadow);
                    if(fromdirective)
                    {
                        $scope.$apply();
                    }
                }
            };

            function isPossibleToAdd(letter)
            {
                var howmuch = vm.wordset[letter];
                var inword;
                if(letter !== '?')
                {
                    inword = (vm.newword.match(new RegExp(letter, "g")) || []).length; 
                }
                else
                {
                    inword = (vm.newword.match('\\?') || []).length;
                }

                return (howmuch > inword);
            }

            vm.submitForm = function(fromdirective)
            {
                if (vm.newword === '')
                {
                    return;
                }
                var helper = "";
                vm.newword_shadow.forEach(function(item)
                {
                    if(!(item.blurred) )
                    {
                        helper += item.letter;
                    }
                });
                if(helper === '')
                {
                    vm.newword = '';
                    vm.newword_shadow=[];
                    return;
                }
                vm.wordset = WordService.substractLetters(helper);
                StorageFactory.getSetter(StorageFactory.getGetter(vm.thisgame)())(vm.wordset);
                vm.themoves = StorageFactory.addMove(helper, vm.newword );
                vm.newword = ''; 
                vm.newword_shadow = [];
                if(fromdirective)
                {
                    $scope.$apply();
                }  
            };

            vm.substractletter = function(fromdirective)
            {
                if(vm.newword.length > 0)
                {
                    vm.newword = vm.newword.substring(0,vm.newword.length-1);
                    vm.newword_shadow.splice(vm.newword_shadow.length -1, 1);
                }
                if(fromdirective)//
                {
                    $scope.$apply();
                }
            };

            //add a letter by clicking on the icon
            vm.addToSet = function(key)
            {
                if(WordService.getstaticwords()[key] === vm.wordset[key])//if we go above the maximum amount of a letter
                {
                    console.log("exiting...")
                    return;
                }
                StorageFactory.substractLetter(key);
                
                vm.wordset = WordService.addLetters(key);
                //vm.wordset[key] +=1;
                
                vm.themoves = StorageFactory.getMoves();
                StorageFactory.getSetter(StorageFactory.getGetter(vm.thisgame)())(vm.wordset);
            };

            function resetMove(index)
            {
                vm.wordset = StorageFactory.resetMove(index);
                vm.themoves = StorageFactory.getMoves();
            }

            function filterTotal(items) 
            {
                var result = {};
                angular.forEach(items, function(value, key) 
                {
                    if (key !== 'total') 
                    {
                        result[key] = value;
                    }
                });
                return result;
            }

            
        })

        .controller('modalController', function($scope, $modalInstance, controllerscope, StorageFactory, WordService)
        {
            var vm2 = this;
            vm2.thisgame = controllerscope.vm.thisgame;
            vm2.thegames = controllerscope.vm.thegames;
            vm2.changeGame = changeGame;
            vm2.close = close;

            function changeGame(game)
            {
                controllerscope.vm.changeGame(game);

            }

            function close()
            {
                $modalInstance.close('cancel');
            };
        })

        .controller('historyController', function($scope, $modalInstance, controllerscope, StorageFactory, WordService)
        {
            var vm3 = this;
            vm3.themoves = controllerscope.vm.themoves;
            vm3.resetMove = resetMove;
            vm3.close = close;

            function resetMove(index)
            {
                controllerscope.vm.resetMove(index);
                close();
            }

            function close()
            {
                $modalInstance.close('cancel');
            }
        })
        .filter('myfilter', function()
        {   
            //console.log(item);
            return function(item)
            {
                return item;
            };
        });
        
})();


