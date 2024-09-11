<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnedItem extends Model
{
    use HasFactory;
        /** 
     *
     * @var bool
     */
    
   public $timestamps = false; 

    protected $table = 'ownedItems';

    protected $fillable = ['userID', 'itemID'];
}
