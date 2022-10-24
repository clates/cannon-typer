import logo from './logo.svg';
import cannon64 from './assets/cannon-64.png';

import './App.css';
import Fruit from './Fruit';
import { useEffect, useState } from 'react';
import cannon1 from './assets/sounds/cannon1.mp3'
import cannon2 from './assets/sounds/cannon2.mp3'
import cannon3 from './assets/sounds/cannon3.mp3'
import quack from './assets/sounds/quack.wav'
import swoosh from './assets/sounds/swoosh.mp3'
import { BASE_CANNON_SPEED, BASE_FRUIT_ROTATION_SPEED, BASE_FRUIT_SPEED, CHARACTER_SET, GUNSHOT_VOLUME, MAX_TRIES, VARIABILITY_IN_CANNON_SPEED, VARIABILITY_IN_FRUIT_SPEED, VARIABILITY_IN_ROTATION_SPEED } from './constants';
import { cannonFodder } from './cannonfodder';


const getCannonSound = () => {
  switch (Math.floor(Math.random() * 10) % 3) {
    case 0:
      return cannon1
    case 1:
      return cannon2
    case 2:
      return cannon3
    default:
      return cannon1
  }
}

function App() {
  const [fruits, setFruits] = useState([])
  const [misses, setMisses] = useState(0)
  const [runner, setRunner] = useState(null)
  const [score, setScore] = useState(0)
  const [cannonSpeed, setCannonSpeed] = useState(BASE_CANNON_SPEED)

  //Generate a new fruit 
  const addNewFruit = () => {
    const randLetter = CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)]

    //Clean up function for removing this fruit... needs hoisting which is kinda gross.
    const removeFruit = () => {
      setFruits((oldFruits) => oldFruits.filter(fruit => fruit != newFruit))
      document.removeEventListener('keypress', newFruit.keypressTracker);
    }

    //In x seconds, delete this node and clean up the event listener. This indicates that the 

    const newFruit = {
      flightDuration: BASE_FRUIT_SPEED + (Math.random() * VARIABILITY_IN_FRUIT_SPEED),
      rotationSpeed: BASE_FRUIT_ROTATION_SPEED + (Math.random() * VARIABILITY_IN_ROTATION_SPEED),
      // Generate a key for the fruit, probably just a generated uuid for now
      // only needed to prevent DOM rewrites. 
      timestamp: Date.now(),
      src: cannonFodder[Math.floor(Math.random()*cannonFodder.length)],
      keypressTracker: ({ key }) => {
        if (randLetter.toUpperCase() === key.toUpperCase()) {
          //The letter matched so remove the fruit
          removeFruit()

          //TODO: Some sort of score mechanism
          setScore((oldScore) => oldScore + 1)
          setCannonSpeed((oldCannonSpeed) => oldCannonSpeed + 200)
          //Play a swipe sound if the key was correct
          new Audio(swoosh).play()

          //remove timeout
          clearTimeout(missTimeout)
        }
      },
      El: ({ timestamp }) =>
        <Fruit
          character={randLetter}
          img={newFruit.src}
          flightDuration={newFruit.flightDuration}
          rotationSpeed={newFruit.rotationSpeed}

        />
    }

    const missTimeout = setTimeout(() => {
      new Audio(quack).play()
      removeFruit()
      setMisses((old) => old + 1)
    }, newFruit.flightDuration)

    //add the document listener looking for the keystroke
    document.addEventListener('keypress', newFruit.keypressTracker)

    //Update the fruits list for simultaneous fruit flying
    setFruits((oldFruits) => [...oldFruits, newFruit])

    //play a random cannon boom      
    const cannonSound = new Audio(getCannonSound())
    cannonSound.setAttribute('volume', GUNSHOT_VOLUME)
    // cannonSound.play();


    //Because we want *SOME* variability in the cannon, recurse here
    // if (misses < 3) {
    //   setTimeout(() => {
    //     addNewFruit();
    //   }, BASE_CANNON_SPEED + (Math.random() * VARIABILITY_IN_CANNON_SPEED))
    // }
  }

  useEffect(() => {
    setRunner(setInterval(
      addNewFruit, cannonSpeed
    ))
  }, [])

  useEffect(() => {
    if (misses > MAX_TRIES) {
      clearInterval(runner)
      setFruits([])
    }
  }, [misses])


  document.addEventListener('keypress', ({ key }) => {
    if (key === " ") {
      document.location = document.location

    }
  }
  );

  return (
    <div className="App">
      <main className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Christopher!
        </p>
        <p>
          Current score: {score}
        </p>
        <p>
          Press Spacebar to start over.
        </p>
        <div className='cannon'>
          <img src={cannon64} height={"100%"} />
        </div>
        <div className='fruitContainer' style={{ backgroundColor: 'cyan', width: '100%' }}>
          {fruits.map(({ El, timestamp }) => <El key={timestamp} timestamp={timestamp} />)}
        </div>
      </main>
    </div>
  );
}

export default App;
