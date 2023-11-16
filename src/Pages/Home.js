import { useState, useEffect, useRef } from 'react';
import { useResource } from '../Context/ResourceContext';
import styles from './Home.module.css';
import useScalingText from '../Hooks/useScalingText';

const Home = () => {

    const {resourceAmount, updateResourceAmount, cardPower, playHomeTheme, stopHomeTheme, changeHomeThemeVolume} = useResource();
    const [enemies, setEnemies] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [volumeMuted, setVolumeMuted] = useState(localStorage.getItem('Volume Muted') === 'true' || false);
    const [previousVolume, setPreviousVolume] = useState(localStorage.getItem('Previous Volume') || 0);

    const startGame = useRef(false);
    const START_GAME_TEXT_REF = useRef(null);

    const walkerHitAudio = new Audio(process.env.PUBLIC_URL + '/sounds/Walker_hit.mp3');
    const walkerDeathAudio = new Audio(process.env.PUBLIC_URL + '/sounds/Walker_death.mp3');

    let enemyKeys = useRef(0);
    const timeoutRef = useRef(null);

    const START_GAME_TEXT_SCALING = useScalingText(START_GAME_TEXT_REF, .85);

    const handleEnemyClick = (event, currEnemy) => {
        currEnemy.enemyHP = currEnemy.enemyHP - Math.floor(cardPower / 200);

        const appElement = document.querySelector('.App');
        const element = event.target;
        const leftPercentage = ((event.clientX - appElement.getBoundingClientRect().left) / appElement.clientWidth) * 100;

        if (currEnemy.enemyHP <= 0 && !currEnemy.dead) {
            currEnemy.dead = true;
            if (!volumeMuted) {
                walkerHitAudio.volume = parseFloat(localStorage.getItem('Background Volume'));
                walkerDeathAudio.volume = parseFloat(localStorage.getItem('Background Volume'));
                walkerHitAudio.play();
                walkerDeathAudio.play();
            }
            element.style.left = `${leftPercentage}%`;
            event.target.classList.add(styles[`enemyDied${currEnemy.type}`]);
            updateResourceAmount(parseInt(resourceAmount) + currEnemy.enemyScore)
        } else {
            event.target.style.filter = 'brightness(5)';
            if (!volumeMuted) {
                walkerHitAudio.volume = parseFloat(localStorage.getItem('Background Volume'));
                walkerHitAudio.currentTime = 0;
                walkerHitAudio.play();
            }
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            event.target.style.filter = 'none';
            timeoutRef.current = null;
        }, 80);
    }

    const handleAnimationEnd = (event, currEnemy) => {

        if (!currEnemy.dead) {
            updateResourceAmount(parseInt(resourceAmount - currEnemy.enemyScore));
            setEnemies((prevEnemies => {
                return prevEnemies.filter((enemy) => enemy.id !== currEnemy.id)
            }));
        }
        else if (currEnemy.dead) {
            setEnemies((prevEnemies => {
                return prevEnemies.filter((enemy) => enemy.id !== currEnemy.id)
            }));
        }
    }


    useEffect(() => {
        let enemyHP = 0;
        let enemyScore = 0;
        let enemyLevel = 1;

        switch (true) {
            case cardPower >= 1750 && cardPower < 3000:
                enemyLevel = 2;
                break;
            case cardPower >= 3000 && cardPower < 5000:
                enemyLevel = 3;
                break;
            case cardPower >= 5000:
                enemyLevel = 4;
                break;
            default:
                break;
        }

        const randomEnemy = Math.floor((Math.random() * enemyLevel) + 1)

        switch (true) {
            case randomEnemy === 1:
                enemyHP = 10;
                enemyScore = 50;
                break;
            case randomEnemy === 2:
                enemyHP = 20;
                enemyScore = 100;
                break;
            case randomEnemy === 3:
                enemyHP = 40;
                enemyScore = 200;
                break;
            case randomEnemy === 4:
                enemyHP = 60;
                enemyScore = 400;
                break;
            default:
                enemyHP = 10;
                enemyScore = 50;
                break;
        }

        const timeoutId = setTimeout(() => {
            if (startGame.current) {
                setEnemies((prevEnemies => {
                    const newEnemyId = enemyKeys.current++;
                    return [...prevEnemies, 
                    {
                        id: newEnemyId, 
                        type: randomEnemy, 
                        enemyHP,
                        enemyScore,
                        dead: false,
                        clicked: true
                    }]
                }));
            }
            
        }, Math.floor(Math.random() * 2000) + 500);

        return () => clearTimeout(timeoutId);
    }, [enemies, startGame.current])

    const handleStartButton = () => {
        if (!localStorage.getItem('Background Volume')) {
            localStorage.setItem('Background Volume', .5);
        }
        setGameStarted(true);
        startGame.current = true;
        playHomeTheme();
    }

    const handleStartTextInitialLoad = (event) => {
        event.target.classList.remove(styles.startGameButtonInitial);
    }

    const handleMuteButton = () => {
        if (volumeMuted) {
            changeHomeThemeVolume(previousVolume);
            localStorage.setItem('Volume Muted', false);
            localStorage.setItem('Previous Volume', previousVolume);
            document.querySelector('#volumeSlider').value = previousVolume;
        } else {
            setPreviousVolume(parseFloat(localStorage.getItem('Background Volume')) * 10);
            localStorage.setItem('Previous Volume', (parseFloat(localStorage.getItem('Background Volume')) * 10));
            changeHomeThemeVolume(0);
            localStorage.setItem('Volume Muted', true);
            document.querySelector('#volumeSlider').value = 0;
        }
        setVolumeMuted(!volumeMuted);
    }

    const handleVolumeChange = (volume) => {
        if (volume >= 1) {
            setVolumeMuted(false);
        } else {
            setVolumeMuted(true);
        }
        changeHomeThemeVolume(volume);
    }

    useEffect(() => {
        return () => {
            setEnemies([]);
            stopHomeTheme();
        };
      }, []);
    
    return (
        <div className={styles.background}>
            { volumeMuted ? <div className={styles.muteButton} onClick={handleMuteButton}>🔇</div> : 
            <div className={styles.muteButton} onClick={handleMuteButton}>🔊</div> }
            <input 
                type='range' 
                max="10"
                id='volumeSlider'
                defaultValue={localStorage.getItem('Background Volume') ? parseFloat(localStorage.getItem('Background Volume') * 10) : 5}
                className={styles.volumeSlider}
                onChange={(event) => handleVolumeChange(event.target.value)}
            ></input>
            {gameStarted ?
            <div className={styles.snow}>
        
                {enemies.map((enemy) => (
                    <div
                        key={enemy.id}
                        className={styles[`enemy${enemy.type}`]}
                        onClick={(event) => handleEnemyClick(event, enemy)}
                        data-enemy-id={enemy.id}
                        onAnimationEnd={(event) => handleAnimationEnd(event, enemy)}
                    >
                    </div>
                ))}
            </div> : 
                <div className={styles.startGameContainer}>
                    <img className={styles.startGameLogo} src={process.env.PUBLIC_URL + '/images/gotLogo.png'} alt=''></img>
                    <div ref={START_GAME_TEXT_REF} style={{fontSize: START_GAME_TEXT_SCALING}} className={[styles.startGameButton, styles.startGameButtonInitial].join(' ')} onClick={handleStartButton} onAnimationEnd={(event) => handleStartTextInitialLoad(event)}>START GAME</div>
                </div> }
        </div>
    )
}

export default Home;