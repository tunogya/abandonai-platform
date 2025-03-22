import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUDIENCE = process.env.AUTH0_AUDIENCE;

const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`, // 获取 Auth0 的公钥
});

const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
};

export const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      }
    );
  });
};