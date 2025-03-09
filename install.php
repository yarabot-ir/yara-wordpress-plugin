<?php



function yarabot_install() 
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'yarabot';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (  
            id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
            agent_id VARCHAR(255) COLLATE utf8mb4_persian_ci NULL,  
            token VARCHAR(255) COLLATE utf8mb4_persian_ci NULL  
        ) $charset_collate;";
    
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
    
}
