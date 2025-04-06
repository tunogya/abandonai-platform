import * as crypto from "crypto";

const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Encode(buffer: Buffer): string {
  let num = BigInt("0x" + buffer.toString("hex"));
  let encoded = "";
  while (num > 0) {
    encoded = BASE58_CHARS[Number(num % 58n)] + encoded;
    num /= 58n;
  }
  return encoded || "1"; // 避免空字符串
}

function base58Decode(str: string): Buffer {
  let num = 0n;
  for (const char of str) {
    num = num * 58n + BigInt(BASE58_CHARS.indexOf(char));
  }
  let hex = num.toString(16);
  if (hex.length % 2) hex = "0" + hex;
  return Buffer.from(hex, "hex");
}

class AESCipher {
  private readonly key: Buffer;

  constructor(key: Buffer | string) {
    if (typeof key === "string") key = Buffer.from(key, "utf8");
    if (key.length !== 32) throw new Error("Key must be 32 bytes (256 bits)");
    this.key = key;
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12); // 推荐 12 字节 IV
    const cipher = crypto.createCipheriv("aes-256-gcm", this.key, iv);

    let encrypted = cipher.update(plaintext, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const tag = cipher.getAuthTag(); // GCM 认证标签

    return base58Encode(Buffer.concat([iv, tag, encrypted])); // IV + Tag + 密文
  }

  decrypt(encryptedText: string): string {
    const data = base58Decode(encryptedText);
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const encrypted = data.slice(28);

    const decipher = crypto.createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  }
}

const keyBase64 = process.env.AES_KEY;
if (!keyBase64) throw new Error("Missing AES_KEY in .env file");

const key = Buffer.from(keyBase64, "base64");
if (key.length !== 32) throw new Error("Invalid AES_KEY length, must be 32 bytes");

const aes = new AESCipher(key);

export const encryptedText = (originalText: string) => {
  return aes.encrypt(originalText);
}

export const decryptedText = (encryptedText: string) => {
  return aes.decrypt(encryptedText);
}
