<?php

namespace FormInteg\IKLAVIYOEF\Admin;

use FormInteg\IKLAVIYOEF\Core\Util\Route;

class AdminAjax
{
    public function register()
    {
        Route::post('app/config', [$this, 'updatedAppConfig']);
        Route::get('get/config', [$this, 'getAppConfig']);
    }

    public function updatedAppConfig($data)
    {
        if (!property_exists($data, 'data')) {
            wp_send_json_error(__('Data can\'t be empty', 'integration-of-elementor-and-klaviyo'));
        }

        update_option('iklaviyoef_app_conf', $data->data);
        wp_send_json_success(__('save successfully done', 'integration-of-elementor-and-klaviyo'));
    }

    public function getAppConfig()
    {
        $data = get_option('iklaviyoef_app_conf');
        wp_send_json_success($data);
    }
}
