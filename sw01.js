var numRows = 1, numPeople = 3, numDivRows = 0;

function SelectAllShare(source) {
	// Get the row number
    var rowN = source.id.replace(/selAllShare/, '');
    checkboxes = document.getElementsByName('shareCheck' + rowN);
    for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}

function SelectAllPay(source) {
    // Get the row number
    var rowN = source.id.replace(/selAllPay/, '');
    checkboxes = document.getElementsByName('payCheck' + rowN);
    for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
    }
}

function AddRow() {
    numRows++;
    var newRow = '<tbody id="inputRowGroup'+ numRows + '">';
        newRow += '<tr class="info" id="inputRow1st">';
        newRow += '<td rowspan="2"> <input type="text" placeholder="Items" name="itemNames" /></td>';
        newRow += '<td rowspan="2"> <input type="number" step="0.01" min="0" placeholder="$$.$$" name="moneyAmount'+numRows+'" id="moneyAmount'+numRows+'"/></td>';
        newRow += '<td> Shared by </td>';
        newRow += '<td> <input type="checkbox" name="selAllShare'+ numRows + '" id="selAllShare'+ numRows + '" onClick="SelectAllShare(this)" /> Select all </td>';
        for(var i=0;i<numPeople;i++) {
        newRow += '<td> <input type="checkbox" name="shareCheck'+ numRows + '"/> </td>';
        }
        newRow += '</tr>';
        newRow += '<tr id="inputRow2nd">';
        newRow += '<td> Paid by </td>';
        newRow += '<td> <input type="checkbox" name="selAllPay'+ numRows + '" id="selAllPay'+ numRows + '" onClick="SelectAllPay(this)"/> Select all </td>';
        for(var i=0;i<numPeople;i++) {
        newRow += '<td> <input type="checkbox" name="payCheck'+ numRows + '"/> </td>';
        }
        newRow += '</tr>';
        newRow += '</tbody>';
        $(newRow).appendTo('#moneyTable');
}

function AddDivRow() {
    numDivRows++;
    var newRow = '<tbody id="divRowGroup'+ numDivRows + '">';
        newRow += '<tr class="info" id="divRow1st">';
        newRow += '<td rowspan="2"> <input type="text" placeholder="Items" name="itemNames" /></td>';
        newRow += '<td rowspan="2"> <input type="number" step="0.01" min="0" placeholder="$$.$$" name="divMoneyAmount'+numDivRows+'" id="divMoneyAmount'+numDivRows+'"/></td>';
        newRow += '<td> Shared by </td>';
        newRow += '<td> head count: </td>';
        for(var i=0;i<numPeople;i++) {
        newRow += '<td> <input type="number" step="1" min="0" value="1" name="shareHeadCount'+ numDivRows + '"/> </td>';
        }
        newRow += '</tr>';
        newRow += '<tr id="divRow2nd">';
        newRow += '<td> Paid by </td>';
        newRow += '<td> head count:</td>';
        for(var i=0;i<numPeople;i++) {
        newRow += '<td> <input type="number" step="1" min="0" value="0" name="payHeadCount'+ numDivRows + '"/> </td>';
        }
        newRow += '</tr>';
        newRow += '</tbody>';
        $(newRow).appendTo('#moneyTable');
}

function RemoveRow() {
    if (numRows>0) {
        $('#inputRowGroup'+numRows).remove();
        numRows--;
    }
}

function AddPeople() {
    numPeople++;
    $('#preBalanceRow').append('<td> <input type="number" step="0.01" value="0" name="preBalance'+numPeople+'" id="preBalance'+numPeople+'"/> </td>');
    $('#balanceRow').append('<td id="balance'+numPeople+'"></td>');
    $('#headRow').append('<th><input type="text" placeholder="Name" name="peopleName" /></th>');
    for(var i=0;i<numRows;i++) {
        $('tbody#inputRowGroup'+(i+1)).children('#inputRow1st').append('<td> <input type="checkbox" name="shareCheck'+(i+1)+'"/> </td>');
        $('tbody#inputRowGroup'+(i+1)).children('#inputRow2nd').append('<td> <input type="checkbox" name="payCheck'+(i+1)+'"/> </td>');
    }

    for(var i=0;i<numDivRows;i++) {
        $('tbody#divRowGroup'+(i+1)).children('#divRow1st').append('<td> <input type="number" step="1" min="0" value="1" name="shareHeadCount'+ (i+1) + '"/> </td>');
        $('tbody#divRowGroup'+(i+1)).children('#divRow2nd').append('<td> <input type="number" step="1" min="0" value="0" name="payHeadCount'+ (i+1) + '"/> </td>');
    }
}

function CalculateBalance() {
    for(var i=0;i<numPeople;i++) { // i is the people counter
        var balance = parseFloat($('#preBalance'+(i+1)).val());
        for(var j=0;j<numRows;j++) {
            var moneySpend = parseFloat($('#moneyAmount'+(j+1)).val());
            var shareCount = $('input[name="shareCheck'+(j+1)+'"]:checked').length;
            var payCount = $('input[name="payCheck'+(j+1)+'"]:checked').length;
            var shareBoxes = $('input[name="shareCheck'+(j+1)+'"]');
            var payBoxes = $('input[name="payCheck'+(j+1)+'"]');
            if (shareCount > 0 && payCount > 0) {
                if ($(shareBoxes[i]).is(':checked')) {
                    balance -= (moneySpend/shareCount);
                }
                if ($(payBoxes[i]).is(':checked')) {
                    balance += (moneySpend/payCount);
                }
            }
            else {
                balance += 0;
            }
        }
        for(var k=0;k<numDivRows;k++) {
            var moneyDiv = parseFloat($('#divMoneyAmount'+(k+1)).val());
            var shareHeadCountArr = $('input[name="shareHeadCount'+(k+1)+'"]').map(function(){return parseFloat($(this).val());}).get();
            var payHeadCountArr = $('input[name="payHeadCount'+(k+1)+'"]').map(function(){return parseFloat($(this).val());}).get();
            var shareSum = shareHeadCountArr.reduce(function(a, b) { return a + b; }, 0);
            var paySum = payHeadCountArr.reduce(function(a, b) { return a + b; }, 0);
            if (shareSum > 0.01 && paySum > 0.01) {
                balance += moneyDiv * ((payHeadCountArr[i]/paySum) - (shareHeadCountArr[i]/shareSum));
            }
            else {
                balance += 0;
            }
        }

        $('#balance'+(i+1)).html(balance.toFixed(2));
    }
}

function CaptureImg() {
    html2canvas([document.getElementById('moneyTable')], {
        onrendered: function (canvas) {
            var imagedata = canvas.toDataURL('image/png');
            var imgdata = imagedata.replace(/^data:image\/(png|jpg);base64,/, "");
            //ajax call to save image inside folder
            $.ajax({
                url: 'save.php',
                data: {
                       imgdata:imgdata
                       },
                type: 'post',
                success: function (response) {
                   console.log(response);
                   $('#image_id img').attr('src', response);
                }
            });
        }
    });
}
//$(document).ready(function () {
//    $('#addRow').click(function () {
//        AddRow()
//    });
//});
