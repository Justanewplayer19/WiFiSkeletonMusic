/**
 * @name WiFiSkeletonMusic
 * @author iloveandmissmygf
 * @description Fixed WiFiSkeleton background music player
 * @version 1.2.0
 * @authorId 1023772274446323713
 * @website https://github.com/justanewplayer19/WiFiSkeletonMusic
 * @source https://github.com/justanewplayer19/WiFiSkeletonMusic
 */

module.exports = (() => {
    const config = {
        info: {
            name: "WiFiSkeletonMusic",
            authors: [{
                name: "iloveandmissmygf",
                discord_id: "1023772274446323713"
            }],
            version: "1.2.0",
            description: "Fixed WiFiSkeleton background music player with better error handling",
            github: "https://github.com/justanewplayer19/WiFiSkeletonMusic",
            github_raw: "https://raw.githubusercontent.com/justanewplayer19/WiFiSkeletonMusic/main/WiFiSkeletonMusic.plugin.js"
        },
        changelog: [
            {
                title: "Fixed Version",
                items: [
                    "Fixed play button not working",
                    "Better error handling and debugging",
                    "Improved CORS handling",
                    "Added connection status indicator",
                    "Better user feedback"
                ]
            }
        ]
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
            const { DiscordModules, WebpackModules, Patcher, Logger, Settings, Utilities, DOMTools } = Library;

            // WiFiSkeleton playlist with better URLs and fallbacks
            const PLAYLIST = [
                {
                    name: "pony",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/pony.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/pony.mp3",
                    duration: "1:25"
                },
                {
                    name: "2008",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/2008.mp4",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/2008.mp4",
                    duration: "1:08"
                },
                {
                    name: "im a monster in real life",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/im%20a%20monster%20in%20your%20real%20life.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/im%20a%20monster%20in%20your%20real%20life.mp3",
                    duration: "1:25"
                },
                {
                    name: "stop reminding me im human",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/stop%20reminding%20me%20im%20human.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/stop%20reminding%20me%20im%20human.mp3",
                    duration: "1:10"
                },
                {
                    name: "stupid",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/stupid.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/stupid.mp3",
                    duration: "1:20"
                },
                {
                    name: "you ruin everything dont you",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/you%20ruin%20everything%20dont%20you.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/you%20ruin%20everything%20dont%20you.mp3",
                    duration: "1:02"
                },
                {
                    name: "ik your waiting....",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/ik%20your%20waiting....mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/ik%20your%20waiting....mp3",
                    duration: "1:25"
                },
                {
                    name: "birthday",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/birthday.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/birthday.mp3",
                    duration: "1:19"
                },
                {
                    name: "bipolar",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/bipolar.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/bipolar.mp3",
                    duration: "1:26"
                },
                {
                    name: "famous",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/famous.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/famous.mp3",
                    duration: "1:22"
                },
                {
                    name: "ugly",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/ugly.mp3",
                    fallback: "https://raw.githubusercontent.com/Justanewplayer19/WiFiSkeletonMusic/main/ugly.mp3",
                    duration: "2:33"
                }
            ];

            return class WiFiSkeletonMusic extends Plugin {
                constructor() {
                    super();
                    this.audio = null;
                    this.currentTrack = 0;
                    this.isPlaying = false;
                    this.volume = 0.3;
                    this.controlsElement = null;
                    this.progressInterval = null;
                    this.connectionStatus = "disconnected";
                    this.settings = {
                        autoplay: false,
                        volume: 30,
                        shuffle: false,
                        visualizer: true,
                        debug: true
                    };
                }

                onStart() {
                    Logger.info("WiFiSkeleton Music Plugin started!");
                    this.loadSettings();
                    this.createAudioPlayer();
                    this.createMusicControls();
                    this.addStyles();
                    this.testConnection();
                    
                    // Show helpful message
                    BdApi.showToast("WiFiSkeleton Music loaded! Click play to start 🎵", { type: "info", timeout: 3000 });
                }

                onStop() {
                    Logger.info("WiFiSkeleton Music Plugin stopped!");
                    this.stopMusic();
                    this.removeMusicControls();
                    this.removeStyles();
                    this.stopProgressUpdate();
                }

                loadSettings() {
                    const saved = BdApi.loadData("WiFiSkeletonMusic", "settings");
                    if (saved) {
                        this.settings = { ...this.settings, ...saved };
                        this.volume = this.settings.volume / 100;
                    }
                }

                saveSettings() {
                    BdApi.saveData("WiFiSkeletonMusic", "settings", this.settings);
                }

                async testConnection() {
                    try {
                        const testTrack = PLAYLIST[0];
                        const response = await fetch(testTrack.url, { method: 'HEAD' });
                        
                        if (response.ok) {
                            this.connectionStatus = "connected";
                            this.updateConnectionStatus();
                            if (this.settings.debug) {
                                Logger.info("Connection test successful!");
                            }
                        } else {
                            throw new Error(`HTTP ${response.status}`);
                        }
                    } catch (error) {
                        this.connectionStatus = "error";
                        this.updateConnectionStatus();
                        Logger.error("Connection test failed:", error);
                        BdApi.showToast("⚠️ Connection to music files failed. Check your internet!", { type: "error", timeout: 5000 });
                    }
                }

                updateConnectionStatus() {
                    if (!this.controlsElement) return;
                    
                    const statusEl = this.controlsElement.querySelector('.wifiskeleton-status');
                    if (statusEl) {
                        statusEl.className = `wifiskeleton-status ${this.connectionStatus}`;
                        statusEl.textContent = this.connectionStatus === "connected" ? "●" : 
                                             this.connectionStatus === "error" ? "⚠" : "○";
                    }
                }

                createAudioPlayer() {
                    this.audio = new Audio();
                    this.audio.volume = this.volume;
                    this.audio.loop = false;
                    this.audio.preload = "none"; // Don't preload to avoid CORS issues
                    
                    // Remove crossOrigin to avoid CORS issues
                    // this.audio.crossOrigin = "anonymous";
                    
                    this.audio.addEventListener('loadstart', () => {
                        if (this.settings.debug) Logger.info("Audio loading started");
                        this.updateLoadingState(true);
                    });

                    this.audio.addEventListener('canplay', () => {
                        if (this.settings.debug) Logger.info("Audio can play");
                        this.updateLoadingState(false);
                    });

                    this.audio.addEventListener('ended', () => {
                        if (this.settings.debug) Logger.info("Audio ended");
                        this.nextTrack();
                    });

                    this.audio.addEventListener('error', (e) => {
                        Logger.error("Audio error:", e);
                        this.updateLoadingState(false);
                        
                        // Try fallback URL
                        const currentTrackData = PLAYLIST[this.currentTrack];
                        if (currentTrackData.fallback && this.audio.src !== currentTrackData.fallback) {
                            Logger.info("Trying fallback URL...");
                            this.audio.src = currentTrackData.fallback;
                            this.audio.load();
                            return;
                        }
                        
                        BdApi.showToast(`❌ Failed to load: ${PLAYLIST[this.currentTrack].name}`, { type: "error" });
                        this.nextTrack(); // Skip to next track
                    });

                    this.audio.addEventListener('play', () => {
                        if (this.settings.debug) Logger.info("Audio started playing");
                        this.isPlaying = true;
                        this.updatePlayButton();
                        this.startVisualizer();
                        this.startProgressUpdate();
                    });

                    this.audio.addEventListener('pause', () => {
                        if (this.settings.debug) Logger.info("Audio paused");
                        this.isPlaying = false;
                        this.updatePlayButton();
                        this.stopVisualizer();
                        this.stopProgressUpdate();
                    });
                }

                createMusicControls() {
                    const controlsHTML = `
                        <div id="wifiskeleton-music-controls" class="wifiskeleton-controls">
                            <div class="wifiskeleton-header">
                                <div class="wifiskeleton-title-container">
                                    <span class="wifiskeleton-status ${this.connectionStatus}">○</span>
                                    <span class="wifiskeleton-title">◆ WIFI SKELETON ◆</span>
                                </div>
                                <button class="wifiskeleton-minimize" title="Minimize">−</button>
                            </div>
                            <div class="wifiskeleton-content">
                                <div class="wifiskeleton-track-info">
                                    <div class="wifiskeleton-track-name">${PLAYLIST[this.currentTrack].name}</div>
                                    <div class="wifiskeleton-track-duration">
                                        <span class="wifiskeleton-current-time">0:00</span> / 
                                        <span class="wifiskeleton-total-time">${PLAYLIST[this.currentTrack].duration}</span>
                                    </div>
                                </div>
                                <div class="wifiskeleton-progress-container">
                                    <div class="wifiskeleton-progress-bar">
                                        <div class="wifiskeleton-progress-fill"></div>
                                    </div>
                                </div>
                                <div class="wifiskeleton-controls-row">
                                    <button class="wifiskeleton-btn wifiskeleton-prev" title="Previous">⏮</button>
                                    <button class="wifiskeleton-btn wifiskeleton-play" title="Play/Pause">▶</button>
                                    <button class="wifiskeleton-btn wifiskeleton-next" title="Next">⏭</button>
                                    <button class="wifiskeleton-btn wifiskeleton-shuffle ${this.settings.shuffle ? 'active' : ''}" title="Shuffle">🔀</button>
                                </div>
                                <div class="wifiskeleton-volume-row">
                                    <span class="wifiskeleton-volume-label">VOL:</span>
                                    <input type="range" class="wifiskeleton-volume" min="0" max="100" value="${this.settings.volume}">
                                    <span class="wifiskeleton-volume-value">${this.settings.volume}%</span>
                                </div>
                                <div class="wifiskeleton-debug-row" style="display: ${this.settings.debug ? 'block' : 'none'}">
                                    <div class="wifiskeleton-debug-info">
                                        <span class="wifiskeleton-loading" style="display: none;">Loading...</span>
                                        <button class="wifiskeleton-test-btn">Test Connection</button>
                                    </div>
                                </div>
                                ${this.settings.visualizer ? '<div class="wifiskeleton-visualizer"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>' : ''}
                            </div>
                        </div>
                    `;

                    document.body.insertAdjacentHTML('beforeend', controlsHTML);
                    this.controlsElement = document.getElementById('wifiskeleton-music-controls');
                    this.attachControlEvents();
                    this.updateConnectionStatus();
                }

                attachControlEvents() {
                    const controls = this.controlsElement;
                    
                    // Play/Pause button
                    controls.querySelector('.wifiskeleton-play').addEventListener('click', () => {
                        this.togglePlayPause();
                    });

                    // Previous track
                    controls.querySelector('.wifiskeleton-prev').addEventListener('click', () => {
                        this.previousTrack();
                    });

                    // Next track
                    controls.querySelector('.wifiskeleton-next').addEventListener('click', () => {
                        this.nextTrack();
                    });

                    // Shuffle toggle
                    controls.querySelector('.wifiskeleton-shuffle').addEventListener('click', (e) => {
                        this.settings.shuffle = !this.settings.shuffle;
                        e.target.classList.toggle('active');
                        this.saveSettings();
                    });

                    // Volume control
                    controls.querySelector('.wifiskeleton-volume').addEventListener('input', (e) => {
                        this.volume = e.target.value / 100;
                        this.settings.volume = parseInt(e.target.value);
                        if (this.audio) this.audio.volume = this.volume;
                        controls.querySelector('.wifiskeleton-volume-value').textContent = `${this.settings.volume}%`;
                        this.saveSettings();
                    });

                    // Minimize button
                    controls.querySelector('.wifiskeleton-minimize').addEventListener('click', () => {
                        controls.classList.toggle('minimized');
                    });

                    // Test connection button
                    const testBtn = controls.querySelector('.wifiskeleton-test-btn');
                    if (testBtn) {
                        testBtn.addEventListener('click', () => {
                            this.testConnection();
                        });
                    }

                    // Progress bar click
                    const progressBar = controls.querySelector('.wifiskeleton-progress-bar');
                    if (progressBar) {
                        progressBar.addEventListener('click', (e) => {
                            if (!this.audio.duration) return;
                            
                            const rect = progressBar.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            this.audio.currentTime = this.audio.duration * pos;
                            this.updateProgressBar();
                        });
                    }

                    // Make draggable
                    this.makeDraggable(controls);
                }

                makeDraggable(element) {
                    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    const header = element.querySelector('.wifiskeleton-header');
                    
                    header.onmousedown = dragMouseDown;

                    function dragMouseDown(e) {
                        e = e || window.event;
                        e.preventDefault();
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        element.style.top = (element.offsetTop - pos2) + "px";
                        element.style.left = (element.offsetLeft - pos1) + "px";
                    }

                    function closeDragElement() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                }

                async togglePlayPause() {
                    if (this.isPlaying) {
                        this.pauseMusic();
                    } else {
                        await this.playMusic();
                    }
                }

                async playMusic() {
                    try {
                        const currentTrackData = PLAYLIST[this.currentTrack];
                        
                        // Set up the audio source if needed
                        if (!this.audio.src || this.audio.src !== currentTrackData.url) {
                            if (this.settings.debug) Logger.info(`Loading track: ${currentTrackData.name}`);
                            this.audio.src = currentTrackData.url;
                            this.audio.load();
                        }
                        
                        // Try to play
                        await this.audio.play();
                        
                        BdApi.showToast(`🎵 Now playing: ${currentTrackData.name}`, { type: "success" });
                        
                    } catch (error) {
                        Logger.error("Playback failed:", error);
                        
                        // Try fallback URL
                        const currentTrackData = PLAYLIST[this.currentTrack];
                        if (currentTrackData.fallback && this.audio.src !== currentTrackData.fallback) {
                            try {
                                Logger.info("Trying fallback URL...");
                                this.audio.src = currentTrackData.fallback;
                                this.audio.load();
                                await this.audio.play();
                                BdApi.showToast(`🎵 Now playing: ${currentTrackData.name} (fallback)`, { type: "success" });
                                return;
                            } catch (fallbackError) {
                                Logger.error("Fallback also failed:", fallbackError);
                            }
                        }
                        
                        // Show user-friendly error message
                        if (error.name === 'NotAllowedError') {
                            BdApi.showToast("🔒 Browser blocked autoplay. Try clicking play again!", { type: "warning", timeout: 5000 });
                        } else if (error.name === 'NotSupportedError') {
                            BdApi.showToast("❌ Audio format not supported. Skipping track...", { type: "error" });
                            this.nextTrack();
                        } else {
                            BdApi.showToast(`❌ Playback failed: ${error.message}`, { type: "error" });
                        }
                    }
                }

                pauseMusic() {
                    this.audio.pause();
                }

                stopMusic() {
                    if (this.audio) {
                        this.audio.pause();
                        this.audio.currentTime = 0;
                    }
                }

                nextTrack() {
                    if (this.settings.shuffle) {
                        this.currentTrack = Math.floor(Math.random() * PLAYLIST.length);
                    } else {
                        this.currentTrack = (this.currentTrack + 1) % PLAYLIST.length;
                    }
                    this.updateTrackInfo();
                    if (this.isPlaying) {
                        this.playMusic();
                    }
                }

                previousTrack() {
                    if (this.settings.shuffle) {
                        this.currentTrack = Math.floor(Math.random() * PLAYLIST.length);
                    } else {
                        this.currentTrack = this.currentTrack === 0 ? PLAYLIST.length - 1 : this.currentTrack - 1;
                    }
                    this.updateTrackInfo();
                    if (this.isPlaying) {
                        this.playMusic();
                    }
                }

                updateTrackInfo() {
                    if (this.controlsElement) {
                        this.controlsElement.querySelector('.wifiskeleton-track-name').textContent = PLAYLIST[this.currentTrack].name;
                        this.controlsElement.querySelector('.wifiskeleton-total-time').textContent = PLAYLIST[this.currentTrack].duration;
                    }
                }

                updatePlayButton() {
                    if (this.controlsElement) {
                        const playBtn = this.controlsElement.querySelector('.wifiskeleton-play');
                        playBtn.textContent = this.isPlaying ? '⏸' : '▶';
                        playBtn.title = this.isPlaying ? 'Pause' : 'Play';
                    }
                }

                updateLoadingState(loading) {
                    if (!this.controlsElement) return;
                    
                    const loadingEl = this.controlsElement.querySelector('.wifiskeleton-loading');
                    const playBtn = this.controlsElement.querySelector('.wifiskeleton-play');
                    
                    if (loadingEl) {
                        loadingEl.style.display = loading ? 'inline' : 'none';
                    }
                    
                    if (playBtn && loading) {
                        playBtn.textContent = '⏳';
                    } else if (playBtn && !loading) {
                        this.updatePlayButton();
                    }
                }

                startProgressUpdate() {
                    this.stopProgressUpdate();
                    this.progressInterval = setInterval(() => {
                        this.updateProgressBar();
                    }, 100);
                }

                stopProgressUpdate() {
                    if (this.progressInterval) {
                        clearInterval(this.progressInterval);
                        this.progressInterval = null;
                    }
                }

                updateProgressBar() {
                    if (!this.controlsElement || !this.audio.duration) return;
                    
                    const currentTime = this.audio.currentTime;
                    const duration = this.audio.duration;
                    const progressPercent = (currentTime / duration) * 100;
                    
                    // Update progress bar
                    const progressFill = this.controlsElement.querySelector('.wifiskeleton-progress-fill');
                    if (progressFill) {
                        progressFill.style.width = `${progressPercent}%`;
                    }
                    
                    // Update current time
                    const currentTimeEl = this.controlsElement.querySelector('.wifiskeleton-current-time');
                    if (currentTimeEl) {
                        currentTimeEl.textContent = this.formatTime(currentTime);
                    }
                }

                formatTime(seconds) {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                }

                startVisualizer() {
                    if (!this.settings.visualizer) return;
                    
                    const bars = this.controlsElement?.querySelectorAll('.wifiskeleton-visualizer .bar');
                    if (!bars) return;

                    this.visualizerInterval = setInterval(() => {
                        bars.forEach(bar => {
                            const height = Math.random() * 20 + 5;
                            bar.style.height = `${height}px`;
                        });
                    }, 100);
                }

                stopVisualizer() {
                    if (this.visualizerInterval) {
                        clearInterval(this.visualizerInterval);
                        this.visualizerInterval = null;
                    }
                }

                removeMusicControls() {
                    if (this.controlsElement) {
                        this.controlsElement.remove();
                        this.controlsElement = null;
                    }
                }

                addStyles() {
                    const styles = `
                        .wifiskeleton-controls {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            width: 300px;
                            background: linear-gradient(135deg, rgba(5, 5, 5, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
                            border: 2px solid #ff4444;
                            font-family: 'VT323', monospace;
                            color: #ffffff;
                            z-index: 10000;
                            backdrop-filter: blur(10px);
                            box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
                        }

                        .wifiskeleton-controls.minimized .wifiskeleton-content {
                            display: none;
                        }

                        .wifiskeleton-header {
                            background: linear-gradient(90deg, #ff4444, #cc3333);
                            padding: 10px 12px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: move;
                        }

                        .wifiskeleton-title-container {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }

                        .wifiskeleton-status {
                            font-size: 12px;
                            font-weight: bold;
                        }

                        .wifiskeleton-status.connected {
                            color: #00ff00;
                            text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
                        }

                        .wifiskeleton-status.error {
                            color: #ffff00;
                            text-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
                        }

                        .wifiskeleton-status.disconnected {
                            color: #ff0000;
                            text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
                        }

                        .wifiskeleton-title {
                            font-size: 16px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                        }

                        .wifiskeleton-minimize {
                            background: none;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            color: white;
                            width: 24px;
                            height: 24px;
                            cursor: pointer;
                            font-family: monospace;
                            font-size: 16px;
                        }

                        .wifiskeleton-minimize:hover {
                            background: rgba(255, 255, 255, 0.2);
                        }

                        .wifiskeleton-content {
                            padding: 15px;
                        }

                        .wifiskeleton-track-info {
                            margin-bottom: 15px;
                            text-align: center;
                        }

                        .wifiskeleton-track-name {
                            font-size: 18px;
                            color: #ff4444;
                            margin-bottom: 8px;
                            text-shadow: 0 0 5px rgba(255, 68, 68, 0.5);
                        }

                        .wifiskeleton-track-duration {
                            font-size: 14px;
                            color: #cccccc;
                        }

                        .wifiskeleton-progress-container {
                            margin-bottom: 15px;
                        }

                        .wifiskeleton-progress-bar {
                            height: 6px;
                            background: rgba(255, 68, 68, 0.2);
                            cursor: pointer;
                            position: relative;
                        }

                        .wifiskeleton-progress-fill {
                            height: 100%;
                            background: linear-gradient(90deg, #ff4444, #ff6666);
                            width: 0%;
                            transition: width 0.1s ease;
                        }

                        .wifiskeleton-controls-row {
                            display: flex;
                            justify-content: center;
                            gap: 12px;
                            margin-bottom: 15px;
                        }

                        .wifiskeleton-btn {
                            background: linear-gradient(135deg, rgba(255, 68, 68, 0.8), rgba(204, 51, 51, 0.8));
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            color: white;
                            width: 40px;
                            height: 40px;
                            cursor: pointer;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        }

                        .wifiskeleton-btn:hover {
                            background: linear-gradient(135deg, #ff6666, #ff4444);
                            transform: scale(1.1);
                            box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
                        }

                        .wifiskeleton-btn.active {
                            background: linear-gradient(135deg, #ff6666, #ff4444);
                            box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
                        }

                        .wifiskeleton-volume-row {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin-bottom: 15px;
                        }

                        .wifiskeleton-volume-label {
                            font-size: 14px;
                            color: #ff4444;
                            min-width: 40px;
                        }

                        .wifiskeleton-volume {
                            flex: 1;
                            height: 8px;
                            background: rgba(255, 68, 68, 0.2);
                            outline: none;
                            border: none;
                            -webkit-appearance: none;
                            cursor: pointer;
                        }

                        .wifiskeleton-volume::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 16px;
                            height: 16px;
                            background: #ff4444;
                            cursor: pointer;
                            border-radius: 0;
                            box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
                        }

                        .wifiskeleton-volume-value {
                            font-size: 14px;
                            color: #cccccc;
                            min-width: 45px;
                            text-align: right;
                        }

                        .wifiskeleton-debug-row {
                            margin-bottom: 15px;
                            padding: 10px;
                            background: rgba(255, 68, 68, 0.1);
                            border-left: 3px solid #ff4444;
                        }

                        .wifiskeleton-debug-info {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 12px;
                        }

                        .wifiskeleton-test-btn {
                            background: rgba(255, 68, 68, 0.3);
                            border: 1px solid #ff4444;
                            color: white;
                            padding: 4px 8px;
                            cursor: pointer;
                            font-size: 11px;
                        }

                        .wifiskeleton-test-btn:hover {
                            background: rgba(255, 68, 68, 0.5);
                        }

                        .wifiskeleton-loading {
                            color: #ffff00;
                            animation: pulse 1s infinite;
                        }

                        .wifiskeleton-visualizer {
                            display: flex;
                            justify-content: center;
                            align-items: flex-end;
                            gap: 4px;
                            height: 30px;
                        }

                        .wifiskeleton-visualizer .bar {
                            width: 5px;
                            background: linear-gradient(to top, #ff4444, #ff6666);
                            transition: height 0.1s ease;
                            height: 5px;
                        }

                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    `;

                    BdApi.injectCSS("WiFiSkeletonMusic", styles);
                }

                removeStyles() {
                    BdApi.clearCSS("WiFiSkeletonMusic");
                }

                getSettingsPanel() {
                    const panel = document.createElement("div");
                    panel.innerHTML = `
                        <div style="padding: 20px; font-family: 'VT323', monospace; color: #ff4444;">
                            <h2>◆ WIFI SKELETON MUSIC SETTINGS ◆</h2>
                            <br>
                            <label>
                                <input type="checkbox" id="autoplay" ${this.settings.autoplay ? 'checked' : ''}> 
                                Auto-play on startup
                            </label>
                            <br><br>
                            <label>
                                <input type="checkbox" id="visualizer" ${this.settings.visualizer ? 'checked' : ''}> 
                                Show visualizer
                            </label>
                            <br><br>
                            <label>
                                <input type="checkbox" id="debug" ${this.settings.debug ? 'checked' : ''}> 
                                Show debug info
                            </label>
                            <br><br>
                            <p style="color: #cccccc; font-size: 12px;">
                                🔧 TROUBLESHOOTING:<br>
                                • If play button doesn't work, try clicking it twice<br>
                                • Check the connection status indicator (● = good, ⚠ = error)<br>
                                • Use "Test Connection" button to check if files are accessible<br>
                                • Make sure your internet connection is stable
                            </p>
                        </div>
                    `;

                    panel.querySelector('#autoplay').addEventListener('change', (e) => {
                        this.settings.autoplay = e.target.checked;
                        this.saveSettings();
                    });

                    panel.querySelector('#visualizer').addEventListener('change', (e) => {
                        this.settings.visualizer = e.target.checked;
                        this.saveSettings();
                        this.recreateControls();
                    });

                    panel.querySelector('#debug').addEventListener('change', (e) => {
                        this.settings.debug = e.target.checked;
                        this.saveSettings();
                        this.recreateControls();
                    });

                    return panel;
                }

                recreateControls() {
                    const wasPlaying = this.isPlaying;
                    const currentTime = this.audio ? this.audio.currentTime : 0;
                    
                    this.removeMusicControls();
                    this.createMusicControls();
                    
                    if (wasPlaying) {
                        this.playMusic();
                        if (this.audio) {
                            this.audio.currentTime = currentTime;
                        }
                    }
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
