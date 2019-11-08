const { UserError } = require("graphql-errors");
const crypto = require("crypto");

// models
const UserModel = require("../../mongo/models/User");

// validations
const {
  validateAuthorizationHeader,
  validateSessionId,
  isSessionValid
} = require("./validations");

// helper
const {
  sign,
  verify,
  hash,
  getUserByEmail,
  checkIfSessionExistsForUser
} = require("./helper");

// redis
const {
  // setKey,
  getKey,
  setKeyWithExpiry,
  delKey
} = require("../../redis/helper");

const { EXPIRE_IN_SECONDS } = require("../../config");

const UserDetailResolve = async (parent, args, request) => {
  try {
    const { email } = args;
    const { headers } = request;
    const authorization = validateAuthorizationHeader(headers);
    const sessionId = validateSessionId(authorization);
    const session = await getKey(sessionId);
    isSessionValid(session);

    const user = await getUserByEmail(email);
    if (!user) {
      throw new UserError(`User with email "${email}" does not exists!`);
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const SignUpResolve = async (parent, args) => {
  try {
    const { email, password } = args;

    const user = await getUserByEmail(email);
    if (user) {
      throw new Error(
        `User with email "${email}" already exists, please enter a valid email!`
      );
    }

    // hash the password and store to db
    const salt = crypto.randomBytes(128).toString("hex");
    const hashedPassword = hash(password, salt);

    // create user
    new UserModel({ email, password: hashedPassword }).save();

    return { email };
  } catch (error) {
    throw new Error(error);
  }
};

const LoginResolve = async (parent, args) => {
  try {
    const { email, password } = args;
    // check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      throw new UserError(
        `User with email "${email}" does not exist! Please signup first!`
      );
    }

    // get the salt from user.password, hash the args.password with the salt and compare with user.password
    const salt = user.password.split("$")[2];
    const hashedPassword = hash(password, salt);

    if (user.password !== hashedPassword) {
      throw new UserError(
        "Password is incorrect, please enter a valid password!"
      );
    }

    // create the jwt token with email as the jwt payload
    const token = sign(email);

    // create the payload to be saved in redis
    const payload = JSON.stringify({ email, token });

    // check if valid session exists for this user already
    let sessionId = await checkIfSessionExistsForUser(user._id);
    if (!sessionId) {
      // valid session does not exist, create a new one
      sessionId = user._id;
      // save the payload to redis with expiry
      await setKeyWithExpiry(sessionId, payload, EXPIRE_IN_SECONDS);
    }

    return { userId: user.id, sessionId };
  } catch (error) {
    throw new Error(error);
  }
};

const LogoutResolve = async (parent, args, request) => {
  const { headers } = request;
  const authorization = validateAuthorizationHeader(headers);
  const sessionId = validateSessionId(authorization);
  const session = await getKey(sessionId);

  if (!session) {
    throw new UserError("Session does not exist!");
  }

  const { token } = JSON.parse(session);
  if (!token) {
    throw new UserError("Token does not exists!");
  }

  const decoded = verify(token);
  const { email } = decoded;
  const deleted = await delKey(sessionId);

  if (!deleted) {
    throw new UserError("Failed to delete session Id!");
  }

  return { email };
};

module.exports = {
  UserDetailResolve,
  SignUpResolve,
  LoginResolve,
  LogoutResolve
};
