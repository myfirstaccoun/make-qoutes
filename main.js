/*

تسريع:
تعديل الصورة الأصلية الكبيرة فقط عند التنزيل
تنزيل الخط الأصلي للموقع واستيراده فقط في التصميم

*/

function equalArr(arr, dimensions = 1) {
    let res = [];

    if (Array.isArray(arr)) {
        let i = 0;
        while (i < arr.length) {
            if (dimensions == 1) {
                res.push(arr[i]);
            } else if (dimensions > 1 && Array.isArray(arr[i])) {
                res.push([]);
                res[i] = equalArr(arr[i], dimensions - 1);
            } else {// في حالة الخطأ
                res.push(arr[i]);
            }
            i += 1;
        }
    }

    return res;
}

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
    return Array.from(itemsCont_.querySelectorAll(".item")[item_index].querySelectorAll("img")).length > 0;
}

function getProperties() {// مع بداية الصفحة
    texts_data[active_text].text = textInput_.value;
    texts_data[active_text].font_type = fontTypeInput_.value;
    texts_data[active_text].font_bold = parseFloat(fontBoldInput_.value);
    texts_data[active_text].anchor_ud = ["top", "middle", "bottom"][["end", "mid", "start"].indexOf(anchorUD_.querySelector(".active").classList[0])];
    texts_data[active_text].anchor_rl = ["right", "center", "left"][["end", "mid", "start"].indexOf(anchorRL_.querySelector(".active").classList[0])];
    texts_data[active_text].text_align = ["right", "center", "left"][["end", "mid", "start"].indexOf(textAlign_.querySelector(".active").classList[0])];
    texts_data[active_text].text_dir = ["rtl", "ltr"][["end", "start"].indexOf(textDir_.querySelector(".active").classList[0])];
    texts_data[active_text].font_size = parseFloat(fontSizeInput_.value);
    texts_data[active_text].font_color = textColorInput_.value;
    texts_data[active_text].text_to_top = parseFloat(textTopInput_.value);
    texts_data[active_text].text_to_right = parseFloat(textRightInput_.value);
    texts_data[active_text].text_rotation = parseFloat(textRotateInput_.value);
    texts_data[active_text].line_height = parseFloat(lineHeightInput_.value);
}

function changeProperties() {// تغيير الخصائص
    textInput_.value = texts_data[active_text].text;
    fontTypeInput_.value = texts_data[active_text].font_type;
    fontBoldInput_.value = texts_data[active_text].font_bold;
    fontSizeInput_.value = texts_data[active_text].font_size;
    textColorInput_.value = texts_data[active_text].font_color;
    hexColorInput_.value = texts_data[active_text].font_color.replace("#", "");
    textTopInput_.value = texts_data[active_text].text_to_top;
    textRightInput_.value = texts_data[active_text].text_to_right;
    textRotateInput_.value = texts_data[active_text].text_rotation;
    lineHeightInput_.value = texts_data[active_text].line_height;

    anchorUD_.querySelector(".active").classList.remove("active");
    anchorUD_.querySelectorAll("a")[2-["top", "middle", "bottom"].indexOf(texts_data[active_text].anchor_ud)].classList.add("active");

    anchorRL_.querySelector(".active").classList.remove("active");
    anchorRL_.querySelectorAll("a")[2-["right", "center", "left"].indexOf(texts_data[active_text].anchor_rl)].classList.add("active");

    textAlign_.querySelector(".active").classList.remove("active");
    textAlign_.querySelectorAll("a")[2-["right", "center", "left"].indexOf(texts_data[active_text].text_align)].classList.add("active");

    textDir_.querySelector(".active").classList.remove("active");
    textDir_.querySelectorAll("a")[1-["rtl", "ltr"].indexOf(texts_data[active_text].text_dir)].classList.add("active");
}

function choose_fast_method() {
    fastMethod == "download"? updateText(true, true, true) : (fastMethod == "edit"? updateText(true, false, false) : "");
}

