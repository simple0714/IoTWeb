require('dotenv').config();
const axios = require('axios');
const CryptoJS = require('crypto-js');

const makeSignature = (div,serviceId) => {
  let space = " ";                // one space
  let newLine = "\n";             // new line
  let method = "POST";             // method
  let url = `/sms/v2/services/${serviceId}/messages`;
  let timestamp = new Date().getTime().toString();  // current timestamp (epoch)
  let accessKey = process.env.NAVER_LMS_KEY;       // access key id (from portal or sub account)
  let secretKey = process.env.NAVER_LMS_SECRET;       // secret key (from portal or sub account)
  let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);
  let hash = hmac.finalize();
  let signVal = hash.toString(CryptoJS.enc.Base64);
  console.log( "#### naverTimestamp" , timestamp );
  console.log( "#### naverSign" , signVal);
  return { timestamp , signVal };
}

exports.sendLms = (orgNm, name, phone, email, ServiceNm, budget, schedule, description) => {
  const currDtm = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const serviceId = process.env.SERVICE_ID;
  const {timestamp , signVal } = makeSignature('SMS',serviceId);
  console.log(`\n ### [${currDtm}] SMS 전송 시작 timestamp:${timestamp},signVal:${signVal}} \n`);
  // SMS 전송 API 호출
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
  const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': process.env.NAVER_LMS_KEY,
      'x-ncp-apigw-signature-v2': signVal
  };
  let amount = parseInt(budget).toLocaleString();
  const data = {
      "type": "LMS",
      "contentType":"COMM",
      'countryCode': '82',
      "from":'01040993636',
      'content': `[SLH 프로젝트 문의]`,
      'messages': [
        {
          'to': '01040993636',
          'content': `[SLH 프로젝트 문의]\n* 고객정보 : \n\t기관명:${orgNm} \n\t이름:${name} \n\t전화번호:${phone} \n\t이메일:${email}\n* 서비스 : ${ServiceNm}\n* 예산 : ${amount}원 / ${schedule}일\n* 내용 : ${description}`,
        }
      ]
    }
  axios.post(url, data, { headers })
  .then((response) => {
      console.log('SMS 전송 결과:', response.data);
  })
  .catch((error) => {
      console.error('SMS 전송 에러:', error);
  })
  .finally(() => {
      const completeDtm = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
      console.log(`[${completeDtm}] SMS 전송 끝 \n`);
  });
}