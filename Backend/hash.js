// hash.js
const bcrypt = require("bcryptjs");

(async () => {
  const password = "Wanwisa92312";
  const hashed = await bcrypt.hash(password, 10);
  console.log("🔐 Hashed password:", hashed);
})();
