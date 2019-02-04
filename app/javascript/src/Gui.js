function GUI()
{
    //$('body').css('background', '#FF00FF');

    var layerPlaychannel = document.getElementById("layer-playchannel");
    var layerChannelmenu = document.getElementById("layer-channelmenu");
    var layerChannelAnnounce = document.getElementById("layer-channelannounce");
    var layerUserMenu = document.getElementById("layer-usermenu");
    var volumeBar = document.getElementById("volume-bar");

    this.SetInterfaceTranparencyMask = function( colorMask )
    {
        STB_SetTransparencyMask( colorMask );
    }

    this.SetInterfaceVisibility = function( value )
    {
        STB_SetVisibility( value );
    }

    this.SetChannelNumber = function( num, isFavorite , isNabor)
    {
        if(!isNabor){num++;};
        document.getElementById("playchannel-num").innerHTML = num + (isFavorite ? "<br/><img src='images/chlist/fav.png' align='middle' />" : "");
    }

    this.SetFavoriteChannelName = function( name )
    {
        document.getElementById("playchannel-info-name").innerHTML = "« &nbsp&nbsp;<img src='images/chlist/fav.png' align='middle' />&nbsp&nbsp;" + name + "&nbsp;&nbsp; »";
    }

    this.SetChannelName = function( name )
    {
        document.getElementById("playchannel-info-name").innerHTML = "« &nbsp;&nbsp;" + name + "&nbsp;&nbsp; »";
    }
    this.SetChannelCategory = function( category )
    {
    //document.getElementById("playchannel-info-category").innerHTML = category;
    }

    this.SetClockTime = function(hours, minutes)
    {
        var strHours = hours < 10 ? '0' + hours : hours;
        var strMinutes = minutes < 10 ? '0' + minutes : minutes;

        document.getElementById("playchannel-info-clock").innerHTML = strHours + ":" + strMinutes;
        document.getElementById("channelmenu-clock").innerHTML = strHours + ":" + strMinutes;
        document.getElementById("usermenu-clock").innerHTML = strHours + ":" + strMinutes;
    }

    this.HideChannelInfo = function()
    {
        layerPlaychannel.style.display = 'none';
    }
    this.ShowChannelInfo = function()
    {
        layerPlaychannel.style.display = 'block';
    }

    this.SetChannelProgram = function( playchannelContent, channelmenuContent )
    {
        document.getElementById("playchannel-info-programm").innerHTML = playchannelContent;
        document.getElementById("channelmenu-program").innerHTML = channelmenuContent;
    }

    this.ShowVolume = function()
    {
        volumeBar.style.display = 'block';
    }
    this.HideVolume = function()
    {
        volumeBar.style.display = 'none';
    }
    this.SetVolume = function( vol )
    {
        document.getElementById("volume-bar-num").innerHTML = vol;
        volumeBar.style.width = 64 + ((192 * vol)/100);
    }

    this.HideConnecting = function()
    {
        document.getElementById("playchannel-connecting").style.display = 'none';
    }
    this.ShowConnecting = function()
    {
        document.getElementById("playchannel-connecting").style.display = 'block';
    }
    this.ShowPreviewConnecting = function()
    {
        document.getElementById("channelmenu-connecting").style.display = 'block';
    }
    this.HidePreviewConnecting = function()
    {
        document.getElementById("channelmenu-connecting").style.display = 'none';
    }

    this.ShowTips = function()
    {
        document.getElementById("playchannel-info-tips").style.display = 'block';
    }

    this.HideTips = function()
    {
        document.getElementById("playchannel-info-tips").style.display = 'none';
    }

    this.ShowChannelsMenuLayer = function()
    {
        layerChannelmenu.style.display = 'block';
        this.SetInterfaceVisibility(100);
    }

    this.ShowChannelAnnounce = function()
    {

        layerChannelAnnounce.style.display = 'block';
    //this.SetInterfaceVisibility(95);
    }

    this.HideChannelAnnounce = function()
    {
        layerChannelAnnounce.style.display = 'none';
    //this.SetInterfaceVisibility(100);
    }

    this.SetChannelAnnounceName = function( name )
    {
        document.getElementById("channelannounce-name").innerHTML = 'Анонс телеканала ' + '« ' + name + ' »';
    }
    this.SetChannelAnnounceList = function( content )
    {
        document.getElementById("channelannounce-list").innerHTML = content;
    }

    this.ShowUserMenu = function()
    {
        layerUserMenu.style.display = 'block';
        this.SetInterfaceVisibility(100);
    }
    this.HideUserMenu = function()
    {
        layerUserMenu.style.display = 'none';
        this.SetInterfaceVisibility(80);
    }

    this.HideAll = function()
    {
        layerPlaychannel.style.display = 'none';
        layerChannelmenu.style.display = 'none';
        layerChannelAnnounce.style.display = 'none';
        layerUserMenu.style.display = 'none';
        volumeBar.style.display = 'none';
    }
    this.ShowAll = function()
    {
        layerPlaychannel.style.display = 'block';
        layerChannelmenu.style.display = 'block';
        layerChannelAnnounce.style.display = 'block';
        layerUserMenu.style.display = 'block';
        volumeBar.style.display = 'block';
    }
}