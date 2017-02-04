function binarization(canvas, blackBorder) {
  var ctx = canvas.getContext("2d");
  var src = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var dst = ctx.createImageData(canvas.width, canvas.height);
  for (var i = 0; i < src.data.length; i += 4) {
    var v = src.data[i] + src.data[i+1] + src.data[i+2];
    var c;
    if (v <= blackBorder * 3) {
      c = 0;
    } else {
      c = 255;
    }
    dst.data[i] = c;
    dst.data[i+1] = c;
    dst.data[i+2] = c;
    dst.data[i+3] = src.data[i+3];
  }
  ctx.putImageData(dst, 0, 0);
}

function isURL(str) {
  if (str.match(/https?/)) {
    return true;
  }
  return false;
}

function loadImage(fileID) {
  var fileList = document.getElementById(fileID).files;
  var reader = new FileReader();
  file = fileList[0];
  if (file.type == 'image/jpeg' ||
    file.type == 'image/png'){
    reader.readAsDataURL(file, "utf-8");
    reader.onload = (function(theFile) {
      return function(e) {
      var data = e.target.result;
      var img = new Image();
      img.src = data;
      img.onload = function() {
        var canvas = document.getElementById('qr-canvas');
        var limitSize = 400;
        var resizedWidth = img.width;
        var resizedHeight = img.height;
        if (resizedWidth > limitSize || resizedHeight > limitSize) {
          var s;
          if (resizedWidth > resizedHeight) {
            s = limitSize / resizedWidth;
          } else {
            s = limitSize / resizedHeight;
          }
          resizedWidth *= s;
          resizedHeight *= s;
        }
        canvas.width = limitSize;
        canvas.height = limitSize;
        if (canvas.style.width > canvas.style.height) {
          canvas.style.width = resizedWidth;
          canvas.style.height = resizedHeight;
          $(canvas).css("height", (resizedHeight * (150 / resizedWidth)) + "px");
        } else {
          canvas.style.width = resizedWidth;
          canvas.style.height = resizedHeight;
          $(canvas).css("height", (resizedHeight * (150 / resizedWidth)) + "px");
        }
        var mpImg = new MegaPixImage(img);
        mpImg.render(canvas, { width: canvas.width, height: canvas.height });
        binarization(canvas, 110);
        var resized_data = canvas.toDataURL("image/png");
        qrcode.decode(resized_data);
        };
      };
    })(file);
  } else {
    alert('JPEGかPNGファイルをアップして下さい');
  }
}
