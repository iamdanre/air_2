# Developer Salary Visualization

An interactive data visualization based on the developers salary data from JetBrains Developer Ecosystem Survey 2024.

The commited DB  should already have the salary data, but it can be reimported using the migration script `database/migrations/2025_06_22_220641_salaries.php`


## Setup Instructions

1. Set up .env
```bash
cp .env.example .env
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Build frontend assets:
```bash
npm run build
```

5. Start the development server:
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`
