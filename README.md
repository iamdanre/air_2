# Developer Salary Visualization

This project is an interactive data visualization that displays developer salary ranges based on data from the JetBrains Developer Ecosystem Survey 2024. Users can filter the data by country, years of experience, and main programming language to see how these factors influence salaries.

The visualization is implemented as a single-page web application.

## Features

*   Interactive filters for:
    *   Country
    *   Years of Experience
    *   Main Programming Language
*   Dynamic bar chart displaying salary ranges (minimum and maximum).
*   Data sourced from `calculatorData.json`.
*   Responsive design.

## Technologies Used

*   **HTML**: Structure of the web page.
*   **CSS**: Styling of the web page.
*   **JavaScript (ES6+)**: Application logic, data fetching, filtering, and chart manipulation.
*   **Chart.js**: Library used for creating the interactive bar chart.
*   **Static JSON file (`calculatorData.json`)**: Used as the data source.

## Setup and Running the Application

1.  **Clone the repository (or download the files):**
    If this were a Git repository, you would clone it. For the current setup, ensure you have all the project files (`index.html`, `style.css`, `script.js`, `calculatorData.json`) in the same directory.

2.  **Ensure `calculatorData.json` is present:**
    The `calculatorData.json` file must be in the same directory as `index.html` for the application to fetch and display data.

3.  **Open `index.html` in a web browser:**
    Navigate to the project directory and open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).

    *No build steps or local server are strictly required for this basic setup since it uses static files and fetches JSON locally. However, some browsers might have security restrictions for fetching local JSON files directly via `fetch` (`file:///` protocol). If you encounter issues:*

4.  **(Optional) Use a local web server:**
    For best results and to avoid potential browser security restrictions with local file access (`fetch` API), it's recommended to serve the files through a local web server.
    *   **Using Python:**
        If you have Python installed, navigate to the project directory in your terminal and run:
        *   Python 3: `python -m http.server`
        *   Python 2: `python -m SimpleHTTPServer`
        Then open `http://localhost:8000` (or the port shown in the terminal) in your browser.
    *   **Using Node.js with `http-server`:**
        If you have Node.js, you can install `http-server` globally:
        `npm install -g http-server`
        Then navigate to the project directory and run:
        `http-server`
        Then open the URL provided in the terminal (usually `http://localhost:8080`).
    *   **Using VS Code Live Server:**
        If you are using Visual Studio Code, you can use the "Live Server" extension to easily serve the `index.html` file.

## Project Structure

*   `index.html`: The main HTML file.
*   `style.css`: Contains all the CSS styles for the application.
*   `script.js`: JavaScript code for fetching data, populating filters, handling user interactions, and updating the chart.
*   `calculatorData.json`: The dataset containing developer salary information.
*   `figma.jpg`: The Figma design screenshot (for reference).
*   `reference.html`: The reference HTML page (for reference).
*   `README.md`: This file.

## How it Works

*   On page load, `script.js` fetches data from `calculatorData.json`.
*   The filter dropdowns (Country, Years of Experience, Programming Language) are populated dynamically based on the unique values found in the data.
*   When a user changes a filter selection, the script filters the dataset accordingly.
*   The filtered data is then processed to generate labels and salary ranges (min/max).
*   Chart.js is used to render a horizontal bar chart displaying these salary ranges. The chart updates dynamically with filter changes.
*   Basic aggregation is performed if filter combinations result in multiple data points for a given category (e.g., averaging salaries if a language is selected across all countries). If too many individual items would result, a summary message may be shown.

This project was created as a solution for an AirRPP homework assignment.
