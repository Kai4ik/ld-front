declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_USER_POOL_ID: string;
      NEXT_PUBLIC_USER_POOL_CLIENT_ID: string;
    }
  }
}

export {};
