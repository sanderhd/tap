import threading
import time
from pynput.mouse import Controller, Button

mouse = Controller()

running = False
current_cps = 10
current_button = "left"

def click_loop(cps, button):
    global running

    delay = 1 / max(cps, 1)

    if button == "left":
        btn = Button.left
    else:
        btn = Button.right

    while running:
        mouse.click(btn)
        time.sleep(delay)

def start(cps, button):
    global running, current_cps, current_button

    if running:
        stop()
        time.sleep(0.05)

    current_cps = cps
    current_button = button

    running = True

    threading.Thread(
        target=click_loop,
        args=(cps, button),
        daemon=True
    ).start()

def stop():
    global running
    running = False