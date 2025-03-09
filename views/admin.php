<?php

wp_nonce_field( 'YaraBot_nonce_action', 'yarabot_nonce_field' );

wp_enqueue_script('YaraBot_chat_script', YARABOT_ASSETS . '/js/admin.js', array('jquery'), null, true);
wp_localize_script('YaraBot_chat_script', 'yarabot', $data);



wp_enqueue_style('YaraBot_chat_style', YARABOT_ASSETS . '/css/admin.css');
wp_enqueue_style('YaraBot_bootstrap_style', YARABOT_ASSETS . '/bootstrap/css/bootstrap.min.css');
wp_enqueue_style('YaraBot_bootstrap_icon_style', YARABOT_ASSETS . '/bootstrap/icons/bootstrap-icons.css');


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="./assets/bootstrap/icons/bootstrap-icons.css">
    <title>Document</title>
</head>
<body dir="rtl">
    <div class="loading display_none" id="yarabot_loading" >
        <div class="loader"></div>
    </div>

        <div id="yarabot_main_form" class="row display_none yarabot_main_form w-100">
            <div class="col-5   mx-auto">
                <div class="card p-4 yarabot_card border border-success">
                    <div class="card-title text-center">
                        <img class="move" src="<?= YARABOT_ASSETS . '/image/logo (10).svg' ?>  " width="120">
                        <p class="h3 yarabot_title">یارابات</p>
                    </div>
                    <div class="card-body ">
                        <form id="yarabot_config_main">
                            <input id="yarabot_agent_id" placeholder="agent id  وارد کنید" class="form-control mb-3">
                            <input id="yarabot_token" placeholder="توکن را وارد کنید" class="form-control">
                            <div class="col-12 mt-4">
                                <button id="yarabot_set_btn" type="button" class="btn btn-success w-100">ثبت</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</body>
</html>