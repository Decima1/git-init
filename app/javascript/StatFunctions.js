var GLOBAL_URLS_OBJ =
{
    array_counter: 0,
    ArrayOfURLs: new Array()
};

function $import(path)
{
    var new_path;
    var count = 0;
    try{
        for(var i=0;i<GLOBAL_URLS_OBJ.ArrayOfURLs.length;i++)
        {
            if(GLOBAL_URLS_OBJ.ArrayOfURLs[i] == path)
            {
                count++;
            }
        }
        
        if(count == 0)
        {
            GLOBAL_URLS_OBJ.ArrayOfURLs[GLOBAL_URLS_OBJ.array_counter] = path;
            new_path = '<script type="text/javascript" src="' + path + '?' + Math.floor(Math.random() * 1000) + '"></script>';
            document.writeln(new_path);
            GLOBAL_URLS_OBJ.array_counter++;
        }
    }
    catch(e)
    {
        MessageBox.Show("Ошибка импорта", e.message, MBType.ERROR);
    }
}

function SaveFavoriteChannels( channelList )
{
    var favs = "";
    
    for(var i in channelList)
    {
        if(channelList[i].fav != undefined)
            favs += channelList[i].id + "::" + channelList[i].fav + ";"
    }

    $.ajax({
        url:       "http://79.171.120.14/cgi-bind/index.cgi",
        cache:     false,
        dataType:  "text",
        data:      { action: 'savefavchannels',idiptv: idiptv,favs: favs,authmac: mac},
        success:   function(result) {
    	    var responce = eval(result);
	    if(responce[0] != 0){
		MessageBox.Show("Сохранение избранных каналов", "Не удалось сохранить список.<br/>" + xhr.status + "<br/>" + thrownError, MBType.ERROR);
		return;
	    }
	    MessageBox.ShowMini("Избранные каналы сохранены");
        },
	error:     function(result){
	    MessageBox.Show("Сохранение избранных каналов", "Не удалось сохранить список.<br/>" + xhr.status + "<br/>" + thrownError, MBType.ERROR);
	}
    });

}



function getCookie(name)
{
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset)
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return(setStr);
}

function setCookie (name, value, expires, path, domain, secure)
{
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}
