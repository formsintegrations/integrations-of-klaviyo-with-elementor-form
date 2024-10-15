<?php

/***
 * If try to direct access  plugin folder it will Exit
 **/

use FormInteg\IKLAVIYOEF\Actions\ActionController;
use FormInteg\IKLAVIYOEF\Core\Util\API as Route;

if (!defined('ABSPATH')) {
    exit;
}

Route::get('redirect/', [new ActionController(), 'handleRedirect'], null, ['state' => ['required' => true]]);
