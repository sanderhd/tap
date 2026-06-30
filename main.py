import webview
import threading
from pynput import keyboard
import webbrowser
import json
import os
import sys

from clicker import start, stop

hotkey = keyboard.Key.f6
listener = None

current_cps = 10
current_button = "left"
running_hotkey = False

def resouce_path(relative_path):
    """Works in dev and PyInstaller --onefile build"""
    base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))
    return os.path.join(base_path, relative_path)

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

    def set_cps(self, cps):
        global current_cps
        
        current_cps = int(cps)

    def minimize(self):
        webview.windows[0].minimize()
    
    def close(self):
        webview.windows[0].destroy()

    def get_status(self):
        return running_hotkey

    def get_version(self):
        try:
            with open(resouce_path("ui/version.json"), "r") as f:
                return json.load(f)["version"]
        except Exception:
            return "dev"
        
    def open_url(self, url):
        webbrowser.open(url)

api = Api()
start_hotkey_listener()

webview.create_window(
    "Tap",
    "ui/index.html",
    js_api=api,
    width=500,
    height=600,
    resizable=False,
    frameless=True
)

webview.start(debug=True)