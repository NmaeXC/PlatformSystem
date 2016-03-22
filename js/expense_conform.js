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
                    $("<td class='state'></td>").appendTo("#" + trID);

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
    number = item.find("td:eq(1)").text();
    $.ajax({
        url : "../../php/expenseConform.php",
        type : "POST",
        cache : false,
        data : {'detailNumber' : number},
        async : false,
        dataType : 'json',
        success : function (data) {
            $("#detailNumber").text(number);
            $("#detailSubmitDate").text(item.find("td:eq(3)").text());
            $("#detailName").text(data["name"]);
            $("#detailUid").text(data["uid"]);
            $("#detailDepartment").text(data["department"]);
            $("#detailTitle").text(data["title"]);

            if (data.sum > 0)
            {
                for(var i = 0; i < data.sum; i++)
                {
                    var tr1ID = "tr1Detail" + i;
                    var tr2ID = "tr2Detail" + i;

                    $("<tr>").attr('id', tr1ID).appendTo("#tbodyExpenseDetail");
                    $("<td rowspan='2'></td>").text((i+1) + ".").appendTo("#" + tr1ID);
                    $("<td></td>").text(data[i].type).appendTo("#" + tr1ID);
                    $("<td></td>").text(data[i].date).appendTo("#" + tr1ID);
                    $("<td></td>").text(data[i].amount).appendTo("#" + tr1ID);
                    $("<td></td>").text(data[i].attachment).appendTo("#" + tr1ID);

                    $("<tr>").attr('id', tr2ID).appendTo("#tbodyExpenseDetail");
                    $("<td><strong>备注：</strong></td>").appendTo("#" + tr2ID);
                    $("<td colspan='3'></td>").text(data[i].remark).appendTo("#" + tr2ID);

                }
            }
            else
            {
                $("<tr><td colspan='5'></td></td></tr>").text("无报销条目。。。").appendTo("#tbodyExpenseDetail");
            }


            $("#detailAccepter").text(item.find("td:eq(3)").text());
            $("#detailState").text(item.find("td:eq(4)").find("span").text());
            $("#modalExpenseDetail").modal("show");

        }
    })
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
            if(data == '')
            {
                alert('审核成功！');
            }
            else
            {
                alert("编号：\n" + data.join("\n") + "\n已经同意,请勿再次操作");
            }
        }
    })

})

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
            if(data == '')
            {
                alert('审核成功！');
            }
            else
            {
                alert("编号：\n" + data.join("\n") + "\n已经驳回,请勿再次操作");
            }
        }
    })

})

$('#modalExpenseDetail').on('hidden.bs.modal', function () {
    $("#tbodyExpenseDetail").empty();
})