function rgbToHex(color) {
    let r = color[0];
    let g = color[1];
    let b = color[2];

    // تحويل كل قيمة من القيم الثلاثية إلى صيغة HEX
    let red = r.toString(16).padStart(2, '0').toUpperCase();
    let green = g.toString(16).padStart(2, '0').toUpperCase();
    let blue = b.toString(16).padStart(2, '0').toUpperCase();
  
    // دمج القيم الثلاثية مع إضافة رمز #
    return `#${red}${green}${blue}`;
}

let editor_ = document.querySelector("#editor");
let image_ = document.getElementById("image");
let imageHigh_ = document.getElementById("image-high-resolution");
let textInput_ = document.getElementById("text");
let fileInput_ = document.getElementById("file");
let submitButton_ = document.getElementById("submit");
let enable_developer_ = document.querySelector(".enable-developer");
let canvas_ = document.getElementById("canvas");
let canvasHigh_ = document.getElementById("canvas-high-resolution");
let ctx = canvas_.getContext("2d");
let ctxHigh = canvasHigh_.getContext("2d");
// وضع التسريع
let fastMethod_ = document.querySelector(".fast-method");
let fastMethod = "edit"; // download || edit
// نوع الخط
let fontType = "Tajawal";
let fontBold = 700;
let fontTypeInput_ = document.getElementById("text-font");
let fontBoldInput_ = document.getElementById("text-bold");
// مركز النص
let anchorUD_ = document.querySelector(".anchor-ud .choose-div"); // رأسيًا up-down
let anchorRL_ = document.querySelector(".anchor-rl .choose-div"); // أفقيًا right-left
let anchorUD = "middle";
let anchorRL = "center";
// محاذاة النص واتجاه الكلام
let textAlign_ = document.querySelector(".text-align .choose-div");
let textDir_ = document.querySelector(".text-dir .choose-div");
let textAlign = "right";
let textDir = "rtl";
// حجم الخط
let fontSize = 60;
let fontSizeInput_ = document.getElementById("fontsize");
let lineHeight = fontSize * 1.3; // ارتفاع السطر
let lineHeightInput_ = document.getElementById("line-height");
// مكان النص
let textTopInput_ = document.getElementById("text-top");
let textRightInput_ = document.getElementById("text-right");
let textRotateInput_ = document.getElementById("text-rotate");
let textTop = 0;
let textRight = 0;
// دوران النص
let textRotate = 0;
let nk = 0; // نق
let rotateLen = 0;
let rotateX = 0;
let rotateY = 0;
// لون النص
let textColorInput_ = document.getElementById("text-color");
let hexColorInput_ = document.getElementById("hex-color");
let isHexInputting = 0;
// النسبة بين الصورة الأصلية والمعروضة
let ratioHigh = 1;
// شريط تقدم تنزيل أكثر من نص
let progress_popup = document.querySelector("#progress-popup");
let progress_bar = progress_popup.querySelector("#progress-bar");
let progress_p = progress_popup.querySelector("p");

// أكثر من نص
let default_text_info = {
    text: "",
    font_type: "Tajawal",
    anchor_ud: "middle",
    anchor_rl: "center",
    text_align: "right",
    text_dir: "rtl",
    font_bold: 700,
    font_size: 60,
    font_color: "#000000",
    text_to_top: 0,
    text_to_right: 0,
    text_rotation: 0,
    line_height: 70.2
};
let itemsCont_ = document.querySelector("#items");
let active_text = 0;
let texts_data = [JSON.parse(JSON.stringify(default_text_info))];

window.onload = () => {
    getProperties();
    updateFont();
}

// اختيار لون من الصورة
canvas_.onclick = (eo) => {
    let x = eo.layerX;
    let y = eo.layerY;
    let data = ctx.getImageData(0, 0, image_.width, image_.height).data;
    let cell_num = (x + y*image_.width)*4 + 3;
    let rgb = [data[cell_num-3], data[cell_num-2], data[cell_num-1]];
    let hex = rgbToHex(rgb);

    textColorInput_.value = hex;
    hexColorInput_.value = hex.replace("#", "");
    texts_data[active_text].font_color = hex;
    choose_fast_method();
}

