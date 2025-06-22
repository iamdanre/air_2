<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>IT Salary Calculator</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-[#0a0a0a] text-white">
        <div class="container mx-auto p-8">
            <header class="text-center mb-10">
                <h1 class="text-5xl font-bold">IT Salary Calculator</h1>
                <p class="text-gray-400 mt-4 max-w-2xl mx-auto">
                    Each year, our extensive surveys reach out to over 30,000 developers across over 180 countries, representing a diverse range of specialties. With data collected over multiple years, we are able to present a comprehensive analysis of tech trends using the methodology described <a href="https://lp.jetbrains.com/devecosystem-data-playground/methodology/#salary-calculator/" class="underline">here</a>.
                </p>
                <p class="text-gray-400 mt-4 max-w-2xl mx-auto">
                    Use our calculator to estimate your income potential based on software developer skills, programming language, location, and experience.
                </p>
            </header>
    
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Left Panel: Filters -->
                <div class="lg:w-1/3 bg-[#1e293b] p-6 rounded-xl">
                    <div class="flex items-center mb-6">
                        <div class="text-3xl font-bold text-indigo-400 mr-4">1</div>
                        <p>Enter your programming language, and country.</p>
                    </div>
                    <form id="salary-form">
                        <div class="mb-4">
                            <label for="language" class="block text-sm font-medium text-gray-300 mb-2">Programming language</label>
                            <select name="language" id="language" class="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"></select>
                        </div>
                        <div>
                            <label for="country" class="block text-sm font-medium text-gray-300 mb-2">Country</label>
                            <select name="country" id="country" class="w-full p-2.5 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"></select>
                        </div>
                    </form>
                </div>
    
                <!-- Right Panel: Chart -->
                <div class="lg:w-2/3">
                    <div class="flex items-start mb-6">
                        <div class="text-3xl font-bold text-indigo-400 mr-4">2</div>
                        <p>Calculate the salary range based on your parameters.</p>
                    </div>
                    <div class="bg-white text-gray-800 p-6 rounded-xl">
                        <div id="results-text" class="mb-4 text-lg"></div>
                        <canvas id="salary-chart"></canvas>
                        <div class="text-xs text-gray-500 mt-4">
                            <p>The graph shows salary distribution among users of the selected technology in the specified region, based on responses from Developer Ecosystem Survey 2024.</p>
                            <p class="mt-2">Note: Experience levels refer to total years of professional coding, not years using the selected technology.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
