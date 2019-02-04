$import('app/javascript/src/Gui.js');
$import('app/javascript/src/SoundControl.js');
$import('app/javascript/src/Clock.js');


function STB( inChannelList, startChannel )
{   
    STB_Initialize();
    InitServices();

    var widgetAPI = new Common.API.Widget();
    var pluginObj = new Common.API.Plugin();
    
    var soundControl = new STB_SoundControl();
    
    var gui = new GUI();


    var channelList = inChannelList;
    var selectedChannel = startChannel;
    

    
    gui.ShowChannelInfo();
    
    // Channels array
    
    var layer;

    var favoriteList = new Array();
    
    var currentChannel = startChannel;
    
    var prevChannel = startChannel;

    var channelmenuListItemSelected = 0;
    var favoritemenuListItemSelected = 0;

    var numpadChannel = '';

    var channelInfoOn = false;
    var pininput = '';
    var channelAnnounce = 'undefined';
    var channelAnnounceOn = false;

    
    var channelMenuOn = false;
    var pinentered = 0;
    var selectedFavorite = 0;
    var favoriteListOn = false;
    var favoriteOn = false;
    var pindialogOn = false;
    //
    //Timeout task vars
    //
    var timeout_HideChannelInfo;
    var timeout_Play;
    var timeout_HideVolume;
	//var timeout_ChannelStat;

    var usermenuCategory = $('.usermenu-category');
    var usermenuItems = $('.usermenu-item');
    var selectedUserMenuItem = 0;
    var userMenuOn = false;

    //
    // Remote init
    //
    
    document.addEventListener("keypress", remoteControl.keyDown, false);

    CreateFavoriteList();

    ClockTick();

    gui.SetVolume(STB_GetVolume());
    
    alert('begin11');
    this.PlaySelectedCH = function(startchannel)
    {
        alert('begin11.1');
        if(startchannel != undefined){
    	    selectedChannel=startchannel;
    	    while(channelList[selectedChannel].parent==1){
		selectedChannel++;
		if(selectedChannel > (channelList.length - 1)){break;}
	    };
	    if(selectedChannel > (channelList.length - 1)){
        	selectedChannel = 0;
        	while(channelList[selectedChannel].parent==1){
		    selectedChannel++;
		    if(selectedChannel > (channelList.length - 1)){break;}
		};
    	    }
        }
        
        
        
        if(channelList[selectedChannel].parent==1){
    	    if(pinentered==1){
    		pinentered=0;
    	    }else{
    		
    		
    		return;
    	    }
        }
        
        this.Play(selectedChannel);
    }
    
    this.Play = function(channelNum)
    {  
        if(channelList[channelNum] == undefined)
            channelNum = 0;

        var url = channelList[channelNum].address;
        var chName = channelList[channelNum].name;
        var chCategory = channelList[channelNum].category;
        
        
        gui.SetChannelNumber( favoriteOn ? channelList[channelNum].fav : channelNum, channelList[channelNum].fav != undefined);
        gui.SetChannelName(chName);
        gui.SetChannelCategory(chCategory);

        ShowProgram(channelNum);
        gui.ShowTips();

        clearTimeout(timeout_HideChannelInfo);
        timeout_HideChannelInfo = setTimeout(gui.HideChannelInfo, 4000);
        
        var channelListOn = document.getElementById('layer-channelmenu').style.display;
        if(channelListOn == 'none')
        {
            if(channelNum == currentChannel)
                return;
            gui.ShowChannelInfo();
        
            //gui.ShowConnecting();
        
            gui.SetInterfaceVisibility(80);
        }
        /*else
        {
            gui.ShowPreviewConnecting();
        }*/
        STB_Play(url);
        STB_SetVideoLayer(document.getElementById('layer-channelmenu').style.display != 'block', videolayerfullwidth, videolayerfullheight, videolayerfullbasex, videolayerfullbasey);
        if(channelList[channelNum].audiopid != 0)
            STB_SetAudioPID(channelList[channelNum].audiopid);

        setCookie("lch", channelNum, false, false, false, false);
	stb.SetChannelStat(currentChannel,prevChannel);
        prevChannel = currentChannel;
        currentChannel = channelNum;
        selectedChannel = channelNum;

        numpadChannel = '';
        channelAnnounce = 'undefined';

		//clearTimeout(timeout_ChannelStat);
        //timeout_ChannelStat = setTimeout(ChannelStatTick, 600000);
    }
    this.SetChannelStat = function(channelcur,channellast){
	var idchannelcur = channelList[channelcur].id;
	var idchannellast = channelList[channellast].id;
	$.ajax({
	    url:       "http://79.171.120.14/cgi-bind/index.cgi",
	    cache:     false,
	    type:	   'POST',
	    dataType:  "text",
	    data:      { action: 'setchanneltime',idiptv: idiptv,curchannel: idchannelcur,lastchannel: idchannellast,sess: SessionVal,authmac: mac},
	    success:   function(result) {
	    },
	    error:     function(result){
	    }
	});


    
    
    
    }

    this.NextChannel = function()
    {   
        var nextChannel = selectedChannel + 1;
        if(nextChannel > (channelList.length - 1)){
            nextChannel = 0;
        }
	while(channelList[nextChannel].parent==1){
	    nextChannel++;
	    if(nextChannel > (channelList.length - 1)){break;}
	};
	if(nextChannel > (channelList.length - 1)){
            nextChannel = 0;
    	    while(channelList[nextChannel].parent==1){
		nextChannel++;
		if(nextChannel > (channelList.length - 1)){break;}
	    };
        }
        if(favoriteOn)
        {
            var nextFav = GetNextFavoriteChannel();
            nextChannel = parseInt(favoriteList[nextFav], 10);
            selectedFavorite = nextFav;
        }

        var chName = channelList[nextChannel].name;
        var chCategory = channelList[nextChannel].category;

        selectedChannel = nextChannel;

        gui.SetChannelNumber(favoriteOn ? channelList[nextChannel].fav : nextChannel, channelList[nextChannel].fav != undefined);
        gui.SetChannelName(chName);
        gui.SetChannelCategory(chCategory);
        gui.SetChannelProgram("", "");
        gui.HideTips();
        gui.ShowChannelInfo();
        //Delay channel switch for 1 sec
        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        //currentChannel = selectedChannel;
        timeout_Play = setTimeout(function()
        {
            stb.Play(nextChannel);
            //selectedChannel = nextChannel;
            currentChannel = selectedChannel;
        }, 1000);
    }

    this.PrevChannel = function()
    { 
        var nextChannel = selectedChannel - 1;

        if(nextChannel < 0){
            nextChannel = channelList.length - 1;
	}
        while(channelList[nextChannel].parent==1){
	    nextChannel--;
	    if(nextChannel < 0){break;}
	};

        
        if(nextChannel < 0){
            nextChannel = channelList.length - 1;
	    while(channelList[nextChannel].parent==1){
		nextChannel--;
		if(nextChannel > (channelList.length - 1)){break;}
	    };
	}
	
	
        if(favoriteOn)
        {
            var prevFav = GetPrevFavoriteChannel();
            nextChannel = parseInt(favoriteList[prevFav], 10);
            selectedFavorite = prevFav;
        }

        var chName = channelList[nextChannel].name;
        var chCategory = channelList[nextChannel].category;

        selectedChannel = nextChannel;

        gui.SetChannelNumber(favoriteOn ? channelList[nextChannel].fav : nextChannel, channelList[nextChannel].fav != undefined);
        gui.SetChannelName(chName);
        gui.SetChannelCategory(chCategory);
        gui.SetChannelProgram("", "");
        gui.HideTips();

        gui.ShowChannelInfo();

        //Delay channel switch for 1 sec
        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        //currentChannel = selectedChannel;
        timeout_Play = setTimeout(function()
        {
            gui.SetInterfaceVisibility(100);
            stb.Play(selectedChannel);
            //selectedChannel = nextChannel;
            currentChannel = selectedChannel;
        }, 1000);
    }

    this.previewNextCh = function()
    {
        var nextChannel = selectedChannel - 1;
        if(nextChannel < 0)
            nextChannel = 0;
        else
            STB_Stop();


        gui.SetChannelProgram("", "");

        channelmenuListItemSelected = nextChannel - pageStartIndex;

        selectedChannel = nextChannel;

        if(channelmenuListItemSelected < 0)
            CreateAndFillChannelsMenuList( selectedChannel );
        else
        {
            var list = document.getElementById("channelmenu-list").getElementsByTagName("li");
            
            var listSize = list.length;
            
            if((channelmenuListItemSelected + 1) < listSize)
                list[channelmenuListItemSelected + 1].setAttribute("class", "channelmenu-item");

            list[channelmenuListItemSelected].setAttribute("class", "channelmenu-selecteditem");
        }
        var stb = this;

        ClearAllTimeouts();
	if(channelList[selectedChannel].parent==1){return};
        //currentChannel = selectedChannel;
        timeout_Play = setTimeout(function() {
            stb.Play(selectedChannel);
        }, 1000);

    }

    this.previewPrevCh = function()
    {

        var nextChannel = selectedChannel + 1;
        if(nextChannel > channelList.length - 1)
            nextChannel = channelList.length - 1;
        else
            STB_Stop();
            

        gui.SetChannelProgram("", "");

        channelmenuListItemSelected = nextChannel - pageStartIndex;

        selectedChannel = nextChannel;
        
        if(channelmenuListItemSelected >= channelsOnCurrentPage)
            CreateAndFillChannelsMenuList( selectedChannel );
        else
        {
            var list = document.getElementById("channelmenu-list").getElementsByTagName("li");

            var listSize = list.length;
            var listPrevItem = channelmenuListItemSelected - 1;
            
            if(listPrevItem < 0)
                listPrevItem = 0;
            
            list[listPrevItem].setAttribute("class", "channelmenu-item");
            
            if(channelmenuListItemSelected < listSize)
                list[channelmenuListItemSelected].setAttribute("class", "channelmenu-selecteditem");
        }
        var stb = this;

        ClearAllTimeouts();
	if(channelList[selectedChannel].parent==1){return};
        //currentChannel = selectedChannel;
        timeout_Play = setTimeout(function() {
            stb.Play(selectedChannel);
        }, 1000);

    }
    
    this.favoriteNextCh = function()
    {
        var nextFav = favoritemenuListItemSelected + 1;
        
        var list = document.getElementById("channelmenu-list").getElementsByTagName("li");

        var listSize = list.length;

        if(nextFav < listSize)
        {
            list[favoritemenuListItemSelected].setAttribute("class", "channelmenu-item");
            list[nextFav].setAttribute("class", "channelmenu-selecteditem");
            favoritemenuListItemSelected = nextFav;
            selectedFavorite++;
        }
        else if( selectedFavorite+1 < favoriteList.length )
        {
            var startIndex = favPageStartIndex + menuRowsPerPage;
                
            if(startIndex > favoriteList.length - 1)
                startIndex = favoriteList.length - 1;
                
            favoritemenuListItemSelected = 0;
            selectedFavorite++;
            CreateAndFillFavoriteList(startIndex);
        }
        //Delay channel switch for 1 sec
        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        //if(channelList[parseInt(favoriteList[nextFav], 10)].parent==1){return};
        currentChannel = selectedChannel;
        timeout_Play = setTimeout(function()
        {
            gui.SetInterfaceVisibility(100);
            stb.Play(parseInt(favoriteList[nextFav], 10));
        }, 1000);
    }

    this.favoritePrevCh = function()
    {
        var prevFav = favoritemenuListItemSelected - 1;
        
        var list = document.getElementById("channelmenu-list").getElementsByTagName("li");
        
        if(prevFav >= 0)
        {
            list[favoritemenuListItemSelected].setAttribute("class", "channelmenu-item");
            list[prevFav].setAttribute("class", "channelmenu-selecteditem");
            favoritemenuListItemSelected = prevFav;
            selectedFavorite--;
        }
        else if( selectedFavorite-1 >= 0 )
        {
            var startIndex = favPageStartIndex - menuRowsPerPage;
                
            if(startIndex < 0)
                startIndex = 0;
                
            favoritemenuListItemSelected = 13;
            selectedFavorite--;
            CreateAndFillFavoriteList(startIndex);
        }
	var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        //if(channelList[parseInt(favoriteList[nextFav], 10)].parent==1){return};
        currentChannel = selectedChannel;
        timeout_Play = setTimeout(function()
        {
            gui.SetInterfaceVisibility(100);
            stb.Play(parseInt(favoriteList[prevFav], 10));
        }, 1000);
    }
    
    this.favoriteMoveUp = function()
    {
        var prevFav = favoritemenuListItemSelected - 1;
        
        var list = document.getElementById("channelmenu-list").getElementsByTagName("li");
        
        if(prevFav >= 0)
        {
            list[favoritemenuListItemSelected].setAttribute("class", "channelmenu-item");
            list[prevFav].setAttribute("class", "channelmenu-selecteditem");
            
            var selectedHTML = list[favoritemenuListItemSelected].getElementsByTagName("span")[1].innerHTML;
            var nextHTML = list[prevFav].getElementsByTagName("span")[1].innerHTML;
            
            list[favoritemenuListItemSelected].getElementsByTagName("span")[1].innerHTML = nextHTML;
            list[prevFav].getElementsByTagName("span")[1].innerHTML = selectedHTML;
            
            favoritemenuListItemSelected = prevFav;
            
            var curChNum = favoriteList[selectedFavorite];
            var prevChNum = favoriteList[selectedFavorite - 1];
            var curFavNum = channelList[favoriteList[selectedFavorite]].fav;
            var prevFavNum = channelList[favoriteList[selectedFavorite - 1]].fav;
            
            channelList[favoriteList[selectedFavorite - 1]].fav = curFavNum;
            channelList[favoriteList[selectedFavorite]].fav = prevFavNum;
            favoriteList[selectedFavorite - 1] = curChNum;
            favoriteList[selectedFavorite] = prevChNum;
            
            selectedFavorite--;
            
            isFavChanged = true;
        }
        else if( selectedFavorite-1 >= 0 )
        {            
            var curChNum = favoriteList[selectedFavorite];
            var prevChNum = favoriteList[selectedFavorite - 1];
            var curFavNum = channelList[favoriteList[selectedFavorite]].fav;
            var prevFavNum = channelList[favoriteList[selectedFavorite - 1]].fav;
            
            channelList[favoriteList[selectedFavorite - 1]].fav = curFavNum;
            channelList[favoriteList[selectedFavorite]].fav = prevFavNum;
            favoriteList[selectedFavorite - 1] = curChNum;
            favoriteList[selectedFavorite] = prevChNum;
            
            selectedFavorite--;
            
            isFavChanged = true;
            
            var startIndex = favPageStartIndex - menuRowsPerPage;
                
            if(startIndex < 0)
                startIndex = 0;
                
            favoritemenuListItemSelected = 13;
            CreateAndFillFavoriteList(startIndex);
        }
    }
    
    this.favoriteMoveDown = function()
    {
        var nextFav = favoritemenuListItemSelected + 1;
        
        var list = document.getElementById("channelmenu-list").getElementsByTagName("li");
        
        var listSize = list.length;

        if(nextFav < listSize)
        {
            list[favoritemenuListItemSelected].setAttribute("class", "channelmenu-item");
            list[nextFav].setAttribute("class", "channelmenu-selecteditem");
            
            var selectedHTML = list[favoritemenuListItemSelected].getElementsByTagName("span")[1].innerHTML;
            var nextHTML = list[nextFav].getElementsByTagName("span")[1].innerHTML;
            
            list[favoritemenuListItemSelected].getElementsByTagName("span")[1].innerHTML = nextHTML;
            list[nextFav].getElementsByTagName("span")[1].innerHTML = selectedHTML;
            
            favoritemenuListItemSelected = nextFav;
            
            var curChNum = favoriteList[selectedFavorite];
            var prevChNum = favoriteList[selectedFavorite + 1];
            var curFavNum = channelList[favoriteList[selectedFavorite]].fav;
            var prevFavNum = channelList[favoriteList[selectedFavorite + 1]].fav;
            
            channelList[favoriteList[selectedFavorite + 1]].fav = curFavNum;
            channelList[favoriteList[selectedFavorite]].fav = prevFavNum;
            favoriteList[selectedFavorite + 1] = curChNum;
            favoriteList[selectedFavorite] = prevChNum;
            
            selectedFavorite++;
            
            isFavChanged = true;
        }
        else if( selectedFavorite+1 < favoriteList.length )
        {            
            var curChNum = favoriteList[selectedFavorite];
            var prevChNum = favoriteList[selectedFavorite + 1];
            var curFavNum = channelList[favoriteList[selectedFavorite]].fav;
            var prevFavNum = channelList[favoriteList[selectedFavorite + 1]].fav;
            
            channelList[favoriteList[selectedFavorite + 1]].fav = curFavNum;
            channelList[favoriteList[selectedFavorite]].fav = prevFavNum;
            favoriteList[selectedFavorite + 1] = curChNum;
            favoriteList[selectedFavorite] = prevChNum;
            
            selectedFavorite++;
            
            isFavChanged = true;
            
            var startIndex = favPageStartIndex + menuRowsPerPage;
                
            if(startIndex > favoriteList.length - 1)
                startIndex = favoriteList.length - 1;
                
            favoritemenuListItemSelected = 0;
            CreateAndFillFavoriteList(startIndex);
        }
    }

    this.LastChannel = function()
    {
        selectedChannel = prevChannel;
	if(channelList[selectedChannel].parent==1){return;};
        var chName = channelList[prevChannel].name;
        var chCategory = channelList[prevChannel].category;

        gui.HideAll();
        gui.SetChannelNumber(favoriteOn ? channelList[prevChannel].fav : prevChannel, channelList[prevChannel].fav != undefined);
        gui.SetChannelName(chName);
        gui.SetChannelCategory(chCategory);
        gui.ShowChannelInfo();

        //Delay channel switch for 1 sec
        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        //currentChannel = selectedChannel;
        timeout_Play = setTimeout(function() {

            stb.Play(selectedChannel);
            currentChannel = selectedChannel;
        }, 1000);
    }

    function GetPrevFavoriteChannel()
    {
        var prev = selectedFavorite - 1;
        if(prev >= 0)
            return prev;
        else
            return selectedFavorite;
    }

    function GetNextFavoriteChannel()
    {
        var next = selectedFavorite + 1;
        if(next < favoriteList.length)
            return next;
        else
            return selectedFavorite;
    }

    this.ToggleViewFavoriteChannels = function()
    {
        var fav = GetPrevFavoriteChannel();

        if(favoriteList.length <= 0)
        {
            MessageBox.ShowMini("Нет избранных каналов");
            favoriteOn = false;
            return false;
        }

        favoriteOn = favoriteOn ? false : true;

        if(favoriteOn == false)
        {
            MessageBox.ShowMini("Все каналы");
        }
        else
        {
            MessageBox.ShowMini("Избранные каналы");
        }
        return true;


        selectedChannel = fav;

        gui.SetChannelNumberа(fav, channelList[selectedChannel].fav != undefined);
        gui.SetChannelName(channelList[selectedChannel].name);
        gui.SetChannelCategory("");
        gui.SetChannelProgram("", "");
        gui.HideTips();

        gui.ShowChannelInfo();

        //Delay channel switch for 1 sec
        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        currentChannel = selectedChannel;
        timeout_Play = setTimeout(function()
        {
            stb.Play(selectedChannel);
        }, 1000);
    }

    this.isFavoriteOn = function()
    {
        return favoriteOn;
    }

    this.AddNumpadDigit = function( num )
    {
        if(numpadChannel.length >= 3)
            numpadChannel = '';

        numpadChannel += num;

        gui.SetChannelNumber( numpadChannel,false,true );
        gui.ShowChannelInfo();

        var stb = this;
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        currentChannel = selectedChannel;
        timeout_Play = setTimeout(function() {
            var num = parseInt(numpadChannel, 10);
            num--;
            if(num<0){num=0;};
            
            if(favoriteOn)
            {
                if( num == NaN || num < 0)
                    num = 0;
                else if ( num > (favoriteList.length - 1) )
                    num = favoriteList.length - 1;
					
                selectedFavorite = num;
            }
            else
            {
                if( num == NaN || num < 0)
                    num = 0;
                else if ( num > (channelList.length - 1) )
                    num = channelList.length - 1;
            }
            

            var chName = "";
            
            if(favoriteOn)
                chName = channelList[favoriteList[num]].name;
            else
                chName = channelList[num].name;
	    
	    
	    if(channelList[num].parent==1){
        	    selectedChannel=num;
        	    stb.ShowPinDialog();
        	    return;
            }

	    

    	    while(channelList[num].parent==1){
		num--;
		if(num < 0){break;}
	    };

    	    if(num < 0){
        	num = channelList.length - 1;
	        while(channelList[num].parent==1){
		    num--;
		    if(num < 0){break;}
		};
	    }
	    
            gui.HideAll();
            gui.SetChannelNumber(num, favoriteOn);
            gui.SetChannelName(chName);
            gui.ShowChannelInfo();
            
            stb.Play( favoriteOn ? favoriteList[num] : num );
            
            numpadChannel = "";
        }, 2000);
    }

    this.IncreaseVolume = function()
    {
        soundControl.IncreaseVolume();
        gui.HideAll();
        gui.SetVolume(STB_GetVolume());
        gui.ShowVolume();

        clearTimeout(timeout_HideVolume);
        timeout_HideVolume = setTimeout(gui.HideVolume, 2000);
    }

    this.DecreaseVolume = function()
    {
        soundControl.DecreaseVolume();
        gui.HideAll();
        gui.SetVolume(STB_GetVolume());
        gui.ShowVolume();

        clearTimeout(timeout_HideVolume);
        timeout_HideVolume = setTimeout(gui.HideVolume, 2000);
    }

    this.MuteVolume = function()
    {
        var volume = AudioControl.GetVolume();
        if(volume > 25)
            volume = 25;
        else
            volume = 0;

        soundControl.SetVolume(volume);

        gui.HideAll();
        gui.SetVolume(volume);
        gui.ShowVolume();

        clearTimeout(timeout_HideVolume);
        timeout_HideVolume = setTimeout(gui.HideVolume, 2000);
    }
    
    this.ShowPinDialog = function()
    {
	pininput = '';
	$('#pinin').val('');
	$('#pin-invalid').html('');
	$('#pin-window').show();
	var cathtm=$('.channelmenu-category').html();
	$('.channelmenu-category').html('');
	$('.channelmenu-category').html(cathtm);
	//CreateAndFillChannelsMenuList( pageStartIndex );
    }

    this.HidePinDialog = function()
    {
	pininput = '';
	$('#pin-window').hide();
	if(channelMenuOn || favoriteListOn){
	    CreateAndFillChannelsMenuList( pageStartIndex );
	}else{
	    
            if((channelList[selectedChannel].parent==1)&&(pinentered!=1)){
        	while(channelList[selectedChannel].parent==1){
		    selectedChannel--;
		    if(selectedChannel < 0){break;}
		};

		if(selectedChannel < 0){
        	    selectedChannel = channelList.length - 1;
		    while(channelList[selectedChannel].parent==1){
			selectedChannel--;
			if(selectedChannel < 0){break;}
		    };
		}
        	stb.PlaySelectedCH();
            }
	}
    }
    
    this.CheckPin = function()
    {
	if(pininput == parentpin){
	    pinentered=1;
	    stb.HidePinDialog();
	    if(channelMenuOn || favoriteListOn){
		stb.ToggleChannelsMenu();
	    }
	    stb.PlaySelectedCH();
	}else{
	    pininput='';
	    $('#pinin').val('');
	    $('#pin-invalid').html('Пароль введен не верно.');
	}
    }


    this.inputPin = function(keyCode)
    {
	pininput+=keyCode;
	$('#pinin').val(pininput);
	$('#pin-invalid').html('');
    }

    this.ToggleChannelsMenu = function(backpressed)
    {   
        ClearAllTimeouts();

        if(channelMenuOn || favoriteListOn)
        {
            if((channelList[selectedChannel].parent==1)&&(pinentered!=1)){
        	if(backpressed==65534){
        	    while(channelList[selectedChannel].parent==1){
			selectedChannel--;
			if(selectedChannel < 0){break;}
		    };

    		    if(selectedChannel < 0){
        		selectedChannel = channelList.length - 1;
			while(channelList[selectedChannel].parent==1){
			    selectedChannel--;
			    if(selectedChannel < 0){break;}
			};
		    }
        	}else{
        	    stb.ShowPinDialog();
        	    return;
        	}
            }
            
            
            
            if(isFavChanged)
            {
                SaveFavoriteChannels(channelList);
                isFavChanged = false;
            }

            gui.HideAll();
            gui.ShowChannelInfo();
            gui.SetInterfaceVisibility(80);

            VideoPreviewMode();
            
            channelMenuOn = false;
            favoriteListOn = false;
            
            timeout_HideChannelInfo = setTimeout(gui.HideChannelInfo, 4000);
        }
        else
        {
            var tip = '<img  align="middle" src="images/red.png" alt="btnred" style="margin: 0px 0px 35px 0px" width="60" height="56" /><span style="color:#DD0000">Избранные&nbsp;</span><img align="middle" src="images/green.png" alt="btngrn" style="margin: 0px 0px 35px 0px" width="60" height="56" /><span style="color:#00DD00">Доб&nbsp;</span><img align="middle" src="images/yellow.png" alt="btnyel" style="margin: 0px 0px 35px 0px" width="60" height="56" /><span style="color:#DDDD00">Выход&nbsp;&nbsp;</span>';
            $('#channelmenu-info-tips').html(tip);
            
            if(currentChannel >= pageStartIndex && currentChannel < pageEndIndex)
                CreateAndFillChannelsMenuList( pageStartIndex );
            else
                CreateAndFillChannelsMenuList( currentChannel );
            
            gui.HideAll();
            gui.ShowChannelsMenuLayer();
            gui.SetInterfaceVisibility(100);

            VideoFullScreen();

            channelMenuOn = true;
                        
        }
        
        favoriteListOn = false;
    }

    this.ToggleChannelInfo = function()
    {
        clearTimeout(timeout_HideChannelInfo);
        
        gui.HideAll();

        if(channelInfoOn)
        {
            gui.HideChannelInfo();
            channelInfoOn = false;
        }
        else
        {
            gui.ShowChannelInfo();
            channelInfoOn = true;
        }
    }

    this.ToggleChannelAnnounce = function()
    {
        clearTimeout(timeout_HideChannelInfo);

        gui.HideAll();
        gui.ShowChannelInfo();

        if(channelAnnounceOn)
        {
            $('body').css('background-image', '');

            $('#playchannel-num').show();
            var shegth;
            var smarg;
            if(videolayerfullwidth==1280){
        	shegth='210px';
        	smarg='459px';
            }else if(videolayerfullwidth==720){
        	shegth='123px';
        	smarg='240px';
            }else{
        	shegth='125px';
        	smarg='229px';
            }
            
            
            $('#playchannel-info-wrapper').css("height", shegth);
            $('#playchannel-info').css("margin-top", smarg);

            channelAnnounceOn = false;
            ShowProgram( currentChannel );

            gui.SetInterfaceVisibility(80);
            clearTimeout(timeout_HideChannelInfo);
            timeout_HideChannelInfo = setTimeout(gui.HideChannelInfo, 4000);
        }
        else
        {
            $('body').css('background-image', 'url(images/announce/bg.jpg)');
	    $('body').css('background-size', '100% 100%');
	    
            var shegth;
            var smarg;
            if(videolayerfullwidth==1280){
        	shegth='895px';
        	smarg='0px';
            }else if(videolayerfullwidth==720){
            	shegth='580px';
        	smarg='0px';
            }else{
        	shegth='463px';
        	smarg='0px';
            }

            $('#playchannel-num').hide();
            $('#playchannel-info-wrapper').css("height", shegth);
            $('#playchannel-info').css("margin-top", smarg);
            try
            {
                LoadCurrentChannnelAnnounce();
            }
            catch(e)
            {
                MessageBox.Show("Ошибка загрузки анонса", e.message, MBType.ERROR);
            }
            channelAnnounceOn = true;

            gui.SetInterfaceVisibility(100);
        }
    }

    this.isChannelAnnounceOn = function()
    {
        return channelAnnounceOn;
    }

    this.ToggleUserMenu = function()
    {
        gui.HideAll();

        if(userMenuOn)
        {
            $('body').css('background-image', '');
            gui.HideUserMenu();
            userMenuOn = false;
        }
        else
        {
            $('body').css('background-image', 'url(images/announce/bg.jpg)');
            $('body').css('background-size', '100% 100%');
            gui.ShowUserMenu();
            userMenuOn = true;
        }
    }

    

    function ClearAllTimeouts()
    {
        clearTimeout(timeout_HideChannelInfo);
        clearTimeout(timeout_Play);
        clearTimeout(timeout_HideVolume);
    }

    function GetCurrentChannelObject()
    {
        return channelList[currentChannel];
    }

    var channelsOnCurrentPage = 0;
    var pageStartIndex = 0;
    var pageEndIndex = 10;
    var menuRowsPerPage = 27;
    function CreateAndFillChannelsMenuList( startIndex )
    {
        channelsOnCurrentPage = 0;
        var channelCategory = '';
        var list = "";

        var freeRows = menuRowsPerPage;

        if(startIndex < pageStartIndex)
        {
            freeRows--;

            for(var r = startIndex; r > (startIndex - menuRowsPerPage); r--)
            {
                if(r < 0)
                {
                    r = 0;
                    break;
                }

                if(channelCategory != channelList[r].category)
                {
                    channelCategory = channelList[r].category;
                    freeRows--;
                }

                if(freeRows <= 0)
                    break;

                freeRows--;
            }

            startIndex = r;
        }

        channelCategory = '';
        freeRows = menuRowsPerPage;
        var listItems = 0;        
        for(var i = startIndex; i < (startIndex + menuRowsPerPage); i++)
        {
            if(i >= channelList.length)
                break;

            if(freeRows <= 0)
                break;

            if(channelCategory != channelList[i].category)
            {
                channelCategory = channelList[i].category;
                list += "<div class='channelmenu-item channelmenu-category' style='color:#000000;'>" + channelCategory + "</div>";
                freeRows--;

                if(freeRows <= 0)
                    break;
            }

            var chfavicon='notfav.png';
            if(channelList[i].fav != undefined){
        	chfavicon='fav.png';
            }
            if(channelList[i].parent == 1){
        	chfavicon='lock.png';
            }
            var namechanlen=21;
            if(videolayerfullwidth==1920){
        	namechanlen=32
            }else if(videolayerfullwidth==1280){
        	namechanlen=32;
            }

            
            
            var namechan=channelList[i].name;
            if(namechan.length > namechanlen){
        	namechan=namechan.substring(0,namechanlen-3)+'...';
            }
            
            if(i == selectedChannel)
            {
                list += "<li nowrap class='channelmenu-selecteditem'><div class='channelmenu-list-fav'>&nbsp;<img src='images/chlist/"+chfavicon+"' align='middle'  />&nbsp;</div><div class='channelmenu-list-num'> " + (i + 1) + " </div><span style='color: #47a6ff;'>&nbsp;»</span>&nbsp;" + namechan + "</li>";
                channelmenuListItemSelected = listItems;
            }
            else
                list += "<li nowrap class='channelmenu-item'><div class='channelmenu-list-fav'>&nbsp;<img src='images/chlist/"+chfavicon+"' align='middle'  />&nbsp;</div><div class='channelmenu-list-num'> " + (i + 1) + " </div><span nowrap style='color: #47a6ff;'>&nbsp;»</span>&nbsp;" + namechan + "</li>";
            
            listItems++;
            freeRows--;
            channelsOnCurrentPage++;
        }

        pageStartIndex = startIndex;
        pageEndIndex = pageStartIndex + channelsOnCurrentPage;

        document.getElementById("channelmenu-list").innerHTML = list;
    }
    
    this.ToggleFavoriteChannelList = function()
    {
        favoritemenuListItemSelected = 0;
        selectedFavorite = 0;
        
        var tip = '<img align="middle" src="images/red.png" style="margin: 0px 0px 35px 0px" width="60" height="56" alt="btnred" /><span style="color:#DD0000">Все&nbsp;</span><img align="middle" src="images/green.png" style="margin: 0px 0px 35px 0px" width="60" height="56" alt="btngrn" /><span style="color:#00DD00">Вниз&nbsp;</span><img align="middle" src="images/yellow.png" style="margin: 0px 0px 35px 0px" width="60" height="56" alt="btnyel" /><span style="color:#DDDD00">Вверх&nbsp;</span><img align="middle" src="images/blue.png" style="margin: 0px 0px 35px 0px" width="60" height="56" alt="btnblue" /><span style="color:#026DD1">Удал&nbsp;&nbsp;</span>';
        $('#channelmenu-info-tips').html(tip);
        
        CreateAndFillFavoriteList(0);
        favoriteListOn = true;
        channelMenuOn = false;
    }
    
    this.isFavoriteListOn = function()
    {
        return favoriteListOn;
    }
    
    var favPageStartIndex = 0;
    function CreateAndFillFavoriteList( startIndex )
    {
        var list = "";
        var freeRows = menuRowsPerPage;

        freeRows = menuRowsPerPage;
        var listItems = 0;       
        //alert('len '+favoriteList.length);
        for(var i = startIndex; i < favoriteList.length; i++)
        {            
            if(freeRows <= 0)
                break;
            //alert('i '+i);
            var channelNum = favoriteList[i];
	    //alert ('num '+channelNum);
            if(listItems == favoritemenuListItemSelected)
            {
                list += "<li class='channelmenu-selecteditem'><div class='channelmenu-list-fav'>&nbsp;<img src='images/chlist/fav.png' align='middle'/>&nbsp;</div><div class='channelmenu-list-num'> " + (i + 1) + " </div><span style='color: #47a6ff;'>»</span>&nbsp;<span>" + channelList[channelNum].name + "</span></li>";
            //channelmenuListItemSelected = listItems;
            }
            else
                list += "<li class='channelmenu-item'><div class='channelmenu-list-fav'>&nbsp;<img src='images/chlist/fav.png' align='middle' />&nbsp;</div><div class='channelmenu-list-num'> " + (i + 1) + " </div><span style='color: #47a6ff;'>»</span>&nbsp;<span>" + channelList[channelNum].name + "</span></li>";
            
            listItems++;
            freeRows--;
        }

        pageStartIndex = startIndex;
        pageEndIndex = pageStartIndex;

        document.getElementById("channelmenu-list").innerHTML = list;
        
        favPageStartIndex = startIndex;
    }

    function CreateFavoriteList()
    {
        favoriteList.length=0;
        for(var chkey in channelList)
        {
            //alert('chkey '+chkey);
            if((channelList[chkey].fav != undefined) && (channelList[chkey].parent!=1))
            {
                //alert('fav '+channelList[chkey].fav);
                favoriteList[channelList[chkey].fav] = chkey;
            }
        }
	for(var i=0;i<favoriteList.length;i++){
	    //alert('i '+i);
	    if(favoriteList[i]==undefined){
		var favlisttemp=[];
		var n=0;
		for(var i1=0;i1<favoriteList.length;i1++){
		    //alert('i1 '+i1);
		    if(favoriteList[i1]!=undefined){
			favlisttemp[n]=favoriteList[i1];
			n++;
			//alert('n '+n);
		    }
		}
		//alert('len0 '+favoriteList.length);
		favoriteList=favlisttemp;
		for(var i1=0;i1<favoriteList.length;i1++){
		    channelList[favoriteList[i1]].fav=i1;
		}
		//alert('len1 '+favoriteList.length);
		SaveFavoriteChannels(channelList);
		break;
	    }
	}
    
    
    
    }

    function FindNextFavoriteIndex()
    {
        return favoriteList.length;        
    }

    var isFavChanged = false;
    
    this.ToggleFavoriteChannel = function()
    {
        var list = document.getElementById("channelmenu-list").getElementsByTagName("li");
	if(channelList[selectedChannel].parent==1){return;};
        if(channelList[selectedChannel].fav == undefined)
        {
            var nextFavIndex = FindNextFavoriteIndex();
            selectedFavorite = nextFavIndex;
            
            channelList[selectedChannel].fav = nextFavIndex;
            favoriteList[nextFavIndex] = selectedChannel;

            list[channelmenuListItemSelected].getElementsByTagName('div')[0].innerHTML = "&nbsp;<img src='images/chlist/fav.png' align='middle' />&nbsp;";
        }
        else
        {
            selectedFavorite = channelList[selectedChannel].fav;
            
            this.RemoveSelectedFavoriteChannel();

            list[channelmenuListItemSelected].getElementsByTagName('div')[0].innerHTML = "&nbsp;<img src='images/chlist/notfav.png' align='middle'  />&nbsp;";
        }

        isFavChanged = true;
    }
    
    this.RemoveSelectedFavoriteChannel = function()
    {
        if(favoriteList.length <= 0)
            return;
        
        channelList[favoriteList[selectedFavorite]].fav = undefined;

        for(var i = parseInt(selectedFavorite, 10); i < favoriteList.length - 1; i++)
        {
            var nextFav = i + 1;

            channelList[favoriteList[nextFav]].fav = i;
            favoriteList[i] = favoriteList[nextFav];
        }
        
        favoriteList.splice( favoriteList.length - 1, 1 );
        
        if(selectedFavorite >= favoriteList.length)
        {
            selectedFavorite = favoriteList.length - 1;
            favoritemenuListItemSelected--;
        }
        
        if(favoriteListOn)
            CreateAndFillFavoriteList(favPageStartIndex);
        
        isFavChanged = true;
    }

    function ClockTick()
    {
        var date = clock.getCurrentDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        gui.SetClockTime(hours, minutes);
        
        setTimeout(ClockTick, 60000);
        
        var channel = GetCurrentChannelObject();
        if(channel.program != 'undefined')
            UpdateCurrentProgram();        
    }
	
    function VideoFullScreen()
    {
        var layer = false;
        STB_SetVideoLayer(false, videolayerfullwidth, videolayerfullheight, videolayerfullbasex, videolayerfullbasey);
    }

    function VideoPreviewMode()
    {
        var layer = true;
        STB_SetVideoLayer(true,previeww,previewh,previewx,previewy);
    }

    function ShowProgram( chNum )
    {
        //<img src='static/images/mw/chlist/ajax-loader.gif' />
        gui.SetChannelProgram("", "");

        var channel = channelList[chNum];

        var playchannelContent = '';
        var channelmenuContent = '';
        if(channel.program == 'undefined'){
	    $.ajax({
	        url:       "http://79.171.120.14/cgi-bind/index.cgi",
	        cache:     false,
	        type:	   'POST',
	        dataType:  "text",
	        data:      { action: 'getchannelprogram', channelid: channel.id,authmac: mac},
	        success:   function(result) {
	    	    channel.program= eval(result);
		    UpdateCurrentProgram(channel);
	        }
	    });
        }else{
            var lastProgram = channel.program[channel.program.length - 1];
            if(lastProgram != undefined){
        	var curTimeValue=clock.getEpoch();
                if(lastProgram.end < curTimeValue){
                    channel.program = 'undefined';
                    ShowProgram(chNum);
                }
                else
                {
                    UpdateCurrentProgram(channel);
                }
            }
        }
    }







    function lpad2(str) {
        str+='';
        while (str.length < 2)str = '0' + str;
        return str;
    }

    function UpdateCurrentProgram( channel )
    {
        var playchannelContent = '<table class="programtable">\n\
                                    <tr class="programfont" style="color:#FFFFFF; background-color:#000000;"><td class="progfirstnext" align="right" nowrap><b>Сейчас <span style="color: #47a6ff;">»</span> </b></td>';

        var channelmenuContent = 'Нет информации';

	var curTimeValue=clock.getEpoch();
        for(var i = 0; i < channel.program.length; i++)
        {
            var program = channel.program[i];
	    var dateobj=new Date(program.start * 1000);
            var progStartStr = lpad2(dateobj.getHours())+':'+lpad2(dateobj.getMinutes());

            if(program.start <= curTimeValue && program.end >= curTimeValue)
            {
	        playchannelContent += '<td class="progtime" align="center" nowrap>' + progStartStr + ' </td><td nowrap>&nbsp;&nbsp;&nbsp;&nbsp;' + program.title + '</td>';

                channelmenuContent = program.title;

                if(channel.program[i + 1] != undefined && channel.program[i + 1] != null)
                {
                    var nextProgram = channel.program[i + 1];
                    var dateobj=new Date(nextProgram.start * 1000);
            	    var nextProgStartStr = lpad2(dateobj.getHours())+':'+lpad2(dateobj.getMinutes());
                    playchannelContent += '<tr class="programfont" style="color:#FFFFFF; background-color:#000000;"><td class="progfirstnext" align="right" nowrap><b>&nbsp;Далее <span style="color: #47a6ff;">» </span> </b></td><td align="center" nowrap><span style="background-color: ##47a6ff; color: #FFFFFF; ">' + nextProgStartStr + '</span></td><td nowrap>&nbsp;&nbsp;&nbsp;&nbsp;' + nextProgram.title + '</td>';
                }
            }
        }
        
        playchannelContent += '</tr></table>';

        gui.SetChannelProgram(playchannelContent, channelmenuContent);
    }
    function LoadCurrentChannnelAnnounce()
    {
        CreateAndFillChannelAnnounce(0);
    }

    var g_selectedAnnounceId = 0;
    var announcesPerPage = 10;
    var announceDesc = new Array();
    function CreateAndFillChannelAnnounce(selectedAnnounceId)
    {
        g_selectedAnnounceId = selectedAnnounceId;

        var page = Math.floor(selectedAnnounceId / announcesPerPage);
        var listStartIndex = announcesPerPage * page;
        var listEndIndex = listStartIndex + announcesPerPage;

        var program = GetCurrentChannelObject().program;        
        var channelAnnounceContent = '';
	
	var curTimeValue=clock.getEpoch();
        if(program == 'undefined')
        {
            channelAnnounceContent = '<div style="text-align:center; margin-top:30%;">Нет информации</div>';
            channelAnnounce = channelAnnounceContent;
            $('#playchannel-info-programm').html(channelAnnounce);
        }
        else
        {
            channelAnnounceContent = '<table id="channelannounce-table">';
            
            for(var i = listStartIndex, d = 0; i < listEndIndex && i < program.length; i++, d++)
            {
                var announce = program[i];

                var dateobj=new Date(announce.start * 1000);
                var progStartStr = lpad2(dateobj.getDay())+'.'+lpad2((dateobj.getMonth()+1))+'.'+dateobj.getFullYear()+' '+lpad2(dateobj.getHours())+':'+lpad2(dateobj.getMinutes());
                if(announce.start <= curTimeValue && announce.end >= curTimeValue)
                {
                    channelAnnounceContent += '<tr class="announce-row selectable"><td nowrap>&nbsp;&nbsp;Сейчас <span style="color: #47a6ff;">»</span> '+ progStartStr.substr(11, 5) +' ';
                    
                    if(announce.desc != '' && announce.desc != null)
                        channelAnnounceContent += '<img src="images/announce/dawn_on.png" />' + ' ';
                    else
                        channelAnnounceContent += '<img src="images/announce/down_off.png" />' + ' ';

                    channelAnnounceContent += announce.title + ' </td></tr>';

                    channelAnnounceContent += '<tr class="announce-desc" style="display:none; text-align:justify;"><th width="1920px">'+announce.desc+'</th></tr>';

                    announceDesc[d] = announce.desc;
                }
                else if(announce.start >= curTimeValue)
                {
                    channelAnnounceContent += '<tr class="announce-row selectable" ><td nowrap>&nbsp;&nbsp;&nbsp;<span style="color: #878787;">Далее</span> <span style="color: #47a6ff;">» </span> '+ progStartStr.substr(11, 5)  +' ';
                    if(announce.desc != '' && announce.desc != null)
                        channelAnnounceContent += '<img src="images/announce/dawn_on.png" />' + ' ';
                    else
                        channelAnnounceContent += '<img src="images/announce/down_off.png" />' + ' ';

                    channelAnnounceContent += announce.title + ' </td></tr>';

                    channelAnnounceContent += '<tr class="announce-desc" style="display:none; text-align:justify;"><th width="1920px">'+announce.desc+'</th></tr>';

                    announceDesc[d] = announce.desc;
                }
            }
            channelAnnounceContent += '</table>';

            channelAnnounce = channelAnnounceContent;

            $('#playchannel-info-programm').html(channelAnnounce);

            var selectedRow = selectedAnnounceId - listStartIndex;

            var list = new Array();
            var announces = new Array();
            try
            {
                list = document.getElementById("channelannounce-table").getElementsByClassName("selectable");
                announces = document.getElementById("channelannounce-table").getElementsByClassName("announce-desc");
            }
            catch(e)
            {
                return;
            }
            
            if(list.length > 0)
            {
                list[selectedRow].setAttribute("class", "selected-row selectable");
                if(announceDesc[selectedRow] != '')
                    announces[selectedRow].style.display = "block";
            }
        }
    }
    
    

    this.SelectAnnounce = function(mod)
    {
        var nextId = g_selectedAnnounceId + mod;

        if(nextId < 0 || GetCurrentChannelObject().program == 'undefined' || nextId >= GetCurrentChannelObject().program.length)
            return;
        
        var currentPage = Math.floor(g_selectedAnnounceId / announcesPerPage);
        var nextPage = Math.floor(nextId / announcesPerPage);

        if(currentPage != nextPage)
        {
            CreateAndFillChannelAnnounce(nextId);
        }
        else
        {
            var currentSelectedItem = g_selectedAnnounceId - (announcesPerPage * nextPage);
            var nextSelectedItem = nextId - (announcesPerPage * nextPage);
            var list = new Array();
            var announces = new Array();
            
            try
            {
                list = document.getElementById("channelannounce-table").getElementsByClassName("selectable");
                announces = document.getElementById("channelannounce-table").getElementsByClassName("announce-desc");
            }
            catch(e)
            {
                return;
            }
            
            var listSize = list.length;

            if(currentSelectedItem < listSize)
            {
                list[currentSelectedItem].setAttribute("class", "announce-row selectable");
                announces[currentSelectedItem].style.display = "none";
            }
            if(nextSelectedItem < listSize)
            {
                list[nextSelectedItem].setAttribute("class", "selected-row selectable");
                if(announceDesc[nextSelectedItem] != ''  && announceDesc[nextSelectedItem] != null)
                    announces[nextSelectedItem].style.display = "block";
            }
        }
        g_selectedAnnounceId = nextId;
    }


    this.SelectNextUserMenuItem = function()
    {
        if((selectedUserMenuItem + 1) > usermenuCategoryNames.length - 1)
            return;

        $(usermenuItems[selectedUserMenuItem]).hide();
        $(usermenuCategory[selectedUserMenuItem]).css('background-image', 'url(images/channel_info_background.jpg)');

        selectedUserMenuItem++;

        $(usermenuCategory[selectedUserMenuItem]).css('background-image', 'url(images/channel_programm_background.png)');
        $(usermenuItems[selectedUserMenuItem]).show();

        var name = '';
        name += usermenuCategoryNames[selectedUserMenuItem];        
        $('#usermenu-category-name').html(name);
    }

    this.SelectPrevUserMenuItem = function()
    {
        if(selectedUserMenuItem - 1 < 0)
            return;
        
        $(usermenuItems[selectedUserMenuItem]).hide();
        $(usermenuCategory[selectedUserMenuItem]).css('background-image', 'url(images/channel_info_background.jpg)');
        
        selectedUserMenuItem--;

        $(usermenuCategory[selectedUserMenuItem]).css('background-image', 'url(images/channel_programm_background.png)');
        $(usermenuItems[selectedUserMenuItem]).show();
        
        var name = '';
        name += usermenuCategoryNames[selectedUserMenuItem];
        $('#usermenu-category-name').html(name);

    }

    this.GetRemoteControl = function()
    {
        return remoteControl;
    }
    
    this.GetChannelList = function()
    {
        return channelList;
    }
}
