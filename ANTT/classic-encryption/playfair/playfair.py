def generate_playfair_matrix(key):
    key = key.replace(" ", "").upper()
    key = key.replace("J", "I")  # Thay thế 'J' bằng 'I'
    alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
    matrix = []

    # Điền ma trận với khóa
    for char in key:
        if char not in matrix:
            matrix.append(char)

    # Điền phần còn lại của ma trận với bảng chữ cái
    for char in alphabet:
        if char not in matrix and char != 'J':  # Loại trừ 'J' vì đã thay thế bằng 'I'
            matrix.append(char)

    # Chuyển ma trận thành lưới 5x5
    playfair_matrix = [matrix[i:i+5] for i in range(0, 25, 5)]
    return playfair_matrix

def find_position(matrix, char):
    for i in range(5):
        for j in range(5):
            if matrix[i][j] == char:
                return i, j

def encrypt_playfair(plain_text, key):
    playfair_matrix = generate_playfair_matrix(key)
    plain_text = plain_text.upper().replace(" ", "")
    cipher_text = ""
    
    # Thêm 'X' vào giữa các cặp ký tự giống nhau nằm cạnh nhau
    i = 0
    while i < len(plain_text):
        char1 = plain_text[i]
        char2 = plain_text[i+1] if i+1 < len(plain_text) else 'X'

        if char1 == char2:
            plain_text = plain_text[:i+1] + 'X' + plain_text[i+1:]
        i += 2

    # Mã hóa văn bản
    for i in range(0, len(plain_text), 2):
        char1 = plain_text[i]
        char2 = plain_text[i+1] if i+1 < len(plain_text) else 'X'
        
        row1, col1 = find_position(playfair_matrix, char1)
        row2, col2 = find_position(playfair_matrix, char2)
        
        if row1 == row2:  # Cùng hàng
            cipher_text += playfair_matrix[row1][(col1 + 1) % 5]
            cipher_text += playfair_matrix[row2][(col2 + 1) % 5]
        elif col1 == col2:  # Cùng cột
            cipher_text += playfair_matrix[(row1 + 1) % 5][col1]
            cipher_text += playfair_matrix[(row2 + 1) % 5][col2]
        else:  # Khác hàng và cột
            cipher_text += playfair_matrix[row1][col2]
            cipher_text += playfair_matrix[row2][col1]
    
    return cipher_text


import os

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    clear_screen()

if __name__ == "__main__":
    main()
    
key = "THEDIEIS"
plain_text = "HELLOONEANDALL"
cipher_text = encrypt_playfair(plain_text, key)
print("Mã hóa :", cipher_text)
