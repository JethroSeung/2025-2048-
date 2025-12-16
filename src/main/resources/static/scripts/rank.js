// scripts/rank.js

document.addEventListener('DOMContentLoaded', () => {
    // 三种布局
    loadRank(1, 'rank-4');
    loadRank(2, 'rank-5');
    loadRank(3, 'rank-6');

    loadMyBest();
});


function loadMyBest() {
    const token = localStorage.getItem('token');
    if (!token) return;

    // 显示用户名
    const username = getUsernameFromToken?.() || localStorage.getItem('username');
    if (username) {
        document.getElementById('my-best-title').textContent =
            `${username} · BEST SCORES`;
    }

    fetch('/api/scores/my/best/all', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.code !== 0 || !res.data) return;

            document.getElementById('my-best-4').textContent = res.data[1] ?? '-';
            document.getElementById('my-best-5').textContent = res.data[2] ?? '-';
            document.getElementById('my-best-6').textContent = res.data[3] ?? '-';
        });
}




function loadRank(layoutId, elementId) {
    const ol = document.getElementById(elementId);
    if (!ol) return;

    const token = localStorage.getItem('token');

    fetch(`/api/scores/rank/${layoutId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => {
            if (res.status === 401) {
                throw new Error('unauthorized');
            }
            return res.json();
        })
        .then(res => {
            if (res.code !== 0) {
                showError(ol);
                return;
            }

            const list = res.data || [];
            renderRankList(ol, list);
        })
        .catch(() => {
            showError(ol);
        });
}

function renderRankList(ol, list) {
    // 1️⃣ 清空原有内容（假数据 / loading）
    ol.innerHTML = '';

    // 2️⃣ 最多取前 10
    for (let i = 0; i < 10; i++) {
        const item = list[i];

        if (item) {
            ol.innerHTML += `
        <li>
          <span class="rank-num">${i + 1}</span>
          <span class="p-name">${escapeHtml(item.username)}</span>
          <span class="p-score">${item.score}</span>
        </li>
      `;
        } else {
            // 不足 10 个，补空位
            ol.innerHTML += `
        <li>
          <span class="rank-num">${i + 1}</span>
          <span class="p-name">-</span>
          <span class="p-score">-</span>
        </li>
      `;
        }
    }
}

function showError(ol) {
    ol.innerHTML = `
    <li class="loading">FAILED TO LOAD</li>
  `;
}

// 防止用户名里有奇怪字符（加分项）
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


function getUsernameFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        // 这里根据你后端 JWT 的字段来
        return payload.username || payload.sub || null;
    } catch (e) {
        return null;
    }
}

