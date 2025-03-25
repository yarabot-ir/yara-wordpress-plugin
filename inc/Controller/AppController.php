<?php

namespace YaraBot\Controller;

use YaraBot\Controller\BaseController;
use YaraBot\Helper\View;
use YaraBot\Helper\Request;

class AppController extends BaseController
{
    public function __construct() 
    {
        $config = $this->configuration();
        $this->actions();
        $menuData = 
        [
            'title' => 'یارابات',
            'name'  => 'یارابات',
            'slug'  => 'YaraBot_menu',
            'handler' => [$this,'menu'],
            'icon' => YARABOT_ASSETS . '/image/icon.svg'
        ];
        $this->addMenu($menuData);
        
        if(!$config)
        {
            $this->showNoticesAdmin('برای استفاده از یارابات باید پیکربندی اولیه را انجام دهید!');

            return false;
        }
        
        $config = $this->configuration();
        $configChat = $this->getChatConfig($config[0]['agent_id'],$config[0]['token']);
        if($configChat['response']['code'] !== 200 )
        {
            $this->showNoticesAdmin('پیکربندی یارابات پیدا نشد!! تنظیمات پیکربندی را بررسی کنید.');
                
            return false;
        }
        
        add_action('wp_footer', [$this,'addYarabotChat']);
    }
    

    private function actions()
    {
        add_filter('script_loader_tag', [$this, 'addTypeModule'], 10, 3);
        add_action('wp_ajax_nopriv_yarabot_set_configuration', [$this,'setConfiguration']);
        add_action('wp_ajax_yarabot_set_configuration', [$this,'setConfiguration'] );
    }

    public function menu()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'yarabot';
        $existing_record = $wpdb->get_row(("SELECT * FROM $table_name "), ARRAY_A);
        $data = 
            [
                'assets_url' => YARABOT_ASSETS,
                'ajax_url' => admin_url('admin-ajax.php'),
                'display'  => 'form'
            ];

        if($existing_record)
        {
            $data['display'] = 'success';
        }
        
        View::load('admin',$data);
        View::load('success_config',$data);
        

    }

    public function addYarabotChat()
    {
        $config = $this->configuration();
        if(!is_null($config))
        {
            $configChat = $this->getChatConfig($config[0]['agent_id'],$config[0]['token']);
            if($configChat['response']['code'] !== 200 )
            {
                $this->showNoticesAdmin('برای استفاده از یارابات باید پیکربندی اولیه را انجام دهید!');
                
                return false;
            }
            $data = 
            [
                'config' => $configChat['body'] ,
                'assets_url' => YARABOT_ASSETS,
                'agent_id' => $config[0]['agent_id'],
                'token'    => $config[0]['token'],
                'ajax_url' => admin_url('admin-ajax.php'),
            ];
            $content =  View::load('chat/bot',$data);
    
            return $content ;
            
        }
    }
    
    private function getChatConfig($agent_id,$token)
    {
        $url = 'https://backend.yarabot.ir/agent/bot/'. $agent_id .'/preferences';
        $configChat = Request::get('get',$url,$token,[]);

        return $configChat;
    }


    public function configuration()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'yarabot';
        
        $results = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
        
        return $results;
    }

    public function setConfiguration()
    {
        $data = $_POST['data'];
        $this->checkNonce();
        if(isset($data['token']) && isset($data['agent_id']) && !empty($data['token']) && !empty($data['agent_id']) )
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'yarabot';
            
            $existing_record = $wpdb->get_row("SELECT * FROM $table_name ", ARRAY_A);
            $data['agent_id'] = sanitize_text_field($data['agent_id']);
            $data['token'] = sanitize_text_field($data['token']);
            if ($existing_record) 
            {
                $wpdb->update(  
                    $table_name,  
                    [  
                        'token'    => $data['token'],   
                        'agent_id' => $data['agent_id']  
                    ],  
                    ['id' => $existing_record['id']],
                    ['%s', '%s'],   
                    ['%d'] 
                );  
            } else 
            {
                $wpdb->insert(
                    $table_name,
                    [
                        'token' => $data['token'],
                        'agent_id' => $data['agent_id'],
                    ],
                    ['%s', '%s']
                );
            }
            wp_send_json(['status' => true, 'message' => $existing_record['token']]);
        }

        wp_send_json(['status' => false, 'message' => ['error' =>'لطفا فرم را به درستی مقداردهی نمایید'] ]);

        
    }

    private function checkConfiguration()
    {
       $config = $this->configuration();
       if(empty($config) || count($config) == 0)
       {
            return false;
       }

       return true;
    }


    
}


