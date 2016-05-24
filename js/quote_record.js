/**
 * Created by wx_h0001 on 2016/5/3.
 */

$(document).ready(function () {
    freshMyPage();

    //查看报价历史纪录
    $("#tbodyQuoteHistory").empty();
    $.ajax({
        url : "../../php/quote_record.php",
        type : "POST",
        cache : false,
        dataType : 'json',
        success : function(data){
            //将报价单历史纪录显示到表格中
            if(data.sum > 0)
            {
                for(var x = 0; x < data.sum; x++)
                {
                    var trID = "trQuoteHistory" + x;
                    $("<tr>").attr('id', trID).appendTo("#tbodyQuoteHistory");
                    $("<td></td>").text((x+1) + '.').appendTo("#" + trID);
                    $("<td></td>").text(data[x]["id"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["customer"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["contact"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["validity_start"] + " - " + data[x]["validity_end"]).appendTo("#" + trID);

                    var state;
                    switch (data[x]['state']){
                        case "1" :
                            state = "<span class='label label-primary'>有效</span>";
                            break;
                        case "0" :
                            state = "<span class='label label-warning'>失效</span>";
                            break;
                        default:
                            state = "<span class='label label-danger'>Error</span>";
                            break;
                    }
                    $("<td></td>").html(state).appendTo("#" + trID);
                    $("<td></td>").html("<a role='button' onclick=quoteDetail(" + x + ",'" + data[x].contact_id + "')><span class='badge bg-light-blue'>More..</span>").appendTo("#" + trID)

                }
            }
            else
            {
                $("<tr><td colspan='6'>你还没有报价单纪录哦~</td></tr>").appendTo("#tbodyQuoteHisotry");
            }
        }
    })
});

//使用一个新的页面来呈现报销单详情
function quoteDetail(x, contact) {
    var item = $("#trQuoteHistory" + x);
    var number = item.find("td:eq(1)").text();
    var submitDate = item.find("td:eq(2)").text();
    window.open("quote_record_detail.html?x=" + number + "&c=" + contact);
}