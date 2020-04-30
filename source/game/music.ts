import { getMusicVolume } from "../shared/options";

export type MusicArgs = {
    songIDs: string[]; // list with IDs of the audio html elements
};

export default class Music {
    private songIDs: string[];
    private currentSong = 0;
    private isPlaying = false;
    private playIntervalID?: number;
    private stopIntervalID?: number;

    constructor({ songIDs }: MusicArgs) {
        this.songIDs = songIDs;
    }

    /**
     * Position (0 based) from the given IDs list in the constructor, which tells the song to play.
     */
    play(songPosition: number) {
        if (this.currentSong !== songPosition) {
            this.stop(false);
        }

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

        // keep raising the volume
        this.playIntervalID = this.startInterval(music, 0, volume, () => {
            music.volume = volume;
        });
    }

    next() {
        let nextPosition = this.currentSong + 1;

        if (nextPosition >= this.songIDs.length) {
            nextPosition = 0;
        }

        this.play(nextPosition);
    }

    stop(immediately = true) {
        if (!this.isPlaying) {
            return;
        }

        // stop any previous interval that might be running
        window.clearInterval(this.playIntervalID);
        window.clearInterval(this.stopIntervalID);

        const music = document.getElementById(
            this.songIDs[this.currentSong]
        ) as HTMLAudioElement;

        this.isPlaying = false;

        if (immediately) {
            music.pause();
        } else {
            this.stopIntervalID = this.startInterval(
                music,
                music.volume,
                0,
                () => {
                    music.pause();
                }
            );
        }
    }

    /**
     * Update the volume from the start value to the end.
     */
    private startInterval(
        element: HTMLAudioElement,
        startVolume: number,
        endVolume: number,
        onEnd: () => void
    ) {
        let count = 0;
        const ticks = 5; // number of updates to the volume
        const duration = 1000;
        const delta = duration / ticks;
        const changeEachTick = (endVolume - startVolume) / ticks;

        const interval = window.setInterval(() => {
            let newVolume = element.volume + changeEachTick;
            if (newVolume < 0) {
                newVolume = 0;
            } else if (newVolume > 1) {
                newVolume = 1;
            }

            element.volume = newVolume;
            count += delta;

            if (count >= duration) {
                window.clearInterval(interval);
                onEnd();
            }
        }, delta);

        return interval;
    }
}
