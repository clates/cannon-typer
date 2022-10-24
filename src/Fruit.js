import cherries from './assets/cherries.svg'
import grape from './assets/grape.svg'
import kiwi from './assets/kiwi.svg'
import lemon from './assets/lemon.svg'
import pumpkin from './assets/pumpkin.svg'
import strawberry from './assets/strawberry.svg'
import watermellon from './assets/watermellon.svg'

function Fruit({
  flightDuration = 5000,
  rotationSpeed = 5000,
  character = "A",
  img
}) {

  return (
    <div className='fruit' style={{
      animation: `move ${flightDuration + 5}ms linear`
    }}>
      <span>{character}</span>
      <img
        src={img}
        style={{
          height: "160px",
          /* Only spin the fruit, to make the letter easier to read*/
          animation: `spin ease-out, spin ${rotationSpeed}ms linear infinite`
        }}></img>
    </div>
  )
}

export default Fruit