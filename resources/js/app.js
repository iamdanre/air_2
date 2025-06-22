import './bootstrap';
import Chart from 'chart.js/auto';

window.Chart = Chart;

document.addEventListener('DOMContentLoaded', async () => {
    const languageSelect = document.getElementById('language');
    const countrySelect = document.getElementById('country');
    const resultsText = document.getElementById('results-text');
    const ctx = document.getElementById('salary-chart').getContext('2d');
    let salaryChart;

    async function fetchFilters() {
        const response = await fetch('/api/salaries/filters');
        const data = await response.json();

        data.languages.forEach(lang => {
            const option = new Option(lang, lang);
            languageSelect.add(option);
        });

        data.countries.forEach(country => {
            const option = new Option(country, country);
            countrySelect.add(option);
        });
    }

    function renderChart(data) {
        const experienceLabels = {
            '<1 year': 'L1',
            '1–2 years': 'L2',
            '3–5 years': 'L3',
            '6–10 years': 'L4',
            '11–16 years': 'L5',
            '16+ years': 'L6',
        };

        const labels = data.map(d => experienceLabels[d.experience] || d.experience);
        const minMaxData = data.map(d => [d.stats.min, d.stats.max]);
        const quartileData = data.flatMap((d) => {
            const y = experienceLabels[d.experience] || d.experience;
            return [
                { x: d.stats.q1, y: y },
                { x: d.stats.median, y: y },
                { x: d.stats.q3, y: y },
            ];
        });

        if (salaryChart) {
            salaryChart.destroy();
        }

        salaryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Salary Range (Min-Max)',
                        data: minMaxData,
                        backgroundColor: 'rgba(147, 197, 253, 0.5)',
                        borderColor: 'rgba(147, 197, 253, 1)',
                        borderWidth: 1,
                        barPercentage: 0.2,
                        borderRadius: 4,
                    },
                    {
                        type: 'scatter',
                        label: 'Quartiles (25%, 50%, 75%)',
                        data: quartileData,
                        backgroundColor: 'rgba(196, 181, 253, 1)',
                        pointStyle: 'circle',
                        radius: 5,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                            color: '#374151',
                            callback: function(value, index, values) {
                                return '$' + value / 1000 + 'k';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#374151'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.type === 'scatter') {
                                     return 'Salary: $' + context.parsed.x.toLocaleString();
                                }
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    const range = context.raw;
                                    label += '$' + range[0].toLocaleString() + ' - $' + range[1].toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateResultsText(data) {
        const language = languageSelect.value;
        const country = countrySelect.value;
        
        if(data && data.length > 0) {
            const firstLevel = data.find(d => d.experience === '<1 year');
            if (firstLevel) {
                 const medianSalary = firstLevel.stats.median.toLocaleString();
                 resultsText.innerHTML = `Most <strong>${language}</strong> developers with <strong>less than 1 year</strong> of professional experience in <strong>${country}</strong> can expect a median salary around <strong class="text-indigo-600">$${medianSalary}</strong>.`;
            } else {
                resultsText.innerHTML = `No data for &lt;1 year of experience for <strong>${language}</strong> in <strong>${country}</strong>.`;
            }
        } else {
            resultsText.innerHTML = `No data available for the selected criteria.`;
        }
    }

    async function fetchDataAndRenderChart() {
        const language = languageSelect.value;
        const country = countrySelect.value;

        if (!language || !country) return;

        const chartContainer = document.getElementById('salary-chart');
        chartContainer.style.opacity = '0.5';

        const response = await fetch(`/api/salaries?language=${encodeURIComponent(language)}&country=${encodeURIComponent(country)}`);
        const data = await response.json();
        
        chartContainer.style.opacity = '1';

        if (data.length > 0) {
            const experienceOrder = ['<1 year', '1–2 years', '3–5 years', '6–10 years', '11–16 years', '16+ years'];
            data.sort((a, b) => experienceOrder.indexOf(a.experience) - experienceOrder.indexOf(b.experience));
            renderChart(data);
            updateResultsText(data);
        } else {
            if (salaryChart) salaryChart.destroy();
            document.getElementById('results-text').innerHTML = `No data available for <strong>${language}</strong> in <strong>${country}</strong>.`;
        }
    }

    await fetchFilters();
    
    languageSelect.value = 'PHP';
    countrySelect.value = 'United States';
    
    await fetchDataAndRenderChart();

    languageSelect.addEventListener('change', fetchDataAndRenderChart);
    countrySelect.addEventListener('change', fetchDataAndRenderChart);
});
