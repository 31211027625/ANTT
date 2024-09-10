function rand_key(p) {
  let key = "";
  for (let i = 0; i < p; i++) {
    const temp = Math.floor(Math.random() * 2);
    key += temp.toString();
  }
  return key;
}

// Hàm thực hiện XOR bit
function exor(a, b) {
  let temp = "";
  let pre = "";
  for (let i = 0; i < a.length; i++) {
    const xorResult = a[i] ^ b[i];
    pre += `${a[i]} | ${b[i]} => ${xorResult}\n`;
    temp += xorResult.toString();
  }
  return { temp, pre };
}

// Hàm chuyển đổi nhị phân sang thập phân
function binaryToDecimal(binary) {
  return parseInt(binary, 2);
}

function generateCipherText(bin_data) {
  let str_data = "";
  let steps = "";
  for (let i = 0; i < bin_data.length; i += 8) {
    const temp_data = bin_data.slice(i, i + 8);
    const decimal_data = binaryToDecimal(temp_data);
    steps += `binary: ${temp_data} => Decimal: ${decimal_data} => ASCII: ${String.fromCharCode(
      decimal_data
    )} \n`;
    str_data += String.fromCharCode(decimal_data);
  }
  return str_data;
}
function decimalToBinary(N) {
  return (N >>> 0).toString(2);
}

function getText(PT) {
  const PT_Ascii = Array.from(PT).map((char) => char.charCodeAt(0));
  const PT_Bin = PT_Ascii.map((ascii) => ascii.toString(2).padStart(8, "0"));
  return { PT_Bin: PT_Bin.join(""), PT_Ascii };
}

function getKeys(PT_Bin, seed) {
  const { PT_Bin: seed_Bin } = getText(seed);
  const n = Math.floor(PT_Bin.length / 2);
  const dif = seed_Bin.length - PT_Bin.length;

  let tempSeed = "";
  if (dif < 0) {
    while (tempSeed.length < PT_Bin.length) {
      tempSeed += seed_Bin;
    }
  } else {
    tempSeed = seed_Bin.slice(dif);
  }
  //   const tempSeed =
  //     dif < 0
  //       ? seed_Bin + PT_Bin.substring(0, Math.abs(dif))
  //       : seed_Bin.slice(dif);
  const K1 = tempSeed.slice(0, n);
  const K2 = tempSeed.slice(n);

  console.log(tempSeed, K1, K2);

  return { K1, K2 };
}

function prepareData(PT, seed) {
  const { PT_Bin, PT_Ascii } = getText(PT);

  const n = Math.floor(PT_Bin.length / 2);
  const L1 = PT_Bin.slice(0, n);
  const R1 = PT_Bin.slice(n);
  const m = R1.length;

  const { PT_Bin: seed_Bin } = getText(seed);
  const dif = seed_Bin.length - PT_Bin.length;
  let tempSeed = "";
  if (dif < 0) {
    while (tempSeed.length < PT_Bin.length) {
      tempSeed += seed_Bin;
    }
  } else {
    tempSeed = seed_Bin.slice(dif);
  }
  //   const tempSeed =
  //     dif < 0
  //       ? seed_Bin + PT_Bin.substring(0, Math.abs(dif))
  //       : seed_Bin.slice(dif);

  const K1 = tempSeed.length > 0 ? tempSeed.slice(0, n) : rand_key(m);
  const K2 = tempSeed.length > 0 ? tempSeed.slice(n) : rand_key(m);
  console.log(K1, K2, K1.length, K2.length);
  // Vòng lặp Feistel đầu tiên
  const { temp: f1, pre: pre1 } = exor(R1, K1);

  const { temp: R2, pre: pre2 } = exor(f1, L1);

  const L2 = R1;

  // Vòng lặp Feistel thứ hai
  const { temp: f2, pre: pre3 } = exor(R2, K2);

  const { temp: R3, pre: pre4 } = exor(f2, L2);

  const L3 = R2;
  return { L3, R3, K2, K1 };
}

function encodeFeistelCipher(PT, seed) {
  const { L3, R3, K1, K2 } = prepareData(PT, seed);
  const bin_data = L3 + R3;
  const encoded_str = generateCipherText(bin_data);
  return { bin_data, encoded_str };
}

function decodeFeistelCipher({ K2, K1, PT_Bin }) {
  const n = Math.floor(PT_Bin.length / 2);
  const L4 = PT_Bin.slice(0, n);
  const R4 = PT_Bin.slice(n);

  // Vòng lặp giải mã Feistel
  const { temp: f3, pre: pre3 } = exor(L4, K2);
  const { temp: L5, pre: pre4 } = exor(f3, R4);
  const R5 = L4;

  const { temp: f4, pre: pre5 } = exor(L5, K1);
  const { temp: L6, pre: pre6 } = exor(f4, R5);
  const R6 = L5;

  const PT1 = L6 + R6;

  let str_data = "";
  for (let i = 0; i < PT1.length; i += 8) {
    const temp_data = PT1.slice(i, i + 8);
    // console.log(
    //   temp_data,
    //   binaryToDecimal(temp_data),
    //   String.fromCharCode(binaryToDecimal(temp_data))
    // );
    str_data += String.fromCharCode(binaryToDecimal(temp_data));
  }
  return str_data;
}

document.getElementById("btn-add").addEventListener("click", (e) => {
  const root = document.getElementById("root-password").value;

  let passwords = [];
  const passwordsString = localStorage.getItem("passwords");
  const { encoded_str, bin_data } = encodeFeistelCipher(
    document.getElementById("new-password").value,
    root
  );
  if (passwordsString) {
    passwords = JSON.parse(passwordsString);
    console.log(passwords);
    passwords.push(`${encoded_str}-${bin_data}`);
  } else {
    passwords.push(`${encoded_str}-${bin_data}`);
  }
  localStorage.setItem("passwords", JSON.stringify(passwords));
  init();
});

document.getElementById("btn-unlock").addEventListener("click", function () {
  const root = document.getElementById("root-password").value;
  let list = "";
  const passwordsString = localStorage.getItem("passwords");

  if (passwordsString) {
    const passwords = JSON.parse(passwordsString);
    passwords.forEach((element) => {
      const { K1, K2 } = getKeys(element.split("-")[1], root);
      list += `<li>${decodeFeistelCipher({
        K1,
        K2,
        PT_Bin: element.split("-")[1],
      })}</li>`;
    });
    document.getElementById("passwords").innerHTML = list;
  }
});

function init() {
  let list = "";
  const passwordsString = localStorage.getItem("passwords");

  if (passwordsString) {
    const passwords = JSON.parse(passwordsString);
    passwords.forEach((element) => {
      list += `<li>${element.split("-")[0]}</li>`;
    });
    document.getElementById("passwords").innerHTML = list;
  }
}
init();
