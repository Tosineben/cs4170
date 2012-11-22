
function rotate(imgObj, right) {
    imgObj.pixastic("rotate", {
        angle: right ? 90 : -90
    });
}

function invert(imgObj) {
    imgObj.pixastic("invert");
}
