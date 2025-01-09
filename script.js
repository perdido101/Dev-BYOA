class PomodoroTimer {
    constructor() {
        this.timeSpeed = 1;
        this.isRunning = false;
        this.currentTime = 25 * 60;
        this.totalTime = this.currentTime;
        this.isWorkMode = true;
        this.workTime = 25 * 60;
        this.breakTime = 5 * 60;
        this.timerId = null;

        this.expressions = {
            normal: {
                face: '',
                messages: [
                    "Let's get this done! 💪",
                    "You can do it! ✨",
                    "Stay focused! 🎯"
                ]
            },
            yelling: {
                face: 'yelling',
                messages: [
                    "KEEP GOING! 🔥",
                    "YOU'RE CRUSHING IT! ⚡",
                    "ALMOST THERE! 💥",
                    "MAXIMUM EFFORT! 💪",
                    "POWER MODE! 🚀"
                ]
            }
        };
        
        this.expressionInterval = null;
        this.startExpressionCycle();

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.timerDisplay = {
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.buttons = {
            start: document.getElementById('start'),
            pause: document.getElementById('pause'),
            reset: document.getElementById('reset'),
            speeds: document.querySelectorAll('.speed-btn')
        };
        this.face = {
            eyes: document.querySelectorAll('.eye'),
            mouth: document.querySelector('.mouth')
        };
        this.speechBubble = document.querySelector('.speech-bubble');
        this.modeButtons = {
            work: document.getElementById('work-mode'),
            break: document.getElementById('break-mode')
        };
    }

    setupEventListeners() {
        this.buttons.start.addEventListener('click', () => this.startTimer());
        this.buttons.pause.addEventListener('click', () => this.pauseTimer());
        this.buttons.reset.addEventListener('click', () => this.resetTimer());
        this.buttons.speeds.forEach(btn => {
            btn.addEventListener('click', () => this.updateSpeed(btn));
        });
        this.modeButtons.work.addEventListener('click', () => this.switchMode('work'));
        this.modeButtons.break.addEventListener('click', () => this.switchMode('break'));
    }

    updateTimer() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        
        this.timerDisplay.minutes.textContent = minutes.toString().padStart(2, '0');
        this.timerDisplay.seconds.textContent = seconds.toString().padStart(2, '0');
        
        this.updateFaceExpression();
    }

    updateFaceExpression() {
        const progress = this.currentTime / this.totalTime;
        const expression = this.getExpressionForProgress(progress);
        
        this.face.eyes.forEach(eye => eye.style.cssText = expression.eyes);
        this.face.mouth.style.cssText = expression.mouth;
    }

    updateSpeed(btn) {
        this.timeSpeed = parseInt(btn.dataset.speed);
        this.buttons.speeds.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        this.updateSpeedMessage();
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startExpressionCycle();
            this.timerId = setInterval(() => {
                this.currentTime -= this.timeSpeed;
                this.updateTimer();
                
                if (this.currentTime <= 0) {
                    this.handleTimerComplete();
                }
            }, 1000);
        }
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        clearInterval(this.expressionInterval);
        
        // Reset to normal expression
        document.querySelector('.face').classList.remove('yelling');
        this.updateMessage(this.isWorkMode ? "Ready to focus!" : "Ready for a break!");
    }

    resetTimer() {
        this.pauseTimer();
        this.currentTime = this.isWorkMode ? this.workTime : this.breakTime;
        this.totalTime = this.currentTime;
        this.updateTimer();
        this.startExpressionCycle();
    }

    handleTimerComplete() {
        this.pauseTimer();
        this.updateMessage("Time's up! 🎉");
        // Add notification sound or other completion indicators here
    }

    switchMode(mode) {
        this.isWorkMode = mode === 'work';
        this.pauseTimer();
        this.currentTime = this.isWorkMode ? this.workTime : this.breakTime;
        this.totalTime = this.currentTime;
        
        // Update UI
        this.modeButtons.work.classList.toggle('active', this.isWorkMode);
        this.modeButtons.break.classList.toggle('active', !this.isWorkMode);
        this.modeButtons.work.setAttribute('aria-pressed', this.isWorkMode);
        this.modeButtons.break.setAttribute('aria-pressed', !this.isWorkMode);
        
        // Update message
        this.updateMessage(this.isWorkMode ? "Let's focus! 💪" : "Time for a break! ☕");
        
        this.updateTimer();
    }

    updateMessage(message) {
        if (this.speechBubble) {
            this.speechBubble.textContent = message;
        }
    }

    startExpressionCycle() {
        this.expressionInterval = setInterval(() => {
            const face = document.querySelector('.face');
            const isYelling = face.classList.contains('yelling');
            
            // Toggle expression
            face.classList.toggle('yelling');
            
            // Update message based on expression
            const expressionType = isYelling ? 'normal' : 'yelling';
            const messages = this.expressions[expressionType].messages;
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            this.updateMessage(randomMessage);
        }, 2000);
    }

    cleanup() {
        clearInterval(this.expressionInterval);
        clearInterval(this.timerId);
    }
}

// Initialize with cleanup on page unload
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
    window.addEventListener('unload', () => timer.cleanup());
}); 