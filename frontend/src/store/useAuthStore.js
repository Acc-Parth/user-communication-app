import { create } from "zustand";

export const useAuthStore = create((set) => ({
    name: "Parth Dabholkar",
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
}))