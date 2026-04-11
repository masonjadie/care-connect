const bcrypt = require('bcryptjs');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function verifyPassword(password, storedHash) {
  return bcrypt.compareSync(password, storedHash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
