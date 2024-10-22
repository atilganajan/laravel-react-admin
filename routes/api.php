<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->name('api.')->group(function () {
    Route::namespace('V1')->name('v1.')->prefix('v1')->group(function () {
        Route::namespace('Auth')->name('auth.')->prefix('auth')->group(function () {
            Route::post('identify', 'SessionsController@identify')->name('identify');
            Route::post('signin', 'SessionsController@signin')->name('signin');

            Route::middleware('auth:api')->group(function () {
                Route::post('signout', 'SessionsController@signout')->name('signout');
                Route::post('refresh', 'SessionsController@refresh')->name('refresh');
                Route::post('user', 'SessionsController@user')->name('user');
            });

            Route::name('password.')->prefix('password')->group(function () {
                Route::post('request', 'ForgotPasswordController@sendResetLinkEmail')->name('request');
                Route::patch('reset/{token}', 'ResetPasswordController@reset')->name('reset');
            });
        });

        Route::middleware('auth:api')->group(function () {
            Route::namespace('Settings')->prefix('settings')->name('settings.')->group(function () {
                Route::patch('profile', 'ProfileController@update')->name('profile');

                Route::prefix('account')->name('account.')->group(function () {
                    Route::patch('password', 'AccountController@updatePassword')->name('password');
                    Route::patch('credentials', 'AccountController@updateCredentials')->name('credentials');
                });
            });

            Route::resource('users', 'UsersController', ['except' => ['edit', 'create']]);
            Route::prefix('users')->name('users.')->group(function () {
                Route::patch('{user}/restore', 'UsersController@restore')->name('restore');

                Route::prefix('{user}/avatar')->name('avatar.')->group(function () {
                    Route::post('/', 'UsersController@storeAvatar')->name('store');
                    Route::delete('/', 'UsersController@destroyAvatar')->name('destroy');
                });
            });

            // Task routes
            Route::resource('tasks', 'TaskController', ['except' => ['edit', 'create']]);
            // Grouped task routes
            Route::prefix('tasks')->name('tasks.')->group(function () {
                // Get all tasks
                Route::get("/", "TaskController@index")->name("index");
                // Get a task
                Route::get("/{task}", "TaskController@show")->name("show");
                // Store new task
                Route::post("/", "TaskController@store")->name("store");
                // Update task
                Route::patch("/{task}", "TaskController@update")->name("update");
                // Delete task
                Route::delete("/{task}", "TaskController@destroy")->name("destroy");
            });
        });
    });
});
