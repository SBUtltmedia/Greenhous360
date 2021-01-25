var startingRoom = "01 Atrium 1"
if(location.hash)
{
startingRoom=decodeURIComponent(location.hash.split("#")[1].replace(/\+/g," "));

}
console.log(startingRoom)
var sceneEl;
var rooms;
var points;
var cursorPosition;
$(function () {
    getData(0).then((data)=>{


	rooms=data;
getData(2007684424).then((data)=>{
points=data;

    loadSphere(startingRoom);
})




})

    sceneEl = document.querySelector('a-scene');
});


AFRAME.registerComponent('cursor-listener', {
    init: function () {
        var COLORS = ['red', 'green', 'blue'];
        this.el.addEventListener('click', function (evt) {
	

var cursor = document.querySelector('[cursor]');
var elToWatch = document.querySelector('[gameboard]')
var intersection = cursor.components.raycaster.getIntersection(elToWatch);
var intersectionPosition = intersection.point;
	console.log("click")
        });
    }
});

function getCursorPosition(){
var cursor = document.querySelector('[cursor]');
var intersectedEl = document.querySelector('a-sky');
//if (!cursor.components.intersectedEl) { return; }
var intersection = cursor.components.raycaster.getIntersection(intersectedEl);
var intersectionPosition = intersection.point;
return `${intersectionPosition.x} ${intersectionPosition.y} ${intersectionPosition.z}`

}

function leftPad(num) {
    return ("0" + num).slice(-2)
}

function loadSphere(room) {
    var infoimage=false;
	window.location.hash = `#${room.replace(/ /g,"+")}`;
	var roomData=rooms.find((item)=>item.area==room)
	var pointsData=points.filter(item=>item.area==room)
	console.log(roomData,room);
	console.log(pointsData);
        $('.marker').remove();
        $('.preview').remove();
        $("#sky1").attr("src",`img/${roomData.image}`);

        /*data.spheres.forEach(function (val, index, array) {
            (new Image()).src = "img/" + val.leftImg;
            (new Image()).src = "img/" + val.rightImg
        });
*/
        pointsData.forEach(function (val) {
            makeMarker(val);
        });

        $(".marker").on("click", function (evt) {
            if ($(evt.target).data("type") == "scene") {
            loadSphere($(evt.target).data("label")); 
	    }
        });


        $(".marker").on("fusing", function (evt) {
        var target=$(evt.target)
        var type = target.data("type")
    var direction="";
    
	if(target.data("type") == "scene"){
	direction=`(${target.data("direction")})`;	
}
	$("#textHolder")[0].setAttribute("text", {value: `${target.data("label")} ${direction}` ,color:"red",align:"center"}) // + "; align: center; color: red");
            var smartText = sceneEl.querySelector('#smartText');
            smartText.emit('textShow')

            if(type=="info") {
            $( "#slideWindow" ).append("<a-image id='slide' height='4' width='6' position = '3.3 0 -3'visible='true' src='img/ppt/"+  target.data("label").replace(/ /g,"_") + ".png'></a-image>" );
            }
            infoimage=true
            // $("#smartText").animate({"scale","1 1 1")
        });

        //$('#cursor').on('mouseleave', mouseleave);


        var cursor = sceneEl.querySelector('#cursor');
        cursor.addEventListener('mouseleave', mouseleave);

        function mouseleave(event) {
            //$("#smartText").attr("text", "");
            // $("#smartText").attr("scale","0 0 0")
            var smartText = sceneEl.querySelector('#smartText');
            smartText.emit('textHide')
            if(infoimage) {
               
                $('#slide').remove()
                infoimage=false
            }


        }



        function makeMarker(mkr) {

            var spin = Math.atan2(mkr.x, mkr.y) * (180 / Math.PI) + 180;
            var marker = document.createElement('a-sphere');
	    [x,y,z]= mkr.position.split(" ");
            console.log(x,y,z)
		marker.setAttribute('position', {
                x: x,
                y: y,
                z: z
            });
            //        marker.setAttribute('rotation', {
            //          x: 10,
            //        y:spin,
            //        z:10
            //        });
            for (var key in mkr) {
                console.log(key)
                marker.setAttribute('data-' + key, mkr[key])
            }
            //marker.setAttribute('src',  "nextMarker.png")
            marker.setAttribute('radius', "10")
            marker.setAttribute('color', mkr.color)
            marker.setAttribute("cursor-listener")
 
           //marker.setAttribute("id", "marker" + id)
            //marker.setAttribute('data-num', mkr.number);
            //marker.setAttribute('data-room', mkr.room || "");
            marker.setAttribute("class", "marker")
            $("#markers").prepend(marker)
        }
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

window.addEventListener("wheel", event => {
    const delta = Math.sign(event.wheelDelta)*.4;

    var mycam=document.getElementById('cam').getAttribute('camera');
    var finalZoom=document.getElementById('cam').getAttribute('camera').zoom+delta;
  
    if(finalZoom<1)
      finalZoom=1;
    if(finalZoom>5)
      finalZoom=5;  

    mycam.zoom=finalZoom;
    //setting the camera element
     document.getElementById('cam').setAttribute('camera',mycam);
      });