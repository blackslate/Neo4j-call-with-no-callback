
;(function(){
  /* Place custom URL to Neo4j here */
  Meteor.neo4j.connectionURL = "http://neo4j:1234@localhost:7474"
  /* Allow query execution by the client */
  Meteor.neo4j.allowClientQuery = true
  /* Deny all writing actions on client */
  Meteor.neo4j.set.deny(Meteor.neo4j.rules.write)
})()

