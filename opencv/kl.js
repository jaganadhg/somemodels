<!DOCTYPE html>
<html>
<head>
    <script async src="https://docs.opencv.org/master/opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>
</head>
<body>
    <input type="file" id="imageUpload" />
    <canvas id="canvas"></canvas>

    <script type="text/javascript">
    function onOpenCvReady() {
        document.getElementById('imageUpload').onchange = function(e) {
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[0]);
            img.onload = function() {
                let canvas = document.getElementById('canvas');
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);
                let src = cv.imread(canvas);
                let gray = new cv.Mat();
                let edges = new cv.Mat();
                let contours = new cv.MatVector();
                let hierarchy = new cv.Mat();
                // Convert to grayscale
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
                // Apply Canny edge detection
                cv.Canny(gray, edges, 50, 100, 3, false);
                // Find contours
                cv.findContours(edges, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                // Initialize min and max coordinates for the final bounding box
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                // Update min and max coordinates for each contour
                for (let i = 0; i < contours.size(); ++i) {
                    let cnt = contours.get(i);
                    let rect = cv.boundingRect(cnt);
                    minX = Math.min(minX, rect.x);
                    minY = Math.min(minY, rect.y);
                    maxX = Math.max(maxX, rect.x + rect.width);
                    maxY = Math.max(maxY, rect.y + rect.height);
                }
                console.log(contours);
                // Draw the final bounding box
                let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
                //cv.rectangle(src, {x: minX, y: minY, width: maxX - minX, height: maxY - minY}, color, 2);
                let rect = [minX, minY, maxX - minX, maxY - minY];
                console.log(rect);
                cv.rectangle(src, new cv.Point(minX, minY), new cv.Point(maxX - minX, maxY - minY ), color, 2);
                /*
                cv.rectangle(img, new cv.Point(w / 8, h / 8), new cv.Point(w - w / 8, h - h / 8), s, 5);
                cv.rectangle(img, new cv.Point(w / 5, h / 5), new cv.Point(w - w / 5, h - h / 5), s128, 3);
                */
                cv.imshow('canvas', src);

                let dataUrl = canvas.toDataURL();
                let link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'image.png';
                link.click();
                // console.log(link);
                src.delete(); gray.delete(); edges.delete(); contours.delete(); hierarchy.delete();
            };
        };
    }
    </script>
</body>
</html>
