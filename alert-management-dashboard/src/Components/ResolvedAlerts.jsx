import React from 'react'

const ResolvedAlerts = ({ alerts, onViewDetails }) => (
  <div id="resolved-section" className="resolved-section">
    <div className="section-header right">
      <span className="resolved-title-alt">Resolved Alerts</span>
      <span className="section-count">{alerts.length}</span>
    </div>
    <div className="resolved-cards-container">
      {alerts.map(alert => (
        <div className="resolved-alert-card" key={alert.id}>
          <div className="resolved-message">{alert.message}</div>
          <div className="elapsed-bar-container">
            <div className="elapsed-label">Time to Resolve: {alert.elapsed} min</div>
            <div className="elapsed-bar-bg">
              <div
                className="elapsed-bar resolved-bar"
                style={{ width: `${Math.min(alert.elapsed, 120) / 120 * 100}%` }}
              />
            </div>
          </div>
          <button className="details-btn" onClick={() => onViewDetails(alert.id)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default ResolvedAlerts