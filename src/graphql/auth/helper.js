const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const privateKEY = fs.readFileSync("./src/graphql/auth/private.key", "utf8");
const publicKEY = fs.readFileSync("./src/graphql/auth/public.key", "utf8");
const UserModel = require("../../mongo/models/User");
const { getKey } = require("../../redis/helper");
const { EXPIRE_IN_HOURS, JWT_SIGNING_ALGORITHM } = require("../../config");

// const i = "MyCorp";
// const s = email;
// const a = "https://mycorp.in";
// const expiresIn = "12h";
// const algo = "RS256"; // RSA [ "RS256", "RS384", "RS512" ]

const sign = email => {
  const payload = {
    email
  };

  const signOptions = {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: EXPIRE_IN_HOURS,
    algorithm: JWT_SIGNING_ALGORITHM
  };
  const token = jwt.sign(payload, privateKEY, signOptions);
  // console.log("Token :" + token);
  return token;
};

const verify = token => {
  const verifyOptions = {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: EXPIRE_IN_HOURS,
    algorithm: [JWT_SIGNING_ALGORITHM]
  };
  const decoded = jwt.verify(token, publicKEY, verifyOptions);
  // console.log("\nJWT verification result: " + JSON.stringify(decoded));
  return decoded;
};

// Crypto
const hash = (input, salt) => {
  // How do we create a hash?
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, "sha512");
  return ["pbkdf2", "10000", salt, hashed.toString("hex")].join("$");

  // md5
  // "password" -> sfdsafnakrn345u894q3u8rhejf328432809ru
  // "password-this-is-some-random-string" -> dnkfja89345jndsbfjwe893282349084sddfgafga
  // "password" -> "password-this-is-a-salt" -> <hash> -> <hash> * 10k times.
};

const getUserByEmail = async email => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }

  return user;
};

const checkIfSessionExistsForUser = async userId => {
  try {
    // check if session exists in redis
    const session = await getKey(userId);

    if (!session) {
      // cache miss
      return false;
    }

    // cache hit
    return userId;
  } catch (err) {
    throw new Error(
      `Failed to check if session exists for user (${userId}) -> `,
      err
    );
  }
};

module.exports = {
  sign,
  verify,
  hash,
  getUserByEmail,
  checkIfSessionExistsForUser
};
