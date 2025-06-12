/**
 * @name WiFiSkeletonMusic
 * @version 1.0.0
 * @description WiFiSkeleton background music player for Revenge
 * @author iloveandmissmygf
 * @source https://github.com/justanewplayer19/WiFiSkeletonMusic
 */

// Manifest for Revenge
module.exports = {
    name: "WiFiSkeletonMusic",
    version: "1.0.0",
    description: "WiFiSkeleton background music player for Revenge",
    author: "iloveandmissmygf",
    
    // This is where the actual plugin code starts
    onLoad() {
        console.log("[WiFiSkeleton] Plugin loaded!");
        this.createPlayer();
        this.showToast("WiFiSkeleton Music loaded! Use /wifiplay to start");
    },
    
    onUnload() {
        console.log("[WiFiSkeleton] Plugin unloaded!");
        this.stopMusic();
        this.removePlayer();
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
    progressInterval: null,
    
    // Create audio player
    createPlayer() {
        this.audio = new Audio();
        this.audio.volume = 0.5;
        
        // Add event listeners
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error("[WiFiSkeleton] Audio error:", e);
            this.showToast(`Failed to load: ${this.playlist[this.currentTrack].name}`, "error");
            this.nextTrack();
        });
        
        // Create floating player UI
        this.createPlayerUI();
    },
    
    // Create player UI
    createPlayerUI() {
        // Create player element
        const playerHTML = `
            <div id="wifiskeleton-player" style="
                position: fixed;
                bottom: 70px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #ff4444;
                border-radius: 5px;
                padding: 10px;
                width: 200px;
                z-index: 9999;
                font-family: system-ui;
                color: white;
                box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
            ">
                <div style="
                    font-size: 12px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 5px;
                    color: #ff4444;
                ">◆ WIFI SKELETON ◆</div>
                
                <div id="wifiskeleton-track" style="
                    font-size: 12px;
                    text-align: center;
                    margin-bottom: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                ">${this.playlist[this.currentTrack].name}</div>
                
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 5px;
                ">
                    <button id="wifiskeleton-prev" style="
                        background: #ff4444;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 12px;
                    ">⏮</button>
                    
                    <button id="wifiskeleton-play" style="
                        background: #ff4444;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 12px;
                    ">▶</button>
                    
                    <button id="wifiskeleton-next" style="
                        background: #ff4444;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 12px;
                    ">⏭</button>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                ">
                    <span>VOL:</span>
                    <input id="wifiskeleton-volume" type="range" min="0" max="100" value="50" style="
                        flex: 1;
                        height: 3px;
                    ">
                </div>
            </div>
        `;
        
        // Add player to body
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        this.playerElement = document.getElementById('wifiskeleton-player');
        
        // Add event listeners
        document.getElementById('wifiskeleton-play').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        document.getElementById('wifiskeleton-prev').addEventListener('click', () => {
            this.previousTrack();
        });
        
        document.getElementById('wifiskeleton-next').addEventListener('click', () => {
            this.nextTrack();
        });
        
        document.getElementById('wifiskeleton-volume').addEventListener('input', (e) => {
            if (this.audio) {
                this.audio.volume = e.target.value / 100;
            }
        });
        
        // Make player draggable
        this.makeDraggable(this.playerElement);
    },
    
    // Make element draggable
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.ontouchstart = dragTouchStart;
        
        function dragTouchStart(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Get touch position
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Calculate new position
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            // Set element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.ontouchend = null;
            document.ontouchmove = null;
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
            
            // Set up audio source if needed
            if (!this.audio.src || this.audio.src !== track.url) {
                this.audio.src = track.url;
                this.audio.load();
            }
            
            // Play audio
            await this.audio.play();
            this.isPlaying = true;
            
            // Update UI
            const playBtn = document.getElementById('wifiskeleton-play');
            if (playBtn) playBtn.textContent = '⏸';
            
            // Update track name
            const trackEl = document.getElementById('wifiskeleton-track');
            if (trackEl) trackEl.textContent = track.name;
            
            this.showToast(`Now playing: ${track.name}`);
            
        } catch (error) {
            console.error("[WiFiSkeleton] Playback failed:", error);
            this.showToast(`Failed to play: ${error.message}`, "error");
        }
    },
    
    // Pause music
    pauseMusic() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            
            // Update UI
            const playBtn = document.getElementById('wifiskeleton-play');
            if (playBtn) playBtn.textContent = '▶';
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
        
        // Update track name
        const trackEl = document.getElementById('wifiskeleton-track');
        if (trackEl) trackEl.textContent = this.playlist[this.currentTrack].name;
        
        if (this.isPlaying) {
            this.playMusic();
        }
    },
    
    // Previous track
    previousTrack() {
        this.currentTrack = this.currentTrack === 0 ? 
            this.playlist.length - 1 : this.currentTrack - 1;
        
        // Update track name
        const trackEl = document.getElementById('wifiskeleton-track');
        if (trackEl) trackEl.textContent = this.playlist[this.currentTrack].name;
        
        if (this.isPlaying) {
            this.playMusic();
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
    showToast(message, type = "info") {
        // Try to use Revenge's toast system if available
        try {
            if (window.Revenge && window.Revenge.showToast) {
                window.Revenge.showToast(message, type);
                return;
            }
        } catch (e) {
            console.error("[WiFiSkeleton] Failed to use Revenge toast:", e);
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === "error" ? "#ff4444" : "#333"};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: system-ui;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // Commands for Revenge
    commands: [
        {
            name: "wifiplay",
            description: "Play/pause WiFiSkeleton music",
            execute: function() {
                this.togglePlayPause();
                return {
                    send: false,
                    result: `WiFiSkeleton music ${this.isPlaying ? 'playing' : 'paused'}`
                };
            }
        },
        {
            name: "wifinext",
            description: "Play next WiFiSkeleton track",
            execute: function() {
                this.nextTrack();
                return {
                    send: false,
                    result: `Playing next track: ${this.playlist[this.currentTrack].name}`
                };
            }
        },
        {
            name: "wifiprev",
            description: "Play previous WiFiSkeleton track",
            execute: function() {
                this.previousTrack();
                return {
                    send: false,
                    result: `Playing previous track: ${this.playlist[this.currentTrack].name}`
                };
            }
        },
        {
            name: "wifilist",
            description: "Show WiFiSkeleton playlist",
            execute: function() {
                const trackList = this.playlist.map((track, i) => 
                    `${i === this.currentTrack ? '▶️' : '⏸️'} ${track.name}`
                ).join('\n');
                
                return {
                    send: false,
                    result: `WiFiSkeleton Playlist:\n${trackList}`
                };
            }
        }
    ]
};
