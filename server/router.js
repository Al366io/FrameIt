const router = require("express").Router();
const {createParty, checkIfUserHasParty, createOwner, deleteParty} = require("./controllers/controller");

router.post('/users/owner', createOwner)

router.post('/users/party/create', createParty)

router.get('/users/info/party/:email', checkIfUserHasParty)

router.delete('/party', deleteParty)

module.exports = router;