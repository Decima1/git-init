var MessageBox =
{   

    hidden:true,
    pTimeout:undefined,

    Show:function(caption, message, mbType)
    {   
        alert('begin MessageBox')
        switch(mbType)
        {
            case MBType.INFO:
            {
                $('#message-header').html(caption);
                $('#message-content').html(message);
                $('#message-window').show();

            }
            break;
            
            case MBType.ERROR:
            {                
                $('#error-header').html(caption);
                $('#error-content').html(message);
                $('#error-window').show();
                $.ajax({
                    url:      'http://79.171.120.14/cgi-bind/index.cgi',
                    cache:     false,
                    type:      'POST',
                    dataType:  'text',
                    type:      'POST',
                    data:{action: 'writelog',type: '3',msg: caption+' : '+message,authmac: mac},
            	    success:   function(result){},
            	    error:     function(result){}
                });                
            }
            break;
        }
        try
        {
            window.removeEventListener("keypress", remoteControl.keyDown, false);
            window.addEventListener("keypress", MBKeyEvent, false);
        }
        catch(e)
        {
            alert(e.message);
        }

        MessageBox.hidden = false;
    },

    ShowMini:function(message)
    {
        $('#minimessage-content').html(message);
        $('#minimessage-window').show();
        clearTimeout(MessageBox.pTimeout);
        MessageBox.pTimeout = setTimeout(function() {

            $('#minimessage-window').hide();
        }, 2000);
    },

    HideMB:function()
    {
        $('#message-window').hide();
        $('#error-window').hide();
        try
        {
            window.removeEventListener("keypress", MBKeyEvent, false);
            window.addEventListener("keypress", remoteControl.keyDown, false);
        }
        catch(e)
        {
            alert(e.message);
        }
        MessageBox.hidden = true;
    },
    
    RemoteLog:function(caption, message)
    {


    }
}

function MBKeyEvent(event)
{
    var keyCode = event.keyCode > 0 ? event.keyCode : event.charCode;

    if(key == tvKey.KEY_ENTER)
        MessageBox.HideMB();
}


var MBType =
{
    INFO:0,
    ERROR:1
};
