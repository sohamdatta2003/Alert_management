import React from 'react'

const UnactionableAlerts = ({ alerts }) => (
  <div id="unactionable-section" className="unactionable-section">
    <div className="section-header right">
      <span className="unactionable-title">Un-actionable Alerts</span>
      <span className="section-count">{alerts.length}</span>
    </div>
    <div className="unactionable-cards-container">
      {alerts.map(alert => (
        <div className="unactionable-alert-card" key={alert.id}>
          <div className="unactionable-message">{alert.message}</div>
          <div className="elapsed-bar-container">
            <div className="elapsed-label">Elapsed: {alert.elapsed} min</div>
            <div className="elapsed-bar-bg">
              <div
                className="elapsed-bar unactionable-bar"
                style={{ width: `${Math.min(alert.elapsed, 180) / 180 * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default UnactionableAlerts