const express = require('express');
const router = express.Router();
const db = require('../models/index')
const resResult = require('./common/resResult')
//multer 
const path = require('path')
const multer = require('multer');
var memorystorage = multer.memoryStorage();
var upload = multer({stroage : memorystorage});
const readXlsxFile = require('read-excel-file/node')
const xlsx = require('xlsx')
//excel date
const { getJsDateFromExcel } = require("excel-date-to-js");
const { Sequelize } = require('../models/index');

//excel export 필요한 modul 
var iconvLite = require('iconv-lite');
var excel = require('node-excel-export');
//파일 저장결로
// const storage = multer.diskStorage({
//     destination : function(req, file , cb){
//         cb(null , './public/uploads')
//     },

//     filename: function(req , file , cb){
//         const extension = path.extname(file.originalname); //파일에 붙는 확장자 img.jpg
//         const basename = path.basename(file.originalname , extension); //원래이름
//         cb(null , "Excel" + ".xlsx") //basename + 날짜 + 확장자 
//     }
// })
// const upload = multer({
//     storage: storage, //파일에 저장될 위치
//     limits: {
//       files: 1,
//       fieldSize: 1024 * 1024 * 100,
//     },
//   });


  
/* GET users listing. */
router.get('/excel', async (req, res) => {

    try{
    
    var startNum = req.query.startNum;
    var endNum = req.query.endNum;
    
    startNum = startNum ? startNum : 0
    endNum = endNum ? endNum : 10

    startNum = Number(startNum);
    endNum = Number(endNum);

    let sqlCnt = '';
    
    sqlCnt += "SELECT COUNT(*) AS totalCnt "
    sqlCnt += "FROM p_reviews pr "

    var totalCnt = await db.sequelize.query(sqlCnt,
        {type: Sequelize.QueryTypes.SELECT}
);

    let sqlList = '';

    sqlList += "     SELECT pr.prod_seq AS prodSeq, "
    sqlList += "     	   pr.prod_type AS prodType, "
    sqlList += "            pr.writer AS writer, "
    sqlList += "            pr.content AS content, "
    sqlList += "            pr.star AS star, "
    sqlList += "            DATE_FORMAT(pr.reg_date , '%Y-%m-%d') AS regDate "
    sqlList += "     FROM p_reviews pr "
    sqlList += "     LIMIT :startNum , :endNum "
          
    var reviewList = await db.sequelize.query(sqlList , {replacements : {startNum : startNum , endNum: endNum} ,type: Sequelize.QueryTypes.SELECT})
    

    let searchParams = {
        startNum : startNum ,
        endNum : endNum
    }

    res.render('excel/excel' , {totalCnt : totalCnt , searchParams : searchParams , reviewList : reviewList});
    }catch(e){
        console.error('Error' , e)
    }


});

// file uploads
router.post('/excelImport' , upload.single('file') ,  async (req , res) => {
    
    let result = new Object(); 
    try{
        let wb = xlsx.read(req.file.buffer, {type:'buffer'});
        let sheetName = wb.SheetNames[0];
        let firstSheet = wb.Sheets[sheetName];
        let jsonData = xlsx.utils.sheet_to_json( firstSheet, { defval : "" } );
        const resultDate = jsonData;
        for(let i = 0; i < resultDate.length; i++){
            const resultDateValue = resultDate[i]
        
            const classNumber = resultDateValue['클래스번호']
            const classType = resultDateValue['클래스타입']
            const writer = resultDateValue['작성자']
            const content = resultDateValue['내용']
            const star = resultDateValue['별점']
            let reg_date = resultDateValue['날짜']
            let parsedDate = getJsDateFromExcel(reg_date)

            const createResult = await db.reviews.create({
                prodSeq : classNumber ,
                prodType :classType ,
                writer : writer,
                content : content,
                star : star,
                regDate : parsedDate
            })

        }
        result = resResult(true, 200, "데이터 전송 완료", {});
    }catch(e){
        console.log(err);
        result = resResult(false, 500, "알수없는 오류입니다. 관리자에게 문의해주세요.", err.message);
    }finally{
        res.writeHead(200 , {'Content-Type' : 'text/html; charset=utf-8'});
        res.write("<script>alert('Excel 데이터 DB 저장 완료')</script>");
        res.write(`<script>window.location="/excel"</script>`)
        res.end();
    }
})



//excel export to excel 
router.get('/excel/reviewExcel',  async(req, res ) =>{
   
    var startNum = req.query.startNum;
    var endNum = req.query.endNum;

    startNum = startNum ? startNum : 0
    endNum = endNum ? endNum : 20

    startNum = Number(startNum);
    endNum = Number(endNum);

    var result = 'fail';

    try {
        var sqlList = '';

        sqlList += "     SELECT pr.prod_seq AS prodSeq, "
        sqlList += "     	   pr.prod_type AS prodType, "
        sqlList += "            pr.writer AS writer, "
        sqlList += "            pr.content AS content, "
        sqlList += "            pr.star AS star, "
        sqlList += "            DATE_FORMAT(pr.reg_date , '%Y-%m-%d') AS regDate "
        sqlList += "     FROM p_reviews pr "
        sqlList += "     LIMIT :startNum , :endNum "
       
      
        var reviewList = await db.sequelize.query(sqlList,
            {replacements: {startNum: startNum, endNum: endNum }, type: Sequelize.QueryTypes.SELECT}
        );

        var styles = {
            headerDark: {},
            cellWhite: {}
        };
        //Array of objects representing heading rows (very top)
        var heading = [];
        var specification = {
            prodSeq: { // <- the key should match the actual data key
                displayName: '클래스타입', // <- Here you specify the column header
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 60, // <- width in pixels
            },
            prodType: { // <- the key should match the actual data key
                displayName: '클래스번호', // <- Here you specify the column header
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 70 // <- width in pixe
            },
            writer: { // <- the key should match the actual data key
                displayName: '작성자', // <- Here you specify the column header
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 80 // <- width in pixels
            },
            content: {
                displayName: '내용',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 350 // <- width in chars (when the number is passed as string)
            },
            star: {
                displayName: '평점',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 50 // <- width in chars (when the number is passed as string)
            },
            regDate: {
                displayName: '작성일자',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellWhite, // <- Cell style
                width: 130 // <- width in chars (when the number is passed as string)
            }
        };

        var dataset = reviewList;
        var merges = [];
        var report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Report', // <- Specify sheet name (optional)
                    heading: heading, // <- Raw heading array (optional)
                    merges: merges, // <- Merge cell ranges
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );
        result = 'success';
    } catch (err) {
        console.log("err : " + err);
    } finally {
        // You can then return this straight
        res.attachment('Report.xlsx'); // This is sails.js specific (in general you need to set headers)
        try {
            var fileName = iconvLite.decode(iconvLite.encode('review', "UTF-8"), 'ISO-8859-1');

            res.status(200);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName + '.xlsx');

            res.send(report);

        } catch (e) {
            console.log(e);
            throw e;
        }
    }




});
//file export
module.exports = router;
