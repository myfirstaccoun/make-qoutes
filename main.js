function copyText(txt) {// نسخ النص
    let inputElement = document.createElement("textarea");
    inputElement.type = "text";
    inputElement.value = txt;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
}

function toRadian(degree) {
    return degree*Math.PI/180;
}

function roundTo(num, toNum=10) {// num=13.2345, toNum=10 ==> 13.2
    return Math.round(num*toNum)/toNum;
}

function removeFromArr(arr, index) {
    arr.splice(index, 1);

    return arr;
}

function check_hasImage(item_index) {
    return Array.from(itemsCont.querySelectorAll(".item")[item_index].querySelectorAll("img")).length > 0;
}

function getProperties() {// مع بداية الصفحة
    texts_data[active_text].text = textInput.value;
    texts_data[active_text].font_type = fontTypeInput.value;
    texts_data[active_text].font_bold = parseFloat(fontBoldInput.value);
    texts_data[active_text].font_size = parseFloat(fontSizeInput.value);
    texts_data[active_text].font_color = textColorInput.value;
    texts_data[active_text].text_to_top = parseFloat(textTopInput.value);
    texts_data[active_text].text_to_right = parseFloat(textRightInput.value);
    texts_data[active_text].text_rotation = parseFloat(textRotateInput.value);
    texts_data[active_text].line_height = parseFloat(lineHeightInput.value);
}

function changeProperties() {// تغيير الخصائص
    textInput.value = texts_data[active_text].text;
    fontTypeInput.value = texts_data[active_text].font_type;
    fontBoldInput.value = texts_data[active_text].font_bold;
    fontSizeInput.value = texts_data[active_text].font_size;
    textColorInput.value = texts_data[active_text].font_color;
    hexColorInput.value = texts_data[active_text].font_color.replace("#", "");
    textTopInput.value = texts_data[active_text].text_to_top;
    textRightInput.value = texts_data[active_text].text_to_right;
    textRotateInput.value = texts_data[active_text].text_rotation;
    lineHeightInput.value = texts_data[active_text].line_height;
}

let editor = document.querySelector("#editor");
let image = document.getElementById("image");
let imageHigh = document.getElementById("image-high-resolution");
let textInput = document.getElementById("text");
let fileInput = document.getElementById("file");
let submitButton = document.getElementById("submit");
let enable_developer = document.querySelector(".enable-developer");
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

// أكثر من نص
let itemsCont = document.querySelector("#items");
let active_text = 0;
let texts_data = [
    {
        text: "",
        font_type: "Tajawal",
        font_bold: 700,
        font_size: 60,
        font_color: "#000000",
        text_to_top: 0,
        text_to_right: 0,
        text_rotation: 0,
        line_height: 70.2
    }
]

