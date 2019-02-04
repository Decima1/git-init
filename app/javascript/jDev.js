keyCodes = {
    HOME:       tvKey.KEY_HOME,
    PREVCHE:    tvKey.KEY_PRECH,
    ENTER:      tvKey.KEY_ENTER,
    PAUSE:      tvKey.KEY_PAUSE,
    PAGE_UP:    tvKey.KEY_CH_UP,
    PAGE_DOWN:  tvKey.KEY_CH_DOWN,
    LEFT:       tvKey.KEY_LEFT,
    UP:         tvKey.KEY_UP,
    RIGHT:      tvKey.KEY_RIGHT,
    DOWN:       tvKey.KEY_DOWN,
    RED:        tvKey.KEY_RED,
    GREEN:      tvKey.KEY_GREEN,
    YELLOW:     tvKey.KEY_YELLOW,
    BLUE:       tvKey.KEY_BLUE,
    REWIND:     tvKey.KEY_RW,
    REWIND_L:   tvKey.KEY_REWIND_,
    STOP:       tvKey.KEY_STOP,
    PLAY:       tvKey.KEY_PLAY,
    FAST_FWD:   tvKey.KEY_FF,
    FAST_FWD_L: tvKey.KEY_FF_,
    INFO:       tvKey.KEY_INFO,
    BACK:       tvKey.KEY_RETURN,
    CHLIST:     tvKey.KEY_CHLIST,
    VOLUP:      -1,//tvKey.KEY_VOL_UP, //Отключаем кнопки управления громкостью из приложения
    VOLDOWN:    -1,//tvKey.KEY_VOL_DOWN,
    MUTE:       -1,//tvKey.KEY_MUTE,
    PSIZE:      tvKey.KEY_ASPECT,
    EXIT:       tvKey.KEY_EXIT,
    INTERNET:   tvKey.KEY_INFOLINK,
    SMARTHUB:   tvKey.KEY_CONTENT
};




//var GMT = 3;
var channelMenuOn = false;
var isPlaying = false;

