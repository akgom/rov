/**
 * Roversa Companion Extension
 * Adds sensor + reaction helpers on top of the built-in Roversa blocks.
 */
//% color="#00A6ED" icon="\uf118" block="Roversa Companion"
namespace roversaCompanion {
    let trig = DigitalPin.P8
    let echo = DigitalPin.P5
    let stopDistance = 20
    let nearDistance = 30

    export enum PetFace {
        //% block="blank"
        Blank = 0,
        //% block="happy"
        Happy = 1,
        //% block="heart"
        Heart = 2,
        //% block="angry"
        Angry = 3
    }

    function measuredDistance(): number {
        pins.digitalWritePin(trig, 0)
        control.waitMicros(2)

        pins.digitalWritePin(trig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig, 0)

        let duration = pins.pulseIn(echo, PulseValue.High, 30000)

        if (duration <= 0) {
            return 500
        }

        return Math.idiv(duration, 58)
    }

    //% block="set ultrasonic trig %trigPin echo %echoPin"
    //% group="Sensor"
    export function setUltrasonicPins(trigPin: DigitalPin, echoPin: DigitalPin): void {
        trig = trigPin
        echo = echoPin
        pins.setPull(echo, PinPullMode.PullNone)
    }

    //% block="set stop distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=20
    //% group="Sensor"
    export function setStopDistance(cm: number): void {
        stopDistance = cm
    }

    //% block="set near distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=30
    //% group="Sensor"
    export function setNearDistance(cm: number): void {
        nearDistance = cm
    }

    //% block="distance ahead (cm)"
    //% group="Sensor"
    export function distanceCm(): number {
        return measuredDistance()
    }

    //% block="danger detected"
    //% group="Sensor"
    export function dangerDetected(): boolean {
        return measuredDistance() <= stopDistance
    }

    //% block="something nearby"
    //% group="Sensor"
    export function somethingNearby(): boolean {
        let d = measuredDistance()
        return d > stopDistance && d <= nearDistance
    }

    //% block="show face %face"
    //% group="Face"
    export function showFace(face: PetFace): void {
        if (face == PetFace.Blank) {
            basic.clearScreen()
        } else if (face == PetFace.Happy) {
            basic.showIcon(IconNames.Happy)
        } else if (face == PetFace.Heart) {
            basic.showIcon(IconNames.Heart)
        } else {
            basic.showIcon(IconNames.Angry)
        }
    }

    //% block="handle radio message %msg"
    //% group="Radio"
    export function handleRadioMessage(msg: string): void {
        if (msg == "pet") {
            showFace(PetFace.Happy)
        } else if (msg == "wave") {
            showFace(PetFace.Heart)
        } else if (msg == "danger" || msg == "near") {
            showFace(PetFace.Angry)
        } else if (msg == "clear") {
            showFace(PetFace.Blank)
        }
    }
}
