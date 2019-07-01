"use strict";
exports.__esModule = true;
console.log("node gcode");
var fs = require("fs");
var GCodeProcessor = /** @class */ (function () {
    function GCodeProcessor(inputFilePath) {
        this.keysToFloat = ["X", "Y", "Z", "I", "J", "K"];
        this.readFile(inputFilePath);
    }
    GCodeProcessor.prototype.readFile = function (inputFilePath) {
        var _this = this;
        console.log("reading " + inputFilePath);
        fs.readFile(inputFilePath, function (err, data) {
            //console.log(data.toString());
            var processed = _this.processFile(data.toString());
            fs.writeFile(inputFilePath + ".PROC", processed, function (err) {
                console.log(err);
                console.log("done");
            });
        });
    };
    GCodeProcessor.prototype.processFile = function (data) {
        console.log("processing...");
        var lines = data.split("\r\n");
        var newlines = "";
        for (var a = 0; a < lines.length - 1; a++) {
            var newline = this.processLine(lines[a]);
            newlines += newline.trim() + "\r\n";
        }
        return newlines;
    };
    GCodeProcessor.prototype.processLine = function (line) {
        //console.log("\r\norig:\t"+line)
        var tokens = line.split(" ");
        var newline = "";
        if (tokens) {
            for (var num in tokens) {
                var key = tokens[num][0];
                var processed = false;
                if (this.keysToFloat.indexOf(key) != -1) {
                    var value = tokens[num].substring(1);
                    value = parseFloat(value).toFixed(3);
                    processed = true;
                    newline += key + value + " ";
                }
                else {
                    newline += tokens[num] + " ";
                }
                //float this    
            }
        }
        else {
            console.log("ERROR no tokens");
        }
        //console.log("new:\t"+newline)
        return newline;
    };
    return GCodeProcessor;
}());
var matsuura = new GCodeProcessor("../files/SUMP_TOP2.PRG");
//# sourceMappingURL=nodegcode.js.map