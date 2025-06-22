<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class SalaryController extends Controller
{
    public function getFilters()
    {
        // The distinct query for language is tricky because of "JavaScript / TypeScript"
        // A simple distinct() won't work as intended if we want to search for them separately.
        // For now, we will just use what is in the database.
        $languages = DB::table('salaries')->distinct()->orderBy('language')->pluck('language');
        $countries = DB::table('salaries')->distinct()->orderBy('country')->pluck('country');

        return response()->json([
            'languages' => $languages,
            'countries' => $countries,
        ]);
    }

    public function getSalaries(Request $request)
    {
        $language = $request->input('language');
        $country = $request->input('country');

        $query = DB::table('salaries')->where('country', $country);

        // Handle combined language entries like "JavaScript / TypeScript"
        $query->where('language', 'LIKE', '%' . $language . '%');

        $salariesByExperience = $query->get()->groupBy('experience');

        $experienceLevels = ['<1 year', '1–2 years', '3–5 years', '6–10 years', '11–16 years', '16+ years'];
        
        $result = collect($experienceLevels)->map(function ($level) use ($salariesByExperience) {
            if (!isset($salariesByExperience[$level])) {
                return null;
            }

            $salaries = $salariesByExperience[$level]->pluck('salary')->sort()->values();

            if ($salaries->isEmpty()) {
                return null;
            }
            
            return [
                'experience' => $level,
                'stats' => [
                    'min' => $salaries->first() * 1000,
                    'max' => $salaries->last() * 1000,
                    'q1' => $this->percentile($salaries, 0.25) * 1000,
                    'median' => $this->percentile($salaries, 0.5) * 1000,
                    'q3' => $this->percentile($salaries, 0.75) * 1000,
                ],
                'count' => $salaries->count()
            ];
        })->filter();

        return response()->json($result->values());
    }

    private function percentile(Collection $collection, float $percentile)
    {
        if ($collection->isEmpty()) {
            return 0;
        }
        
        $count = $collection->count();
        $index = ($count - 1) * $percentile;
        $lowerIndex = floor($index);
        $upperIndex = ceil($index);

        if ($lowerIndex == $upperIndex) {
            return $collection->get($lowerIndex);
        }

        $lowerValue = $collection->get($lowerIndex);
        $upperValue = $collection->get($upperIndex);
        $fraction = $index - $lowerIndex;

        return $lowerValue + ($upperValue - $lowerValue) * $fraction;
    }
}
