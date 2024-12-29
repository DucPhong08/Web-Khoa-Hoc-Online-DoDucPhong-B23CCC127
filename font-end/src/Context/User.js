import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '~/services/User';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        try {
            const data = await getUser();
            setUser(data);
        } catch (error) {
            console.error('Lỗi khi làm mới người dùng:', error);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return <UserContext.Provider value={{ user, setUser, refreshUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
