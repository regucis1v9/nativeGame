<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Games extends Model
{
    use HasFactory;

            /** 
     *
     * @var bool
     */
    
   public $timestamps = false; 
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'userID',
        'gameScore',
        // Add more fillable attributes as needed
    ];

    /**
     * Get the user that owns the game.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userID');
    }
}
