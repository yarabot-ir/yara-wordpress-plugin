<?php

namespace YaraBot\Helper;


class Request
{
    public static function get($method,$url,$token,$data)
    {
        $method = strtoupper($method);

        $args = array(
            'method'    => $method, 
            'headers'   => array(
                'Authorization' => $token,
            ),
            'body'      => $data,
            'timeout'   => 60, // تنظیم تایم‌اوت به 30 ثانیه
        );
        
        // ارسال درخواست
        $response = wp_remote_get($url, $args); 

        return $response;
    }




}