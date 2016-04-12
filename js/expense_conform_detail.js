/**
 * Created by wx_h0001 on 2016/4/12.
 */

(function () {
    var number = getQueryString("x");
    var submitDate = getQueryString("d");
    if (number !== null)
    {
        //初始化页面
        initPage(number, submitDate);
    }
    else
    {
        console.log("No Detail Number");
    }

    function initPage(number, submitDate) {
        $.ajax({
            url: "../../php/expense_detail.php",
            type: "POST",
            dataType: "json",
            data : {'detailNumber' : number},
            success: function (data) {
                $("#number").text(number);
                $("#submitDate").text(submitDate);
                $("#name").text(data.userInfo.name);
                $("#uid").text(data.userInfo.uid);
                $("#department").text(data.userInfo.department);
                $("#title").text(data.userInfo.title);
                var today = new Date();
                $("#today").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
                for(var i in data.item)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbodyitem");
                    $("<td></td>").text(data.item[i].date).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].site).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].type).appendTo("#" + trID);
                    $("<td class='amount'></td>").text(data.item[i].amount).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].attachment).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].remark).appendTo("#" + trID);
                }
                calculateSum();

            }
        })
    }

    //点击同意按钮
    $("#btnAgree").click(function(){
        var conformed = [];
        conformed[0] = number;
        $.ajax({
            url : "../../php/expenseConform.php",
            traditional: true,
            type : "POST",
            cache : false,
            dataType : 'json',
            data : {"sum": 1, "conformed":JSON.stringify(conformed), "type": "agree"},
            success : function(data){
                if(data == '')
                {
                    alert('审核成功！');
                }
                else
                {
                    alert("编号：\n" + data.join("\n") + "\n已经审核,请勿再次操作");
                }
            }
        })
    });

    //驳回按钮
    $("#btnReject").mouseenter(function () {
        if ($("#rejectInfo").css('display') == 'none')
        {
            $("#rejectInfo").show();
        }
    });
    $("#btnReject").click(function () {
        var conformed = [];
        conformed[0] = number;
        var rejectInfo = $("#rejectInfo").val();
        $.ajax({
            url : "../../php/expenseConform.php",
            type : "POST",
            cache : false,
            dataType : 'json',
            data : {"sum": 1, "conformed":JSON.stringify(conformed), "type": "reject", "rejectInfo": rejectInfo},
            success : function(data){
                if(data == '')
                {
                    alert('审核成功！');
                }
                else
                {
                    alert("编号：\n" + data.join("\n") + "\n已经审核,请勿再次操作");
                }
            }
        })
    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    //计算合计金额
    function calculateSum(){
        var sum = new Number(0);
        $(".amount").each(function () {
            sum += new Number($(this).text());
        });
        if(!isNaN(sum))
        {
            $("#sum").text(sum.toFixed(2));
        }
        else
        {
            $("#sumOfAmount").text("数据有误");
        }
    }
})();