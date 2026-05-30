import path from 'path';

const testPaths = [
    '//?/C:/Users/mjrob/.gemini/antigravity/brain/a8707e63-7c28-4d28-8bd0-01caacf0c810/01_public_homepage.png',
    '///?/C:/Users/mjrob/.gemini/antigravity/brain/a8707e63-7c28-4d28-8bd0-01caacf0c810/01_public_homepage.png',
    '/\\\\?\\C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810\\01_public_homepage.png'
];

testPaths.forEach(p => {
    console.log(`\nInput: ${p}`);
    console.log('path.resolve:', path.resolve(p));
    console.log('Starts with /:', p.startsWith('/'));
});
