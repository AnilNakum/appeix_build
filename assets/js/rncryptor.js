var RNCryptor={KeyForPassword:function(r,c){return sjcl.misc.pbkdf2(r,c,1e4,256,function(r){var c=new sjcl.misc.hmac(r,sjcl.hash.sha1);this.encrypt=function(){return c.encrypt.apply(c,arguments)}})},Encrypt:function(r,c,t){var s=(t=t||{}).encryption_salt||sjcl.random.randomWords(2),e=RNCryptor.KeyForPassword(r,s),a=t.hmac_salt||sjcl.random.randomWords(2),i=RNCryptor.KeyForPassword(r,a),o=t.iv||sjcl.random.randomWords(4),n=sjcl.codec.hex.toBits("03"),l=(t=sjcl.codec.hex.toBits("01"),sjcl.bitArray.concat(n,t));l=sjcl.bitArray.concat(l,s),l=sjcl.bitArray.concat(l,a),l=sjcl.bitArray.concat(l,o);var y=new sjcl.cipher.aes(e);sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();var j=sjcl.mode.cbc.encrypt(y,c,o);l=sjcl.bitArray.concat(l,j);var b=new sjcl.misc.hmac(i).encrypt(l);return l=sjcl.bitArray.concat(l,b)},Decrypt:function(r,c,t){t=t||{};sjcl.bitArray.extract(c,0,8),t=sjcl.bitArray.extract(c,8,8);var s=sjcl.bitArray.bitSlice(c,16,80),e=RNCryptor.KeyForPassword(r,s),a=sjcl.bitArray.bitSlice(c,80,144),i=RNCryptor.KeyForPassword(r,a),o=sjcl.bitArray.bitSlice(c,144,272),n=sjcl.bitArray.bitLength(c)-256,l=sjcl.bitArray.bitSlice(c,272,n),y=sjcl.bitArray.bitSlice(c,n),j=new sjcl.misc.hmac(i).encrypt(sjcl.bitArray.bitSlice(c,0,n));if(!sjcl.bitArray.equal(y,j))throw new sjcl.exception.corrupt("HMAC mismatch or bad password.");var b=new sjcl.cipher.aes(e);return sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."](),sjcl.mode.cbc.decrypt(b,l,o)}};