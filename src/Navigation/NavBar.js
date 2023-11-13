import styles from "./NavBar.module.css";
import {NavLink, useLocation} from 'react-router-dom';
import { useResource } from '../Context/ResourceContext';
import { useEffect, useRef, useState } from 'react';
import useScalingText from "../Hooks/useScalingText";

const NavBar = () => {
    const location = useLocation();

    const NAVBAR_REF = useRef();
    const CARDPOWER_REF = useRef();
    const RESOURCE_REF = useRef();

    const {resourceAmount, cardPower} = useResource();
    const [prevResourceAmount, setPrevResourceAmount] = useState();
    const [resourceUp, setResourceUp] = useState(false);
    const [resourceDown, setResourceDown] = useState(false);
    const [amountChanged, setAmountChanged] = useState(0);

    const NAVBAR_TEXT_SCALING = useScalingText(NAVBAR_REF, .4);

    const handleAnimationEnd = (event) => {
        RESOURCE_REF.current.classList.remove(styles.resourceUp);
        RESOURCE_REF.current.classList.remove(styles.resourceDown);
        event.target.classList.remove(styles.resourceUpTick);
        event.target.classList.remove(styles.resourceDownTick);
        setResourceUp(false);
        setResourceDown(false);
        setPrevResourceAmount(resourceAmount);
    }

    useEffect(() => {
        if (RESOURCE_REF.current) {
            let amountChanged = 0;
            if (prevResourceAmount < resourceAmount) {
                amountChanged = parseInt(resourceAmount) - parseInt(prevResourceAmount);
                RESOURCE_REF.current.classList.add(styles.resourceUp);
                setResourceUp(true);
            } else if (prevResourceAmount > resourceAmount) {
                amountChanged = parseInt(resourceAmount) - parseInt(prevResourceAmount);
                RESOURCE_REF.current.classList.add(styles.resourceDown);
                setResourceDown(true);
            }
            setAmountChanged(amountChanged);
        }
        setPrevResourceAmount(resourceAmount);
    }, [resourceAmount])

    return (
        <nav ref={NAVBAR_REF} className={styles.navBar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <NavLink to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
                        <p style={{fontSize: NAVBAR_TEXT_SCALING}}>🏰 Home</p>
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/stark_banner" className={`${styles.navLink} ${location.pathname === '/stark_banner' ? styles.active : ''}`}>
                        <p style={{fontSize: NAVBAR_TEXT_SCALING}}>🧝‍♂️ Summon</p>
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/cards" className={`${styles.navLink} ${location.pathname === '/cards' ? styles.active : ''}`}>
                        <p style={{fontSize: NAVBAR_TEXT_SCALING}}>🃏 Cards</p>
                    </NavLink>
                </li>
                <li className={styles.infoSection}>
                    <p ref={CARDPOWER_REF} className={styles.battlePower} style={{fontSize: NAVBAR_TEXT_SCALING}}>⚔️ {cardPower}</p>
                    <p ref={RESOURCE_REF} className={styles.resource} style={{fontSize: NAVBAR_TEXT_SCALING}} onAnimationEnd={handleAnimationEnd}>💎 {resourceAmount}
                    {resourceUp ? <p className={styles.resourceUpTick} onAnimationEnd={handleAnimationEnd}>+{amountChanged}</p> : null}
                    {resourceDown ? <p className={styles.resourceDownTick} onAnimationEnd={handleAnimationEnd}>-{amountChanged}</p> : null}
                    </p>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;