/**
 * Created by wx_h0001 on 2015/12/26.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();

    //审核请假单
    $("#tbodyLeaveConform").empty();
    $.ajax({
        url : "../../php/leaveconform.php",
        type : "POST",
        cache : false,
        data : {conformedleave:0},
        dataType : 'json',
        success : function(data){
            // alert(data);
            if(data.sum > 0)
            {
                for(var x = 0; x < data.sum; x++)
                {
                    var trID = "trLeaveConform" + x;
                    $("<tr></tr>").attr('id', trID).appendTo("#tbodyLeaveConform");
                    $("<td><label><input type='checkbox' onclick='highlightRow(this)' name='checkboxLeave' value='" + data[x]["id"] + "'></label></td>").appendTo("#" + trID);
                    $("<td class='number'></td>").text(data[x]["number"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["name"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["startTime"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["endTime"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["reason"]).appendTo("#" + trID);
                    var param = "select_leave_img('" + data[x]["attachment"] + "')";
                    $("<td></td>").html("<a role='button' onclick=" + param + ">IMG").appendTo("#" + trID);
                    $("<td></td>").text(data[x]["remark"]).appendTo("#" + trID);
                    $("<td class='state'></td>").appendTo("#" + trID);

                }
            }
            else
            {
                $("<tr><td colspan='8'>还没有未审核的请假条</td></tr>").appendTo("#tbodyLeaveConform");
            }


        }
    })
})

function select_leave_img(attachment)
{
    $("#leave_img").attr('src', '../data/leavenote/' + attachment);
    $("#modalLeaveIMG").modal("show");
}

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
        alert(column.find("td.number").text());
        sum++;
    })

    $.ajax({
        url : "../../php/leaveconform.php",
        traditional: true,
        type : "POST",
        cache : false,
        dataType : 'json',
        data : {"sum":sum, "conformed":conformed, "type": "agree"},
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
        // alert(this.localName);
        $(this).parent().parent().parent().find("td#state").html("<span class='glyphicon glyphicon-remove'></span>");
        conformed[sum] = $(this).find("td.number").val();
        sum++;
    })

    $.ajax({
        url : "../../php/leaveconform.php",
        type : "POST",
        cache : false,
        dataType : 'json',
        data : {"sum":sum, "conformed":conformed, "type": "reject"},
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