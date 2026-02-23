import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Market.css';

const API_URL = 'http://localhost:8080/api';

function Market({ currentUser }) {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stocks);
    }
  }, [searchTerm, stocks]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_URL}/stocks`);
      setStocks(response.data);
      setFilteredStocks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setLoading(false);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    
    if (!selectedStock || !quantity || quantity <= 0) {
      setMessage({ type: 'error', text: 'Please select a stock and enter valid quantity' });
      return;
    }

    try {
      const tradeData = {
        stockSymbol: selectedStock.symbol,
        tradeType: tradeType,
        quantity: parseInt(quantity),
        userId: currentUser
      };

      await axios.post(`${API_URL}/trades`, tradeData);
      
      setMessage({ 
        type: 'success', 
        text: `Successfully ${tradeType === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${selectedStock.symbol}!` 
      });
      
      setSelectedStock(null);
      setQuantity(1);
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Trade failed. Please try again.' 
      });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="market-page">
      <div className="container">
        <div className="market-header">
          <h1 className="page-title">📊 Stock Market</h1>
          <p className="page-subtitle">Browse and trade stocks in real-time</p>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="market-content">
          {/* Stock List */}
          <div className="stock-list-section">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search stocks by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="stock-table">
              <div className="table-header">
                <div className="th">Symbol</div>
                <div className="th">Company</div>
                <div className="th">Price</div>
                <div className="th">Change</div>
                <div className="th">Volume</div>
                <div className="th">Action</div>
              </div>

              <div className="table-body">
                {filteredStocks.map(stock => (
                  <div key={stock.id} className="table-row">
                    <div className="td stock-symbol-cell">{stock.symbol}</div>
                    <div className="td">{stock.companyName}</div>
                    <div className="td stock-price">${stock.currentPrice?.toFixed(2)}</div>
                    <div className={`td ${stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                    </div>
                    <div className="td">{(stock.volume / 1000000).toFixed(1)}M</div>
                    <div className="td">
                      <button
                        className="btn-trade"
                        onClick={() => setSelectedStock(stock)}
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="trade-panel">
            <h2 className="trade-title">Execute Trade</h2>
            
            {selectedStock ? (
              <form onSubmit={handleTrade} className="trade-form">
                <div className="selected-stock-info">
                  <div className="stock-badge">{selectedStock.symbol}</div>
                  <div className="stock-name">{selectedStock.companyName}</div>
                  <div className="current-price">${selectedStock.currentPrice?.toFixed(2)}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Trade Type</label>
                  <div className="trade-type-buttons">
                    <button
                      type="button"
                      className={`trade-type-btn ${tradeType === 'BUY' ? 'active buy' : ''}`}
                      onClick={() => setTradeType('BUY')}
                    >
                      💰 Buy
                    </button>
                    <button
                      type="button"
                      className={`trade-type-btn ${tradeType === 'SELL' ? 'active sell' : ''}`}
                      onClick={() => setTradeType('SELL')}
                    >
                      💸 Sell
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="trade-summary">
                  <div className="summary-row">
                    <span>Price per share:</span>
                    <span>${selectedStock.currentPrice?.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>${(selectedStock.currentPrice * quantity).toFixed(2)}</span>
                  </div>
                </div>

                <button type="submit" className={`btn btn-block ${tradeType === 'BUY' ? 'btn-success' : 'btn-danger'}`}>
                  {tradeType === 'BUY' ? 'Buy' : 'Sell'} {quantity} Share{quantity > 1 ? 's' : ''}
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => setSelectedStock(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📈</div>
                <p>Select a stock from the list to start trading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Market;
