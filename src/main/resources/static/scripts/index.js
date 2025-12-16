new Manager();

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        const ok = confirm('CONFIRM LOGOUT?');

        if (!ok) return;

        localStorage.removeItem('token');
        alert('LOGOUT SUCCESSFUL');
        location.href = '/login.html';
    });
});
