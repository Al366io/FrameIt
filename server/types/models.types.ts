interface User {
  user_email: string;
  id: number;
  party_id: string;
}
interface Party {
  party_id: string;
  id: number;
  pics: string;
  socket_room_id: string;
}

export { User, Party };
