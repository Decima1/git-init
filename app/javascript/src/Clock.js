function Clock()
{
    var time = new Date();
    Tick();
    function Tick()
    {
        $.ajax({
            url:       "http://79.171.120.14/cgi-bind/index.cgi",
	    cache:     false,
	    type:	   'POST',
	    dataType:  "text",
            data:{action:'getcurrenttime', authmac: mac},
            success: function(response)
            {
        	time.setTime(response*1000);
            },
    	    error:     function(result){
	    }
        });
	
        setTimeout(Tick, 60000);
    }

    this.getCurrentDate = function()
    {
        return time;
    }

    this.getEpoch = function()
    {
        return time.getTime()/1000>>0;
    }

    this.GetCurrentDateString = function()
    {
        var curTime = time;

        var month = curTime.getMonth() + 1;
        var monthStr = month < 10 ? '0' + month.toString() : month.toString();
        var day = curTime.getDate();
        var dayStr = day < 10 ? '0' + day.toString() : day.toString();
        var hour = curTime.getHours();
        var hourStr = hour < 10 ? '0' + hour.toString() : hour.toString();
        var minute = curTime.getMinutes();
        var minuteStr = minute < 10 ? '0' + minute.toString() : minute.toString();

        var curTimeString = curTime.getFullYear().toString() + monthStr + dayStr + hourStr + minuteStr + "00";
        
        return curTimeString;
    }
}
