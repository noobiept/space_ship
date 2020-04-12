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

        $(message).html(text);
        container.appendChild(message);

        if (typeof x === "undefined") {
            if (centerWindow === true) {
                centerElement(message, document.body);
            } else {
                centerElement(message);
            }
        } else {
            $(message).css("left", x + "px");
            $(message).css("top", y + "px");
        }

        if (typeof cssClass != "undefined") {
            $(message).addClass(cssClass);
        }

        if (typeof timeOut !== "undefined") {
            window.setTimeout(() => {
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
        $(this.message).html(text);
    }

    remove() {
        $(this.message).remove();

        var position = ALL_MESSAGES.indexOf(this);

        ALL_MESSAGES.splice(position, 1);
    }

    static removeAll() {
        for (var i = 0; i < ALL_MESSAGES.length; i++) {
            ALL_MESSAGES[i].remove();

            i--;
        }
    }
}
