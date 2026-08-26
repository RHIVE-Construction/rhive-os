import os

def test_transcription():
    output_file = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis\email_transcription_2026.md"
    assert os.path.exists(output_file), "Output file does not exist!"
    
    with open(output_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert "Total Emails Extracted:** 2" in content, "Should have 2 emails extracted"
    assert "Braylin eyes" in content, "Missing 'Braylin eyes' email"
    assert "Bark" in content, "Missing 'Bark' email"
    assert "braylinbark18@gmail.com" in content, "Missing braylinbark18 email login in body"
    assert "BrayBark18!!" in content, "Missing braylinbark password in body"
    
    # Verify chronological order by index
    idx_braylin = content.find("Braylin eyes")
    idx_bark = content.find("Bark")
    assert idx_braylin < idx_bark, "Emails are not in chronological order! 'Braylin eyes' (March) should come before 'Bark' (April)"
    
    print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_transcription()
