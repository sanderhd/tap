import webview
import threading
from pynput import keyboard

from clicker import start, stop

hotkey = keyboard.Key.f6
listener = None

current_cps = 10
current_button = "left"
running_hotkey = False

def toggle_clicker():
    global running_hotkey

    if running_hotkey:
        stop()
        running_hotkey = False
    else:
        start(current_cps, current_button)
        running_hotkey = True

def on_press(key):
    try:
        if key == hotkey:
            toggle_clicker()
    except:
        pass

def start_hotkey_listener():
    global listener
    listener = keyboard.Listener(on_press=on_press)
    listener.daemon = True
    listener.start()

def parse_key(key_str):
    try:
        if key_str.startswith("f") and key_str[1:].isdigit():
            return getattr(keyboard.Key, key_str)
    except:
        pass

    return keyboard.KeyCode.from_char(key_str)
class Api:
    def start_clicker(self, cps, button):
        global current_cps, current_button, running_hotkey

        current_cps = int(cps)
        current_button = button

        start(current_cps, current_button)
        running_hotkey = True

    def stop_clicker(self):
        global running_hotkey

        stop()
        running_hotkey = False

    def set_hotkey(self, key):
        global hotkey

        hotkey = parse_key(key)
        print(f"[hotkey] set to {key}")

api = Api()
start_hotkey_listener()

webview.create_window(
    "Tap",
    "ui/index.html",
    js_api=api,
    width=500,
    height=600,
    resizable=False
)

webview.start()