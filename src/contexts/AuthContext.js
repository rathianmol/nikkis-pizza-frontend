import {createContext, useState} from 'react';

export const AuthContext = createContext();

function AuthProvider({children}) {
    const[user, setuser] = useState(null);

    const isAuthenticated = () => {
        if(user!=null) return true;
        else return false;
    }
    return (
        <AuthContext.Provider
            value={{user, setUser}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;