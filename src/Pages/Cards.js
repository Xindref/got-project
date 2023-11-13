import styles from './Cards.module.css';
import { useResource } from '../Context/ResourceContext';
import { useRef } from 'react';
import useScalingText from '../Hooks/useScalingText';

const Cards = () => {

    const {cardsObtained} = useResource();

    const CARD_HEADER_REF = useRef(null);
    const LEGENDARY_NAME_CONTAINER_REF = useRef(null);
    const EPIC_NAME_CONTAINER_REF = useRef(null);
    const RARE_NAME_CONTAINER_REF = useRef(null);
    const COMMON_NAME_CONTAINER_REF = useRef(null);
    const NO_CARDS_REF = useRef(null);

    const LEGENDARY_NAME_SCALING = useScalingText(LEGENDARY_NAME_CONTAINER_REF, .07);
    const EPIC_NAME_SCALING = useScalingText(EPIC_NAME_CONTAINER_REF, .07);
    const RARE_NAME_SCALING = useScalingText(RARE_NAME_CONTAINER_REF, .07);
    const COMMON_NAME_SCALING = useScalingText(COMMON_NAME_CONTAINER_REF, .07);
    const CARD_HEADER_SCALING = useScalingText(CARD_HEADER_REF, .65);
    const NO_CARDS_TEXT_SCALING = useScalingText(NO_CARDS_REF, .12);

    const LEGENDARY_CARDS = cardsObtained.filter((card) => card.rarity === 'legendary');
    const EPIC_CARDS = cardsObtained.filter((card) => card.rarity === 'epic');
    const RARE_CARDS = cardsObtained.filter((card) => card.rarity === 'rare');
    const COMMON_CARDS = cardsObtained.filter((card) => card.rarity === 'common');

    return (
        <div className={styles.cardsContainer}>
            <div className={styles.legendaryCards}>
                <p ref={CARD_HEADER_REF} className={styles.legendaryTitle} style={{fontSize: CARD_HEADER_SCALING}}>Legendary</p>
                {LEGENDARY_CARDS.length > 0 ? <div className={styles.cardsSubContainer}>
                    {LEGENDARY_CARDS.map((card) => (
                        <div ref={LEGENDARY_NAME_CONTAINER_REF} key={card.name} className={styles.cardDefault}>
                            <div className={styles.cardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/common/${card.name.replace(/\s/g, '')}_common.jpg)`}}></div>
                            <p className={styles.cardName} style={{fontSize: LEGENDARY_NAME_SCALING}}>{card.name}</p>
                        </div>
                    ))}
                </div>  :
                <p ref={NO_CARDS_REF} className={styles.noCards} style={{fontSize: NO_CARDS_TEXT_SCALING}}>
                    No Legendary Cards
                </p> }
            </div>
            <div className={styles.epicCards}>
                <p className={styles.epicTitle} style={{fontSize: CARD_HEADER_SCALING}}>Epic</p>
                {EPIC_CARDS.length > 0 ? <div className={styles.cardsSubContainer}>
                    {EPIC_CARDS.map((card) => (
                        <div ref={EPIC_NAME_CONTAINER_REF} key={card.name} className={styles.cardDefault}>
                            <div className={styles.cardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/common/${card.name.replace(/\s/g, '')}_common.jpg)`}}></div>
                            <p className={styles.cardName} style={{fontSize: EPIC_NAME_SCALING}}>{card.name}</p>
                        </div>
                    ))}
                </div> :
                <p ref={NO_CARDS_REF} className={styles.noCards} style={{fontSize: NO_CARDS_TEXT_SCALING}}>
                    No Epic Cards
                </p> }
            </div>
            <div className={styles.rareCards}>
                <p className={styles.rareTitle} style={{fontSize: CARD_HEADER_SCALING}}>Rare</p>
                {RARE_CARDS.length > 0 ? <div className={styles.cardsSubContainer}>
                    {RARE_CARDS.map((card) => (
                        <div ref={RARE_NAME_CONTAINER_REF} key={card.name} className={styles.cardDefault}>
                            <div className={styles.cardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/common/${card.name.replace(/\s/g, '')}_common.jpg)`}}></div>
                            <p className={styles.cardName} style={{fontSize: RARE_NAME_SCALING}}>{card.name}</p>
                        </div>
                    ))}
                </div> :
                <p ref={NO_CARDS_REF} className={styles.noCards} style={{fontSize: NO_CARDS_TEXT_SCALING}}>
                    No Rare Cards
                </p> }
            </div>
            <div className={styles.commonCards}>
                <p className={styles.commonTitle} style={{fontSize: CARD_HEADER_SCALING}}>Common</p>
                {COMMON_CARDS.length > 0 ? <div className={styles.cardsSubContainer}>
                        {COMMON_CARDS.map((card) => (
                            <div ref={COMMON_NAME_CONTAINER_REF} key={card.name} className={styles.cardDefault}>
                                <div className={styles.cardImage} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/common/${card.name.replace(/\s/g, '')}_common.jpg)`}}></div>
                                <p className={styles.cardName} style={{fontSize: COMMON_NAME_SCALING}}>{card.name}</p>
                        </div>
                    ))}
                </div> :
                <p ref={NO_CARDS_REF} className={styles.noCards} style={{fontSize: NO_CARDS_TEXT_SCALING}}>
                    No Common Cards
                </p> }
            </div>
        </div>
    )
}

export default Cards;