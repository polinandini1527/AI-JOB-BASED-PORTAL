const API_BASE = "http://localhost:8082";

// Global job store for search/filter operations
let allJobs = [];

// Profile states
let isEditingProfile = false;
let currentUserData = null;

// =======================
// TOAST NOTIFICATION SYSTEM
// =======================
function showToast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-content">${message}</div>`;

    container.appendChild(toast);

    // Auto fade-out after 3.5 seconds
    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// =======================
// LOADING OVERLAY SYSTEM
// =======================
function showLoading() {
    if (document.querySelector(".loading-overlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector(".loading-overlay");
    if (overlay) overlay.remove();
}

// Helper to handle fetch responses and extract readable errors
async function handleResponse(response) {
    if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
            const body = await response.text();
            if (body) {
                try {
                    const errJson = JSON.parse(body);
                    if (errJson.message) errorMsg = errJson.message;
                } catch (e) {
                    errorMsg = body;
                }
            }
        } catch (e) {
            console.error("Failed to parse error body", e);
        }
        throw new Error(errorMsg);
    }
    return response;
}

// =======================
// REGISTER
// =======================
async function registerSuccess() {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    const confirmPasswordEl = document.getElementById("confirmPassword");
    const skillsEl = document.getElementById("skills");

    if (!nameEl.value || !emailEl.value || !passwordEl.value) {
        showToast("Please fill in all required fields!", "warning");
        return;
    }

    if (passwordEl.value !== confirmPasswordEl.value) {
        showToast("Passwords do not match!", "warning");
        return;
    }

    const user = {
        name: nameEl.value,
        email: emailEl.value,
        password: passwordEl.value,
        skills: skillsEl ? skillsEl.value : ""
    };

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        await handleResponse(response);
        
        showToast("Registration Successful!", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    } catch (error) {
        console.error("Registration error:", error);
        showToast("Registration Failed: " + error.message, "error");
    } finally {
        hideLoading();
    }
}

// =======================
// LOGIN
// =======================
async function loginSuccess() {
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");

    if (!emailEl.value || !passwordEl.value) {
        showToast("Please enter both email and password!", "warning");
        return;
    }

    const user = {
        email: emailEl.value,
        password: passwordEl.value
    };

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        const resText = await response.text();

        if (resText === "Login Successful") {
            localStorage.setItem("email", user.email);
            showToast("Login Successful!", "success");
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);
        } else {
            showToast(resText, "error"); // Invalid credentials from backend
        }
    } catch (error) {
        console.error("Login error:", error);
        showToast("Login Failed: " + error.message, "error");
    } finally {
        hideLoading();
    }
}

// =======================
// PROFILE LOADING & MANAGEMENT
// =======================
async function loadProfile() {
    const email = localStorage.getItem("email");
    if (!email) return;

    const nameEl = document.getElementById("candidateName");
    const emailEl = document.getElementById("candidateEmail");
    const skillsEl = document.getElementById("candidateSkills");
    const resumeEl = document.getElementById("resumeName");
    const avatarEl = document.getElementById("profileAvatar");

    if (!nameEl) return;

    try {
        const response = await fetch(`${API_BASE}/user/profile?email=${encodeURIComponent(email)}`);
        const user = await response.json();
        
        if (user) {
            currentUserData = user;
            nameEl.innerText = user.name || "Not Available";
            emailEl.innerText = user.email || "Not Available";
            skillsEl.innerText = user.skills || "Not Available";
            
            // Set initials in avatar
            if (user.name && avatarEl) {
                avatarEl.innerText = user.name.charAt(0).toUpperCase();
            }

            if (user.resumeName) {
                resumeEl.innerHTML = `
                    <a href="${API_BASE}/resume/${encodeURIComponent(user.resumeName)}" target="_blank" style="color: var(--primary); text-decoration: underline; font-weight: 700;">
                        <i class="fas fa-file-download"></i> ${user.resumeName}
                    </a>
                `;
            } else {
                resumeEl.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">No Resume Uploaded</span>';
            }
        } else {
            nameEl.innerText = "User Not Found";
        }
    } catch (error) {
        console.error("Profile load error:", error);
        showToast("Failed to load profile details: " + error.message, "error");
    }
}

