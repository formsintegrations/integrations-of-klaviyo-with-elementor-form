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

            add_menu_page(__('Integrations for Elementor Forms', 'integration-of-elementor-and-klaviyo'), 'Elementor Klaviyo', $capability, 'iklaviyoef', [$this, 'RootPage'], 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 240 240"><g><path d="m167.908 182.311 2.496 8.989a78.06 78.06 0 0 1-46.111 15.02c-2.159 0-4.291-.085-6.405-.267-35.663-2.887-64.559-29.669-70.677-64.311a78.665 78.665 0 0 1 0-27.44c6.118-34.643 35.023-61.422 70.677-64.312v27.595c-20.452 2.572-37.12 17.306-42.559 36.727h42.559v27.439H75.325a50.95 50.95 0 0 0 35.224 35.245h.02c1.063.296 2.142.565 3.241.783.374.088.755.163 1.148.221.267.056.536.104.793.153.257.048.43.065.641.094.412.068.822.134 1.234.182 2.13.29 4.276.44 6.425.449h.182c4.66.003 9.299-.631 13.787-1.882a50.611 50.611 0 0 0 20.137-11.044 37.094 37.094 0 0 1 5.306 6.463 35.79 35.79 0 0 1 4.445 9.896Z"/><path d="M197.339 147.909a77.827 77.827 0 0 1 12.526 30.569h-28.143a49.974 49.974 0 0 0-6.223-13.829 50.825 50.825 0 0 0-36.324-22.9h-7.555V50h27.452v57.257a51.01 51.01 0 0 0 16.427-15.967 50.012 50.012 0 0 0 6.223-13.829h28.143a78.362 78.362 0 0 1-32.338 50.512 78.737 78.737 0 0 1 19.812 19.945v-.009Z"/></g></svg>
'), 30);
        }

        $submenu['iklaviyoef'][] = array(__('Forms', 'integration-of-elementor-and-klaviyo'), $capability, 'admin.php?page=iklaviyoef#/');
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

        $parsed_url = wp_parse_url(get_admin_url());
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
