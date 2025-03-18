
import { yaraBot_baseController } from "./baseController.js";

class yaraBot_chatController extends yaraBot_baseController
{
    constructor()
    {
        super();
        this.isRecording = false;
        this.isplay = false;
        this.mediaRecorder = false;
        this.audioChunks = [];
        this.mode = 'text'
        this.isMuted = false;
        this.session_id = null;
        this.scroll = true;


        this.lastMessage = null


        this.elements = 
        {
            mainShowChatBtn : document.getElementById("mainShowChatBtn"),
            mainCloseChatBtn : document.getElementById("mainCloseChatBtn"),
            mainChatScreen  : document.getElementById('yarabot_chatBox'),
            startMessage : document.getElementById('yarabot_start_message')

        };
        this.elements.header = 
        {
            main : this.elements.mainChatScreen.querySelector('#yarabot_header'),
            closeBtn : this.elements.mainChatScreen.querySelector('#yarabot_close_btn'),
            logo : this.elements.mainChatScreen.querySelector('#header_logo'),
        }
        this.elements.chatContent = 
        {
            main : this.elements.mainChatScreen.querySelector('#yarabot_Content'),
            sendBtn : this.elements.mainChatScreen.querySelector('#send_active'),
            inputSend : this.elements.mainChatScreen.querySelector('#input_send'),
            voiceRecorder : 
            {
               main : this.elements.mainChatScreen.querySelector('#voiceRecorder'),
               voiceRecordingBtn : this.elements.mainChatScreen.querySelector('#voiceRecordingBtn'),
               voiceActive : this.elements.mainChatScreen.querySelector('#voice_active'),
               recordingTime : this.elements.mainChatScreen.querySelector('#recordingTime'),
               play : this.elements.mainChatScreen.querySelector('#playButton'),
               pause : this.elements.mainChatScreen.querySelector('#pauseButton'),
               muted : this.elements.mainChatScreen.querySelector('#mutedButton'),
               unMuted : this.elements.mainChatScreen.querySelector('#unMutedButton'),
               audio : this.elements.mainChatScreen.querySelector('#audio_voice'),
               deleteVoice : this.elements.mainChatScreen.querySelector("#deleteButton"),
               liveNoise : this.elements.mainChatScreen.querySelector("#waveformCanvas"),

            }
        }
        
        this.events = 
        [
            {
                target   : this.elements.mainShowChatBtn,
                getType  : 'single',
                type     : 'click',
                methods  : ['showChat'],
                listener : null
            },
            {
                target   : this.elements.mainCloseChatBtn,
                getType  : 'single',
                type     : 'click',
                methods  : ['showChat'],
                listener : null
            },
            {
                target   : this.elements.header.closeBtn,
                getType  : 'single',
                type     : 'click',
                methods  : ['showChat'],
                listener : null
            },
            {
                target   : this.elements.chatContent.sendBtn,
                getType  : 'single',
                type     : 'click',
                keydown  : 'Enter',
                methods  : ['send'],
                listener : null
            },
            {
                target   : this.elements.chatContent.inputSend,
                getType  : 'single',
                type     : 'input',
                keydown  : 'Enter',
                methods  : ['sendBtnActiveHandler','typeToTextarea'],
                listener : null
            },
            {
                target   : this.elements.chatContent.voiceRecorder.voiceActive,
                getType  : 'single',
                type     : 'click',
                methods  : ['recordVoice'],
                listener : null
            },
            {
                target   : this.elements.chatContent.voiceRecorder.play,
                getType  : 'single',
                type     : 'click',
                methods  : ['playVoice'],
                listener : null
            },
            {
                target   : this.elements.chatContent.voiceRecorder.pause,
                getType  : 'single',
                type     : 'click',
                methods  : ['pauseVoice'],
                listener : null
            },
            {
                target   : this.elements.chatContent.voiceRecorder.deleteVoice,
                getType  : 'single',
                type     : 'click',
                methods  : ['deleteVoice'],
                listener : null
            },
            {
                target   : this.elements.chatContent.voiceRecorder.voiceRecordingBtn,
                getType  : 'single',
                type     : 'click',
                methods  : ['recordVoice'],
                listener : null
            },

        ];

        this.addNeedEvents();
        this.config();
        setInterval(this.elapsedTimeMessage.bind(this), 60000);
        this.start();

    }

