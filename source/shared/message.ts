import { centerElement } from "./utilities";

const ALL_MESSAGES: Message[] = [];

export type MessageArgs = {
    text: string;
    x?: number;
    y?: number;
    centerWindow?: boolean; // if x/y isn't provided, specify whether to center in the middle of the canvas or the window (default is canvas)
    cssClass?: string; // adds a css class to the html element
    timeOut?: number; // the message is removed after this time (in milliseconds) has passed (otherwise it has to be removed manually)
    onTimeout?: () => void; // to be called when timeout ends
};

export default class Message {
    private message: HTMLElement;
    private timeoutID?: number;

    constructor({
        x,
        y,
        text,
        centerWindow,
        cssClass,
        timeOut,
        onTimeout,
    }: MessageArgs) {
        const container = document.getElementById("Message-container")!;
        const message = document.createElement("div");

        message.className = "Message";
        message.innerHTML = text;

        container.appendChild(message);

        if (typeof x === "undefined") {
            if (centerWindow === true) {
                centerElement(message, document.body);
            } else {
                centerElement(message);
            }
        } else {
            message.style.left = x + "px";
            message.style.top = y + "px";
        }

        if (typeof cssClass != "undefined") {
            message.classList.add(cssClass);
        }

        if (typeof timeOut !== "undefined") {
            this.timeoutID = window.setTimeout(() => {
                this.remove();

                if (onTimeout) {
                    onTimeout();
                }
            }, timeOut);
        }

        this.message = message;

        ALL_MESSAGES.push(this);
    }

    setText(text: string) {
        this.message.innerHTML = text;
    }

    remove(removeFromAll = true) {
        window.clearTimeout(this.timeoutID);
        this.timeoutID = undefined;

        const container = this.message.parentElement;
        container?.removeChild(this.message);

        if (removeFromAll) {
            const position = ALL_MESSAGES.indexOf(this);
            ALL_MESSAGES.splice(position, 1);
        }
    }

    static removeAll() {
        ALL_MESSAGES.forEach((message) => message.remove(false));
        ALL_MESSAGES.length = 0;
    }
}
