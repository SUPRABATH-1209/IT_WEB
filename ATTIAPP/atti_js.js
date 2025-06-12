// --- DOM Element References ---
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

const currentYearSelect = document.getElementById('currentYearSelect');
const academicYearPrefixSelect = document.getElementById('academicYearPrefixSelect');
const addAcademicYearPrefixBtn = document.getElementById('addAcademicYearPrefixBtn');
const sectionSelect = document.getElementById('sectionSelect');
const facultySelect = document.getElementById('facultySelect');
const editFacultyListBtn = document.getElementById('editFacultyListBtn');
const otherFacultyInputContainer = document.getElementById('otherFacultyInputContainer');
const otherFacultyNameInput = document.getElementById('otherFacultyName');
const studentListDiv = document.getElementById('studentList');
const submitButton = document.getElementById('submitAttendance');
const currentDateDiv = document.getElementById('currentDate');
const currentTimeDiv = document.getElementById('currentTime');
const submissionMessageDiv = document.getElementById('submissionMessage');
const sectionHeading = document.getElementById('sectionHeading');

const attendanceHistoryDisplayBox = document.getElementById('attendanceHistoryDisplayBox');
const downloadAllHistoryBtn = document.getElementById('downloadAllHistoryBtn');

// History Filters
const historyAcademicYearSelect = document.getElementById('historyAcademicYearSelect');
const historyAcademicYearPrefixSelect = document.getElementById('historyAcademicYearPrefixSelect');
const historyYearSelect = document.getElementById('historyYearSelect');
const historyDateSelect = document.getElementById('historyDateSelect');
const historyFilterSection = document.getElementById('historyFilterSection');

// Monthly Summary Elements
const summaryAcademicYearSelect = document.getElementById('summaryAcademicYearSelect');
const summaryAcademicYearPrefixSelect = document.getElementById('summaryAcademicYearPrefixSelect');
const summarySectionSelect = document.getElementById('summarySectionSelect');
const summaryMonthSelect = document.getElementById('summaryMonthSelect');
const summaryYearForMonthSelect = document.getElementById('summaryYearForMonthSelect');
const generateMonthlySummaryBtn = document.getElementById('generateMonthlySummary');
const monthlySummaryMessageDiv = document.getElementById('monthlySummaryMessage');

// Modal Elements
const welcomeModalOverlay = document.getElementById('welcomeModalOverlay');
const closeWelcomeModalBtn = document.getElementById('closeWelcomeModal');
const attendanceContainer = document.getElementById('attendanceContainer');

// Edit Attendance Modal Elements
const editAttendanceModalOverlay = document.getElementById('editAttendanceModalOverlay');
const editRecordDetailsDiv = document.getElementById('editRecordDetails');
const editableStudentListDiv = document.getElementById('editableStudentList');
const saveEditedAttendanceBtn = document.getElementById('saveEditedAttendance');
const cancelEditAttendanceBtn = document.getElementById('cancelEditAttendance');
let editingRecordIndex = -1; // Stores the index of the record currently being edited

// Edit Faculty Modal Elements
const editFacultyModalOverlay = document.getElementById('editFacultyModalOverlay');
const currentFacultyList = document.getElementById('currentFacultyList');
const newFacultyNameInput = document.getElementById('newFacultyNameInput');
const addNewFacultyBtn = document.getElementById('addNewFacultyBtn');
const closeFacultyModal = document.getElementById('closeFacultyModal');

// Add Academic Year Prefix Modal Elements
const addPrefixModalOverlay = document.getElementById('addPrefixModalOverlay');
const currentPrefixList = document.getElementById('currentPrefixList');
const newPrefixInput = document.getElementById('newPrefixInput');
const addNewPrefixBtnModal = document.getElementById('addNewPrefixBtnModal');
const closePrefixModal = document.getElementById('closePrefixModal');

// NEW: Manage Students Tab Elements
const manageAcademicYearSelect = document.getElementById('manageAcademicYearSelect');
const manageAcademicYearPrefixSelect = document.getElementById('manageAcademicYearPrefixSelect');
const manageSectionSelect = document.getElementById('manageSectionSelect');
const managedStudentListDiv = document.getElementById('managedStudentList');
const newStudentRollNoInput = document.getElementById('newStudentRollNoInput');
const addStudentBtn = document.getElementById('addStudentBtn');
const manageSectionHeading = document.getElementById('manageSectionHeading');
const studentManagementMessageDiv = document.getElementById('studentManagementMessage');

// NEW: Edit Student Modal Elements
const editStudentModalOverlay = document.getElementById('editStudentModalOverlay');
const currentRollNumberForEdit = document.getElementById('currentRollNumberForEdit');
const editedRollNumberInput = document.getElementById('editedRollNumberInput');
const saveEditedStudentBtn = document.getElementById('saveEditedStudentBtn');
const cancelEditStudentBtn = document.getElementById('cancelEditStudentBtn');
const editStudentMessageDiv = document.getElementById('editStudentMessage');

let currentStudentBeingEdited = {
    academicYear: '',
    prefix: '',
    section: '',
    oldRollNumber: ''
};


// --- LOCAL STORAGE KEYS ---
const ATTENDANCE_STORAGE_KEY = 'collegeAttendanceRecords';
const FACULTY_STORAGE_KEY = 'collegeFacultyList';
const PREFIX_STORAGE_KEY = 'collegeAcademicPrefixes';
const CUSTOM_STUDENT_LISTS_KEY = 'collegeCustomStudentLists'; // NEW KEY

// --- Data Arrays ---
let storedAttendanceRecords = [];
let storedFacultyList = ["DR.J.RAJENDRA PRASAD", "DR.M. VENKATESWARA RAO", "DR.M.CHAITANYA KISHORE REDDY", "MR.N.NARASIMHA RAO", "MR.A.RAVIKIRAN", "MR.CH.KIRAN BABU", "MR.KRISHNA SAI UJWAL", "MRS.CH.BINDUSRI", "MR.M.TEJASWINI", "MRS.OM SRI"]; // Default faculty
let storedAcademicPrefixes = ["22KN1A", "23KN1A", "24KN1A", "25KN1A"]; // Added 25KN1A as a default
// NEW: Structure to store custom student lists by Academic Year -> Prefix -> Section
let customStudentLists = {};


// --- LOCAL STORAGE FUNCTIONS ---
function saveAttendanceToLocalStorage(data) {
    storedAttendanceRecords.push(data);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(storedAttendanceRecords));
    populateHistoryFilters(); // Update filter options
    populateSummaryYears();    // Update summary year options
    displayFilteredHistory();  // Refresh history display
}

function loadAttendanceFromLocalStorage() {
    const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (storedData) {
        storedAttendanceRecords = JSON.parse(storedData);
    }
    populateHistoryFilters();
    populateSummaryYears();
}

function saveFacultyListToLocalStorage() {
    localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(storedFacultyList));
    populateFacultySelect(); // Refresh faculty dropdown
}

function loadFacultyListFromLocalStorage() {
    const storedData = localStorage.getItem(FACULTY_STORAGE_KEY);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
             storedFacultyList = parsedData;
        } else {
            localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(storedFacultyList));
        }
    } else {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(storedFacultyList));
    }
    populateFacultySelect();
}

function saveAcademicPrefixesToLocalStorage() {
    localStorage.setItem(PREFIX_STORAGE_KEY, JSON.stringify(storedAcademicPrefixes));
    populateAcademicPrefixSelect(); // Refresh prefix dropdown
    populateHistoryPrefixFilter(); // Refresh history prefix filter
    populateSummaryPrefixFilter(); // Refresh summary prefix filter
    populateManageStudentsPrefixSelect(); // Refresh manage students prefix filter
}

