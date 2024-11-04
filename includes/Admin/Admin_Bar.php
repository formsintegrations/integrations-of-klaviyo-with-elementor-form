<?php

namespace FormInteg\IKLAVIYOEF\Admin;

use FormInteg\IKLAVIYOEF\Core\Util\DateTimeHelper;
use FormInteg\IKLAVIYOEF\Core\Util\Capabilities;
use FormInteg\IKLAVIYOEF\Core\Util\Hooks;

/**
 * The admin menu and page handler class
 */

class Admin_Bar
{
    public function register()
    {
        Hooks::add('in_admin_header', [$this, 'RemoveAdminNotices']);
        Hooks::add('admin_menu', [$this, 'AdminMenu'], 11);
        Hooks::add('admin_enqueue_scripts', [$this, 'AdminAssets'], 11);
        Hooks::filter('script_loader_tag', [$this, 'filterScriptTag'], 0, 3);
    }

    /**
     * Register the admin menu
     *
     * @return void
     */
    public function AdminMenu()
    {
        global $submenu;
        $capability = Hooks::apply('manage_iklaviyoef', 'manage_options');
        if (Capabilities::Check($capability)) {

            add_menu_page(__('Integrations for Elementor Forms', 'iklaviyoef'), 'Elementor Klaviyo', $capability, 'iklaviyoef', [$this, 'RootPage'], 'data:image/svg+xml;base64,' . base64_encode('<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="256" height="256" rx="32" fill="currentColor" />
	<g clip-path="url(#clip0_3_6)">
		<path d="M167.908 182.311L170.404 191.3C157.018 201.075 140.869 206.336 124.293 206.32C122.134 206.32 120.002 206.235 117.888 206.053C82.2245 203.166 53.3293 176.384 47.2106 141.742C45.603 132.666 45.603 123.378 47.2106 114.302C53.3293 79.6595 82.2342 52.88 117.888 49.9905V77.5852C97.4363 80.1569 80.7688 94.8907 75.3294 114.312H117.888V141.751H75.3246C77.6868 150.151 82.1665 157.802 88.3343 163.974C94.5022 170.145 102.152 174.629 110.549 176.996C110.549 176.996 110.549 176.996 110.569 176.996C111.632 177.292 112.711 177.561 113.81 177.779C114.184 177.867 114.565 177.942 114.958 178C115.225 178.056 115.494 178.104 115.751 178.153C116.008 178.201 116.181 178.218 116.392 178.247C116.804 178.315 117.214 178.381 117.626 178.429C119.756 178.719 121.902 178.869 124.051 178.878H124.233C128.893 178.881 133.532 178.247 138.02 176.996C145.49 174.906 152.38 171.128 158.157 165.952C160.164 167.9 161.944 170.068 163.463 172.415C165.439 175.469 166.938 178.806 167.908 182.311Z" fill="currentColor" />
		<path d="M197.339 147.909C203.654 157.085 207.925 167.509 209.865 178.478H181.722C180.363 173.579 178.265 168.915 175.499 164.649C171.482 158.412 166.149 153.131 159.874 149.175C153.599 145.219 146.534 142.684 139.175 141.749H131.62V50H159.072V107.257C165.687 103.249 171.305 97.7891 175.499 91.2902C178.264 87.0235 180.363 82.3603 181.722 77.4613H209.865C206.211 97.9206 194.578 116.09 177.527 127.973C185.274 133.379 191.985 140.135 197.339 147.918V147.909Z" fill="currentColor" />
	</g>
	<defs>
		<clipPath id="clip0_3_6">
			<rect width="163.863" height="156.32" fill="currentColor" transform="translate(46 50)" />
		</clipPath>
	</defs>
</svg>
'), 30);
        }

        $submenu['iklaviyoef'][] = array(__('Forms', 'iklaviyoef'), $capability, 'admin.php?page=iklaviyoef#/');
    }

    /**
     * Load the asset libraries
     *
     * @return void
     */
    public function AdminAssets($current_screen)
    {

        if (strpos($current_screen, 'iklaviyoef') === false) {
            return;
        }

        $parsed_url = parse_url(get_admin_url());
        $site_url = $parsed_url['scheme'] . '://' . $parsed_url['host'];
        $site_url .= empty($parsed_url['port']) ? null : ':' . $parsed_url['port'];
        $base_path_admin = str_replace($site_url, '', get_admin_url());

        $prefix = 'FITEKLAVIYO';
        if (is_readable(IKLAVIYOEF_PLUGIN_DIR_PATH . DIRECTORY_SEPARATOR . 'port')) {
            $devPort = file_get_contents(IKLAVIYOEF_PLUGIN_DIR_PATH . DIRECTORY_SEPARATOR . 'port');
            $devUrl = 'http://localhost:' . $devPort;
            wp_enqueue_script(
                'vite-client-helper-' . $prefix . '-MODULE',
                $devUrl . '/config/devHotModule.js',
                [],
                null
            );

            wp_enqueue_script(
                'vite-client-' . $prefix . '-MODULE',
                $devUrl . '/@vite/client',
                [],
                null
            );
            wp_enqueue_script(
                'index-' . $prefix . '-MODULE',
                $devUrl . '/index.jsx',
                [],
                null
            );
        } else {
            wp_enqueue_script(
                'index-' . $prefix . '-MODULE',
                IKLAVIYOEF_ASSET_URI . "/index-" . IKLAVIYOEF_VERSION . ".js",
                [],
                null
            );
        }

        global $wp_rewrite;
        $api = [
            'base'      => get_rest_url() . 'elementor-to-klaviyo/v1',
            'separator' => $wp_rewrite->permalink_structure ? '?' : '&'
        ];
        $users = get_users(['fields' => ['ID', 'user_nicename', 'user_email', 'display_name']]);
        $userMail = [];
        // $userNames = [];
        foreach ($users as $key => $value) {
            $userMail[$key]['label'] = !empty($value->display_name) ? $value->display_name : '';
            $userMail[$key]['value'] = !empty($value->user_email) ? $value->user_email : '';
            $userMail[$key]['id'] = $value->ID;
            // $userNames[$value->ID] = ['name' => $value->display_name, 'url' => get_edit_user_link($value->ID)];
        }

        $iklaviyoef = apply_filters(
            'iklaviyoef_localized_script',
            [
                'nonce'      => wp_create_nonce('iklaviyoef_nonce'),
                'assetsURL'  => IKLAVIYOEF_ASSET_URI,
                'baseURL'    => $base_path_admin . 'admin.php?page=iklaviyoef#/',
                'siteURL'    => site_url(),
                'ajaxURL'    => admin_url('admin-ajax.php'),
                'api'        => $api,
                'dateFormat' => get_option('date_format'),
                'timeFormat' => get_option('time_format'),
                'timeZone'   => DateTimeHelper::wp_timezone_string(),
                'userMail'   => $userMail,
                'redirect' => get_rest_url() . 'iklaviyoef/redirect',
            ]
        );
        if (get_locale() !== 'en_US' && file_exists(IKLAVIYOEF_PLUGIN_BASEDIR . '/languages/generatedString.php')) {
            include_once IKLAVIYOEF_PLUGIN_BASEDIR . '/languages/generatedString.php';
            $iklaviyoef['translations'] = $elementor_to_klaviyo_i18n_strings;
        }
        wp_localize_script('index-' . $prefix . '-MODULE', 'iklaviyoef', $iklaviyoef);
    }

    /**
     * elementor-to-klaviyo  apps-root id provider
     *
     * @return void
     */
    public function rootPage()
    {
        include IKLAVIYOEF_PLUGIN_BASEDIR . '/views/view-root.php';
    }

    public function filterScriptTag($html, $handle)
    {
        $newTag = $html;
        $prefix = 'FITEKLAVIYO';
        if (preg_match('/' . $prefix . '-MODULE/', $handle)) {
            $newTag = preg_replace('/<script /', '<script type="module" ', $newTag);
        }
        return $newTag;
    }

    public function RemoveAdminNotices()
    {
        global $plugin_page;

        if (empty($plugin_page) || strpos($plugin_page, 'iklaviyoef') === false) {
            return;
        }

        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
    }
}
