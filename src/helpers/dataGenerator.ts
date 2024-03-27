// import Chance from 'chance';
// const chance = new Chance();

export const generateUniqueEmail = (baseEmail: string) => {
    const timestamp = Date.now();
    const [username, domain] = baseEmail.split('@');
    return `${username}+${timestamp}@${domain}`;
};

export const generateUniqueUsername = (baseUsername: string) => {
    const timestamp = Date.now();
    return `${baseUsername}_${timestamp}`;
};