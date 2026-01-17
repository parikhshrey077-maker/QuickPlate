import sys
print(sys.executable)
try:
    import google.generativeai
    print("Success")
except ImportError as e:
    print(f"Error: {e}")