// Custom file chooser text display
function updateFileNameLabel() {
    const input = document.getElementById("resume");
    const label = document.getElementById("fileChosenLabel");
    if (input && label && input.files.length > 0) {
        label.innerText = "Selected: " + input.files[0].name;
    }
}

async function uploadResume() {
    const resumeInput = document.getElementById("resume");
    const email = localStorage.getItem("email");

    if (!email) {
        showToast("Please login first to upload a resume", "warning");
        return;
    }

    if (resumeInput.files.length > 0) {
        const file = resumeInput.files[0];
        const formData = new FormData();
        formData.append("email", email);
        formData.append("file", file);

        showLoading();
        try {
            const response = await fetch(`${API_BASE}/user/profile/upload`, {
                method: "POST",
                body: formData
            });
            const res = await handleResponse(response);
            const user = await res.json();
            
            if (user && user.resumeName) {
                document.getElementById("resumeName").innerHTML = `
                    <a href="${API_BASE}/resume/${encodeURIComponent(user.resumeName)}" target="_blank" style="color: var(--primary); text-decoration: underline; font-weight: 700;">
                        <i class="fas fa-file-download"></i> ${user.resumeName}
                    </a>
                `;
                showToast("Resume Uploaded Successfully!", "success");
                
                // Clear selected file label
                const label = document.getElementById("fileChosenLabel");
                if (label) label.innerText = "";
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            showToast("Error uploading resume: " + error.message, "error");
        } finally {
            hideLoading();
        }
    } else {
        showToast("Please Select a Resume First", "warning");
    }
}

function toggleEditProfile() {
    const nameEl = document.getElementById("candidateName");
    const skillsEl = document.getElementById("candidateSkills");
    const editBtn = document.getElementById("editProfileBtn");

    if (!nameEl || !skillsEl || !currentUserData) return;

    if (!isEditingProfile) {
        nameEl.innerHTML = `<input type="text" id="editNameInput" class="form-control" value="${currentUserData.name || ''}" style="width: 100%; max-width: 320px; padding: 6px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);">`;
        skillsEl.innerHTML = `<input type="text" id="editSkillsInput" class="form-control" value="${currentUserData.skills || ''}" style="width: 100%; max-width: 320px; padding: 6px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);">`;
        editBtn.innerText = "Save Changes";
        editBtn.className = "btn";
        isEditingProfile = true;
    } else {
        const newName = document.getElementById("editNameInput").value;
        const newSkills = document.getElementById("editSkillsInput").value;
        saveProfileUpdates(newName, newSkills);
    }
}

async function saveProfileUpdates(name, skills) {
    const email = localStorage.getItem("email");
    if (!email) return;

    if (!name || !skills) {
        showToast("Name and skills are required!", "warning");
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/user/profile/update?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&skills=${encodeURIComponent(skills)}`, {
            method: "POST"
        });
        await handleResponse(response);
        
        showToast("Profile Updated Successfully!", "success");
        isEditingProfile = false;
        
        // Restore Edit Button class
        const editBtn = document.getElementById("editProfileBtn");
        if (editBtn) {
            editBtn.innerText = "Edit Profile";
            editBtn.className = "btn btn-secondary";
        }
        
        // Reload details
        loadProfile();
    } catch (error) {
        console.error("Save profile updates error:", error);
        showToast("Failed to update profile: " + error.message, "error");
    } finally {
        hideLoading();
    }
}

// =======================
// JOBS SEARCH & FILTERS
// =======================
async function loadJobs() {
    const container = document.querySelector(".job-container");
    if (!container) return; // not on jobs.html

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/jobs`);
        allJobs = await response.json();
        
        populateFilters(allJobs);
        renderJobs(allJobs);
    } catch (error) {
        console.error("Failed to load jobs:", error);
        showToast("Failed to fetch jobs list", "error");
    } finally {
        hideLoading();
    }
}

function populateFilters(jobs) {
    const companyFilter = document.getElementById("companyFilter");
    const locationFilter = document.getElementById("locationFilter");
    if (!companyFilter || !locationFilter) return;

    const companies = [...new Set(jobs.map(j => j.company))].sort();
    const locations = [...new Set(jobs.map(j => j.location))].sort();

    companyFilter.innerHTML = '<option value="">All Companies</option>';
    companies.forEach(c => {
        companyFilter.innerHTML += `<option value="${c}">${c}</option>`;
    });

    locationFilter.innerHTML = '<option value="">All Locations</option>';
    locations.forEach(l => {
        locationFilter.innerHTML += `<option value="${l}">${l}</option>`;
    });
}

