document.getElementById("encode-btn").addEventListener("click", () => {
  const seed = document.getElementById("seed").value;

  const PT = document.getElementById("plain-text").value;
  print("pt", PT);
  const { bin_data, encoded_str } = encodeFeistelCipher(PT, seed);
  print("encoded-bin", bin_data);

  print("result", encoded_str);
});
