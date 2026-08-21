import os
import wave
import av
import shutil
import dotenv
from google import genai
from google.genai import types

dotenv.load_dotenv()
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

AUDIO_DIR = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\hybrid_ivr_audio"
ARTIFACT_DIR = r"C:\Users\mjrob\.gemini\antigravity\brain\26528e87-5332-4030-9fe4-230271a6a111"

NO_INPUT_CLIPS = [
    {
        "filename_base": "04_RHIVE_No_Input_Connecting_To_Hunni",
        "text": """We didn't catch a selection. Connecting you directly with Hunni, our AI project specialist, to assist you right away.""",
        "prompt": "You are Hunni, executive AI concierge for R Hive Construction Roofing Specialists. Warm, natural, welcoming, and reassuring. Speak clearly and smoothly."
    },
    {
        "filename_base": "05_RHIVE_No_Input_Menu_Reprompt",
        "text": """We didn't receive your selection. For Quotes, press 1. For Emergency Leaks, press 2. For Project Status, press 3. For Trade Partners, press 4. Or stay on the line for Hunni.""",
        "prompt": "You are Hunni. Polite, clear, friendly assistance. Pace each numbered option with a clean brief pause."
    }
]

def save_pcm_to_wav(pcm_data, out_wav_path, sample_rate=24000):
    with wave.open(out_wav_path, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(pcm_data)

def wav_to_mp3(wav_path, mp3_path, bitrate=192000):
    input_container = av.open(wav_path)
    in_stream = input_container.streams.audio[0]
    output_container = av.open(mp3_path, mode='w')
    out_stream = output_container.add_stream('mp3', rate=in_stream.rate)
    out_stream.bit_rate = bitrate
    out_stream.layout = 'mono'
    for packet in input_container.demux(in_stream):
        for frame in packet.decode():
            for out_packet in out_stream.encode(frame):
                output_container.mux(out_packet)
    for out_packet in out_stream.encode():
        output_container.mux(out_packet)
    output_container.close()
    input_container.close()

def main():
    for clip in NO_INPUT_CLIPS:
        print(f"Generating Gemini 3.1 Flash TTS for {clip['filename_base']}...")
        wav_path = os.path.join(AUDIO_DIR, f"{clip['filename_base']}.wav")
        mp3_path = os.path.join(AUDIO_DIR, f"{clip['filename_base']}.mp3")
        artifact_mp3 = os.path.join(ARTIFACT_DIR, f"{clip['filename_base']}.mp3")
        
        full_content = f"{clip['prompt']}\n\nSpeak verbatim:\n{clip['text']}"
        try:
            response = client.models.generate_content(
                model="gemini-3.1-flash-tts-preview",
                contents=full_content,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore"
                            )
                        )
                    )
                )
            )
            for candidate in response.candidates:
                for part in candidate.content.parts:
                    if part.inline_data and part.inline_data.data:
                        raw_pcm = part.inline_data.data
                        save_pcm_to_wav(raw_pcm, wav_path)
                        wav_to_mp3(wav_path, mp3_path)
                        shutil.copy2(mp3_path, artifact_mp3)
                        print(f"Successfully created MP3: {mp3_path}")
        except Exception as e:
            print(f"Error generating {clip['filename_base']}: {e}")

if __name__ == '__main__':
    main()