function filterJobs() {
    const searchInput = document.getElementById("searchInput");
    const companyFilter = document.getElementById("companyFilter");
    const locationFilter = document.getElementById("locationFilter");
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase();
    const selectedCompany = companyFilter ? companyFilter.value : "";
    const selectedLocation = locationFilter ? locationFilter.value : "";

    const filtered = allJobs.filter(job => {
        const matchesQuery = job.title.toLowerCase().includes(query);
        const matchesCompany = !selectedCompany || job.company === selectedCompany;
        const matchesLocation = !selectedLocation || job.location === selectedLocation;
        return matchesQuery && matchesCompany && matchesLocation;
    });

    renderJobs(filtered);
}

function renderJobs(jobs) {
    const container = document.querySelector(".job-container");
    if (!container) return;

    container.innerHTML = "";
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p>No Jobs Available matching your criteria.</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        container.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <button onclick="applyJob('${job.title}')">Apply Now</button>
            </div>
        `;
    });
}

// =======================
// POST JOB
// =======================
async function postJob() {
    const titleEl = document.getElementById("jobTitle");
    const companyEl = document.getElementById("company");
    const locationEl = document.getElementById("location");

    if (!titleEl.value || !companyEl.value || !locationEl.value) {
        showToast("Please fill in job title, company, and location!", "warning");
        return;
    }

    const job = {
        title: titleEl.value,
        company: companyEl.value,
        location: locationEl.value
    };

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job)
        });
        await handleResponse(response);

        showToast("Job Posted Successfully!", "success");
        titleEl.value = "";
        companyEl.value = "";
        locationEl.value = "";

        loadRecruiterDashboard();
    } catch (error) {
        console.error("Post job error:", error);
        showToast("Failed to post job: " + error.message, "error");
    } finally {
        hideLoading();
    }
}

// =======================
// APPLY JOB
// =======================
async function applyJob(jobTitle) {
    const email = localStorage.getItem("email");
    if (!email) {
        showToast("Please login first to apply for jobs!", "warning");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
        return;
    }

    const application = {
        userEmail: email,
        jobTitle: jobTitle,
        status: "Applied"
    };

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
        });
        await handleResponse(response);

        showToast(`${jobTitle} Application Submitted!`, "success");
    } catch (error) {
        console.error("Apply job error:", error);
        showToast(error.message, "error"); // Displays duplicate check error message
    } finally {
        hideLoading();
    }
}

// =======================
// APPLICATION HISTORY
// =======================
async function loadApplications() {
    const container = document.getElementById("applicationList");
    if (!container) return;

    const email = localStorage.getItem("email");
    if (!email) {
        container.innerHTML = `<div class="empty-state">
            <p>Please login to view application history.</p>
        </div>`;
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/applications?email=${encodeURIComponent(email)}`);
        const apps = await response.json();

        container.innerHTML = "";
        if (apps.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No Applications Yet</p>
                </div>
            `;
        } else {
            apps.forEach(app => {
                let badgeClass = "applied";
                const stat = app.status.toLowerCase();
                if (stat.includes("shortlist")) badgeClass = "shortlisted";
                if (stat.includes("reject")) badgeClass = "rejected";
                if (stat.includes("select")) badgeClass = "selected";

                container.innerHTML += `
                    <div class="job-card">
                        <h3>${app.jobTitle}</h3>
                        <p>Status: <span class="status ${badgeClass}">${app.status}</span></p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Load applications error:", error);
        container.innerHTML = `<div class="empty-state"><p>Failed to load applications.</p></div>`;
    } finally {
        hideLoading();
    }
}

