<?php

namespace FormInteg\IKLAVIYOEF\Core\Util;

use FormInteg\IKLAVIYOEF\Core\Database\DB;

/**
 * Class handling plugin activation.
 *
 * @since 1.0.0
 */
final class Activation
{
    public function activate()
    {
        add_action('iklaviyoef_activation', [$this, 'install']);
    }

    public function install()
    {
        $this->installAsSingleSite();
    }

    public function installAsSingleSite()
    {
        $installed = get_option('iklaviyoef_installed');
        if ($installed) {
            $oldVersion = get_option('iklaviyoef_version');
        }
        if (!$installed || version_compare($oldVersion, IKLAVIYOEF_VERSION, '!=')) {
            DB::migrate();
            update_option('iklaviyoef_installed', time());
        }
        update_option('iklaviyoef_version', IKLAVIYOEF_VERSION);
    }
}
