import { useEffect, useRef, useState } from 'react';
import { useResource } from '../Context/ResourceContext';
import styles from './Gacha.module.css';
import axios from 'axios';
import useScalingText from '../Hooks/useScalingText';

const Gacha = () => {
    const [season1StarkPool, setSeason1StarkPool] = useState(localStorage.getItem('season1StarkPool') || []);
    const [season2StarkPool, setSeason2StarkPool] = useState(localStorage.getItem('season2StarkPool') || []);
    const [season3StarkPool, setSeason3StarkPool] = useState(localStorage.getItem('season3StarkPool') || []);
    const [season4StarkPool, setSeason4StarkPool] = useState(localStorage.getItem('season4StarkPool') || []);
    const [loadingPools, setLoadingPools] = useState(false);
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

    const houseStarkPull = async () => {
    if (season1StarkPool.length === 0 || season2StarkPool.length === 0 ||
        season3StarkPool.length === 0 || season4StarkPool.length === 0) {
            setLoadingPools(true);
            try {
                const response = await axios.get(houseStarkUrl);
                if (response.status !== 200) {
                    throw new Error('Failed to retrieve House Stark information.');
                }
        
                const houseInfo = response.data;
                const seriesCharacters = houseInfo.swornMembers;
                const characterPoolS1 = [];
                const characterPoolS2 = [];
                const characterPoolS3 = [];
                const characterPoolS4 = [];
        
                await Promise.all(seriesCharacters.map(async characterUrl => {
                    try {
                        const charResponse = await axios.get(characterUrl);
                        if (charResponse.status === 200 && charResponse.data.tvSeries.includes('Season 1')) {
                            const charInfo = charResponse.data;
                            characterPoolS1.push(charInfo.name);
                        }
                        if (charResponse.status === 200 && charResponse.data.tvSeries.includes('Season 2')) {
                            const charInfo = charResponse.data;
                            characterPoolS2.push(charInfo.name);
                        }
                        if (charResponse.status === 200 && charResponse.data.tvSeries.includes('Season 3')) {
                            const charInfo = charResponse.data;
                            characterPoolS3.push(charInfo.name);
                        }
                        if (charResponse.status === 200 && charResponse.data.tvSeries.includes('Season 4')) {
                            const charInfo = charResponse.data;
                            characterPoolS4.push(charInfo.name);
                        }
                    } catch (error) {
                        console.error('Error while fetching character data:', error);
                    }
                }));

                setSeason1StarkPool(characterPoolS1);
                setSeason2StarkPool(characterPoolS2);
                setSeason3StarkPool(characterPoolS3);
                setSeason4StarkPool(characterPoolS4);

            } catch (error) {
                console.error('Error while fetching House Stark information:', error);
                return 'Failed to retrieve House Stark information.';
            }
        };
        setLoadingPools(false);
    }

    useEffect(() => {
        houseStarkPull();
    }, [])
        
    const gachaPull = async () => {
        if (resourceAmount - 1000 >= 0 && !loadingPools) {
            updateResourceAmount(resourceAmount - 1000);
            setCardLoading(true);
            setCardDrawn(false);

            const rareChance = 30;
            const commonChance = 50;
            const epicChance = 15;
            const legendaryChance = 5;

            let pull = Math.floor((Math.random() * 100) + 1);
            let cardName;
            let result;

            switch (true) {
                case pull <= legendaryChance:
                    cardName = season4StarkPool[Math.floor(Math.random() * season4StarkPool.length)];
                    result = {name: cardName, rarity: 'legendary'};
                    break;
                case pull <= epicChance && pull > legendaryChance:
                    cardName = season3StarkPool[Math.floor(Math.random() * season3StarkPool.length)];
                    result = {name: cardName, rarity: 'epic'};
                    break;
                case pull <= rareChance && pull > epicChance:
                    cardName = season2StarkPool[Math.floor(Math.random() * season2StarkPool.length)];
                    result = {name: cardName, rarity: 'rare'};
                    break;
                default:
                    cardName = season1StarkPool[Math.floor(Math.random() * season1StarkPool.length)];
                    result = {name: cardName, rarity: 'common'};
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
        setAnimCount(animCount + 1);
        if (animCount === 1) {
            setCanDraw(false);
            setAnimCount(0);
        }
    }

    const CARD_NAME_SCALING = useScalingText(NAME_CONTAINER_REF, .07);
    const NOT_ENOUGH_RESOURCES_SCALING = useScalingText(NOT_ENOUGH_RESOURCES_REF, .08);

    return (
        !loadingPools ? 
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
                            <div className={styles.gachaCardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/${cardRarity}/${cardName.replace(/\s/g, '')}_${cardRarity}.jpg)`}}></div>
                        </div>
                </div> : null }
                {!cardDrawn ? <div ref={NAME_CONTAINER_REF} className={styles.cardContainer} onClick={gachaPull}>
                    <div className={styles.gachaCardBack}></div>
                </div> : null }
                {canDraw ? <p className={styles.notEnoughResources} style={{fontSize: NOT_ENOUGH_RESOURCES_SCALING}} onAnimationEnd={(event) => handleNotEnoughResourcesAnimationEnd(event)}>Not Enough Resources!</p> : null}
        </div> : 
        <div>
            <div className={styles.loading}></div>
        </div>
    )
}

export default Gacha;