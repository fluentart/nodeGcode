// Arrow command line relay
// this program scans for connected devices and relays communication to a socket server
// v 5.4beta


var file = "";

if (!process.argv[2]) {
	console.log("\n\nERROR. No gcode file.\n Please specify a gcode file to prep.")
	console.log("node nodegcode.js yourexported.NC\n\n")
} else {
	file = process.argv[2];
}

console.log("\nLoading "+file+" ... please wait\n")

var os = require("os");
var TIMElast = os.uptime();
var STARTTIME = os.uptime();
var reader = require ("buffered-reader");
var BinaryReader = reader.BinaryReader;
var DataReader = reader.DataReader;
var offset;
var linecounter = 0;
var gcodereader;

var gcodecached = [];

var readerstream = new DataReader (file, { encoding: "utf8" })
	    /* READS GCODE AND SENDS EACH LINE TO GET PARSED */
        .on ("error", function (error){
            console.log (error);
        })

        .on ("line", function (line){
        	linecounter++;
        	//console.log("\noriginal: "+line); //RAW GCODE LINE

			var skip = false;
			var text = line.replace(/;.*$/, '').trim(); // Remove comments
			if (text == "N100 G21") { 
				console.log("!!")
				skip = true;
			    gcodecached.push("G28 G91 Z0.0");			 
			    gcodecached.push("G28 X0.0 Y0.0");
			}
			if (text == "N102 G0 G17 G40 G49 G80 G90") { 
				console.log("!!")
				skip = true;
				//SET THE CENTER
				gcodecached.push("G92 X222.600 Y61.200 Z0.0")
			    gcodecached.push("G0 G17 G40 G49 G80 G90")
			}
			

			if ((text)&&(!skip)) {
				//console.log("     raw: " +text); //RAW GCODE LINE
				var tokens = text.split(' ');
				//start tokens				
			    if (tokens) {

			      var args = {};
			      var newgcodeline = "";

			      //calculate new gcode

			      for (var num in tokens) {
			      	var key = tokens[num][0]//.toLowerCase();
			      	var value = tokens[num].substring(1);
			      	//console.log("key " + key + " value " + value)
			      	
			      	
			      	var allow = true;
			      	if (key == "O") { allow = false; }
			      	if (key == "N") { allow = false; }
			      	if (key == "A") { allow = false; }
			      	if (key == "G") {  
			      		if (value == "54") { allow = false; }
			      	}

			      	if (allow) {
			      		newgcodeline += key + value + " "
			      	}

			      }
			      //print out new gcode
			      
			      if(newgcodeline.length > 0) {
			      	console.log("     new: "+newgcodeline)	
			      	gcodecached.push(newgcodeline)	
			      }
			    }
			}
        })

        .on ("end", function (){


            console.log("end")
            var totaltime = os.uptime() - STARTTIME;
            console.log(" Total time: " + Math.round(totaltime) + "seconds");            
            console.log(" Total lines: " + linecounter + "of gcode");
            console.log(" Total speed: " + linecounter/totaltime + "lines per second average");
			console.log(gcodecached.length)
            //console.log(gcodecached)

            console.log("attempting to save..")
            //console.log(gcodecached)

            var filecontents = ""
            for (var num in gcodecached) {
            	filecontents += gcodecached[num] + "\r\n";
            }

            var fs = require('fs');
			fs.writeFile("testoutput.prg", filecontents, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			}); 
            
        })
        .read ();

