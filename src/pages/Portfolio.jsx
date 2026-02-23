import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const API_URL = 'http://localhost:8080/api';

function Portfolio({ currentUser }) {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState({ totalValue: 0, totalProfitLoss: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [currentUser]);

  const fetchPortfolio = async () => {
    try {
      const [portfolioRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/portfolio/user/${currentUser}`),
        axios.get(`${API_URL}/portfolio/user/${currentUser}/summary`)
      ]);

      setPortfolio(portfolioRes.data);
      setSummary(summaryRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setLoading(false);
    }
  };

  const calculateTotalInvestment = () => {
    return portfolio.reduce((sum, item) => sum + (item.totalInvestment || 0), 0);
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((sum, item) => sum + (item.currentValue || 0), 0);
  };

  const calculateTotalProfitLoss = () => {
    return calculateTotalValue() - calculateTotalInvestment();
  };

  const calculateProfitLossPercent = () => {
    const investment = calculateTotalInvestment();
    if (investment === 0) return 0;
    return ((calculateTotalProfitLoss() / investment) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="container">
        <div className="portfolio-header">
          <h1 className="page-title">💼 My Portfolio</h1>
          <p className="page-subtitle">Track your investments and performance</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <div className="summary-label">Total Investment</div>
              <div className="summary-value">${calculateTotalInvestment().toFixed(2)}</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <div className="summary-label">Current Value</div>
              <div className="summary-value">${calculateTotalValue().toFixed(2)}</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              {calculateTotalProfitLoss() >= 0 ? '📈' : '📉'}
            </div>
            <div className="summary-content">
              <div className="summary-label">Total P/L</div>
              <div className={`summary-value ${calculateTotalProfitLoss() >= 0 ? 'profit' : 'loss'}`}>
                {calculateTotalProfitLoss() >= 0 ? '+' : ''}${calculateTotalProfitLoss().toFixed(2)}
              </div>
              <div className={`summary-percent ${calculateTotalProfitLoss() >= 0 ? 'profit' : 'loss'}`}>
                {calculateProfitLossPercent() >= 0 ? '+' : ''}{calculateProfitLossPercent()}%
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div className="summary-content">
              <div className="summary-label">Total Holdings</div>
              <div className="summary-value">{portfolio.length}</div>
              <div className="summary-text">stocks</div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="holdings-section">
          <div className="section-header">
            <h2 className="section-title">Your Holdings</h2>
            <button className="btn-refresh" onClick={fetchPortfolio}>
              🔄 Refresh
            </button>
          </div>

          {portfolio.length === 0 ? (
            <div className="empty-portfolio">
              <div className="empty-icon">📊</div>
              <h3>No Holdings Yet</h3>
              <p>Start trading to build your portfolio!</p>
              <a href="/market" className="btn btn-primary">
                Go to Market
              </a>
            </div>
          ) : (
            <div className="holdings-table">
              <div className="holdings-header">
                <div className="th">Symbol</div>
                <div className="th">Company</div>
                <div className="th">Shares</div>
                <div className="th">Avg Price</div>
                <div className="th">Current Price</div>
                <div className="th">Investment</div>
                <div className="th">Current Value</div>
                <div className="th">P/L</div>
                <div className="th">P/L %</div>
              </div>

              <div className="holdings-body">
                {portfolio.map((holding) => (
                  <div key={holding.id} className="holding-row">
                    <div className="td holding-symbol">{holding.stockSymbol}</div>
                    <div className="td">{holding.companyName}</div>
                    <div className="td">{holding.quantity}</div>
                    <div className="td">${holding.averagePrice?.toFixed(2)}</div>
                    <div className="td">${holding.currentPrice?.toFixed(2)}</div>
                    <div className="td">${holding.totalInvestment?.toFixed(2)}</div>
                    <div className="td">${holding.currentValue?.toFixed(2)}</div>
                    <div className={`td ${holding.profitLoss >= 0 ? 'profit' : 'loss'}`}>
                      {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss?.toFixed(2)}
                    </div>
                    <div className={`td ${holding.profitLossPercent >= 0 ? 'profit' : 'loss'}`}>
                      {holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent?.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Performance Chart Placeholder */}
        {portfolio.length > 0 && (
          <div className="chart-section">
            <h2 className="section-title">Portfolio Distribution</h2>
            <div className="distribution-chart">
              {portfolio.map((holding, index) => {
                const percentage = ((holding.currentValue / calculateTotalValue()) * 100).toFixed(1);
                return (
                  <div key={holding.id} className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          background: `hsl(${index * 60}, 70%, 60%)`
                        }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="stock-symbol">{holding.stockSymbol}</span>
                      <span className="stock-percent">{percentage}%</span>
                      <span className="stock-value">${holding.currentValue?.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
