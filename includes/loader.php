<?php

if (!defined('ABSPATH')) {
    exit;
}
$scheme = wp_parse_url(home_url())['scheme'];

define('IKLAVIYOEF_PLUGIN_BASENAME', plugin_basename(IKLAVIYOEF_PLUGIN_MAIN_FILE));
define('IKLAVIYOEF_PLUGIN_BASEDIR', plugin_dir_path(IKLAVIYOEF_PLUGIN_MAIN_FILE));
define('IKLAVIYOEF_ROOT_URI', set_url_scheme(plugins_url('', IKLAVIYOEF_PLUGIN_MAIN_FILE), $scheme));
define('IKLAVIYOEF_PLUGIN_DIR_PATH', plugin_dir_path(IKLAVIYOEF_PLUGIN_MAIN_FILE));
define('IKLAVIYOEF_ASSET_URI', IKLAVIYOEF_ROOT_URI . '/assets');
define('IKLAVIYOEF_ASSET_JS_URI', IKLAVIYOEF_ROOT_URI . '/assets/js');
// Autoload vendor files.
require_once IKLAVIYOEF_PLUGIN_BASEDIR . 'vendor/autoload.php';
// Initialize the plugin.
FormInteg\IKLAVIYOEF\Plugin::load();
