/**
 * Created by dinhlv on 4/12/16.
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const progressBar = require('progress');
const gm = require('gm').subClass({imageMagick: true});;

var processData = process.argv;
var url = processData[2];

var arrEx = ['png','jpeg','jpg','gif','tiff'];
var totalBytes;
var bar;
var fileImage;
function Contain(ex){
    for(var i = 0 ; i < arrEx.length ; i++)
    {
        if(ex == arrEx[i])
        {
            return true;
        }
    }
    return false;
};



if(!url)
{
    console.log("URL null...!")
    return;
}
else {
    var ex = url.split('.');
    ex = ex.pop();
    var downloadIMG = request.get(url);
    console.time('download');
    downloadIMG.on('error', function (err) {
        console.log("Download Error ", err);
    });
    downloadIMG.on('response', function (response) {
        if (response.statusCode != 200) {
            console.log("Error " + response.statusCode);
            return;
        }
        else {
            if (Contain(ex) === true) {
                totalBytes = parseInt(response.headers['content-length'], 10);
                console.log("Status Code:  " + response.statusCode);
                bar = new progressBar('downloading [:bar] :percent :etas', {
                    complete: '*',
                    incomplete: ' ',
                    width: 50,
                    total: totalBytes
                });
                downloadIMG.on('data', function (chunk) {
                    bar.tick(chunk.length);
                });
                downloadIMG.pipe(fs.createWriteStream('Image.' + ex))
                    .on('finish', function () {
                        fileImage = "Image."+ex;
                        console.timeEnd('download');
                        fileImage = path.join(__dirname,fileImage);
                        console.log(fileImage);
                        var thumb = __dirname + "/thumb/thumb." + ex;
                        var Bw = __dirname + "/BW/Bw." + ex;
                        console.log(thumb);
                        console.log(Bw);
                        gm(fileImage)
                            .thumbnail(500, 500)
                            .noProfile()
                            .write(thumb, function (err) {
                                if (!err) console.log('done');
                            });
                        gm(fileImage)
                            .monochrome()
                            .noProfile()
                            .write(Bw, function (err) {
                                if (!err) console.log('done');
                            });
                    })
                    .on('error', function (err) {
                        console.log("Error: " + err);
                    });
            }
            else
            {
                console.log("ULR khong dan toi file anh")
            }
        }
    });
}


