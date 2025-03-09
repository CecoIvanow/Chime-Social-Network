export function memberSinceDateConverter(isoDate) {
    const result = isoDate.split('T').at(0)
    return result;
}