function loadAcademicPrefixesFromLocalStorage() {
    const storedData = localStorage.getItem(PREFIX_STORAGE_KEY);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            storedAcademicPrefixes = parsedData;
        } else {
            localStorage.setItem(PREFIX_STORAGE_KEY, JSON.stringify(storedAcademicPrefixes));
        }
    } else {
        localStorage.setItem(PREFIX_STORAGE_KEY, JSON.stringify(storedAcademicPrefixes));
    }
    populateAcademicPrefixSelect();
    populateHistoryPrefixFilter();
    populateSummaryPrefixFilter();
    populateManageStudentsPrefixSelect(); // Also populate for manage students tab
}

// NEW: Save and Load Custom Student Lists
function saveCustomStudentLists() {
    localStorage.setItem(CUSTOM_STUDENT_LISTS_KEY, JSON.stringify(customStudentLists));
}

function loadCustomStudentLists() {
    const storedData = localStorage.getItem(CUSTOM_STUDENT_LISTS_KEY);
    if (storedData) {
        customStudentLists = JSON.parse(storedData);
    }
}


// --- HELPER FUNCTIONS ---
// Helper to convert DD-MM-YYYY to YYYY-MM-DD for date input comparison
function convertDateToYYYYMMDD(ddmmyyyy) {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
}
// Helper to convert YYYY-MM-DD to DD-MM-YYYY for display or internal use
function convertDateToDDMMYYYY(yyyymmdd) {
    if (!yyyymmdd) return '';
    const parts = yyyymmdd.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
}

// --- DATE & TIME FUNCTIONS ---
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // Only HH:MM
}

function updateDateTimeDisplay() {
    currentDateDiv.textContent = getCurrentDate();
    currentTimeDiv.textContent = getCurrentTime();
}

// --- MESSAGE DISPLAY FUNCTION ---
function showMessage(message, type, targetDiv = submissionMessageDiv) {
    targetDiv.textContent = message;
    targetDiv.className = 'message'; // Reset classes
    targetDiv.classList.add(type);
    targetDiv.style.display = 'block';
    setTimeout(() => {
        targetDiv.style.display = 'none';
    }, 3000);
}

// --- POPULATE DROPDOWNS ---
function populateFacultySelect() {
    facultySelect.innerHTML = '<option value="">-- SELECT FACULTY --</option>';
    storedFacultyList.sort().forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty;
        option.textContent = faculty;
        facultySelect.appendChild(option);
    });
    const otherOption = document.createElement('option');
    otherOption.value = "Other";
    otherOption.textContent = "OTHER";
    facultySelect.appendChild(otherOption);
}

function populateAcademicPrefixSelect() {
    academicYearPrefixSelect.innerHTML = ''; // Clear existing options
    storedAcademicPrefixes.sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        academicYearPrefixSelect.appendChild(option);
    });
     if (academicYearPrefixSelect.value === "" && storedAcademicPrefixes.length > 0) { // Select first if nothing is selected
        academicYearPrefixSelect.value = storedAcademicPrefixes[0];
    }
}

function populateHistoryPrefixFilter() {
     historyAcademicYearPrefixSelect.innerHTML = '<option value="All">ALL PREFIXES</option>';
     storedAcademicPrefixes.sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        historyAcademicYearPrefixSelect.appendChild(option);
    });
}

function populateSummaryPrefixFilter() {
    summaryAcademicYearPrefixSelect.innerHTML = '<option value="All">ALL PREFIXES</option>';
     storedAcademicPrefixes.sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        summaryAcademicYearPrefixSelect.appendChild(option);
    });
}

// NEW: Populate prefixes for the Manage Students tab
function populateManageStudentsPrefixSelect() {
    manageAcademicYearPrefixSelect.innerHTML = ''; // Clear existing options
    storedAcademicPrefixes.sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        manageAcademicYearPrefixSelect.appendChild(option);
    });
     if (manageAcademicYearPrefixSelect.value === "" && storedAcademicPrefixes.length > 0) { // Select first if nothing is selected
        manageAcademicYearPrefixSelect.value = storedAcademicPrefixes[0];
    }
}

// --- STUDENT LIST MANAGEMENT (NEW CORE LOGIC) ---

/**
 * Generates initial default roll numbers for a section if no custom list exists.
 * This function is ONLY used to seed the customStudentLists.
 */
function generateDefaultRollNumbers(sectionType, academicPrefix) {
    const rollNumbers = [];
    const branchIdentifier = '12';

    // Base cases for IT-A
    if (sectionType === 'itA') {
        for (let i = 1; i <= 65; i++) {
            const suffix = String(i).padStart(2, '0');
            rollNumbers.push(`${academicPrefix}${branchIdentifier}${suffix}`);
        }
        for (let i = 1; i <= 6; i++) {
            rollNumbers.push(`L${i}`); // Lateral entry students
        }
    }
    // Base cases for IT-B
    else if (sectionType === 'itB') {
        rollNumbers.push(`${academicPrefix}${branchIdentifier}66`); // Explicitly add 1266

        for (let i = 67; i <= 99; i++) {
            rollNumbers.push(`${academicPrefix}${branchIdentifier}${i}`);
        }

        const alphabeticSuffixes = [];
        // Default IT-B alpha suffixes up to D1
        let maxAlpha = 'D';
        if (academicPrefix === '23KN1A') { // Special case for 3rd year IT-B (up to D3)
            maxAlpha = 'D'; // User said D3 for 23KN1A IT-B. Assuming it means actual last student is D3, not the range D0-D3.
                            // The code will generate D0, D1, D2, D3.
        }

        for (let charCode = 'A'.charCodeAt(0); charCode <= maxAlpha.charCodeAt(0); charCode++) {
            const char = String.fromCharCode(charCode);
            for (let i = 0; i <= 9; i++) {
                // Adjust for specific ranges if needed, e.g., if D only has D0, D1, D2, D3
                if (char === 'D' && i > 3 && academicPrefix === '23KN1A') break; // Up to D3 for 23KN1A IT-B
                if (char === 'D' && i > 1 && academicPrefix !== '23KN1A') break; // Up to D1 for others
                alphabeticSuffixes.push(`${char}${i}`);
            }
        }
        alphabeticSuffixes.forEach(suffix => {
            rollNumbers.push(`${academicPrefix}${branchIdentifier}${suffix}`);
        });

        for (let i = 7; i <= 14; i++) {
            rollNumbers.push(`L${i}`); // Lateral entry students
        }
    }
    return rollNumbers.sort(); // Always return sorted
}


/**
 * Retrieves the student list for a given Academic Year, Prefix, and Section.
 * If no custom list exists, it generates a default one and saves it.
 */
function getStudentsForSection(academicYear, prefix, section) {
    if (!customStudentLists[academicYear]) {
        customStudentLists[academicYear] = {};
    }
    if (!customStudentLists[academicYear][prefix]) {
        customStudentLists[academicYear][prefix] = {};
    }

    if (!customStudentLists[academicYear][prefix][section]) {
        // If no custom list exists, generate default and save it
        customStudentLists[academicYear][prefix][section] = generateDefaultRollNumbers(section, prefix);
        saveCustomStudentLists(); // Save the newly generated default list
    }

    return customStudentLists[academicYear][prefix][section];
}

