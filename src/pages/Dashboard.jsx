import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:8080/api';

function Dashboard({ currentUser }) {
  const [stocks, setStocks] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [allStocks, gainers, losers, active] = await Promise.all([
        axios.get(`${API_URL}/stocks`),
        axios.get(`${API_URL}/stocks/top-gainers`),
        axios.get(`${API_URL}/stocks/top-losers`),
        axios.get(`${API_URL}/stocks/most-active`)
      ]);

      setStocks(allStocks.data);
      setTopGainers(gainers.data.slice(0, 2));
      setTopLosers(losers.data.slice(0, 2));
      setMostActive(active.data.slice(0, 2));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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
    <div className="dashboard">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to MRU Trading Platform 🎓
            </h1>
            <p className="hero-subtitle">
              Full-Stack Trading Application Demo for Malla Reddy University Students
            </p>
            <p className="hero-text">
              Please <span className="text-primary">login or register</span> to start trading
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-Time Market Data</h3>
            <p className="feature-description">
              Access live stock quotes powered by Alpha Vantage API
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">Buy & Sell Stocks</h3>
            <p className="feature-description">
              Execute trades with real-time price validation
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3 className="feature-title">Portfolio Management</h3>
            <p className="feature-description">
              Track your investments with P/L calculations
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Interactive Charts</h3>
            <p className="feature-description">
              Visualize stock prices and portfolio distribution
            </p>
          </div>
        </div>

        {/* Market Overview */}
        <div className="market-overview">
          <div className="section-header">
            <h2 className="section-title">Market Overview</h2>
            <button className="btn-refresh" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>

          <div className="market-grid">
            {/* Top Gainers */}
            <div className="market-section">
              <div className="market-section-header">
                <span className="market-icon gain">📈</span>
                <h3 className="market-section-title">Top Gainers</h3>
              </div>
              <div className="stock-list">
                {topGainers.map(stock => (
                  <div key={stock.id} className="stock-item">
                    <div className="stock-info">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-price">${stock.currentPrice?.toFixed(2)}</div>
                    </div>
                    <div className="stock-change gain">
                      +{stock.changePercent?.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="market-section">
              <div className="market-section-header">
                <span className="market-icon loss">📉</span>
                <h3 className="market-section-title">Top Losers</h3>
              </div>
              <div className="stock-list">
                {topLosers.map(stock => (
                  <div key={stock.id} className="stock-item">
                    <div className="stock-info">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-price">${stock.currentPrice?.toFixed(2)}</div>
                    </div>
                    <div className="stock-change loss">
                      {stock.changePercent?.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Active */}
            <div className="market-section">
              <div className="market-section-header">
                <span className="market-icon active">🔥</span>
                <h3 className="market-section-title">Most Active</h3>
              </div>
              <div className="stock-list">
                {mostActive.map(stock => (
                  <div key={stock.id} className="stock-item">
                    <div className="stock-info">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-price">${stock.currentPrice?.toFixed(2)}</div>
                    </div>
                    <div className="stock-volume">
                      Vol: {(stock.volume / 1000000).toFixed(1)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
