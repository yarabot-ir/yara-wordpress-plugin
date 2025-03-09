<?php
  wp_enqueue_style('YaraBot_chat_style', YARABOT_ASSETS . '/css/admin.css');
  wp_enqueue_style('YaraBot_bootstrap_style', YARABOT_ASSETS . '/bootstrap/css/bootstrap.min.css');
  wp_enqueue_style('YaraBot_bootstrap_icon_style', YARABOT_ASSETS . '/bootstrap/icons/bootstrap-icons.css');

  wp_nonce_field( 'YaraBot_nonce_action', 'yarabot_nonce_field' );
  wp_enqueue_script('YaraBot_chat_script', YARABOT_ASSETS . '/js/admin.js', array('jquery'), null, true);
  wp_localize_script('YaraBot_chat_script', 'yarabot', $data);
  
?>
<div class="display_none" id="yarabot_main_success">
  <div class="success-box">
    <div class="card-title move text-center">
        <img src="<?= YARABOT_ASSETS . '/image/logo (10).svg' ?>  " width="120">
    </div>

    <div class="shadow scale"></div>
        <div class="message">
              <h3 class="yarabot_title">یارابات</h3>
              <p>پیکربندی باموفقیت ثبت شده است</p>
              <button type="button" id="yarabot_edit" class="btn btn-outline-info">ویرایش</button>

        </div>
  </div>

</div>
