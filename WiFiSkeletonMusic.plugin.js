/**
 * @name WiFiSkeletonMusic
 * @author iloveandmissmygf
 * @description Enhanced WiFiSkeleton background music player with advanced visualizer
 * @version 1.1.0
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
            version: "1.1.0",
            description: "Enhanced WiFiSkeleton background music player with advanced visualizer",
            github: "https://github.com/justanewplayer19/WiFiSkeletonMusic",
            github_raw: "https://raw.githubusercontent.com/justanewplayer19/WiFiSkeletonMusic/main/WiFiSkeletonMusic.plugin.js"
        },
        changelog: [
            {
                title: "Enhanced Version",
                items: [
                    "Advanced visualizer effects",
                    "Improved UI with glitch effects",
                    "Better animation effects",
                    "Track progress bar",
                    "Improved styling to match WiFiSkeleton aesthetic"
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

            // WiFiSkeleton playlist - using the user's actual tracks
            const PLAYLIST = [
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
                    name: "2008",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/2008.mp4",
                    duration: "1:08"
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
                    name: "im a monster in real life",
                    url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/birthday.mp3",
                    duration: "1:19"
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
                    this.settings = {
                        autoplay: false,
                        volume: 30,
                        shuffle: false,
                        visualizer: true,
                        glitchEffects: true,
                        advancedVisualizer: true
                    };
                }

                onStart() {
                    Logger.info("WiFiSkeleton Music Plugin started!");
                    this.loadSettings();
                    this.createAudioPlayer();
                    this.createMusicControls();
                    this.addStyles();
                    this.addFonts();
                    
                    if (this.settings.autoplay) {
                        // Delay autoplay to respect browser policies
                        setTimeout(() => this.playMusic(), 2000);
                    }
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

                createAudioPlayer() {
                    this.audio = new Audio();
                    this.audio.volume = this.volume;
                    this.audio.loop = false;
                    this.audio.crossOrigin = "anonymous";
                    
                    this.audio.addEventListener('ended', () => {
                        this.nextTrack();
                    });

                    this.audio.addEventListener('error', (e) => {
                        Logger.error("Audio error:", e);
                        BdApi.showToast("Failed to load audio track", { type: "error" });
                    });
                }

                createMusicControls() {
                    const controlsHTML = `
                        <div id="wifiskeleton-music-controls" class="wifiskeleton-controls ${this.settings.glitchEffects ? 'glitch-enabled' : ''}">
                            <div class="wifiskeleton-header">
                                <div class="wifiskeleton-title-container">
                                    <span class="wifiskeleton-title">◆ WIFI SKELETON ◆</span>
                                    ${this.settings.glitchEffects ? '<span class="wifiskeleton-title-glitch">◆ WIFI SKELETON ◆</span>' : ''}
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
                                ${this.settings.visualizer ? this.createVisualizer() : ''}
                            </div>
                        </div>
                    `;

                    document.body.insertAdjacentHTML('beforeend', controlsHTML);
                    this.controlsElement = document.getElementById('wifiskeleton-music-controls');
                    this.attachControlEvents();
                }

                createVisualizer() {
                    if (this.settings.advancedVisualizer) {
                        return `
                            <div class="wifiskeleton-visualizer advanced">
                                <div class="bar-container">
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                    <div class="bar"></div>
                                </div>
                                <div class="wifiskeleton-visualizer-glitch"></div>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="wifiskeleton-visualizer">
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                            </div>
                        `;
                    }
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

                togglePlayPause() {
                    if (this.isPlaying) {
                        this.pauseMusic();
                    } else {
                        this.playMusic();
                    }
                }

                playMusic() {
                    if (!this.audio.src || this.audio.src !== PLAYLIST[this.currentTrack].url) {
                        this.audio.src = PLAYLIST[this.currentTrack].url;
                    }
                    
                    this.audio.play().then(() => {
                        this.isPlaying = true;
                        this.updatePlayButton();
                        this.startVisualizer();
                        this.startProgressUpdate();
                        this.triggerGlitchEffect();
                        BdApi.showToast(`Now playing: ${PLAYLIST[this.currentTrack].name}`, { type: "info" });
                    }).catch(error => {
                        Logger.error("Playback failed:", error);
                        BdApi.showToast("Click the play button to start music (browser policy)", { type: "warning" });
                    });
                }

                pauseMusic() {
                    this.audio.pause();
                    this.isPlaying = false;
                    this.updatePlayButton();
                    this.stopVisualizer();
                    this.stopProgressUpdate();
                }

                stopMusic() {
                    if (this.audio) {
                        this.audio.pause();
                        this.audio.currentTime = 0;
                        this.isPlaying = false;
                        this.stopVisualizer();
                        this.stopProgressUpdate();
                    }
                }

                nextTrack() {
                    if (this.settings.shuffle) {
                        this.currentTrack = Math.floor(Math.random() * PLAYLIST.length);
                    } else {
                        this.currentTrack = (this.currentTrack + 1) % PLAYLIST.length;
                    }
                    this.updateTrackInfo();
                    this.triggerGlitchEffect();
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
                    this.triggerGlitchEffect();
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
                            // More dynamic height variation for advanced visualizer
                            const height = this.settings.advancedVisualizer ? 
                                Math.random() * 25 + (this.audio.volume * 20) : 
                                Math.random() * 20 + 5;
                                
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

                triggerGlitchEffect() {
                    if (!this.settings.glitchEffects || !this.controlsElement) return;
                    
                    this.controlsElement.classList.add('glitch-trigger');
                    setTimeout(() => {
                        this.controlsElement.classList.remove('glitch-trigger');
                    }, 500);
                }

                removeMusicControls() {
                    if (this.controlsElement) {
                        this.controlsElement.remove();
                        this.controlsElement = null;
                    }
                }

                addFonts() {
                    const fontLink = document.createElement('link');
                    fontLink.rel = 'stylesheet';
                    fontLink.href = 'https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap';
                    document.head.appendChild(fontLink);
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
                            font-family: 'VT323', 'Share Tech Mono', monospace;
                            color: #ffffff;
                            z-index: 10000;
                            backdrop-filter: blur(10px);
                            box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
                            transition: all 0.3s ease;
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
                            position: relative;
                            overflow: hidden;
                        }

                        .wifiskeleton-title-container {
                            position: relative;
                        }

                        .wifiskeleton-title {
                            font-size: 16px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                        }

                        .wifiskeleton-title-glitch {
                            position: absolute;
                            top: 0;
                            left: 0;
                            font-size: 16px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            color: #0ff;
                            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                            clip: rect(0, 900px, 0, 0);
                            opacity: 0.8;
                        }

                        .wifiskeleton-controls.glitch-enabled .wifiskeleton-title-glitch {
                            animation: glitch 3s infinite;
                        }

                        .wifiskeleton-controls.glitch-trigger .wifiskeleton-title-glitch {
                            animation: glitch 0.5s steps(2) infinite;
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
                            transition: all 0.2s ease;
                        }

                        .wifiskeleton-minimize:hover {
                            background: rgba(255, 255, 255, 0.2);
                            transform: scale(1.1);
                        }

                        .wifiskeleton-content {
                            padding: 15px;
                            position: relative;
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
                            font-family: 'VT323', monospace;
                            letter-spacing: 1px;
                        }

                        .wifiskeleton-track-duration {
                            font-size: 14px;
                            color: #cccccc;
                            font-family: 'Share Tech Mono', monospace;
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
                            position: relative;
                        }

                        .wifiskeleton-progress-fill::after {
                            content: '';
                            position: absolute;
                            right: -4px;
                            top: -4px;
                            width: 12px;
                            height: 12px;
                            background: #ff4444;
                            border: 2px solid #ffffff;
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
                            opacity: 0;
                            transition: opacity 0.2s ease;
                        }

                        .wifiskeleton-progress-bar:hover .wifiskeleton-progress-fill::after {
                            opacity: 1;
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
                            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            position: relative;
                            overflow: hidden;
                        }

                        .wifiskeleton-btn::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                            transition: left 0.5s;
                        }

                        .wifiskeleton-btn:hover::before {
                            left: 100%;
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
                            font-family: 'Share Tech Mono', monospace;
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
                            border: 2px solid rgba(255, 255, 255, 0.5);
                        }

                        .wifiskeleton-volume-value {
                            font-size: 14px;
                            color: #cccccc;
                            min-width: 45px;
                            text-align: right;
                            font-family: 'Share Tech Mono', monospace;
                        }

                        .wifiskeleton-visualizer {
                            display: flex;
                            justify-content: center;
                            align-items: flex-end;
                            gap: 4px;
                            height: 30px;
                            position: relative;
                        }

                        .wifiskeleton-visualizer .bar {
                            width: 5px;
                            background: linear-gradient(to top, #ff4444, #ff6666);
                            transition: height 0.1s ease;
                            height: 5px;
                        }

                        .wifiskeleton-visualizer.advanced {
                            height: 40px;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 68, 68, 0.3);
                            padding: 5px;
                            position: relative;
                            overflow: hidden;
                        }

                        .wifiskeleton-visualizer.advanced .bar-container {
                            display: flex;
                            justify-content: center;
                            align-items: flex-end;
                            gap: 4px;
                            height: 100%;
                            width: 100%;
                            position: relative;
                            z-index: 2;
                        }

                        .wifiskeleton-visualizer.advanced .bar {
                            width: 6px;
                            background: linear-gradient(to top, #ff4444, #ff6666);
                            box-shadow: 0 0 8px rgba(255, 68, 68, 0.5);
                        }

                        .wifiskeleton-visualizer-glitch {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(transparent 50%, rgba(255, 68, 68, 0.1) 50%);
                            background-size: 100% 4px;
                            z-index: 1;
                            pointer-events: none;
                            animation: scanlines 0.05s linear infinite;
                        }

                        /* Glitch animations */
                        @keyframes glitch {
                            0% {
                                clip: rect(31px, 9999px, 94px, 0);
                                transform: skew(0.5deg);
                            }
                            5% {
                                clip: rect(70px, 9999px, 46px, 0);
                                transform: skew(0.8deg);
                            }
                            10% {
                                clip: rect(13px, 9999px, 76px, 0);
                                transform: skew(0.3deg);
                            }
                            15% {
                                clip: rect(89px, 9999px, 25px, 0);
                                transform: skew(0.1deg);
                            }
                            20% {
                                clip: rect(45px, 9999px, 64px, 0);
                                transform: skew(0.6deg);
                            }
                            25% {
                                clip: rect(5px, 9999px, 87px, 0);
                                transform: skew(0.4deg);
                            }
                            30% {
                                clip: rect(82px, 9999px, 31px, 0);
                                transform: skew(0.2deg);
                            }
                            35% {
                                clip: rect(28px, 9999px, 95px, 0);
                                transform: skew(0.7deg);
                            }
                            40% {
                                clip: rect(66px, 9999px, 42px, 0);
                                transform: skew(0.9deg);
                            }
                            45% {
                                clip: rect(10px, 9999px, 87px, 0);
                                transform: skew(0.3deg);
                            }
                            50% {
                                clip: rect(52px, 9999px, 35px, 0);
                                transform: skew(0.5deg);
                            }
                            55% {
                                clip: rect(19px, 9999px, 92px, 0);
                                transform: skew(0.8deg);
                            }
                            60% {
                                clip: rect(34px, 9999px, 23px, 0);
                                transform: skew(0.2deg);
                            }
                            65% {
                                clip: rect(75px, 9999px, 54px, 0);
                                transform: skew(0.6deg);
                            }
                            70% {
                                clip: rect(57px, 9999px, 81px, 0);
                                transform: skew(0.1deg);
                            }
                            75% {
                                clip: rect(40px, 9999px, 17px, 0);
                                transform: skew(0.4deg);
                            }
                            80% {
                                clip: rect(26px, 9999px, 68px, 0);
                                transform: skew(0.7deg);
                            }
                            85% {
                                clip: rect(48px, 9999px, 93px, 0);
                                transform: skew(0.9deg);
                            }
                            90% {
                                clip: rect(54px, 9999px, 30px, 0);
                                transform: skew(0.3deg);
                            }
                            95% {
                                clip: rect(62px, 9999px, 79px, 0);
                                transform: skew(0.5deg);
                            }
                            100% {
                                clip: rect(39px, 9999px, 41px, 0);
                                transform: skew(0.1deg);
                            }
                        }

                        @keyframes scanlines {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(4px); }
                        }

                        /* Glitch trigger effect */
                        .wifiskeleton-controls.glitch-trigger {
                            transform: translate(2px, 0);
                            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                        }

                        @keyframes shake {
                            0%, 100% { transform: translate(0, 0); }
                            10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 0); }
                            20%, 40%, 60%, 80% { transform: translate(2px, 0); }
                        }

                        /* Add a subtle VHS effect to the entire player */
                        .wifiskeleton-controls::after {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(rgba(255, 0, 0, 0.03), rgba(0, 255, 255, 0.03));
                            pointer-events: none;
                            z-index: 9999;
                            opacity: 0.3;
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
                        <div style="padding: 20px; font-family: 'VT323', monospace; color: #ff4444; background: rgba(10, 10, 10, 0.9);">
                            <h2 style="text-align: center; margin-bottom: 20px; text-shadow: 0 0 5px rgba(255, 68, 68, 0.5);">◆ WIFI SKELETON MUSIC SETTINGS ◆</h2>
                            
                            <div style="background: rgba(255, 68, 68, 0.1); padding: 15px; margin-bottom: 20px; border-left: 3px solid #ff4444;">
                                <label style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <input type="checkbox" id="autoplay" ${this.settings.autoplay ? 'checked' : ''}> 
                                    <span style="margin-left: 10px;">Auto-play on startup</span>
                                </label>
                                
                                <label style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <input type="checkbox" id="visualizer" ${this.settings.visualizer ? 'checked' : ''}> 
                                    <span style="margin-left: 10px;">Show visualizer</span>
                                </label>
                                
                                <label style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <input type="checkbox" id="advancedVisualizer" ${this.settings.advancedVisualizer ? 'checked' : ''}> 
                                    <span style="margin-left: 10px;">Use advanced visualizer</span>
                                </label>
                                
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" id="glitchEffects" ${this.settings.glitchEffects ? 'checked' : ''}> 
                                    <span style="margin-left: 10px;">Enable glitch effects</span>
                                </label>
                            </div>
                            
                            <p style="color: #cccccc; font-size: 14px; line-height: 1.5; text-align: center;">
                                Note: Due to browser policies, music may require user interaction to start.
                                <br>Your WiFiSkeleton tracks are loaded from your GitHub repository.
                            </p>
                        </div>
                    `;

                    // Autoplay setting
                    panel.querySelector('#autoplay').addEventListener('change', (e) => {
                        this.settings.autoplay = e.target.checked;
                        this.saveSettings();
                    });

                    // Visualizer setting
                    panel.querySelector('#visualizer').addEventListener('change', (e) => {
                        this.settings.visualizer = e.target.checked;
                        this.saveSettings();
                        this.recreateControls();
                    });

                    // Advanced visualizer setting
                    panel.querySelector('#advancedVisualizer').addEventListener('change', (e) => {
                        this.settings.advancedVisualizer = e.target.checked;
                        this.saveSettings();
                        if (this.settings.visualizer) {
                            this.recreateControls();
                        }
                    });

                    // Glitch effects setting
                    panel.querySelector('#glitchEffects').addEventListener('change', (e) => {
                        this.settings.glitchEffects = e.target.checked;
                        this.saveSettings();
                        if (this.controlsElement) {
                            this.controlsElement.classList.toggle('glitch-enabled', this.settings.glitchEffects);
                        }
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
