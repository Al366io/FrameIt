const router = require('express').Router();
const {
  createParty,
  checkIfUserHasParty,
  createOwner,
  deleteParty,
  saveIncomingPhoto,
} = require('./controllers/controller');

router.post('/users/owner', createOwner);

router.post('/users/party/create', createParty);

router.get('/users/info/party/:email', checkIfUserHasParty);

router.delete('/party', deleteParty);

router.post('/party/add/:id', saveIncomingPhoto);

module.exports = router;
