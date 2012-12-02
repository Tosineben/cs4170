
function getCanvasRect(canvas) {
    var w = canvas.width;
    var h = canvas.height;

    var cx = canvas.offsetLeft;
    var cy = canvas.offsetTop;
    while (canvas.offsetParent != null) {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
    }
    return {x: cx, y: cy, width: w, height: h};
}

function enableDragSelect(enable) {
    document.onselectstart = function() { return enable; } 
    document.onmousedown = function() { return enable; }             
}        

function getScrollY() {
    return typeof(window.pageYOffset) != 'undefined' ? window.pageYOffset : 0;
}

function mouseDownEvent(x, y) {
    enableDragSelect(false);
    _isMouseDown = true;
    x -= _canvasRect.x;
    y -= _canvasRect.y - getScrollY();
    _points.length = 1;
    _points[0] = new Point(x, y);
}

function mouseMoveEvent(x, y) {
    if (_isMouseDown) {
        x -= _canvasRect.x;
        y -= _canvasRect.y - getScrollY();
        _points[_points.length] = new Point(x, y, 1); // always just 1 stroke

        // try to handle issue where gesture keeps recording if user goes outside canvas
        if (x <= 0 || x >= _canvasRect.width || y <= 0 || y >= _canvasRect.height) {
            mouseUpEvent();
        }

    }
}

// returns {"No match", 0} if it doesn't match anything
function mouseUpEvent(x, y) {
    enableDragSelect(true);
    if (_isMouseDown) {
        _isMouseDown = false;
        if (_currentImg == null) {
            displayAlert("Please select an image to enable editing and exploring with gestures.");
        }
        else if (_points.length >= 10) {
            var result = _dollar.Recognize(_points);
            result = handleOrientation(result);
            handleResult(result);
        } 
        else {
            displayAlert("Did you mean to draw a gesture? Please try to draw a complete gesture.");
        }
    }
}

function kickoffTutorial() {
	// get to top of page
    $("html, body").animate({ scrollTop: 0 }, "slow");

	// close any existing tutorial
	$('.popover-close').click();

	_isTutorialOpen = true;

    var tutorial = [
    {
        title:'Explore Images', 
        target:'#explore', 
        content:'Browse through your images and select one to start editing.',
        placement:'bottom'
    },
    {
        title:'Use Gestures to Edit', 
        target:'#gestures', 
        content:'Use these mouse gestures to edit images or continue exploring.',
        placement:'left'
    },
    {
        title:'Draw Gestures on Image',
        target:'#canvas-inner', 
        content:'Draw gestures here after selecting an image.',
        placement:'right'
    },
    {
        title:'Hide Gestures',
        target:'#hide-gestures', 
        content:'Once you are familiar with the gestures, you can hide them here.',
        placement:'left'
    },
    {
        title:'Help and Documentation',
        target:'#help-link', 
        content:'Questions? Click here for help and documentation.',
        placement:'bottom'
    }
    ];

    var number = 1;
    for (var i = 0; i < tutorial.length; i++) {
        var titleData = {number:i+1, title:tutorial[i].title, target:tutorial[i].target};
        var contentData = {content:tutorial[i].content};
        if (i < tutorial.length - 1) {
            contentData['nextTarget'] = tutorial[i+1].target;
            contentData['nextPlacement'] = tutorial[i+1].placement;
        }
        var title = $.Mustache.render('popover-title', titleData);
        var content = $.Mustache.render('popover-content', contentData);
        $(tutorial[i].target).popover({
            title:title, content:content, html:true, trigger:'manual', placement:tutorial[i].placement
        });
    }
	
	$(tutorial[0].target).popover('show');
}

