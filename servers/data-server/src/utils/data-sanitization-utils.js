export function emailMasking(email) {
    const [localPart, domain] = email.split('@')

    const splicedLocalPart = localPart
        .split('')
        .splice(0, 2)
        .join('');

    const splicedDomain = domain
        .split('.')
        .shift()
        .split("")
        .shift();

    const splicedTopLevelDomain = domain
        .split('.')
        .pop();

    const censoredEmail = [...splicedLocalPart, '*****@', ...splicedDomain, '*****.', ...splicedTopLevelDomain].join('');

    return censoredEmail
}