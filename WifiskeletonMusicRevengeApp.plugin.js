/**
 * @name WiFiSkeletonMusic
 * @version 1.0.0
 * @description WiFiSkeleton background music player for Revenge
 * @author iloveandmissmygf
 * @source https://github.com/Justanewplayer19/WiFiSkeletonMusic
 */

// Revenge-compatible plugin structure
const plugin = {
    // Plugin metadata
    manifest: {
        name: "WiFiSkeletonMusic",
        version: "1.0.0", 
        description: "WiFiSkeleton background music player for Revenge",
        author: "iloveandmissmygf",
        source: "https://github.com/Justanewplayer19/WiFiSkeletonMusic"
    },

    // Plugin data
    playlist: [
        {
            name: "pony",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/pony.mp3",
            duration: "1:25"
        },
        {
            name: "2008",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/2008.mp4", 
            duration: "1:08"
        },
        {
            name: "im a monster in real life",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/im%20a%20monster%20in%20your%20real%20life.mp3",
            duration: "1:25"
        },
        {
            name: "stop reminding me im human",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/stop%20reminding%20me%20im%20human.mp3",
            duration: "1:10"
        },
        {
            name: "stupid",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/stupid.mp3",
            duration: "1:20"
        },
        {
            name: "you ruin everything dont you",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/you%20ruin%20everything%20dont%20you.mp3",
            duration: "1:02"
        },
        {
            name: "ik your waiting....",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/ik%20your%20waiting....mp3",
            duration: "1:25"
        },
        {
            name: "birthday",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/birthday.mp3",
            duration: "1:19"
        },
        {
            name: "bipolar", 
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/bipolar.mp3",
            duration: "1:26"
        },
        {
            name: "famous",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/famous.mp3",
            duration: "1:22"
        },
        {
            name: "ugly",
            url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/ugly.mp3",
            duration: "2:33"
        }
    ],

    currentTrack: 0,
    isPlaying: false,
    audio: null,
    playerElement: null,

    // Plugin lifecycle methods
    onLoad() {
        console.log("[WiFiSkeleton] Plugin loaded!");
        this.createPlayer();
        this.showToast("🔥 WiFiSkeleton Music loaded! Tap player to control");
    },

    onUnload() {
        console.log("[WiFiSkeleton] Plugin unloaded!");
        this.stopMusic();
        this.removePlayer();
    },

    // Create audio player
    createPlayer() {
        this.audio = new Audio();
        this.audio.volume = 0.5;
        
        // Audio event listeners
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error("[WiFiSkeleton] Audio error:", e);
            this.showToast(`❌ Failed: ${this.playlist[this.currentTrack].name}`);
            this.nextTrack();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        // Create UI
        this.createPlayerUI();
    },

    // Create player UI
    createPlayerUI() {
        // Remove existing player if any
        this.removePlayer();
        
        const playerHTML = `
            <div id="wifiskeleton-player" style="
                position: fixed;
                bottom: 90px;
                right: 15px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 0, 0, 0.95));
                border: 2px solid #ff4444;
                border-radius: 10px;
                padding: 15px;
                width: 240px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;
                color: white;
                box-shadow: 0 0 20px rgba(255, 68, 68, 0.6);
                backdrop-filter: blur(15px);
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            ">
                <div style="
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
                    color: #ff4444;
                    text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
                    letter-spacing: 2px;
                ">◆ WIFI SKELETON ◆</div>
                
                <div id="wifiskeleton-track" style="
                    font-size: 13px;
                    text-align: center;
                    margin-bottom: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #cccccc;
                    background: rgba(255, 68, 68, 0.1);
                    padding: 5px 8px;
                    border-radius: 5px;
                ">${this.playlist[this.currentTrack].name}</div>
                
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 12px;
                ">
                    <button id="wifiskeleton-prev" style="
                        background: linear-gradient(135deg, #ff4444, #cc3333);
                        border: none;
                        color: white;
                        padding: 10px 14px;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 6px;
                        touch-action: manipulation;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
                    ">⏮</button>
                    
                    <button id="wifiskeleton-play" style="
                        background: linear-gradient(135deg, #ff4444, #cc3333);
                        border: none;
                        color: white;
                        padding: 10px 14px;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 6px;
                        touch-action: manipulation;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
                        min-width: 50px;
                    ">▶</button>
                    
                    <button id="wifiskeleton-next" style="
                        background: linear-gradient(135deg, #ff4444, #cc3333);
                        border: none;
                        color: white;
                        padding: 10px 14px;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 6px;
                        touch-action: manipulation;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
                    ">⏭</button>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12px;
                ">
                    <span style="color: #ff4444; font-weight: bold;">VOL:</span>
                    <input id="wifiskeleton-volume" type="range" min="0" max="100" value="50" style="
                        flex: 1;
                        height: 6px;
                        background: rgba(255, 68, 68, 0.3);
                        outline: none;
                        border: none;
                        border-radius: 3px;
                        -webkit-appearance: none;
                        appearance: none;
                    ">
                    <span id="wifiskeleton-vol-val" style="
                        color: #cccccc;
                        min-width: 35px;
                        text-align: right;
                        font-weight: bold;
                    ">50%</span>
                </div>
                
                <div style="
                    margin-top: 8px;
                    text-align: center;
                    font-size: 10px;
                    color: #888;
                ">Drag to move • Tap to control</div>
            </div>
        `;
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        this.playerElement = document.getElementById('wifiskeleton-player');
        
        // Add event listeners
        this.attachEventListeners();
        
        // Make draggable
        this.makeDraggable(this.playerElement);
        
        // Add button hover effects
        this.addButtonEffects();
    },

    // Attach event listeners
    attachEventListeners() {
        const playBtn = document.getElementById('wifiskeleton-play');
        const prevBtn = document.getElementById('wifiskeleton-prev');
        const nextBtn = document.getElementById('wifiskeleton-next');
        const volumeSlider = document.getElementById('wifiskeleton-volume');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                if (this.audio) {
                    this.audio.volume = e.target.value / 100;
                    const volVal = document.getElementById('wifiskeleton-vol-val');
                    if (volVal) volVal.textContent = e.target.value + '%';
                }
            });
        }
    },

    // Add button hover effects
    addButtonEffects() {
        const buttons = this.playerElement.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
                btn.style.boxShadow = '0 1px 4px rgba(255, 68, 68, 0.5)';
            });
            
            btn.addEventListener('touchend', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 2px 8px rgba(255, 68, 68, 0.3)';
            });
        });
    },

    // Make draggable for mobile
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        
        element.addEventListener('touchstart', dragTouchStart, { passive: false });
        
        function dragTouchStart(e) {
            // Only drag if touching the header area
            const rect = element.getBoundingClientRect();
            const touchY = e.touches[0].clientY;
            const headerHeight = 40; // Approximate header height
            
            if (touchY - rect.top > headerHeight) return; // Don't drag if touching controls
            
            e.preventDefault();
            isDragging = true;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            document.addEventListener('touchend', closeDragElement);
            document.addEventListener('touchmove', elementDrag, { passive: false });
        }
        
        function elementDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;
            
            // Keep within screen bounds
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            
            element.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
            element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
        }
        
        function closeDragElement() {
            isDragging = false;
            document.removeEventListener('touchend', closeDragElement);
            document.removeEventListener('touchmove', elementDrag);
        }
    },

    // Toggle play/pause
    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    },

    // Play music
    async playMusic() {
        try {
            const track = this.playlist[this.currentTrack];
            
            if (!this.audio.src || this.audio.src !== track.url) {
                this.audio.src = track.url;
                this.audio.load();
            }
            
            await this.audio.play();
            this.showToast(`🎵 Playing: ${track.name}`);
            
        } catch (error) {
            console.error("[WiFiSkeleton] Playback failed:", error);
            this.showToast(`❌ Playback failed: ${error.message}`);
        }
    },

    // Pause music
    pauseMusic() {
        if (this.audio) {
            this.audio.pause();
        }
    },

    // Stop music
    stopMusic() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
        }
    },

    // Next track
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.updateTrackInfo();
        
        if (this.isPlaying) {
            this.playMusic();
        }
    },

    // Previous track
    previousTrack() {
        this.currentTrack = this.currentTrack === 0 ? 
            this.playlist.length - 1 : this.currentTrack - 1;
        this.updateTrackInfo();
        
        if (this.isPlaying) {
            this.playMusic();
        }
    },

    // Update track info in UI
    updateTrackInfo() {
        const trackEl = document.getElementById('wifiskeleton-track');
        if (trackEl) {
            trackEl.textContent = this.playlist[this.currentTrack].name;
        }
    },

    // Update play button
    updatePlayButton() {
        const playBtn = document.getElementById('wifiskeleton-play');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    },

    // Remove player
    removePlayer() {
        if (this.playerElement) {
            this.playerElement.remove();
            this.playerElement = null;
        }
    },

    // Show toast notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(255, 68, 68, 0.95), rgba(204, 51, 51, 0.95));
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;
            font-size: 14px;
            font-weight: 500;
            z-index: 100000;
            box-shadow: 0 4px 15px rgba(255, 68, 68, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 68, 68, 0.3);
            max-width: 300px;
            text-align: center;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        
        requestAnimationFrame(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Export for Revenge
module.exports = plugin;
