# 🛒 Supermarket App

A full-stack supermarket dashboard that seamlessly combines real-time data scraping, intelligent filtering, and multi-dimensional visualization. Designed to help users make smarter, more cost-effective grocery decisions, the platform enables efficient cross-supermarket product comparison based on price, brand, and detailed attributes — turning raw data into actionable shopping insights.

## 🔍 Key Features

- **⚙️ Full-Stack Architecture**

  Built with React (frontend), Flask (backend), and MongoDB (database) to ensure modularity, scalability, and smooth integration across services.

- **📊 Interactive Visualizations**

  Leverages Plotly and Material UI to deliver dynamic, interactive charts that visualize key sales metrics over time — enabling users to spot trends, compare performance, and interpret data at a glance.

- **🔎 Smart Multi-Dimensional Filtering**

  Enables deep data slicing by date, category, and other metadata through intuitive dropdowns, buttons, and interactive controls — ideal for customized analytics and user-driven insights.

- **🕸️ Real-Time Data Scraping Engine**

  Integrates Python-based scraping tools (Requests, Selenium, BeautifulSoup) to fetch live e-commerce or supermarket data directly into the app with automation capabilities. (*Note: Due to compliance considerations, the scraping scripts are not included in the public repository.*)

- **🧩 Clean & Modular UI Architecture**

  Built with React and SCSS, the interface features a well-structured component hierarchy and consistent visual styling — resulting in a clean, coherent UI that enhances readability and user focus.

## 📁 Project Structure

```bash
supermarket-app/
├── backend/                # Flask backend code
│   ├── server.py           # Application entry point, defines routes and API endpoints
│   └── mongo_db.py         # MongoDB connection and query utilities
├── frontend/               # React frontend code
│   ├── public/             # Static assets and HTML template
│   ├── src/                # Source code for the React app
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Top-level page views
│   │   ├── App.js          # Root component and router setup
│   │   ├── AppContext.js   # Global state and context provider
│   │   └── ...             # Other React modules
│   └── package.json        # Frontend dependencies and scripts
├── README.md               # Project documentation
└── .gitignore              # Files and folders excluded from Git
```

## 🛠 Tech Stack

- **Data Scraping**: Python — `requests`, `Selenium`, `BeautifulSoup`, etc.

- **Backend**: Python — `Flask`

- **Database**: `MongoDB`

- **Frontend**: `React`, `Node.js`, `SCSS`, `React Router`

- **UI & Visualization**: `Material UI`, `Plotly`

## ⚙️ Dependencies

- **MongoDB** – Required for data storage
  👉 [Download MongoDB](https://www.mongodb.com/try/download/community)

- **Node.js** – Required for running the frontend and installing packages
  👉 [Download Node.js](https://nodejs.org/en/download)

- **Yarn** – Package manager (alternative to npm)

  ```bash
  npm install -g yarn
  ```

- **Sass (SCSS)** – For styling components

  ```bash
  npm install -g sass
  ```

- **React & Core Libraries** –  For building UI (if not already in `node_modules`)

  ```bash
  yarn add react react-dom
  ```

- **React Router** – For client-side routing (if not already in `node_modules`)

  ```bash
  yarn add react-router-dom
  ```

- **Plotly.js** – For data visualization (if not already in `node_modules`)

  ```bash
  yarn add react-plotly.js plotly.js
  ```

## 🚀 Setup & Usage

1. **Clone the repository**

   ```bash
   git clone https://github.com/HenryyyLI/supermarket-app.git
   cd supermarket-app
   ```

2. **Load product data into MongoDB**

   ```bash
   mongoimport --uri "mongodb://localhost:27017" --db mydb --collection mycollection --file products.json --jsonArray
   ```

3. **Start the backend server**

   ```bash
   cd backend
   python server.py
   ```

4. **Start the frontend application**

   ```bash
   cd frontend
   yarn install
   yarn start
   ```

## Prototype & UI Design

🧭 **Interactive Prototype**: [Preview on Axure](https://fmnpuv.axshare.com)
🎨 **UI Design Draft**: [View on Figma](https://www.figma.com/design/C0Gs7wvccClKINq0cimLF7/PYTHON-PROJECT?node-id=0-1&t=a6rjOJfwVpdokYmn-1)