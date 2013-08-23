/* 
 * Author: marcelo rodrigues costa 
 * Date: Aug 2013 
 */ 
$(function() { 

	//load post its
	$.getJSON('/mykanban/controller.jjsp?action=read', function(data) {
		var items = [];
		$.each(data, function(key, val) {
			//alert(JSON.stringify(data));
			//alert(JSON.stringify(data.postits));

			for(var i=0;i<data.postits.length;i++) {
			    alert(JSON.stringify(data.postits[i]));    
			    alert(data.postits[0].postit.task);
			    alert(data.postits[0]._id);
			}
			
			
			
			//items.push('<li id="' + key + '">' + val + '</li>');
			addpostit(data._id,data.postit[0].task,data.postit[0].posX,data.postit[0].posY);
		    });
		$('<ul/>', {
			'class': 'my-new-list',
			    html: items.join('')
			    }).appendTo('body');
	    });

        
        $('#remove-icon').css({"opacity": "0"}); 
        
        $("#addPostIt").click(function(event) { 
		event.preventDefault(); // cancel default behavior 
		addpostit(0,'Drag me around',8,8); 
	    }); 
        
        var n = 0;
        
        function addpostit(_id, task, posX, posY) { 
	    //if it's not a postit that was loaded from the db, keep incrementing n
	    if(_id!=0) {
		n = _id;
	    } else {
		n += 1;
	    }
            
	    var htmlDraggable = "" +
		"<div id=\"draggable"+ n +"\" class=\"draggable ui-widget-content\"> \
		     <img id=\"remove-icon"+ n +"\" class=\"remove-icon\" src=\"/mykanban/assets/img/remove-icon.jpg\" border=\"0\" /> \
		     <p id=\"edit_area"+ n +"\" class=\"edit_area\">"+task +"</p> \
                   </div>";

	    $('#container').append(htmlDraggable);
                
	    $('#remove-icon' + n).css({"opacity": "0"}).click(function(event) { 
		    confirmDialog($(this).parent()); 
                }); 
            
	    $('#draggable' + n).position().left = posX;
	    $('#draggable' + n).position().top = posY;
	    setHover($('#draggable' + n)); 
	    setDraggable($('#draggable' + n)); 
	    setEditable($('#edit_area' +n));                 
        } 
        
        function setDraggable(element) { 
	    element.draggable({ 
		    containment : "#container", 
                        scroll : false 
			}); 
        } 
        function setEditable(element) { 
	    element.editable(function(value, settings) {

		    updatepostit(element, value);

		    return(value); 
		},{ 
		    type      : 'textarea', 
			cancel    : 'Cancel', 
			submit    : 'OK', 
			indicator : '<img src="/mykanban/assets/img/indicator.gif">', 
			tooltip   : 'Click to edit...' 
			});         
        } 
        function setHover(element) { 
	    element.hover(function() { 
		    $(this).find("img").stop().animate({'opacity':'1'},100); 
                },function() { 
		    $(this).find("img").stop().animate({"opacity": "0"});                                         
                }); 
        } 
        
        function confirmDialog(postit) { 
	    $('<div></div>').appendTo('body') 
		.html('<div><h6>Yes or No?</h6></div>') 
		.dialog({ 
			modal: true, title: 'message', zIndex: 10000, autoOpen: true, 
			    width: 'auto', resizable: false, 
			    buttons: { 
			    Yes: function () { 
				removepostit(postit); 
				$(this).dialog("close"); 
			    }, 
				No: function () {                                                 
				$(this).dialog("close"); 
			    } 
			}, 
			    close: function (event, ui) { 
			    $(this).remove(); 
			} 
		    }); 
        } 
        
        function removepostit(element) { 
	    element.remove(); 
        }

	function updatepostit(element, value) {

	    var draggable = element.parent();

	    var postit = [{ "_id": draggable.attr('id').substr(10),
			    "task": value, 
			    "posX": draggable.position().left,
			    "posY": draggable.position().top}];

		    $.ajax({
			    type: "POST",
				url: "/mykanban/controller.jjsp",
				// The key needs to match your method's input parameter (case-sensitive).
				data: JSON.stringify({ postit: postit }),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data){alert(data);},
				failure: function(errMsg) {
				alert(errMsg);
			    }
			});
	}
    }); 