<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\OwnedItem;
use App\Models\Games;


class UserController extends Controller
{
    public function createUser(Request $request)
    {
        $validation = Validator::make($request->all(), [ 
            'name' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validation->fails()) { 
            return response()->json(['error' => $validation->messages()], 400);
        }

        $validatedData = $validation->validated();
        try {
            $user = new User();
            $user->name = $validatedData['name'];
            $user->email = $validatedData['email'];
            $user->password = Hash::make($validatedData['password']);
            $user->balance = 0; 
            $user->save();

            return response()->json(['user' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create user', 'message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validation = Validator::make($request->all(), [ 
            'name' => 'required|string|exists:users',
            'password' => 'required|string',
        ]);

        if ($validation->fails()) { 
            return response()->json(['error' => 'Invalid credentials'], 400);
        }

        $credentials = $request->only('name', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $user->remember_token = Str::random(60);
            $user->save();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['user' => $user, 'token' => $token], 200);
        } else {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            if ($user) {
                $user->remember_token = null;
                $user->save();
                Auth::logout();
                return response()->json(['message' => 'User logged out successfully'], 200);
            } else {
                return response()->json(['message' => 'User not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to logout user', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateBalance(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'balance' => 'required|integer',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }

        try {
            $user = User::findOrFail($request->userID);
            $user->balance += $request->balance;
            $user->save();

            return response()->json(['message' => 'Balance updated successfully', 'user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update balance', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUserById(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
        ]);
    
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }
    
        try {
            $user = User::findOrFail($request->userID);
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve user data', 'message' => $e->getMessage()], 500);
        }
    }
    

    public function checkPassword(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'password' => 'required|string',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }

        try {
            $user = User::findOrFail($request->userID);
            if (Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Password matches'], 200);
            } else {
                return response()->json(['error' => 'Password does not match'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check password', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUser(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'name' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }

        try {
            $user = User::findOrFail($request->userID);

            $usernameExists = User::where('name', $request->name)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($usernameExists) {
                return response()->json(['error' => 'The username is already taken'], 400);
            } else {
                $user->name = $request->name;
                $user->email = $request->email;
                $user->password = Hash::make($request->password);
                $user->save();

                return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update user', 'message' => $e->getMessage()], 500);
        }
    }
    public function addOwnedItem(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'itemID' => 'required|integer',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }

        try {
            $ownedItem = new OwnedItem();
            $ownedItem->userID = $request->userID;
            $ownedItem->itemID = $request->itemID;
            $ownedItem->save();

            return response()->json(['message' => 'Item added to user successfully', 'ownedItem' => $ownedItem], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add item to user', 'message' => $e->getMessage()], 500);
        }
    }
    public function createGame(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'gameScore' => 'required|integer',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()], 400);
        }

        try {
            $games = new Games();
            $games->userID = $request->userID;
            $games->gameScore = $request->gameScore;
            $games->save();

            return response()->json(['message' => 'game added to table successfully', 'ownedItem' => $games], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add game to table', 'message' => $e->getMessage()], 500);
        }
    }
    public function getGamesData(Request $request)
{
    try {
        $gamesData = Games::select('games.gameScore', 'users.name as username')
            ->join('users', 'games.userID', '=', 'users.id')
            ->orderBy('games.gameScore', 'desc')
            ->get();

        return response()->json(['gamesData' => $gamesData], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to retrieve games data', 'message' => $e->getMessage()], 500);
    }
}

}

