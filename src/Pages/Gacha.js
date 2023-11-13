import { useRef, useState } from 'react';
import { useResource } from '../Context/ResourceContext';
import styles from './Gacha.module.css';
import axios from 'axios';
import useScalingText from '../Hooks/useScalingText';

const Gacha = () => {
    const [cardRarity, setCardRarity] = useState("");
    const [cardLoading, setCardLoading] = useState(false);
    const [cardDrawn, setCardDrawn] = useState(false);
    const [cardName, setCardName] = useState("");
    const [canDraw, setCanDraw] = useState(false);
    const [animCount, setAnimCount] = useState(0);

    const NAME_CONTAINER_REF = useRef();
    const NOT_ENOUGH_RESOURCES_REF = useRef();

    const {resourceAmount, updateResourceAmount, addNewCard, cardsObtained} = useResource();

    const houseStarkUrl = 'https://www.anapioficeandfire.com/api/houses/362';

    const houseStarkPull = async (season) => {
        const characterPool = [];
    
        try {
            const response = await axios.get(houseStarkUrl);
            if (response.status !== 200) {
                throw new Error('Failed to retrieve House Stark information.');
            }
    
            const houseInfo = response.data;
            const seriesCharacters = houseInfo.swornMembers;
    
            await Promise.all(seriesCharacters.map(async characterUrl => {
                try {
                    const charResponse = await axios.get(characterUrl);
                    if (charResponse.status === 200 && charResponse.data.tvSeries.includes(season)) {
                        const charInfo = charResponse.data;
                        characterPool.push(charInfo.name);
                    }
                } catch (error) {
                    console.error('Error while fetching character data:', error);
                }
            }));
    
            if (characterPool.length > 0) {
                const randomIndex = Math.floor(Math.random() * characterPool.length);
                const randomCharacter = characterPool[randomIndex];
                return randomCharacter;
            } else {
                return 'No characters from House Stark in the specified season.';
            }
        } catch (error) {
            console.error('Error while fetching House Stark information:', error);
            return 'Failed to retrieve House Stark information.';
        }
    };

    const gachaPull = async () => {
        if (resourceAmount - 1000 >= 0) {
            updateResourceAmount(resourceAmount - 1000);
            setCardLoading(true);
            setCardDrawn(false);

            const rareChance = 30;
            const commonChance = 50;
            const epicChance = 15;
            const legendaryChance = 5;

            let pull = Math.floor((Math.random() * 100) + 1);
            let result;

            switch (true) {
                case pull <= legendaryChance:
                    result = {name: await houseStarkPull('Season 4'), rarity: 'legendary'};
                    break;
                case pull <= epicChance && pull > legendaryChance:
                    result = {name: await houseStarkPull('Season 3'), rarity: 'epic'};
                    break;
                case pull <= rareChance && pull > epicChance:
                    result = {name: await houseStarkPull('Season 2'), rarity: 'rare'};
                    break;
                default:
                    result = {name: await houseStarkPull('Season 1'), rarity: 'common'};
                    break;
            }

            setCardName(result.name)
            setCardRarity(result.rarity);

            setTimeout(() => {
                setCardDrawn(true);
                setCardLoading(false);
                if (cardsObtained.some(card => card.name === result.name && card.rarity === result.rarity)) {
                    switch (true) {
                        case result.rarity === 'legendary':
                            updateResourceAmount((resourceAmount + 2000) - 1000);
                            break;
                        case result.rarity === 'epic':
                            updateResourceAmount((resourceAmount + 1000) - 1000);
                            break;
                        case result.rarity === 'rare':
                            updateResourceAmount((resourceAmount + 500) - 1000);
                            break;
                        case result.rarity === 'common':
                            updateResourceAmount((resourceAmount + 250) - 1000);
                            break;
                        default:
                            break;
                    }
                } else {
                    addNewCard(result);
                }
            }, 1000);
        }
        else {
            console.log('Not enough Resource!');
            setCanDraw(true);
        }
    }

    const handleCardClick = (event) => {
        event.target.classList.add(styles.cardContainerOut);
        setTimeout(() => {
            setCardDrawn(false);
        }, 1000);
    }

    const handleNotEnoughResourcesAnimationEnd = (event) => {
        //event.target.classList.remove(styles.notEnoughResources);
        setAnimCount(animCount + 1);
        console.log(animCount);
        if (animCount === 1) {
            setCanDraw(false);
            setAnimCount(0);
        }
    }

    const CARD_NAME_SCALING = useScalingText(NAME_CONTAINER_REF, .07);
    const NOT_ENOUGH_RESOURCES_SCALING = useScalingText(NOT_ENOUGH_RESOURCES_REF, .08);

    return (
        <div ref={NOT_ENOUGH_RESOURCES_REF} className={styles["gacha-container"]}>
            <div className={styles.gachaCardEmblem1}></div>
            {cardLoading || !cardDrawn ? 
                <div className={styles.waxSeal}></div> : null}
            {cardLoading ? 
                <div className={styles.waxDrip}></div> : null}
            {cardLoading ? 
                <div className={styles.fireAnim}></div> : null}
                <div className={styles.gachaCardEmblem2}></div>
            {cardLoading ? 
                <div className={styles.fireAnim2}></div> : null}
                <div className={styles.fireEyes}></div>
                <div className={styles.fireEyes2}></div>
            {cardDrawn ? 
                <div className={styles.cardContainer} onClick={handleCardClick}>
                    <div className={[styles[`${cardRarity}`], styles.gachaResult].join(' ')}></div>
                    <div className={[styles[`${cardRarity}`], styles.gachaResult2].join(' ')}></div>
                        <div ref={NAME_CONTAINER_REF} className={styles.gachaCard}>
                            <p style={{fontSize: CARD_NAME_SCALING}} className={styles.gachaCardTitle}>{cardName}</p>
                            <div className={styles.gachaCardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/common/${cardName.replace(/\s/g, '')}_common.jpg)`}}></div>
                        </div>
                </div> : null }
                {!cardDrawn ? <div ref={NAME_CONTAINER_REF} className={styles.cardContainer} onClick={gachaPull}>
                    <div className={styles.gachaCardBack}></div>
                </div> : null }
                {canDraw ? <p className={styles.notEnoughResources} style={{fontSize: NOT_ENOUGH_RESOURCES_SCALING}} onAnimationEnd={(event) => handleNotEnoughResourcesAnimationEnd(event)}>Not Enough Resources!</p> : null}
        </div>
    )
}

export default Gacha;