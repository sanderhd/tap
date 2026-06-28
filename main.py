import webview
from clicker import start, stop

class Api:
    def start_clicker(self, cps, button):
        start(int(cps), button)

    def stop_clicker(self):
        stop()

api = Api()

webview.create_window(
    'Tap', 
    'ui/index.html',
    js_api=api,
    width=500,
    height=600,
    resizable=False
)

webview.start()