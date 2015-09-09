
// Collection
var helloWorld = Meteor.neo4j.collection("helloWorld")
var key = "button"

// Queries
var destroy =
  "MATCH (n:Node) " +
  "OPTIONAL MATCH n-[r:LINK]-() " +
  "DELETE n, r"
var create = 
  "CREATE" +
  "  (a:Node {name:'Hello', keys:[]})" +
  ", (b:Node {name:'World', keys:[]})" +
  "RETURN a, b"
var getNodes = 
  "MATCH (n:Node) " +
  "RETURN n"
var click = 
  "MATCH (a:Node), (b:Node) " +
  "WHERE a.name = {name1} " +
  "AND b.name = {name2} " +
  "CREATE a-[r:LINK {lock:b.name}]->b " +
  "SET a.keys = a.keys + b.name"
  "RETURN b"


if (Meteor.isClient) {
  Template.hello.helpers({
    name: function () {
      return "Click me"
    }
  })

  Template.hello.events({
    'click button': function () {
      // helloWorld is a MongoDB Collection
      var options = {name1: "Hello", name2: "World"}
      Meteor.neo4j.call("addLock", options, function (error, data) {
        // THIS CALLBACK IS NEVER CALLED
        console.log("Click callback", error, data)
      })
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var options = null

    Meteor.N4JDB.query(destroy, options, function(error, data){
      console.log("Destroyed: ",error,data)

      Meteor.N4JDB.query(create, options, createCallback)

      function createCallback(error, data){
        console.log("Created: ", error, data)
      }
    })
  });

  Meteor.neo4j.methods({
    "addLock": function(callback){
      // this is:
      // - a huge object that encapsulates the world, if the caller
      //   does not send an object 
      //   OR
      // - the object sent by the caller
      console.log(click, this)
      return click
    }

    // 'addPlayer': function(){
    //   return 'CREATE (a:Player {_id:"' + String.generate() + '", name: {userName}, score: 0})';
    // }
  });
}

