import urllib.request
import urllib.parse
import json
import sys
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

def test_api():
    print("==================================================")
    print("STARTING API TESTING FOR JOB PORTAL")
    print("==================================================")
    
    unique_email = f"test_{int(time.time())}@portal.com"
    
    # 1. Register
    reg_data = {
        "name": "Test Candidate",
        "email": unique_email,
        "password": "secure_password",
        "skills": "Java, Spring Boot"
    }
    status, response = make_request(f"{BACKEND_BASE}/register", "POST", reg_data)
    print(f"1. Register Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Register failed")
        sys.exit(1)
        
    # 2. Login
    login_data = {
        "email": unique_email,
        "password": "secure_password"
    }
    status, response = make_request(f"{BACKEND_BASE}/login", "POST", login_data)
    print(f"2. Login Status: {status}, Response: {response}")
    if status != 200 or response != "Login Successful":
        print("FAIL: Login failed")
        sys.exit(1)

    # 3. User Profile
    status, response = make_request(f"{BACKEND_BASE}/user/profile?email={urllib.parse.quote(unique_email)}")
    print(f"3. Get Profile Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Profile fetch failed")
        sys.exit(1)

    # 4. Jobs List
    status, response = make_request(f"{BACKEND_BASE}/jobs")
    print(f"4. Get Jobs Status: {status}, Response (Truncated): {response[:200]}")
    if status != 200:
        print("FAIL: Jobs fetch failed")
        sys.exit(1)

    # 5. Apply Job
    app_data = {
        "userEmail": unique_email,
        "jobTitle": "Java Full Stack Developer",
        "status": "Applied"
    }
    status, response = make_request(f"{BACKEND_BASE}/applications", "POST", app_data)
    print(f"5. Apply Job Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Apply Job failed")
        sys.exit(1)

    # 6. Apply Job Duplicate Check (Should fail with 400 Bad Request)
    status, response = make_request(f"{BACKEND_BASE}/applications", "POST", app_data)
    print(f"6. Duplicate Application check Status: {status}, Response: {response}")
    if status != 400 or "already applied" not in response.lower():
        print("FAIL: Duplicate Application prevention failed")
        sys.exit(1)

    # 7. AI Recommendation
    status, response = make_request(f"{BACKEND_BASE}/recommendations?skills={urllib.parse.quote('Java')}")
    print(f"7. Recommendation Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: AI Recommendation failed")
        sys.exit(1)

    # 8. Admin stats
    status, response = make_request(f"{BACKEND_BASE}/admin/stats")
    print(f"8. Admin stats Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Admin stats failed")
        sys.exit(1)

    # 9. Recruiter stats
    status, response = make_request(f"{BACKEND_BASE}/recruiter/stats")
    print(f"9. Recruiter stats Status: {status}, Response: {response}")
    if status != 200:
        print("FAIL: Recruiter stats failed")
        sys.exit(1)

    print("\n==================================================")
    print("ALL API ENDPOINTS TESTED SUCCESSFULLY! [PASS]")
    print("==================================================")

if __name__ == "__main__":
    test_api()
