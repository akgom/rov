/**
 * Roversa Companion Extension
 * Adds face + gesture + barrier logic on top of built-in Roversa blocks.
 */
//% color="#00A6ED" icon="\uf118" block="Roversa Companion"
namespace roversaCompanion {
    let blocked = false
    let reactionUntil = 0
    let currentReaction = "default"

    export enum Face {
        //% block="default"
        Default = 0,
        //% block="pet"
        Pet = 1,
        //% block="wave"
        Wave = 2,
        //% block="blocked"
        Blocked = 3
    }

    //% block="handle radio message %msg"
    //% group="Radio"
    export function handleRadioMessage(msg: string): void {
        if (msg == "danger") {
            blocked = true
            currentReaction = "blocked"
            return
        }

        if (msg == "clear") {
            blocked = false

            // go back to any active timed reaction, otherwise default
            if (reactionUntil > input.runningTime()) {
                // keep current pet/wave reaction
            } else {
                currentReaction = "default"
            }
            return
        }

        if (msg == "pet") {
            currentReaction = "pet"
            reactionUntil = input.runningTime() + 5000
            return
        }

        if (msg == "wave") {
            currentReaction = "wave"
            reactionUntil = input.runningTime() + 5000
            return
        }
    }

    //% block="update reactions"
    //% group="Face"
    export function updateReactions(): void {
        if (blocked) {
            currentReaction = "blocked"
            return
        }

        if (reactionUntil > 0 && input.runningTime() >= reactionUntil) {
            currentReaction = "default"
            reactionUntil = 0
        }
    }

    //% block="barrier detected"
    //% group="Sensor"
    export function barrierDetected(): boolean {
        return blocked
    }

    //% block="movement allowed"
    //% group="Sensor"
    export function movementAllowed(): boolean {
        return !blocked
    }

    //% block="show current face"
    //% group="Face"
    export function showCurrentFace(): void {
        if (currentReaction == "pet") {
            basic.showIcon(IconNames.Heart)
        } else if (currentReaction == "wave") {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . . . .
                # . . . #
                . # # # .
            `)
        } else if (currentReaction == "blocked") {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . . . .
                . # # # .
                # . . . #
            `)
        } else {
            basic.showIcon(IconNames.Happy)
        }
    }

    //% block="force default face"
    //% group="Face"
    export function resetToDefault(): void {
        if (!blocked) {
            currentReaction = "default"
            reactionUntil = 0
        }
    }

    //% block="current face is %face"
    //% group="Face"
    export function currentFaceIs(face: Face): boolean {
        if (face == Face.Default) {
            return currentReaction == "default"
        } else if (face == Face.Pet) {
            return currentReaction == "pet"
        } else if (face == Face.Wave) {
            return currentReaction == "wave"
        } else {
            return currentReaction == "blocked"
        }
    }
}
