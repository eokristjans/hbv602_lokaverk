/* v3 - Hjálparföll um notendur og meðhöndlun þeirra */

const bcrypt = require('bcryptjs');

// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn.
// Sækjum bara insertApplication fallið.
const {
  insertAppuser,
  selectFromAppuser,
  selectFromAppuserWhereUsernameEquals,
} = require('./db');

const saltRounds = 12;

const {
  // Sækir upplýsingar í .env
  PEPPER: pepper,
} = process.env;

async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password + pepper, user.password);

  if (ok) {
    return user;
  }

  return false;
}

async function findByUsername(username) {
  const list = await selectFromAppuserWhereUsernameEquals(username);

  if (list == null || list[0] == null) {
    // TODO: Error??
    return null;
  }

  return list[0];
}

async function findById(id) {
  const list = await selectFromAppuser(id);

  if (list == null || list[0] == null) {
    // TODO: Error??
    return null;
  }

  return list[0];
}

async function createUser(nafn, netfang, username, password) {
  // Hash the password, do not store the password any longer than necessary.
  await bcrypt.hash(password + pepper, saltRounds, function (err, hash) {
    // Store the user immediately.
    insertAppuser(nafn, netfang, username, hash, false);
  });
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
};
