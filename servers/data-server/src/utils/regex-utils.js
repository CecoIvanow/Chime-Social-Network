const REGEX_SPECIAL_CHARACTERS = ['.', '+', '*', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'];

export function escapeRegex(string) {
    const splitStr = string.split('');

    const escapedString = splitStr.map(curChar => {
        if (REGEX_SPECIAL_CHARACTERS.includes(curChar)) {
            return `\\${curChar}`
        };

        return curChar
    })

    return escapedString.join('');
}