// وضع التسريع
fastMethod_.onclick = (eo) => {
    let target = eo.target;
    if(target != fastMethod_) {
        target.tagName == "IMG"? target = target.parentNode : "";

        target.classList.contains("end")? fastMethod = "download" : "";
        target.classList.contains("start")? fastMethod = "edit" : "";
        
        fastMethod_.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        
        textInput_.focus();
    }
}

// مركز النص
anchorUD_.onclick = (eo) => {
    let target = eo.target;
    if(target != anchorUD_) {
        target.tagName == "IMG"? target = target.parentNode : "";

        target.classList.contains("end")? anchorUD = "top" : "";
        target.classList.contains("mid")? anchorUD = "middle" : "";
        target.classList.contains("start")? anchorUD = "bottom" : "";
        
        texts_data[active_text].anchor_ud = anchorUD;
        anchorUD_.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        
        textInput_.focus();
        choose_fast_method();
    }
}

anchorRL_.onclick = (eo) => {
    let target = eo.target;
    if(target != anchorRL_) {
        target.tagName == "IMG"? target = target.parentNode : "";

        target.classList.contains("end")? anchorRL = "right" : "";
        target.classList.contains("mid")? anchorRL = "center" : "";
        target.classList.contains("start")? anchorRL = "left" : "";
        
        texts_data[active_text].anchor_rl = anchorRL;
        anchorRL_.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        
        textInput_.focus();
        choose_fast_method();
    }
}

// محاذاة النص
textAlign_.onclick = (eo) => {
    let target = eo.target;
    if(target != textAlign_) {
        target.tagName == "IMG"? target = target.parentNode : "";

        target.classList.contains("end")? textAlign = "right" : "";
        target.classList.contains("mid")? textAlign = "center" : "";
        target.classList.contains("start")? textAlign = "left" : "";
        
        texts_data[active_text].text_align = textAlign;
        textAlign_.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        
        textInput_.focus();
        choose_fast_method();
    }
}

// اتجاه الكلام
textDir_.onclick = (eo) => {
    if(eo.target != textDir_) {
        eo.target.classList.contains("end")? textDir = "rtl" : "";
        eo.target.classList.contains("start")? textDir = "ltr" : "";
        
        texts_data[active_text].text_dir = textDir;
        
        textDir_.querySelector(".active").classList.remove("active");
        eo.target.classList.add("active");
        
        choose_fast_method();
        textInput_.focus();
    }
}

// تغيير نوع الخط
fontTypeInput_.addEventListener("textInput", updateFont);
fontTypeInput_.addEventListener("input", updateFont);
fontBoldInput_.addEventListener("textInput", updateFont);
fontBoldInput_.addEventListener("input", updateFont);

// رفع القالب واظهاره
fileInput_.addEventListener("change", function() {
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
        image_.src = event.target.result;
        imageHigh_.src = event.target.result;

        let waitSize = setInterval(() => { if(image_.width > 0 && image_.height > 0) {
            canvas_.width = image_.width;
            canvas_.height = image_.height;
            canvasHigh_.width = imageHigh_.width;
            canvasHigh_.height = imageHigh_.height;

            containerWidth = document.getElementById("canvas-container").offsetWidth;
            let newHeight = containerWidth * image_.height/image_.width;

            canvas_.style.height = `${newHeight}px`;

            ctx.drawImage(image_, 0, 0);
            ctx.textAlign = "center"; // موقع النص - المركز أفقيًا
            ctx.textBaseline = "middle"; // موقع النص - المركز رأسيًا
            
            ctxHigh.drawImage(imageHigh_, 0, 0);
            ratioHigh = canvas_.width/canvasHigh_.width;
            ctx.font = texts_data[active_text].font_size*ratioHigh + `px ${texts_data[active_text].font_type}`;
            ctxHigh.font = texts_data[active_text].font_size + `px ${texts_data[active_text].font_type}`;
            ctxHigh.textAlign = "center"; // موقع النص - المركز أفقيًا
            ctxHigh.textBaseline = "middle"; // موقع النص - المركز رأسيًا

            lineHeightInput_.value = roundTo(texts_data[active_text].font_size*1.3, 10);

            choose_fast_method();
            clearInterval(waitSize);
        }});
    }

    reader.readAsDataURL(file);
});

