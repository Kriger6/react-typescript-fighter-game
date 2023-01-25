import React from 'react'
import {useEffect ,useState} from 'react'

const HealthBar = ({health} : any) => {
    
  return (
    <div key={health}>
          <div style={{ background: 'yellow', height: '30px' }}></div>
          <div style={{ background: 'blue', width: `${health}%`, position: 'absolute', top: '0', left: '0', right: '0', bottom: '0' }}></div>
    </div>
  )
}

export default HealthBar