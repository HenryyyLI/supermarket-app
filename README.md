## Prototype & UI Design

---

Check the live demo here 👉️https://fmnpuv.axshare.com

Check the design draft here 👉️https://www.figma.com/design/C0Gs7wvccClKINq0cimLF7/PYTHON-PROJECT?node-id=0-1&t=a6rjOJfwVpdokYmn-1

## Structure

---

- Data Scraping: Python -- [Reqeusts]([Requests: HTTP for Humans™ — Requests 2.32.3 documentation](https://docs.python-requests.org/en/latest/index.html)), [Selenium]([The Selenium Browser Automation Project | Selenium](https://www.selenium.dev/documentation/)), [BeautifulSoup]([Beautiful Soup Documentation — Beautiful Soup 4.4.0 documentation](https://beautiful-soup-4.readthedocs.io/en/latest/)), etc.
- Backend: Python -- [Flask]([Welcome to Flask — Flask Documentation (3.2.x)](https://flask.palletsprojects.com/en/latest/))
- Data Base: [MongoDB]([Download MongoDB Community Server | MongoDB](https://www.mongodb.com/try/download/community))
- Front-end: [React]([Quick Start – React](https://react.dev/learn)), [Node]([Node.js — Download Node.js®](https://nodejs.org/en/download)), [SCSS]([Sass: Install Sass](https://sass-lang.com/install/)), [React Router]([Docs Home v6.28.1 | React Router](https://reactrouter.com/6.28.1/home))
- UI: [Material UI]([Overview - Material UI](https://mui.com/material-ui/getting-started/)), [Plotly]([Plotly javascript graphing library in JavaScript](https://plotly.com/javascript/))

## Dependencies

---

- Make sure MongoDB is available on your PC

  - Download link 👉️https://www.mongodb.com/try/download/community

- Make sure Node is available on your PC

  - Download link 👉️https://nodejs.org/en/download

- Make sure yarn is available on your PC

  ```cmd
  npm install -g yarn
  ```

- Make sure scss is available on your PC

  ```cmd
  npm install -g sass
  ```

- Make sure React is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to Supermarket APP/V2 Front-end/client
  npm install react react-dom   # install with Node
  yarn add react react-dom   # install with yarn
  ```

- Make sure React Router is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to Supermarket APP/V2 Front-end/client
  npm install react-router-dom   # install with Node
  yarn add react-router-dom   # install with yarn
  ```

- Make sure Plotly is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to Supermarket APP/V2 Front-end/client
  npm install react-plotly.js plotly.js   # install with Node
  yarn add react-plotly.js plotly.js   # install with Node
  ```

## Usage

---

1. Load the data file into your MongoDB

   ```
   mongoimport --uri "mongodb://localhost:27017" --db mydb --collection mycollection --file products.json --jsonArray
   ```

2. Run the server.py file to start server side

   ```cmd
   cd your path to Supermarket APP/V1 Backend
   python server.py
   ```

3. Run the client side with yarn

   ```cmd
   cd your path to Supermarket APP/V2 Front-end/client
   yarn start
   ```

## Reference

---

- Front-end Development: https://youtu.be/BCkWFblNLKU?si=P4ayd-eUfSWwWFIu
- Flask+React: https://youtu.be/7LNl2JlZKHA?si=ps1ro2x5DdxDxv3P
- UI Design: https://github.com/cruip/tailwind-dashboard-template/tree/main