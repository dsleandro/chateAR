import { createContext, useContext } from 'react';

export const LogedIn = createContext();

export function useLogedIn() {
  return useContext(LogedIn);
}

export const ActiveContacts = createContext();

export function useActivecontacts() {
  return useContext(ActiveContacts);
}

export const Messages = createContext();

export function useMessages() {
  return useContext(Messages);
}