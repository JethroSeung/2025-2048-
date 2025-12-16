// scripts/listener.js

function Listener({ move: moveFn, start: startFn }) {
    // 1. 键盘监听 (保持不变)
    window.addEventListener('keyup', function(e) {
      switch (e.code) {
        case 'ArrowUp':
          e.preventDefault();
          moveFn({ row: -1, column: 0 });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveFn({ row: 0, column: -1 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFn({ row: 0, column: 1 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFn({ row: 1, column: 0 });
          break;
      }
    });
  
    // 2. 屏幕虚拟按键监听 (D-Pad)
    const bindButton = (id, fn) => {
        const btn = document.getElementById(id);
        if (btn) {
            // 既支持鼠标点击，也支持触摸，防止触摸延迟
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // 防止双击缩放
                fn();
            }, { passive: false });
            
            btn.addEventListener('click', (e) => {
                fn();
            });
        }
    };

    bindButton('btn-up', () => moveFn({ row: -1, column: 0 }));
    bindButton('btn-down', () => moveFn({ row: 1, column: 0 }));
    bindButton('btn-left', () => moveFn({ row: 0, column: -1 }));
    bindButton('btn-right', () => moveFn({ row: 0, column: 1 }));

    // 3. 游戏控制 (Start / A 键)
    const startGame = () => {
        startFn();
        // 隐藏 Status 界面由 Render 处理，但这里可以做一些音效触发等
    };

    bindButton('btn-start', startGame);
    bindButton('btn-a', startGame);
    
    // Select 键可以用作重置
    bindButton('btn-select', () => {
        if(confirm("Restart Game?")) {
            startFn();
        }
    });
  }