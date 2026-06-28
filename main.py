import tkinter as tk
from clicker import start, stop

root = tk.Tk()
root.title("Tap - The next gen AutoClicker")
root.geometry("400x380")
root.resizable(False, False)

tk.Label(root, text="Clicks per second").pack(pady=10)

cps = tk.IntVar(value=10)
side = tk.StringVar(value="left")

tk.Entry(root, textvariable=cps, justify="center").pack()

status = tk.Label(root, text="Stopped", fg="red")
status.pack(pady=10)

def start_clicker():
    start(cps.get(), side.get())
    status.config(text="Runnig", fg="green")

def stop_clicker():
    stop()
    status.config(text="Stopped", fg="red")

tk.Radiobutton(root, text="Left", variable=side, value="left").pack(fill="x", padx=30)
tk.Radiobutton(root, text="Right", variable=side, value="right").pack(fill="x", padx=30)

tk.Button(root, text="Start", command=start_clicker).pack(fill="x", padx=30)
tk.Button(root, text="Stop", command=stop_clicker).pack(fill="x", padx=30, pady=5)

root.mainloop()