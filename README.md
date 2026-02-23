<<<<<<< HEAD
# Stock Market Trading Platform - Frontend

Beautiful React frontend for the Stock Market Trading Platform matching the MRU Trading Platform design.

## Features

- 🎨 Modern UI matching the reference design
- 📊 Real-time market data dashboard
- 💰 Buy and sell stocks
- 💼 Portfolio management with P/L tracking
- 📈 Interactive charts
- 🔐 User authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your backend is running on `http://localhost:8080`

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000)

## Default Login

For testing, you can use any email as the user ID since this is a demo application.

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Market.jsx
│   ├── Portfolio.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── App.jsx
└── App.css
```

## Technologies

- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- CSS3 with gradients and animations

## API Endpoints

The frontend connects to these backend endpoints:
- GET `/api/stocks` - Get all stocks
- GET `/api/stocks/top-gainers` - Get top gaining stocks
- GET `/api/stocks/top-losers` - Get top losing stocks
- GET `/api/stocks/most-active` - Get most active stocks
- POST `/api/trades` - Execute a trade
- GET `/api/portfolio/user/{userId}` - Get user portfolio

Enjoy trading! 🚀
=======
# StockMarketAPP
A full stack project using springboot and java principles . Using React as frontend and springboot as backend and swagger UI as the intermediate and database used is MySQl 
>>>>>>> 13d835672525f072c208f50b46b1c0c90225db61
