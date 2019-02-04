function STB_SoundControl()
{
    this.IncreaseVolume = function()
    {
        var setVolume = STB_GetVolume() + 1;

        if(setVolume > 100)
            setVolume = 100;

        STB_SetVolume(setVolume);
    }
    this.DecreaseVolume = function()
    {
        var setVolume = STB_GetVolume() - 1;

        if(setVolume < 0)
            setVolume = 0;

        STB_SetVolume(setVolume);
    }
    this.SetVolume = function( volume )
    {
        STB_SetVolume(volume);
    }
}
