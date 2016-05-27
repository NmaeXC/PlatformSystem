/**
 * Created by wx_h0001 on 2016/5/20.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();
});

$("#key").bigAutocomplete({
    url: "../../php/auto_product.php",
    callback: function(data){
        $.ajax({
            url: "../../php/product_info.php",
            type: "POST",
            data: {'Product': data.title},
            dataType: "json",
            success: function(data){
                for(var i in data){
                    var trID = "tr_product_" +i;
                    $("<tr>").attr('id', trID).appendTo("#tbodyProduct");
                    $("<td></td>").text((i+1) + '.').appendTo("#" + trID);
                    $("<td></td>").text(data.id).appendTo("#" + trID);
                    $("<td></td>").text(data.disc).appendTo("#" + trID);
                    $("<td></td>").text(((data.currency == "") ) + data.price).appendTo("#" + trID);
                }
            }
        });
    }
});