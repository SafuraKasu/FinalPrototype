document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const logoutBtn = document.querySelector('.btn-logout');

    // Job Search and Filters
    const jobSearch = document.getElementById('jobSearch');
    const locationFilter = document.getElementById('locationFilter');
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const experienceFilter = document.getElementById('experienceFilter');

    // Applications
    const applicationStatusFilter = document.getElementById('applicationStatusFilter');
    const applicationSort = document.getElementById('applicationSort');
    const applicationSearch = document.getElementById('applicationSearch');
    const applicationsGrid = document.getElementById('applicationsGrid');
    const timelineContainer = document.getElementById('timelineContainer');
    const calendarContainer = document.getElementById('calendarContainer');

    // Resume Enhancer
    const resumeScore = document.getElementById('resumeScore');
    const missingKeywords = document.getElementById('missingKeywords');
    const suggestionsList = document.getElementById('suggestionsList');
    const noKeywords = document.getElementById('noKeywords');
    const noSuggestions = document.getElementById('noSuggestions');

    // Profile Section
    const profileForm = document.getElementById('profileForm');
    const addSkillBtn = document.getElementById('addSkill');
    const addExperienceBtn = document.getElementById('addExperience');
    const addEducationBtn = document.getElementById('addEducation');

    // Skills Management
    function loadSkills() {
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        const technicalSkills = skills.filter(skill => skill.type === 'technical');
        const softSkills = skills.filter(skill => skill.type === 'soft');

        // Clear existing skills
        document.getElementById('technicalSkills').innerHTML = '';
        document.getElementById('softSkills').innerHTML = '';

        // Add technical skills
        technicalSkills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-tag';
            skillDiv.innerHTML = `
                <span>${skill.name}</span>
                <i class="fas fa-times" onclick="removeSkill('${skill.id}')"></i>
            `;
            document.getElementById('technicalSkills').appendChild(skillDiv);
        });

        // Add soft skills
        softSkills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-tag';
            skillDiv.innerHTML = `
                <span>${skill.name}</span>
                <i class="fas fa-times" onclick="removeSkill('${skill.id}')"></i>
            `;
            document.getElementById('softSkills').appendChild(skillDiv);
        });

        // Update skill proficiency chart
        updateSkillProficiency();
    }

    function addSkill(type) {
        const skillInput = document.getElementById('skillInput');
        const skillName = skillInput.value.trim();

        if (skillName) {
            const skills = JSON.parse(localStorage.getItem('skills') || '[]');
            const newSkill = {
                id: Date.now().toString(),
                name: skillName,
                type: type,
                proficiency: 'beginner'
            };

            skills.push(newSkill);
            localStorage.setItem('skills', JSON.stringify(skills));
            skillInput.value = '';
            loadSkills();
        }
    };

    function removeSkill(skillId) {
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        const updatedSkills = skills.filter(skill => skill.id !== skillId);
        localStorage.setItem('skills', JSON.stringify(updatedSkills));
        loadSkills();
    }

    function updateSkillProficiency() {
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        const skillBars = document.querySelectorAll('.bar-fill');

        skills.forEach((skill, index) => {
            let proficiency = 0;
            switch(skill.proficiency) {
                case 'beginner': proficiency = 25; break;
                case 'intermediate': proficiency = 50; break;
                case 'advanced': proficiency = 75; break;
                case 'expert': proficiency = 100; break;
            }
            skillBars[index].style.width = `${proficiency}%`;
        });
    }

    // Experience Management
    function addExperience() {
        const experienceList = document.getElementById('experienceList');
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.innerHTML = `
            <div class="form-group">
                <label>Company</label>
                <input type="text" placeholder="Company Name">
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" placeholder="Your Position">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" placeholder="e.g., Jan 2020 - Present">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your responsibilities and achievements"></textarea>
            </div>
            <i class="fas fa-times remove" onclick="removeItem(this)"></i>
        `;
        experienceList.appendChild(experienceItem);
        updateProfileCompletion();
    }

    // Education Management
    function addEducation() {
        const educationList = document.getElementById('educationList');
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.innerHTML = `
            <div class="form-group">
                <label>Institution</label>
                <input type="text" placeholder="University/School Name">
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" placeholder="e.g., Bachelor of Science">
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" placeholder="e.g., Computer Science">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" placeholder="e.g., 2016 - 2020">
            </div>
            <i class="fas fa-times remove" onclick="removeItem(this)"></i>
        `;
        educationList.appendChild(educationItem);
        updateProfileCompletion();
    }

    function removeItem(element) {
        element.parentElement.remove();
        updateProfileCompletion();
    }

    // Profile Completion
    function updateProfileCompletion() {
        const totalFields = 10; // Total number of required fields
        let completedFields = 0;

        // Check basic information
        if (document.getElementById('name').value) completedFields++;
        if (document.getElementById('email').value) completedFields++;
        if (document.getElementById('phone').value) completedFields++;
        if (document.getElementById('location').value) completedFields++;
        if (document.getElementById('summary').value) completedFields++;

        // Check social media
        if (document.getElementById('linkedin').value) completedFields++;
        if (document.getElementById('github').value) completedFields++;
        if (document.getElementById('portfolio').value) completedFields++;

        // Check skills
        const technicalSkills = document.getElementById('technicalSkills').children.length;
        const softSkills = document.getElementById('softSkills').children.length;
        if (technicalSkills > 0) completedFields++;
        if (softSkills > 0) completedFields++;

        const completionPercentage = (completedFields / totalFields) * 100;
        document.querySelector('.completion-bar .progress').style.width = `${completionPercentage}%`;
        document.querySelector('.completion-text').textContent = `${Math.round(completionPercentage)}% Complete`;
    }

    // Handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        // Update active section
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
                section.style.display = 'block';
                
                // Initialize section-specific content
                if (targetId === 'customized-resumes') {
                    updateResumeSuggestions();
                }
            } else {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        navLinksContainer.classList.remove('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // Profile Form
    const currentResume = document.getElementById('currentResume');

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
        const profileData = Object.fromEntries(formData.entries());
        
        // Save to localStorage
        localStorage.setItem('profileData', JSON.stringify(profileData));
        
        // Show success message
        alert('Profile updated successfully!');
    });

    // Load saved profile data
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
        const profileData = JSON.parse(savedProfileData);
        Object.entries(profileData).forEach(([key, value]) => {
            const input = document.getElementById(key);
            if (input) input.value = value;
        });
        updateProfileCompletion();
    }

    // Resume Upload
    const resumeFile = document.getElementById('resumeFile');
    const parsedOutput = document.getElementById('parsedOutput');
    const uploadBox = document.querySelector('.upload-box');

    // Handle file drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    });

    resumeFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    function handleFileUpload(file) {
        if (!file) return;

        // Show loading state
        parsedOutput.innerHTML = '<p class="loading">Processing your resume...</p>';
        
        // Simulate processing delay
        setTimeout(() => {
            // Save resume data to localStorage
            localStorage.setItem('resumeData', JSON.stringify(sampleResume));
            
            // Display parsed resume
            parsedOutput.innerHTML = formatResumeData(sampleResume);
            
            // Update current resume in profile section
            if (currentResume) {
                currentResume.innerHTML = formatResumeData(sampleResume);
            }
            
            // Generate job matches
            generateJobMatches();
        }, 1500);
    }

    // Sample resume data
    const sampleResume = {
        personalInfo: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "(555) 123-4567",
            location: "San Francisco, CA"
        },
        summary: "Experienced software engineer with 5+ years of experience in full-stack development, specializing in modern web technologies and cloud solutions.",
        skills: [
            "JavaScript/TypeScript",
            "React.js",
            "Node.js",
            "Python",
            "AWS",
            "SQL/NoSQL",
            "Docker",
            "CI/CD"
        ],
        experience: [
            {
                title: "Senior Software Engineer",
                company: "Tech Solutions Inc.",
                period: "2020 - Present",
                highlights: [
                    "Led development of company's flagship product",
                    "Implemented microservices architecture",
                    "Reduced server costs by 40% through optimization"
                ]
            },
            {
                title: "Software Engineer",
                company: "Digital Innovations",
                period: "2018 - 2020",
                highlights: [
                    "Developed and maintained web applications",
                    "Collaborated with cross-functional teams",
                    "Implemented automated testing"
                ]
            }
        ],
        education: {
            degree: "Bachelor of Science in Computer Science",
            university: "University of Technology",
            year: "2018"
        }
    };

    // Sample job data
    const sampleJobs = [
        {
            title: "Senior Full Stack Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$120,000 - $150,000",
            description: "Looking for an experienced full-stack developer to join our growing team. Must have experience with React, Node.js, and cloud technologies.",
            match: "95%"
        },
        {
            title: "Software Engineer",
            company: "InnovateTech",
            location: "Remote",
            type: "Full-time",
            salary: "$100,000 - $130,000",
            description: "Join our team of talented engineers working on cutting-edge web applications. Strong JavaScript and cloud experience required.",
            match: "88%"
        },
        {
            title: "Backend Developer",
            company: "DataSystems",
            location: "New York, NY",
            type: "Full-time",
            salary: "$110,000 - $140,000",
            description: "Seeking a backend developer with experience in Node.js, Python, and database management.",
            match: "85%"
        }
    ];

    // Function to format resume data into HTML
    function formatResumeData(resume) {
        return `
            <div class="resume-section">
                <h3>${resume.personalInfo.name}</h3>
                <p>${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}</p>
            </div>

            <div class="resume-section">
                <h4>Professional Summary</h4>
                <p>${resume.summary}</p>
            </div>

            <div class="resume-section">
                <h4>Skills</h4>
                <ul>
                    ${resume.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>

            <div class="resume-section">
                <h4>Work Experience</h4>
                ${resume.experience.map(job => `
                    <div class="job">
                        <h5>${job.title} at ${job.company}</h5>
                        <p class="period">${job.period}</p>
                        <ul>
                            ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <div class="resume-section">
                <h4>Education</h4>
                <p>${resume.education.degree}</p>
                <p>${resume.education.university}, ${resume.education.year}</p>
            </div>
        `;
    }

    // Function to generate job matches
    function generateJobMatches() {
        const jobGrid = document.getElementById('jobGrid');
        if (!jobGrid) return;

        // Show all job cards that are already in the HTML
        const jobCards = jobGrid.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            card.style.display = 'block';
        });

        // Add event listeners to apply buttons
        document.querySelectorAll('.job-card .btn').forEach(button => {
            button.addEventListener('click', () => {
                alert('Application submitted successfully!');
            });
        });
    }

    // Load saved resume data
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
        const resumeData = JSON.parse(savedResumeData);
        if (currentResume) {
            currentResume.innerHTML = formatResumeData(resumeData);
        }
        generateJobMatches();
    }

    // Handle job search and filtering
    function filterJobs() {
        const searchTerm = jobSearch.value.toLowerCase();
        const location = locationFilter.value;
        const jobType = jobTypeFilter.value;
        const experience = experienceFilter.value;

        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const company = card.querySelector('.company').textContent.toLowerCase();
            const jobLocation = card.getAttribute('data-location');
            const type = card.getAttribute('data-type');
            const level = card.getAttribute('data-level');

            const matchesSearch = title.includes(searchTerm) || company.includes(searchTerm);
            const matchesLocation = !location || jobLocation === location;
            const matchesType = !jobType || type === jobType;
            const matchesExperience = !experience || level === experience;

            if (matchesSearch && matchesLocation && matchesType && matchesExperience) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Handle application status filtering
    function filterApplications() {
        const status = applicationStatusFilter.value;
        const applicationCards = document.querySelectorAll('.application-card');
        
        applicationCards.forEach(card => {
            if (status === 'all' || card.getAttribute('data-status') === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Update resume improvement suggestions
    function updateResumeSuggestions() {
        // Simulated resume analysis
        const suggestions = [
            'Add more quantifiable achievements to your work experience',
            'Include more industry-specific keywords',
            'Add a professional summary at the top',
            'Update your education section with relevant coursework'
        ];

        const keywords = [
            'JavaScript',
            'React',
            'Node.js',
            'MongoDB',
            'AWS',
            'Docker'
        ];

        // Update suggestions list
        if (suggestions.length > 0) {
            suggestionsList.innerHTML = suggestions.map(s => `
                <li>
                    <i class="fas fa-lightbulb"></i>
                    <span>${s}</span>
                </li>
            `).join('');
            noSuggestions.style.display = 'none';
        } else {
            noSuggestions.style.display = 'block';
        }

        // Update missing keywords list
        if (keywords.length > 0) {
            missingKeywords.innerHTML = keywords.map(k => `
                <span class="keyword-tag">
                    ${k}
                    <i class="fas fa-times" onclick="removeKeyword(this)"></i>
                </span>
            `).join('');
            noKeywords.style.display = 'none';
        } else {
            noKeywords.style.display = 'block';
        }

        // Update statistics
        document.getElementById('missingKeywordsCount').textContent = keywords.length;
    }

    // Event Listeners
    jobSearch.addEventListener('input', filterJobs);
    locationFilter.addEventListener('change', filterJobs);
    jobTypeFilter.addEventListener('change', filterJobs);
    experienceFilter.addEventListener('change', filterJobs);
    applicationStatusFilter.addEventListener('change', filterApplications);
    addSkillBtn.addEventListener('click', () => addSkill('technical'));
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);

    // Initialize
    updateResumeSuggestions();
    generateJobMatches();
    loadApplications();

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        alert('You have been logged out successfully!');
        window.location.href = 'login.html';
    });

    // Sample application data (would typically come from an API)
    let applications = [
        {
            id: 1,
            company: "TechCorp",
            position: "Senior Developer",
            status: "interview",
            appliedDate: "2024-03-01",
            interviewDate: "2024-03-15",
            interviewTime: "14:00",
            location: "San Francisco, CA",
            notes: "Technical interview with the team lead"
        },
        {
            id: 2,
            company: "InnovateTech",
            position: "Frontend Developer",
            status: "in-review",
            appliedDate: "2024-02-28",
            location: "Remote"
        },
        {
            id: 3,
            company: "DataSystems",
            position: "Backend Engineer",
            status: "applied",
            appliedDate: "2024-03-05",
            location: "New York, NY"
        }
    ];

    // Update application statistics
    function updateApplicationStats() {
        const totalApplications = applications.length;
        const interviewCount = applications.filter(app => app.status === 'interview').length;
        const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0;
        
        // Calculate average response time (in days)
        const responseTimes = applications
            .filter(app => app.interviewDate)
            .map(app => {
                const applied = new Date(app.appliedDate);
                const interview = new Date(app.interviewDate);
                return Math.round((interview - applied) / (1000 * 60 * 60 * 24));
            });
        
        const avgResponseTime = responseTimes.length > 0 
            ? Math.round(responseTimes.reduce((a, b) => a + b) / responseTimes.length)
            : 0;

        document.getElementById('totalApplications').textContent = totalApplications;
        document.getElementById('interviewRate').textContent = `${interviewRate}%`;
        document.getElementById('responseTime').textContent = `${avgResponseTime} days`;
    }

    // Render application cards
    function renderApplications() {
        applicationsGrid.innerHTML = applications.map(app => `
            <div class="application-card" data-status="${app.status}">
                <h3>${app.position}</h3>
                <p class="company">${app.company}</p>
                <span class="status ${app.status}">${app.status.replace('-', ' ')}</span>
                <p class="dates">Applied: ${formatDate(app.appliedDate)}</p>
                ${app.interviewDate ? `
                    <p class="dates">Interview: ${formatDate(app.interviewDate)}</p>
                ` : ''}
                <div class="actions">
                    <button class="btn btn-secondary" onclick="viewApplication(${app.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-secondary" onclick="editApplication(${app.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render timeline
    function renderTimeline() {
        const timelineItems = applications
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .map(app => `
                <div class="timeline-item">
                    <div class="timeline-date">${formatDate(app.appliedDate)}</div>
                    <div class="timeline-content">
                        <h4>${app.position} at ${app.company}</h4>
                        <p>Status: ${app.status.replace('-', ' ')}</p>
                        ${app.interviewDate ? `
                            <p>Interview scheduled for ${formatDate(app.interviewDate)}</p>
                        ` : ''}
                    </div>
                </div>
            `).join('');

        timelineContainer.innerHTML = timelineItems;
    }

    // Render interview calendar
    function renderCalendar() {
        const upcomingInterviews = applications
            .filter(app => app.status === 'interview' && app.interviewDate)
            .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

        calendarContainer.innerHTML = upcomingInterviews.map(app => `
            <div class="calendar-item">
                <div class="date">${formatDate(app.interviewDate)}</div>
                <div class="time">${app.interviewTime}</div>
                <div class="company">${app.company}</div>
                <div class="position">${app.position}</div>
                ${app.notes ? `<p class="notes">${app.notes}</p>` : ''}
            </div>
        `).join('');
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Filter and sort applications
    function filterAndSortApplications() {
        const status = applicationStatusFilter.value;
        const sortBy = applicationSort.value;
        const searchTerm = applicationSearch.value.toLowerCase();

        let filtered = applications.filter(app => {
            const matchesStatus = status === 'all' || app.status === status;
            const matchesSearch = app.company.toLowerCase().includes(searchTerm) || 
                                app.position.toLowerCase().includes(searchTerm);
            return matchesStatus && matchesSearch;
        });

        // Sort applications
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.appliedDate) - new Date(a.appliedDate);
                case 'oldest':
                    return new Date(a.appliedDate) - new Date(b.appliedDate);
                case 'company':
                    return a.company.localeCompare(b.company);
                case 'position':
                    return a.position.localeCompare(b.position);
                default:
                    return 0;
            }
        });

        applications = filtered;
        renderApplications();
        renderTimeline();
        renderCalendar();
        updateApplicationStats();
    }

    // Event Listeners
    applicationStatusFilter.addEventListener('change', filterAndSortApplications);
    applicationSort.addEventListener('change', filterAndSortApplications);
    applicationSearch.addEventListener('input', filterAndSortApplications);

    // Initialize
    updateApplicationStats();
    renderApplications();
    renderTimeline();
    renderCalendar();

    // Preferences Management
    const preferencesForm = document.getElementById('preferencesForm');
    const addCityBtn = document.getElementById('addCity');
    const preferredCities = document.getElementById('preferredCities');
    const selectedCities = document.getElementById('selectedCities');
    const addSkillToDevelopBtn = document.getElementById('addSkill');
    const skillInput = document.getElementById('skillInput');
    const selectedSkills = document.getElementById('selectedSkills');

    // Store user preferences
    let userPreferences = {
        locations: [],
        jobTypes: [],
        salaryRange: { min: 0, max: 0 },
        industries: [],
        workCulture: [],
        careerGoals: [],
        skillsToDevelop: [],
        benefits: []
    };

    // Handle city addition
    addCityBtn.addEventListener('click', () => {
        const city = preferredCities.value.trim();
        if (city && !userPreferences.locations.includes(city)) {
            userPreferences.locations.push(city);
            updateSelectedCities();
            preferredCities.value = '';
        }
    });

    // Update selected cities display
    function updateSelectedCities() {
        selectedCities.innerHTML = userPreferences.locations.map(city => `
            <div class="city-tag">
                <span>${city}</span>
                <span class="remove" onclick="removeCity('${city}')">×</span>
            </div>
        `).join('');
    }

    // Remove city from preferences
    function removeCity(city) {
        userPreferences.locations = userPreferences.locations.filter(c => c !== city);
        updateSelectedCities();
    }

    // Handle skill addition
    addSkillToDevelopBtn.addEventListener('click', () => {
        const skill = skillInput.value.trim();
        if (skill && !userPreferences.skillsToDevelop.includes(skill)) {
            userPreferences.skillsToDevelop.push(skill);
            updateSelectedSkills();
            skillInput.value = '';
        }
    });

    // Update selected skills display
    function updateSelectedSkills() {
        selectedSkills.innerHTML = userPreferences.skillsToDevelop.map(skill => `
            <div class="skill-tag">
                <span>${skill}</span>
                <span class="remove" onclick="removeSkill('${skill}')">×</span>
            </div>
        `).join('');
    }

    // Remove skill from preferences
    function removeSkill(skill) {
        userPreferences.skillsToDevelop = userPreferences.skillsToDevelop.filter(s => s !== skill);
        updateSelectedSkills();
    }

    // Handle form submission
    preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get salary range
        userPreferences.salaryRange = {
            min: parseInt(document.getElementById('minSalary').value) || 0,
            max: parseInt(document.getElementById('maxSalary').value) || 0
        };

        // Get selected industries
        const industrySelect = document.getElementById('industrySelect');
        userPreferences.industries = Array.from(industrySelect.selectedOptions).map(option => option.value);

        // Get other preferences
        userPreferences.jobTypes = Array.from(document.querySelectorAll('input[name="jobType"]:checked')).map(cb => cb.value);
        userPreferences.workCulture = Array.from(document.querySelectorAll('input[name="culture"]:checked')).map(cb => cb.value);
        userPreferences.careerGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(cb => cb.value);
        userPreferences.benefits = Array.from(document.querySelectorAll('input[name="benefits"]:checked')).map(cb => cb.value);

        // Save preferences to localStorage
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

        // Show success message
        alert('Preferences saved successfully!');
    });

    // Customized Resumes Management
    const resumesGrid = document.getElementById('resumesGrid');
    const totalResumes = document.getElementById('totalResumes');
    const avgMatchScore = document.getElementById('avgMatchScore');
    const analyzeJobBtn = document.getElementById('analyzeJob');
    const generateResumeBtn = document.getElementById('generateResume');

    // Store customized resumes
    let customizedResumes = [];

    // Load saved resumes
    function loadResumes() {
        const savedResumes = localStorage.getItem('customizedResumes');
        if (savedResumes) {
            customizedResumes = JSON.parse(savedResumes);
            updateResumesDisplay();
        }
    }

    // Update resumes display
    function updateResumesDisplay() {
        totalResumes.textContent = customizedResumes.length;
        
        const totalScore = customizedResumes.reduce((sum, resume) => sum + resume.matchScore, 0);
        const averageScore = customizedResumes.length ? Math.round(totalScore / customizedResumes.length) : 0;
        avgMatchScore.textContent = `${averageScore}%`;

        resumesGrid.innerHTML = customizedResumes.map(resume => `
            <div class="resume-card">
                <h3>${resume.jobTitle}</h3>
                <p class="company">${resume.companyName}</p>
                <div class="match-score">${resume.matchScore}% Match</div>
                <div class="actions">
                    <button class="btn btn-primary" onclick="viewResume('${resume.id}')">View</button>
                    <button class="btn btn-secondary" onclick="editResume('${resume.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteResume('${resume.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Analyze job description
    analyzeJobBtn.addEventListener('click', () => {
        const jobTitle = document.getElementById('jobTitle').value;
        const companyName = document.getElementById('companyName').value;
        const jobDescription = document.getElementById('jobDescription').value;

        if (!jobTitle || !companyName || !jobDescription) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate AI analysis
        const suggestions = analyzeJobDescription(jobDescription);
        displaySuggestions(suggestions);
    });

    // Analyze job description (simulated)
    function analyzeJobDescription(description) {
        // This would be replaced with actual AI analysis
        return {
            keywords: [
                { word: 'JavaScript', importance: 'High' },
                { word: 'React', importance: 'High' },
                { word: 'Node.js', importance: 'Medium' }
            ],
            experience: [
                { item: 'Frontend Development', relevance: 'High' },
                { item: 'API Integration', relevance: 'Medium' },
                { item: 'Database Management', relevance: 'Low' }
            ],
            skills: [
                { skill: 'Problem Solving', match: 'High' },
                { skill: 'Team Collaboration', match: 'Medium' },
                { skill: 'Project Management', match: 'Low' }
            ]
        };
    }

    // Display suggestions
    function displaySuggestions(suggestions) {
        document.getElementById('keywordsToAdd').innerHTML = suggestions.keywords.map(k => `
            <div class="keyword-item">
                <span>${k.word}</span>
                <span class="importance">${k.importance}</span>
            </div>
        `).join('');

        document.getElementById('experienceToHighlight').innerHTML = suggestions.experience.map(e => `
            <div class="experience-item">
                <span>${e.item}</span>
                <span class="relevance">${e.relevance}</span>
            </div>
        `).join('');

        document.getElementById('skillsToEmphasize').innerHTML = suggestions.skills.map(s => `
            <div class="skill-item">
                <span>${s.skill}</span>
                <span class="match">${s.match}</span>
            </div>
        `).join('');

        document.getElementById('customizationSuggestions').style.display = 'block';
    }

    // Generate customized resume
    generateResumeBtn.addEventListener('click', () => {
        const jobTitle = document.getElementById('jobTitle').value;
        const companyName = document.getElementById('companyName').value;
        
        // Create new resume
        const newResume = {
            id: Date.now().toString(),
            jobTitle,
            companyName,
            matchScore: Math.floor(Math.random() * 30) + 70, // Simulated match score
            createdAt: new Date().toISOString()
        };

        // Add to list
        customizedResumes.push(newResume);
        localStorage.setItem('customizedResumes', JSON.stringify(customizedResumes));
        
        // Update display
        updateResumesDisplay();
        
        // Reset form
        document.getElementById('jobTitle').value = '';
        document.getElementById('companyName').value = '';
        document.getElementById('jobDescription').value = '';
        document.getElementById('customizationSuggestions').style.display = 'none';
    });

    // View resume
    function viewResume(id) {
        const resume = customizedResumes.find(r => r.id === id);
        if (resume) {
            // Implement resume viewing functionality
            alert(`Viewing resume for ${resume.jobTitle} at ${resume.companyName}`);
        }
    }

    // Edit resume
    function editResume(id) {
        const resume = customizedResumes.find(r => r.id === id);
        if (resume) {
            // Implement resume editing functionality
            alert(`Editing resume for ${resume.jobTitle} at ${resume.companyName}`);
        }
    }

    // Delete resume
    function deleteResume(id) {
        if (confirm('Are you sure you want to delete this resume?')) {
            customizedResumes = customizedResumes.filter(r => r.id !== id);
            localStorage.setItem('customizedResumes', JSON.stringify(customizedResumes));
            updateResumesDisplay();
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        // Load saved preferences
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            userPreferences = JSON.parse(savedPreferences);
            updateSelectedCities();
            updateSelectedSkills();
        }

        // Load resumes
        loadResumes();
    });
}); 