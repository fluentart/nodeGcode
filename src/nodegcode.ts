console.log("node gcode")

import * as fs from "fs"


class GCodeProcessor {

    keysToFloat = ["X", "Y", "Z", "I", "J", "K"]

    constructor(inputFilePath:string) {
        this.readFile(inputFilePath);
    }

    readFile(inputFilePath) {
        console.log("reading "+inputFilePath)
        fs.readFile(inputFilePath, (err,data)=>{
            //console.log(data.toString());
            var processed = this.processFile(data.toString());
            fs.writeFile(inputFilePath+".PROC", processed, (err)=>{
                console.log(err);
                console.log("done");
            });
        })
    }

    processFile(data) {
        console.log("processing...")
        var lines = data.split("\r\n")

        var newlines = ""
        for (var a = 0; a < lines.length-1;a++) {
            var newline = this.processLine(lines[a])
            newlines += newline.trim() + "\r\n";
        }        

        return newlines;
    }

    processLine(line) {
        //console.log("\r\norig:\t"+line)

        var tokens = line.split(" ");
        var newline = "";

        if (tokens) {
            for (var num in tokens) {
                var key = tokens[num][0]
                var processed = false;

                if (this.keysToFloat.indexOf(key) != -1) {
                    var value = tokens[num].substring(1);
                    value = parseFloat(value).toFixed(3)
                    processed = true;
                    newline += key+value + " "
                } else {
                    newline += tokens[num] + " "
                }             
                //float this    
            }
        } else {
            console.log("ERROR no tokens")
        }

        //console.log("new:\t"+newline)
        return newline;
    }
}


var matsuura = new GCodeProcessor("../files/SUMP_TOP2.PRG")