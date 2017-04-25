/**
 * Created by wx_h0001 on 2015/12/26.
 */

$(document).ready(function () {
    freshMyPage();

    //审核请假单
    $("#tbodyExpenseConform").empty();
    $.ajax({
        url : "../../php/expenseConform.php",
        type : "POST",
        cache : false,
        data : {init:0},
        dataType : 'json',
        success : function(data){
            // alert(data);
            if(data.sum > 0)
            {
                for(var x = 0; x < data.sum; x++)
                {
                    var trID = "trExpenseConform" + x;
                    $("<tr></tr>").attr('id', trID).appendTo("#tbodyExpenseConform");
                    $("<td><label><input type='checkbox' onclick='highlightRow(this)' name='checkboxLeave' value='" + data[x]["number"] + "'></label></td>").appendTo("#" + trID);
                    $("<td class='number'></td>").text(data[x]["number"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["name"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["submitDate"]).appendTo("#" + trID);
                    $("<td></td>").html("<a role='button' onclick=expenseDetail(" + x + ")><span class='badge bg-light-blue'>More..</span>").appendTo("#" + trID)
                    switch (data[x]['state']){
                        case "1" :
                            state = "<span class='label label-primary'>编辑中</span>";
                            break;
                        case "2" :
                            state = "<span class='label label-primary'>待审核</span>";
                            break;
                        case "3" :
                            state = "<span class='label label-primary'>待财务审批</span>";
                            break;
                        case "4" :
                            state = "<span class='label label-warning'>驳回</span>";
                            break;
                        case "5" :
                            state = "<span class='label label-success'>完成</span>";
                            break;
                        case "6" :
                            state = "<span class='label label-primary'>已付款</span>";
                            break;
                        case "7" :
                            state = "<span class='label label-default'>已撤销</span>";
                            break;
                        default:
                            state = "<span class='label label-danger'>Error</span>";
                            break;
                    }
                    $("<td></td>").html(state).appendTo("#" + trID);
                }
            }
            else
            {
                $("<tr><td colspan='6'>还没有未审核的请假条</td></tr>").appendTo("#tbodyExpenseConform");
            }
        }
    })
})


function highlightRow(element)
{
    if(element.checked)
    {
        $(element).parent().parent().parent().addClass("info");
    }
    else
    {
        $(element).parent().parent().parent().removeClass("info");
    }

}

function expenseDetail(x){
    var item = $("#trExpenseConform" + x);
    var number = item.find("td:eq(1)").text();
    var submitDate = item.find("td:eq(3)").text();
    window.open("expense_confom_detail.html?x=" + number + "&d=" + submitDate);
}

$("#btnSelectAllLeave").click(function(){
    var first = $("input[name='checkboxLeave']")[0];
    if(first.checked)
    {
        $("input[name='checkboxLeave']").prop('checked', false).parent().parent().parent().removeClass("info");
    }
    else
    {
        $("input[name='checkboxLeave']").prop('checked', true).parent().parent().parent().addClass("info");
    }
})

$("#btnAgreeLeave").click(function(){
    var sum = 0;
    var conformed = new Array();
    $("input[name='checkboxLeave']:checked").each(function(){
        // alert(this.localName);
        var column = $(this).parent().parent().parent();
        column.find("td.state").html("<span class='glyphicon glyphicon-ok'></span>");
        conformed[sum] =column.find("td.number").text();
        //alert(column.find("td.number").text());
        sum++;
    })

    $.ajax({
        url : "../../php/expenseConform.php",
        traditional: true,
        type : "POST",
        cache : false,
        dataType : 'json',
        data : {"sum":sum, "conformed":JSON.stringify(conformed), "type": "agree"},
        success : function(data){
            if(data === 0)
            {
                alertMsg('审核成功！', 'success');
            }
            else
            {
                alertMsg("编号：\n" + data.join("\n") + "\n目前的状态不支持您的同意操作", "warning");
            }
        }
    })

});

$("#btnRejectLeave").click(function(){
    var sum = 0;
    var conformed = new Array();
    $("input[name='checkboxLeave']:checked").each(function(){
        var column = $(this).parent().parent().parent();
        column.find("td.state").html("<span class='glyphicon glyphicon-remove'></span>");
        conformed[sum] =column.find("td.number").text();
        //alert(column.find("td.number").text());
        sum++;
    })

    $.ajax({
        url : "../../php/expenseConform.php",
        type : "POST",
        cache : false,
        dataType : 'json',
        data : {"sum":sum, "conformed":JSON.stringify(conformed), "type": "reject"},
        success : function(data){
            if(data === 0)
            {
                alertMsg('审核成功！', "success");
            }
            else
            {
                alertMsg("编号：\n" + data.join("\n") + "\n目前的状态不支持您的驳回操作", "warning");
            }
        }
    })

});

$('#modalExpenseDetail').on('hidden.bs.modal', function () {
    $("#tbodyExpenseDetail").empty();
})