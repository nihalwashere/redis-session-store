const { UserType, AuthType } = require("./Auth.types");
const {
  UserDetailArgs,
  SignUpArgs,
  LoginArgs,
  LogoutArgs
} = require("./Auth.args");
const {
  UserDetailResolve,
  SignUpResolve,
  LoginResolve,
  LogoutResolve
} = require("./Auth.resolves");

const UserDetail = {
  type: UserType,
  args: UserDetailArgs,
  resolve: UserDetailResolve
};

const SignUp = {
  type: UserType,
  args: SignUpArgs,
  resolve: SignUpResolve
};

const Login = {
  type: AuthType,
  args: LoginArgs,
  resolve: LoginResolve
};

const Logout = {
  type: UserType,
  args: LogoutArgs,
  resolve: LogoutResolve
};

module.exports = {
  UserDetail,
  SignUp,
  Login,
  Logout
};
