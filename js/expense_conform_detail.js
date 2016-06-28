/**
 * Created by wx_h0001 on 2016/4/12.
 */

(function () {
    freshMyPage();

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
                //var today = new Date();
                //$("#today").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
                if(data.isConform){
                    $("#btnConform").removeAttr('disabled');
                    $("#btnReject").removeAttr('disabled');
                }
                var sum = new Number(0);

                for(var i in data.item)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbodyExpenseItem");
                    $("<td></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].date).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].site).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].type).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].amount).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].attachment).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].remark).appendTo("#" + trID);
                    sum += new Number(data.item[i].amount);
                }
                if(!isNaN(sum))
                {
                    $("#sum").text(sum.toFixed(2));
                }
                else
                {
                    $("#sum").text("数据有误");
                }
            }
        });
    }

    //点击打印按钮
    $("#btnPrint").click(function(){
        window.open("expense_print.html?x=" + number + "&d=" + submitDate);
    });

    //同意
    $("#btnConform").click(function(){
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
                if(data === 0)
                {
                    alert('审核成功！');
                }
                else
                {
                    alert("编号：\n" + data.join("\n") + "\n目前的状态不支持您的同意操作");
                }
            }
        });
    });

    //驳回
    $("#btnReject").click(function () {
        var rejectInfo = window.prompt("请输入驳回信息", "报销单填写不符合规范");
        if (rejectInfo){
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
                    if(data === 0)
                    {
                        alert('驳回成功！');
                    }
                    else
                    {
                        alert("编号：\n" + data.join("\n") + "\n目前的状态不支持您的驳回操作");
                    }
                }
            });
        }

    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})();