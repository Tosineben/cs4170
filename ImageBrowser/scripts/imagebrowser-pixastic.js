
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

$('#test').pixastic("crop", {
    rect: {
        left: 0,
        top: 0,
        width: Math.min($("#test").height(), $("#test").width()),
        height: Math.min($("#test").height(), $("#test").width())
    }
})