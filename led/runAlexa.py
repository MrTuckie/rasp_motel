from sinric import SinricPro
from credentials import appKey, fita_led, secretKey, deviceIdArr
from sinric import SinricProUdp
import time
from rpi_ws281x import *
import threading

# LED strip configuration:
LED_COUNT      = 48      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 10     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
STATE          = 1


def action() :
    print('BEAT!')
    
class setInterval :
    def __init__(self,interval,action) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
        while not self.stopEvent.wait(nextTime-time.time()) :
            nextTime+=self.interval
            self.action()

    def cancel(self) :
        self.stopEvent.set()    

# Define functions which animate LEDs in various ways.
def colorWipe(strip, color, wait_ms=50):
    """Wipe color across display a pixel at a time."""
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms/1000.0)

def Events():
    while True:
    #    client.event_handler.raiseEvent(lightId, 'setPowerState',data={'state': 'On'})
    # client.event_handler.raiseEvent(deviceId1, 'setColor',data={'r': 0,'g': 0,'b': 0})
    # client.event_handler.raiseEvent(deviceId1, 'setColorTemperature',data={'colorTemperature': 2400})
        pass

eventCallbacks = {
    'Events': Events
}

def onPowerState(did, state):
    # Alexa, turn ON/OFF Device
    if(state == "On") :
        colorWipe(strip, Color(255, 0, 0))
    else:
        colorWipe(strip, Color(0,0,0), 10)
    print(did, state)
    return True, state

def onSetColor(did, r, g, b):
    # Alexa set device color to Red/Green
    print(did, 'Red: ', r, 'Green: ', g, 'Blue : ', b)
    colorWipe(strip, Color(r, b, g))
    return True

def onSetBrightness(did, state):
    # Alexa set device brightness to 40%
    print(did, 'BrightnessLevel : ', state)
    brilho = round((state/100)*255)
    strip.setBrightness(brilho)
    strip.show()
    return True, state

callbacks = {
    'powerState': onPowerState,
    'setBrightness': onSetBrightness,
    #'adjustBrightness': onAdjustBrightness,
    'setColor': onSetColor,
    #'setColorTemperature': onSetColorTemperature,
    #'increaseColorTemperature': onIncreaseColorTemperature,
    #'decreaseColorTemperature': onDecreaseColorTemperature
}

if __name__ == '__main__':
    
    # start action every 5s
    inter=setInterval(5,action)
    
     # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    # Intialize the library (must be called once before other functions).
    strip.begin()

    client = SinricPro(appKey, deviceIdArr, callbacks,event_callbacks=eventCallbacks, enable_log=False,restore_states=True,secretKey=secretKey)
    udp_client = SinricProUdp(callbacks,deviceIdArr,enable_trace=False)  # Set it to True to start logging request Offline Request/Response
    client.handle_all(udp_client)
    
