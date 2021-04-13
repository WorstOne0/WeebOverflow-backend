require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("User");

module.exports = async function () {
  const email = process.env.ADMIN_ACCOUNT;
  const password = process.env.ADMIN_PASSWORD;
  const userName = process.env.ADMIN_USERNAME;
  const screenName = process.env.ADMIN_SCREENNAME;
  const profilePicture = process.env.ADMIN_PICTURES;

  const duplicate = await User.findOne({ email }).catch((erro) =>
    console.log(erro)
  );

  // Hash the Password
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!duplicate) {
    await User.create({
      email,
      password: hashedPassword,
      userName,
      screenName,
      profilePicture,
      role: "Admin",
      thirdParty: "None",
    });
  }
};
