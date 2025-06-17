import React from 'react';

const BasicInfo2Tab: React.FC = () => {
  return (
    <div className="tab-content">
      <div className="content-header">
        <svg className="content-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h1 className="content-title">Basic Information 2</h1>
      </div>
      
      <div className="basic-info-form">
        <div className="form-section">
          <h3>Address Information</h3>
          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input 
              type="text" 
              id="address1" 
              className="form-control" 
              placeholder="Enter street address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address2">Address Line 2 (Optional)</label>
            <input 
              type="text" 
              id="address2" 
              className="form-control" 
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                className="form-control" 
                placeholder="Enter city"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input 
                type="text" 
                id="state" 
                className="form-control" 
                placeholder="Enter state/province"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zip">ZIP/Postal Code</label>
              <input 
                type="text" 
                id="zip" 
                className="form-control" 
                placeholder="Enter ZIP code"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Additional Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select id="industry" className="form-control">
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="company-size">Company Size</label>
              <select id="company-size" className="form-control">
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="website">Website URL</label>
            <input 
              type="url" 
              id="website" 
              className="form-control" 
              placeholder="https://example.com"
            />
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

export default BasicInfo2Tab; 