import React from 'react'

const HealthBar = ({health, side} : any) => {
    
  return (
    <>
          <div style={{ background: 'yellow', height: '30px', width: '100%' }}></div>
          <div style={{ background: 'blue', width: `${health}%`, position: 'absolute', left: `${side}`, top: '0', right: '0', bottom: '0' }}></div>
    </>
  )
}

export default HealthBar