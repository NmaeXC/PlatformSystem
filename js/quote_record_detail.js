/**
 * Created by wx_h0001 on 2016/5/10.
 */


/**
 * Created by admin on 2016/4/2.
 */




(function () {
    var number = getQueryString("x");
    var contact = getQueryString("c");
    if (number !== null)
    {
        //初始化页面
        initPage(number, contact);
    }
    else
    {
        console.log("No Detail Number");
    }

    function initPage(number, contact) {
        $.ajax({
            url: "../../php/quote_detail.php",
            type: "POST",
            dataType: "json",
            data : {'detailNumber' : number, 'contact': contact},
            success: function (data) {
                $("#id").text(number);
                var today = new Date();
                $("#print_date").text(today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate());
                $("#currency").text(data.quote.currency);
                if (data.quote.currency == 'RMB'){
                    $("#currency").text("人民币(RMB)");
                    $(".currency").text("[¥]");
                }
                else{
                    $("#currency").text("美元(USD)");
                    $(".currency").text("[$]");
                }
                $("#customer_name").text(nullornot(data.quote.customer_name));
                $("#customer_id").text(nullornot(data.quote.customer_id));
                $("#contact_name").text(nullornot(data.quote.contact_name));
                $("#contact_tele").text(nullornot(data.quote.contact_tele));
                $("#contact_email").text(nullornot(data.quote.contact_email));
                $("#customer_addr").text(nullornot(data.quote.customer_addr));
                $("#start").text(nullornot(data.quote.validity_start));
                $("#end").text(nullornot(data.quote.validity_end));
                $(".nameUser").text(nullornot(data.userInfo.name));
                $(".teleUser").text(nullornot(data.userInfo.tele));
                $(".foxUser").text("-");
                $(".emailUser").text(nullornot(data.userInfo.email));
                var sum = 0;
                for(var i in data.products)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbody_products");
                    $("<td></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].product_id).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].disc).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].orig_price).appendTo("#" + trID);
                    var taxRate = new Number(data.products[i].tax_rate);
                    //$("<td></td>").text(data.products[i].discount).appendTo("#" + trID);
                    $("<td></td>").text((taxRate * 100) + "%").appendTo("#" + trID);
                    var price = new Number(data.products[i].orig_price) * (taxRate + 1);
                    //var price = new Number(data.products[i].orig_price) * (new Number(data.products[i].discount) / 100) * (taxRate + 1);
                    $("<td></td>").text(price.toFixed(2)).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].amount).appendTo("#" + trID);
                    var totalPrice = price * (new Number(data.products[i].amount));
                    $("<td></td>").text(totalPrice.toFixed(2)).appendTo("#" + trID);
                    sum += totalPrice;
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
        })
    }

    function nullornot(str){
        if(str === ""){
            return "-";
        }
        else {
            return str;
        }
    }

    //点击打印按钮
    $("#btnPrint").click(function(){
        $("#btnPrint").css('display', 'none');
        $("#footer").show();
        window.print();
        $("#footer").hide();
        $("#btnPrint").css('display', 'inline-block');
    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }



})();