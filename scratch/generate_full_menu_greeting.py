import os
import io
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
os.makedirs(AUDIO_DIR, exist_ok=True)

MENU_TEXT = """Welcome to R Hive Construction Roofing Specialists. Press 1 to speak with Hunni, our AI project assistant, for instant estimates, certified quotes, or fast transfer to a representative. Or listen to the following options: For Active Leaks or Emergency Storm Tarping, press 2. For Existing Projects, Billing, or Permits, press 3. For Suppliers and Trade Partners, press 4. To repeat this menu, press 5."""

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
    print("Generating 06_RHIVE_Full_IVR_Menu_Greeting.mp3 with Gemini 3.1 Flash TTS (Kore)...")
    wav_path = os.path.join(AUDIO_DIR, "06_RHIVE_Full_IVR_Menu_Greeting.wav")
    mp3_path = os.path.join(AUDIO_DIR, "06_RHIVE_Full_IVR_Menu_Greeting.mp3")
    artifact_mp3 = os.path.join(ARTIFACT_DIR, "06_RHIVE_Full_IVR_Menu_Greeting.mp3")
    
    full_content = f"You are Hunni, executive voice for R Hive Construction Roofing Specialists. Warm, professional, polished, and friendly. Speak clearly with natural pauses between options:\n\n{MENU_TEXT}"
    
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
                print(f"Successfully generated: {mp3_path} ({os.path.getsize(mp3_path)} bytes)")

if __name__ == '__main__':
    main()