function handleResult(result) {
    console.debug("Result: " + result.Name + " (" + result.Score + ").");
    if (result.Name == "No match" || result.Score == 0) {
        displayAlert("We didn't understand that gesture. Please try again, tracing carefully.");
        return;
    }
    
    $(".alert").alert('close');
    $('#gestures').find('img').css('border', '4px solid white');
    var gesture;

    if (result.Name == "line-left") {
        gesture = $('#gesture-left');
        moveLeft();
        _undoActions.push(moveRight);
    }
    else if (result.Name == "line-right") {
        gesture = $('#gesture-right').css('border', '4px solid blue');
        moveRight();
        _undoActions.push(moveLeft);
    }
    else if (result.Name == "P") {
       gesture = $('#gesture-posterize');
        addPosterize();
        _undoActions.push(removePosterize); 
    }
    else if (result.Name == "S") {
        gesture = $('#gesture-sepia');
        addSepia();
        _undoActions.push(removeSepia);
    }
    else if (result.Name == "rotate") {
        gesture = $('#gesture-rotate');
        rotateRight();
        _undoActions.push(rotateLeft);
    }
    else if (result.Name == "U") {
        gesture = $('#gesture-undo');
        var undoAction = _undoActions.pop();

        // either a set of functions with params, or a parameterless function
        if (undoAction != null) {
            if (undoAction.length > 0) {
                for (var i = 0; i < undoAction.length; i++) {
                    undoAction[i].action(undoAction[i].args);
                }
            }
            else {
                undoAction();                            
            }
        }
        else {
            displayAlert("There is nothing to undo.");
        }
    }

    // highlight gesture with blue border, fade out after 1 second
    gesture.css('border', '4px solid blue');
    setTimeout(function(){
        $({alpha:1}).animate({alpha:0}, {
            duration: 500,
            step: function(){
                gesture.css('border-color','rgba(0,0,255,'+this.alpha+')');
            }
        });
    }, 500);
}

function handleOrientation(result) {
    if (result.Name == "line") {
        var leftToRight = _points[_points.length - 1].X - _points[0].X > 0;
        if (leftToRight) {
            result.Name = "line-left";
        }
        else { 
            result.Name = "line-right";
        }
    }
    return result;
}

function moveCarouselToFrame(img) {
    var frame = img.parents('.item').data('frame');
    $('#myCarousel').carousel(frame);
}

function getDataToSave(jqObj) {
    return {
        src: jqObj.attr('src'),
        right: jqObj.attr('data-right'),
        left: jqObj.attr('data-left'),
        carousel: jqObj.attr('data-carousel')
    }
}

function addSavedData(jqObj, data) {
    jqObj.attr('src', data.src);
    jqObj.attr('data-right', data.right);
    jqObj.attr('data-left', data.left);
    jqObj.attr('data-carousel', data.carousel);
}

function doNewCanvas(src) {
    var newImg = new Image();
    newImg.onload = function() {
        newImg = applyEffects(newImg, src);
        fillCanvas(newImg);
    };
    newImg.src = src;
}

function applyEffects(img, src) {
    // sepia
    for (var i = 0; i < _sepiaByName[src]; i++) {
        img = Pixastic.process(img, "sepia");
    }
    // rotate
    if (_rotationByName[src] && _rotationByName[src] != 0) {
        img = Pixastic.process(img, "rotate", {angle:_rotationByName[src]});
    }
    // posterize
    if (_posterizeByName[src] && _posterizeByName[src] < 24) {
        img = Pixastic.process(img, "posterize", {levels:_posterizeByName[src]});
    }
    return img;
}

function moveLeft() {
    var left = $('img[data-right="#' + $(_currentImg).attr('id') + '"]');
    if (left.length == 0) {
        left = $('canvas[data-right="#' + $(_currentImg).attr('id') + '"]');
    }
    moveCarouselToFrame(left);
    left.delay(1000).click();
}

function moveRight() {
    var right = $($(_currentImg).data('right'));
    moveCarouselToFrame(right);
    right.delay(1000).click();
}

