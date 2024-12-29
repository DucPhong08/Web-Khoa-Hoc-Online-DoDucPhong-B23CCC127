import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [isAlertOpen, setAlertOpen] = useState(false);
    const [AlertData, setAlertData] = useState(null);

    const openAlert = (data) => {
        setAlertData(data);
        setAlertOpen(true);
    };

    const closeAlert = () => {
        setAlertOpen(false);
        setAlertData(null);
    };

    return (
        <AlertContext.Provider value={{ isAlertOpen, AlertData, openAlert, closeAlert, setAlertData }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
