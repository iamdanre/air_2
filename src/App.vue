<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <h1>IT Salary Calculator</h1>
        <p>Estimate your income potential based on the JetBrains Developer Ecosystem Survey 2024</p>
      </div>
    </header>

    <div class="container">
      <!-- Filters -->
      <section class="filters">
        <h2>Filter by:</h2>
        <div class="filter-grid">
          <div class="filter-group">
            <label for="country">Country:</label>
            <select id="country" v-model="selectedCountry" @change="fetchData">
              <option value="">All Countries</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="language">Programming Language:</label>
            <select id="language" v-model="selectedLanguage" @change="fetchData">
              <option value="">All Languages</option>
              <option v-for="language in languages" :key="language" :value="language">
                {{ language }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="experience">Experience Level:</label>
            <select id="experience" v-model="selectedExperience" @change="fetchData">
              <option value="">All Experience Levels</option>
              <option v-for="experience in experienceLevels" :key="experience" :value="experience">
                {{ experience }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        Loading salary data...
      </div>

      <!-- Error state -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="!loading && !error" class="results">
        <!-- Statistics Card -->
        <div class="stats-card">
          <h3>Salary Statistics</h3>
          <div class="stat-item">
            <span class="stat-label">Average Salary:</span>
            <span class="stat-value">${{ formatNumber(stats.average) }}k</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Minimum Salary:</span>
            <span class="stat-value">${{ formatNumber(stats.minimum) }}k</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Maximum Salary:</span>
            <span class="stat-value">${{ formatNumber(stats.maximum) }}k</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Sample Size:</span>
            <span class="stat-value">{{ formatNumber(stats.count) }} responses</span>
          </div>
        </div>

        <!-- Chart -->
        <div class="chart-container">
          <h3>Salary Distribution</h3>
          <canvas ref="chartCanvas" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'App',
  data() {
    return {
      // Filter options
      countries: [],
      languages: [],
      experienceLevels: [],
      
      // Selected filters
      selectedCountry: '',
      selectedLanguage: '',
      selectedExperience: '',
      
      // Data
      stats: {
        average: 0,
        minimum: 0,
        maximum: 0,
        count: 0
      },
      distribution: [],
      
      // UI state
      loading: false,
      error: null,
      chart: null
    }
  },
  
  async mounted() {
    await this.loadFilterOptions()
    await this.fetchData()
  },
  
  methods: {
    async loadFilterOptions() {
      try {
        const [countriesRes, languagesRes, experienceRes] = await Promise.all([
          fetch('http://localhost:3001/api/countries'),
          fetch('http://localhost:3001/api/languages'),
          fetch('http://localhost:3001/api/experience-levels')
        ])
        
        this.countries = await countriesRes.json()
        this.languages = await languagesRes.json()
        this.experienceLevels = await experienceRes.json()
      } catch (error) {
        console.error('Error loading filter options:', error)
        this.error = 'Failed to load filter options. Please make sure the server is running.'
      }
    },
    
    async fetchData() {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        if (this.selectedCountry) params.append('country', this.selectedCountry)
        if (this.selectedLanguage) params.append('language', this.selectedLanguage)
        if (this.selectedExperience) params.append('experience', this.selectedExperience)
        
        const [statsRes, distributionRes] = await Promise.all([
          fetch(`http://localhost:3001/api/salary-stats?${params}`),
          fetch(`http://localhost:3001/api/salary-distribution?${params}`)
        ])
        
        this.stats = await statsRes.json()
        this.distribution = await distributionRes.json()
        
        this.$nextTick(() => {
          this.renderChart()
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        this.error = 'Failed to fetch salary data. Please make sure the server is running.'
      } finally {
        this.loading = false
      }
    },
    
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }
      
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.distribution.map(item => item.range),
          datasets: [{
            label: 'Number of Responses',
            data: this.distribution.map(item => item.count),
            backgroundColor: 'rgba(0, 122, 204, 0.6)',
            borderColor: 'rgba(0, 122, 204, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Responses'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Salary Range (USD thousands)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Salary Distribution'
            },
            legend: {
              display: false
            }
          }
        }
      })
    },
    
    formatNumber(num) {
      if (num === null || num === undefined) return '0'
      return num.toLocaleString()
    }
  }
}
</script>