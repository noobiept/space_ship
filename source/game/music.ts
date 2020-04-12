import { getMusicVolume } from "../shared/options";

export type MusicArgs = {
    songIDs: string[]; // list with IDs of the audio html elements
};

export default class Music {
    private increase_interval?: number;
    private songIDs: string[];
    private currentSong = 0;
    private isPlaying = false;

    constructor({ songIDs }: MusicArgs) {
        this.songIDs = songIDs;
    }

    /**
     * Position (0 based) from the given IDs list in the constructor, which tells the song to play.
     */
    play(songPosition: number) {
        this.stop();

        if (songPosition < 0 || songPosition >= this.songIDs.length) {
            songPosition = 0;
        }

        const volume = getMusicVolume();
        const music = document.getElementById(
            this.songIDs[songPosition]
        ) as HTMLAudioElement;
        music.currentTime = 0;
        music.volume = 0;
        music.loop = true;
        music.play();

        this.currentSong = songPosition;
        this.isPlaying = true;

        this.startInterval(() => {
            const newVolume = music.volume + 0.2;

            // we achieved the volume we wanted
            if (newVolume > volume) {
                music.volume = volume;
                return true;
            }

            // keep raising the volume
            music.volume = newVolume;
            return false;
        });
    }

    next() {
        this.stop();

        let nextPosition = this.currentSong + 1;

        if (nextPosition >= this.songIDs.length) {
            nextPosition = 0;
        }

        this.play(nextPosition);
    }

    stop() {
        if (!this.isPlaying) {
            return;
        }

        const music = document.getElementById(
            this.songIDs[this.currentSong]
        ) as HTMLAudioElement;

        this.isPlaying = false;
        this.startInterval(() => {
            const volume = music.volume - 0.2;

            if (volume < 0) {
                music.pause();
                return true;
            }

            music.volume = volume;
            return false;
        });
    }

    /**
     * 'updateVolume' returns a boolean that tells if we should cancel (true) the interval or continue (false).
     */
    private startInterval(updateVolume: () => boolean) {
        window.clearInterval(this.increase_interval);

        // call from the start
        updateVolume();

        this.increase_interval = window.setInterval(() => {
            const cancel = updateVolume();

            if (cancel) {
                window.clearInterval(this.increase_interval);
            }
        }, 250);
    }
}
