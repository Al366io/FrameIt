const router = require('express').Router();
const {
  createParty,
  checkIfUserHasParty,
  createOwner,
  deleteParty,
  insertUrlInDb,
  getSocketRoom,
  checkIfPartyExists,
} = require('./controllers/controller');

// To check if the user logged in has already an instance in the db, and if not it creates one for him 
// Takes email of the owner as req.body.email and returns 204 if already exists or if its created.
// Returns 500 if not. (This is used also to see if backend is up since it's the first request made by frontend)
router.post('/users/owner', createOwner);

// creates a party for the owner, if he doesnt have one already.
// takes in req.body.email and returns the id of the party just created (also triggers setInterval for that party)
router.post('/users/party/create', createParty);

// checks if user already have a party
// returns the id of that party and 200 if found, otherwise 204 if user is there but doesnt have party
router.get('/users/info/party/:email', checkIfUserHasParty);

// given a partyId, deletes that party
// TODO: ADD SECURITY TO THIS THING! ONLY OWNER SHOULD BE ABLE TO DELETE
router.delete('/party', deleteParty);

router.get('/party', checkIfPartyExists)
// // NOT NEEDED ANYMORE; USING CLOUDINARY.
// router.post('/party/add/:id', saveIncomingPhoto);

// gets the url of cloudinary where a ph is being set and insert it 
// in the database, associated with the party id
// returns true or false
router.post('/party/upload', insertUrlInDb)

// returns the socketIo ID of the room associated with that party.
// so that Frontend can join the room and listen for the data being broadcasted.
router.get('/party/socketRoom/:id', getSocketRoom)

module.exports = router;
