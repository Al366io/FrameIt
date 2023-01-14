const router = require('express').Router();
const {
  createParty,
  checkIfUserHasParty,
  createOwner,
  deleteParty,
  saveIncomingPhoto,
  insertUrlInDb,
  getSocketRoom,
} = require('./controllers/controller');

router.post('/users/owner', createOwner);

router.post('/users/party/create', createParty);

router.get('/users/info/party/:email', checkIfUserHasParty);

router.delete('/party', deleteParty);

router.post('/party/add/:id', saveIncomingPhoto);

// gets the url of cloudinary where a ph is being set and insert it 
// in the database, associated with the party id
// returns true or false
router.post('/party/upload', insertUrlInDb)

/**https://www.frameit.social/party/socketRoom/${id} */
router.get('/party/socketRoom/:id', getSocketRoom)
module.exports = router;
