const mongoose = require("mongoose");
const { Schema } = mongoose;

const modelName = "User";

const UserSchema = new Schema(
  {
    email: { type: String },
    password: { type: String }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model(modelName, UserSchema);

module.exports = User;
