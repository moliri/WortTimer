Parse.initialize("DVCdj4jdPP9nfqBqJrYE8Cy59AEHTBkaazTzpN1b", "a0T6G6ZHHSJafRmzkZISKSwC8oThNJORrd70Jv4e");

var debuggingBackend = true;

function loadItem(userID, successCallback) {
    var table = Parse.Object.extend('Timer');
    var query = new Parse.Query(table);
    var list = [];
    
    query.equalTo('userId',userID);
    query.find({
        success : function (results) {
            for(var i = 0; i < results.length; i++){
                list.push(results[i]);
                
            }
            
            if(debuggingBackend){
                console.log('Saved Items:');
                console.log(list);
            }
            
            successCallback(list);
            return list;
        },
        
        error : function (error) {
            alert("Error: " + error.code + " " + error.message); 
        }
    });
    return query;
}

function backendAddItem(userId, brewtype, name, firstPhase,secondPhase, boilTime, numOfHops,comment,hop1,hop2,hop3,hop4,hop5) {
                
    var table = Parse.Object.extend("Timer");
    var RecipeTable = new table();

    console.log(userId);
    console.log(brewtype);
    console.log(name);
    console.log(firstPhase);
    console.log(secondPhase);
    console.log(boilTime);
    console.log(numOfHops);
    console.log(comment);
    console.log(hop1);
    console.log(hop2);
    console.log(hop3);
    console.log(hop4);
    console.log(hop5);

    RecipeTable.set("userId", userId);
    RecipeTable.set("brewtype",brewtype)
    RecipeTable.set("name",name);
    RecipeTable.set("firstPhase",firstPhase);
    RecipeTable.set("secondPhase",secondPhase);
    RecipeTable.set("boilTime",boilTime);
    RecipeTable.set("numOfHops", numOfHops);
    RecipeTable.set("comment",comment);    
    RecipeTable.set("hop1",hop1);
    RecipeTable.set("hop2",hop2);
    RecipeTable.set("hop3",hop3);
    RecipeTable.set("hop4",hop4);  
    RecipeTable.set("hop5",hop5);    
    

    RecipeTable.save(null, {
      success: function(RecipeTable) {
        // Execute any logic that should take place after the object is saved.
        alert('Successfully added into your favorite recipes!');
      },
      error: function(RecipeTable, error) {
        
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
}

function backendGetItem(userID, callback){
  var list = [];
	var table = Parse.Object.extend("Timer");
	var query = new Parse.Query(table);
	query.equalTo("userId", userID);
	query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                list.push(object);
            }
            
            if(debuggingBackend){
                console.log(list);
            }
            
            callback(list);
            return list;
          },
          
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
    });
    
  return query;
}

function backendDeleteItem(objectId){

  var table = Parse.Object.extend("Timer");
  var query = new Parse.Query(table);
  query.equalTo("objectId", objectId);
  query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            results[0].destroy({
              success: function(results){alert("Item delete success")},
              error: function(results){}
            });
          },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
    });
return query;
}

