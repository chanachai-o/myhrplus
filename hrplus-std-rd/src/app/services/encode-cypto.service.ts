import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncodeCyptoService {
  tokenFromUI: string = "S3c5et@3$#m7H5MYHRPLUS@SERVICE$KEYPASS";
  encrypted: any = "";
  decrypted: any = "";
  constructor() { }

  encryptUsingAES256(plainText: string) {
    // var salt = CryptoJS.lib.WordArray.random(128 / 8);
    // var key = this.generateKey(salt, this.tokenFromUI);
    // var iv = CryptoJS.lib.WordArray.random(128 / 8);
    // var encrypted = CryptoJS.AES.encrypt(
    //   plainText,
    //   key, {
    //   iv: iv,
    //   padding: CryptoJS.pad.Pkcs7,
    //   mode: CryptoJS.mode.CBC
    // });
    // var swap_encrypted = encrypted.toString().replace(/\+/g, 'xMl3Jk').replace(/\//g, 'Por21Ld').replace(/\=/g, 'Ml32')
    // this.encrypted = salt.toString() + iv.toString() + swap_encrypted;
    return plainText
  }

  decryptUsingAES256(plainText: string) {
    // var salt =CryptoJS.enc.Hex.parse(plainText.substr(0, 32));
    // var iv = CryptoJS.enc.Hex.parse(plainText.substr(32, 32));
    // var _encrypted = plainText.substring(64);
    // var swap_encrypted=_encrypted.toString().replace(/\xMl3Jk/g,'+').replace(/\Por21Ld/g,'/').replace(/\Ml32/g,'=');
    // var key =  this.generateKey(salt, this.tokenFromUI);

    // this.decrypted = CryptoJS.AES.decrypt(swap_encrypted, key, {
    //   iv: iv,
    //   padding: CryptoJS.pad.Pkcs7,
    //   mode: CryptoJS.mode.CBC

    // }).toString(CryptoJS.enc.Utf8);
    // console.log("decrpted",this.decrypted)
    return plainText
  }

  generateKey(salt, passPhrase) {
    let keySize = 256 / 32;
    let iterationCount = 100;
    var key = CryptoJS.PBKDF2(passPhrase, salt,
      { keySize: keySize, iterations: iterationCount });
    return key;
  }
}
