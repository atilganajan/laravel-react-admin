<?php

namespace App\Notifications\Task;

use App\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskStatusUpdatedNotification extends Notification
{
    use Queueable;

    protected $task;

    /**
     * Status and their readable versions
     */
    protected $statusMapping = [
        'pending' => 'Pending',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
    ];

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * The way the notification is saved to the database
     */
    public function toDatabase($notifiable)
    {
        // Get readable version status
        $readableStatus = $this->statusMapping[$this->task->status];

        return [
            'task_id' => $this->task->id,
            'title' => $this->task->title,
            'status' => $this->task->status,
            'start_date' => $this->task->start_date,
            'end_date' => $this->task->end_date,
            'message' => "The task status has been updated to '$readableStatus'.",
        ];
    }
}
