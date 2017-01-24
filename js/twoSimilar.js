
	var data=Request();
	var countBoxX = data.width;
	var countBoxY = data.height;
	var container = document.getElementById("container");	
	var pictures = document.getElementsByClassName("picture");		
	var content = [];
	var links = [];
 	var objPictures = {};

 	//send request and get count of cells
 	function Request() {
		var xhr = new XMLHttpRequest();
	
		xhr.open('GET', 'https://kde.link/test/get_field_size.php', false);	
		xhr.setRequestHeader('Content-Type', 'text/plain');
		xhr.send();
		
		if (xhr.status != 200) {
		  alert('Sorry, application error!');
		  console.log(xhr.status + ': ' + xhr.statusText);
		} else {  
			var data = JSON.parse(xhr.responseText); 
		}
		limitBox(data);
		return data;
	}

	//limits for count of cells
	function limitBox(data) {					
		if((data.width * data.height % 2 !==0) && (data.width>8 || data.height>8)) {
			
			var error="The count of cells is not complies some of rules\\rule:\n 1. The count of rows or columns is more then 8.\n 2.The sum of whole cells is odd numeric.";
				alert(error);				
   				throw new Error(error);
			}
	}

	//get links for pics
	var getLink = (function() {
			var ex=[];
			return function() {
				
				var rex=getRandomInt(0,9,ex);
				if(ex.length!==10) {
					ex.push(rex);
				}
				else {
					ex=[];
					rex=getRandomInt(0,9,ex);
					ex.push(rex);
				}			
				var link="https://kde.link/test/"+rex+".png";
				return link;
			}
		}());

	//get random value with exception
	function getRandomInt(min, max, exp) {
	    var n, exp = Array.isArray(exp) ? exp : [(isNaN(exp) ? min-1 : exp)];
	    while(true) {
	    	if(exp.length-1===max)
	    		return false;
	        n = Math.floor(Math.random() * (max - min + 1)) + min;
	        if(exp.indexOf(n) < 0) return n;
	    }
	}

	//set value for each div
	(function createPictures() {
	
		for(var i = 0; i < countBoxY * countBoxX; i++)	{
		
			var pic = document.createElement('div');
			pic.className = "picture";
			pic.id = i;
			
			content[i] = pic;			
			container.appendChild(pic);
		
			if((i + 1) !== 0 && (i + 1) % countBoxX === 0) {
				pic.style.marginRight="0px";
				container.appendChild(document.createElement('br'));		
			}
		}
		var picVal=getComputedStyle(pictures[0]);
		container.style.width=(parseInt(picVal.width,10)+parseInt(picVal.marginRight,10))*countBoxX-4+"px";
		container.style.height=(parseInt(picVal.height,10)+4)*countBoxY-4+"px";
	})();
	
	//add double pictures to items
	(function setRandomPics() {				
		var arrChecked = [];

		for(var i = 0; i < pictures.length / 2; i++) {
		
			var q = getRandomInt(0, pictures.length - 1, arrChecked);
			
			links[q] = "url('" + getLink() + "')";
			arrChecked.push(q);

			var m=getRandomInt(0,pictures.length-1,arrChecked);
			links[m]=links[q];
			arrChecked.push(m);		
		}
		
		return links;
	})();

	//click to div container
	 container.onclick = function(event) {
	 
	    var el = event ? event.target : window.event.srcElement;
	 	var dublicates = document.getElementsByClassName("downloadPic");
		while (el !== this) {
		
			if (el.className == "picture") {		         
				el.className = "downloadPic";
				el.style.backgroundImage = links[el.id];
				el.style.backgroundSize = "cover";
				break;
			}
			else if(el.className == "downloadPic") {
				el.className = "picture";
				el.style.background = "black";
				break;
			}
			else if(el.className=="found") {
				break;
			}
	  
			el = el.parentNode;
		}	  			
		if(dublicates.length ===2 && dublicates[0].style.backgroundImage===dublicates[1].style.backgroundImage) {
			
			findDublicate(dublicates);

		}
		if(dublicates.length > 2) {			
			setDefaultState(dublicates);		
		}			
	};

	//processing of dublicate
	function findDublicate(dublicates) {	
		
			dublicates[0].style.background="gray";			
			dublicates[0].className="found";
			dublicates[0].style.background="gray";
			dublicates[0].className="found";
		
			if(document.getElementsByClassName("found").length==content.length) {
				alert("You win!!!");
				location.reload();
			}		
	}

	//return default value
	function setDefaultState(pictures) {
		while (pictures[0]) {		
			pictures[0].style.backgroundImage = "";
			pictures[0].style.background = "black";
			pictures[0].className = "picture";
		}					
	}	