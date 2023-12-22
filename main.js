function toRadian(degree) {
    return degree*Math.PI/180;
}

function roundTo(num, toNum=10) {// num=13.2345, toNum=10 ==> 13.2
    return Math.round(num*toNum)/toNum;
}

let editor = document.querySelector("#editor");
let image = document.getElementById("image");
let imageHigh = document.getElementById("image-high-resolution");
let textInput = document.getElementById("text");
let fileInput = document.getElementById("file");
let submitButton = document.getElementById("submit");
let canvas = document.getElementById("canvas");
let canvasHigh = document.getElementById("canvas-high-resolution");
let ctx = canvas.getContext("2d");
let ctxHigh = canvasHigh.getContext("2d");
// نوع الخط
let fontType = "Tajawal";
let fontBold = 300;
let fontTypeInput = document.getElementById("text-font");
let fontBoldInput = document.getElementById("text-bold");
// حجم الخط
let fontSize = 60;
let fontSizeInput = document.getElementById("fontsize");
let lineHeight = fontSize * 1.3; // ارتفاع السطر
let lineHeightInput = document.getElementById("line-height");
// مكان النص
let textTopInput = document.getElementById("text-top");
let textRightInput = document.getElementById("text-right");
let textRotateInput = document.getElementById("text-rotate");
let textTop = 0;
let textRight = 0;
// دوران النص
let textRotate = 0;
let nk = 0; // نق
let rotateLen = 0;
let rotateX = 0;
let rotateY = 0;
// لون النص
let textColorInput = document.getElementById("text-color");
let hexColorInput = document.getElementById("hex-color");
let isHexInputting = 0;
// النسبة بين الصورة الأصلية والمعروضة
let ratioHigh = 1;

window.onload = () => {
    fontSizeInput.value = fontSize;
    ctx.fillStyle = textColorInput.value;
    updateFont();
    updateText();
}

// تغيير نوع الخط
fontTypeInput.addEventListener("textInput", updateFont);
fontTypeInput.addEventListener("input", updateFont);
fontBoldInput.addEventListener("textInput", updateFont);
fontBoldInput.addEventListener("input", updateFont);

// رفع القالب واظهاره
fileInput.addEventListener("change", function() {
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
        image.src = event.target.result;
        imageHigh.src = event.target.result;

        let waitSize = setInterval(() => { if(image.width > 0 && image.height > 0) {
            canvas.width = image.width;
            canvas.height = image.height;
            canvasHigh.width = imageHigh.width;
            canvasHigh.height = imageHigh.height;

            containerWidth = document.getElementById("canvas-container").offsetWidth;
            let newHeight = containerWidth * image.height/image.width;

            canvas.style.height = `${newHeight}px`;

            ctx.drawImage(image, 0, 0);
            ctx.font = fontSize*ratioHigh + `px ${fontType}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctxHigh.drawImage(imageHigh, 0, 0);
            ratioHigh = canvas.width/canvasHigh.width;
            ctx.font = fontSize*ratioHigh + `px ${fontType}`;
            ctxHigh.font = fontSize + `px ${fontType}`;
            ctxHigh.textAlign = "center";
            ctxHigh.textBaseline = "middle";

            lineHeightInput.value = roundTo(fontSize*1.3, 10);

            updateText();
            clearInterval(waitSize);
        }});
    }
    reader.readAsDataURL(file);
});

// تغيير حجم النص
fontSizeInput.addEventListener("input", function() {
    fontSize = parseInt(this.value);
    ctx.font = fontSize*ratioHigh + `px ${fontType}`;
    ctxHigh.font = fontSize + `px ${fontType}`;
    lineHeight = roundTo(fontSize*1.3, 10);
    lineHeightInput.value = lineHeight;
    updateText();
});

// تغيير ارتفاع السطر
lineHeightInput.addEventListener("input", function() {
    lineHeight = parseInt(lineHeightInput.value);
    updateText();
});

// تغيير لون النص
textColorInput.addEventListener("input", function() {
    updateText();
});

hexColorInput.addEventListener("input", function() {
    textColorInput.value = "#" + hexColorInput.value;
    isHexInputting = 1;
    updateText();
});

// تغيير مكان النص
textTopInput.addEventListener("input", function() {
    textTop = -1 * parseInt(this.value);
    updateText();
});

textRightInput.addEventListener("input", function() {
    textRight = parseInt(this.value);
    updateText();
});

// تغيير زاوية دوران النص
textRotateInput.addEventListener("input", function() {
    textRotate = parseInt(this.value);
    updateText();
});

// تغيير النص على القالب
textInput.addEventListener("textInput", updateText);
textInput.addEventListener("input", updateText);

// دالة تغيير النص على القالب وتغيير لون النص
function updateText() {
    let lines = textInput.value.split("\n").filter((line) => {
        return line.trim() !== '';
    });
    ctx.fillStyle = textColorInput.value; // اللون
    ctxHigh.fillStyle = textColorInput.value; // اللون
    if(isHexInputting == 0) {
        hexColorInput.value = textColorInput.value.split("#").join("").toUpperCase();
    } else {
        hexColorInput.value = hexColorInput.value.toUpperCase();
        isHexInputting = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxHigh.clearRect(0, 0, canvasHigh.width, canvasHigh.height);

    canvas.width == 0? ctx.drawImage(image, 0, 0) : ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctxHigh.drawImage(imageHigh, 0, 0);
    
    let center = (lines.length - 1) * lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
        nk = lineHeight*((lines.length-1)*0.5 - i); // نق
        rotateLen = 2*nk*Math.sin(toRadian(textRotate)/2);
        rotateX = Math.sin(toRadian((180-textRotate)/2))*rotateLen;
        rotateY = Math.cos(toRadian((180-textRotate)/2))*rotateLen;

        let line = lines[i].trim();
        let textWidth = ctx.measureText(line).width;
        let x = canvasHigh.width / 2;
        let y = (canvasHigh.height / 2) + (lineHeight * i) - center;
        ctx.save();
        ctx.translate((x + textRight + rotateX) * ratioHigh, (y + textTop + rotateY) * ratioHigh);
        ctx.rotate(textRotate * Math.PI / 180);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(line, 0, 0);
        ctx.restore();
        ctxHigh.save();
        ctxHigh.translate(x + textRight + rotateX, y + textTop + rotateY);
        ctxHigh.rotate(textRotate * Math.PI / 180);
        ctxHigh.textAlign = "center";
        ctxHigh.textBaseline = "middle";
        ctxHigh.fillText(line, 0, 0);
        ctxHigh.restore();
    }

    canvasHigh = document.getElementById("canvas-high-resolution");
    let dataURL = canvasHigh.toDataURL("image/png");
    submitButton.href = dataURL;
}

// دالة تغيير نوع الخط
function updateFont() {
    fontType = fontTypeInput.value;
    fontBold = fontBoldInput.value;
    let styles = document.querySelector("style#font-style");
    styles.innerText = '@import url("https://fonts.googleapis.com/css2?family=' + fontType + ':wght@' + fontBold + '&display=swap");';

    ctx.font = fontSize*ratioHigh + `px ${fontType}`;
    ctxHigh.font = fontSize + `px ${fontType}`;
    updateText();
}

// تنزيل الإقتباس
submitButton.onclick = () => {
    submitButton.setAttribute("download", `${textInput.value.split("\n").join(" ")}.png`);
};