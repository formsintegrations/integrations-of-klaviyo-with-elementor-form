<?php

if (!defined('ABSPATH')) {
    exit;
}

use FormInteg\IKLAVIYOEF\Core\Util\Route;
use FormInteg\IKLAVIYOEF\Triggers\Elementor\ElementorController;

Route::get('elementor/get', [ElementorController::class, 'getAllForms']);
Route::post('elementor/get/form', [ElementorController::class, 'getFormFields']);