/**
 * Checks if a roll number exists across IT-A or IT-B for a given academic year and prefix.
 * This is crucial for uniqueness enforcement.
 */
function isRollNumberDuplicateInYearPrefix(academicYear, prefix, rollNumberToCheck, excludingSection = null) {
    const normalizedRollNumber = rollNumberToCheck.toUpperCase();

    // Check IT-A
    const itAStudents = getStudentsForSection(academicYear, prefix, 'itA');
    if (excludingSection !== 'itA' && itAStudents.includes(normalizedRollNumber)) {
        return true;
    }

    // Check IT-B
    const itBStudents = getStudentsForSection(academicYear, prefix, 'itB');
    if (excludingSection !== 'itB' && itBStudents.includes(normalizedRollNumber)) {
        return true;
    }

    return false;
}


/**
 * Adds a new student roll number to the specified section.
 * Includes uniqueness check.
 */
function addStudent(academicYear, prefix, section, newRollNumber) {
    const normalizedRollNumber = newRollNumber.toUpperCase().trim();

    if (!normalizedRollNumber) {
        showMessage('ROLL NUMBER CANNOT BE EMPTY.', 'error', studentManagementMessageDiv);
        return false;
    }

    if (isRollNumberDuplicateInYearPrefix(academicYear, prefix, normalizedRollNumber)) {
        showMessage(`ROLL NUMBER "${normalizedRollNumber}" ALREADY EXISTS IN IT-A OR IT-B FOR THIS ACADEMIC YEAR AND PREFIX.`, 'error', studentManagementMessageDiv);
        return false;
    }

    const studentList = getStudentsForSection(academicYear, prefix, section); // Ensures the list exists
    if (studentList.includes(normalizedRollNumber)) {
         showMessage(`ROLL NUMBER "${normalizedRollNumber}" ALREADY EXISTS IN THE SELECTED SECTION.`, 'error', studentManagementMessageDiv);
         return false;
    }

    studentList.push(normalizedRollNumber);
    studentList.sort(); // Keep the list sorted
    saveCustomStudentLists();
    return true;
}

/**
 * Edits an existing student roll number in the specified section.
 * Includes uniqueness check for the new roll number.
 */
function editStudent(academicYear, prefix, section, oldRollNumber, newRollNumber) {
    const normalizedNewRollNumber = newRollNumber.toUpperCase().trim();
    const normalizedOldRollNumber = oldRollNumber.toUpperCase().trim();

    if (!normalizedNewRollNumber) {
        showMessage('NEW ROLL NUMBER CANNOT BE EMPTY.', 'error', editStudentMessageDiv);
        return false;
    }

    if (normalizedOldRollNumber === normalizedNewRollNumber) {
        showMessage('NO CHANGE DETECTED. PLEASE ENTER A DIFFERENT ROLL NUMBER.', 'error', editStudentMessageDiv);
        return false;
    }

    // Check for duplicate in *other* sections for the same year/prefix, or in the *same* section if it's not the original entry
    if (isRollNumberDuplicateInYearPrefix(academicYear, prefix, normalizedNewRollNumber, section)) {
        showMessage(`NEW ROLL NUMBER "${normalizedNewRollNumber}" ALREADY EXISTS IN ANOTHER SECTION (IT-A/IT-B) FOR THIS ACADEMIC YEAR AND PREFIX.`, 'error', editStudentMessageDiv);
        return false;
    }

    const studentList = getStudentsForSection(academicYear, prefix, section);
    const index = studentList.indexOf(normalizedOldRollNumber);

    if (index === -1) {
        showMessage('OLD ROLL NUMBER NOT FOUND IN THE SELECTED SECTION. THIS SHOULD NOT HAPPEN.', 'error', editStudentMessageDiv);
        return false;
    }

    // Check if the new roll number already exists within *this specific section* (excluding the old one's position)
    const tempStudentList = [...studentList];
    tempStudentList.splice(index, 1); // Remove old one temporarily for internal section check
    if (tempStudentList.includes(normalizedNewRollNumber)) {
        showMessage(`NEW ROLL NUMBER "${normalizedNewRollNumber}" ALREADY EXISTS IN THIS SECTION.`, 'error', editStudentMessageDiv);
        return false;
    }


    studentList[index] = normalizedNewRollNumber;
    studentList.sort(); // Re-sort after edit
    saveCustomStudentLists();

    // IMPORTANT: Update existing attendance records if this student was marked
    updateAttendanceRecordsAfterRollNumberChange(academicYear, prefix, normalizedOldRollNumber, normalizedNewRollNumber);
    return true;
}

/**
 * Deletes a student roll number from the specified section.
 */
function deleteStudent(academicYear, prefix, section, rollNumberToDelete) {
    const normalizedRollNumber = rollNumberToDelete.toUpperCase().trim();
    const studentList = getStudentsForSection(academicYear, prefix, section);
    const initialLength = studentList.length;

    customStudentLists[academicYear][prefix][section] = studentList.filter(rn => rn !== normalizedRollNumber);
    saveCustomStudentLists();

    if (customStudentLists[academicYear][prefix][section].length < initialLength) {
        // Remove student from existing attendance records
        removeStudentFromAttendanceRecords(academicYear, prefix, normalizedRollNumber);
        return true;
    }
    return false;
}

// --- Functions to update Attendance History after Student Management ---
function updateAttendanceRecordsAfterRollNumberChange(academicYear, prefix, oldRollNumber, newRollNumber) {
    let changedCount = 0;
    storedAttendanceRecords.forEach(record => {
        // Only update records for the relevant academic year and prefix
        // We're simplifying this, as roll numbers are usually unique *within* a year/prefix
        // If a faculty changes a student's roll number, it should affect *all* past records for that student.
        // This is a rough match. A more robust system would need a unique student ID.
        const recordPrefix = record.academic_year_prefix || (record.student_status && Object.keys(record.student_status).length > 0 ? Object.keys(record.student_status)[0].substring(0,6) : 'N/A');

        if (record.academic_year === academicYear && recordPrefix === prefix) {
            if (record.student_status && record.student_status[oldRollNumber]) {
                const status = record.student_status[oldRollNumber];
                delete record.student_status[oldRollNumber];
                record.student_status[newRollNumber] = status;
                changedCount++;
            }
        }
    });

    if (changedCount > 0) {
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(storedAttendanceRecords));
        console.log(`Updated ${changedCount} attendance records for roll number change: ${oldRollNumber} -> ${newRollNumber}`);
    }
}

function removeStudentFromAttendanceRecords(academicYear, prefix, rollNumberToRemove) {
    let removedCount = 0;
    storedAttendanceRecords.forEach(record => {
        const recordPrefix = record.academic_year_prefix || (record.student_status && Object.keys(record.student_status).length > 0 ? Object.keys(record.student_status)[0].substring(0,6) : 'N/A');

        if (record.academic_year === academicYear && recordPrefix === prefix) {
            if (record.student_status && record.student_status[rollNumberToRemove]) {
                delete record.student_status[rollNumberToRemove];
                removedCount++;
            }
        }
    });

    if (removedCount > 0) {
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(storedAttendanceRecords));
        console.log(`Removed roll number ${rollNumberToRemove} from ${removedCount} attendance records.`);
    }
}


