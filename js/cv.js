// Lấy ID từ URL (VD: cv.html?id=alice)
const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get('id');

// Fetch data
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        // Tìm user theo ID
        const member = data.find(m => m.id === memberId);
        if (member) {
            renderCV(member);
        } else {
            document.getElementById('cv-content').innerHTML = "<h1>User not found!</h1>";
        }
    });

function renderCV(member) {
    const cvWrapper = document.getElementById('cv-content');
    
    // Khối HTML cho Progress Bar
    const skillsHTML = member.skills.map(skill => `
        <li>
            ${skill.name}
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
        </li>
    `).join('');

    const expHTML = member.experience.map(exp => `
        <div class="exp-item">
            <h4>${exp.role} - <span>${exp.company}</span> <small style="float:right">${exp.time}</small></h4>
            <ul>${exp.desc.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
    `).join('');

    cvWrapper.innerHTML = `
        <div class="sidebar">
            <img src="${member.image}" alt="${member.name}">
            <h2>Contact</h2>
            <ul>
                <li>📧 ${member.email}</li>
                <li>📞 ${member.phone}</li>
                <li>📍 ${member.location}</li>
            </ul>
            
            <h2>Skills</h2>
            <ul>${skillsHTML}</ul>

            <h2>Links</h2>
            <ul>
                <li>🔗 <a href="https://${member.social.linkedin}" target="_blank">LinkedIn</a></li>
                <li>💻 <a href="https://${member.social.github}" target="_blank">GitHub</a></li>
            </ul>
        </div>

        <div class="main-content">
            <div class="header">
                <h1>${member.name}</h1>
                <h3 style="color: var(--text-light);">${member.title}</h3>
            </div>

            <h2>Profile</h2>
            <p>${member.profile}</p>

            <h2>Experience</h2>
            ${expHTML || '<p>No experience listed.</p>'}

            <h2>Education</h2>
            ${member.education.map(edu => `
                <p><strong>${edu.degree}</strong><br>${edu.school} (${edu.time})</p>
            `).join('')}
        </div>
    `;
}

// Tính năng Dark/Light Theme
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Tính năng Xuất PDF sử dụng html2pdf
document.getElementById('download-pdf').addEventListener('click', () => {
    const element = document.getElementById('cv-content');
    // Cấu hình PDF để giữ form chuẩn
    const opt = {
      margin:       0.5,
      filename:     `CV_${memberId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true }, // useCORS để tải được ảnh từ domain khác
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});