//@ts-nocheck
// todo: fix sequelize types
import { AuthTableOwner, Party } from '../models/model';
import { io } from '../index';
import generateRandomString from '../helpers/helpers';
import { Request, Response } from 'express';

async function createOwnerIfNotThere(user: { user_email: string }) {
  const alreadyInDb = await AuthTableOwner.findOne({
    where: { user_email: user.user_email },
  });
  if (alreadyInDb) {
    return;
  } else {
    AuthTableOwner.create(user);
  }
}

const createOwner = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    if (!email) throw new Error('Not email in body');
    const user = {
      user_email: email,
    };
    await createOwnerIfNotThere(user);
    res.status(204);
    res.send('true');
  } catch (error) {
    console.log({ error });
    res.sendStatus(500);
  }
};

const createParty = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const partyId = generateRandomString(6);
    const user = await AuthTableOwner.findOne({
      where: { user_email: email },
    });

    if (!user) {
      res.sendStatus(404);
    } else if (user.party_id) {
      res.sendStatus(400);
    } else {
      await AuthTableOwner.update(
        {
          party_id: partyId,
        },
        {
          where: { user_email: email },
        }
      );

      const party = {
        party_id: partyId,
        pics: JSON.stringify([]),
        socket_room_id: generateRandomString(12),
      };

      await Party.create(party);
      res.status(200);
      res.send(partyId);
    }
  } catch (error) {
    console.log({ error });
    res.sendStatus(500);
  }
};

const checkIfUserHasParty = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email;
    const user = await AuthTableOwner.findOne({
      where: { user_email: userEmail },
    });
    if (user.party_id) {
      res.status(200);
      res.send(user.party_id);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(404);
  }
};

const deleteParty = async (req: Request, res: Response) => {
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
    await Party.destroy({
      where: {
        party_id: id,
      },
    });
    res.status(200);
    res.send(true);
  } catch (error) {
    res.sendStatus(404);
  }
};

const insertUrlInDb = async (req: Request, res: Response) => {
  try {
    const { url, partyId } = req.body;
    console.log('Arrived pic for party' + partyId + ' url: ' + url);
    const partyObj = await Party.findOne({
      where: { party_id: partyId },
    });
    console.log('Prev url arr is: ' + partyObj.pics);
    const picsArr = JSON.parse(partyObj.pics);
    picsArr.push(url);
    console.log('New pics arr is: ' + picsArr);
    await Party.update(
      {
        pics: JSON.stringify(picsArr),
      },
      {
        where: { party_id: partyId },
      }
    );
    console.log({ picsArr });
    // emit new pic to room when a new ìc is added to the db.
    io.in(partyObj.socket_room_id).emit('pic', url);
    res.status(200);
    res.send(true);
  } catch (error) {
    res.sendStatus(404);
  }
};

const getSocketRoom = async (req: Request, res: Response) => {
  try {
    const partyId = req.params.id;
    let party = await Party.findOne({
      where: { party_id: partyId },
    });
    if (party) {
      res.status(200);
      res.send(party!.socket_room_id);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const checkIfPartyExists = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let partyObj = await Party.findOne({ where: { party_id: id } });
    if (partyObj) {
      res.status(200);
      res.send({ exists: true });
    } else {
      res.status(404);
      res.send({ exists: false });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getAllPicsFromOneParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const party = await Party.findOne({ where: { party_id: partyId } });
    if (party) {
      const { pics } = party;
      res.status(200).send(pics);
    }
  } catch (error) {
    console.log({ error });
    res.sendStatus(500);
  }
};

export {
  checkIfPartyExists,
  getSocketRoom,
  insertUrlInDb,
  deleteParty,
  checkIfUserHasParty,
  createParty,
  createOwner,
  getAllPicsFromOneParty,
};
