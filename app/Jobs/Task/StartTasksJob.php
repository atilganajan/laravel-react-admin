<?php

namespace App\Jobs\Task;

use App\Task;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StartTasksJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        Log::info('StartTasksJob Running');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Get the current date as a Carbon instance
        $currentDate = Carbon::now();

        try {
            // Fetch tasks that need to be updated
            $tasks = Task::whereDate('start_date', '<=', $currentDate)
                ->where('status', 'pending')
                ->get();

            //  Loop through each task to update its status and trigger the observer
            foreach ($tasks as $task) {
                $task->update(['status' => 'in_progress']);
            }

            // Log the number of updated tasks
            Log::info('StartTasksJob: Updated tasks count: ' . count($tasks));

        } catch (\Exception $e) {
            // Log the error message
            Log::error('StartTasksJob: Failed to update tasks: ' . $e->getMessage());
        }
    }
}