function addSepia() {
    var data = getDataToSave($(_currentImg));

    _sepiaByName[data.src] = (_sepiaByName[data.src] || 0) + 1;

    doNewCanvas(data.src);

    _currentImg = Pixastic.process(_currentImg, "sepia");
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function removeSepia() {
    var data = getDataToSave($(_currentImg));

    _sepiaByName[data.src] -= 1;

    doNewCanvas(data.src);
    var id = $(_currentImg).attr('id');
    Pixastic.revert(_currentImg);
    _currentImg = applyEffects($('#' + id)[0], data.src);
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function addPosterize() {
    var data = getDataToSave($(_currentImg));

    _posterizeByName[data.src] = (_posterizeByName[data.src] || 25) - 4;

    doNewCanvas(data.src);

    _currentImg = Pixastic.process(_currentImg, "posterize", {levels:_posterizeByName[data.src]});
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function removePosterize() {
    var data = getDataToSave($(_currentImg));

    _posterizeByName[data.src] += 4;

    doNewCanvas(data.src);
    var id = $(_currentImg).attr('id');
    Pixastic.revert(_currentImg);
    _currentImg = applyEffects($('#' + id)[0], data.src);
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function rotateRight() {
    var data = getDataToSave($(_currentImg));

    _rotationByName[data.src] = (_rotationByName[data.src] || 0) + 90;

    doNewCanvas(data.src);

    _currentImg = Pixastic.process(_currentImg, "rotate", {angle:90});
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function rotateLeft() {
    var data = getDataToSave($(_currentImg));

    _rotationByName[data.src] = _rotationByName[data.src] - 90;

    doNewCanvas(data.src);

    _currentImg = Pixastic.process(_currentImg, "rotate", {angle:-90});
    _currentImg.style.display = 'block';

    addSavedData($(_currentImg), data);
}

function thumbnailClick(img) {
    $('.thumbnail').css('border', '1px solid #DDD');
    $(img).parent().css('border', '1px solid blue');

    if (!_currentImg) {
        fillCanvas(img);
        $('#gestures-inner').css('opacity', '1');
        $('#canvas-inner').css('opacity', '1');
    }
    else {
        var src = $(img).attr('src');
        doNewCanvas(src);
    }

    _currentImg = img;
}

function fillCanvas(img) {
    _ctx.drawImage(img, 0, 0, _canvasRect.width, _canvasRect.height);
}

function displayAlert(msg, scroll) {
    if (_currentImg == null && _isTutorialOpen) {
        return;
    }
    $('#alertInner').mustache('alert', { message: msg, type: 'error' }, { method: 'html' });
    $('.alert').alert();
    
    if (scroll) {
        // scroll page so user can see error
        var top = $('#alertContainer').position().top - 20;
        $("html, body").animate({ scrollTop: top }, "slow");
    }
}

function addImageGestures() {
    for (var i = 0; i < _imageGestures.length; i++) {
        var gesture = _imageGestures[i];
        _dollar.AddGesture(gesture.name, gesture.ptArray);
    }
}

function setupTutorial() {
    $('.popover-close').live('click', function() {
        $($(this).data('target')).popover('destroy');
        _isTutorialOpen = false;
    });

    $('.popover-next').live('click', function() {
        var closePopover = $($(this).parents('.popover').find('.popover-close').data('target'));
        var showPopover = $($(this).data('target'));
        var oldOffset = closePopover.parent().find('.popover').offset().top;
        closePopover.popover('destroy');
        showPopover.popover('show');
        var scroll =  oldOffset > showPopover.parent().find('.popover').offset().top ? -100 : 100;
        $("html, body").animate({ scrollTop: $(document).scrollTop() + scroll }, "slow");
    });

    $('.popover-done').live('click', function() {
        var close = $(this).parents('.popover').find('.popover-close');
        $(close.data('target')).popover('destroy');
        $("html, body").animate({ scrollTop: 0 }, "slow");
        _isTutorialOpen = false;
    });

    kickoffTutorial();
}

function initializeCanvas() {
    var canvas = $('#myCanvas')[0];
    _ctx = canvas.getContext('2d');
    _ctx.fillStyle = "rgb(0,0,225)";
    _ctx.strokeStyle = "rgb(0,0,225)";
    _ctx.lineWidth = 3;
    _ctx.font = "16px Gentilis";
    _canvasRect = getCanvasRect(canvas);
    return canvas;
}