function STB_Remote(STB)
{
    var stb = STB;
    var NUMPAD = new Array();
    NUMPAD[17] = 0;
    NUMPAD[101] = 1;
    NUMPAD[98] = 2;
    NUMPAD[6] = 3;
    NUMPAD[8] = 4;
    NUMPAD[9] = 5;
    NUMPAD[10] = 6;
    NUMPAD[12] = 7;
    NUMPAD[13] = 8;
    NUMPAD[14] = 9;
    
    this.setSTB = function( Stb )
    {
        stb = Stb;
    }

    Main.keyDown = function()
    {   
        try
        {   

            var keyCode = event.keyCode > 0 ? event.keyCode : event.charCode;
            var channelListOn = document.getElementById('layer-channelmenu').style.display;
            var userMenuOn = document.getElementById('layer-usermenu').style.display;
            var favListOn = stb.isFavoriteListOn();
	        var pindialogOn = document.getElementById('pin-window').style.display
            if(pindialogOn == 'block'){
            HandlePinDialogKeyPressed(keyCode);
            }else if(favListOn)
                HandleFavoriteChannlesKeyPressed(keyCode);
            else if(channelListOn == 'block')
                HandleChannlesMenuKeyPressed(keyCode);
            else if(userMenuOn == 'block')
                HandleUserMenuKeyPressed(keyCode);
            else if(stb.isChannelAnnounceOn())
                HandleChannelAnnounceKeyPressed(keyCode);
            else
                HandleChannelViewKeyPressed(keyCode);
        }
        catch(e)
        {
            alert(e.message);
        }
    }

    function HandleChannelViewKeyPressed( keyCode )
    {
        if(NUMPAD[keyCode] != undefined ) // numpad
        {
            stb.AddNumpadDigit( NUMPAD[keyCode] );
            return;
        }

        switch(keyCode)
        {
            case tvKey.KEY_VOL_UP:
                stb.IncreaseVolume();
                break;

            case tvKey.KEY_VOL_DOWN:
                stb.DecreaseVolume();
                break;

            case tvKey.KEY_CH_UP:
                stb.NextChannel();
                break;

            case tvKey.KEY_CH_DOWN:
                stb.PrevChannel();
                break;

            case tvKey.KEY_PRECH:
                stb.LastChannel();
                break;


            case tvKey.KEY_YELLOW:
                stb.ToggleChannelsMenu();
                break;

            case tvKey.KEY_INFO:
                stb.ToggleChannelInfo();
                break;

            case tvKey.KEY_GREEN:
                stb.ToggleChannelAnnounce();
                break;

            case tvKey.KEY_BLUE:
                stb.ToggleUserMenu();
                break;

            default:
                break;
        }
    }

    function HandleChannlesMenuKeyPressed( keyCode )
    {
        switch( keyCode )
        {
            case tvKey.KEY_MUTE:
                //stb.MuteVolume();
                break;

            case tvKey.KEY_VOL_UP:
                stb.IncreaseVolume();
                break;

            case tvKey.KEY_VOL_DOWN:
                stb.DecreaseVolume();
                break;

            case tvKey.KEY_UP:
                stb.previewNextCh();
                break;

            case tvKey.KEY_DOWN:
                stb.previewPrevCh();
                break;

            case tvKey.KEY_YELLOW:
            case tvKey.KEY_ENTER:
                stb.ToggleChannelsMenu();
                stb.PlaySelectedCH(); 
                break;

            case tvKey.KEY_GREEN:
                stb.ToggleFavoriteChannel();
                break;
                
            case tvKey.KEY_RED:
                stb.ToggleFavoriteChannelList();
                break;

            default:
                break;
        }
    }

    function HandleFavoriteChannlesKeyPressed( keyCode )
    {
        switch( keyCode )
        {
            case tvKey.KEY_UP:
                stb.favoritePrevCh();
                break;
            
            case tvKey.KEY_DOWN:
                stb.favoriteNextCh();
                break;
            
            case tvKey.KEY_BLUE:
                stb.RemoveSelectedFavoriteChannel();
                break;
                
            case tvKey.KEY_YELLOW:
                stb.favoriteMoveUp();
                break;
                
            case tvKey.KEY_GREEN:
                stb.favoriteMoveDown();
                break;
                
            case tvKey.KEY_RED:
                stb.ToggleChannelsMenu();
                break;
        case tvKey.KEY_ENTER:
        stb.ToggleChannelsMenu();
        stb.PlaySelectedCH();
                break;
        }
    }

    function HandlePinDialogKeyPressed( keyCode )
    {
        if(NUMPAD[keyCode] != undefined )
        {
            stb.inputPin( NUMPAD[keyCode] );
            return;
        }

        
        switch( keyCode )
        {
            case tvKey.CANCEL:
        	stb.HidePinDialog();
        	break;
            case tvKey.EXIT:
        	stb.HidePinDialog();
        	break;
            case tvKey.BACK:
        	stb.HidePinDialog();
        	break;
            case tvKey.KEY_HOME:
        	stb.HidePinDialog();
        	break;


            case tvKey.KEY_ENTER:
        	stb.CheckPin();
        	break;
    	    
    	    
            default:
                break;
        }
    }



    function HandleUserMenuKeyPressed( keyCode )
    {   
        switch( keyCode )
        {

            case tvKey.KEY_MUTE:
                //stb.MuteVolume();
                break;

            case tvKey.KEY_VOL_UP:
                stb.IncreaseVolume();
                break;

            case tvKey.KEY_VOL_DOWN:
                stb.DecreaseVolume();
                break;

            case tvKey.KEY_UP:
                break;

            case tvKey.KEY_DOWN:
                break;

            case tvKey.KEY_LEFT:
                stb.SelectPrevUserMenuItem();
                break;

            case tvKey.KEY_RIGHT:
                stb.SelectNextUserMenuItem();
                break;

            case tvKey.KEY_BLUE:
            case tvKey.KEY_ENTER:
                stb.ToggleUserMenu();
                break;

            default:
                break;
        }
    }

    function HandleChannelAnnounceKeyPressed( keyCode )
    {
        switch( keyCode )
        {
            case tvKey.KEY_ENTER:
            case tvKey.KEY_GREEN:
                stb.ToggleChannelAnnounce();
                break;
        }
    }
}

