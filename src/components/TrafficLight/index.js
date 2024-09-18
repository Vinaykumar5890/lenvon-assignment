import React, {useState, useEffect} from 'react'
import './index.css'

const GreenLight = ({active}) => (
  <div className={`light ${active ? 'green' : ''}`} />
)

const YellowLight = ({active}) => (
  <div className={`light ${active ? 'yellow' : ''}`} />
)

const RedLight = ({active}) => (
  <div className={`light ${active ? 'red' : ''}`} />
)

const PedestrianButton = ({onClick, disabled}) => (
  <button onClick={onClick} disabled={disabled}>
    Pedestrian Crossing
  </button>
)

const EmergencyOverrideButton = ({onClick}) => (
  <button onClick={onClick} style={{marginLeft: '10px'}}>
    Emergency Override
  </button>
)

const TrafficLight = () => {
  const [currentLight, setCurrentLight] = useState('green')
  const [pedestrianRequested, setPedestrianRequested] = useState(false)
  const [emergencyOverride, setEmergencyOverride] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [pedestrianCountdown, setPedestrianCountdown] = useState(0)

  useEffect(() => {
    let timer

    if (emergencyOverride) {
      setCurrentLight('red')
      setEmergencyOverride(false)
      setCountdown(7)
    } else if (currentLight === 'green') {
      timer = setTimeout(() => {
        setCurrentLight('yellow')
        setCountdown(3)
      }, 10000)
    } else if (currentLight === 'yellow') {
      timer = setTimeout(() => {
        setCurrentLight('red')
        setCountdown(7)
      }, 3000)
    } else if (currentLight === 'red') {
      timer = setTimeout(() => {
        if (pedestrianRequested) {
          setPedestrianCountdown(5) // Flashing pedestrian countdown
          setTimeout(() => {
            setPedestrianRequested(false)
            setPedestrianCountdown(0)
          }, 5000)
        }
        setCurrentLight('green')
        setCountdown(10)
      }, 7000)
    }

    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [currentLight, pedestrianRequested, emergencyOverride])

  const handlePedestrianRequest = () => {
    if (currentLight === 'red' && !pedestrianRequested) {
      setPedestrianRequested(true)
    }
  }

  const handleEmergencyOverride = () => {
    setEmergencyOverride(true)
  }

  return (
    <div className="traffic-light-system ">
      <div className="traffic-light">
        <RedLight active={currentLight === 'red'} />
        <YellowLight active={currentLight === 'yellow'} />
        <GreenLight active={currentLight === 'green'} />
      </div>

      <div className={currentLight === 'green' ? 'greencountdown' : 'disable'}>
        Light will change in: {countdown} seconds
      </div>
      <div
        className={currentLight === 'yellow' ? 'yellowcountdown' : 'disable'}
      >
        Light will change in: {countdown} seconds
      </div>
      <div className={currentLight === 'red' ? 'redcountdown' : 'disable'}>
        Light will change in: {countdown} seconds
      </div>

      {pedestrianRequested && pedestrianCountdown > 0 && (
        <div className="pedestrian-alert">
          <strong>
            Pedestrian crossing! Light will stay red for {pedestrianCountdown}{' '}
            seconds!
          </strong>
        </div>
      )}

      <PedestrianButton
        onClick={handlePedestrianRequest}
        disabled={currentLight !== 'red' || pedestrianRequested}
      />
      <EmergencyOverrideButton onClick={handleEmergencyOverride} />
    </div>
  )
}

export default TrafficLight

