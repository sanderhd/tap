import threading
import time
from pynput.mouse import Controller, Button

mouse = Controller()

running = False

def click_loop(cps, button):
    global running

    delay = 1 / cps

    if button == "left":
        btn = Button.left
    else:
        btn = Button.right

    while running:
        mouse.click(btn)
        time.sleep(delay)

def start(cps, button):
    global running

    if running:
        return
    
    running = True
    threading.Thread(target=click_loop, args=(cps, button), daemon=True).start()

def stop():
    global running
    running = False