function OnEventHandler()
{
    var code = AVMedia.Event;
    switch( code )
    {
        case 15:
            document.getElementById("playchannel-connecting").style.display = 'none';
            document.getElementById("channelmenu-connecting").style.display = 'none';
            break;
    }
}

/*
function STB_GetIPAddress()
{
    return '178.165.81.153';
}
*/
function Network(){
    this.plugin = document.getElementById("pluginObjectNetwork");
    try {
        var nw_type = this.plugin.GetActiveType();
        if ((nw_type == 0)  ||  (nw_type == 1)) {
            this.ownMac = this.plugin.GetMAC(nw_type);                              
        }
            this.isInited = true;
    }
    catch (e) {
        // Code for Non Samsung SmartTV here
    } 


    this.getMac = function () {
        return this.ownMac;
    }

}

    

function STB_SetTransparencyMask( colorMask )
{
    console.log("Transparency set to" + colorMask);
}

function STB_SetVisibility( value )
{
    console.log("Visibility set to" + value);
}

function STB_SetVolume( value )
{
    console.log("Volume set to" + value);
}

function STB_GetVolume()
{
    return 100;
}


function STB_SetVideoLayer( channelMenuOn, width, height, x, y)
{
    if (!channelMenuOn)
    {
        this.AVPlayerObj.SetDisplayArea(previeww, previewh, previewx, previewy);
    }
    else
    {
        this.AVPlayerObj.SetDisplayArea(videolayerfullwidth, videolayerfullheight, videolayerfullbasex, videolayerfullbasey); 
    }
}


function STB_Play (url)
{   

    if ((typeof(url) == 'undefined') || (url == ''))
    {
            url = '239.0.0.1:1234'; // если url не определён, по умолчанию запускаем канал 1+1
    }
    url = url.replace('', 'udp/');
    url = 'http://178.165.99.234:8888/' + url;
    try {
        if (isPlaying) {
            this.AVPlayerObj.Stop();
            isPlaying = false;
        }
        var Result = this.AVPlayerObj.Play(url);
        
        if ( Result != 0 )isPlaying = true; 
           
    }
    catch(e){
        alert(e.name + ":" + e.message);
    }
}

function STB_Stop()
{
    this.AVPlayerObj.Stop();
}

function STB_Initialize()
{   
    this.AVPlayerObj = document.getElementById("pluginObjectPlayer");
    STB_SetTransparencyMask(0xFF00FF);
    STB_SetVisibility(80);
    

    STB_SetVideoLayer(true, videolayerfullwidth, videolayerfullheight, videolayerfullbasex, videolayerfullbasey);

        var helpBlock = '<table class="infohelp" style="color:#FFFFFF;" cellpadding="5px">\n\
                    <tr>\n\
                        <td align="right"><img align="middle" src="images/red.png" width="60" height="56" alt="btngrn" />\n\
            <img align="middle" src="images/green.png" width="60" height="56" alt="btngrn" />\n\
                        <img align="middle" src="images/yellow.png" width="60" height="56" alt="btnyel" />\n\
                        <img align="middle" src="images/blue.png" width="60" height="56" alt="btnyel" /></td> \n\
                        <td>-</td> <td align="left"> Функциональные клавиши</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">CHANNEL+/-</td> <td>-</td> <td align="left"> Переключение каналов</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">PageUp/PageDown</td> <td>-</td> <td align="left"> Переключение избранных каналов</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">BACK</td> <td>-</td> <td align="left"> Предыдущий канал</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">INFO</td> <td>-</td> <td align="left"> Информация просматриваемого канала</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">SETUP</td> <td>-</td> <td align="left"> Пользовательское меню приставки ( Только при полной перезагрузке)</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">EXIT</td> <td>-</td> <td align="left"> Выход из меню приставки</td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td align="right">FRAME</td> <td>-</td> <td align="left"> Переключение режимов экрана 16:9 / 4:3</td>\n\
                    </tr>\n\
                    </table>';
    
    $('#usermenu-item-help').html(helpBlock);
}

