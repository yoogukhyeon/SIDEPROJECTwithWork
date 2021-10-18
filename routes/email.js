var express = require('express');
var router = express.Router();
const db = require('../models/index')
const {Sequelize} = require('../models/index')
const nodemailer = require('nodemailer');


router.get('/emailList' , async (req , res) => {
        try{
            let sqlList = '';

            sqlList += "SELECT e.no AS no, "
            sqlList += "    e.send_id AS sendId, "
            sqlList += "    e.send_email AS sendEmail, "
            sqlList += "    e.to_userid AS toUserid,  "
            sqlList += "    e.to_mail AS toMail, "
            sqlList += "    e.title AS title, "
            sqlList += "    e.content AS content, "
            sqlList += "    date_format(e.reg_date , '%Y-%m-%d') AS date "
            sqlList += "FROM email e  "


            let emailList = await db.sequelize.query(sqlList ,{replacements : {} , type: Sequelize.QueryTypes.SELECT })
            
            res.render('email/emailList' , {emailList})
        }catch(e){
            console.error('Error' , e)
        }
})



router.get('/email' , async (req , res) => {
    res.render('email/email')
})

router.get('/email_ok' , async (req , res) => {
    try{
        let sqlList = '';

        sqlList += "     SELECT e.send_id, "
        sqlList += "     	    e.send_email, "
        sqlList += "            e.to_userid, "
        sqlList += "            e.to_mail, "
        sqlList += "            e.title, "
        sqlList += "            e.content "
        sqlList += "     FROM email e "
        sqlList += "     ORDER BY no DESC "
    
        var emailList = await db.sequelize.query(sqlList , {replacements : {} ,type: Sequelize.QueryTypes.SELECT})
    
        res.render('email/email_ok', {
            emailList
        })
    }catch(e){
        console.error('Error' , e)
    }
   
})

router.post('/email_ok' , async (req , res) => {
  
   try{
    const sendid = req.body.sendid
    const sendmail = req.body.sendmail
    const touserid = req.body.touserid
    const tomail = req.body.tomail
    const title = req.body.title
    const content = req.body.content

    const fmtfrom = `${sendid}<${sendmail}>`
    const fmtto = `${touserid}<${tomail}>`

    const transpoter = await nodemailer.createTransport({
        service : "Gmail",
        auth: {
            user : 'rnrgus5897@gmail.com',
            pass: 'hncctutyqhgjgpoc'
        },
        host : "smtp.mail.com",
        port: "465"

    })

    const mailOption = {
        from: fmtfrom,
        to: fmtto,
        subject: title,
        html: content
    };

    transpoter.sendMail(mailOption , (err , infor) => {
        if(err){
            console.error('Error' , err)
        }else{
            console.log(infor)
        }
    })
    transpoter.close();
    const createResult = await db.email.create({
        sendid : sendid ,
        sendmail : sendmail ,
        touserid : touserid ,
        tomail : tomail,
        title : title,
        content : content,
    })
    console.log(createResult)


    res.redirect('/email_ok');
   }catch(e){
       console.error('Error' , e)
   }
})

//delete 
router.post('/mailDelete' , async (req , res) => {
    try{
        const no = req.body.no;
        const result = await db.email.destroy({
            where: {
                no: no
            }
        })
        if(result) console.log('데이터 삭제 성공');
        res.redirect('/emailList')
    }catch(e){
        console.error('Error' , e)
    }
})



module.exports = router;