    showChat()
    {
        this.selectEl(this.elements.mainChatScreen).toggle();
        this.selectEl(this.elements.mainCloseChatBtn).toggle();
        this.selectEl(this.elements.mainShowChatBtn).toggle();
        
        this.selectEl(this.elements.startMessage).close();
    }


    async recordVoice() 
    {  
        if (this.isplay) 
        {  
            return false;  
        }  

        if (!this.isRecording) 
        {  
            try {  
                const stream = await this.getUserMedia();  
                this.selectEl(this.elements.chatContent.voiceRecorder.main).show();  
                this.selectEl(this.elements.chatContent.voiceRecorder.liveNoise).show();  

                this.elements.chatContent.inputSend.value = '';  
                this.mediaRecorder = new MediaRecorder(stream);  
                this.audioChunks = [];  
    
                // ایجاد یک AudioContext و AnalyserNode  
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();  
                const source = audioContext.createMediaStreamSource(stream);  
                const analyser = audioContext.createAnalyser();  
                source.connect(analyser);  
                analyser.fftSize = 2048; // اندازه FFT  
                const bufferLength = analyser.frequencyBinCount;  
                const dataArray = new Uint8Array(bufferLength);  
    
                this.elements.chatContent.voiceRecorder.main.querySelector('#waveform').innerHTML = '';  
    
                this.mediaRecorder.ondataavailable = (event) => {  
                    this.audioChunks.push(event.data);  
                };  
    
                this.mediaRecorder.start();  
                this.isRecording = true;  
                this.mode = 'voice';  
                this.selectEl(this.elements.chatContent.voiceRecorder.voiceRecordingBtn).show();  
                this.selectEl(this.elements.chatContent.voiceRecorder.voiceActive).close();  
                this.selectEl(this.elements.chatContent.inputSend).close();  
                this.selectEl(this.elements.chatContent.voiceRecorder.play).close();  
    
                this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();  
                this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();  
    
                this.sendBtnActiveHandler();  
                this.selectEl(this.elements.chatContent.voiceRecorder.recordingTime).startTimer();  
    
                // تابع برای نمایش نویز به صورت زنده  
                const draw = () => {  
                    requestAnimationFrame(draw);  
                    analyser.getByteFrequencyData(dataArray);  
    
                    // this.renderWaveform(dataArray);  
                };  
                draw();  
    
                return true;  
    
            } catch (error) {  
                // console.error("Error accessing the microphone: ", error);  
                // alert("خطا در دسترسی به میکروفن. لطفاً مجوز دسترسی به میکروفن را بررسی کنید.");  
                return false;  
            }  
        }  
        
            await new Promise((resolve) => {  
                this.mediaRecorder.onstop = resolve;  
                this.mediaRecorder.stop();  
            });  
        
            await this.stopRecorder();  
    }  
    ///نمایش نویز ها به صورت لایو
    renderWaveform(dataArray) 
    {  
        const canvas = this.elements.chatContent.voiceRecorder.liveNoise;  
        const ctx = canvas.getContext('2d');  
        const width = canvas.width;  
        const height = canvas.height;  
        ctx.fillStyle = "rgba(242, 243, 245, 1)";  
      
        ctx.clearRect(0, 0, width, height);  
        ctx.fillStyle = 'rgba(242, 243, 245, 1)';  
        ctx.fillRect(0, 0, width, height);  
      
        const sliceWidth = width / dataArray.length;  
        let x = 0;  
      
        ctx.beginPath();  
        for (let i = 0; i < dataArray.length; i++) {  
            const barHeight = dataArray[i] / 2;  
            const y = height / 2 + (barHeight * 3.5);  
            if (i === 0) {  
                ctx.moveTo(x, y);  
            } else {  
                ctx.lineTo(x, y);  
            }  
            x += sliceWidth;  
        }  
        ctx.lineTo(width, height / 2);  
        ctx.strokeStyle = '#737376';  
        ctx.lineWidth = 5;  
        ctx.stroke();  
        ctx.closePath();  
    }
    async getUserMedia() 
    {
        const constraints = { audio: true };
    
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constraints);
        } else if (navigator.getUserMedia) 
        {
            return new Promise((resolve, reject) => {
                navigator.getUserMedia(constraints, resolve, reject);
            });
        } else {
            return Promise.reject(new Error("Your browser does not support audio recording."));
        }
    }

    
    async stopRecorder()
    {
        
        await this.mediaRecorder.stream.getTracks().forEach(track => track.stop());                

        this.isRecording = false;
    
        this.selectEl(this.elements.chatContent.voiceRecorder.liveNoise).close();  

        this.selectEl(this.elements.chatContent.voiceRecorder.voiceRecordingBtn).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.voiceActive).show();
    
        this.selectEl(this.elements.chatContent.voiceRecorder.play).show();

    
        this.selectEl(this.elements.chatContent.inputSend).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.main).show();
    
        this.stopTimer();
        
        const recordingTime = this.elements.chatContent.voiceRecorder.recordingTime;
        recordingTime.setAttribute('duration',recordingTime.innerText);
    
        this.sendBtnActiveHandler();
    
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.elements.chatContent.voiceRecorder.audio.src = audioUrl;
        
        this.addWavesurferVoice(this.elements.chatContent.voiceRecorder.main);
        
        this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();

    }


    async deleteVoice()
    {
        if(this.isRecording)
        {
            await this.stopRecorder();
        }
        
        this.isplay = false;
        
        this.selectEl(this.elements.chatContent.voiceRecorder.liveNoise).close();  

        this.elements.chatContent.voiceRecorder.audio.src = '';
        this.elements.chatContent.voiceRecorder.main.querySelector('#waveform').innerHTML = '';
        this.audioChunks = [];
        this.mode = 'text';
        this.sendBtnActiveHandler();
        this.elements.chatContent.voiceRecorder.recordingTime.innerText = "0:0";
        this.selectEl(this.elements.chatContent.inputSend).show();
        this.selectEl(this.elements.chatContent.voiceRecorder.main).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.voiceRecordingBtn).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.voiceActive).show();
        this.selectEl(this.elements.chatContent.voiceRecorder.main.querySelector('[data-btn="pause"]')).close();
        
        this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();


    }
    
    
    start()
    {

        const startMessage = `سلام😊 من هم‌یار هوشمند ${yarabot.config.name} هستم.
            اینجام تا به سوالات شما در هر ساعتی از شبانه‌روز پاسخ بدم. چطور می‌تونم کمکتون کنم؟ `;
        this.elements.startMessage.innerText = startMessage;
    
    }
    
    async playVoice(e)
    {
        const main = e.currentTarget.closest('#voiceRecorder');  
        const audio = main.querySelector('audio'); 
        let wavesurfer = this.addWavesurferVoice(main);
        const recordingTime = main.querySelector('#recordingTime')

        if(audio.paused && this.isRecording == false && this.isplay == false)
        {
            this.selectEl(main.querySelector('[data-btn="pause"]')).show();
            this.selectEl(main.querySelector('[data-btn="play"]')).close();
            this.selectEl(recordingTime).startTimer();
            this.isplay = true;
            this.sendBtnActiveHandler();
            const self = this;
            await wavesurfer.play();
            
            
            this.selectEl(this.elements.chatContent.voiceRecorder.muted).show();
            this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();

            this.elements.chatContent.voiceRecorder.muted.addEventListener('click', () =>
            {    
                 wavesurfer.setVolume(0);   
                 this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();
                 this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).show();
            });
            
            this.elements.chatContent.voiceRecorder.unMuted.addEventListener('click', () =>
            {    
                 wavesurfer.setVolume(1);   
                 this.selectEl(this.elements.chatContent.voiceRecorder.muted).show();
                 this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();
            });
            
            
            wavesurfer.on('finish', () => {
                this.stopTimer()
                this.isplay = false;
                this.sendBtnActiveHandler();
                this.selectEl(main.querySelector('[data-btn="pause"]')).close();
                this.selectEl(main.querySelector('[data-btn="play"]')).show();
                
                this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();
                this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();
            });
        }
    }

    async pauseVoice(e)
    {
        const main = e.currentTarget.closest('#voiceRecorder');     
        const audio = main.querySelector('audio'); 
        let wavesurfer = this.addWavesurferVoice(main);
        
        await wavesurfer.pause();
    

        this.stopTimer();
        this.isplay = false;
        this.sendBtnActiveHandler();
        this.selectEl(main.querySelector('[data-btn="pause"]')).close();
        this.selectEl(main.querySelector('[data-btn="play"]')).show();
        
        this.selectEl(this.elements.chatContent.voiceRecorder.muted).close();
        this.selectEl(this.elements.chatContent.voiceRecorder.unMuted).close();
        
    }


    addWavesurferVoice(main)
    {
        main.querySelector('#waveform').innerHTML = '';
        const audio = main.querySelector('audio');
        let wavesurfer = WaveSurfer.create({
            container: main.querySelector('#waveform'), 
            waveColor: '#737376', // رنگ موج
            progressColor: '#195245', // رنگ پیشرفت
            barWidth: 2, // عرض هر بخش از موج
            height: 25, // ارتفاع موج
            responsive: true, // واکنش‌گرا
            normalize: true // نرمال‌سازی صوت
        });
    
        wavesurfer.load(audio.src);

        return wavesurfer;
    }



    userTextMessage()
    {
        const div = document.createElement('div');
        div.classList.add('yarabot_Message');
        div.classList.add('yarabot_UserMessage');
        div.innerHTML =  `
                <div class="yarabot_UserMessageColor mb-0">
                    <p class="mb-0">
                        ${this.elements.chatContent.inputSend.value}
                    </p>
                    
                </div>
                <p data-elapsedTime="${new Date()}" id="elapsed_time" class="yara_SubMessage mt-1">همین الان</p>
            `;

        this.elements.chatContent.main.append(div);
        this.autoScroll()

    }

    userVoiceMessage()
    {
        const audio = this.elements.chatContent.voiceRecorder.audio;
        
        if(audio.src !== '')
        {
            const newVoiceId = this.elements.mainChatScreen.querySelectorAll('.user_voice').length + 1;
            
            const recordTime = this.elements.chatContent.voiceRecorder.recordingTime.getAttribute('duration');
            
            const div = document.createElement('div');
            div.classList.add('yarabot_Message');
            div.classList.add('yarabot_UserMessage');
            div.style.width = '300px';
            div.innerHTML =  `
                <div id="voiceRecorder" class="yarabot_VoiceRecorder user_voice yarabot_UserMessageColor">
                    <div style="width:10%;display:flex;align-items: center;justify-content: center;">
                        <audio src="${audio.src}" id="audio_voice" ></audio>
                        <span class="time" id="recordingTime">${recordTime}</span>
                    </div>
                    <!-- <img src="<?= YARABOT_ASSETS . '/image/Frame 31291.svg' ?>" class="ms-4 me-4"> -->
                    <div style="width: 80%;" class="px-1">
                      <div id="waveform" style="width:100%"></div>
                    </div>
                    <div style="width:10%;height: 30px;margin-right:10px">
                        <div id="progress"></div>
                        <i class="bi bi-pause-circle-fill yarabot_PlayBtn display_none" data-btn="pause" id="pauseButton_${newVoiceId}"></i>
                        <i class="bi bi-play-circle-fill yarabot_PlayBtn" data-btn="play" id="playButton_${newVoiceId}"></i>
                    </div>
                </div>
            `;
            this.elements.chatContent.main.append(div);
            this.addWavesurferVoice(div);
            this.addNeedEvent(
            {
                target : this.elements.mainChatScreen.querySelector(`#playButton_${newVoiceId}`),
                getType : 'single',
                type : 'click',
                methods : ['playVoice'],
                listener : null
            });
            this.addNeedEvent(
            {
                target : this.elements.mainChatScreen.querySelector(`#pauseButton_${newVoiceId}`),
                getType : 'single',
                type : 'click',
                methods : ['pauseVoice'],
                listener : null
            });
        } 
        this.autoScroll()
    }

    botMessage(message = this.response.data) 
    {
        if(this.lastMessage == null)
        {
            const answeringMessage = this.elements.mainChatScreen.querySelector('[data-message="answering"]');
            this.removeChild(answeringMessage.parentElement,answeringMessage);

            this.lastMessage = document.createElement('div');
            this.lastMessage.classList.add('yarabot_Message');
            this.lastMessage.classList.add('yarabot_BotMessage');
            
            this.lastMessage.innerHTML = `
                <div class="d-flex justify-content-end">
                    <div class="yarabot_BotMessageColor mb-0">
                        <p id="text_message" class="mb-0 yarabot_ResBotMessageColor"></p>
                    </div>
                    <img src="${yarabot.config.logo_url}" class="align-self-end me-2">
                </div>
                <p data-elapsedTime="${new Date()}" id="elapsed_time"  class="yara_SubMessage d-flex justify-content-end ms-5 mt-1">یارابات | همین الان</p>
            `;
            
            this.elements.chatContent.main.append(this.lastMessage);

        }

        
        const textElement = this.lastMessage.querySelector('#text_message');

        textElement.innerHTML += message;
        const markDownRegex = /\*\*(.*?)\*\*/g;
        if (markDownRegex.test(textElement.innerHTML)) 
        {
            
            textElement.innerHTML = textElement.innerHTML.replace(markDownRegex,  '<strong>$1</strong>');
            textElement.innerHTML = textElement.innerHTML.replace(/\n/g, '<br>');

        }
            
        this.autoScroll();
    }


    config()
    {
        yarabot.config = JSON.parse(yarabot.config);
        const newStyle = document.createElement('style');

        newStyle.innerHTML = `
            .yarabot_UserMessageColor
            {
                color : ${yarabot.config.text_color} !important
                background : ${yarabot.config.user_chat_color} !important
            }

            .yarabot_BotMessageColor
            {
                background : ${yarabot.config.header_color} !important
            }

            .yarabot_ResBotMessageColor
            {
                color : ${yarabot.config.agent_text_response_color} !important
            }
            
            .yarabot_header
            {
                background : ${yarabot.config.header_color} !important
            }
            
            .mainShowChatBtn
            {
                background : ${yarabot.config.header_color} !important
            }
        `;

        document.body.append(newStyle);

        this.elements.header.main.querySelector('#header_title').innerText = yarabot.config.name;
        // this.elements.header.main.querySelector('#header_description').innerText = yarabot.config.description;
        this.elements.header.main.querySelector('#header_description').innerText = 'سوالات رو از من بپرس!';
        document.getElementById("header_logo").src = yarabot.config.logo_url;
        document.getElementById("mainShowChatBtn").src = yarabot.config.logo_url;
        document.getElementsByClassName('mainShowChatBtn').item(0).innerHTML = `<img src="${yarabot.config.logo_url}" width="30px">`;


        // this.elements.header.main.style.background = yarabot.config.background_color;
        //this.elements.header.logo.src = yarabot.config.logo_url

    }

    async send(e)
    {   
        if (e.key == 'Enter' && e.shiftKey ) 
        {
            return false;
        }
        
        this.scroll = true;
        this.autoScroll()
        const message = this.elements.chatContent.inputSend.value; 
    


        if(message.length > 0 || this.audioChunks.length > 0)
        {
            const method  = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            eval("this.user" + method + 'Message()');

            let data = 
            {
                type : this.mode,
                text : message,
                session_id : this.session_id
            };
            
            if(data.session_id == null)
            {
                delete data.session_id;
            }

            if(this.mode == 'voice')
            {
                let audio = this.elements.chatContent.main.querySelectorAll('#voiceRecorder');
                audio = Array.from(audio);
                audio = audio.pop();
                audio = audio.querySelector('audio')
                if(!(audio instanceof Element) || audio.src == '')
                {

                    return false;
                }
                delete data.text;
                data.file = audio.src;

                await fetch(audio.src)  
                .then(response => response.blob())  
                .then(blob => {  
                    data = new FormData();  
                    data.append('type', 'voice');  
                    data.append('file', blob, 'yarabot.wav'); 

                })  
                .catch(err => console.error("Error fetching blob:", err));  


                this.deleteVoice();

            }

            this.elements.chatContent.inputSend.value = '';
            this.elements.chatContent.inputSend.rows = '1'
            this.elements.chatContent.inputSend.style.height = "auto";



            this.answering();            
            await this.sendRequestChat(data);
            this.answer();
        }
    }
    
    
    

    answering()
    {
        const div = document.createElement('div');
        div.setAttribute('data-message','answering');
        div.classList.add('yarabot_Message');
        div.classList.add('yarabot_BotMessage');
        div.innerHTML =  `
                <div class="d-flex align-items-center">
                    <div class="mb-0">
                        <p class="yarabot_BotMessageWating yara_SubMessage mb-0">
                            در حال پاسخ ...
                        </p>
                    </div>
                    <img src="${yarabot.config.logo_url}" class="me-3">
                </div>
            `;

        this.elements.chatContent.main.append(div);  
        this.sendBtnActiveHandler();

        const el = Object.assign({}, this.elements.chatContent);  
        delete el.main;
        delete el.voiceRecorder;
        this.selectEl(el).disableEl(false)  
        this.selectEl(this.elements.chatContent.voiceRecorder).disableEl(false)  
        
        this.autoScroll()
    }
    
    botErrorMessage()
    {
        const div = document.createElement('div');
        div.setAttribute('data-message','tryAgain');
        div.classList.add('yarabot_Message');
        div.classList.add('yarabot_BotMessage');
        div.innerHTML =  `
                <div class="d-flex">
                    <div class="card p-0">
                        <div class="title text-center  yarabot_TitleError" style="background-color: #E57373;">
                            <i class="bi bi-emoji-frown yarabot_icon_error" style="color: white;"></i>
                            <p style="color: white;">ارتباط با یارابات قطع شد</p>
                        </div>
                        <div class="body mt-4 text-center pt-0 px-4">
                            <p style="color:#a3a3a3;font-size: 15px;">لطفا برای ارتباط مجدد دوباره تلاش کنید</p>
                            <button id="tryAgain" class="btn btn-danger yarabot_button_error mb-3 rounded-pill">تلاش دوباره</button>
                        </div>
                      </div>
                    <img src="${yarabot.config.logo_url}" class="me-3">                </div>
                <p data-elapsedTime="${new Date()}" id="elapsed_time"  class="yara_SubMessage d-flex justify-content-end ms-5 mt-1">یارابات | همین الان</p>
            `;
        this.elements.chatContent.main.append(div);
        this.addNeedEvent({
            target : this.elements.chatContent.main.querySelector("#tryAgain"),
            getType : 'single',
            type : 'click',
            methods : ['tryAgain'],
            listener : null 
        });
        
        this.autoScroll()

    }
    
    async tryAgain()
    {
        const tryAgainMessage = this.elements.mainChatScreen.querySelector('[data-message="tryAgain"]');
        this.removeChild(this.elements.chatContent.main,tryAgainMessage)
        this.answering();            
        await this.sendRequestChat(this.lastRequestData);
        this.answer();
    }


    answer()
    {
        this.autoScroll()
        this.session_id = this.response.session_id != null ? this.response.session_id : this.session_id;
        this.mode ='text';
        this.lastMessage = null;
        
        if(this.response.status == 200 || this.response.status == true)
        {
            const el = Object.assign({}, this.elements.chatContent);  
            delete el.main;
            delete el.voiceRecorder;
            this.selectEl(el).disableEl(true)  
            this.selectEl(this.elements.chatContent.voiceRecorder).disableEl(true) ;
            this.selectEl(this.elements.chatContent.sendBtn).disableEl(false);

            return true;
        }
    
        this.botErrorMessage();
        

    }

    elapsedTimeMessage()
    {
        const elapsedTime = this.elements.chatContent.main.querySelectorAll('#elapsed_time');        
        elapsedTime.forEach(element =>    
        {
            let elTime = element.getAttribute('data-elapsedtime'); 
            if(elTime != null)
            {
                elTime = new Date(elTime).getTime();
                const currentTime = new Date();
                const diffInMilliseconds = currentTime.getTime() - elTime; 
                let diffInMinutes = Math.floor(diffInMilliseconds / 60000)   
                
                element.innerText = diffInMinutes == 0 ? 'همین الان' : ` ${diffInMinutes} دقیقه قبل`                
            }            
        });
    }
    
    autoScroll()
    {

    
        this.elements.chatContent.main.addEventListener('wheel', ()=>{
            this.scroll = false;  
        });  
    
        this.elements.chatContent.main.addEventListener('touchmove', ()=>{
            this.scroll = false;  
        }); 
        
        if(this.scroll)
        {
            this.elements.chatContent.main.scrollTop = this.elements.chatContent.main.scrollHeight;
        }
    }

    typeToTextarea(e = null)
    {
        if(e!=null)
        {
    
            if ( e.key == 'Enter' && !e.shiftKey ) 
            {
                event.preventDefault();
            }
            
           
            if(e.inputType == 'insertText' || e.inputType == 'deleteContentBackward' )
            {
                this.elements.chatContent.inputSend.style.height = "auto";
                this.elements.chatContent.inputSend.rows = '1';
                if(this.elements.chatContent.inputSend.value.length > 0)
                {
                    this.elements.chatContent.inputSend.style.height = "auto";
                    this.elements.chatContent.inputSend.style.height = this.elements.chatContent.inputSend.scrollHeight + "px";
        
                    let lines = this.elements.chatContent.inputSend.value.split("\n").length;
                    this.elements.chatContent.inputSend.rows = Math.max(1, lines)
                }
            }
            
             if(e.key == 'Enter' && e.shiftKey)
            {
                this.elements.chatContent.inputSend.style.height = "auto";
                let lastRows = parseInt(this.elements.chatContent.inputSend.rows);
                this.elements.chatContent.inputSend.rows= (lastRows+1).toString() ;
    
            }
            
            if(this.elements.chatContent.inputSend.scrollHeight >= 150)
            {
               this.elements.chatContent.inputSend.style.overflowY = "scroll"; 
            }else
            {
                this.elements.chatContent.inputSend.style.overflowY = "hidden";
            }
        }
    }

    sendBtnActiveHandler(e = null)
    {
        
        let status = this.elements.chatContent.inputSend.value.length > 0 ? true : false;   

        if(!status)
        {
            status = this.audioChunks.length > 0 ? true : false;       
        }
        
        
        if(this.isplay)
        {
            status = false;
        }
        
        
        this.selectEl(this.elements.chatContent.sendBtn).disableEl(status);
    }
}

const chat = new yaraBot_chatController(); 