// تغيير حجم النص
fontSizeInput_.addEventListener("input", function() {
    texts_data[active_text].font_size = parseInt(this.value);
    texts_data[active_text].line_height = roundTo(texts_data[active_text].font_size*1.3, 10);
    lineHeightInput_.value = texts_data[active_text].line_height;
    choose_fast_method();
});

// تغيير ارتفاع السطر
lineHeightInput_.addEventListener("input", function() {
    texts_data[active_text].line_height = parseInt(lineHeightInput_.value);
    choose_fast_method();
});

// تغيير لون النص
textColorInput_.addEventListener("input", function() {
    texts_data[active_text].font_color = textColorInput_.value;
    choose_fast_method();
});

hexColorInput_.addEventListener("input", function() {
    textColorInput_.value = "#" + hexColorInput_.value;
    texts_data[active_text].font_color = textColorInput_.value;
    isHexInputting = 1;
    choose_fast_method();
});

// تغيير مكان النص
textTopInput_.addEventListener("input", function() {
    texts_data[active_text].text_to_top = parseInt(this.value);
    choose_fast_method();
});

textRightInput_.addEventListener("input", function() {
    texts_data[active_text].text_to_right = parseInt(this.value);
    choose_fast_method();
});

// تغيير زاوية دوران النص
textRotateInput_.addEventListener("input", function() {
    texts_data[active_text].text_rotation = parseInt(this.value);
    choose_fast_method();
});

/* أكثر من نص */
// إضافة نص
document.querySelector(".add-item").onclick = () => {
    texts_data.push(JSON.parse(JSON.stringify(default_text_info)));

    // إضافة نص في القائمة
    let new_item_ = document.createElement("div");
    new_item_.classList.add("item", "active");
    
    let new_item_text_ = document.createElement("p");
    new_item_text_.classList.add("item-text");
    new_item_.appendChild(new_item_text_);
    
    let new_item_image_ = document.createElement("img");
    new_item_image_.setAttribute("src", "./صور/إغلاق.png");
    new_item_.appendChild(new_item_image_);
    
    itemsCont_.appendChild(new_item_);

    // إلغاء تفعيل النص السابق
    itemsCont_.querySelectorAll(".item")[active_text].classList.remove("active");
    check_hasImage(active_text)? itemsCont_.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إلغاء.png") : "";
    
    active_text = texts_data.length - 1;
    
    // تغيير الخصائص
    changeProperties();
        
    // وضع علامة الإلغاء في أول عنصر
    if(check_hasImage(0) == false) {
        let new_item_image = document.createElement("img");
        new_item_image.setAttribute("src", "./صور/إلغاء.png");
        itemsCont_.querySelectorAll(".item")[0].appendChild(new_item_image);
    }

    textInput_.focus();
}

