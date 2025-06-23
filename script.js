let allData = [];
let salaryChart;

const countrySelect = document.getElementById('country');
const experienceSelect = document.getElementById('experience');
const languageSelect = document.getElementById('language');
const ctx = document.getElementById('salaryChart').getContext('2d');

async function fetchData() {
    try {
        const response = await fetch('calculatorData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allData = await response.json();
        console.log("Data loaded successfully:", allData.length, "records");
        populateFilters();
        initializeChart(); // Initialize chart after data is loaded
        // Add event listeners after filters are populated
        countrySelect.addEventListener('change', updateVisualization);
        experienceSelect.addEventListener('change', updateVisualization);
        languageSelect.addEventListener('change', updateVisualization);

    } catch (error) {
        console.error("Error fetching data:", error);
        // Display an error message to the user on the page
        const container = document.querySelector('.container');
        if (container) {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = 'Error loading data. Please try refreshing the page.';
            errorMsg.style.color = 'red';
            container.insertBefore(errorMsg, container.firstChild);
        }
    }
}

function populateFilters() {
    const countries = ['All', ...new Set(allData.map(item => item.country).sort())];
    const experiences = ['All', ...new Set(allData.map(item => item.yearsOfExperience).sort((a, b) => {
        // Custom sort for experience levels like "1 year", "2-4 years"
        const getNumericMin = (exp) => {
            if (exp === "Less than 1 year") return 0;
            if (exp === "1 year") return 1;
            if (exp === "More than 15 years") return 16;
            const match = exp.match(/^(\d+)-(\d+) years$/);
            return match ? parseInt(match[1], 10) : parseInt(exp, 10);
        };
        return getNumericMin(a) - getNumericMin(b);
    }))];
    const languages = ['All', ...new Set(allData.map(item => item.programmingLanguage).sort())];

    populateSelect(countrySelect, countries);
    populateSelect(experienceSelect, experiences);
    populateSelect(languageSelect, languages);
    console.log("Filters populated.");
}

function populateSelect(selectElement, options) {
    selectElement.innerHTML = ''; // Clear existing options
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        selectElement.appendChild(option);
    });
}

function initializeChart() {
    salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Will be populated by filtered data
            datasets: [{
                label: 'Salary Range', // Single dataset for the range
                data: [], // Data will be in the format [min, max] for each bar
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // A professional blue
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barPercentage: 0.6, // Adjust bar width
                categoryPercentage: 0.7 // Adjust space between categories
            }]
        },
        options: {
            indexAxis: 'y', // Makes bars horizontal, similar to reference
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value / 1000 + 'k'; // Format Y-axis labels
                        }
                    }
                },
                x: {
                    // Placeholder for X-axis configuration if needed
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
    console.log("Chart initialized.");
    // Initially render with all data or default filters
    updateVisualization();
}

