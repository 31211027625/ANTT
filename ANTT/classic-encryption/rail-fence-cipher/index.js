import * as readline from "node:readline";

import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const reilFenceCipher = ({ secret, value }) => {
  if (typeof value !== "string" || typeof secret !== "string") {
    return "input must be a string";
  }
  return generateEncodeStr(secret, generateMetrix(secret, value));
};
const generateEncodeStr = (secret, matrix) => {
  let encodeStr = "";
  secret
    .split("")
    .forEach((char, index) => (encodeStr += matrix[index][char].join("")));
  return encodeStr;
};
const generateMetrix = (secret, value) => {
  const secretArr = secret.split("");
  const valueArr = value.split("");
  const result = [];
  secretArr.forEach((char, i) => {
    const object = {};
    const length = Math.ceil(value.length / secret.length);
    let step = i;

    for (let index = 0; index < length - 1; index++) {
      if (!object[char]) {
        object[char] = [];
        object[char].push(valueArr.at(step));
      }
      step += secret.length;
      object[char].push(valueArr.at(step));
    }
    result.push(object);
  });

  return result;
};
const decode = (encodedStr, secret) => {
  const ecodedArr = encodedStr.split("");
  let decodeStr = "";
  transpose(
    secret.split("").map(() => {
      return ecodedArr.splice(0, Math.ceil(encodedStr.length / secret.length));
    })
  ).forEach((item) => (decodeStr += item.join("")));
  return decodeStr;
};

function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

console.log("Enter secert-value");
rl.question("Ex: abc-xyz :", (input) => {
  const values = input.split("-");
  const encodedStr = reilFenceCipher({ secret: values[0], value: values[1] });
  console.log("EncodedString: ", encodedStr);

  console.log("Decoded String: ", decode(encodedStr, values[0]));

  rl.close();
});
