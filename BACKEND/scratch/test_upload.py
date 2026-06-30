import urllib.request
import urllib.parse
import json
import sys
import os
import time

BACKEND_BASE = "http://localhost:8082"

def make_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    req_data = None
    if data is not None:
        if isinstance(data, dict):
            req_data = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        else:
            req_data = data.encode("utf-8")
            
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return 500, str(e)

def upload_file(url, email, filename, file_content):
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    body = []
    
    # 1. Email field
    body.append(f'--{boundary}'.encode('utf-8'))
    body.append('Content-Disposition: form-data; name="email"'.encode('utf-8'))
    body.append(b'')
    body.append(email.encode('utf-8'))
    
    # 2. File field
    body.append(f'--{boundary}'.encode('utf-8'))
    body.append(f'Content-Disposition: form-data; name="file"; filename="{filename}"'.encode('utf-8'))
    body.append('Content-Type: application/pdf'.encode('utf-8'))
    body.append(b'')
    body.append(file_content)
    
    body.append(f'--{boundary}--'.encode('utf-8'))
    body.append(b'')
    
    req_body = b'\r\n'.join(body)
    
    req = urllib.request.Request(url, data=req_body, method='POST')
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    req.add_header('Content-Length', str(len(req_body)))
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return 500, str(e)

def test_resume_upload():
    print("==================================================")
    print("REGISTERING TEST USER")
    print("==================================================")
    
    unique_email = f"upload_{int(time.time())}@jobportal.com"
    reg_data = {
        "name": "Upload Tester",
        "email": unique_email,
        "password": "secure_password",
        "skills": "Java, Spring"
    }
    
    status, response = make_request(f"{BACKEND_BASE}/register", "POST", reg_data)
    print(f"Register Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Pre-registration failed!")
        sys.exit(1)

    print("\n==================================================")
    print("TESTING RESUME MULTIPART UPLOAD")
    print("==================================================")
    
    # Dummy PDF contents (100 bytes)
    dummy_pdf_content = b"%PDF-1.4\n%EOF\nDummy PDF content for verification of the job portal upload functionality."
    filename = "candidate_resume.pdf"
    
    # Run the upload
    status, response = upload_file(
        f"{BACKEND_BASE}/user/profile/upload",
        unique_email,
        filename,
        dummy_pdf_content
    )
    
    print(f"Upload Status Code: {status}")
    print(f"Upload Response: {response}")
    
    if status != 200:
        print("FAIL: Upload failed!")
        sys.exit(1)
        
    # Check if saved physically in uploads directory
    uploads_dir = os.path.join("..", "uploads")
    saved_file_path = os.path.join(uploads_dir, filename)
    
    if os.path.exists(saved_file_path):
        print(f"PASS: File saved physically to {saved_file_path}")
    else:
        # Check parent folder in case path was resolved relative to workspace root
        alt_path = os.path.join("uploads", filename)
        if os.path.exists(alt_path):
             print(f"PASS: File saved physically to {alt_path}")
        else:
             print("FAIL: File not found in uploads folder!")
             sys.exit(1)
             
    # Download check
    print("\n==================================================")
    print("TESTING RESUME DOWNLOAD")
    print("==================================================")
    
    download_url = f"{BACKEND_BASE}/resume/{filename}"
    req = urllib.request.Request(download_url, method='GET')
    
    try:
        with urllib.request.urlopen(req) as response:
            content_type = response.headers.get("Content-Type")
            content_disposition = response.headers.get("Content-Disposition")
            downloaded_bytes = response.read()
            
            print(f"Download Status: {response.status}")
            print(f"Content-Type Header: {content_type}")
            print(f"Content-Disposition Header: {content_disposition}")
            
            if response.status == 200 and "application/pdf" in content_type and len(downloaded_bytes) > 0:
                print("PASS: Download request returns correctly with headers and body!")
            else:
                print("FAIL: Download parameters mismatch!")
                sys.exit(1)
    except Exception as e:
        print(f"FAIL: Download request threw exception: {e}")
        sys.exit(1)
        
    print("\n==================================================")
    print("RESUME UPLOAD AND DOWNLOAD VERIFIED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    test_resume_upload()
