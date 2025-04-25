require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const axios = require('axios');

class Momo {
   
   constructor() {
      this.accessKey = process.env.MOMO_ACCESS_KEY;
      this.secretKey = process.env.MOMO_SECRET_KEY;
      this.partnerCode = 'MOMO';
      this.redirectUrl = process.env.MOMO_REDIRECT_URL;
      this.ipnUrl = process.env.MOMO_IPN_URL;
      this.requestType = 'payWithMethod';
      this.lang = 'vi';
      this.autoCapture = true;
      this.momoUrl = process.env.MOMO_URL;
   }

   async createPayment(amount, orderInfo, paymentCode) {
      const orderId = this.partnerCode + new Date().getTime();
      const requestId = orderId;
      const extraData = '';
      const orderGroupId = '';

      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${this.requestType}`;
      const signature = crypto.createHmac('sha256', this.secretKey)
         .update(rawSignature)
         .digest('hex');

      const requestBody = {
         partnerCode: this.partnerCode,
         partnerName: "BookVerse",
         storeId: "BookVerseStore",
         requestId: requestId,
         amount: amount,
         orderId: orderId,
         orderInfo: orderInfo,
         redirectUrl: this.redirectUrl,
         ipnUrl: this.ipnUrl,
         lang: this.lang,
         requestType: this.requestType,
         autoCapture: this.autoCapture,
         extraData: extraData,
         orderGroupId: orderGroupId,
         signature: signature
      };

      try {
         const response = await axios.post(this.momoUrl, requestBody, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         
         //console.log(response.data);
         return response.data.shortLink;
         
      } catch (error) {
         throw new Error('500', "INTERNAL_SERVER_ERROR",error.message);
      }
   }
}

module.exports = new Momo();