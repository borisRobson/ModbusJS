/*
    Sends read holding register requests
    Bit checks result to set icons
*/
function readInputs() {
    var header = setHeader();
    $.get("/ismaView/control/readInputs", {ip: header.ip, devNum: header.devNum})
    .done(function(data) {
        (data.in1 === "1" ? setOn($('#in1')) : setOff($('#in1')));
        (data.in2 === "1" ? setOn($('#in2')) : setOff($('#in2')));
        (data.in3 === "1" ? setOn($('#in3')) : setOff($('#in3')));
        (data.in4 === "1" ? setOn($('#in4')) : setOff($('#in4')));
        });
};

/*
    Gets selected input states and sends write holding register request
*/
function setOutputs() {
    var header = setHeader();    
    var outputs = setData();
    $.get("/ismaView/control/setOutputs", { ip: header.ip, devNum: header.devNum, data: outputs })
        .done(function(data) {
            //console.log(data);
        });
};

/*
    Creates the loop for live connect
    Alternates between read registers and set registers
*/
var live = false;
var timeout = 125;
var timeOut;
$('#commands').on('click', 'button', function () {
    var btn = $(this)[0];
    if (btn.id === "liveConnect") {
        if (live === false) {
            live = true;     
            liveStream();                   
        } else {
            live = false;
            window.clearTimeout(timeOut);
        };
    };
});

function liveStream(){
    timeOut = window.setTimeout(update,timeout);            
};

var toggle=0;
var update = function(){
    toggle++;
    if(toggle%2 === 0){
        setOutputs();        
    }
    else{
        readInputs();
    };
    liveStream();
};

function setData() {
    var output1 = ($('#out1')[0].style.color === "green" ? "on" : "off");
    var output2 = ($('#out2')[0].style.color === "green" ? "on" : "off");
    var output3 = ($('#out3')[0].style.color === "green" ? "on" : "off");
    var output4 = ($('#out4')[0].style.color === "green" ? "on" : "off");
    //var data = { out1: output1, out2: output2, out3: output3, out4: output4 };
    var val = 0;
    if (output1 === "on") {
        val += 1;
    };
    if (output2 === "on") {
        val += 2;
    };
    if (output3 === "on") {
        val += 4;
    };
    if (output4 === "on") {
        val += 8;
    };
    return val;    
};
/*
 * var val;
function setData(data) {
    val = 0;
    if (data.out1 === "on") {
        val += 1;
    };
    if (data.out2 === "on") {
        val += 2;
    };
    if (data.out3 === "on") {
        val += 4;
    };
    if (data.out4 === "on") {
        val += 8;
    };
    return val;
};*/

function setHeader() {
    var ip = document.getElementById("ipAddr").value;
    var active = document.getElementsByClassName("isActive");
    var el = active[0].innerText;
    var start = el.indexOf("(");
    var stop = el.indexOf(")");
    var devNum = el.substring(start + 1, stop);
    return { ip: ip, devNum: devNum };
}

/*
    creates an array of devices
    MAP function converts into correct html format
    TODO fix bug with multiple removals, currently returns an undefined list element
*/

var devList = [];
var count = 0;
var devices = document.getElementById("devices");
$(document).on('click', '#btnAdd', function () {
    var devNum = document.getElementById("devNum").value;
    var devName = document.getElementById("devName").value;
    var device = devName + " (" + devNum + ")";
    devList[count] = device;
    count++;
    var devs = $.map(devList, function(status, i) {
        var listItem = $('<li></li>');
        $('<a href="#" class="list-group-item">' + status + '</a>').appendTo(listItem);
        return listItem;
    });    
    for(var i=devList.length-1;i>=0;i--){
        var dev = devs[i];
        var name = dev[0].innerText;
        var removed = name.toString();
        if (removed === "undefined") {
            devs.splice(i, 1);
        };
    };
    $(devices).html(devs);
});

/*
    removes all cases of isActive class
    adds isActive to clicked item
*/
$('.devices').on('click', 'li', function() {
    $('.devices li').removeClass('isActive');
    $(this).addClass('isActive');
});

/*
    removes elemnt from ul & devList array
*/
$(document).on('click', '#btnRemove', function() {
    var active = document.getElementsByClassName("isActive");
    var el = active[0].innerText;
    var search = el.substring(0, el.length - 1);
    for (var i = 0; i < devList.length; i++) {
        if (devList[i] === search) {
            devList.splice(i, 1);
        };
    };
    $("li").remove(".isActive");
});


/*
    handler for clicking on/off images
*/
$('.io').on('click', 'span', function() {
    toggleColour($(this));
});

/*
    only toggles outputs
*/
function toggleColour(e) {
    if (e[0].id.indexOf("out") !== -1) {
        if (e.context.style.color != 'green') {
            $(e).css('color', 'green');
        } else {
            $(e).css('color', 'black');
        }
    }
};

function setOn(e) {
    $(e).css('color', 'green');
};

function setOff(e) {
    $(e).css('color', 'black');
};