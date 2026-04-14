radio.setGroup(7)

roversaPet.setUltrasonicPins(DigitalPin.P13, DigitalPin.P14)
roversaPet.setStopDistance(15)
roversaPet.setCautionDistance(25)
roversaPet.setPetStats(70, 20, 80)

radio.onReceivedString(function (receivedString: string) {
    if (receivedString == "pet") {
        roversaPet.petRobot()
        roversaPet.updateFace()
        Roversa.stop()
        basic.pause(500)
    } else if (receivedString == "wave") {
        roversaPet.calmRobot()
        roversaPet.updateFace()
    }
})

basic.forever(function () {
    roversaPet.updatePetState()
    roversaPet.updateFace()

    if (roversaPet.dangerDetected()) {
        Roversa.stop()
    } else {
        Roversa.driveForward()
    }

    basic.pause(500)
})
