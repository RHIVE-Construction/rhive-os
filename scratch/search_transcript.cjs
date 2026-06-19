const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Victor\\.gemini\\antigravity\\brain\\fe669648-f254-4347-8f42-bdceb92154d1\\.system_generated\\logs\\transcript_full.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes("9875 Memorial Drive") && line.includes("USER_INPUT")) {
            try {
                const obj = JSON.parse(line);
                // Extract the JSON block from content
                const content = obj.content;
                const startIndex = content.indexOf('{');
                const endIndex = content.lastIndexOf('}');
                if (startIndex !== -1 && endIndex !== -1) {
                    const jsonStr = content.substring(startIndex, endIndex + 1);
                    // Verify it parses as JSON
                    const parsed = JSON.parse(jsonStr);
                    fs.writeFileSync('./scratch/memorial_response.json', JSON.stringify(parsed, null, 2));
                    console.log("Saved full JSON payload to ./scratch/memorial_response.json");
                } else {
                    console.log("Could not find JSON bounds in content");
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
            break;
        }
    }
}

main().catch(err => console.error(err));
