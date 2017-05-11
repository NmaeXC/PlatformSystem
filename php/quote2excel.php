<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2017/5/11
 * Time: 9:29
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

//报价单单号
$quoteId = $_GET['id'];
$contact = $_GET['contact'];
$quote = null;
$userInfo = null;
$array_product = array();
//客户联系人及报价单有效期信息
$sql = "SELECT quote.id, customer_info.name customer_name, CONCAT(customer_info.id_0, customer_info.id) customer_id, customer_contact.name contact_name, customer_contact.tele contact_tele, customer_contact.email contact_email, CONCAT(province.value, city.value, customer_info.detail_addr) customer_addr, quote.validity_start, quote.validity_end, quote.currency FROM db_customer.customer_info LEFT JOIN db_platform.quote ON quote.customer = CONCAT(customer_info.id_0, customer_info.id) LEFT JOIN db_customer.customer_contact ON customer_info.id = customer_contact.customer_id LEFT JOIN db_addr.province ON db_addr.province.id = substring(customer_info.id_0, 1, 2) LEFT JOIN db_addr.city ON db_addr.city.id = customer_info.id_0 WHERE quote.id = '{$quoteId}' AND customer_contact.id = '{$contact}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $quote = $rs;
}
else
{
    echo "Get User Info Error";
}

//报价单填写人信息
$sql = "SELECT user.name, user.tele, user.email, user.fox FROM user LEFT JOIN quote ON user.uid = quote.staff_uid WHERE quote.id = '{$quoteId}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $userInfo = $rs;
}
else
{
    echo "Get User Info Error";
}

//返回报价单的产品列表
$sql = "SELECT quote_products.id, quote_products.product_id, quote_products.name, quote_products.price, quote_products.discount, tax_rate.value tax_rate, quote_products.amount, quote_products.ps FROM quote_products LEFT JOIN tax_rate ON quote_products.tax_rate = tax_rate.id WHERE quote_products.quote_id = '{$quoteId}' ORDER BY quote_products.id";
$rs_sql = $mysqli -> query($sql);

$x = 0;
while($rs = mysqli_fetch_array($rs_sql))
{
    $array_product[] = $rs;
}
//
//print_r($quote);
//print_r($userInfo);
//print_r($array_product);
//echo '------'.gettype($array_product[0]).'-----------';

include "PHPExcel.php";
include "PHPExcel/Writer/Excel2007.php";

$objPHPExcel = new PHPExcel();
/*以下是一些设置 ，什么作者  标题啊之类的*/
$objPHPExcel->getProperties()->setCreator($userInfo['name'])
    ->setLastModifiedBy("P_S")
    ->setTitle($quoteId)
    ->setSubject("报价单")
    ->setDescription("报价单:".$quoteId)
    ->setKeywords("报价单")
    ->setCategory("result file");
/*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/
$objPHPExcel->getDefaultStyle()->getFont()->setName( 'Microsoft YaHei');
$objPHPExcel->getDefaultStyle()->getFont()->setSize(8);
$objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
$objPHPExcel->getDefaultStyle()->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
$objPHPExcel->getDefaultStyle()->getAlignment()->setWrapText(true);

$objPHPExcel->setActiveSheetIndex(0);
$objActSheet = $objPHPExcel->getActiveSheet();
//$objActSheet->getDefaultRowDimension()->setRowHeight(15);
//$objActSheet->getColumnDimension('B')->setAutoSize(true);
$objActSheet->getColumnDimension('A')->setWidth(6);
$objActSheet->getColumnDimension('B')->setWidth(13);
$objActSheet->getColumnDimension('C')->setWidth(40);
$objActSheet->getColumnDimension('D')->setWidth(11);
$objActSheet->getColumnDimension('E')->setWidth(6);
$objActSheet->getColumnDimension('F')->setWidth(11);
$objActSheet->getColumnDimension('G')->setWidth(6);
$objActSheet->getColumnDimension('H')->setWidth(11);

$objActSheet->mergeCells('A1:C2')
    ->mergeCells('A3:C3')
    ->mergeCells('F3:H3')
    ->mergeCells('A4:C4')
    ->mergeCells('F4:H5')
    ->mergeCells('A5:C5')
    ->mergeCells('A6:C6')
    ->mergeCells('F6:H7')
    ->mergeCells('A7:C7')
    ->mergeCells('A10:B10')
    ->mergeCells('D10:E10')
    ->mergeCells('F10:H10')
    ->mergeCells('A11:B11')
    ->mergeCells('D11:E11')
    ->mergeCells('F11:H11')
    ->mergeCells('A12:B12')
    ->mergeCells('D12:E12')
    ->mergeCells('F12:H12')
    ->mergeCells('A13:B13')
    ->mergeCells('D13:E13')
    ->mergeCells('F13:H13')
    ->mergeCells('A14:B14')
    ->mergeCells('D14:E14')
    ->mergeCells('F14:H14')
    ->mergeCells('A15:B15')
    ->mergeCells('D15:E15')
    ->mergeCells('F15:H15');



$img_path = "../img/logo.png";
/*实例化插入图片类*/
$objDrawing = new PHPExcel_Worksheet_Drawing();
/*设置图片路径 切记：只能是本地图片*/
$objDrawing->setPath($img_path);
/*设置图片高度*/
$objDrawing->setHeight(30);
/*设置图片要插入的单元格*/
$objDrawing->setCoordinates('A1');
/*设置图片所在单元格的格式*/
//$objDrawing->setOffsetX(10);
//$objDrawing->setOffsetY(10);
//$objDrawing->setRotation(0);
//$objDrawing->getShadow()->setVisible(true);
//$objDrawing->getShadow()->setDirection(50);
$objDrawing->setWorksheet($objActSheet);

