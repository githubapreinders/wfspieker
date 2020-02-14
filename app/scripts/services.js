(function()
{
'use strict';
    var app = angular.module('confab');

    app.constant('API_URL', "http://localhost:3000");
    app.factory('WordService', function ($http, API_URL) 
    {
        var staticwords;
        var wordset;
        var thevowels=['a','e','i','o','u'];
        var theconsonants=['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
        console.log('WordService') ;

        return {

            fillWords: fillWords,
            returnWords: returnWords,
            substractLetters : substractLetters,
            setWords : setWords,
            getstaticwords : getstaticwords,
            addLetters : addLetters
        };
        
        function substractLetters(inputletters)
        {
            for (var i = 0; i < inputletters.length; i++) 
            {
                //console.log(wordset[inputletters.charAt(i)] , wordset[inputletters.charAt(i)]);
                if(wordset[inputletters.charAt(i)] > 0)
                {
                  wordset[inputletters.charAt(i)]--;
                  if(thevowels.includes(inputletters.charAt(i)))
                  {
                    console.log('found vowel: ', inputletters.charAt(i));
                    wordset['vowels']--;
                  }
                  if(theconsonants.includes(inputletters.charAt(i)))
                  {
                    console.log('found consonant: ', inputletters.charAt(i));
                    wordset['consonants']--;
                  }
                }
            }
            wordset['total'] = computeTotal();
            
            return wordset;
        }

        


        function addLetters(inputletters)
        {

          console.log(wordset, inputletters);
          for (var i = 0; i < inputletters.length; i++) 
          {
              wordset[inputletters.charAt(i)]++;
          }
          wordset['total'] = computeTotal();
          console.log(wordset);
          return wordset;
        }

        
         function getstaticwords()
         {
          return staticwords;
         } 

        function fillWords()
        {
                wordset = {};
                
                wordset['a'] = 7;
                wordset['b'] = 2;
                wordset['c'] = 2;
                wordset['d'] = 5;
                wordset['e'] = 18;
                wordset['f'] = 2;
                wordset['g'] = 3;
                wordset['h'] = 2;
                wordset['i'] = 4;
                wordset['j'] = 2;
                wordset['k'] = 3;
                wordset['l'] = 3;
                wordset['m'] = 3;
                wordset['n'] = 11;
                wordset['o'] = 6;
                wordset['p'] = 2;
                wordset['q'] = 1;
                wordset['r'] = 5;
                wordset['s'] = 5;
                wordset['t'] = 5;
                wordset['u'] = 3;
                wordset['v'] = 2;
                wordset['w'] = 2;
                wordset['x'] = 1;
                wordset['y'] = 1;
                wordset['z'] = 2;
                wordset['?'] = 2;
                var thetotal = computeTotal();
                wordset['total'] = thetotal;
                wordset['vowels']= 38;
                wordset['consonants'] = 64;
                staticwords = angular.copy(wordset);
                console.log(staticwords, "total: ", thetotal);
                return wordset;
        }

        function computeTotal()
        {
          console.log("compute total...");
          var total = 0 ; 
          for (var property in wordset) 
          {
            if (wordset.hasOwnProperty(property) && 'total' !== property && 'vowels' !== property && 'consonants' !== property) 
            {
              total += wordset[property];
            }
          }
          return total;
        }  

 

        function returnWords()
        {
            return wordset;
        }

        function setWords(words)
        {
            wordset = words;
        }
    });

    app.factory('StorageFactory', function ($http, storage, WordService) 
    {
        
      
      console.log("StorageFactory...");
      var api = {};
      var thekeys;
      var thealiases;
      var currentKey;
      var myaliases;
      
      return {
        getSetter : getSetter,
        getGetter : getGetter,
        verifyKey : verifyKey,
        createAPIForKey : createAPIForKey,
        createSetter : createSetter,
        createGetter : createGetter,
        getAliases : getAliases,
        switchKey : switchKey,
        setCurrentKey : setCurrentKey,
        getCurrentKey : getCurrentKey,
        getNewSlotname : getNewSlotname,
        initialise : initialise,
        deleteAll : deleteAll,
        changeKeys : changeKeys,
        getListOfFiles : getListOfFiles,
        changeAlias : changeAlias,
        getKeys : getKeys,
        addMove : addMove,
        resetMove : resetMove,
        getMoves : getMoves,
        substractLetter : substractLetter
      };

      function initialise(wordobject)
      {
        if(storage.getKeys().length < 2 )
        {
          console.log("adding files...");
          getSetter("slot1")(wordobject);
          getSetter("spel1")("slot1");

          getSetter("slot2")(wordobject);
          getSetter("spel2")("slot2");
          
          getSetter("slot3")(wordobject);
          getSetter("spel3")("slot3");

          getSetter("slot4")(wordobject);
          getSetter("spel4")("slot4");

          getSetter("slot5")(wordobject);
          getSetter("spel5")("slot5");

          getSetter("slot1_moves")("");
          getSetter("slot2_moves")("");
          getSetter("slot3_moves")("");
          getSetter("slot4_moves")("");
          getSetter("slot5_moves")("");

          getSetter("slot1_shadowmoves")("");
          getSetter("slot2_shadowmoves")("");
          getSetter("slot3_shadowmoves")("");
          getSetter("slot4_shadowmoves")("");
          getSetter("slot5_shadowmoves")("");

        }

          thekeys = createKeys(); 
          currentKey = 0;
      }


      function substractLetter(letter)
      {
        var akey = 'slot' + (currentKey + 1) + '_moves';
        var movesstring =getGetter(akey)();
        movesstring = movesstring.slice(0, movesstring.indexOf(letter)) + movesstring.slice(movesstring.indexOf(letter) + 1 , movesstring.length)
        movesstring = movesstring.replace(/,,/g,',');
        movesstring = movesstring.replace(/,$/g,'');
        getSetter(akey)(movesstring);

        var akeyshadow = 'slot' + (currentKey + 1) + '_shadowmoves';
        var movesstringshadow =getGetter(akeyshadow)();
        movesstringshadow = movesstringshadow.slice(0, movesstringshadow.indexOf(letter)) + movesstringshadow.slice(movesstringshadow.indexOf(letter) + 1 , movesstringshadow.length)
        movesstringshadow = movesstringshadow.replace(/,,/g,',');
        movesstringshadow = movesstringshadow.replace(/,$/g,'');
        getSetter(akeyshadow)(movesstringshadow);

      }


      function addMove(word, shadowword)
      {
        var akey = 'slot' + (currentKey + 1) + '_moves';
        var akeyshadow = 'slot' + (currentKey + 1) + '_shadowmoves';
        console.log(currentKey, akey , akeyshadow);
        var movesstring =getGetter(akey)();
        var shadowmovesstring =getGetter(akeyshadow)();
        
                
        var movesarray = movesstring.split(',');
        var movesarrayshadow = shadowmovesstring.split(',');

        
        if(movesarray[0].length===0)
        {
          movesarray=[];
        }
        if(movesarrayshadow[0].length===0)
        {
          movesarrayshadow=[];
        }



        movesarray.push(word); 
        movesarrayshadow.push(shadowword);
        //console.log(movesarray);
        
        getSetter(akey)(movesarray.join());
        getSetter(akeyshadow)(movesarrayshadow.join());

        return getGetter(akeyshadow)().split(',');

      }

      function resetMove(index)
      {
        var akey = 'slot' + (currentKey + 1) ;
        var movesstring =getGetter(akey + '_moves')();
        var newarray = movesstring.split(',');
        var result;
        var tosubstract;
        result = newarray.slice(0, index);
        tosubstract = newarray.slice(index, newarray.length);

        var newwordset = WordService.addLetters(tosubstract.toString().replace(/,/g, ''));
        getSetter(akey)(newwordset);//storing new wordset in memory
        
        console.log("resetting...to : ", result, tosubstract, newwordset);
        getSetter(akey + '_moves')(result.toString());//storing updated history in memory
        

        var movesstringshadow =getGetter(akey + '_shadowmoves')();
        newarray = movesstringshadow.split(',');
        result = newarray.slice(0, index);
        getSetter(akey + '_shadowmoves')(result.toString());//storing updated history in memory
        

        return newwordset;
      }

      function getMoves()
      {
        var akey = 'slot' + (currentKey + 1) + '_shadowmoves';
        var movesstring = getGetter(akey)();
        console.log(movesstring);
        return movesstring.split(',');

      }


      function createKeys()
      {
        var result = [];
        var helper = storage.getKeys();
        helper.forEach(function(val)
        {
          if(val.substring(0,4) !== 'slot' )
          {
            result.push(val);
          }
        });
        console.log(result);
        return result;
      }

      function switchKey (newkey)
      {
        //currentKey = thekeys.indexOf(newkey);
        setCurrentKey(newkey);
        var slotname = getGetter(thekeys[currentKey])();
        WordService.setWords(getGetter(slotname)());
        return getGetter(slotname)();
      }



      function checkIfEmptyKey()
      {
        var keys = storage.getKeys();
        for(var i=0 ;i<keys.length; i++)
        {
          ////console.log("values ",keys[i], localStorage.getItem(keys[i]));
          if (localStorage.getItem(keys[i]).length === 2)
          {
            //console.log("emtpy value! ");
            return true;
          }
        }
        return false;
      }

      function getListOfFiles()
      {
        var files = [];
        if(thekeys === undefined)
        {
          return files;
        }
        thekeys.forEach(function(key)
        {
          files.push(key.title);
        });
        return files;
      }

      function changeKeys(oldname, newname)
      {
        //console.log(oldname , newname,"\n", thekeys, currentKey, "\n");
        var index = -1;
        var islocked = "";
        for(var i= 0 ; i< thekeys.length ; i++)
        {
          if(thekeys[i].title === oldname)
          {
            index = i;
            islocked = thekeys[i].isLocked;
          }
        }
        if(index !== -1)
        {
          if(currentKey.title === oldname)
          {
            currentKey.title = newname;
          }
          thekeys[index].title = newname;
        }
        console.log("after change: ", thekeys,"\n", currentKey, "\n");
      }

      function deleteAll()
      {
        var keys = storage.getKeys();
        keys.forEach(function(key)
        {
          if(key !== 'auth-token')
          {
            getSetter(key)();
          }
        });
      }

      // function switchKey()
      // {
      //     var helper = thekeys.shift();
      //     thekeys.push(helper);
      //     currentKey = thekeys[0];
      //     return thekeys[0];
      // }

      //remove from keys array
      function removeKey(itsAlias)
      {
        var index;
        for(var i =0 ; i< thekeys.length; i++)
        {
          if(thekeys[i].title === itsAlias)
          {
              index = i;
          }
        }
        thekeys.splice(index, 1);

        if(currentKey.title === itsAlias)//check if the file we're working on is deleted
        {
          currentKey = thekeys[0];
        }
      }

      //responding to the add new file button in the file browser;we just add the xml-declaration as its contents
      function getNewSlotname(createdAlias, theid)
      {
        //console.log("id ", theid);
        var newslotname = "slot" + Math.ceil(Math.random()*1000);
        var theobject = { "title" : createdAlias, "isLocked" : false };
        thekeys.push(theobject);
        getSetter(newslotname)('<?xml version="1.0" encoding="UTF-8"?>');
        getSetter(createdAlias)(newslotname);
        var helper = getGetter("myslots")();
        helper[theid] = theobject;
        getSetter("myslots")(helper);
        return newslotname;
      }

      function changeAlias(newname , oldname)
      {
        if(newname === oldname)
        {
          return;
        }
        var slotname = getGetter(oldname)();
        getSetter(newname)(slotname);
        getSetter (oldname)();
        thekeys.splice(thekeys.indexOf(oldname),1);
        thekeys.push(newname);
        setCurrentKey(thekeys.indexOf(newname));
        return newname;
      }


      function getAliases()
      {
        var output = [];

        thealiases.forEach(function(value)
        {
          output.push(getGetter(value)());
        });

      return output;  
      }

      function getKeys()
      {
        return thekeys;
      }

      function setCurrentKey(key)
      {
        currentKey = thekeys.indexOf(key);
        console.log("Setting currentkey:", key,' , ', currentKey); 
      }

      function getCurrentKey()
      {
        return currentKey;
      }      


      

      function getSetter(key)
      {
        verifyKey(key);
        return api[key].setter;
      }
      function getGetter(key)
      {
        verifyKey(key);
        return api[key].getter;
      }

      function verifyKey(key)
      {
        if(!key || angular.isUndefined(key))
        {
          throw new Error("Key[ " + key + " ] is invalid");
        }

        if(!api.hasOwnProperty(key))
        {
          createAPIForKey(key);
        }

      }

      function createAPIForKey(key)
      {
        var setter = createSetter(key);
        var getter = createGetter(key);
        api[key] = 
        {
          setter : setter,
          getter : getter
        };
      }

      function createSetter(key)
      {
        return function(value)
        {
          if(angular.isDefined(value))
          {
            try
            {
              storage.set(key, value);
            }
            catch(error)
            {
              $log.info('[StorageFactory]' + error.message);
            }
          }
          else
          {
            storage.remove(key);
          }
        };
      }

      function createGetter(key)
      {
        return function()
        {
          var value = storage.get(key);
          if(value === null)
          {
            value = undefined;
            var setter = api[key].setter;
            setter(value);
          }
          return value;
        };
      }
    
       



    });



})();


