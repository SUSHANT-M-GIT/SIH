import React, { ReactNode } from 'react';

interface UserContextType {
    username: string;
    setUserName: (username: string) => void;
    useremail: string;
    setUserEmail: (email: string) => void;
}

export const UserContext = React.createContext<UserContextType | null>(null);

interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [username, setUserName] = React.useState<string>('');
    const [useremail, setUserEmail] = React.useState<string>('');
    return (
        <UserContext.Provider value={{
            username,
            setUserName,
            useremail,
            setUserEmail
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;