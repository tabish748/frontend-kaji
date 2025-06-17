import React from 'react';

const ContractTab: React.FC = () => {
  return (
    <div className="tab-content">
      <div className="content-header">
        <svg className="content-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        <h1 className="content-title">Contract</h1>
      </div>
      
      <div className="contract-form">
        <div className="form-section">
          <h3>Contract Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contract-type">Contract Type</label>
              <select id="contract-type" className="form-control">
                <option value="">Select contract type</option>
                <option value="service">Service Agreement</option>
                <option value="maintenance">Maintenance Contract</option>
                <option value="consulting">Consulting Agreement</option>
                <option value="license">License Agreement</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Contract Duration</label>
              <select id="duration" className="form-control">
                <option value="">Select duration</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>
              <input 
                type="date" 
                id="start-date" 
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="end-date">End Date</label>
              <input 
                type="date" 
                id="end-date" 
                className="form-control"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Terms & Conditions</h3>
          <div className="form-group">
            <label htmlFor="terms">Special Terms</label>
            <textarea 
              id="terms" 
              className="form-control" 
              rows={4}
              placeholder="Enter any special terms or conditions"
            ></textarea>
          </div>
          
          <div className="form-group">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                I agree to the standard terms and conditions
              </label>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Auto-renewal is acceptable
              </label>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Digital signature authorization
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Previous</button>
          <button type="button" className="btn btn-primary">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ContractTab; 