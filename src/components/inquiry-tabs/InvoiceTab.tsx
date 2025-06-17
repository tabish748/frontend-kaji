import React from 'react';

const InvoiceTab: React.FC = () => {
  return (
    <div className="tab-content">
      <div className="content-header">
        <svg className="content-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,4A2,2 0 0,0 1,6V17H3A2,2 0 0,0 5,19A2,2 0 0,0 7,17H17A2,2 0 0,0 19,19A2,2 0 0,0 21,17H23V6A2,2 0 0,0 21,4H3M3,6H21V15H19A2,2 0 0,0 17,17H7A2,2 0 0,0 5,17H3V6M7,8V10H17V8H7M7,11V13H17V11H7Z"/>
        </svg>
        <h1 className="content-title">Invoice</h1>
      </div>
      
      <div className="invoice-form">
        <div className="form-section">
          <h3>Invoice Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoice-number">Invoice Number</label>
              <input 
                type="text" 
                id="invoice-number" 
                className="form-control" 
                placeholder="Auto-generated"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="invoice-date">Invoice Date</label>
              <input 
                type="date" 
                id="invoice-date" 
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="due-date">Due Date</label>
              <input 
                type="date" 
                id="due-date" 
                className="form-control"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Billing Details</h3>
          <div className="invoice-items">
            <div className="item-header">
              <span>Description</span>
              <span>Quantity</span>
              <span>Rate</span>
              <span>Amount</span>
              <span>Action</span>
            </div>
            
            <div className="invoice-item">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Service description"
              />
              <input 
                type="number" 
                className="form-control" 
                placeholder="1"
                min="1"
              />
              <input 
                type="number" 
                className="form-control" 
                placeholder="0.00"
                step="0.01"
              />
              <span className="amount">$0.00</span>
              <button type="button" className="btn btn-danger btn-sm">Remove</button>
            </div>
            
            <button type="button" className="btn btn-outline-primary add-item-btn">
              + Add Item
            </button>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Payment Terms</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payment-method">Payment Method</label>
              <select id="payment-method" className="form-control">
                <option value="">Select payment method</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="credit-card">Credit Card</option>
                <option value="check">Check</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="payment-terms">Payment Terms</label>
              <select id="payment-terms" className="form-control">
                <option value="">Select payment terms</option>
                <option value="net-15">Net 15</option>
                <option value="net-30">Net 30</option>
                <option value="net-45">Net 45</option>
                <option value="net-60">Net 60</option>
                <option value="due-on-receipt">Due on Receipt</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea 
              id="notes" 
              className="form-control" 
              rows={3}
              placeholder="Additional notes or payment instructions"
            ></textarea>
          </div>
        </div>
        
        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row">
            <span>Tax (0%):</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>$0.00</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Save Draft</button>
          <button type="button" className="btn btn-outline-primary">Preview</button>
          <button type="button" className="btn btn-primary">Generate Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTab; 