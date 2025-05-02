require("dotenv").config();

// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  env: {
    MONGO_URL: process.env.MONGO_URL,
    MASTER_ADMIN: process.env.MASTER_ADMIN,
    NEXT_ENV: process.env.NEXT_ENV,
  },
});
