const path = require('path');
const nodemailer = require('nodemailer');
const AppError = require('./appError');

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        attachments, // Thêm attachments vào mailOptions
      };
      
      await this.transporter.sendMail(mailOptions);

    } catch (error) {
      throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
    }
  }

  async sendOtpEmail(to, otp) {
    const subject = 'BookVerse - Mã OTP đặt lại mật khẩu của bạn';
    const logoUrl = 'cid:bookverse_logo';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="BookVerse Logo" style="max-width: 150px; height: auto;">
      </div>
      <h2 style="color: #333; text-align: center;">BookVerse - Đặt lại mật khẩu</h2>
      <p>Xin chào,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản BookVerse. Vui lòng sử dụng mã OTP sau để hoàn tất quá trình:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>Mã OTP này sẽ hết hạn sau 10 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ BookVerse</p>
      </div>
    `;

    const attachments = [
      {
        filename: 'bookverse_logo.png',
        path: path.join(__dirname, '../resources/bookverse_logo.png'), 
        cid: 'bookverse_logo' // same as the cid value in the img src
      }
    ];

    return this.sendEmail(to, subject, html, attachments);
  }
}

module.exports = new EmailSender();
