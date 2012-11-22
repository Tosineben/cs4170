
function rotate(imgObj, right) {
    replaceCanvas(imgObj.pixastic("rotate", {
        angle: right ? 90 : -90
    }));
}

function invert(imgObj) {
    replaceCanvas(imgObj.pixastic("invert"));
}

function undo(imgObj) {
	replaceCanvas(imgObj.pixastic("revert"));
}

function sepia(imgObj) {
	replaceCanvas(imgObj.pixastic("revert"));
}

function invert2() {
	var img = new Image();
	img.onload = function() {
		Pixastic.process(img, "invert");
	}
	document.body.appendChild(img);
	img.src = "myimage.jpg";
}

function replaceCanvas(pixasticResult) {
	_ctx.drawImage(pixasticResult[0], 0, 0);
}

function crop() {
	var canvas = $("#myCanvas");
	canvas.Jcrop({
	    onSelect: function (coords) {
	        canvas.pixastic("crop", {
	            rect: {
	                left: coords.x,
	                top: coords.y,
	                width: coords.w,
	                height: coords.h
	            }
	        });
	        this.release();
	        this.disable();
	    }
	});
}