$objActSheet->setCellValue('A3', '北京中科世行测控技术有限公司')
    ->setCellValue('A4', '地址：西安市雁塔区瞪羚路26号现代企业中心西区B2-10303室')
    ->setCellValue('A5', '电话：029-81027890	')
    ->setCellValue('A6', '传真：029-81027890')
    ->setCellValue('A7', 'Web：www.synthflex.com')
    ->setCellValue('F3', '报价单号：')
    ->setCellValue('F4', $quote['id'])
    ->setCellValue('F6', '币种：'.($quote['currency'] == 'RMB'? '人民币(RMB)': '美元(USD)'))
    ->setCellValue('A10', '客户名称：')
    ->setCellValue('A11', '客户号：')
    ->setCellValue('A12', '联系人：')
    ->setCellValue('A13', '电话：')
    ->setCellValue('A14', 'E-mail：')
    ->setCellValue('A15', '地址：')
    ->setCellValue('D10', '报价有效期：')
    ->setCellValue('D11', '报价人：')
    ->setCellValue('D12', '联系电话：')
    ->setCellValue('D13', '传真：')
    ->setCellValue('D14', 'E-mail：')
    ->setCellValue('C10', $quote['customer_name'])
    ->setCellValue('C11', $quote['customer_id'])
    ->setCellValue('C12', $quote['contact_name'])
    ->setCellValue('C13', $quote['contact_tele'])
    ->setCellValue('C14', $quote['contact_email'])
    ->setCellValue('C15', $quote['customer_addr'])
    ->setCellValue('F10', $quote['validity_start'].' ~ '.$quote['validity_end'])
    ->setCellValue('F11', $userInfo['name'])
    ->setCellValue('F12', $userInfo['tele'])
    ->setCellValue('F13', $userInfo['fox'])
    ->setCellValue('F14', $userInfo['email'])
    ->setCellValue('A18', '序号')
    ->setCellValue('B18', '产品号')
    ->setCellValue('C18', '产品详细说明')
    ->setCellValue('D18', '原价'.($quote['currency'] == 'RMB'? '[¥]': '[$]'))
    ->setCellValue('E18', '税率')
    ->setCellValue('F18', '税后'.($quote['currency'] == 'RMB'? '[¥]': '[$]'))
    ->setCellValue('G18', '数量')
    ->setCellValue('H18', '总价'.($quote['currency'] == 'RMB'? '[¥]': '[$]'));

$objActSheet -> getStyle('F4') -> getAlignment() -> setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
$objActSheet -> getStyle('F4') -> getFont() ->setSize(10)
    -> setBold(true);
