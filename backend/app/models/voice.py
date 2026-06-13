import librosa
import numpy as np
import io
import os
import joblib
import tempfile
import subprocess

# Define path to the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "voice_model.pkl")

# Load model globally
try:
    model = joblib.load(MODEL_PATH)
    print(f"Voice Model loaded from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading voice model: {e}")
    model = None

def extract_features(y, sr):
    try:
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfcc_mean = np.mean(mfcc.T, axis=0)
        return mfcc_mean
    except Exception as e:
        print(f"Feature extraction error: {e}")
        return None

def _compute_basic_stress(y, sr):
    try:
        rms = librosa.feature.rms(y=y)[0]
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        energy = float(np.mean(rms))
        crossings = float(np.mean(zcr))
        base = min(1.0, energy * 10.0)
        modifier = crossings
        score = (base * 70.0) + (modifier * 30.0)
        score = max(0.0, min(100.0, score))
        f0, _, _ = librosa.pyin(y, fmin=librosa.note_to_hz("C2"), fmax=librosa.note_to_hz("C7"))
        f0_clean = f0[~np.isnan(f0)]
        avg_pitch = float(np.mean(f0_clean)) if len(f0_clean) > 0 else 0.0
        if score < 30:
            risk_class = 0
            probs = [1.0, 0.0, 0.0]
        elif score < 65:
            risk_class = 1
            probs = [0.2, 0.6, 0.2]
        else:
            risk_class = 2
            probs = [0.1, 0.2, 0.7]
        return {
            "stress_score": round(float(score), 1),
            "risk_class": risk_class,
            "probabilities": {
                "low": float(probs[0]),
                "medium": float(probs[1]),
                "high": float(probs[2]),
            },
            "pitch_avg": round(avg_pitch, 1),
        }
    except Exception:
        return {
            "stress_score": 0.0,
            "risk_class": 0,
            "probabilities": {"low": 1.0, "medium": 0.0, "high": 0.0},
            "pitch_avg": 0.0,
        }

def analyze_voice(audio_bytes):
    """
    Analyzes audio for stress markers using either the trained model
    or a lightweight acoustic heuristic if the model is unavailable.
    """
    temp_input = None
    temp_output = None
    try:
        # Create a temporary file for input
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
            temp_audio.write(audio_bytes)
            temp_input = temp_audio.name

        # Create a temporary file for output (wav)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
            temp_output = temp_wav.name

        # Convert webm to wav using ffmpeg
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", temp_input, temp_output],
                check=True,
                capture_output=True
            )
            # Load the converted wav file
            y, sr = librosa.load(temp_output, sr=None)
        except Exception as ffmpeg_err:
            print(f"FFmpeg conversion failed: {ffmpeg_err}. Trying direct load...")
            # Fallback to direct load if ffmpeg fails
            y, sr = librosa.load(temp_input, sr=None)

        if len(y) == 0:
            return {
                "stress_score": 0.0,
                "risk_class": 0,
                "probabilities": {"low": 1.0, "medium": 0.0, "high": 0.0},
                "pitch_avg": 0.0,
                "no_speech": True,
            }

        rms = librosa.feature.rms(y=y)[0]
        energy = float(np.mean(rms))

        f0, _, _ = librosa.pyin(
            y,
            fmin=librosa.note_to_hz("C2"),
            fmax=librosa.note_to_hz("C7"),
        )
        f0_clean = f0[~np.isnan(f0)]
        avg_pitch = float(np.mean(f0_clean)) if len(f0_clean) > 0 else 0.0
        voiced_fraction = float(len(f0_clean)) / float(len(f0)) if len(f0) > 0 else 0.0

        if energy < 0.008 and voiced_fraction < 0.05:
            return {
                "stress_score": 0.0,
                "risk_class": 0,
                "probabilities": {"low": 1.0, "medium": 0.0, "high": 0.0},
                "pitch_avg": round(avg_pitch, 1),
                "no_speech": True,
            }

        features = extract_features(y, sr)

        if model and features is not None:
            features_reshaped = features.reshape(1, -1)
            risk_class = int(model.predict(features_reshaped)[0])
            probs = model.predict_proba(features_reshaped)[0]
            if len(probs) == 3:
                stress_score = (probs[1] * 50) + (probs[2] * 100)
            elif len(probs) == 2:
                stress_score = probs[1] * 100
            else:
                stress_score = 0
            stress_score = float(stress_score)
            return {
                "stress_score": round(stress_score, 1),
                "risk_class": risk_class,
                "probabilities": {
                    "low": float(probs[0]) if len(probs) > 0 else 0,
                    "medium": float(probs[1]) if len(probs) > 1 else 0,
                    "high": float(probs[2]) if len(probs) > 2 else 0,
                },
                "pitch_avg": round(avg_pitch, 1),
                "no_speech": False,
            }

        stress = _compute_basic_stress(y, sr)
        stress["no_speech"] = False
        return stress

    except Exception as e:
        print(f"Voice analysis error (fallback to neutral): {e}")
        return {
            "stress_score": 0.0,
            "risk_class": 0,
            "probabilities": {"low": 1.0, "medium": 0.0, "high": 0.0},
            "pitch_avg": 0.0,
        }
    finally:
        for path in [temp_input, temp_output]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass
