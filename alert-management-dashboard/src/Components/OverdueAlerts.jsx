import React from 'react'

const OverdueAlerts = ({ alerts, onRemind, onMarkUnactionable }) => (
  <div id="overdue-section" className="overdue-section">
    <div className="section-header right">
      <span className="overdue-title">Overdue Alerts</span>
      <span className="section-count">{alerts.length}</span>
    </div>
    <div className="overdue-cards-container">
      {alerts.map(alert => (
        <div className="overdue-alert-card" key={alert.id}>
          <div className="overdue-message">{alert.message}</div>
          <div className="elapsed-bar-container">
            <div className="elapsed-label">Overdue by: {alert.elapsed} min</div>
            <div className="elapsed-bar-bg">
              <div
                className="elapsed-bar overdue-bar"
                style={{ width: `${Math.min(alert.elapsed, 180) / 180 * 100}%` }}
              />
            </div>
          </div>
          <div className="pending-actions">
            <button className="remind-btn" onClick={() => onRemind(alert.id)}>
              Remind
            </button>
            <button className="unactionable-btn overdue-unactionable-btn" onClick={() => onMarkUnactionable(alert, 'overdue')}>
              Un-actionable
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default OverdueAlerts