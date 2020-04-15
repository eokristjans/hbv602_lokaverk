

function containsNumber(myString) {
  const value = /\d/.test(myString);
  return value;
}

function containsSymbol(myString) {
  const value = /[!#$%&/()=_?*.]/.test(myString);
  return value;
}

function containsLowerCase(myString) {
  return /[a-z]/.test(myString);
}

function containsUpperCase(myString) {
  return /[A-Z]/.test(myString);
}

module.exports = {
  containsNumber,
  containsSymbol,
  containsLowerCase,
  containsUpperCase,
};
