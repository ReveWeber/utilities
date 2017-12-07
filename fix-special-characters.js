/*
    special character flattening and removal, ending with an all-ascii string
    many other options here: https://stackoverflow.com/questions/286921/efficiently-replace-all-accented-characters-in-a-string
*/

function fixSpecialCharacters(text) {
    // in the ascii range but nope
    text = text.replace(/</g, '[');
    text = text.replace(/>/g, ']');

    // punctuation and symbols
    text = text.replace(/\u00B4/g, '\'');
    text = text.replace(/\u00BC/g, '1/4');
    text = text.replace(/\u00BD/g, '1/2');
    text = text.replace(/\u00BE/g, '3/4');
    text = text.replace(/\u00D7/g, 'x');
    text = text.replace(/\u00F7/g, '/');
    
    // accents, ligatures, non-English letters, uppercase
    text = text.replace(/[\u00C0-\u00C5]/g, 'A');
    text = text.replace(/\u00C6/g, 'AE');
    text = text.replace(/\u00C7/g, 'C');
    text = text.replace(/[\u00C8-\u00CB]/g, 'E');
    text = text.replace(/[\u00CC-\u00CF]/g, 'I');
    text = text.replace(/\u00D1/g, 'N');
    text = text.replace(/[\u00D2-\u00D6]/g, 'O');
    text = text.replace(/\u00D0/g, 'D');
    text = text.replace(/\u00D8/g, 'O');
    text = text.replace(/[\u00D9-\u00DC]/g, 'U');
    text = text.replace(/\u00DD/g, 'Y');
    text = text.replace(/\u00DE/g, 'P');
    
    // accents, ligatures, non-English letters, lowercase
    text = text.replace(/\u00DF/g, 'B');
    text = text.replace(/[\u00E0-\u00E5]/g, 'a');
    text = text.replace(/\u00E6/g, 'ae');
    text = text.replace(/\u00E7/g, 'c');
    text = text.replace(/[\u00E8-\u00EB]/g, 'e');
    text = text.replace(/[\u00EC-\u00EF]/g, 'i');
    text = text.replace(/\u00F1/g, 'n');
    text = text.replace(/[\u00F2-\u00F6]/g, 'o');
    text = text.replace(/\u00F0/g, 'd');
    text = text.replace(/\u00F8/g, 'o');
    text = text.replace(/[\u00F9-\u00FC]/g, 'u');
    text = text.replace(/\u00FD/g, 'y');
    text = text.replace(/\u00FE/g, 'p');
    text = text.replace(/\u00FF/g, 'y');
    
    // anything left outside the ascii range? cut it
    text = text.replace(/[^\u0000-\u007f]/g, '');
    return text;
}