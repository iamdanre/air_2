import json
import sqlite3

def convert_json_to_sqlite(json_file, db_file):
    """
    Converts salary data from a JSON file to a SQLite database.

    Args:
        json_file (str): The path to the input JSON file.
        db_file (str): The path to the output SQLite database file.
    """
    # Load the JSON data from the file
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Connect to the SQLite database
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Create the salaries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS salaries (
            country TEXT,
            language TEXT,
            experience TEXT,
            salary INTEGER
        )
    ''')

    # Iterate through the data and insert it into the table
    for country, languages in data.items():
        for language, details in languages.items():
            for entry in details['entries']:
                metadata = entry['metadata']
                cursor.execute('''
                    INSERT INTO salaries (country, language, experience, salary)
                    VALUES (?, ?, ?, ?)
                ''', (metadata['Country'], metadata['Language'], metadata['Experience'], entry['value']))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

if __name__ == '__main__':
    convert_json_to_sqlite('calculatorData.json', 'salary_data.db')
    print("Successfully converted calculatorData.json to salary_data.db")
