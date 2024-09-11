<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;

Route::get('/createPaymentIntent', [PaymentController::class, 'createPaymentIntent']);
Route::post('/test', [PaymentController::class, 'test']);
Route::post('/createUser', [UserController::class, 'createUser']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/updateCoins', [UserController::class, 'updateBalance']);
Route::post('/updateOwned', [UserController::class, 'addOwnedItem']);
Route::post('/getByID', [UserController::class, 'getUserById']);
Route::post('/updateUser', [UserController::class, 'updateUser']);
Route::post('/createGame', [UserController::class, 'createGame']);
Route::get('/getGamesData', [UserController::class, 'getGamesData']);
?>