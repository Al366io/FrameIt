import express from 'express';
import * as Controllers from './controllers/controller';

const router = express.Router();

// To check if the user logged in has already an instance in the db, and if not it creates one for him
// Takes email of the owner as req.body.email and returns 204 if already exists or if its created.
// Returns 500 if not. (This is used also to see if backend is up since it's the first request made by frontend)
router.post('/users/owner', Controllers.createOwner);

// creates a party for the owner, if he doesnt have one already.
// takes in req.body.email and returns the id of the party just created (also triggers setInterval for that party)
router.post('/users/party/create', Controllers.createParty);

// checks if user already have a party
// returns the id of that party and 200 if found, otherwise 204 if user is there but doesnt have party
router.get('/users/info/party/:email', Controllers.checkIfUserHasParty);

// given a partyId, deletes that party
// TODO: ADD SECURITY TO THIS THING! ONLY OWNER SHOULD BE ABLE TO DELETE
router.delete('/party', Controllers.deleteParty);
router.get('/party/:id', Controllers.checkIfPartyExists);
router.post('/party/upload', Controllers.insertUrlInDb);

// returns the socketIo ID of the room associated with that party.
// so that Frontend can join the room and listen for the data being broadcasted.
router.get('/party/socketRoom/:id', Controllers.getSocketRoom);
router.get('/party/pics/:partyId', Controllers.getAllPicsFromOneParty);
export default router;
