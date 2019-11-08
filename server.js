const express = require("express");
const mongoose = require("mongoose");
const GraphqlHTTP = require("express-graphql");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const schema = require("./src/graphql/schema");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

// console.log("process.env.REDIS_URL : ", process.env.REDIS_URL);
// console.log("process.env.MONGO_URL : ", process.env.MONGO_URL);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.info("MongoDB Connected!!!"))
  .catch(err => console.error(err));

app.use(
  "/graphql",
  GraphqlHTTP({
    schema,
    graphiql: true,
    pretty: true
  })
);

app.get("/", (req, res) => {
  res.send("APP IS LIVE!!!");
});

app.post("/login", function(req, res) {
  // when user login set the key to redis.
  req.session.key = req.body.email;
  res.status(200).json({ session: req.session });
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error(err);
    } else {
      res.status(200).json({ session: false });
    }
  });
});

const server = app.listen(PORT, () => {
  console.info(`App is now running on port ${PORT}!!!`);
});

module.exports = { app, server };
