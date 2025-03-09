<?php

namespace YaraBot\Controller;

class BaseController
{

    protected function addMenu($menu) 
    {
        add_action('admin_menu', function() use ($menu)
        {
            add_menu_page(
                    $menu['title'],           
                    $menu['name'],             
                    'manage_options',        
                    $menu['slug'],  
                    $menu['handler'], 
                    $menu['icon'],
                    70                        
           );
        });

    }
    
    protected function showNoticesAdmin($message = '' , $type = 'error' )
    {

        add_action( 'admin_notices', function()  use($message,$type)
        {
            ?>
            <div class="notice notice-<?php echo $type ?> is-dismissible">
                <p><?php _e( $message, 'sample-text-domain' ); ?></p>
            </div>
             <?php
        });
    }

    protected function checkNonce()
    {
        if ( isset( $_POST['security'] ) && wp_verify_nonce( $_POST['security'], 'YaraBot_nonce_action' ) ) 
        {
            return true;
        } 
        
        wp_send_json(['status' => false , 'data' => [] ]);
    }

    public function addTypeModule($tag, $handle,$src)
    {
        wp_enqueue_script('jquery');       
        if (strpos($handle , 'YaraBot') !== false)
        {
            $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
        }

        return $tag;

    }
    
}