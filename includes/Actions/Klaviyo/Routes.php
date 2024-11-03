<?php

if (!defined('ABSPATH')) {
    exit;
}

use FormInteg\IKLAVIYOEF\Actions\Klaviyo\KlaviyoController;
use FormInteg\IKLAVIYOEF\Core\Util\Route;

Route::post('klaviyo_handle_authorize', [klaviyoController::class, 'handleAuthorize']);
