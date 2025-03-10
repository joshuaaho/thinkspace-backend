import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage();
export const getUser = () => {
  const store = asyncLocalStorage.getStore();
  if (!store?.user) {
    throw new Error('No user found in context');
  }
  return store.user;
};
