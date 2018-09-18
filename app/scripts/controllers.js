(function ()
{
    'use strict';

    angular.module('confab')
        .controller('IndexController', function ($scope, WordService, StorageFactory )
        {
            console.log('IndexController...');
            var vm = this;
            vm.changeGame = changeGame;
            vm.newword='';
            vm.reset = reset;
            vm.resetMove = resetMove;
            vm.changeName = changeName;
            vm.givefocus = givefocus;
            vm.blurelem = blurelem;
            vm.pencilclicked = false;
            StorageFactory.initialise(WordService.fillWords());
            loadCurrentGame();  
            vm.themoves = StorageFactory.getMoves();
            vm.thegames = StorageFactory.getKeys(); 
            console.log(vm.themoves);
            
            //listening to letter/enter/backspace clicks on the keyboard 
            $scope.$on('letterAdded' , function(event, obj)
            {
                console.log('adding something...', vm.newword);
                if(vm.pencilclicked)
                {
                    return;
                }
                if(obj.letter === 13)//Enter key
                {
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

            $scope.$watch('vm.wordset', function(oldval, newval)
            {
                console.log("wordsest changed...");
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
                //change history set
                vm.themoves = StorageFactory.getMoves();
                var el = document.getElementById('myinputbox');
                el.value = vm.thisgame;
                vm.pencilclicked = false;
                console.log("changed to " , vm.thisgame ," : ", vm.wordset, vm.themoves);
                console.log("current key: ", StorageFactory.getCurrentKey());
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
                    vm.thegames.splice(vm.thegames.indexOf(vm.thisgame),1);//delete old value from the dropdown
                    vm.thegames.push(el.value);//add the new value to the dropdown.
                    vm.thisgame = el.value;
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
                        console.log('double' , double);
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
                console.log('slot' + StorageFactory.getCurrentKey() + '_moves');
                StorageFactory.getSetter('slot' + (StorageFactory.getCurrentKey() + 1) + '_moves')("");
                vm.wordset = StorageFactory.getGetter(StorageFactory.getGetter(vm.thisgame)())();
                vm.themoves = StorageFactory.getMoves();
                vm.newword = '';
            }

            vm.parse = function(value)
            {
                return Number(value);
            };

            vm.addLetter = function(letter , fromdirective)
            {
                console.log("addletter" , letter);
                if(isPossibleToAdd(letter))
                {
                    vm.newword += letter;
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
                vm.wordset = WordService.substractLetters(vm.newword);
                StorageFactory.getSetter(StorageFactory.getGetter(vm.thisgame)())(vm.wordset);
                vm.themoves = StorageFactory.addMove(vm.newword);
                console.log("submitting", vm.themoves);
                vm.newword = ''; 
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
                }
                if(fromdirective)//
                {
                    $scope.$apply();
                }
            };

            vm.addToSet = function(key)
            {
                console.log(key,' : ',vm.wordset[key]);
                if(WordService.getstaticwords()[key] === vm.wordset[key])//if we go above the maximum amount of a letter
                {
                    console.log("exiting...")
                    return;
                }
                StorageFactory.substractLetter(key);
                vm.wordset[key] +=1;
                vm.themoves = StorageFactory.getMoves();
                console.log(key,' : ',vm.wordset[key]);
                StorageFactory.getSetter(StorageFactory.getGetter(vm.thisgame)())(vm.wordset);
            };

            function resetMove(index)
            {
                vm.wordset = StorageFactory.resetMove(index);
                vm.themoves = StorageFactory.getMoves();
            }
            
        });

})();


