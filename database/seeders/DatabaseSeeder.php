<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Use environment-configurable seeded passwords so defaults aren't hard-coded
        // You can set these in your local .env file (e.g. SEED_ADMIN_PASSWORD=yourpass)
        $adminPassword = env('SEED_ADMIN_PASSWORD', 'admin123');
        $facultyPassword = env('SEED_FACULTY_PASSWORD', 'faculty123');
        $studentPassword = env('SEED_STUDENT_PASSWORD', 'student123');

        User::updateOrCreate(
            ['email' => 'admin@sfms.local'],
            [
                'name' => 'System Admin',
                'username' => 'admin',
                'role' => 'admin',
                'password' => Hash::make($adminPassword),
            ]
        );

        User::updateOrCreate(
            ['email' => 'faculty@sfms.local'],
            [
                'name' => 'Faculty User',
                'username' => 'faculty',
                'role' => 'faculty',
                'password' => Hash::make($facultyPassword),
            ]
        );

        User::updateOrCreate(
            ['email' => 'student@sfms.local'],
            [
                'name' => 'Student User',
                'username' => 'student',
                'role' => 'student',
                'password' => Hash::make($studentPassword),
            ]
        );
    }
}
