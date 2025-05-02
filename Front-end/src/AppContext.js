import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [urlParams, setUrlParams] = useState({});

    return (
        <AppContext.Provider value={{ urlParams, setUrlParams }}>
            {children}
        </AppContext.Provider>
    );
};
