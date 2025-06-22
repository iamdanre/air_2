<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->string('language');
            $table->string('experience');
            $table->integer('salary');
            $table->timestamps();
        });

        // Load and insert data from JSON file
        $jsonPath = database_path('calculatorData.json');
        if (file_exists($jsonPath)) {
            $data = json_decode(file_get_contents($jsonPath), true);

            foreach ($data as $country => $languages) {
                foreach ($languages as $language => $details) {
                    foreach ($details['entries'] as $entry) {
                        $metadata = $entry['metadata'];
                        DB::table('salaries')->insert([
                            'country' => $metadata['Country'],
                            'language' => $metadata['Language'],
                            'experience' => $metadata['Experience'],
                            'salary' => $entry['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
