const { AuthTableOwner, Party } = require('../models/model');
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
      res.sendStatus(404); // user not found
      return;
    }
    if (user.party_id) {
      res.sendStatus(400); // bad request, user already has a party
      return;
    }
    await AuthTableOwner.update(
      {
        party_id: id,
      },
      {
        where: { user_email: email },
      }
    );
    const party = {
      party_id: id,
      pics: JSON.stringify([]),
      socket_room_id: generateRandomString(12),
    };
    await Party.create(party);
    // here call the function that will set the interval to update this particular room
    this.triggerSocket(party.socket_room_id, id);
    res.send(id);
    res.status(200);
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
      res.sendStatus(204);
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

// exports.saveIncomingPhoto = (req, res) => {
//   try {
//     const id = req.params.id;
//     const { file } = req.files;
//     // Move the uploaded image to our upload folder
//     let myPath = path.join(__dirname, '../uploads/' + id);
//     let isErr = false;
//     ensureExists(myPath, function (err) {
//       if (err) {
//         console.log(err);
//         isErr = true;
//       }
//     });
//     if (isErr) {
//       console.log('aaa');
//       res.sendStatus(500);
//       return;
//     }
//     file.mv(myPath + '/' + file.name);
//     // All good
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// };

exports.insertUrlInDb = async (req, res) => {
  // JSON.stringify([url,url,url,url])
  try {
    // take variables from body
    const url = req.body.url;
    const partyId = req.body.partyId;
    console.log('Arrived pic for party' + partyId + ' url: ' + url);
    // search the party in the db to get the url array of the pics
    const partyObj = await Party.findOne({
      where: { party_id: partyId },
    });
    console.log('Prev url arr is: ' + partyObj.pics);
    // parse the url string into an actual array
    const picsArr = JSON.parse(partyObj.pics);
    // push the new pic url into that
    picsArr.push(url);
    console.log('New pics arr is: ' + picsArr);
    // update the record in the db
    await Party.update(
      {
        pics: JSON.stringify(picsArr),
      },
      {
        where: { party_id: partyId },
      }
    );
    // all good
    res.send(true);
    res.status(200);
  } catch (error) {
    res.sendStatus(404);
  }
};

exports.getSocketRoom = async (req, res) => {
  try {
    const partyId = req.params.id;
    let party = await Party.findOne({
      where: { party_id: partyId },
    });
    res.status(200);
    res.send(party.socket_room_id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.socketIoUpdateParty = async (socketRoom, id) => {
  try {
    let partyObj = await Party.findOne({
      where: { party_id: id },
    });
    let picsArr = JSON.parse(partyObj.pics);
    io.to(socketRoom).emit('pics', picsArr);
  } catch (error) {
    console.log(error);
  }
  return;
};

exports.triggerSocket = async (socketRoom, partyId) => {
  // every 2 seconds, call this function (socketIoUpdateParty)
  // that will query the db, take the pics array, and broadcast it into the room.
  setInterval(() => {
    this.socketIoUpdateParty(socketRoom, partyId);
  }, 2000);
  return;
};

exports.startSetIntervals = async () => {
  // go into Party, take every party_id, with every socket_room_id
  // and call socketIoUpdateParty on them.
  let parties = await Party.findAll();
  for (let party of parties) {
    this.triggerSocket(
      party.dataValues.socket_room_id,
      party.dataValues.party_id
    );
  }
};
