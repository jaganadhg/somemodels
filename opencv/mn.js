const cv = require('opencv4nodejs');
const fs = require('fs');
const path = require('path');

function processImage(imagePath) {
    let src = cv.imread(imagePath);
    let gray = src.cvtColor(cv.COLOR_RGBA2GRAY);
    let edges = gray.canny(50, 100, 3, false);
    let contours = edges.findContours(cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < contours.length; ++i) {
        let rect = contours[i].boundingRect();
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
    }

    let color = new cv.Vec(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
    src.drawRectangle(new cv.Point2(minX, minY), new cv.Point2(maxX, maxY), color, 2);

    cv.imwrite('output.png', src);
}

processImage('input.png');
