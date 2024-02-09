#target illustrator

if (app.documents.length > 0) {
    var win = new Window("dialog", "mTools - Insert Page Numbers v 2");
    var panelMargins = win.add("panel", undefined, "Margins");
    var lblMargins = panelMargins.add("statictext", undefined, "Margins (mm):");
    var lblTopMargin = panelMargins.add("statictext", undefined, "Top:");
    var lblRightMargin = panelMargins.add("statictext", undefined, "Right:");
    var txtTopMargin = panelMargins.add("statictext", undefined, "20 points");
    var txtRightMargin = panelMargins.add("statictext", undefined, "40 points");


    var panelLocation = win.add("panel", undefined, "Location");
    var radTop = panelLocation.add("radiobutton",undefined,"Top");
    var radBottom = panelLocation.add("radiobutton",undefined, "Bottom"); 

    var panelAlignment = win.add("panel", undefined, "Alignment");
    var radLeft = panelAlignment.add("radiobutton",undefined,"Left");
    var radCenter = panelAlignment.add("radiobutton",undefined, "Center"); 
    var radRight = panelAlignment.add("radiobutton",undefined, "Right"); 

    var panelFooter = win.add("panel", undefined, "Text to insert");

    var grpPages = panelFooter.add("group");
    var btnPage = grpPages.add("button",undefined,"P");
    var btnPages = grpPages.add("button",undefined,"Ps");
    var btnDate = grpPages.add("button",undefined,"D");
    var btnTime = grpPages.add("button", undefined, "T");
    var btnFullName = grpPages.add("button", undefined, "fFn");
    var btnFile = grpPages.add("button", undefined, "Fn");

    var txtFooter = panelFooter.add("edittext"); //,undefined, "[Type text to insert here]"); 
    var btnClear = panelFooter.add("button", undefined, "C");
    btnPage.size = btnPages.size = btnDate.size = btnTime.size = btnFullName.size = btnFile.size = btnClear.size = [30,21];

    var btnOk = win.add("button", undefined, "Ok");

    radRight.value = radBottom.value = true;

    win.alignChildren = panelFooter.alignChildren = "fill";
    btnClear.alignment = "left";
    panelMargins.spacing = 3;
    panelMargins.orientation = panelLocation.orientation = panelAlignment.orientation = "row";
    
    win.helpTip = "Coded by CarlosCanto";
    btnPage.helpTip = "Adds *page* keyword, it represents a single page";
    btnPages.helpTip = "Adds *pages* keyword, it represents total number of pages";
    btnDate.helpTip = "Adds *date* keyword, it represents today's date";
    btnTime.helpTip = "Adds *time* keyword, it represents current time";
    btnFullName.helpTip = "Adds *fname* keyword, it represents Full File Name (including path)";
    btnFile.helpTip = "Adds *file* keyword, it represents File Name";
    btnClear.helpTip = "Clears input text area";
    txtFooter.helpTip = "Type \r\t'Page *page* of *pages*' \rto get \r\t'Page 1 of 3' \rfor example";


    //-----------------------------------------------------------------------------------------
    // text place holder by Jongware / Marc Autret
    var wgx = win.graphics;
    var grayPen = wgx.newPen(wgx.PenType.SOLID_COLOR,[.67,.67,.67], 1);

    txtFooter.onDraw = function(/*DrawState*/)
    {
        var gx = this.graphics;
        gx.drawOSControl();
        this.text || this.active || gx.drawString("[Type text to insert here]", grayPen, 0, 0);
    };		
    
    //-----------------------------------------------------------------------------------------
                    btnOk.onClick = function(){
                        doSomething(); // call main function
                        //win.close(); // close when done
                     }
    //-----------------------------------------------------------------------------------------
    
    //-----------------------------------------------------------------------------------------
                    btnClear.onClick = function(){
                        txtFooter.text = ""; // call main function
                        //win.close(); // close when done
                     }
    //-----------------------------------------------------------------------------------------		
    //-----------------------------------------------------------------------------------------
                    btnPage.onClick = function(){
                        footer("*page*");
                     }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
                    btnPages.onClick = function(){
                        footer("*pages*");
                     }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
                    btnDate.onClick = function(){
                        footer("*date*");
                     }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
                    btnTime.onClick = function(){
                        footer("*time*");
                     }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
                    btnFullName.onClick = function(){
                        footer("*fname*");
                     }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
                    btnFile.onClick = function(){
                        footer("*file*");
                     }
    //-----------------------------------------------------------------------------------------
                    win.center();
                    win.show();
                    
    //-----------------------------------------------------------------------------------------


    function footer (page) // 
        {
            txtFooter.text = txtFooter.text + page;
        }

    function doSomething() {
        var idoc = app.activeDocument;
        try {
            var ilayer = idoc.layers["Page Numbers"];
        } catch (e) {
            var ilayer = idoc.layers.add();
            ilayer.name = "Page Numbers";
        }

        var pages = idoc.artboards.length;
        var datee = getCurrentDateFormatted();
        var timee = getCurrentTimeFormatted();
        var fname = idoc.path == '' ? "Full Name: <unsaved document>" : idoc.fullName;
        var file = idoc.name;

        var footerPages = (txtFooter.text).replace("*pages*", pages);
        footerPages = footerPages.replace("*pages*", pages);
        footerPages = footerPages.replace("*date*", datee);
        footerPages = footerPages.replace("*time*", timee);
        footerPages = footerPages.replace("*fname*", fname);
        footerPages = footerPages.replace("*file*", file);

        var margins = [20, 40]; // Set margins in points

        for (i = 0; i < idoc.artboards.length; i++) {
	    var footerPage = ("0" + (i + 1)).slice(-2) + "/" + (pages > 9 ? "" : "0") + pages;
            var footerPagesLoop = footerPages.replace("*page*", footerPage);

            //var footerPage = ("0" + (i + 1)).slice(-2) + "/" + (pages > 9 ? "" : "0") + pages;

            var itext = ilayer.textFrames.add();
            itext.contents = footerPagesLoop;
            var fontSize = itext.textRange.characterAttributes.size;

            var activeAB = idoc.artboards[i];
            var iartBounds = activeAB.artboardRect;

            var ableft = iartBounds[0] + margins[1];
            var abtop = iartBounds[1] - margins[0];
            var abright = iartBounds[2] - margins[1];
            var abbottom = iartBounds[3] + margins[0] + fontSize;
            var abcenter = ableft + (abright - ableft) / 2;

            if (radRight.value == true) {
                itext.left = abright;
                itext.textRange.paragraphAttributes.justification = Justification.RIGHT;
            } else if (radCenter.value == true) {
                itext.left = abcenter;
                itext.textRange.paragraphAttributes.justification = Justification.CENTER;
            } else {
                itext.left = ableft;
                itext.textRange.paragraphAttributes.justification = Justification.LEFT;
            }

            if (radTop.value == true) {
                itext.top = abtop;
            } else {
                itext.top = abbottom;
            }
            itext.textRange.characterAttributes.textFont = textFonts.getByName("ProximaNova-Regular");
            itext.textRange.characterAttributes.size = 8;
        }
        app.redraw();
    }
} else {
    alert("There's no open document.");
}

/**
 * Liefert das aktuelle Datum formatiert zurück
 * @return {String}      Aktuelles Datum im Format DD.MM.YYYY
 */
function getCurrentDateFormatted() { 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString?retiredLocale=de
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#datestyle
    var options = { dateStyle: 'long'};
    return new Date().toLocaleDateString('de-CH', options);
}

/**
 * Liefert die aktuelle Zeit formatiert zurück
 * @return {String}      Aktuelles Uhrzeit im 12H Format HH:MM AM/PM
 */
function getCurrentTimeFormatted() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString?retiredLocale=de
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timestyle
    var options = { timeStyle: 'long', hour12: true };
    return new Date().toLocaleTimeString('de-CH', options);
}
