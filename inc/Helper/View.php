<?php

namespace YaraBot\Helper;


class View
{
    public static function load($file,$data = [])
    {
        $path = YARABOT_BASEDIR . '/views/' . $file . '.php';

        if(file_exists($path))
        {
            extract($data);
            return  require_once $path;
        }

        return false;
        
    }



}