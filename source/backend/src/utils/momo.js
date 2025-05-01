require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const AppError = require('./appError');
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
      this.momoCreateUrl = process.env.MOMO_CREATE_URL;
      this.momoQueryUrl = process.env.MOMO_QUERY_URL;
   }

   async createPayment(amount, orderInfo, orderId) {
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
         const response = await axios.post(this.momoCreateUrl, requestBody, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         
         //console.log(response.data);
         if(response.data.payUrl) {
            return response.data.payUrl;
         }
         else {
            //console.log(response.data.message);
            throw new AppError(400, "TRANSACTION_FAILED", response.data.message);
         }
         
      } catch (error) {
         if (error instanceof AppError) throw error;
         else throw new AppError(500, "INTERNAL_SERVER_ERROR", error.response.data.message);
      }
   }

   async checkTransactionStatusByOrderId(orderId) {
      try {
         const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${orderId}`;
         const signature = crypto
           .createHmac('sha256', this.secretKey)
           .update(rawSignature)
           .digest('hex');
       
         const requestBody = JSON.stringify({
           partnerCode: this.partnerCode,
           requestId: orderId,
           orderId: orderId,
           signature: signature,
           lang: this.lang,
         });
       
         // options for axios
         const options = {
           method: 'POST',
           url: this.momoQueryUrl,
           headers: {
             'Content-Type': 'application/json',
           },
           data: requestBody,
         };
       
         const result = await axios(options);
         //console.log(result.data);

         return result.data.resultCode === 0 ? true : false;

      } catch (error) {
         if (error instanceof AppError) throw error;
         else throw new AppError(500, "INTERNAL_SERVER_ERROR", error.message);
      }
   };

}

module.exports = new Momo();