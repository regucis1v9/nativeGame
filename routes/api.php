<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/createPaymentIntent', [PaymentController::class, 'createPaymentIntent']);

?>