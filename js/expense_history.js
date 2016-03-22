/**
 * Created by wx_h0001 on 2015/12/26.
 */

$(document).ready(function () {
    freshMyPage();

    $('#modalLeaveDetail').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        }
    });

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
                    $("<tr>").attr('id', trID).appendTo("#tbodyExpenseHistory");
                    $("<td></td>").text((x+1) + '.').appendTo("#" + trID);
                    $("<td></td>").text(data[x]["number"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["submitDate"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["accepted"]).appendTo("#" + trID);

                    var state;
                    switch (data[x]['state']){
                        case "1" :
                            state = "<span class='label label-primary'>编辑中</span>";
                            break;
                        case "2" :
                            state = "<span class='label label-primary'>待审核</span>";
                            break;
                        case "3" :
                            state = "<span class='label label-success'>同意</span>";
                            break;
                        case "4" :
                            state = "<span class='label label-warning'>驳回</span>";
                            break;
                        case "5" :
                            state = "<span class='label label-primary'>已付款</span>";
                            break;
                        case "6" :
                            state = "<span class='label label-primary'>已撤销</span>";
                            break;
                        default:
                            state = "<span class='label label-danger'>Error</span>";
                            break;
                    }
                    $("<td></td>").html(state).appendTo("#" + trID);
                    $("<td></td>").html("<a role='button' onclick=expenseDetail(" + x + ")><span class='badge bg-light-blue'>More..</span>").appendTo("#" + trID)

                }
            }
            else
            {
                $("<tr><td colspan='6'>你还没有报销单纪录哦~</td></tr>").appendTo("#tbodyExpenseHisotry");
            }
        }
    })
})


//查看报销单详情
function expenseDetail(x){
    var item = $("#trExpenseHistory" + x);
    number = item.find("td:eq(1)").text();
    $.ajax({
        url : "../../php/expenseHistory.php",
        type : "POST",
        cache : false,
        data : {'detailNumber' : number},
        async : false,
        dataType : 'json',
        success : function (data) {
            $("#detailNumber").text(number);
            $("#detailSubmitDate").text(item.find("td:eq(2)").text());
            $("#detailName").text($("#name").text());
            $("#detailUid").text($("#uid").text());
            $("#detailDepartment").text($("#department").text());
            $("#detailTitle").text($("#title").text());

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

$('#modalExpenseDetail').on('hidden.bs.modal', function () {
    $("#tbodyExpenseDetail").empty();
})