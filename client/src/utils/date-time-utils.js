import { differenceInYears } from 'date-fns'

export function memberSinceDateConverter(isoDate) {
    const result = isoDate.split('T').at(0)
    return result;
}

export function ageCalculator(date) {
    const [year, month, day] = date.split('-');
    
    const birthday = new Date(year, Number(month) - 1, day);
    const currentDate = new Date();
    
    const age = differenceInYears(currentDate, birthday);
    
    return age;
}