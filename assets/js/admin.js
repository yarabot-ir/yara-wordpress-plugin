import { yaraBot_baseController } from "./baseController.js";

class yaraBot_adminController extends yaraBot_baseController
{
    constructor()
    {
        super();
        this.mainForm = document.getElementById('yarabot_main_form');
        this.mainSuccess = document.getElementById('yarabot_main_success');
        this.setBtn = document.getElementById('yarabot_set_btn');
        this.agent_id = document.getElementById('yarabot_agent_id');
        this.token = document.getElementById('yarabot_token');
        this.editButton = document.getElementById('yarabot_edit');
        this.events = 
        [
            {
                target   : this.setBtn,
                getType  : 'single',
                type     : 'click',
                methods  : ['set'],
                listener : null
            },
            {
                target   : this.editButton,
                getType  : 'single',
                type     : 'click',
                methods  : ['edit'],
                listener : null
            },
        ];

        this.addNeedEvents();
        
        if(yarabot.display == 'form')
        {
            this.selectEl(this.mainSuccess).close();
            this.selectEl(this.mainForm).show();

            return true;
        }
        
        this.selectEl(this.mainForm).close();
        this.selectEl(this.mainSuccess).show();

    }

    async set()
    {
        this.emptyErrorMessage({agent_id : this.agent_id , token : this.token , error: this.token});
        await this.sendRequest({agent_id : this.agent_id.value , token : this.token.value },'yarabot_set_configuration');
        if(!this.response.status)
        {
            this.setErrorMessage({agent_id : this.agent_id , token : this.token, error: this.token});

            return false;
        }

        this.success();
    }
    
    success()
    {
        this.selectEl(this.mainSuccess).show();
        this.selectEl(this.mainForm).close();
    }
    
    
    edit()
    {
        this.selectEl(this.mainSuccess).close();
        this.selectEl(this.mainForm).show();
        
    }


}

new yaraBot_adminController();