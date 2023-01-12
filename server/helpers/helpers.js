const fs = require('fs');

exports.generateRandomString = function (length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.ensureExists = (path, cb) =>{
  fs.mkdir(path, { recursive: true }, function (err) {
    if (err) {
      if (err.code == 'EEXIST')
        return cb(null); // Ignore the error if the folder already exists
      else return cb(err); // Something else went wrong
    } else return cb(null); // Successfully created folder
  });
}