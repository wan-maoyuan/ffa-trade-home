import React from 'react'
import './StrategyPage.css'
import doublePositionDemo from '../../assets/images/double-position-demo.png'

const DoublePositionChart: React.FC = () => {
  return (
    <div className="strategy-page double-position-chart-page" style={{ padding: 0, overflow: 'hidden' }}>
      <img
        src={doublePositionDemo}
        alt="双头寸策略展示"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '24px'
        }}
      />
    </div>
  )
}

export default DoublePositionChart
