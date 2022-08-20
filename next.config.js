require("dotenv").config();
module.exports = {
  env: {
    MONGO_URL: process.env.MONGO_URL,
    MASTER_ADMIN: process.env.MASTER_ADMIN,
    NEXT_ENV: process.env.NEXT_ENV,
  },
};