// --- Display Roll Numbers for Mark Attendance Tab ---
function displayRollNumbersForSection() {
    studentListDiv.innerHTML = ''; // Clear previous entries
    const selectedAcademicYear = currentYearSelect.value;
    const selectedAcademicPrefix = academicYearPrefixSelect.value;
    const selectedSectionValue = sectionSelect.value; // 'itA' or 'itB'
    const selectedSectionDisplay = selectedSectionValue === 'itA' ? 'IT-A' : 'IT-B';

    if (!selectedAcademicPrefix) {
        sectionHeading.textContent = "PLEASE SELECT AN ACADEMIC YEAR PREFIX";
        return;
    }
    if (!selectedAcademicYear) {
         sectionHeading.textContent = "PLEASE SELECT AN ACADEMIC YEAR";
         return;
    }

    const rollNumbers = getStudentsForSection(selectedAcademicYear, selectedAcademicPrefix, selectedSectionValue);

    if (rollNumbers.length === 0) {
        sectionHeading.textContent = `${selectedAcademicYear} - ${selectedSectionDisplay} (NO STUDENTS FOUND. ADD STUDENTS IN "MANAGE STUDENTS" TAB.)`;
        return;
    }

    sectionHeading.textContent = `${selectedAcademicYear} - ${selectedSectionDisplay}`;

    rollNumbers.forEach(fullRollNum => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');

        const rollNumberSpan = document.createElement('span');
        rollNumberSpan.classList.add('roll-number');
        rollNumberSpan.textContent = fullRollNum;

        const attendanceButtonsDiv = document.createElement('div');
        attendanceButtonsDiv.classList.add('attendance-buttons');

        const presentButton = document.createElement('button');
        presentButton.classList.add('present-btn', 'active'); // Default to present
        presentButton.textContent = 'PRESENT';
        presentButton.dataset.fullRollNumber = fullRollNum;
        presentButton.dataset.status = 'PRESENT';

        const absentButton = document.createElement('button');
        absentButton.classList.add('absent-btn');
        absentButton.textContent = 'ABSENT';
        absentButton.dataset.fullRollNumber = fullRollNum;
        absentButton.dataset.status = 'ABSENT';

        presentButton.addEventListener('click', () => {
            presentButton.classList.add('active');
            absentButton.classList.remove('active');
        });

        absentButton.addEventListener('click', () => {
            absentButton.classList.add('active');
            presentButton.classList.remove('active');
        });

        attendanceButtonsDiv.appendChild(presentButton);
        attendanceButtonsDiv.appendChild(absentButton);

        studentItem.appendChild(rollNumberSpan);
        studentItem.appendChild(attendanceButtonsDiv);
        studentListDiv.appendChild(studentItem);
    });
}


// --- HISTORY FILTER POPULATION ---
function populateHistoryFilters() {
    const uniqueYears = new Set(); // Calendar years
    const uniqueAcademicYears = new Set(); // Should always be static, but good practice
    const uniquePrefixes = new Set();
    const uniqueSections = new Set();

    storedAttendanceRecords.forEach(record => {
        const year = record.date.substring(6, 10);
        uniqueYears.add(year);
        uniqueAcademicYears.add(record.academic_year || 'N/A');
        // Extract prefix from a roll number (assuming at least one student exists)
        if (record.academic_year_prefix) {
            uniquePrefixes.add(record.academic_year_prefix);
        } else if (record.student_status && Object.keys(record.student_status).length > 0) {
            const firstRollNum = Object.keys(record.student_status)[0];
            if (firstRollNum.length >= 6 && firstRollNum.includes('KN1A')) {
                uniquePrefixes.add(firstRollNum.substring(0, 6));
            }
        }
        uniqueSections.add(record.section);
    });

    // Populate Calendar Year filter
    historyYearSelect.innerHTML = '<option value="All">ALL YEARS</option>';
    Array.from(uniqueYears).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        historyYearSelect.appendChild(option);
    });

    // Populate History Prefix filter
    historyAcademicYearPrefixSelect.innerHTML = '<option value="All">ALL PREFIXES</option>';
    Array.from(uniquePrefixes).sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        historyAcademicYearPrefixSelect.appendChild(option);
    });

    historyDateSelect.value = ''; // Clear date input by default
}

// New function to populate the year filters in monthly summary section (Calendar Year)
function populateSummaryYears() {
    const uniqueYears = new Set();
    const uniquePrefixes = new Set();

    storedAttendanceRecords.forEach(record => {
        const year = record.date.substring(6, 10); // Extract YYYY
        uniqueYears.add(year);
        if (record.academic_year_prefix) {
            uniquePrefixes.add(record.academic_year_prefix);
        } else if (record.student_status && Object.keys(record.student_status).length > 0) {
            const firstRollNum = Object.keys(record.student_status)[0];
            if (firstRollNum.length >= 6 && firstRollNum.includes('KN1A')) {
                uniquePrefixes.add(firstRollNum.substring(0, 6));
            }
        }
    });

    summaryYearForMonthSelect.innerHTML = '<option value="">-- SELECT YEAR --</option>';
    Array.from(uniqueYears).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        summaryYearForMonthSelect.appendChild(option);
    });

    // Populate Summary Prefix filter
    summaryAcademicYearPrefixSelect.innerHTML = '<option value="All">ALL PREFIXES</option>';
    Array.from(uniquePrefixes).sort().forEach(prefix => {
        const option = document.createElement('option');
        option.value = prefix;
        option.textContent = prefix;
        summaryAcademicYearPrefixSelect.appendChild(option);
    });
}


// Modified display function for history based on filters
function displayFilteredHistory() {
    attendanceHistoryDisplayBox.innerHTML = ''; // Clear previous content

    const filterAcademicYear = historyAcademicYearSelect.value;
    const filterAcademicYearPrefix = historyAcademicYearPrefixSelect.value;
    const filterCalendarYear = historyYearSelect.value;
    const filterDateDDMMYYYY = convertDateToDDMMYYYY(historyDateSelect.value); // Convert date input to DD-MM-YYYY
    const filterSection = historyFilterSection.value;

    let filteredRecords = storedAttendanceRecords;

    // Apply Academic Year filter
    if (filterAcademicYear !== 'All') {
        filteredRecords = filteredRecords.filter(record => record.academic_year === filterAcademicYear);
    }
    // Apply Academic Year Prefix filter
    if (filterAcademicYearPrefix !== 'All') {
        filteredRecords = filteredRecords.filter(record => {
            const recordPrefix = record.academic_year_prefix || (record.student_status && Object.keys(record.student_status).length > 0 ? Object.keys(record.student_status)[0].substring(0,6) : 'N/A');
            return recordPrefix === filterAcademicYearPrefix;
        });
    }
    // Apply Calendar Year filter
    if (filterCalendarYear !== 'All') {
        filteredRecords = filteredRecords.filter(record => record.date.substring(6, 10) === filterCalendarYear);
    }
    // Apply Date filter
    if (filterDateDDMMYYYY) {
        filteredRecords = filteredRecords.filter(record => record.date === filterDateDDMMYYYY);
    }
    // Apply Section filter
    if (filterSection !== 'All') {
        filteredRecords = filteredRecords.filter(record => record.section === filterSection);
    }

    if (filteredRecords.length === 0) {
        attendanceHistoryDisplayBox.innerHTML = '<p>NO ATTENDANCE RECORDS FOUND MATCHING THE SELECTED FILTERS.</p>';
        return;
    }

    // Display in reverse chronological order (most recent first)
    filteredRecords.slice().reverse().forEach((record, originalIndex) => {
        // Find the original index of this record in storedAttendanceRecords
        const globalRecordIndex = storedAttendanceRecords.findIndex(r =>
            r.academic_year === record.academic_year &&
            r.section === record.section &&
            r.date === record.date &&
            r.time === record.time &&
            r.faculty_name === record.faculty_name
        );

        const entryDiv = document.createElement('div');
        entryDiv.classList.add('history-entry');

        let studentDetails = '';
        for (const rollNum in record.student_status) {
            studentDetails += `${rollNum}: ${record.student_status[rollNum]}\n`;
        }

        entryDiv.innerHTML = `
            <strong>ACADEMIC YEAR:</strong> ${record.academic_year || 'N/A'}<br>
            <strong>SECTION:</strong> ${record.section}<br>
            <strong>DATE:</strong> ${record.date}<br>
            <strong>TIME:</strong> ${record.time}<br>
            <strong>FACULTY:</strong> ${record.faculty_name || 'N/A'}<br>
            <strong>STUDENT STATUS:</strong><pre>${studentDetails}</pre>
            <div class="history-actions">
                <button class="edit-single-btn" data-record-index="${globalRecordIndex}">EDIT</button>
                <button class="delete-single-btn" data-record-index="${globalRecordIndex}">DELETE</button>
                <button class="download-single-btn" data-record-index="${globalRecordIndex}">DOWNLOAD THIS RECORD</button>
            </div>
        `;
        attendanceHistoryDisplayBox.appendChild(entryDiv);
    });

    // Add event listeners to the new download, edit, and delete buttons
    document.querySelectorAll('.download-single-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.recordIndex;
            downloadSingleAttendanceRecord(storedAttendanceRecords[index]);
        });
    });
    document.querySelectorAll('.edit-single-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.recordIndex;
            openEditModal(parseInt(index)); // Ensure index is a number
        });
    });
    document.querySelectorAll('.delete-single-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.recordIndex;
            deleteAttendanceRecord(parseInt(index)); // Ensure index is a number
        });
    });
}