// إلغاء/إختيار نص
itemsCont_.onclick = (eo) => {
    let items = itemsCont_.querySelectorAll(".item");
    let item_index = -2;

    // إلغاء نص
    if(eo.target.tagName.toLowerCase() == "img") {
        item_index = Array.from(itemsCont_.querySelectorAll(".item")).indexOf(eo.target.parentNode);
        items[item_index].remove();
        texts_data = removeFromArr(texts_data, item_index);
                
        // لو مسحت الزرار الفعال
        if(item_index == active_text) {
            active_text == items.length - 1? active_text = Array.from(itemsCont_.querySelectorAll(".item")).length - 1 : "";
        }
        // لو مسحت قبل الزرار الفعال
        else if(item_index < active_text) {
            active_text -= 1;
        }

        // تغيير الخصائص
        changeProperties();

        // تفعيل النص
        itemsCont_.querySelectorAll(".item")[active_text].classList.add("active");
        itemsCont_.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إغلاق.png")

        // إلغاء زر الإلغاء من أول عنصر
        if(Array.from(itemsCont_.querySelectorAll(".item")).length == 1) {
            itemsCont_.querySelectorAll(".item")[0].querySelector("img").remove();
        }

        textInput_.focus();
        choose_fast_method();
    } else if(eo.target.classList.contains("item") || eo.target.classList.contains("item-text")) {// إختيار نص
        // إلغاء تفعيل النص السابق
        itemsCont_.querySelectorAll(".item")[active_text].classList.remove("active");
        check_hasImage(active_text)? itemsCont_.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إلغاء.png") : "";
        
        // تغيير فهرس العنصر الفعال
        eo.target.classList.contains("item")? item_index = Array.from(itemsCont_.querySelectorAll(".item")).indexOf(eo.target) : item_index = Array.from(itemsCont_.querySelectorAll(".item")).indexOf(eo.target.parentNode);
        active_text = item_index;

        // تفعيل النص المختار
        itemsCont_.querySelectorAll(".item")[active_text].classList.add("active");
        itemsCont_.querySelectorAll(".item")[active_text].querySelector("img").setAttribute("src", "./صور/إغلاق.png")

        // تغيير الخصائص
        changeProperties();

        textInput_.focus();
    }
}

// تغيير النص على القالب
textInput_.addEventListener("textInput", choose_fast_method);
textInput_.addEventListener("input", choose_fast_method);

