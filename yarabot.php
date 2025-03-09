<?php
/*
    Plugin Name: YaraBot
    Plugin URI:  https://www.yarabot.ir
    Description: YaraBot Plugin
    Version:     1.0
    Author:      Mohammad Varasteh
    License:     GPL2
*/




define('YARABOT_BASEDIR',__DIR__);
define('YARABOT_ASSETS' ,plugin_dir_url(__FILE__) . '/assets/' );

require_once YARABOT_BASEDIR . '/autoLoader.php';
require_once YARABOT_BASEDIR . '/install.php';
require_once YARABOT_BASEDIR . '/uninstall.php';

register_activation_hook(__FILE__, 'yarabot_install');
register_uninstall_hook(__FILE__, 'yarabot_uninstall');


use YaraBot\Controller\AppController;

new AppController();
