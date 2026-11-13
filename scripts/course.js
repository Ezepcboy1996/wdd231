const courses = [
    { subject: 'CSE', number: 110, title: 'Intro to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'WDD', number: 131, title: 'Web Frontend I', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
    { subject: 'WDD', number: 231, title: 'Web Frontend II', credits: 3, completed: false }
];

const container = document.getElementById('course-container');
const creditsDisplay = document.getElementById('total-credits');

function displayCourses(filteredCourses) {
    container.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }
        card.innerHTML = `<h3>${course.subject} ${course.number}</h3><p>${course.title}</p>`;
        container.appendChild(card);
    });

    // Reduce function to dynamically sum active layout credits
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    creditsDisplay.textContent = `Total Credits: ${totalCredits}`;
}

// Event Listeners for Filters
document.getElementById('filter-all').addEventListener('click', () => displayCourses(courses));
document.getElementById('filter-wdd').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'WDD')));
document.getElementById('filter-cse').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'CSE')));

// Initial load execution
displayCourses(courses);
