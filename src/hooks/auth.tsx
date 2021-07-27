import React ,{ createContext, ReactNode, useContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContenxt {
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContenxt);

export function AuthProvider({ children }: AuthProviderProps){
  return(
    <AuthContext.Provider value={{
      user: {
        id: '12',
        name: 'gabriel',
        email: 'gabrielç@email.com',
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const context = useContext(AuthContext);
  
  return context;
}