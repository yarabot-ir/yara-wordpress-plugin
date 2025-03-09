<?php

spl_autoload_register(function($className) 
{
    $className = ltrim($className, '\\');
    $className = str_replace(__NAMESPACE__, '', $className);
    if(strpos($className,'YaraBot') !== false)
    {
        $className = str_replace('YaraBot', '', $className);
        $path = YARABOT_BASEDIR . '/inc/' . $className . '.php';
        $path = str_replace('\\', '/', $path);


        if(file_exists($path))
        {
            require_once $path;

            return true;
        }

        var_dump("Error Loader File");
        var_dump($path);

        return false;
    }


    $path = __DIR__ . '/classes/' . str_replace('\\', '/', $className) . ".class.php";
    if(file_exists($path)) {
        include $path;
    }
    return;
});