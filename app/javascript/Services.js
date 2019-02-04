var usermenuCategoryNames = new Array('Персональные данные',
                                      'Погода',
                                      'Курс валют',
                                      'Новости компании',
                                      'Справка'
                                      /*,'Информация пользователя'*/
                                      );


function InitServices()
{
    var items = $('.usermenu-item');
    var item = $(items[0]);
    item.show();

    $.ajax({
        url:       "http://79.171.120.14/cgi-bind/index.cgi",
        cache:     false,
        type:	   'POST',
        dataType:  "text",
        data:      { action: 'generateweather',authmac: mac},
        success:   function(result) {
    	    var responce = eval(result);
	    if(responce[0] != ''){
		$('#usermenu-item-weather').html('Ошибка');
		return;
	    }
	    var weather = responce[1];
	    var html = '<table class="programtable" align="center" cellspacing="0" cellpadding="7" style="color:inherit; margin: 0 425px" >';
	    html += '<tr class="programfont" align="center" class="channelmenu-category"><td></td><td></td><td>Осадки</td><td>Темп.</td><td>Давл.</td><td>Ветер</td><td>Влажность</td></tr>';
	    html += '<tr><th colspan="7"><div style="width:100%; height:1px; "></div></th></tr>';
    
	    for(index in weather){
    		var forecast = weather[index];
    		var minTemp = forecast.temp.min > 0 ? '+' + forecast.temp.min : forecast.temp.min;
    		var maxTemp = forecast.temp.max > 0 ? '+' + forecast.temp.max : forecast.temp.max;
    		html += '<tr align="center" style="background-image: url(images/channel_programm_background.png);">';
    		html += '<td class="programfont" style="color:#DDDDDD">'+forecast.tod+'</td>';
    		html += '<td class="programfont">'+forecast.date+'<br/>'+forecast.weekday+'</td>';
    		html += '<td class="programfont">'+forecast.cloudiness+'<br/>'+forecast.precipitation+'</td>';
    		html += '<td class="programfont">'+minTemp+'...'+maxTemp+'</td>';
    		html += '<td class="programfont">'+forecast.pressure+'<br/>мм.р.с</td><td class="programfont">'+forecast.windspeed+'<br/>м/с</td><td class="programfont">'+forecast.wet+'%</td></tr>';
    		html += '<tr><th colspan="7"><div style="width:100%; height:10px;"></div></th></tr>';
	    }
	    html += '</table>';
	    $('#usermenu-item-weather').html(html);
        },
	error:     function(result){
	    $('#usermenu-item-weather').html('Ошибка');
	}
    });
    
    
    $.ajax({
        url:       "http://79.171.120.14/cgi-bind/index.cgi",
        cache:     false,
        type:	   'POST',
        dataType:  "text",
        data:      { action: 'generatenews',authmac: mac},
        success:   function(result) {
    	    var responce = eval(result);
	    if(responce[0] != ''){
	    	$('#usermenu-item-news').html('Ошибка');
		return;
	    }
	    var news =responce[1];
	    var html = '';
	    for(index in news){
    		var item = news[index];
    		html += '<br/>';
    		html += '<div">';
    		html += '<span class="itnemdatefont" style="float:left; color:#A6A6A6;">Новости</span>'+'<span class="itnemdatefont" style="float:right; color:#A7A7A7;">'+item.date+'</span>';
    		html += '</div>';
    		html += '<h2>'+item.title+'</h2>';
    		html += '<p style="margin:0 10px 0 10px;">'+item.desc+'</p>';
    		html += '<br/>';
	    }
	    $('#usermenu-item-news').html(html);
        },
	error:     function(result){
    	    $('#usermenu-item-news').html('Ошибка');
	}
    });


    $.ajax({
        url:       "http://79.171.120.14/cgi-bind/index.cgi",
        cache:     false,
        type:	   'POST',
        dataType:  "text",
        data:      { action: 'generatecurrency',authmac: mac},
        success:   function(result) {
    	    var responce = eval(result);
	    if(responce[0] != ''){
	    	$('#usermenu-item-currency').html('Ошибка');
		return;
	    }
	    var currency = responce[1];
	    var html = '<table align="center" width="50%" style="color:inherit;">';
	    html += '<tr class="channelmenu-category programfont"><td>Валюта</td><td>Курс НБУ</td><td>Динамика</td>';
	    for(index in currency){
    		var item = currency[index];
    		if(item.char3 == 'USD' || item.char3 == 'EUR' || item.char3 == 'RUB' || item.char3 == 'GBP'){
        	    var change = item.change > 0 ? '<span style="color:#00FF00;">+' + item.change + '</span>' : '<span style="color:#FF0000;">' + item.change + '</span>';
        	    html += '<tr class="channelmenu-item"><td>' + item.char3 + '</td><td>' + item.rate + '</td><td>' + change + '</td></tr>';
    		}
	    }
	    html += '</table>';
	    $('#usermenu-item-currency').html(html);
        },
	error:     function(result){
    	    $('#usermenu-item-currency').html('Ошибка');
	}
    });


    $.ajax({
        url:       "http://79.171.120.14/cgi-bind/index.cgi",
        cache:     false,
        type:	   'POST',
        dataType:  "text",
        data:      { action: 'generateinfo',authmac: mac},
        success:   function(result) {
    	    if(result == ''){
		$('#usermenu-item-info').html('Ошибка');
		return;
	    }
	    $('#usermenu-item-info').html(result);

        },
	error:     function(result){
	    $('#usermenu-item-info').html('Ошибка');
	}
    });
    
}


