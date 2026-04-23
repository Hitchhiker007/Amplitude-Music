import React, {createContext, useState, useContext} from 'react';
import { getAccount } from '../service/auth';

// create the context
const UserContext = createContext(null);

// wraps the whole app and holds the user state
export const UserProvider = ({children}) => {
    // initialise with whatever is already in session storage
    // this handles page refreshes where the user is already logged in
    const [user, setUser] = useState(getAccount());

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

// export custom hook so components can easily access the context
export const useUser = () => useContext(UserContext);