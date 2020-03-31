import * as AppStorage from './app_storage.js'

const OPTIONS = {
    musicVolume: 1  // value between 0 and 1
    };


export function save()
{
AppStorage.setData({ space_ship_options: OPTIONS });
}


export function load( options )
{
if ( options )
    {
    if ( typeof options.musicVolume !== 'undefined' )
        {
        OPTIONS.musicVolume = options.musicVolume;
        }
    }
};


export function setMusicVolume( value )
{
if ( value < 0 || value > 1 )
    {
    return false;
    }

OPTIONS.musicVolume = value;

return true;
}


export function getMusicVolume()
{
return OPTIONS.musicVolume;
}
