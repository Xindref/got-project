import { createContext, useContext, useState } from 'react';

const ResourceContext = createContext();
const homeTheme = new Audio(process.env.PUBLIC_URL + '/sounds/GOT_theme_8bit.mp3');

export const ResourceProvider = ({ children }) => {
    const [resourceAmount, setResourceAmount] = useState(
        parseInt(localStorage.getItem('Obsidian')) || 0
    );
    const [cardPower, setCardPower] = useState(
        parseInt(localStorage.getItem('Card Power')) || 1000
    );
    const [cardsObtained, setCardsObtained] = useState(
        JSON.parse(localStorage.getItem('Cards')) || []
    );

    const updateResourceAmount = (newAmount) => {
        setResourceAmount(newAmount);
        saveToLocalStorage('Obsidian', newAmount);
    };

    const addNewCard = (newCard) => {
        const updatedCards = [...cardsObtained, newCard];
        setCardsObtained(updatedCards);

        const power = updatedCards.reduce((totalPower, card) => {
            switch (true) {
                case card.rarity === 'legendary':
                    return totalPower + 1000;
                case card.rarity === 'epic':
                    return totalPower + 500;
                case card.rarity === 'rare':
                    return totalPower + 250;
                default:
                    return totalPower + 100;
            }
        }, 1000);

        setCardPower(power);
        saveToLocalStorage('Cards', updatedCards);
        saveToLocalStorage('Card Power', power);
    }

    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }

    const playHomeTheme = () => {
        homeTheme.volume = parseFloat(localStorage.getItem('Background Volume'));
        homeTheme.loop = true;
        homeTheme.play();
    }

    const stopHomeTheme = () => {
        homeTheme.currentTime = 0;
        homeTheme.pause();
    }

    const changeHomeThemeVolume = (volume) => {
        saveToLocalStorage('Background Volume', volume / 10);
        homeTheme.volume = volume / 10;
    }

    return (
        <ResourceContext.Provider value={{ resourceAmount, updateResourceAmount, cardPower, addNewCard, cardsObtained, playHomeTheme, stopHomeTheme, changeHomeThemeVolume }}>
        {children}
        </ResourceContext.Provider>
    );
};

export const useResource = () => {
    return useContext(ResourceContext);
};
