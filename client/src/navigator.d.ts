declare global {
  interface Navigator {
    share?: (options: ShareData) => Promise<void>;
  }
}