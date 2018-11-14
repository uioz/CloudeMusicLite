// 本文件测试解密和加密
const crypto=require('crypto');
const decipher = crypto.createDecipher('aes192', 'a password');

let decrypted = '';
decipher.on('readable', () => {
    const data = decipher.read();
    if (data)
        decrypted += data.toString('utf8');
});
decipher.on('end', () => {
    console.log(decrypted);
    // Prints: some clear text data
});

let encrypted ='';
const cipher=crypto.createCipher('aes192','a password');

cipher.on('readable',()=>{
    const data=cipher.read();
    if(data)
        encrypted += data.toString('hex');
});
cipher.on('end',()=>{
    console.log(encrypted);
});

cipher.write('what the fuck');
cipher.end();

decipher.write(encrypted,'hex');
decipher.end();