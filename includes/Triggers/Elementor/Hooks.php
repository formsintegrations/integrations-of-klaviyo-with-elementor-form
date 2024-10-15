<?php

if (!defined('ABSPATH')) {
    exit;
}

use FormInteg\IKLAVIYOEF\Core\Util\Hooks;
use FormInteg\IKLAVIYOEF\Triggers\Elementor\ElementorController;

Hooks::add('elementor_pro/forms/new_record', [ElementorController::class, 'handle_elementor_submit']);
