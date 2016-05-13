/**
 * Created by wx_h0001 on 2015/12/26.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();
});

//点击通讯录中“Search”按钮，查找联系人
$("#btnSearch").click(function(){
    $.ajax({
        url : "../php/workerSearch.php?SearchText="+$("#SearchText").val(),
        type : "GET",
        cache : false,
        dataType : 'json',
        success : function(data){
            if(data == "")
            {
                alert("不存在该员工！");
            }
            else
            {
                $("#name").text(data.name);
                $("#uid").text(data.uid);
                $("#sex").text(data.sex);
                $("#department").text(data.department);
                $("#team").text(data.team);
                $("#title").text(data.title);
                $("#tele").text(data.tele);
                $("#email").text(data.email);
                $("#date").text(data.date);
                $("#sendMail").attr('href', 'mailto:' + data.email);
                $("#divSearchSpace").removeClass("col-md-4").addClass("col-md-12");
                $("#divSearchBoxList").removeClass("col-md-12").addClass("col-md-4");
                $("#divSearchBoxResult").show();
            }
        }
    })
})
//Enter键提交查找
function clickBtnSearch()
{
    if(event.keyCode == 13)
    {
        $("#btnSearch").click();
    }
}