// =======================
// AI RECOMMENDATIONS
// =======================
async function recommendJob() {
    const skillsEl = document.getElementById("skills");
    const resultEl = document.getElementById("result");

    if (!skillsEl || !skillsEl.value) {
        showToast("Please enter some skills first!", "warning");
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recommendations?skills=${encodeURIComponent(skillsEl.value)}`);
        const resJson = await response.json();
        
        const output = resJson.recommendation || "No recommendation found.";
        
        // Parse the returned recommendation string dynamically
        // Format: "JobTitle at CompanyName - MatchPercent%"
        // Check matching with regex
        const regex = /(.+)\sat\s(.+)\s-\s(\d+%)\sMatch/i;
        const match = output.match(regex);
        
        if (match) {
            const title = match[1];
            const company = match[2];
            const percent = match[3];
            
            resultEl.innerHTML = `
                <div class="job-card" style="max-width: 440px; margin: 20px auto; border-color: var(--primary);">
                    <div style="font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 8px;">${percent}</div>
                    <h3 style="margin-bottom: 8px;">${title}</h3>
                    <p style="font-weight: 600;"><i class="fas fa-building"></i> ${company}</p>
                    <p style="font-size: 14px; margin-top: 12px; color: var(--text-muted);">This job matches your skill portfolio based on semantic parsing.</p>
                </div>
            `;
        } else {
            resultEl.innerHTML = `<div class="job-card" style="max-width:440px; margin: 20px auto;"><p>${output}</p></div>`;
        }
    } catch (error) {
        console.error("Recommendation error:", error);
        showToast("Recommendation service unavailable.", "error");
    } finally {
        hideLoading();
    }
}

// =======================
// ADMIN DASHBOARD
// =======================
async function loadAdminDashboard() {
    const usersEl = document.getElementById("totalUsers");
    const jobsEl = document.getElementById("totalJobs");
    const appsEl = document.getElementById("totalApplications");

    if (!usersEl) return;

    try {
        const response = await fetch(`${API_BASE}/admin/stats`);
        const stats = await response.json();

        usersEl.innerText = stats.totalUsers || 0;
        jobsEl.innerText = stats.totalJobs || 0;
        appsEl.innerText = stats.totalApplications || 0;
        
        const recruitersEl = document.getElementById("totalRecruiters");
        if (recruitersEl) {
            recruitersEl.innerText = stats.totalRecruiters || 0;
        }
    } catch (error) {
        console.error("Admin dashboard load error:", error);
    }
}

// =======================
// RECRUITER DASHBOARD
// =======================
async function loadRecruiterDashboard() {
    const cards = document.querySelectorAll(".dashboard-card p");
    if (cards.length < 3) return;

    try {
        const response = await fetch(`${API_BASE}/recruiter/stats`);
        const stats = await response.json();

        cards[0].innerText = stats.totalJobs || 0;
        cards[1].innerText = stats.totalApplications || 0;
        cards[2].innerText = stats.shortlistedCandidates || 0;

        const recentJobsContainer = document.getElementById("postedJobsContainer");
        if (recentJobsContainer) {
            const jobsResponse = await fetch(`${API_BASE}/jobs`);
            const jobs = await jobsResponse.json();
            
            recentJobsContainer.innerHTML = "";
            const recent = jobs.slice(-3).reverse();
            if (recent.length === 0) {
                recentJobsContainer.innerHTML = "<p>No jobs posted yet.</p>";
            } else {
                recent.forEach(job => {
                    recentJobsContainer.innerHTML += `
                        <div class="job-card" style="margin: 10px 0;">
                            <h4>${job.title}</h4>
                            <p>Company: ${job.company} | Location: ${job.location}</p>
                        </div>
                    `;
                });
            }
        }
    } catch (error) {
        console.error("Recruiter stats load error:", error);
    }
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.clear();
    showToast("Logged Out Successfully", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

// =======================
// PAGE LOAD DISPATCHER
// =======================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Highlight active navigation page
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === page || (page === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // 2. Load page elements
    loadProfile();
    loadJobs();
    loadApplications();
    loadAdminDashboard();
    loadRecruiterDashboard();

    // 3. User Welcome banner
    const appCountBadge = document.getElementById("applicationCount");
    const userWelcomeEl = document.getElementById("userWelcome");
    const email = localStorage.getItem("email");

    if (userWelcomeEl) {
        if (email) {
            fetch(`${API_BASE}/user/profile?email=${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(user => {
                if (user) {
                    userWelcomeEl.innerHTML = "Welcome, " + user.name;
                    localStorage.setItem("name", user.name);
                }
            })
            .catch(e => console.error(e));
        } else {
            userWelcomeEl.innerHTML = "Welcome, Guest";
        }
    }

    if (appCountBadge && email) {
        fetch(`${API_BASE}/applications?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(apps => {
            appCountBadge.innerText = apps.length;
        })
        .catch(e => console.error(e));
    }
});