// كتابة نص واحد فقط
function writeText(all_canvas, the_canvas_, the_ctx, text, font_type, font_size, font_color, lineHeight, textTop, textRight, textRotate, textAlign, textDirection, anchorUD, anchorRL) {
    // اتجاه النص واللون وحجم الخط
    if(all_canvas == false) {
        // اتجاه النص
        the_canvas_.dir = textDirection;

        // اللون
        the_ctx.fillStyle = font_color;

        // حجم الخط
        the_ctx == ctx? ctx.font = font_size*ratioHigh + `px ${font_type}` : "";
        the_ctx == ctxHigh? ctxHigh.font = font_size + `px ${font_type}` : "";
    } else {
        // اتجاه النص
        canvas_.dir = textDirection;
        canvasHigh_.dir = textDirection;

        // اللون
        ctx.fillStyle = font_color;
        ctxHigh.fillStyle = font_color;

        // حجم الخط
        ctx.font = font_size*ratioHigh + `px ${font_type}`;
        ctxHigh.font = font_size + `px ${font_type}`;
    }

    // تعديلات
    textTop *= -1;

    // محاذاة النص
    let lines = text.split("\n");
    let lines_width = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        let textWidth = ctx.measureText(line).width/ratioHigh;
        lines_width.push(textWidth);
    }

    let max_width = Math.max(...lines_width);

    // النص
    let center = (lines.length - 1) * lineHeight / 2;
    for (let i = 0; i < lines.length; i++) {
        nk = lineHeight*((lines.length-1)/2 - i); // نق
        rotateLen = 2*nk*Math.sin(toRadian(textRotate)/2); // الواصل بين النقِّين
        rotateX = Math.sin(toRadian((180-textRotate)/2))*rotateLen; // مقدار الحركة السينية
        rotateY = Math.cos(toRadian((180-textRotate)/2))*rotateLen; // مقدار الحركة الصادية

        let line = lines[i].trim();
        let textWidth = ctx.measureText(line).width/ratioHigh;
        let x = canvasHigh_.width / 2;
        let y = (canvasHigh_.height / 2) + (lineHeight * i) - center;
        let widthProplem = 0;
        if(canvasHigh_.width > 500) {
            widthProplem = (canvasHigh_.width - 500)/45;
        }
        
        let xAlign = 0;
        let yAlign = 0;
        textAlign == "right" && anchorRL == "center"? xAlign = (Math.cos(toRadian(textRotate))*(max_width - textWidth)/2 + widthProplem) : "";
        textAlign == "left"? xAlign = -1 * (Math.cos(toRadian(textRotate))*(max_width - textWidth)/2 + widthProplem) : "";

        textAlign == "right"? yAlign = Math.sin(toRadian(textRotate))*(max_width - textWidth)/2 : "";
        textAlign == "left"? yAlign = -1 * Math.sin(toRadian(textRotate))*(max_width - textWidth)/2 : "";

        // كتابة النص
        if(all_canvas == false) {
            the_ctx.save();
            the_ctx == ctx? the_ctx.translate((x + textRight + rotateX + xAlign) * ratioHigh, (y + textTop + rotateY + yAlign) * ratioHigh) : "";
            the_ctx == ctxHigh? the_ctx.translate(x + textRight + rotateX + xAlign, y + textTop + rotateY + yAlign) : "";

            the_ctx.rotate(textRotate * Math.PI / 180);
            the_ctx.textAlign = anchorRL; // موقع النص - المركز أفقيًا
            the_ctx.textBaseline = anchorUD; // موقع النص - المركز رأسيًا
            the_ctx.fillText(line, 0, 0);
            the_ctx.restore();
        } else {
            ctx.save();
            ctxHigh.save();

            ctx.translate((x + textRight + rotateX + xAlign) * ratioHigh, (y + textTop + rotateY + yAlign) * ratioHigh);
            ctxHigh.translate(x + textRight + rotateX + xAlign, y + textTop + rotateY + yAlign);

            ctx.rotate(textRotate * Math.PI / 180);
            ctx.textAlign = anchorRL; // موقع النص - المركز أفقيًا
            ctx.textBaseline = anchorUD; // موقع النص - المركز رأسيًا
            ctx.fillText(line, 0, 0);
            ctx.restore();

            ctxHigh.rotate(textRotate * Math.PI / 180);
            ctxHigh.textAlign = anchorRL; // موقع النص - المركز أفقيًا
            ctxHigh.textBaseline = anchorUD; // موقع النص - المركز رأسيًا
            ctxHigh.fillText(line, 0, 0);
            ctxHigh.restore();
        }
    }
}

