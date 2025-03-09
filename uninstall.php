<?php

function yarabot_uninstall() 
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'yarabot';
    
    $sql = "DROP TABLE IF EXISTS $table_name";
    $wpdb->query($sql);
    
    error_log('پلاگین به طور کامل حذف شد و جدول پاک شد!');
}
register_uninstall_hook(__FILE__, 'my_plugin_uninstall');