foreach (array('A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'D10', 'D11', 'D12', 'D13', 'D14') as $value)
{
    $objActSheet -> getStyle($value) -> getAlignment() -> setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $objActSheet -> getStyle($value) -> getFont() ->setBold(true);
}

foreach (array('A18', 'B18', 'C18', 'D18', 'E18', 'F18', 'G18', 'H18') as $value)
{
    $objActSheet -> getStyle($value) -> getFont() ->setBold(true);
}



draw_line(9, PHPExcel_Style_Border::BORDER_THIN, $objActSheet);
draw_line(17, PHPExcel_Style_Border::BORDER_MEDIUM, $objActSheet);

foreach ($array_product as $key => $value){
    $objPHPExcel->getActiveSheet()->getStyle('D'.(19 + intval($key)))->getNumberFormat()
        ->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_CHN);
    $objPHPExcel->getActiveSheet()->getStyle('F'.(19 + intval($key)))->getNumberFormat()
        ->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_CHN);
    $objPHPExcel->getActiveSheet()->getStyle('H'.(19 + intval($key)))->getNumberFormat()
        ->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_CHN);
    $objActSheet -> setCellValue('A'.(19 + intval($key)), 1 + intval($key))
        -> setCellValue('B'.(19 + intval($key)), $value['product_id'])
        -> setCellValue('C'.(19 + intval($key)), $value['name'])
        -> setCellValue('D'.(19 + intval($key)), $value['price'])
        -> setCellValue('E'.(19 + intval($key)), ($value['tax_rate'] * 100)."%")
        -> setCellValue('F'.(19 + intval($key)), '=D'.(19 + intval($key)).'*'.(1 + floatval($value['tax_rate'])))
        -> setCellValue('G'.(19 + intval($key)), $value['amount'])
        -> setCellValue('H'.(19 + intval($key)), '=F'.(19 + intval($key)).'*G'.(19 + intval($key)));
}

$position_sum = sizeof($array_product) + 19 + 2;
$objPHPExcel->getActiveSheet()->getStyle('G'.$position_sum)->getNumberFormat()
    ->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_CHN);
$objActSheet -> mergeCells('E'.$position_sum.':F'.$position_sum)
    ->mergeCells('G'.$position_sum.':H'.$position_sum)
    ->setCellValue('E'.$position_sum, '总计[¥]：')
    ->setCellValue('G'.$position_sum, '=SUM(H19:H'.($position_sum - 2).')');
$objActSheet -> getStyle('E'.$position_sum) -> getFont() ->setBold(true)
    -> setSize(9);
$objActSheet -> getStyle('E'.$position_sum) -> getAlignment() ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
$objActSheet -> getStyle('G'.$position_sum) -> getFont() ->setBold(true)
    -> setSize(9);
$objActSheet -> getStyle('G'.$position_sum) -> getAlignment() ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

$position_foot = $position_sum + 2;
draw_line($position_sum -1, PHPExcel_Style_Border::BORDER_THIN, $objActSheet);
draw_line($position_foot, PHPExcel_Style_Border::BORDER_THIN, $objActSheet);
$objActSheet -> mergeCells('A'.$position_foot.':B'.$position_foot)
    -> mergeCells('A'.($position_foot + 1).':F'.($position_foot + 1))
    -> mergeCells('A'.($position_foot + 2).':F'.($position_foot + 2))
    -> mergeCells('A'.($position_foot + 3).':F'.($position_foot + 3))
    -> mergeCells('A'.($position_foot + 4).':F'.($position_foot + 4))
    -> setCellValue('A'.$position_foot, '附加信息：')
    -> setCellValue('A'.($position_foot + 1), '• 付款方式：100%全额预付')
    -> setCellValue('A'.($position_foot + 2), '• 运货方式：CPT')
    -> setCellValue('A'.($position_foot + 3), '• 预计发货期：货架产品一般情况下为销售合同订立之后30个工作日内，定制类产品以最终合同为准。')
    -> setCellValue('A'.($position_foot + 4), '• 产品保修期：硬件产品保修期为1年，代理产品以原厂保修期为准。');

//$objPHPExcel->getActiveSheet()->setTitle('User');
//$objPHPExcel->setActiveSheetIndex(0);

header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="'.$quoteId.'.xlsx"');
header('Cache-Control: max-age=0');

$objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
$objWriter->save('php://output');
exit;

function draw_line($top_of, $para, $sheet)
{
    $sheet -> getStyle('A'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('B'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('C'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('D'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('E'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('F'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('G'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
    $sheet -> getStyle('H'.$top_of)->getBorders()->getTop()->setBorderStyle($para);
}