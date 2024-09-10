const plaintext = document.getElementById("plain-text");
const shift = document.getElementById("shift");
const encryptButton = document.getElementById("encrypt-Button");
const encryptButton2 = document.getElementById("encrypt-Button2");
const encryptButton3 = document.getElementById("encrypt-Button3");
const encryptButton4 = document.getElementById("encrypt-Button4");
const ciphertext = document.getElementById("cipher-text");
const keyinput = document.getElementById("key");

// Caesar cipher function 
function caesarCipher1(text, shift) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        if (alphabet.includes(char)) {
            const index = alphabet.indexOf(char);
            const newIndex = (index + shift) % 26;
            result += alphabet[newIndex];
        } else {
            result = "Không thể mã hóa vì có ký tự lạ";
            break;
        }
    }
    return result;
}


function monoalphabeticCipher(text) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const key = alphabet.split('')
    key.sort(() => Math.random() - 0.5);
    const k = key.join('');
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        if (alphabet.includes(char)) {
            const index = alphabet.indexOf(char);
            result += k[index];
        } else {
            result = "Không thể mã hóa vì có ký tự lạ";
            break;
        }
    }
    keyinput.value = k;
    return result;
}

function vigenereCipher(text, key) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    newKey = ""
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        if (alphabet.includes(char)) {
            const shift = alphabet.indexOf(key[i % key.length]);
            const index = alphabet.indexOf(char);
            const newIndex = (index + shift) % 26;
            result += table[index][shift];
            console.log("text,key, result:", char, key[i % key.length], table[index][shift])
        } else {
            result = "Không thể mã hóa vì có ký tự lạ";
            break;
        }
        newKey += key[i % key.length]

    }
    keyinput.value = newKey
    return result;
}

function vigenereCipher2(text, key) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    newKey = ""
    k = ''
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        if (alphabet.includes(char)) {
            if (i >= key.length) {
                const shift = alphabet.indexOf(text[(i - key.length) % text.length])
                const index = alphabet.indexOf(char);
                const newIndex = ((index + shift) % 26);
                result += table[index][shift];
                newKey += text[(i - key.length) % text.length];
                k = text[(i - key.length) % text.length];
                console.log("text,key, result:", char, k, table[index][shift])
            } else {
                const shift = alphabet.indexOf(key[i]);
                const index = alphabet.indexOf(char);
                const newIndex = (index + shift) % 26;
                result += table[index][shift];
                newKey += key[i % key.length]
                k = key[i % key.length]
                console.log("text,key, result:", char, k, table[index][shift])
            }

        } else {
            result = "Không thể mã hóa vì có ký tự lạ";
            break;
        }

    }

    keyinput.value = newKey
    return result;
}
encryptButton4.addEventListener("click", () => {
    try {
        const keyValue = (keyinput.value);
        const encryptedText = vigenereCipher2(plaintext.value, keyValue);
        ciphertext.innerHTML = encryptedText;
    } catch (error) {
        alert("Kiểm tra lại các ô dữ liều cần");
    }

});

encryptButton3.addEventListener("click", () => {
    try {
        const keyValue = (keyinput.value);
        const encryptedText = vigenereCipher(plaintext.value, keyValue);
        ciphertext.innerHTML = encryptedText;
    } catch (error) {
        alert("Kiểm tra lại các ô dữ liều cần");
    }

});

encryptButton2.addEventListener("click", () => {
    try {
        const encryptedText = monoalphabeticCipher(plaintext.value);
        ciphertext.innerHTML = encryptedText;
    } catch (error) {
        alert("Kiểm tra lại các ô dữ liều cần");
    }
});

encryptButton.addEventListener("click", () => {
    try {
        const shiftValue = parseInt(shift.value);
        const encryptedText = caesarCipher1(plaintext.value, shiftValue);
        ciphertext.innerHTML = encryptedText;
    } catch (error) {
        alert("Kiểm tra lại các ô dữ liều cần");
    }
});


function createVigenereTable(alphabet) {
    const table = [];
    for (let i = 0; i < alphabet.length; i++) {
        const row = [];
        for (let j = 0; j < alphabet.length; j++) {
            const shiftedIndex = (i + j) % alphabet.length;
            row.push(alphabet[shiftedIndex]);
        }
        table.push(row);
    }
    return table;
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const table = createVigenereTable(alphabet);

console.log(table);