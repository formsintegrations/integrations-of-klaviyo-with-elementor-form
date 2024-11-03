<?php

/**
 * Plugin Name: Integrations of Klaviyo with Elementor form
 * Requires Plugins: elementor
 * Plugin URI:  https://formsintegrations.com/elementor-forms-integration-with-klaviyo
 * Description: This plugin integrates Elementor forms with Klaviyo
 * Version:     1.0.6
 * Author:      Forms Integrations
 * Author URI:  https://formsintegrations.com
 * Text Domain: iklaviyoef
 * Requires PHP: 5.6
 * Domain Path: /languages
 * License: GPLv2 or later
 */

/***
 * If try to direct access plugin folder it will Exit
 **/
if (!defined('ABSPATH')) {
    exit;
}

// Define most essential constants.
define('IKLAVIYOEF_VERSION', '1.0.6');
define('IKLAVIYOEF_DB_VERSION', '1.0.0');
define('IKLAVIYOEF_PLUGIN_MAIN_FILE', __FILE__);

require_once plugin_dir_path(__FILE__) . 'includes/loader.php';
if (!function_exists('iklaviyoef_activate_plugin')) {
    function iklaviyoef_activate_plugin()
    {
        global $wp_version;
        if (version_compare($wp_version, '5.1', '<')) {
            wp_die(
                esc_html__('This plugin requires WordPress version 5.1 or higher.', 'iklaviyoef'),
                esc_html__('Error Activating', 'iklaviyoef')
            );
        }
        if (version_compare(PHP_VERSION, '5.6.0', '<')) {
            wp_die(
                esc_html__('Forms Integrations requires PHP version 5.6.', 'iklaviyoef'),
                esc_html__('Error Activating', 'iklaviyoef')
            );
        }
        do_action('iklaviyoef_activation');
    }
}

register_activation_hook(__FILE__, 'iklaviyoef_activate_plugin');

if (!function_exists('iklaviyoef_deactivation')) {
    function iklaviyoef_deactivation()
    {
        do_action('iklaviyoef_deactivation');
    }
}
register_deactivation_hook(__FILE__, 'iklaviyoef_deactivation');

if (!function_exists('iklaviyoef_uninstall_plugin')) {
    function iklaviyoef_uninstall_plugin()
    {
        do_action('iklaviyoef_uninstall');
    }
}
register_uninstall_hook(__FILE__, 'iklaviyoef_uninstall_plugin');
