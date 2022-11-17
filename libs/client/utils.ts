import * as CryptoJS from 'crypto-js';

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function encodeText(data:any){
  const rk = process.env.NEXT_PUBLIC_CRYPTO_KEY!;
  const cipher = CryptoJS.AES.encrypt(data, 
      CryptoJS.enc.Utf8.parse(rk), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
    
  return cipher.toString();
}

export function decodeText(data:any){
  const rk = process.env.NEXT_PUBLIC_CRYPTO_KEY!;
  const cipher = CryptoJS.AES.decrypt(data, 
      CryptoJS.enc.Utf8.parse(rk), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
    
  return cipher.toString(CryptoJS.enc.Utf8);
}
