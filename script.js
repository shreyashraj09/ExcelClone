let defaultProperties = {
  text: "",
  "font-style": "",
  "font-weight": "",
  "text-decoration": "",
  "color": "#000000",
  "text-align": "left",
  "background-color": "#ffffff",
  "font-family": "Noto Sans",
  "font-size": "14px"
}
let cellData = {
  "Sheet1": {
  }
}
let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastAddedSheet = 1;

$(document).ready(function () {
  let cellContainer = ".input-cell-conatainer";
  for (let i = 1; i <= 100; i++) {
    let ans = "";
    let n = i;
    while (n) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(i / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }
    let column = $(
      `<div class="col-name colId-${i}" id="colCode-${ans}">${ans}</div>`
    );
    $(".column-name-conatiner").append(column);
    // console.log(ans);
    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`)
    $(".row-name-container").append(row);
  }
  for (let i = 1; i <= 100; i++) {
    let rowcell = $(` <div class="cell-row"></div> `);
    for (let j = 1; j <= 100; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let col = $(` <div class="input-cell " contenteditable="false" id="row-${i}-col-${j}"
      data="code-${colCode}"></div>`);
      rowcell.append(col);
    }
    $(".input-cell-container").append(rowcell);
  }
  $(".align-icon").click(function () {
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
  })
  $('.style-icon').click(function () {
    $(this).toggleClass("selected");
  })
  $(".input-cell").click(function (e) {
    // console.log(e);
    if (e.ctrlKey) {
      let [rowId, colId] = getRowCol(this);
      if (rowId > 1) {
        let topcellselected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
        if (topcellselected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (rowId < 100) {
        let bottomcellselected = $(`#row-${rowId + 1}-col-${colId}`).hasClass("selected");
        if (bottomcellselected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
        }
      }
      if (rowId > 1) {
        let topcellselected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
        if (topcellselected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (colId > 1) {
        let leftcellselected = $(`#row-${rowId}-col-${colId - 1}`).hasClass("selected");
        if (leftcellselected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
        }
      }
      if (colId < 100) {
        let rightcellselected = $(`#row-${rowId}-col-${colId + 1}`).hasClass("selected");
        if (rightcellselected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
        }
      }

    }
    else {
      $(".input-cell.selected").removeClass("selected");
    }
    $(this).addClass("selected");
    changeHeader(this);
  });
  function changeHeader(ele) {
    let [rowId, colId] = getRowCol(ele);
    let cellinfo = defaultProperties;
    if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
      cellinfo = cellData[selectedSheet][rowId][colId];
    }
    cellinfo['font-weight'] ? $('.icon-bold').addClass('selected') : $('.icon-bold').removeClass('selected');
    // console.log(cellinfo['font-weight']);
    cellinfo['font-style'] ? $('.icon-italic').addClass('selected') : $('.icon-italic').removeClass('selected');
    cellinfo['text-decoration'] ? $('.icon-underline').addClass('selected') : $('.icon-underline').removeClass('selected');
    // console.log(cellinfo);
    let alignment = cellinfo['text-align'];
    // console.log(align);
    $('.align-icon.selected').removeClass('selected');
    $('.icon-align_' + alignment).addClass('selected');
    $('.background-color-picker').val(cellinfo['background-color']);
    $('.text-color-picker').val(cellinfo['color']);
    $('font-family-selector').val(cellinfo['font-family']);
    $('font-size-selector').val(cellinfo['font-size']);

  }
  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  })
  $(".input-cell").blur(function () {
    $(this).attr("contenteditable", "false");
    updateCell('text', $(this).text());
  })
  $(".input-cell-container").scroll(function () {
    $(".column-name-conatiner").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  })
});
function getRowCol(ele) {
  let idArray = $(ele).attr("id").split("-");
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}
function updateCell(property, value, defaultPossible) {
  //  console.log(property);
  $(".input-cell.selected").each(function () {
    $(this).css(property, value);
    let [rowId, colId] = getRowCol(this);
    if (cellData[selectedSheet][rowId]) {
      if (cellData[selectedSheet][rowId][colId]) {
        cellData[selectedSheet][rowId][colId][property] = value;
      }
      else {
        cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
        cellData[selectedSheet][rowId][colId][property] = value;
      }

    }
    else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
      cellData[selectedSheet][rowId][colId][property] = value;

    }
    // console.log(defaultPossible ,(JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties)) );
    // console.log(cellData[selectedSheet][rowId][colId], defaultProperties);

    if (defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))) {
      // console.log(defaultPossible);
      delete cellData[selectedSheet][rowId][colId];
      if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
        delete (cellData[selectedSheet][rowId]);
      }
    }
  });
  console.log(cellData);

}
$('.icon-bold').click(function () {
  if ($(this).hasClass("selected")) {

    updateCell("font-weight", "", true);

  }
  else {
    updateCell("font-weight", "bold", false);
  }
})
$('.icon-italic').click(function () {
  if ($(this).hasClass("selected")) {

    updateCell("font-style", "", true);
  }
  else {
    updateCell("font-style", "italic", false);
  }
})
$('.icon-underline').click(function () {
  if ($(this).hasClass("selected")) {

    updateCell("text-decoration", "", true);
  }
  else {
    updateCell("text-decoration", "underline", false);
  }
})
$('.icon-align_left ').click(function () {
  if (!($(this).hasClass('selected'))) {
    updateCell("text-align", "left", true);
  }
})
$('.icon-align_right ').click(function () {
  if (!($(this).hasClass('selected'))) {
    updateCell("text-align", "right", false);
  }
})
$('.icon-align_center').click(function () {
  if (!($(this).hasClass('selected'))) {
    updateCell("text-align", "center", false);
  }
})
$('.color-fill-icon').click(function () {
  // console.log("clicked");
  $(".background-color-picker").click();
})
$('.color-text-icon').click(function () {
  // console.log("clicked");
  $(".text-color-picker").click();
})
$(".background-color-picker").change(function () {
  updateCell("background-color", $(this).val());
})
$(".text-color-picker").change(function () {
  updateCell("color", $(this).val());
})
$('.font-family-selector').change(function () {
  updateCell('font-family', $(this).val());
})
$('.font-size-selector').change(function () {
  updateCell('font-size', $(this).val());
})
function emptysheets() {
  let sheetInfo = cellData[selectedSheet];
  // console.log("Hello!");
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      $(`#row-${i}-col-${j}`).text("");
      $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
      $(`#row-${i}-col-${j}`).css("color", "#000000");
      $(`#row-${i}-col-${j}`).css("text-align", "left");
      $(`#row-${i}-col-${j}`).css("font-size", "14px");
      $(`#row-${i}-col-${j}`).css("font-weight", "");
      $(`#row-${i}-col-${j}`).css("font-style", "");
      $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
    }
  }
}
function loadSheet() {
  let sheetInfo = cellData[selectedSheet];
  // console.log("Hello!");
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cellInfo = cellData[selectedSheet][i][j];
      $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
      $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
      $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
      $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
      $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
      $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
      $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
      $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
    }
  }
}
$(".icon-add").click(function () {
  emptysheets();
  $(".sheet-tab.selected").removeClass("selected");
  let sheetName = "Sheet" + (lastAddedSheet + 1);
  cellData[sheetName] = {};
  totalSheets += 1;
  lastAddedSheet += 1;
  selectedSheet = sheetName;
  $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
  addSheetEvents();
})
function addSheetEvents() {
  $(".sheet-tab.selected").click(function () {
    if (!$(this).hasClass("selected")) {
      selectSheet(this);
    }
  })
  $(".sheet-tab.selected").contextmenu(function (e) {
    // console.log(e);
    e.preventDefault();
    selectSheet(this);
    if (!$(".sheet-options-modal").length) {
      selectedSheet = $(this).text();
      // console.log($(".sheet-options-modal").length);
      $(".container").append(` <div class="sheet-options-modal">
                                <div class="sheet-rename">Rename</div>
                                <div class="sheet-delete">Delete</div>
                                </div>`);
      $(".sheet-options-modal").css("left", e.pageX + "px");
      $(".sheet-rename").click(function () {
        $(".container").append(`<div class="sheet-rename-modal">
                                <h4 class="modal-title">Rename Sheet To:</h3>
                                <input type="text" class="new-sheet-name" placeholder="Sheet Name">
                                <div class="action-buttons">
                                  <div class="submit-button">Rename</div>
                                  <div class="cancel-button">Cancel</div>  
                                </div>
                                </div>`)
        $(".cancel-button").click(function () {
          // console.log("JI HANN");
          $(".sheet-rename-modal").remove();
        })
        $(".submit-button").click(function () {
          let newSheetName = $(".new-sheet-name").val();
          // console.log(newSheetName);
          $(".sheet-tab.selected").text(newSheetName);
          let newCellData = {};
          for (let key in cellData) {
            if (key != selectedSheet)
              newCellData[key] = cellData[key]
            else {
              newCellData[newSheetName] = cellData[key];
            }
          }
          cellData = newCellData;
          // cellData[newSheetName]=cellData[selectedSheet];
          // delete cellData[selectedSheet];
          selectedSheet = newSheetName;
          $(".sheet-rename-modal").remove();
        })

      })
      $(".sheet-delete").click(function () {
        $(".container").append(`<div class="delete-sheet-alert">
                                <h3>
                                  Do you really want to delete?
                                </h3>
                                <div class="action-buttons">
                                  <div class="yes-button">Yes</div>
                                  <div class="no-button">No</div>
                                </div> 
                              </div>`)
        $(".yes-button").click(function(){
          if (totalSheets > 1) {
            let currSheetName = selectedSheet;
            let currSheet = $('.sheet-tab.selected');
            let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
            if (!currSheetIndex) {
              $(".sheet-tab.selected").next().click();
              totalSheets -= 1;
            }
            else {
              $(".sheet-tab.selected").prev().click();
              totalSheets -= 1;
            }
            delete cellData[currSheetName];
            currSheet.remove();
            // $(".sheet-tab.selected").remove();
            // selectSheet();
            console.log(currSheetIndex);
            $(".delete-sheet-alert").remove();
          }
          else {
            $(".container").append(` <div class="delete-not-possible">
                                  <h3>Delete not Posible, Only one Sheet Available!</h3> 
                                  <div class="action-buttons">
                                  <span class="ok-button">OK</span>
                                  </div>
                                </div>`)
            $(".delete-sheet-alert").remove();
            $(".ok-button").click(function(){
              $(".delete-not-possible").remove();
            })
          }
         
        })
        $(".no-button").click(function(){
          console.log("JI BHAIII");
          $(".delete-sheet-alert").remove();
        })
    

      })

    }
  })
}
addSheetEvents();
$(".container").click(function () {
  $(".sheet-options-modal").remove();
  // $(".sheet-rename-modal").remove();
})
function selectSheet(ele) {
  // console.log("hello ji"); 
  $(".sheet-tab.selected").removeClass("selected");
  $(ele).addClass("selected");
  emptysheets();
  selectedSheet = $(ele).text();
  // console.log(selectedSheet);
  loadSheet();
}
$(".icon-left-scroll").click(function () {
  // console.log("Click toh HUa hu");
    $(".sheet-tab.selected").prev().click();
})
$(".icon-right-scroll").click(function () {
  // console.log("Click toh HUa hu");
    $(".sheet-tab.selected").next().click();
})