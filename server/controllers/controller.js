const { AuthTableOwner } = require('../models/model');
const { generateRandomString, ensureExists } = require('../helpers/helpers');
const path = require('path');

async function createIfNotThere(user) {
  const alreadyInDb = await AuthTableOwner.findOne({
    where: { user_email: user.user_email },
  });
  if (alreadyInDb) {
    return;
  } else {
    AuthTableOwner.create(user);
  }
}

exports.createOwner = async (req, res) => {
  try {
    const email = req.body.email;
    const user = {
      user_email: email,
    };
    await createIfNotThere(user);
    res.status(204);
    res.send('true');
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.createParty = async (req, res) => {
  try {
    const email = req.body.email;
    const id = generateRandomString(6);
    const user = await AuthTableOwner.findOne({
      where: { user_email: email },
    });
    if (!user) {
      res.sendStatus(404);
    }
    await AuthTableOwner.update(
      {
        party_id: id,
      },
      {
        where: { user_email: email },
      }
    );
    // res.status(204);
    res.send(id.toString());
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkIfUserHasParty = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await AuthTableOwner.findOne({
      where: { user_email: userEmail },
    });
    if (user.party_id) {
      // console.log('found');
      res.send(user.party_id);
      res.status(200);
    } else {
      // user in db, but no partyId
      // console.log('not found');
      res.send('');
      res.status(204);
    }
  } catch (error) {
    //user not in db OR server error (1st one more likely)
    res.sendStatus(404);
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const id = req.body.id;
    await AuthTableOwner.update(
      {
        party_id: '',
      },
      {
        where: { party_id: id },
      }
    );
    res.send(true);
    res.status(200);
  } catch (error) {
    res.sendStatus(404);
  }
};

exports.saveIncomingPhoto = (req, res) => {
  try {
    const id = req.params.id;
    const { file } = req.files;
    // Move the uploaded image to our upload folder
    let myPath = path.join(__dirname, '../uploads/' + id);
    let isErr = false;
    ensureExists(myPath, function(err) {
      if (err) {
        console.log(err);
        isErr = true;
      }
    })
    if(isErr) {
      console.log('aaa');
      res.sendStatus(500)
      return;
    }
    file.mv(myPath + '/' + file.name);
    // All good
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
