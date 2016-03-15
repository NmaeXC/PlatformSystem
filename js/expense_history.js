/**
 * Created by wx_h0001 on 2015/12/26.
 */

$(document).ready(function () {
    freshMyPage();

    //查看报销历史纪录
    $("#tbodyLeaveHisotry").empty();
    $.ajax({
        url : "../../php/expenseHistory.php",
        type : "POST",
        cache : false,
        dataType : 'json',
        success : function(data){
            //将请假条历史纪录显示到表格中
            if(data.sum > 0)
            {
                for(var x = 0; x < data.sum; x++)
                {
                    var trID = "trExpenseHistory" + x;
                    $("<tr>").attr('id', trID).appendTo("#tbodyExpenseHisotry");
                    $("<td></td>").text(data[x]["number"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["type"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["amount"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["remark"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["accepted"]).appendTo("#" + trID);

                    var state;
                    switch (data[x]['state']){
                        case "未处理" :
                            state = "<span class='label label-primary'>未处理</span>";
                            break;
                        case "同意" :
                            state = "<span class='label label-success'>同意</span>";
                            break;
                        case "驳回" :
                            state = "<span class='label label-warning'>驳回</span>";
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
                $("<tr><td colspan='6'>你还没有请假条纪录哦~</td></tr>").appendTo("#tbodyExpenseHisotry");
            }
        }
    })
})