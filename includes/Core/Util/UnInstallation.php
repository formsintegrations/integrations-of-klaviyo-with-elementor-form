<?php

namespace FormInteg\IKLAVIYOEF\Core\Util;

/**
 * Class handling plugin uninstallation.
 *
 * @since 1.0.0
 * @access private
 * @ignore
 */
final class UnInstallation
{
    /**
     * Registers functionality through WordPress hooks.
     *
     * @since 1.0.0-alpha
     */
    public function register()
    {
        $option = get_option('iklaviyoef_app_conf');
        if (isset($option->erase_db)) {
            add_action('iklaviyoef_uninstall', [self::class, 'uninstall']);
        }
    }

    public static function uninstall()
    {
        global $wpdb;
        $columns = ['iklaviyoef_db_version', 'iklaviyoef_installed', 'iklaviyoef_version'];

        $tableArray = [
            $wpdb->prefix . 'iklaviyoef_flow',
            $wpdb->prefix . 'iklaviyoef_log',
        ];

        foreach ($tableArray as $tableName) {
            $wpdb->query("DROP TABLE IF EXISTS $tableName");
        }

        $columns = $columns + ['iklaviyoef_app_conf'];

        foreach ($columns as $column) {
            $query = $wpdb->prepare("DELETE FROM `{$wpdb->prefix}options` WHERE option_name = %s", $column);
            $wpdb->query($query);
        }
        $wpdb->query("DELETE FROM `{$wpdb->prefix}options` WHERE `option_name` LIKE '%iklaviyoef_webhook_%'");
    }
}
