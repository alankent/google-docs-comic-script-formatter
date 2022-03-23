/*
 * Copyright 2022 Alan Kent
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* For docs see https://github.com/alankent/google-docs-comic-script-formatter */


// Register the add-on menu item to run this reformatter
//
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Update Formatting', 'reformatDocument')
      .addToUi();
}


// On first installation, do the same registration as opening a doc.
//
function onInstall(e) {
  onOpen(e);
}


// Width of a character in points for 12 point Courier New font.
const CHAR_WIDTH = 7;

const POINTS_PER_INCH = 72;

const COLOR_DEFAULT = "#000000";

const COLOR_SUBHEADING = "#ff00ff";


// Paragraph types.
//
const ParaTypes = {
  BLANK: {
    name: "blank",
    addBlankLine: false,
  },
  H2: {
    name: "h2", 
    styles: {
      heading: DocumentApp.ParagraphHeading.HEADING2,
    },
    addBlankLine: true,
  },
  H3: {
    name: "h3",
    styles: {
      heading: DocumentApp.ParagraphHeading.HEADING3,
    },
    addBlankLine: true,
  },
  H4: {
    name: "h4",
    styles: {
      heading: DocumentApp.ParagraphHeading.HEADING4,
    },
    addBlankLine: true,
  },
  H5: {
    name: "h5",
    styles: {
      heading: DocumentApp.ParagraphHeading.HEADING5,
    },
    addBlankLine: true,
  },
  H6: {
    name: "h6",
    styles: {
      heading: DocumentApp.ParagraphHeading.HEADING6,
    },
    addBlankLine: true,
  },
  LOCATION: {
    name: "location",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 0,
      rightIndent: 0,
      bold: true,
      color: COLOR_DEFAULT,
    },
    addBlankLine: true,
  },
  PARENTHETICAL: {
    name: "paren",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 2 * POINTS_PER_INCH,
      rightIndent: 1 * POINTS_PER_INCH,
      color: COLOR_DEFAULT,
    },
    addBlankLine: false,
  },
  CHARACTER: {
    name: "char",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 2.5 * POINTS_PER_INCH,
      rightIndent: 1.5 * POINTS_PER_INCH,
      color: COLOR_DEFAULT,
    },
    addBlankLine: false,
  },
  CENTER: {
    name: "center",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 0,
      rightIndent: 0,
      alignment: DocumentApp.HorizontalAlignment.CENTER,
      color: COLOR_DEFAULT,
    },
    addBlankLine: true,
  },
  INSTRUCTION: {
    name: "instruction",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 0,
      rightIndent: 0,
      alignment: DocumentApp.HorizontalAlignment.RIGHT,
      color: COLOR_DEFAULT,
    },
    addBlankLine: true,
  },
  ACTION: {
    name: "action",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 0.5 * POINTS_PER_INCH,
      rightIndent: 0,
      color: COLOR_DEFAULT,
    },
    addBlankLine: true,
  },
  DIALOG: {
    name: "dialog",
    styles: {
      heading: DocumentApp.ParagraphHeading.NORMAL,
      leftIndent: 1.5 * POINTS_PER_INCH,
      rightIndent: 0.5 * POINTS_PER_INCH,
      color: COLOR_DEFAULT,
    },
    addBlankLine: true,
  }
};


// Parse a line (paragraph) to recognize what it is
//
function getLine(body, i) {

  var child = body.getChild(i);
  if (child.getType() != DocumentApp.ElementType.PARAGRAPH) {
    return null;
  }

  var str = child.getText();

  if (str.match(/^$/)) {
    return { type: ParaTypes.BLANK, text: str };
  }

  if (str.match(/^(int|ext)[.]? /i)) {
    return { type: ParaTypes.LOCATION, text: str };
  }

  if (str.match(/^# /)) {
    return { type: ParaTypes.H2, text: str };
  }

  if (str.match(/^## /)) {
    return { type: ParaTypes.H3, text: str };
  }

  if (str.match(/^### /)) {
    return { type: ParaTypes.H4, text: str };
  }

  if (str.match(/^#### /)) {
    return { type: ParaTypes.H5, text: str };
  }

  if (str.match(/^##### /)) {
    return { type: ParaTypes.H6, text: str };
  }

  if (str.match(/^\(.*\)$/)) {
    return { type: ParaTypes.PARENTHETICAL, text: str };
  }

  if (str.match(/^-.*-$/)) {
    return { type: ParaTypes.CHARACTER, text: str };
  }

  if (str.match(/^>.*<$/)) {
    return { type: ParaTypes.CENTER, text: str };
  }

  if (str.match(/:$/)) {
    return { type: ParaTypes.INSTRUCTION, text: str };
  }

  if (str.match(/[a-z]/)) {
    return { type: ParaTypes.ACTION, text: str };
  }

  return { type: ParaTypes.DIALOG, text: str };
}


// Run through the document line by line, applying styles.
//
function reformatDocument() {

  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  var skipIntro = true;
  var i = 0;
  while (i < body.getNumChildren()) {

    var line = getLine(body, i);
    if (line && (line.type.name == ParaTypes.LOCATION.name || line.type.name == ParaTypes.H2.name)) {
      skipIntro = false;
    }

    if (skipIntro || line == null || line.type == null) {

      i++;

    } else if (line.type.name == ParaTypes.BLANK.name) {

      // Remove blank lines (we add in ones where we think they should be)
      // But cannot remove last paragraph in document.
      if (i == body.getNumChildren() - 1) {
        break;
      }
      body.removeChild(body.getChild(i));

    } else {

      // General formatting rules apply.
      applyStyles(body.getChild(i++), line.type.styles);
      if (line.type.addBlankLine) {
        addBlankLine(body, i++);
      }

    }
  }
}


// Add a blank line at the specified index.
//
function addBlankLine(body, index) {
  var newPara = body.insertParagraph(index, "");
  newPara.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  newPara.setIndentFirstLine(0);
  newPara.setIndentStart(0);
  newPara.setIndentEnd(0);
  newPara.setForegroundColor(COLOR_DEFAULT);
}


// Apply styles to existing paragraph.
//
function applyStyles(para, styles) {

  if (styles.heading != undefined) {
    para.setHeading(styles.heading);
  }
  if (styles.leftIndent != undefined) {
    para.setIndentFirstLine(styles.leftIndent);
    para.setIndentStart(styles.leftIndent);
  }
  if (styles.rightIndent != undefined) {
    para.setIndentEnd(styles.rightIndent);
  }
  if (styles.alignment != undefined) {
    para.setAlignment(styles.alignment);
  }
  if (styles.color != undefined) {
    para.setForegroundColor(styles.color);
  }
  if (styles.bold != undefined) {
    for (var i = 0; i < para.getNumChildren(); i++) {
      para.getChild(i).setBold(styles.bold);
    }
  }

  // Look for [...] at start of paragraph.
  if (para.getNumChildren() > 0) {
    var text = para.getChild(0);
    var m = text.getText().match(/^\[.*\]/);
    if (m) {
      text.setBold(0, m[0].length, true);
    }
  }
}
