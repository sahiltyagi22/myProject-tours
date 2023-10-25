const mail = requrie('nodemailer')

const sendMail = options=>{
    // 1) create a transporter
    const transporter = mail.createTransport({
        service : 'Gmail',
        auth : {
            user : process.env.EMAIL, 
            password : process.env.PASSWORD
        }
    })

    // 2) define the email option


    // 3) actually send the email
}