window.onload = () => {
    getProperties();
    updateFont();
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
            ctx.font = texts_data[active_text].font_size*ratioHigh + `px ${texts_data[active_text].font_type}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctxHigh.drawImage(imageHigh, 0, 0);
            ratioHigh = canvas.width/canvasHigh.width;
            ctx.font = texts_data[active_text].font_size*ratioHigh + `px ${texts_data[active_text].font_type}`;
            ctxHigh.font = texts_data[active_text].font_size + `px ${texts_data[active_text].font_type}`;
            ctxHigh.textAlign = "center";
            ctxHigh.textBaseline = "middle";

            lineHeightInput.value = roundTo(texts_data[active_text].font_size*1.3, 10);

            updateText();
            clearInterval(waitSize);
        }});
    }
    reader.readAsDataURL(file);
});

// تغيير حجم النص
fontSizeInput.addEventListener("input", function() {
    texts_data[active_text].font_size = parseInt(this.value);
    ctx.font = texts_data[active_text].font_size*ratioHigh + `px ${texts_data[active_text].font_type}`;
    ctxHigh.font = texts_data[active_text].font_size + `px ${texts_data[active_text].font_type}`;
    texts_data[active_text].line_height = roundTo(texts_data[active_text].font_size*1.3, 10);
    lineHeightInput.value = texts_data[active_text].line_height;
    updateText();
});

// تغيير ارتفاع السطر
lineHeightInput.addEventListener("input", function() {
    texts_data[active_text].line_height = parseInt(lineHeightInput.value);
    updateText();
});

// تغيير لون النص
textColorInput.addEventListener("input", function() {
    texts_data[active_text].font_color = textColorInput.value;
    updateText();
});

hexColorInput.addEventListener("input", function() {
    textColorInput.value = "#" + hexColorInput.value;
    texts_data[active_text].font_color = textColorInput.value;
    isHexInputting = 1;
    updateText();
});

// تغيير مكان النص
textTopInput.addEventListener("input", function() {
    texts_data[active_text].text_to_top = parseInt(this.value);
    updateText();
});

textRightInput.addEventListener("input", function() {
    texts_data[active_text].text_to_right = parseInt(this.value);
    updateText();
});

// تغيير زاوية دوران النص
textRotateInput.addEventListener("input", function() {
    texts_data[active_text].text_rotation = parseInt(this.value);
    updateText();
});

// أكثر من نص
//    |
//    |
//  \-|-/
//   \-/

// إضافة نص
document.querySelector(".add-item").onclick = () => {
    texts_data.push({
        text: "",
        font_type: "Tajawal",
        font_bold: 700,
        font_size: 60,
        font_color: "#000000",
        text_to_top: 0,
        text_to_right: 0,
        text_rotation: 0,
        line_height: 70.2
    });

    // إضافة نص في القائمة
    let new_item = document.createElement("div");
    new_item.classList.add("item", "active");
    
    let new_item_text = document.createElement("p");
    new_item_text.classList.add("item-text");
    new_item.appendChild(new_item_text);
    
    let new_item_image = document.createElement("img");
    new_item_image.setAttribute("src", "./صور/إغلاق.png");
    new_item.appendChild(new_item_image);
    
    itemsCont.appendChild(new_item);

    // إلغاء تفعيل النص السابق
    itemsCont.querySelectorAll(".item")[active_text].classList.remove("active");
    check_hasImage(active_text)? itemsCont.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إلغاء.png") : "";
    
    active_text = texts_data.length - 1;
    
    // تغيير الخصائص
    changeProperties();
        
    // وضع علامة الإلغاء في أول عنصر
    if(check_hasImage(0) == false) {
        let new_item_image = document.createElement("img");
        new_item_image.setAttribute("src", "./صور/إلغاء.png");
        itemsCont.querySelectorAll(".item")[0].appendChild(new_item_image);
    }

    textInput.focus();
}

// إلغاء/إختيار نص
itemsCont.onclick = (eo) => {
    let items = itemsCont.querySelectorAll(".item");
    let item_index = -2;

    // إلغاء نص
    if(eo.target.tagName.toLowerCase() == "img") {
        item_index = Array.from(itemsCont.querySelectorAll(".item")).indexOf(eo.target.parentNode);
        items[item_index].remove();
        texts_data = removeFromArr(texts_data, item_index);
        active_text = Array.from(itemsCont.querySelectorAll(".item")).length - 1;

        // تغيير الخصائص
        changeProperties();

        // تفعيل آخر نص
        itemsCont.querySelectorAll(".item")[active_text].classList.add("active");
        itemsCont.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إغلاق.png")

        // إلغاء زر الإلغاء من أول عنصر
        if(Array.from(itemsCont.querySelectorAll(".item")).length == 1) {
            itemsCont.querySelectorAll(".item")[0].querySelector("img").remove();
        }

        textInput.focus();
        updateText();
    } else if(Array.from(eo.target.classList).includes("item") || Array.from(eo.target.classList).includes("item-text")) {// إختيار نص
        // إلغاء تفعيل النص السابق
        itemsCont.querySelectorAll(".item")[active_text].classList.remove("active");
        check_hasImage(active_text)? itemsCont.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إلغاء.png") : "";
        
        // تغيير فهرس العنصر الفعال
        Array.from(eo.target.classList).includes("item")? item_index = Array.from(itemsCont.querySelectorAll(".item")).indexOf(eo.target) : item_index = Array.from(itemsCont.querySelectorAll(".item")).indexOf(eo.target.parentNode);
        active_text = item_index;

        // تفعيل النص المختار
        itemsCont.querySelectorAll(".item")[active_text].classList.add("active");
        itemsCont.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إغلاق.png")

        // تغيير الخصائص
        changeProperties();

        textInput.focus();
    }
}

// تغيير النص على القالب
textInput.addEventListener("textInput", updateText);
textInput.addEventListener("input", updateText);

// كتابة نص واحد فقط
function writeText(text, font_color, lineHeight, textTop, textRight, textRotate) {
    // اللون
    ctx.fillStyle = font_color;
    ctxHigh.fillStyle = font_color;

    // تعديلات
    textTop *= -1;

    // النص
    let lines = text.split("\n");
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
}

// تغيير النص - أكثر من نص
function updateText() {
    let text = textInput.value;
    let lines = text.split("\n");
    texts_data[active_text].text = text;

    // وضع النص في مربع النصوص
    document.querySelectorAll("#items .item")[active_text].querySelector(".item-text").innerText = lines.join(" ");
    
    // مسح الصورة
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxHigh.clearRect(0, 0, canvasHigh.width, canvasHigh.height);
    
    // رسم الصورة
    canvas.width == 0? ctx.drawImage(image, 0, 0) : ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctxHigh.drawImage(imageHigh, 0, 0);
    
    // تغيير قيمة اللون
    if(isHexInputting == 0) {
        hexColorInput.value = textColorInput.value.replace("#", "").toUpperCase();
    } else {
        hexColorInput.value = hexColorInput.value.toUpperCase();
        isHexInputting = 0;
    }

    // كتابة النصوص
    for(let i = 0; i < texts_data.length; i++) {
        let text_item = texts_data[i];

        // اكتب الكلام
        writeText(text_item.text, text_item.font_color, text_item.line_height, text_item.text_to_top, text_item.text_to_right, text_item.text_rotation);
    }

    // تفعيل تنزيل الإقتباس
    canvasHigh = document.getElementById("canvas-high-resolution");
    let dataURL = canvasHigh.toDataURL("image/png");
    submitButton.href = dataURL;
}

// تغيير نوع الخط
function updateFont() {
    fontType = fontTypeInput.value.split(" ").join("+");
    fontBold = fontBoldInput.value;
    let styles = document.querySelector("style#font-style");
    styles.innerText += '\n@import url("https://fonts.googleapis.com/css2?family=' + fontType + ':wght@' + fontBold + '&display=swap");';

    texts_data[active_text].font_type = fontType;
    texts_data[active_text].font_bold = fontBold;

    ctx.font = fontSize*ratioHigh + `px ${fontType}`;
    ctxHigh.font = fontSize + `px ${fontType}`;
    updateText();
}

// تنزيل الإقتباس
submitButton.onclick = () => {
    submitButton.setAttribute("download", `${textInput.value.split("\n").join(" ")}.png`);
};

// تفعيل خيار المطوِّر
enable_developer.onclick = () => {
    let script = document.createElement('script');
    script.src="//cdn.jsdelivr.net/npm/eruda";
    document.body.appendChild(script);
    script.onload = function () { eruda.init() }
    copyText(`let newNames = \`أحمد\nمحمد\nعمر\nباقي الأسامي\`.split("\\n");\n\nlet i = 0;\nfunction addName() {\n	document.querySelector("#text").value = newNames[i];\n\n	// حفظ في الخادم\n	let inputEvent = new Event('input', { bubbles: true });\n	document.querySelector("#text").dispatchEvent(inputEvent);\n	\n	i++;\n	setTimeout(() => {\n		document.querySelector("#submit").click();\n		i < newNames.length? addName() : "";\n	}, 100);\n}\n\naddName();`);
}
