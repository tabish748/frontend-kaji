import React from 'react';

const BasicInfo1Tab: React.FC = () => {
  return (
    <div className="tab-content">
      <div className="content-header">
        <svg className="content-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h1 className="content-title">Basic Information 1</h1>
      </div>
      
      <div className="basic-info-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input 
                type="text" 
                id="first-name" 
                className="form-control" 
                placeholder="Enter first name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input 
                type="text" 
                id="last-name" 
                className="form-control" 
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder="Enter email address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                className="form-control" 
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Company Information</h3>
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input 
              type="text" 
              id="company" 
              className="form-control" 
              placeholder="Enter company name"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input 
                type="text" 
                id="position" 
                className="form-control" 
                placeholder="Enter position/title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input 
                type="text" 
                id="department" 
                className="form-control" 
                placeholder="Enter department"
              />
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

export default BasicInfo1Tab; 