function print(id, value) {
  document.getElementById(id).innerHTML = value;
}

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
  print("encode-step", steps);
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

function prepareData(PT, seed) {
  const { PT_Bin, PT_Ascii } = getText(PT);
  print("ascii", PT_Ascii);
  print("binary", PT_Bin);

  const n = Math.floor(PT_Bin.length / 2);
  const L1 = PT_Bin.slice(0, n);
  const R1 = PT_Bin.slice(n);
  print("l1", L1);
  print("r1", R1);
  const m = R1.length;

  const { PT_Bin: seed_Bin } = getText(seed);
  const dif = seed_Bin.length - PT_Bin.length;
  const tempSeed =
    dif < 0
      ? seed_Bin + PT_Bin.substring(0, Math.abs(dif))
      : seed_Bin.slice(dif);

  const K1 = tempSeed.length > 0 ? tempSeed.slice(0, n) : rand_key(m);
  const K2 = tempSeed.length > 0 ? tempSeed.slice(n) : rand_key(m);

  print("k1", K1);
  print("k2", K2);

  const { temp: f1, pre: pre1 } = exor(R1, K1);
  print("xor1", "exor(R1, K1) \n" + pre1 + "\nKQ f1:" + f1);

  const { temp: R2, pre: pre2 } = exor(f1, L1);
  print("xor2", "exor(f1, L1) \n" + pre2 + "\nKQ R2:" + R2);

  const L2 = R1;

  const { temp: f2, pre: pre3 } = exor(R2, K2);
  print("xor3", "exor(R2, K2) \n" + pre3 + "\nKQ f2:" + f2);

  const { temp: R3, pre: pre4 } = exor(f2, L2);
  print("xor4", "exor(f2, L2) \n" + pre4 + "\nKQ R3:" + R3);

  const L3 = R2;
  return { L3, R3, K2, K1 };
}

function encodeFeistelCipher(PT, seed) {
  const { L3, R3, K1, K2 } = prepareData(PT, seed);
  const bin_data = L3 + R3;
  const encoded_str = generateCipherText(bin_data);
  return { bin_data, encoded_str };
}

function decodeFeistelCipher({ encoded_str, K2, K1, L3, R3 }) {
  const L4 = L3;
  const R4 = R3;

  const { temp: f3 } = exor(L4, K2);
  const { temp: L5 } = exor(R4, f3);
  const R5 = L4;

  const { temp: f4 } = exor(L5, K1);
  const { temp: L6 } = exor(R5, f4);
  const R6 = L5;
  const PT1 = L6 + R6;
  console.log(PT1);
  let str_data = "";
  for (let i = 0; i < PT1.length; i += 8) {
    const temp_data = PT1.slice(i, i + 8);
    console.log(temp_data, binaryToDecimal(temp_data));
    str_data += String.fromCharCode(binaryToDecimal(temp_data));
  }
  return str_data;
}
