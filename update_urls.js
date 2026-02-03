const fs = require('fs');
const files = [
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/teacher/TeacherDashboard.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/teacher/CreateQuiz.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/teacher/AddQuestion.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/student/TakeQuiz.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/student/StudentDashboard.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/student/ExamAnalysis.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/auth/Signup.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/auth/Login.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/admin/AdminLogin.jsx',
    'c:/Projects/OnlineQuize/onlinequiz-mern/frontend/src/pages/admin/AdminDashboard.jsx'
];

files.forEach(f => {
    try {
        if (fs.existsSync(f)) {
            let content = fs.readFileSync(f, 'utf8');
            let newContent = content.replace(/localhost:5000/g, '127.0.0.1:5001')
                .replace(/127\.0\.0\.1:5000/g, '127.0.0.1:5001');
            fs.writeFileSync(f, newContent, 'utf8');
            console.log('Updated ' + f);
        } else {
            console.log('File not found: ' + f);
        }
    } catch (e) {
        console.error('Error updating ' + f, e);
    }
});
