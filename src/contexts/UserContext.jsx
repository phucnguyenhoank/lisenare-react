// src/contexts/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { getLoggedInUsername } from "../utils/jwt";

export const UserContext = createContext({
  username: null,
  setUsername: () => {},
});

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  // Load from localStorage / JWT on mount
  useEffect(() => {
    const user = getLoggedInUsername();
    setUsername(user);
    console.log("CONTEXT USERNAME" + user);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
