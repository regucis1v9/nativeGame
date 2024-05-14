<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        // Get the coin amount from the query parameters
        $coinAmount = $request->query('coinAmount');

        // Multiply the coin amount by 50 to achieve the payment amount
        $paymentAmount = $coinAmount * 50;

        // Create Stripe customer and ephemeral key
        $stripe = new StripeClient([
            'api_key' => 'sk_test_51OZyEIESpZPSxN9apoE4SjJ74B8HkrQfm6qtdY4a8vcQXD5Ay7jXhw4tl1m8dG49eR0vUfuNzbjCUBeIMSxMvUh200n7De2Ecw',
            'stripe_version' => '2024-04-10',
        ]);
        $customer = $stripe->customers->create();
        $ephemeralKey = $stripe->ephemeralKeys->create([
            'customer' => $customer->id,
        ], [
            'stripe_version' => '2024-04-10',
        ]);

        try {
            // Create a payment intent with the calculated payment amount
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => $paymentAmount,
                'currency' => 'usd',
                'customer' => $customer->id,
                'description' => 'Purchase of in-game currency',
            ]);

            // Return the necessary data including the ephemeral key, customer ID, payment intent client secret, and publishable key
            return response()->json([
                'ephemeralKey' => $ephemeralKey->secret,
                'customer' => $customer->id,
                'paymentIntent' => $paymentIntent->client_secret,
                'publishableKey' => env('STRIPE_KEY'),
            ], 200);
        } catch (ApiErrorException $e) {
            // Handle any API errors
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function test()
    {
        return response()->json('testing');
    }
}
