/**
 * Created by admin on 2016/4/17.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();
    $('#validity').daterangepicker();
    $("#customerName").bigAutocomplete({
        url: "../../php/auto_customer.php",
        callback: function(data){
            $("#customerID").text(data.id);
        }
    });
});

var currency = "RMB";
//选择货币类型
$("#currencyRMB").click(function () {
    $(".rmb-usd").text("¥");
    currency = "RMB";
});

$("#currencyUSD").click(function () {
    $(".rmb-usd").text("$");
    currency = "USD";
});

//格式化单价形式
function formatOriginalPrice(element) {
    var a  = new Number($(element).val());
    if (!isNaN(a)){
        $(element).val((Math.round(a * 100) / 100).toFixed(2));
    }

}

//自动计算
function autoCalculate(element) {
    var a = $(element).parent().parent();
    var originalPrice = new Number(a.find(".productOriginalPrice").val());
    var discount = new Number(a.find(".productDiscount").val());
    var taxRate = function(val){
        var rate = {
            '0': function () {
                return 1;
            },
            '1': function () {
                return 1.06;
            },
            '2': function () {
                return 1.17;
            }
        }
        if (typeof(rate[val]) === "function"){
            return rate[val]();
        }
        else
        {
            return NaN;
            console.log("taxRate Input Error");
        }
    }(a.find(".productTaxRate").val());
    var amount = new Number(a.find(".productAmount").val());
    var price = originalPrice * (discount / 100) * taxRate;
    a.find(".productPrice").text(price.toFixed(2));
    a.find(".productTotalPrice").text((price * amount).toFixed(2));
    var sum = new Number(0);
    $(".productTotalPrice").each(function () {
        sum += new Number($(this).text());
    });
    if(!isNaN(sum))
    {
        $("#sumOfTotalPrice").text(sum.toFixed(2));
    }
    else
    {
        $("#sumOfTotalPrice").text("等待修改...");
    }
}

//添加一行产品
var productItemColumn = 1;  //产品列表的行数
$("#btnAddProductItem").click(function () {
    var newColume = $("#trProductItem_0").clone().attr('id', 'trProductItem_' + productItemColumn);
    newColume.find(".No").text((productItemColumn + 1) + ".");
    newColume.find(".productID").val("");
    newColume.find(".productDisc").val("");
    newColume.find(".productOriginalPrice").val("");
    newColume.find(".productDiscount").val(100);
    newColume.find(".productPrice").text("0.00");
    newColume.find(".productAmount").val(1);
    newColume.find(".productTotalPrice").text("0.00");
    $("#tbodyProductItem").append(newColume);

    productItemColumn += 1;
});

//保存
$("#btnSave").click(function () {
    var customer = {
        name: $("#customerName").val(),
        id: $("#customerID").text(),
    }

    var validity = $("#validity").val().split(" - ");
    var product = [];
    for(var i = 0; i < productItemColumn; i += 1)
    {
        if ($("#trProductItem_" + i).find(".productID").val() != "")
        {
            product[i] = {
                id: $("#trProductItem_" + i).find(".productID").val(),
                disc: $("#trProductItem_" + i).find(".productDisc").val(),
                origPrice: $("#trProductItem_" + i).find(".productOriginalPrice").val(),
                discount: $("#trProductItem_" + i).find(".productDiscount").val(),
                taxRate: $("#trProductItem_" + i).find(".productTaxRate").val(),
                amount: $("#trProductItem_" + i).find(".productAmount").val()
            }
        }
    }

    //console.log(customer);
    //console.log(validity);
    //console.log(product);

    $.ajax({
        url: "../../php/quote_save.php",
        data: {customer: customer.id,
            validity: validity,
            currency: currency,
            product: JSON.stringify(product)
        },
        type : "POST",
        cache : false,
        success: function (data) {
            if (data == 0)
            {
                alertMsg("报价单保存成功！", "success");
            }
            else
            {
                alertMsg("报价单保存失败", "warning");
            }
        }
    })
});