// تغيير النص - أكثر من نص
function updateText(edit_low_canvas = true, edit_high_canvas = true, make_dataURL = true, fast_download = false, other_text = null) {
    let text = textInput_.value;
    let lines = text.split("\n");
    other_text == null? texts_data[active_text].text = text : texts_data[active_text].text = other_text;
    
    // وضع النص في مربع النصوص اللي فوق الموقع
    if(fast_download == false) {
        document.querySelectorAll("#items .item")[active_text].querySelector(".item-text").innerText = lines.join(" ");
    }

    // مسح الصورة
    edit_low_canvas == true? ctx.clearRect(0, 0, canvas_.width, canvas_.height) : "";
    edit_high_canvas == true? ctxHigh.clearRect(0, 0, canvasHigh_.width, canvasHigh_.height) : "";
    
    // رسم الصورة
    edit_low_canvas == true? (canvas_.width == 0? ctx.drawImage(image, 0, 0) : ctx.drawImage(image, 0, 0, canvas_.width, canvas_.height)) : "";
    edit_high_canvas == true? ctxHigh.drawImage(imageHigh_, 0, 0) : "";

    // تغيير قيمة مدخل اللون
    if(fast_download == false) {
        if(isHexInputting == 0) {
            hexColorInput_.value = textColorInput_.value.replace("#", "").toUpperCase();
        } else {
            hexColorInput_.value = hexColorInput_.value.toUpperCase();
            isHexInputting = 0;
        }
    }

    // كتابة النصوص
    for(let i = 0; i < texts_data.length; i++) {
        let text_item = texts_data[i];

        // اكتب الكلام
        if(edit_low_canvas == true && edit_high_canvas == true) {
            writeText(true, "", "", text_item.text, text_item.font_type, text_item.font_size, text_item.font_color, text_item.line_height, text_item.text_to_top, text_item.text_to_right, text_item.text_rotation, text_item.text_align, text_item.text_dir, text_item.anchor_ud, text_item.anchor_rl);
        } else {
            edit_low_canvas == true? writeText(false, canvas_, ctx, text_item.text, text_item.font_type, text_item.font_size, text_item.font_color, text_item.line_height, text_item.text_to_top, text_item.text_to_right, text_item.text_rotation, text_item.text_align, text_item.text_dir, text_item.anchor_ud, text_item.anchor_rl) : "";
            edit_high_canvas == true? writeText(false, canvasHigh_, ctxHigh, text_item.text, text_item.font_type, text_item.font_size, text_item.font_color, text_item.line_height, text_item.text_to_top, text_item.text_to_right, text_item.text_rotation, text_item.text_align, text_item.text_dir, text_item.anchor_ud, text_item.anchor_rl) : "";
        }
    }

    // تفعيل تنزيل الإقتباس
    if(make_dataURL == true) {
        canvasHigh_ = document.getElementById("canvas-high-resolution");
        let dataURL = canvasHigh_.toDataURL("image/png");
        submitButton_.href = dataURL;
    }
}

// تغيير نوع الخط
function updateFont() {
    fontType = fontTypeInput_.value.split(" ").join("+");
    fontBold = fontBoldInput_.value;
    let styles = document.querySelector("style#font-style");
    
    texts_data[active_text].font_type = fontType;
    texts_data[active_text].font_bold = fontBold;
    
    styles.innerText = "";
    for(let i = 0; i < texts_data.length; i++) {
        let text_item = texts_data[i];

        styles.innerText += '\n@import url("https://fonts.googleapis.com/css2?family=' + text_item.font_type + ':wght@' + text_item.font_bold + '&display=swap");';
    }

    choose_fast_method();
}

function make_photos(texts) {
    progress_popup.style.display = "";
    progress_bar.style.width = "0%";
    progress_p.innerText = `0/${texts.length} (0%)`;
    setTimeout(() => {
        const zip = new JSZip();
        
        texts.forEach((text, index) => {
            updateText(edit_low_canvas = false, edit_high_canvas = true, make_dataURL = false, fast_download = true, other_text = text);

            canvasHigh_.toBlob(function(blob) {
                zip.file(`${text.trim()}.png`, blob);
                let percent = Math.floor((index+1)*100/texts.length);
                progress_bar.style.width = `${percent}%`;
                progress_p.innerText = `${index+1}/${texts.length} (${percent}%)`;
                
                if (index === texts.length - 1) {
                    setTimeout(() => {
                        progress_popup.style.display = "none";
                    }, 500);

                    zip.generateAsync({ type: 'blob' }).then(function(content) {
                        saveAs(content, 'الصور.zip');
                    });
                }
            });
        });
    }, 100);
}

// تنزيل الإقتباس
submitButton_.onclick = () => {
    fastMethod == "edit"? updateText(false, true, true) : "";

    submitButton_.setAttribute("download", `${textInput_.value.split("\n").join(" ")}.png`);
};

// تفعيل خيار المطوِّر
enable_developer_.onclick = () => {
    let script_ = document.createElement('script');
    script_.src="//cdn.jsdelivr.net/npm/eruda";
    document.body.appendChild(script_);
    script_.onload = function () { eruda.init() }
    copyText(`make_photos(\`أحمد\nمحمد\nعمر\nباقي الأسامي\`.split("\\n"))`);
}
