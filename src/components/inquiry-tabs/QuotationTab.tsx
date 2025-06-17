import React from 'react';

const QuotationTab: React.FC = () => {
  return (
    <div className="tab-content">
      <div className="content-header">
        <svg className="content-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"/>
        </svg>
        <h1 className="content-title">Quotation</h1>
      </div>
      
      <div className="quotation-form">
        <div className="form-section">
          <h3>Service Requirements</h3>
          <div className="form-group">
            <label htmlFor="services">Services Requested</label>
            <div className="service-checkboxes">
              <label className="checkbox-label">
                <input type="checkbox" name="services" value="consulting" />
                <span className="checkmark"></span>
                Consulting Services
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="services" value="development" />
                <span className="checkmark"></span>
                Development Services
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="services" value="maintenance" />
                <span className="checkmark"></span>
                Maintenance & Support
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="services" value="training" />
                <span className="checkmark"></span>
                Training Services
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="project-scope">Project Scope</label>
            <textarea 
              id="project-scope" 
              className="form-control" 
              rows={4}
              placeholder="Describe the project scope and requirements"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Budget Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget-range">Budget Range</label>
              <select id="budget-range" className="form-control">
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="over-100k">Over $100,000</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="timeline">Project Timeline</label>
              <select id="timeline" className="form-control">
                <option value="">Select timeline</option>
                <option value="1-month">1 Month</option>
                <option value="2-3-months">2-3 Months</option>
                <option value="3-6-months">3-6 Months</option>
                <option value="6-12-months">6-12 Months</option>
                <option value="over-1-year">Over 1 Year</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="special-requirements">Special Requirements</label>
            <textarea 
              id="special-requirements" 
              className="form-control" 
              rows={3}
              placeholder="Any special requirements or considerations"
            ></textarea>
          </div>
        </div>
        
        <div className="quotation-summary">
          <h3>Estimated Summary</h3>
          <div className="summary-item">
            <span>Services Selected:</span>
            <span>Pending Selection</span>
          </div>
          <div className="summary-item">
            <span>Estimated Timeline:</span>
            <span>Pending Selection</span>
          </div>
          <div className="summary-item total">
            <span>Estimated Budget Range:</span>
            <span>Pending Selection</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Previous</button>
          <button type="button" className="btn btn-primary">Generate Quote</button>
        </div>
      </div>
    </div>
  );
};

export default QuotationTab; 