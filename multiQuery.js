
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
  "  (a:Node {name:'Hello'})-[:LINK]->(b:Node {name:'World'})" +
  ", b-[:LINK]->a " +
  "RETURN a"
var click = 
  "MATCH (a:Node)-->(b:Node) " +
  "WHERE a.name = {name} " +
  "RETURN b"


if (Meteor.isClient) {
  Session.setDefault("name", "Hello")

  Tracker.autorun(function (){
    // key = "button" (identifies the publish/subscription channel)
    var options = {name: Session.get("name")} // {} with  key
    var link = "b" // same as the key for the RETURNed value
    var subscription = helloWorld.subscribe(key, options, link)
  })

  Template.hello.helpers({
    name: function () {
      return Session.get("name")
    }
  })

  Template.hello.events({
    'click button': function () {
      // helloWorld is a MongoDB Collection
      var cursor = helloWorld.find() //  LocalCollection.Cursor
      var result = cursor.fetch() // array of node objects
      var node = result[0] || {}// first object in array
      var name = node.name || "Not found"
      Session.set("name", name);
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
        console.log("Created: ",error,data)
      }
    })

    helloWorld.publish(key, publishCallback)

    function publishCallback() {
      //  is {name: <"Hello" | "world">}
      console.log(click, this)
      return click
    }
  });
}

