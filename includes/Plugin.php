<?php

namespace FormInteg\IKLAVIYOEF;

/**
 * Main class for the plugin.
 *
 * @since 1.0.0-alpha
 */

use FormInteg\IKLAVIYOEF\Core\Hooks\HookService;
use FormInteg\IKLAVIYOEF\Core\Database\DB;
use FormInteg\IKLAVIYOEF\Admin\Admin_Bar;
use FormInteg\IKLAVIYOEF\Core\Util\Request;
use FormInteg\IKLAVIYOEF\Core\Util\Activation;
use FormInteg\IKLAVIYOEF\Core\Util\Deactivation;
use FormInteg\IKLAVIYOEF\Core\Util\UnInstallation;
use FormInteg\IKLAVIYOEF\Core\Util\Capabilities;
use FormInteg\IKLAVIYOEF\Core\Util\Hooks;
use FormInteg\IKLAVIYOEF\Log\LogHandler;

final class Plugin
{
    /**
     * Main instance of the plugin.
     *
     * @since 1.0.0-alpha
     * @var   Plugin|null
     */
    private static $_instance = null;

    /**
     * Initialize the hooks
     *
     * @return void
     */
    public function initialize()
    {
        Hooks::add('plugins_loaded', [$this, 'init_plugin'], 12);
        (new Activation())->activate();
        (new Deactivation())->register();
        (new UnInstallation())->register();
    }

    public function init_plugin()
    {
        Hooks::add('init', [$this, 'init_classes'], 8);
        Hooks::add('init', [$this, 'integrationlogDelete'], 11);
        Hooks::filter('plugin_action_links_' . plugin_basename(IKLAVIYOEF_PLUGIN_MAIN_FILE), [$this, 'plugin_action_links']);
    }

    /**
     * Instantiate the required classes
     *
     * @return void
     */
    public function init_classes()
    {
        static::update_tables();
        if (Request::Check('admin')) {
            (new Admin_Bar())->register();
        }
        new HookService();
        global $wp_rewrite;
        define('IKLAVIYOEF_API_MAIN', get_site_url() . ($wp_rewrite->permalink_structure ? '/wp-json' : '/?rest_route='));
    }

    /**
     * Plugin action links
     *
     * @param  array $links
     *
     * @return array
     */
    public function plugin_action_links($links)
    {
        $links[] = '<a href="https://docs.bit-integrations.bitapps.pro" target="_blank">' . __('Docs', 'iklaviyoef') . '</a>';

        return $links;
    }

    /**
     * Retrieves the main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @return Plugin Plugin main instance.
     */
    public static function instance()
    {
        return static::$_instance;
    }

    public static function update_tables()
    {
        if (!Capabilities::Check('manage_options')) {
            return;
        }

        $installed_db_version = get_site_option('iklaviyoef_db_version');
        if (version_compare($installed_db_version, IKLAVIYOEF_DB_VERSION, '<')) {
            DB::migrate();
        }
    }

    public static function integrationlogDelete()
    {
        $option = get_option('iklaviyoef_app_conf');
        if (isset($option->enable_log_del) && isset($option->day)) {
            LogHandler::logAutoDelte($option->day);
        }
    }

    public static function load()
    {
        if (null !== static::$_instance) {
            return false;
        }
        static::$_instance = new static();
        static::$_instance->initialize();
        return true;
    }
}
