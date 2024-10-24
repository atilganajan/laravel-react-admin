<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * List Tasks
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
        $page = $request->query('page', 1); // Default page
        $perPage = $request->query('per_page', 10); // Default rows per page
        
        // Cache key
        $cacheKey = "tasks_list_page_{$page}_per_page_{$perPage}";

        // Check Paginate, if have paginate then clean cache
        if ($request->has('page')) {
            Cache::forget($cacheKey);
        }

         // get tasks
        $tasks = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($perPage) {
            return Task::with('user')->paginate($perPage);
        });

            return response()->json($tasks);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Store Task
     *
     * @param \Illuminate\Http\Request $request
     * @return Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'title' => 'required|string',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            // Check Validate and if fail return 422
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $task = Task::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

            return response()->json(['task' => $task, 'message' => 'Task created successfully', 'status' => 201], 201);

        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

    /**
     * Show Task
     *
     * @param App\Task $task
     * @return Illuminate\Http\JsonResponse
     */
    public function show(Task $task): JsonResponse
    {
        try {
            $task->load('user');

            return response()->json($task);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Update Task
     *
     * @param \Illuminate\Http\Request $request
     * @param App\Task $task
     * @return Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                "user_id" => 'required|exists:users,id',
                'title' => 'required|string',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'status' => 'required|string|in:pending,in_progress,completed',
            ]);

            // Check Validate and if fail return 422
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $task->update([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
            ]);

            return response()->json(['task' => $task, 'message' => 'Task updated successfully', 'status' => 200]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

    /**
     * Destroy Task
     *
     * @param App\Task $task
     * @return Illuminate\Http\JsonResponse
     */
    public function destroy(Task $task): JsonResponse
    {
        try {
            $task->delete();
            return response()->json(['message' => 'Task deleted successfully','status'=>200]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