function updateVisualization() {
    if (!allData.length || !salaryChart) {
        console.log("Data or chart not ready for update.");
        return;
    }

    const selectedCountry = countrySelect.value;
    const selectedExperience = experienceSelect.value;
    const selectedLanguage = languageSelect.value;

    console.log(`Filters changed: Country: ${selectedCountry}, Experience: ${selectedExperience}, Language: ${selectedLanguage}`);

    let filteredData = allData;

    if (selectedCountry !== 'All') {
        filteredData = filteredData.filter(item => item.country === selectedCountry);
    }
    if (selectedExperience !== 'All') {
        filteredData = filteredData.filter(item => item.yearsOfExperience === selectedExperience);
    }
    if (selectedLanguage !== 'All') {
        filteredData = filteredData.filter(item => item.programmingLanguage === selectedLanguage);
    }

    console.log("Filtered data count:", filteredData.length);

    let chartLabels = [];
    // let minSalaries = []; // No longer separate
    // let maxSalaries = []; // No longer separate
    let salaryRanges = []; // Will store [min, max] pairs

    if (filteredData.length === 0) {
        console.log("No data matches the current filters.");
    } else if (filteredData.length === 1) {
        const item = filteredData[0];
        chartLabels = [`${item.programmingLanguage} in ${item.country} (${item.yearsOfExperience})`];
        // minSalaries = [item.salary.min];
        // maxSalaries = [item.salary.max];
        salaryRanges = [[item.salary.min, item.salary.max]];
    } else {
        if (selectedLanguage === 'All' && selectedCountry !== 'All' && selectedExperience !== 'All') {
            const languageGroups = {};
            filteredData.forEach(item => {
                if (!languageGroups[item.programmingLanguage]) {
                    languageGroups[item.programmingLanguage] = { minSum: 0, maxSum: 0, count: 0, salaries: [] };
                }
                languageGroups[item.programmingLanguage].salaries.push({min: item.salary.min, max: item.salary.max});
                languageGroups[item.programmingLanguage].count++;
            });
            for (const lang in languageGroups) {
                chartLabels.push(lang);
                const avgMin = languageGroups[lang].salaries.reduce((sum, s) => sum + s.min, 0) / languageGroups[lang].count;
                const avgMax = languageGroups[lang].salaries.reduce((sum, s) => sum + s.max, 0) / languageGroups[lang].count;
                salaryRanges.push([avgMin, avgMax]);
            }
        }
        else if (selectedCountry === 'All' && selectedLanguage !== 'All' && selectedExperience !== 'All') {
            const countryGroups = {};
            filteredData.forEach(item => {
                if (!countryGroups[item.country]) {
                    countryGroups[item.country] = { minSum: 0, maxSum: 0, count: 0, salaries: [] };
                }
                countryGroups[item.country].salaries.push({min: item.salary.min, max: item.salary.max});
                countryGroups[item.country].count++;
            });
            for (const country in countryGroups) {
                chartLabels.push(country);
                const avgMin = countryGroups[country].salaries.reduce((sum, s) => sum + s.min, 0) / countryGroups[country].count;
                const avgMax = countryGroups[country].salaries.reduce((sum, s) => sum + s.max, 0) / countryGroups[country].count;
                salaryRanges.push([avgMin, avgMax]);
            }
        }
        else if (filteredData.length <= 20) { // Show individual items if not too many and not covered by specific aggregations
            filteredData.forEach(item => {
                let label = "";
                // Construct label based on what varies if some filters are set
                if (selectedLanguage === 'All' && selectedCountry === 'All' && selectedExperience === 'All') {
                    label = `${item.programmingLanguage} in ${item.country} (${item.yearsOfExperience})`;
                } else if (selectedLanguage === 'All' && selectedCountry === 'All') { // Filtered by Experience
                    label = `${item.programmingLanguage} in ${item.country}`;
                } else if (selectedLanguage === 'All' && selectedExperience === 'All') { // Filtered by Country
                    label = `${item.programmingLanguage} (${item.yearsOfExperience})`;
                } else if (selectedCountry === 'All' && selectedExperience === 'All') { // Filtered by Language
                    label = `${item.country} (${item.yearsOfExperience})`;
                } else if (selectedLanguage === 'All') { // Country and Experience are specific
                    label = item.programmingLanguage;
                } else if (selectedCountry === 'All') { // Language and Experience are specific
                    label = item.country;
                } else if (selectedExperience === 'All') { // Language and Country are specific
                    label = item.yearsOfExperience;
                } else { // All filters are specific - ideally this is one item, but if data has duplicates for this combo:
                    label = `${item.programmingLanguage} in ${item.country} (${item.yearsOfExperience})`;
                }

                // Ensure unique labels for the chart
                let originalLabel = label;
                let count = 1;
                // If the exact label already exists, append a counter.
                // This is a simple way to handle non-unique descriptive labels if the data implies it.
                while(chartLabels.includes(label)) {
                    count++;
                    label = `${originalLabel} (${count})`;
                }
                chartLabels.push(label);
                salaryRanges.push([item.salary.min, item.salary.max]);
            });
        } else { // Too many items to display individually
            console.log("Too many data points to display clearly. Consider more specific filters or advanced aggregation.");
            chartLabels.push("Multiple results - Refine filters");
            salaryRanges.push([0,0]); // Represent as no data or zero range
        }
    }

    salaryChart.data.labels = chartLabels;
    salaryChart.data.datasets[0].data = salaryRanges; // Assign [min, max] pairs
    salaryChart.update();
    console.log("Chart updated with new data (floating bars).");
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
