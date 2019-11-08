const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");

const UserDetailArgs = {
  id: { type: new GraphQLNonNull(GraphQLID) }
};

const SignUpArgs = {
  email: { type: new GraphQLNonNull(GraphQLString) },
  password: { type: new GraphQLNonNull(GraphQLString) }
};

const LoginArgs = {
  email: { type: new GraphQLNonNull(GraphQLString) },
  password: { type: new GraphQLNonNull(GraphQLString) }
};

const LogoutArgs = {
  email: { type: new GraphQLNonNull(GraphQLString) }
};

module.exports = {
  UserDetailArgs,
  SignUpArgs,
  LoginArgs,
  LogoutArgs
};
