// base.ts - Token storage for AI service
export let token: string = "";

export const setToken = (newToken: string) => {
  token = newToken;
};

export const getToken = (): string => {
  return token;
};
