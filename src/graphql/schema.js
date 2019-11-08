const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema } = graphql;
const { UserDetail, SignUp, Login, Logout } = require("./auth");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({ UserDetail })
});

/*
 * Root Mutation
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({ SignUp, Login, Logout })
});

module.exports = new GraphQLSchema({
  query,
  mutation
});
