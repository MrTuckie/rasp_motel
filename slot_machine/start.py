import Mock.GPIO as GPIO
import time
import pyautogui

# Variavel de controle
nada = 0

button_alavanca = 21
button_beergirls = 16

GPIO.setmode(GPIO.BCM)
GPIO.setup(button_alavanca,GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(button_beergirls,GPIO.IN,pull_up_down=GPIO.PUD_UP)
pyautogui.FAILSAFE = False

while True:
    if (GPIO.input(button_alavanca)) or (nada == 1):
        nada = 0
    else:
        print("Alavanca button pressed")
        pyautogui.press("enter")
        nada = 1
        time.sleep(9)