// --- Monthly Summary Logic ---
generateMonthlySummaryBtn.addEventListener('click', () => {
    const academicYearFilter = summaryAcademicYearSelect.value;
    const academicYearPrefixFilter = summaryAcademicYearPrefixSelect.value;
    const sectionFilter = summarySectionSelect.value;
    const monthFilter = summaryMonthSelect.value;
    const yearFilter = summaryYearForMonthSelect.value; // Calendar year

    if (!monthFilter || !yearFilter) {
        showMessage('PLEASE SELECT BOTH MONTH AND CALENDAR YEAR FOR SUMMARY.', 'error', monthlySummaryMessageDiv);
        return;
    }

    const studentSummary = {}; // { 'ROLLNUM': { present: 0, absent: 0 } }

    storedAttendanceRecords.forEach(record => {
        const recordDate = record.date; // DD-MM-YYYY
        const recordMonth = recordDate.substring(3, 5); // Extract MM
        const recordYear = recordDate.substring(6, 10); // Extract YYYY
        const recordAcademicYear = record.academic_year || 'N/A';
        const recordSection = record.section;

        let recordAcademicPrefix = record.academic_year_prefix || '';
        if (!recordAcademicPrefix && record.student_status && Object.keys(record.student_status).length > 0) {
            const firstRollNum = Object.keys(record.student_status)[0];
            if (firstRollNum.length >= 6 && firstRollNum.includes('KN1A')) {
                recordAcademicPrefix = firstRollNum.substring(0, 6);
            }
        }

        // Apply all filters
        const passesFilters = (
            (academicYearFilter === 'All' || recordAcademicYear === academicYearFilter) &&
            (academicYearPrefixFilter === 'All' || recordAcademicPrefix === academicYearPrefixFilter) &&
            (sectionFilter === 'All' || recordSection === sectionFilter) &&
            (recordMonth === monthFilter && recordYear === yearFilter)
        );

        if (passesFilters) {
            for (const rollNum in record.student_status) {
                if (academicYearPrefixFilter === 'All' || rollNum.startsWith(academicYearPrefixFilter)) {
                    if (!studentSummary[rollNum]) {
                        studentSummary[rollNum] = { present: 0, absent: 0 };
                    }
                    if (record.student_status[rollNum] === 'PRESENT') {
                        studentSummary[rollNum].present++;
                    } else {
                        studentSummary[rollNum].absent++;
                    }
                }
            }
        }
    });

    if (Object.keys(studentSummary).length === 0) {
        showMessage(`NO ATTENDANCE DATA FOUND FOR THE SELECTED CRITERIA FOR ${summaryMonthSelect.options[summaryMonthSelect.selectedIndex].text} ${yearFilter}.`, 'error', monthlySummaryMessageDiv);
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `ROLL_NUMBER,TOTAL_PRESENT,TOTAL_ABSENT\n`;

    // Sort roll numbers for consistent output
    Object.keys(studentSummary).sort().forEach(rollNum => {
        const summary = studentSummary[rollNum];
        csvContent += `${escapeCsv(rollNum)},${escapeCsv(summary.present)},${escapeCsv(summary.absent)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `monthly_summary_${monthFilter}_${yearFilter}_${academicYearFilter.replace(/\s/g,'')}_${academicYearPrefixFilter}_${sectionFilter}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('MONTHLY SUMMARY DOWNLOADED!', 'success', monthlySummaryMessageDiv);
});

// --- Helper function for CSV escaping ---
const escapeCsv = (text) => {
    if (text === null || text === undefined) return '';
    text = String(text);
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
};

// --- Download Single Attendance Record (with single header) ---
function downloadSingleAttendanceRecord(record) {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += `ACADEMIC YEAR,${escapeCsv(record.academic_year || 'N/A')}\n`;
    csvContent += `SECTION,${escapeCsv(record.section)}\n`;
    csvContent += `DATE,${escapeCsv(record.date)}\n`;
    csvContent += `TIME,${escapeCsv(record.time)}\n`;
    csvContent += `FACULTY,${escapeCsv(record.faculty_name)}\n`;
    csvContent += "\n"; // Empty line for separation

    csvContent += "ROLL_NUMBER,STATUS\n";

    for (const rollNum in record.student_status) {
        const rollNumber = escapeCsv(rollNum);
        const status = escapeCsv(record.student_status[rollNum]);
        csvContent += `${rollNumber},${status}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `attendance_${record.date}_${record.time.replace(/:/g, '-')}_${record.section.replace(/\s/g, '')}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('SELECTED RECORD DOWNLOADED!', 'success');
}

// --- Event Listeners for Tabs ---
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabContents.forEach(content => {
            if (content.id === `${tab}Container`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Specific actions when a tab is opened
        if (tab === 'history') {
            displayFilteredHistory();
        } else if (tab === 'summary') {
            populateSummaryYears();
        } else if (tab === 'students') { // NEW: When Manage Students tab is opened
            populateManageStudentsPrefixSelect(); // Ensure prefixes are populated
            displayManagedStudentList(); // Display students for the currently selected filters
        }
    });
});

// --- Mark Attendance Tab Listeners ---
currentYearSelect.addEventListener('change', displayRollNumbersForSection);
academicYearPrefixSelect.addEventListener('change', displayRollNumbersForSection);
sectionSelect.addEventListener('change', displayRollNumbersForSection);

// History filter change listeners
historyAcademicYearSelect.addEventListener('change', displayFilteredHistory);
historyAcademicYearPrefixSelect.addEventListener('change', displayFilteredHistory);
historyYearSelect.addEventListener('change', displayFilteredHistory);
historyDateSelect.addEventListener('change', displayFilteredHistory);
historyFilterSection.addEventListener('change', displayFilteredHistory);

// Toggle "Other Faculty Name" input
facultySelect.addEventListener('change', () => {
    if (facultySelect.value === 'Other') {
        otherFacultyInputContainer.style.display = 'flex';
        otherFacultyNameInput.focus();
    } else {
        otherFacultyInputContainer.style.display = 'none';
        otherFacultyNameInput.value = '';
    }
});

submitButton.addEventListener('click', async () => {
    const selectedSectionValue = sectionSelect.value;
    const selectedSectionDisplay = selectedSectionValue === 'itA' ? 'IT-A' : 'IT-B';
    const selectedAcademicYear = currentYearSelect.value;
    const selectedAcademicYearPrefix = academicYearPrefixSelect.value;
    let selectedFaculty = facultySelect.value;
    const attendanceDate = getCurrentDate();
    const attendanceTime = getCurrentTime();
    const studentStatus = {};

    // Determine faculty name based on selection
    if (selectedFaculty === 'Other') {
        selectedFaculty = otherFacultyNameInput.value.trim();
        if (!selectedFaculty) {
            showMessage('PLEASE ENTER FACULTY NAME IN THE "OTHER" FIELD.', 'error');
            return;
        }
    } else if (!selectedFaculty) {
        showMessage('PLEASE SELECT A FACULTY.', 'error');
        return;
    }

    if (!selectedAcademicYearPrefix) {
        showMessage('PLEASE SELECT AN ACADEMIC YEAR PREFIX.', 'error');
        return;
    }
    if (!selectedAcademicYear) {
         showMessage('PLEASE SELECT AN ACADEMIC YEAR.', 'error');
         return;
    }


    // --- ONE ATTENDANCE PER DAY RESTRICTION ---
    const existingRecord = storedAttendanceRecords.find(record =>
        record.date === attendanceDate &&
        record.section === selectedSectionDisplay &&
        record.academic_year === selectedAcademicYear &&
        record.academic_year_prefix === selectedAcademicYearPrefix // Ensure explicit prefix match
    );

    if (existingRecord) {
        showMessage('ATTENDANCE HAS ALREADY BEEN SUBMITTED FOR THIS ACADEMIC YEAR, PREFIX, SECTION, AND DATE. PLEASE EDIT THE EXISTING RECORD IN HISTORY.', 'error');
        return;
    }

    const studentItems = studentListDiv.querySelectorAll('.student-item');
    if (studentItems.length === 0) {
         showMessage('NO STUDENTS TO MARK ATTENDANCE FOR. PLEASE CHECK SELECTION OR ADD STUDENTS IN "MANAGE STUDENTS" TAB.', 'error');
         return;
    }

    studentItems.forEach(item => {
        const fullRollNum = item.querySelector('.present-btn').dataset.fullRollNumber;
        const presentBtn = item.querySelector('.present-btn');

        if (presentBtn.classList.contains('active')) {
            studentStatus[fullRollNum] = 'PRESENT';
        } else {
            studentStatus[fullRollNum] = 'ABSENT';
        }
    });

    const attendanceData = {
        academic_year: selectedAcademicYear,
        academic_year_prefix: selectedAcademicYearPrefix,
        section: selectedSectionDisplay,
        date: attendanceDate,
        time: attendanceTime,
        faculty_name: selectedFaculty,
        student_status: studentStatus
    };

    console.log("ATTEMPTING TO SUBMIT ATTENDANCE DATA:", attendanceData);

    // 1. Save to local storage
    saveAttendanceToLocalStorage(attendanceData);
    showMessage('ATTENDANCE SUBMITTED AND SAVED LOCALLY!', 'success');

    // 2. Cloud Storage Integration (Google Apps Script / Google Sheet) - DISABLED BY DEFAULT FOR LOCAL USE CASE
    // IMPORTANT: Replace 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' with your deployed Apps Script URL if you want cloud sync.
    // const apiUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; // E.g., 'https://script.google.com/macros/s/AKfycbz.../exec'
});

// Event listener for downloading ALL history
downloadAllHistoryBtn.addEventListener('click', () => {
    if (storedAttendanceRecords.length === 0) {
        showMessage('NO ATTENDANCE DATA TO DOWNLOAD.', 'error');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ACADEMIC_YEAR,ACADEMIC_YEAR_PREFIX,SECTION,DATE,TIME,FACULTY_NAME,ROLL_NUMBER,STATUS\n";

    storedAttendanceRecords.forEach(record => {
        const recordPrefix = record.academic_year_prefix ||
                             (record.student_status && Object.keys(record.student_status).length > 0 ? Object.keys(record.student_status)[0].substring(0,6) : 'N/A');

        for (const rollNum in record.student_status) {
            const academicYear = escapeCsv(record.academic_year || 'N/A');
            const academicYearPrefix = escapeCsv(recordPrefix);
            const section = escapeCsv(record.section);
            const date = escapeCsv(record.date);
            const time = escapeCsv(record.time);
            const facultyName = escapeCsv(record.faculty_name);
            const rollNumber = escapeCsv(rollNum);
            const status = escapeCsv(record.student_status[rollNum]);

            csvContent += `${academicYear},${academicYearPrefix},${section},${date},${time},${facultyName},${rollNumber},${status}\n`;
        }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all_attendance_history_${getCurrentDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('ALL ATTENDANCE HISTORY DOWNLOADED!', 'success');
});


// --- Edit Attendance Modal Functions ---
function openEditModal(index) {
    editingRecordIndex = index;
    const recordToEdit = storedAttendanceRecords[editingRecordIndex];

    if (!recordToEdit) {
        showMessage('ERROR: RECORD NOT FOUND FOR EDITING.', 'error');
        return;
    }

    editRecordDetailsDiv.innerHTML = `
        <strong>ACADEMIC YEAR:</strong> ${recordToEdit.academic_year || 'N/A'}<br>
        <strong>ACADEMIC YEAR PREFIX:</strong> ${recordToEdit.academic_year_prefix || 'N/A'}<br>
        <strong>SECTION:</strong> ${recordToEdit.section}<br>
        <strong>DATE:</strong> ${recordToEdit.date}<br>
        <strong>TIME:</strong> ${recordToEdit.time}<br>
        <strong>FACULTY:</strong> ${recordToEdit.faculty_name || 'N/A'}<br>
    `;

    editableStudentListDiv.innerHTML = ''; // Clear previous student list

    // Display students based on the record's current student_status
    for (const rollNum in recordToEdit.student_status) {
        const currentStatus = recordToEdit.student_status[rollNum];
        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');

        const rollNumberSpan = document.createElement('span');
        rollNumberSpan.classList.add('roll-number');
        rollNumberSpan.textContent = rollNum;

        const attendanceButtonsDiv = document.createElement('div');
        attendanceButtonsDiv.classList.add('attendance-buttons');

        const presentButton = document.createElement('button');
        presentButton.classList.add('present-btn');
        presentButton.textContent = 'PRESENT';
        presentButton.dataset.fullRollNumber = rollNum;
        presentButton.dataset.status = 'PRESENT';
        if (currentStatus === 'PRESENT') {
            presentButton.classList.add('active');
        }

        const absentButton = document.createElement('button');
        absentButton.classList.add('absent-btn');
        absentButton.textContent = 'ABSENT';
        absentButton.dataset.fullRollNumber = rollNum;
        absentButton.dataset.status = 'ABSENT';
        if (currentStatus === 'ABSENT') {
            absentButton.classList.add('active');
        }

        presentButton.addEventListener('click', (e) => {
            e.target.classList.add('active');
            e.target.nextElementSibling.classList.remove('active');
        });

        absentButton.addEventListener('click', (e) => {
            e.target.classList.add('active');
            e.target.previousElementSibling.classList.remove('active');
        });

        attendanceButtonsDiv.appendChild(presentButton);
        attendanceButtonsDiv.appendChild(absentButton);

        studentItem.appendChild(rollNumberSpan);
        studentItem.appendChild(attendanceButtonsDiv);
        editableStudentListDiv.appendChild(studentItem);
    }

    editAttendanceModalOverlay.classList.add('active');
}

saveEditedAttendanceBtn.addEventListener('click', () => {
    if (editingRecordIndex === -1 || !storedAttendanceRecords[editingRecordIndex]) {
        showMessage('ERROR: NO RECORD SELECTED FOR SAVING.', 'error');
        return;
    }

    const currentRecord = storedAttendanceRecords[editingRecordIndex];
    const updatedStudentStatus = {};

    const studentItems = editableStudentListDiv.querySelectorAll('.student-item');
    studentItems.forEach(item => {
        const fullRollNum = item.querySelector('.present-btn').dataset.fullRollNumber;
        const presentBtn = item.querySelector('.present-btn');

        if (presentBtn.classList.contains('active')) {
            updatedStudentStatus[fullRollNum] = 'PRESENT';
        } else {
            updatedStudentStatus[fullRollNum] = 'ABSENT';
        }
    });

    currentRecord.student_status = updatedStudentStatus; // Update the record in the array
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(storedAttendanceRecords)); // Save updated array

    editAttendanceModalOverlay.classList.remove('active'); // Hide modal
    editingRecordIndex = -1; // Reset index
    displayFilteredHistory(); // Refresh the displayed history
    showMessage('ATTENDANCE RECORD UPDATED SUCCESSFULLY!', 'success');
});

cancelEditAttendanceBtn.addEventListener('click', () => {
    editAttendanceModalOverlay.classList.remove('active');
    editingRecordIndex = -1; // Reset index
});

// --- Delete Record Function ---
function deleteAttendanceRecord(index) {
    if (index < 0 || index >= storedAttendanceRecords.length) {
        showMessage('ERROR: INVALID RECORD SELECTION FOR DELETION.', 'error');
        return;
    }

    const recordToDelete = storedAttendanceRecords[index];
    const confirmation = confirm(`ARE YOU SURE YOU WANT TO DELETE THE ATTENDANCE RECORD FOR:\nSECTION: ${recordToDelete.section}\nDATE: ${recordToDelete.date}\nTIME: ${recordToDelete.time}\nFACULTY: ${recordToDelete.faculty_name}?`);

    if (confirmation) {
        storedAttendanceRecords.splice(index, 1); // Remove the record from the array
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(storedAttendanceRecords)); // Save updated array

        displayFilteredHistory(); // Refresh the displayed history
        populateHistoryFilters(); // Re-populate filters as years/dates might change
        populateSummaryYears(); // Re-populate summary years
        showMessage('ATTENDANCE RECORD DELETED SUCCESSFULLY!', 'success');
    } else {
        showMessage('DELETION CANCELLED.', 'error');
    }
}

// --- Edit Faculty List Modal Functions ---
editFacultyListBtn.addEventListener('click', () => {
    renderFacultyListInModal();
    editFacultyModalOverlay.classList.add('active');
});

closeFacultyModal.addEventListener('click', () => {
    editFacultyModalOverlay.classList.remove('active');
});

addNewFacultyBtn.addEventListener('click', () => {
    const newFaculty = newFacultyNameInput.value.trim();
    if (newFaculty && !storedFacultyList.includes(newFaculty)) {
        storedFacultyList.push(newFaculty);
        storedFacultyList.sort(); // Keep sorted
        saveFacultyListToLocalStorage();
        renderFacultyListInModal();
        newFacultyNameInput.value = ''; // Clear input
    } else if (!newFaculty) {
        alert("PLEASE ENTER A FACULTY NAME.");
    } else {
        alert("FACULTY ALREADY EXISTS.");
    }
});

function renderFacultyListInModal() {
    currentFacultyList.innerHTML = '';
    if (storedFacultyList.length === 0) {
        currentFacultyList.innerHTML = '<p>NO FACULTIES ADDED YET.</p>';
        return;
    }
    storedFacultyList.forEach((faculty, index) => {
        const facultyItem = document.createElement('div');
        facultyItem.classList.add('faculty-item');
        facultyItem.innerHTML = `
            <span>${faculty}</span>
            <button data-index="${index}">REMOVE</button>
        `;
        facultyItem.querySelector('button').addEventListener('click', (e) => {
            const indexToRemove = parseInt(e.target.dataset.index);
            const facultyName = storedFacultyList[indexToRemove];
            if (confirm(`ARE YOU SURE YOU WANT TO REMOVE "${facultyName}"? THIS WILL NOT AFFECT EXISTING ATTENDANCE RECORDS.`)) {
                 storedFacultyList.splice(indexToRemove, 1);
                 saveFacultyListToLocalStorage();
                 renderFacultyListInModal(); // Re-render the list
            }
        });
        currentFacultyList.appendChild(facultyItem);
    });
}

// --- Add Academic Year Prefix Modal Functions ---
addAcademicYearPrefixBtn.addEventListener('click', () => {
    renderPrefixListInModal();
    addPrefixModalOverlay.classList.add('active');
});

closePrefixModal.addEventListener('click', () => {
    addPrefixModalOverlay.classList.remove('active');
});

addNewPrefixBtnModal.addEventListener('click', () => {
    const newPrefix = newPrefixInput.value.trim().toUpperCase(); // Convert to uppercase for consistency
    if (newPrefix && !storedAcademicPrefixes.includes(newPrefix)) {
        // Basic validation for common prefix pattern (e.g., "YYKN1A")
        if (!/^\d{2}KN1A$/.test(newPrefix)) {
            alert("INVALID PREFIX FORMAT. PLEASE USE 'YYKN1A' FORMAT (E.G., 25KN1A).");
            return;
        }
        storedAcademicPrefixes.push(newPrefix);
        storedAcademicPrefixes.sort();
        saveAcademicPrefixesToLocalStorage();
        renderPrefixListInModal();
        newPrefixInput.value = '';
        displayRollNumbersForSection(); // Refresh roll numbers if current prefix is affected
        displayManagedStudentList(); // Refresh managed student list
    } else if (!newPrefix) {
        alert("PLEASE ENTER AN ACADEMIC YEAR PREFIX.");
    } else {
        alert("ACADEMIC YEAR PREFIX ALREADY EXISTS.");
    }
});

function renderPrefixListInModal() {
    currentPrefixList.innerHTML = '';
    if (storedAcademicPrefixes.length === 0) {
        currentPrefixList.innerHTML = '<p>NO PREFIXES ADDED YET.</p>';
        return;
    }
    storedAcademicPrefixes.forEach((prefix, index) => {
        const prefixItem = document.createElement('div');
        prefixItem.classList.add('prefix-item');
        prefixItem.innerHTML = `
            <span>${prefix}</span>
            <button data-index="${index}">REMOVE</button>
        `;
        prefixItem.querySelector('button').addEventListener('click', (e) => {
            const indexToRemove = parseInt(e.target.dataset.index);
             const prefixName = storedAcademicPrefixes[indexToRemove];
            if (confirm(`ARE YOU SURE YOU WANT TO REMOVE "${prefixName}"? THIS WILL NOT AFFECT EXISTING ATTENDANCE RECORDS BUT WILL REMOVE ALL CUSTOM STUDENT LISTS ASSOCIATED WITH IT!`)) {
                // Remove custom student lists for this prefix across all years
                for (const year in customStudentLists) {
                    if (customStudentLists[year][prefixName]) {
                        delete customStudentLists[year][prefixName];
                    }
                }
                saveCustomStudentLists(); // Save changes to student lists

                storedAcademicPrefixes.splice(indexToRemove, 1);
                saveAcademicPrefixesToLocalStorage();
                renderPrefixListInModal();
                populateAcademicPrefixSelect(); // Update main attendance form's dropdown
                populateManageStudentsPrefixSelect(); // Update manage student form's dropdown
                displayRollNumbersForSection(); // Refresh attendance student list
                displayManagedStudentList(); // Refresh managed student list
            }
        });
        currentPrefixList.appendChild(prefixItem);
    });
}

// Event listener for the welcome modal close button
closeWelcomeModalBtn.addEventListener('click', () => {
    welcomeModalOverlay.classList.remove('active'); // Hide the modal

    // Explicitly activate the "MARK ATTENDANCE" tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-button[data-tab="attendance"]').classList.add('active'); // Activate the "Mark Attendance" button

    tabContents.forEach(content => content.classList.remove('active'));
    attendanceContainer.classList.add('active'); // Activate the "Mark Attendance" content div
});

// --- NEW: Manage Students Tab Functions and Listeners ---
manageAcademicYearSelect.addEventListener('change', displayManagedStudentList);
manageAcademicYearPrefixSelect.addEventListener('change', displayManagedStudentList);
manageSectionSelect.addEventListener('change', displayManagedStudentList);

addStudentBtn.addEventListener('click', () => {
    const academicYear = manageAcademicYearSelect.value;
    const prefix = manageAcademicYearPrefixSelect.value;
    const section = manageSectionSelect.value;
    const newRoll = newStudentRollNoInput.value;

    if (!academicYear || !prefix || !section) {
        showMessage('PLEASE SELECT ACADEMIC YEAR, PREFIX, AND SECTION.', 'error', studentManagementMessageDiv);
        return;
    }

    if (addStudent(academicYear, prefix, section, newRoll)) {
        showMessage(`STUDENT "${newRoll.toUpperCase()}" ADDED SUCCESSFULLY!`, 'success', studentManagementMessageDiv);
        newStudentRollNoInput.value = '';
        displayManagedStudentList(); // Refresh the list
        displayRollNumbersForSection(); // Update "Mark Attendance" tab if visible and matching
    }
});

function displayManagedStudentList() {
    managedStudentListDiv.innerHTML = '';
    const academicYear = manageAcademicYearSelect.value;
    const prefix = manageAcademicYearPrefixSelect.value;
    const section = manageSectionSelect.value;
    const sectionDisplay = section === 'itA' ? 'IT-A' : 'IT-B';

    if (!academicYear || !prefix || !section) {
        managedStudentListDiv.innerHTML = '<p>SELECT ACADEMIC YEAR, PREFIX, AND SECTION TO MANAGE STUDENTS.</p>';
        manageSectionHeading.textContent = '';
        return;
    }

    manageSectionHeading.textContent = `${academicYear} - ${sectionDisplay} (Prefix: ${prefix})`;

    const students = getStudentsForSection(academicYear, prefix, section);

    if (students.length === 0) {
        managedStudentListDiv.innerHTML = '<p>NO STUDENTS IN THIS SECTION. ADD NEW STUDENTS ABOVE.</p>';
        return;
    }

    students.forEach(rollNum => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('managed-student-item');
        studentItem.innerHTML = `
            <span class="managed-roll-number">${rollNum}</span>
            <div class="student-actions">
                <button class="edit-student-btn" data-roll="${rollNum}">EDIT</button>
                <button class="delete-student-btn" data-roll="${rollNum}">DELETE</button>
            </div>
        `;
        managedStudentListDiv.appendChild(studentItem);
    });

    document.querySelectorAll('.edit-student-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const rollToEdit = e.target.dataset.roll;
            openEditStudentModal(academicYear, prefix, section, rollToEdit);
        });
    });

    document.querySelectorAll('.delete-student-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const rollToDelete = e.target.dataset.roll;
            if (confirm(`ARE YOU SURE YOU WANT TO DELETE STUDENT "${rollToDelete}" from ${sectionDisplay} (${academicYear} ${prefix})? This will also remove them from past attendance records.`)) {
                if (deleteStudent(academicYear, prefix, section, rollToDelete)) {
                    showMessage(`STUDENT "${rollToDelete}" DELETED SUCCESSFULLY!`, 'success', studentManagementMessageDiv);
                    displayManagedStudentList(); // Re-render the list
                    displayRollNumbersForSection(); // Update Mark Attendance tab
                } else {
                    showMessage(`FAILED TO DELETE STUDENT "${rollToDelete}".`, 'error', studentManagementMessageDiv);
                }
            }
        });
    });
}

