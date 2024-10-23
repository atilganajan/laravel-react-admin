<?php

namespace App\Observers;

use App\Notifications\Task\TaskStatusUpdatedNotification;
use App\Task;
use Illuminate\Support\Facades\Cache;

class TaskObserver
{
    /**
     * Handle the task "created" event.
     *
     * @param  \App\Task  $task
     * @return void
     */
    public function created(Task $task)
    {
        // Clear tasks_list cache
        Cache::forget('tasks_list');
    }

    /**
     * Handle the task "updated" event.
     *
     * @param  \App\Task  $task
     * @return void
     */
    public function updated(Task $task)
    {
        // Clear tasks_list cache
        Cache::forget('tasks_list');

        // Check if the status has changed
        if ($task->isDirty('status')) {
            $oldStatus = $task->getOriginal('status'); // get old status
            $newStatus = $task->status;  // get new status

            // Check if old status and new status are the same, if different, send notification
            if ($oldStatus !== $newStatus) {
                // Send notification to user
                $task->user->notify(new TaskStatusUpdatedNotification($task));
            }
        }
    }

    /**
     * Handle the task "deleted" event.
     *
     * @param  \App\Task  $task
     * @return void
     */
    public function deleted(Task $task)
    {
        // Clear tasks_list cache
        Cache::forget('tasks_list');
    }

}
