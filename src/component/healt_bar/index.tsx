import React from 'react'
import {useRef, useEffect} from 'react'
import {gsap} from 'gsap'

const HealthBar = ({health, side} : any) => {

  const healthRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    gsap.to(healthRef.current, {
      width: `${health}%`
    })
  }, [health]);


  return (
    <>
          <div style={{ background: 'red', height: '30px', width: '100%' }}></div>
          <div ref={healthRef} style={{ background: '#818cf8', width: '100%', position: 'absolute', left: `${side}`, top: '0', right: '0', bottom: '0' }}></div>
    </>
  )
}

export default HealthBar