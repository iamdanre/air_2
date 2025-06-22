# IT Salary Calculator - Vue.js

An interactive data visualization application based on the JetBrains Developer Ecosystem Survey 2024. This application allows users to explore salary data for software developers by filtering on country, programming language, and experience level.

## Features

- **Interactive Filters**: Filter salary data by country, programming language, and experience level
- **Real-time Statistics**: View average, minimum, maximum salaries and sample sizes
- **Data Visualization**: Interactive bar chart showing salary distribution
- **Responsive Design**: Works on desktop and mobile devices
- **JetBrains-inspired UI**: Clean, modern design following JetBrains design principles

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Backend**: Node.js with Express
- **Database**: SQLite (pre-populated with survey data)
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite
- **Styling**: Custom CSS with responsive design

## Project Structure

```
/
├── src/
│   ├── App.vue           # Main application component
│   ├── main.js           # Vue app entry point
│   └── style.css         # Global styles
├── public/
│   └── index.html        # HTML template
├── server.js             # Express API server
├── salary_data.db        # SQLite database with salary data
├── json_to_sqlite.py     # Data conversion script
├── calculatorData.json   # Original JSON data
├── reference.html        # Design reference
├── figma.jpg            # Design mockup
├── package.json          # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/iamdanre/air_2.git
   cd air_2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify database exists**:
   The `salary_data.db` file should already exist in the project root. If not, you can regenerate it:
   ```bash
   python json_to_sqlite.py
   ```

### Running the Application

The application requires both a backend API server and a frontend development server.

#### Option 1: Run both servers manually (recommended for development)

1. **Start the API server** (in one terminal):
   ```bash
   npm run server
   ```
   This starts the Express server on `http://localhost:3001`

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```
   This starts the Vite development server on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

#### Option 2: Quick start script (recommended for first-time users)

Use the provided start script that automatically sets up and runs both servers:

```bash
npm start
```

This script will:
- Check prerequisites (Node.js, dependencies)
- Verify the database exists
- Start the API server in the background
- Start the frontend development server
- Provide helpful status messages

Or manually with background processes:

```bash
# Start API server in background
npm run server &

# Start frontend server
npm run dev
```

### Building for Production

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Preview the production build**:
   ```bash
   npm run preview
   ```

## API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/countries` - Get list of all countries
- `GET /api/languages` - Get list of all programming languages
- `GET /api/experience-levels` - Get list of all experience levels
- `GET /api/salary-stats?country=&language=&experience=` - Get salary statistics
- `GET /api/salary-distribution?country=&language=&experience=` - Get salary distribution data
- `GET /api/salaries?country=&language=&experience=` - Get raw salary data
- `GET /api/health` - Health check endpoint

## Database Schema

The SQLite database contains a single table `salaries` with the following structure:

```sql
CREATE TABLE salaries (
    country TEXT,
    language TEXT,
    experience TEXT,
    salary INTEGER
);
```

## Usage

1. **Select Filters**: Use the dropdown menus to filter by:
   - Country (e.g., United States, Germany, India)
   - Programming Language (e.g., JavaScript/TypeScript, Python, Java/Kotlin)
   - Experience Level (e.g., <1 year, 1–2 years, 3–5 years, etc.)

2. **View Statistics**: The left panel shows:
   - Average salary for the selected filters
   - Minimum and maximum salaries
   - Number of survey responses

3. **Explore Distribution**: The right panel shows a bar chart of salary ranges and the number of responses in each range.

4. **Interactive Experience**: All filters update in real-time, and the visualization automatically refreshes when filters change.

## Data Source

The salary data comes from the JetBrains Developer Ecosystem Survey 2024, which surveyed thousands of developers worldwide about their salaries, experience levels, and programming language preferences.

## Development

### Adding New Features

- **Frontend components**: Add new Vue components in `src/components/`
- **API endpoints**: Add new routes in `server.js`
- **Styling**: Update `src/style.css` for global styles or add component-specific styles

### Database Operations

The application uses SQLite with a simple schema. You can inspect the database using:

```bash
sqlite3 salary_data.db
.schema
SELECT COUNT(*) FROM salaries;
```

## Troubleshooting

### Common Issues

1. **Server not starting**: Make sure port 3001 is not in use
2. **Frontend can't connect to API**: Verify the API server is running on port 3001
3. **Database errors**: Check that `salary_data.db` exists and has the correct permissions
4. **Chart not rendering**: Ensure Chart.js dependencies are properly installed

### Port Configuration

- Frontend development server: `http://localhost:3000`
- Backend API server: `http://localhost:3001`

You can change these ports in:
- Frontend: `vite.config.js`
- Backend: `server.js` (PORT environment variable or hardcoded value)

## License

ISC License - see package.json for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

For questions or issues, please check the GitHub issues page or create a new issue.