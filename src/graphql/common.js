const extractToken = authorization => {
  const token = authorization.split(" ")[1];

  //   if (Date.now() >= exp * 1000) {
  //     return false;
  //   }
};

module.exports = { extractToken };
