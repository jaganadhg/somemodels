import streamlit as st
from streamlit_drawable_canvas import st_canvas
import cv2
import numpy as np

# Set the title of the app
st.title("Real-time Contour Detection")

# Allow the user to upload an image
uploaded_file = st.file_uploader("Choose an image...", type=["png", "jpg"])

if uploaded_file is not None:
    # Convert the file to an image
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, 1)

    # Create a canvas with the same size as the image
    canvas_result = st_canvas(
        fill_color="rgba(255, 165, 0, 0.3)",  # Fixed fill color with some opacity
        stroke_width=3,
        stroke_color='#e00',
        background_image=img,
        update_streamlit=True,
        height=img.shape[0],
        width=img.shape[1],
        drawing_mode='rect',
        key="canvas",
    )

    # If a rectangle is drawn on the canvas
    if canvas_result.json_data is not None:
        # Get the coordinates of the rectangle
        x1 = canvas_result.json_data["objects"][0]["left"]
        y1 = canvas_result.json_data["objects"][0]["top"]
        x2 = x1 + canvas_result.json_data["objects"][0]["width"]
        y2 = y1 + canvas_result.json_data["objects"][0]["height"]

        # Crop the image
        cropped_img = img[int(y1):int(y2), int(x1):int(x2)]

        # Convert the image to grayscale
        gray = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2GRAY)

        # Find the contours
        contours, _ = cv2.findContours(gray, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        # Draw the contours
        cv2.drawContours(cropped_img, contours, -1, (0, 255, 0), 3)

        # Display the image with the contours
        st.image(cropped_img, caption='Cropped Image with Contours', use_column_width=True)
