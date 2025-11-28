import React from 'react'
import './StrategyPage.css'
import singlePositionDemo from '../../assets/images/single-position-demo.png'

const SinglePositionChart: React.FC = () => {

  return (
    <div className="strategy-page single-position-chart-page" style={{ padding: 0, overflow: 'hidden' }}>
      <img
        src={singlePositionDemo}
        alt="单头寸策略展示"
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

export default SinglePositionChart


