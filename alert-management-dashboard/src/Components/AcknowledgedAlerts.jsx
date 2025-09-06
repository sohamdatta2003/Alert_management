import React from 'react'

const AcknowledgedAlerts = ({ alerts, onResolve }) => (
  <div id="acknowledged-section" className="acknowledged-section">
    <div className="section-header right">
      <span className="acknowledged-title">Acknowledged Alerts</span>
      <span className="section-count">{alerts.length}</span>
    </div>
    <div className="acknowledged-cards-container">
      {alerts.map(alert => (
        <div className="acknowledged-alert-card" key={alert.id}>
          <div className="acknowledged-message">{alert.message}</div>
          <div className="elapsed-bar-container">
            <div className="elapsed-label">Time Elapsed: {alert.elapsed} min</div>
            <div className="elapsed-bar-bg">
              <div
                className="elapsed-bar"
                style={{ width: `${Math.min(alert.elapsed, 60) / 60 * 100}%` }}
              />
            </div>
          </div>
          <div className="pending-actions">
            <button className="resolve-btn" onClick={() => onResolve(alert.id)}>
              Resolve
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default AcknowledgedAlerts