def is_pangram(s):
    word_arr = []

    sumbols_arr = [',', '.']
    
    s = s.lower()

    splited_text = s.split(" ")

    for word in splited_text:
        splited_words = list(word)

        print(splited_words)
        
        for i in splited_words:
            try:
                int(i)
            except: 
                if i not in word_arr and i not in sumbols_arr:
                    word_arr.append(i)
    
    print(word_arr)
    print(len(word_arr))

is_pangram("Pack my box with five dozen liquor jugs.")