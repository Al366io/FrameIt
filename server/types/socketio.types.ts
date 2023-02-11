interface ServerToClientEvents {
  pics: (a: string[]) => void;
}

interface ClientToServerEvents {
  joinRoom: (a: string) => void;
  disconnect: (a: string) => void;
}

export { ServerToClientEvents, ClientToServerEvents };
