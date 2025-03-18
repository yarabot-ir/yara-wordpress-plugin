<?php

wp_enqueue_script('YaraBot_chat_wavesurfer_script', YARABOT_ASSETS . '/js/wavesurfer.js', array('jquery'), null, true);

wp_enqueue_script('YaraBot_chat_script', YARABOT_ASSETS . '/js/chat.js', array('jquery'), null, true);

wp_nonce_field( 'YaraBot_nonce_action', 'yarabot_nonce_field' );


// ارسال داده به اسکریپت
wp_localize_script('YaraBot_chat_script', 'yarabot', $data);

wp_enqueue_style('YaraBot_bootstrap_style', YARABOT_ASSETS . '/bootstrap/css/bootstrap.css');
wp_enqueue_style('YaraBot_bootstrap_icon_style', YARABOT_ASSETS . '/bootstrap/icons/bootstrap-icons.css');
wp_enqueue_style('YaraBot_chat_style', YARABOT_ASSETS . '/css/main.css');




?>

    <span class="yarabot_start_message textIcon shadow" id="yarabot_start_message">
    سلام😊 من هم‌یار هوشمند دستیار هوشمند هستم.
    اینجام تا به سوالات شما در هر ساعتی از شبانه‌روز پاسخ بدم. چطور می‌تونم کمکتون کنم؟
    </span>

    <div class="yarabot_icon" id="mainShowChatBtn">
        <div class="yarabot_IconButton">
            <button class="mainShowChatBtn">
                <img id="mainShowChatBtn" src="<?= YARABOT_ASSETS . '/image/logo (9).svg' ?>  " width="30px">
            </button>
        </div>
    </div>
    
    
    
    <div class="yarabot_icon_close display_none d-none" id="mainCloseChatBtn">
        <div class="yarabot_IconButton">
            <button class="mainShowChatBtn">
                <img src="<?= YARABOT_ASSETS . '/image/arow.svg' ?>  " width="30px">
            </button>
        </div>
    </div>

    <div id="yarabot_chatBox" class="yarabot_chatBox d-none display_none">

        <!--مربوط به هدر-->
        <div id="yarabot_header" class="yarabot_header">
            <div class="row">
                <div class="col-2 col-2" style="padding: 0 !important">
                    <img id="header_logo" src="<?= YARABOT_ASSETS . '/image/logo (9).svg' ?>  ">
                </div> 
                <div class="col-9 col-9" style="margin: 0px 3px" >
                    <p id="header_title" class="yarabot_TitleHeader mb-0">ربات هوشمند یارا</p>
                    <div class="d-flex">
                        <img src="<?= YARABOT_ASSETS . '/image/AI Label.svg' ?> ">
                        <p id="header_description" class="yarabot_SubTitleHeader mb-0 me-2">ربات</p>
                    </div>
                </div>
                <!--<div id="yarabot_close_btn" class="yarabot_Icon col-2 col-2">-->
                <!--    <i class="bi bi-x"></i>-->
                <!--</div>-->
            </div>
        </div>
        <!---->

        <!--مربوط بخ صفحات چت-->
        <div class="yarabot_Content" id="yarabot_Content" >

        </div>

        <!---->

        <!--مربوط به input ها و دکمه ها-->
        <div class="yarabot_input d-flex align-items-center">

            <!--input نوشتن متن-->
            <!--<input id="input_send" type="text" placeholder="شروع به نوشتن کن ...">-->
        
            <textarea id="input_send" class="yarabot_textarea" placeholder="شروع به نوشتن کن ..." rows="1"></textarea>

            <!--مربوط به قسمت ضبط صدا-->
            <div id="voiceRecorder" class="yarabot_VoiceRecorder display_none">
                <div style="width:30%;display:flex;align-items: center;justify-content: space-evenly;">
                    <img id="deleteButton" src="<?= YARABOT_ASSETS . '/image/trash.png' ?> ">
                    <audio src="" id="audio_voice" ></audio>
                    <div style="width:25px">
                        <i class="bi bi-volume-mute display-block display_none"  id="unMutedButton"></i>
                        <i class="bi bi-volume-up" id="mutedButton"></i>
                    </div>
                    <div style="width:30px" class="text-center">
                        <span class="time" id="recordingTime">0:00</span>
                    </div>
                </div>
                <div style="width: 60%;" class="px-1">
                    <div id="waveform" style="width:100%"></div>
                    <canvas id="waveformCanvas" style="width:100%;height:30px"></canvas>

                </div>
                <div style="width:10%">
                    <div id="progress"></div>
                    <i class="bi bi-pause-circle-fill yarabot_PlayBtn display_none" data-btn="pause" style="display:flex" id="pauseButton"></i>
                    <i class="bi bi-play-circle-fill yarabot_PlayBtn" style="display:flex" data-btn="play" id="playButton"></i>
                </div>
            </div>

            <!--دکمه ها -->
            <div class="yarabot_VoiceDeactive display_none ms-2" id="voiceRecordingBtn">
                <img src="<?= YARABOT_ASSETS . '/image/Group 2.svg' ?> ">
            </div>
            <div class="yarabot_VoiceActive ms-2 me-2" id="voice_active">
                <img src="<?= YARABOT_ASSETS . '/image/microphone.svg' ?>">
            </div>
            <div class="yarabot_SendActive yarabot_disabled" id="send_active">
                <img src="<?= YARABOT_ASSETS . '/image/Group 1 (1).svg' ?> ">
            </div>
            <div class="yarabot_SendDeactive" id="send_deactive">
                <img src="<?= YARABOT_ASSETS . '/image/Group 1 (2).svg' ?> ">
            </div>
        </div>
        <div class="text-center bg-light d-flex align-items-center justify-content-center" style="height:25px;background:#80808012">
            <p  style="margin:0px;color:#878e99 !important;">
                <a href="https://yarabot.ir" class="yarabot_link" style="text-decoration: none;" >
                    Powered by <span style="color:green">yarabot</span>
                </a>
            </p>
        </div>
    </div>



<?php
