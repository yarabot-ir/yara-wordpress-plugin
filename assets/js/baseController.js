
class yaraBot_baseController
{
    selectedElement = null;
    loadingElement = null;
    events = [];
    response = {
        status : true,
        data : [],
        message : ''
    };
    data = null;
    timer = null;
    lastRequestData = null;
    filters = {}

    mm = null

    constructor()
    {
        this.security = document.getElementById('yarabot_nonce_field').value;
        this.loadingElement = document.getElementById('yarabot_loading');
    }
    

    removeChild(parent,targetChild = null)
    {
        if(parent instanceof Element)
        {
            if(targetChild != null)
            {
                targetChild = targetChild instanceof NodeList ? targetChild : [targetChild];
                targetChild.forEach((child)=>
                {
                    parent.removeChild(child);
                });
                
                return true;
            }
            
            while(parent.firstChild)
            {
                parent.removeChild(parent.firstChild)
            }
        }

        return this;
    }
    


    show(element = null)
    {
        if(element != null )
        {
            element.classList.remove('display_none');
            element.classList.remove('d-none');

            return this;
        }

        if (this.selectedElement != null)
        {
            this.selectedElement.classList.remove('display_none');
            this.selectedElement.classList.remove('d-none');

        }
        this.selectedElement = null;
        return this;
    }

    toggle(element)
    {
        if(element != null )
        {
            element.classList.toggle('display_none');
            element.classList.toggle('d-none');
    
            return this;
        }
    
        if (this.selectedElement != null)
        {
            this.selectedElement.classList.toggle('display_none');
            this.selectedElement.classList.toggle('d-none');
    
        }

        this.selectedElement = null;

        return this;
    }
    close(element = null)
    {
        if(element != null )
        {
            element.classList.add('display_none');
            element.classList.add('d-none');

            return this;
        }

        if (this.selectedElement != null)
        {
            this.selectedElement.classList.add('display_none');
            this.selectedElement.classList.add('d-none');

        }
        this.selectedElement = null;
        
        return this;
    }

    loading()
    {
        this.selectedElement = this.loadingElement;
        
        return this;
    }
    
    getSelectionOption(select)
    {
        return select.options[select.selectedIndex];
    }

    addNeedEvents(targetEvents = [])
    {
        this.events.forEach((item,index)=>
        {
            if( targetEvents.includes(index)  || targetEvents.length == 0 )
            {
                const target = item.getType == 'single' ? [item.target] : item.target ;


                if(item.listener == null)
                {
                    const listener = (e)=>
                    {               
                        if('keydown' in item)
                        {
                            if(e.key != null)
                            {
                                if(e.key === item.keydown)
                                {
                                    item.methods.forEach( method => 
                                    {
                                        eval("this." + method + '(e)');
                                    });

                                    return true;
                                }

                                return false;
                            }
                        }    
                        
                        item.methods.forEach( method => 
                        {
                            eval("this." + method + '(e)');
                        });

                    }

                    target.forEach((element)=>
                    {
                        if(element != null)
                        {
                            element.addEventListener(item.type,listener)
                            if('keydown' in item )
                            {                                
                                document.addEventListener('keydown',listener);
                            }
                        }
                    });
                    item.listener = listener
                }
            
            }

        });
    }
    addNeedEvent(targetEvent = [])
    {

        const target = targetEvent.getType == 'single' ? [targetEvent.target] : targetEvent.target ;

        let listener = (e)=>
        {
            targetEvent.methods.forEach( method => 
            {
                eval("this." + method + '(e)');
            });
        }
        listener = targetEvent.listener == null ? listener : targetEvent.listener;
        target.forEach((element)=>
        {
            if(element != null)
            {
                element.addEventListener(targetEvent.type,listener)
            }
        });
        targetEvent.listener = listener

        

    }


    
    removeNeedEvents(targetEvents = [])
    {

        this.events.forEach((item,index)=>
        {

            if( targetEvents.includes(index) || targetEvents.length == 0 )
            {
                const target = item.getType == 'single' ? [item.target] : item.target ;

                if(item.listener != null)
                {
                    target.forEach((element)=>
                    {
                        if(element != null)
                        {
                            element.removeEventListener(item.type,item.listener);
                        }
                    });
                    item.listener = null;
                }
            }
        
        });
        
    }
    
    
    reAddNeedEvents(event)
    {

        let target = [];
        target = event.target;
        if(event.getType == 'single')
        {
            target = [event.target];
        }
        
        target.forEach((element) => 
        {

            if(element != null)
            {
                const listener = (e)=>
                {
                    event.methods.forEach(method => 
                    {
                        eval("this." + method + '(e)');
                    });
                }
                element.addEventListener(event.type,listener)
                event.listener = listener;
            }
        });
        
    }
    


    setErrorMessage(elements,conversion = "null")
    {
        this.emptyErrorMessage(elements);
        Object.keys(this.response.message).forEach(key => 
        {
         
            const error = this.response.message[key];
            key = conversion[key] != null ? conversion[key] : key
            let element = elements[key] instanceof NodeList ? elements[key][0] : elements[key] ;
            if(element == null)
            {                
                return false;
            }

            const parent = element.parentElement;
            if(parent == null )
            {
                return false
            }
            const p = document.createElement('p');
            p.classList.add('yarabot_error_message')
            p.innerText = error;
            parent.insertBefore(p,element.nextSibling)
        });
        
    }

  


