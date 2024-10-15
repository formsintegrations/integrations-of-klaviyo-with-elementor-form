<?php

/**
 * Provides Base Model Class
 */

namespace FormInteg\IKLAVIYOEF\Core\Database;

/**
 * Undocumented class
 */

use FormInteg\IKLAVIYOEF\Core\Database\Model;

class LogModel extends Model
{
    protected static $table = 'iklaviyoef_log';

    public function autoLogDelete($condition)
    {
        global $wpdb;
        if (
            !\is_null($condition)
        ) {
            $tableName = $wpdb->prefix . static::$table;

            $result = $this->app_db->get_results("DELETE FROM $tableName WHERE $condition", OBJECT_K);

            return $result;
        }
    }
}
