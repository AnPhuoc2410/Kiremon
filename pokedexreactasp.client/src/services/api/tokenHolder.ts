let memoryAccessToken: string | null = null;

export const setMemoryToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const getMemoryToken = () => memoryAccessToken;
