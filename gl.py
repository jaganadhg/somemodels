import gradio as gr
import cv2
import numpy as np

def detect_contours(image, box):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # If a box is provided, crop the image to that region
    if box is not None:
        start_x, start_y, end_x, end_y = box
        gray = gray[start_y:end_y, start_x:end_x]

    # Find the contours
    contours, _ = cv2.findContours(gray, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # Draw the contours
    for cntr in contours:
        x, y, w, h = cv2.boundingRect(cntr)
        # If a box is provided, adjust the coordinates accordingly
        if box is not None:
            x += start_x
            y += start_y
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    return image

iface = gr.Interface(fn=detect_contours, inputs=["image", "bbox"], outputs="image")
iface.launch()
