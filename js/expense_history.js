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
    $("#tbodyExpenseHisotry").empty();
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
                    $("<td></td>").html("<a role='button' onclick=expenseDetail(" + x + ")><span class='badge bg-light-blue'>More..</span>").appendTo("#" + trID)

                }
            }
            else
            {
                $("<tr><td colspan='6'>你还没有报销单纪录~</td></tr>").appendTo("#tbodyExpenseHisotry");
            }
        }
    })
});


//使用一个新的页面来呈现报销单详情
function expenseDetail(x) {
    var item = $("#trExpenseHistory" + x);
    var number = item.find("td:eq(1)").text();
    var submitDate = item.find("td:eq(2)").text();
    window.open("expense_history_detail.html?x=" + number + "&d=" + submitDate);
}





// (function (){
//     var detailItem = {
//         number: null,
//         submitDate: null,
//         name: null,
//         uid: null,
//         department: null,
//         title: null,
//         data: []
//     };
//
//     //查看报销单详情
//     function expenseDetail(x){
//         var item = $("#trExpenseHistory" + x);
//         detailItem.number = item.find("td:eq(1)").text();
//         $.ajax({
//             url : "../../php/expenseHistory.php",
//             type : "POST",
//             cache : false,
//             data : {'detailNumber' : number},
//             async : false,
//             dataType : 'json',
//             success : function (data) {
//                 $("#detailNumber").text(detailItem.number);
//                 $("#detailSubmitDate").text(detailItem.submitDate = item.find("td:eq(2)").text());
//                 $("#detailName").text(detailItem.name = $("#name").text());
//                 $("#detailUid").text(detailItem.uid = $("#uid").text());
//                 $("#detailDepartment").text(detailItem.department = $("#department").text());
//                 $("#detailTitle").text(detailItem.title = $("#title").text());
//
//                 if (data.sum > 0)
//                 {
//                     for(var i = 0; i < data.sum; i++)
//                     {
//                         var tr1ID = "tr1Detail" + i;
//                         var tr2ID = "tr2Detail" + i;
//
//                         $("<tr>").attr('id', tr1ID).appendTo("#tbodyExpenseDetail");
//                         $("<td rowspan='2'></td>").text((i+1) + ".").appendTo("#" + tr1ID);
//                         $("<td></td>").text(detailItem.data[i].type = data[i].type).appendTo("#" + tr1ID);
//                         $("<td></td>").text(detailItem.data[i].date = data[i].date).appendTo("#" + tr1ID);
//                         $("<td></td>").text(detailItem.data[i].amount = data[i].amount).appendTo("#" + tr1ID);
//                         $("<td></td>").text(detailItem.data[i].attachment = data[i].attachment).appendTo("#" + tr1ID);
//
//                         $("<tr>").attr('id', tr2ID).appendTo("#tbodyExpenseDetail");
//                         $("<td><strong>备注：</strong></td>").appendTo("#" + tr2ID);
//                         $("<td colspan='3'></td>").text(detailItem.data[i].remark = data[i].remark).appendTo("#" + tr2ID);
//
//                     }
//                 }
//                 else
//                 {
//                     $("<tr><td colspan='5'></td></td></tr>").text("无报销条目。。。").appendTo("#tbodyExpenseDetail");
//                 }
//
//
//                 $("#detailAccepter").text(item.find("td:eq(3)").text());
//                 $("#detailState").text(item.find("td:eq(4)").find("span").text());
//                 $("#modalExpenseDetail").modal("show");
//
//             }
//         })
//     }
//
//     //关闭报销单时清空内容
//     $('#modalExpenseDetail').on('hidden.bs.modal', function () {
//         $("#tbodyExpenseDetail").empty();
//     });
//
//     //打印报销单
//     $("#btnPrint").click(function () {
//         //$("#divDetailPage").jqprint({
//         //    operaSupport: true
//         //});
//
//         var strPrintBody = "<div class='container'>"
//             + "<div><h2 class='text-center'>世行报销清单</h2></div>"
//             + "<div style='margin: 5px 20px'><p style='float: left'>编号：" + detailItem.number + "</p><p style='float: right'>提交日期：" + detailItem.submitDate + "</p></div>"
//             + "<div><table class='table table-bordered'>"
//                 + "<thead><tr><th width='20%'>日期</th><th width='10%'>地点</th><th width='25%'>类型</th><th width='15%'>金额</th><th width='10%'>附件数</th><th width='20%'>备注</th></tr></thead>"
//                 + "<tbody>";
//
//         for(var i in detailItem.data)
//         {
//             strPrintBody += "<tr><td>" + detailItem.data[i].date + "</td><td>" + detailItem.data[i].site + "</td><td>" + detailItem.data[i].type + "</td><td>" + detailItem.data[i].amount + "</td><td>" + detailItem.data[i].attachment + "</td><td>" + detailItem.data[i].amount + "</td><td>" + detailItem.data[i].remark + "</td></tr>";
//         }
//
//             strPrintBody += "<tr><td colspan='6'></td></tr>" + "</tbody></table></div></div>";
//
//     });
//
// })();





