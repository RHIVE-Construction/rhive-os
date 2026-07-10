const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\Victor\\.gemini\\antigravity\\brain\\fe669648-f254-4347-8f42-bdceb92154d1\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;
    for await (const line of rl) {
        if (line.includes("9875 Memorial Drive")) {
            console.log(`Match ${++count}:`);
            // Parse to print it cleanly or just print a substring
            try {
                const obj = JSON.parse(line);
                console.log("Step index:", obj.step_index);
                console.log("Type:", obj.type);
                console.log("Source:", obj.source);
                console.log("Content length:", obj.content ? obj.content.length : 0);
                if (obj.content && obj.content.length > 500) {
                    console.log("Content preview:", obj.content.substring(0, 1000) + "\n... TRUNCATED ...");
                } else {
                    console.log("Content:", obj.content);
                }
            } catch (e) {
                console.log("Could not parse line as JSON. Substring:", line.substring(0, 500));
            }
            console.log("----------------------------------------\n");
        }
    }
}

main().catch(err => console.error(err));