// --- NEW: Edit Student Modal Functions ---
function openEditStudentModal(academicYear, prefix, section, rollNumber) {
    currentStudentBeingEdited = {
        academicYear,
        prefix,
        section,
        oldRollNumber: rollNumber
    };
    currentRollNumberForEdit.textContent = rollNumber;
    editedRollNumberInput.value = rollNumber; // Pre-fill with current roll number
    editStudentMessageDiv.style.display = 'none'; // Hide previous messages
    editStudentModalOverlay.classList.add('active');
}

saveEditedStudentBtn.addEventListener('click', () => {
    const newRoll = editedRollNumberInput.value.trim();
    const { academicYear, prefix, section, oldRollNumber } = currentStudentBeingEdited;

    if (editStudent(academicYear, prefix, section, oldRollNumber, newRoll)) {
        showMessage(`ROLL NUMBER CHANGED FROM "${oldRollNumber}" TO "${newRoll.toUpperCase()}" SUCCESSFULLY!`, 'success', studentManagementMessageDiv);
        editStudentModalOverlay.classList.remove('active');
        displayManagedStudentList(); // Refresh managed list
        displayRollNumbersForSection(); // Refresh mark attendance list
        // Refresh history to reflect updated roll numbers (if any were present in history)
        displayFilteredHistory();
    }
    // Error messages are handled by `editStudent` function
});

cancelEditStudentBtn.addEventListener('click', () => {
    editStudentModalOverlay.classList.remove('active');
    currentStudentBeingEdited = { academicYear: '', prefix: '', section: '', oldRollNumber: '' };
});


// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDateTimeDisplay();
    setInterval(updateDateTimeDisplay, 1000);

    // Load all persistent data
    loadFacultyListFromLocalStorage();
    loadAcademicPrefixesFromLocalStorage();
    loadAttendanceFromLocalStorage();
    loadCustomStudentLists(); // NEW: Load custom student lists

    // Populate initial dropdowns and display for active tab (Mark Attendance)
    populateFacultySelect();
    populateAcademicPrefixSelect();
    displayRollNumbersForSection();

    // Populate history filters initially
    populateHistoryFilters();
    // Populate summary years initially
    populateSummaryYears();
    // Populate manage students prefix select (initially hidden)
    populateManageStudentsPrefixSelect();


    // Manually trigger the welcome modal to show initially
    welcomeModalOverlay.classList.add('active');

    // Ensure no tab content is active initially, the modal will handle activation
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
});