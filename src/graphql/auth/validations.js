const { UserError } = require("graphql-errors");
const { verify } = require("./helper");

const validateAuthorizationHeader = headers => {
  const { authorization = {} } = headers;

  if (!authorization) {
    throw new UserError("Authorization header is required!");
  }

  return authorization;
};

const validateSessionId = authorization => {
  const sessionId = authorization.split(" ")[1];

  if (!sessionId) {
    throw new UserError("Session Id is required!");
  }

  return sessionId;
};

const isSessionValid = session => {
  const { token } = JSON.parse(session);
  if (!token) {
    throw new Error("Token does not exists!");
  }

  const decoded = verify(token);
  const { exp } = decoded;

  if (Date.now() >= exp * 1000) {
    throw new UserError("Session expired, please login to continue!");
  }

  return true;
};

module.exports = {
  validateAuthorizationHeader,
  validateSessionId,
  isSessionValid
};