    selectEl(el)
    {
        if(el instanceof Event)
        {
            el = el.currentTarget;
        }
        this.selectedElement = el;

        return this;
    }

    disableEl(status = true)
    {
        if(this.selectedElement instanceof NodeList || this.selectedElement instanceof Object && !(this.selectedElement instanceof Element) )
        {

            this.selectedElement = this.selectedElement instanceof Object ? Object.values(this.selectedElement) : this.selectedElement;
            this.selectedElement.forEach((element) => 
            {
                if(element instanceof Element)
                {

                    if(status)
                    {
                        element.classList.remove('yarabot_disabled');

                        return true;
                    }

                    element.classList.add('yarabot_disabled');

                }
            });
            this.selectedElement = null;
        
            return this;
        }

        this.selectedElement.classList.add('yarabot_disabled')

        if(status)
        {
            this.selectedElement.classList.remove('yarabot_disabled');            
        }
        this.selectedElement = null;

        return this;
    }


    emptyErrorMessage(elements)
    {
        Object.keys(elements).forEach(function(key) 
        {
            const element = elements[key] instanceof NodeList ? elements[key][0] : elements[key] ;
            const parent = element.parentElement;
            if(parent != null  )
            {
                const p = parent.querySelector('.yarabot_error_message');

                if(p != null )
                {
                    parent.removeChild(p);
                }
            }
            
        });

        return this;
    }

    async sendRequestChat(data, method = "POST")   
    {  
        let $ = jQuery.noConflict();  
        this.loading().show();  
        let self = this;  
        let result = [];  
        let session_id = null;  

        let lastPart = [];        
        this.lastRequestData = data;
        
        // قرار دادن $.ajax درون یک Promise برای استفاده از await  
        await new Promise((resolve, reject) => {              
            $.ajax({  
                url: `https://backend.yarabot.ir/agent/bot/${yarabot.agent_id}/chat`,  
                type: method,  
                headers: {  
                    'Authorization': yarabot.token  
                },  
                data: data, 

                
                contentType: data instanceof FormData ? false : 'application/x-www-form-urlencoded', 
                processData: data instanceof FormData ? false : true,  

                xhrFields: {  
                    onprogress: function (event) {  
                        let chunk = event.target.responseText;  
                        let parts = chunk.split('\n');  
                        
                        session_id = null;


                        if (parts.length > 0) 
                        { 
                            
                            const uniqueIndexes = [];  
                            parts.forEach((value, index) => 
                            {  
                                if (value !== undefined && value !== null && lastPart[index] !== value ) 
                                {  
                                    uniqueIndexes.push(index);  
                                }  
                            });  
                            lastPart = parts;
                            uniqueIndexes.forEach((index)=>
                            {
                                let response = parts[index];
                                if(response!= '')
                                {
                                    response = JSON.parse(response);

                                    if(response.data != null)
                                    {
                                        result.push(response.data)
                                        self.botMessage(response.data)                                
    
                                    }
    
                                    if (response.session_id != null) 
                                    {  
                                        session_id = response.session_id;
                                    }  
                                }
                            });
            
                        
                        }
                  
                    }  
                },  
                success: function(response) 
                { 
                    // console.log(response);
                    self.response.data = result.join('');  
                    resolve(response); // بعد از موفقیت درخواست، Promise را حل می‌کنیم.  
                },  
                error: function(jqXHR, textStatus, errorThrown) {  
                    reject(errorThrown); // در صورت خطا، Promise را رد می‌کنیم.  
                },  
                complete: function(response) 
                {                    
                    if(response.status == 200)
                    {
                        self.response.data = result.join('');  
                        self.response.session_id = session_id
                        return true;
                    }  


                }  
            });  
        }).catch(error => {  
            //console.log(error);  
        });  
    }
    

    
    async sendRequest(data,action,method = "POST")
    {
        let $ = jQuery.noConflict();
        this.loading().show();
        this.response = await $.ajax({
            url: yarabot.ajax_url ,
            type: method, 
            headers: 
            {
                'X-WP-Nonce': this.security  
            },
            data: {
                action   : action,
                data     : data ,
                security : this.security
       
            },
            success: function(response) {
                return response;
            },
            error: function(xhr, status, error) {
                console.log('خطا: ', error);
            
            }
        });

        this.loading().close();
    }


    startTimer()
    {
        if(this.timer == null)
        {
            let timer = 1;
            if(this.selectedElement == null)
            {
                return false;
            }
            const showTimer = this.selectedElement;
            this.timer = setInterval((e)=>
            {
                let minutes = Math.floor(timer / 60); 
                let remainingSeconds = timer % 60;
                showTimer.innerText = minutes + ":" + remainingSeconds;
                timer++;

            },1000);
        }
    }

    stopTimer()
    {
        if(this.timer != null)
        {
            clearInterval(this.timer);
            this.timer = null;
        }
    }





}


export { yaraBot_baseController };

