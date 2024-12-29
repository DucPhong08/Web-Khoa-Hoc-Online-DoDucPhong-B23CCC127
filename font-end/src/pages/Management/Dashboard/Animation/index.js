import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ targetNumber, duration = 2000 }) => {
    const [currentNumber, setCurrentNumber] = useState(0);

    useEffect(() => {
        const increment = targetNumber / (duration / 10);
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(interval);
            }
            setCurrentNumber(Math.round(current));
        }, 1);

        return () => clearInterval(interval);
    }, [targetNumber, duration]);

    return <div>{currentNumber.toLocaleString()}</div>;
};

export default AnimatedNumber;
