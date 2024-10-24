# API Documentation

This document offers a comprehensive overview of the API endpoints utilized in the Laravel React Task Management System. Each endpoint is outlined with its intended function, required request parameters, and expected response formats.


# Get Tasks

**URL:** `/api/v1/tasks`  
**Method:** `GET`  
**Description:** Retrieves a paginated list of tasks.

## Query Parameters

| Name       | Type    | Description                                      |
|------------|---------|--------------------------------------------------|
| `per_page` | integer | Number of tasks per page (optional, default: 10) |
| `page`     | integer | Page number to retrieve (optional, default: 1)   |

## Example Request

GET /api/v1/tasks?per_page=1&page=1


## Example Response

```json
{
    "current_page": 1,
    "data": [
        {
            "id": 16,
            "user_id": 1,
            "title": "Task Title",
            "description": "Task description",
            "start_date": "2024-10-24",
            "end_date": "2024-10-25",
            "status": "in_progress",
            "created_at": "2024-10-24 16:01:28",
            "updated_at": "2024-10-24 16:22:06",
            "user": {
                "id": 1,
                "name": "Jovert Palonpon"
            }
        }
    ],
    "first_page_url": "http://127.0.0.1:8000/api/v1/tasks?page=1",
    "last_page": 3,
    "next_page_url": "http://127.0.0.1:8000/api/v1/tasks?page=2",
    "total": 3
}


# Create Task

**URL:** `/api/v1/tasks`  
**Method:** `POST`  
**Description:** Creates a new task with the specified details.

## Request Body

| Name          | Type    | Description                                        |
|---------------|---------|----------------------------------------------------|
| `user_id`     | integer | The ID of the user to whom the task is assigned.   |
| `title`       | string  | The title of the task.                             |
| `description` | string  | A detailed description of the task.                |
| `start_date`  | date    | The start date of the task (`YYYY-MM-DD` format).  |
| `end_date`    | date    | The end date of the task (`YYYY-MM-DD` format).    |

## Example Request

```json
{
  "user_id": 1,
  "title": "New Task Title",
  "description": "Detailed task description",
  "start_date": "2024-10-25",
  "end_date": "2024-10-31"
}

## Example Response

{
    "task": {
        "user_id": 1,
        "title": "New Task Title",
        "description": "Detailed task description",
        "start_date": "2024-10-25",
        "end_date": "2024-10-31",
        "created_at": "2024-10-24 21:55:16",
        "updated_at": "2024-10-24 21:55:16",
        "id": 19
    },
    "message": "Task created successfully",
    "status": 201
}

# Update Task

**URL:** `/api/v1/tasks/{id}`  
**Method:** `PATCH`  
**Description:** Updates the details of an existing task, including changing its status.

## URL Parameters

| Name   | Type    | Description                        |
|--------|---------|------------------------------------|
| `id`   | integer | The ID of the task to be updated.  |

## Request Body

| Name          | Type    | Description                                        |
|---------------|---------|----------------------------------------------------|
| `user_id`     | integer | The ID of the user to whom the task is assigned.   |
| `title`       | string  | The title of the task.                             |
| `description` | string  | A detailed description of the task.                |
| `start_date`  | date    | The start date of the task (`YYYY-MM-DD` format).  |
| `end_date`    | date    | The end date of the task (`YYYY-MM-DD` format).    |
| `status`      | string  | The current status of the task (e.g., `pending`, `in_progress`, `completed`). |

## Example Request

```json
{
  "user_id": 1,
  "title": "Updated Task Title",
  "description": "Updated task description",
  "start_date": "2024-10-25",
  "end_date": "2024-10-31",
  "status": "in_progress"
}

## Example Response

{
    "task": {
        "id": 19,
        "user_id": 1,
        "title": "Updated Task Title",
        "description": "Updated task description",
        "start_date": "2024-10-25",
        "end_date": "2024-10-31",
        "status": "in_progress",
        "created_at": "2024-10-24 21:55:16",
        "updated_at": "2024-10-24 21:56:16",
        "user": {
            "id": 1,
            "name": "Jovert Palonpon"
        }
    },
    "message": "Task updated successfully",
    "status": 200
}

# Delete Task

**URL:** `/api/v1/tasks/{id}`  
**Method:** `DELETE`  
**Description:** Deletes an existing task by its ID.

## URL Parameters

| Name   | Type    | Description                        |
|--------|---------|------------------------------------|
| `id`   | integer | The ID of the task to be deleted.  |

## Example Request

DELETE /api/v1/tasks/19

## Example Response

```json
{
    "message": "Task deleted successfully",
    "status": 200
}