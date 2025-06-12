// Revenge Mobile Plugin for WiFiSkeleton Music
// Note: This is a simplified version for mobile compatibility

const { React, ReactNative } = require("react-native");
const { findByProps } = require("@vendetta/metro");
const { showToast } = findByProps("showToast");
const { plugin } = require("@vendetta/plugin");

// WiFiSkeleton Playlist
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
        name: "stupid",
        url: "https://github.com/Justanewplayer19/WiFiSkeletonMusic/raw/refs/heads/main/stupid.mp3",
        duration: "1:20"
    }
];

let currentTrack = 0;
let isPlaying = false;
let audio = null;

// Create Audio Player
function createAudioPlayer() {
    if (audio) {
        audio.pause();
        audio = null;
    }
    
    // Use React Native's Audio API
    audio = new Audio();
    audio.addEventListener('ended', () => {
        nextTrack();
    });
}

// Play Music
async function playMusic() {
    try {
        if (!audio) createAudioPlayer();
        
        const track = PLAYLIST[currentTrack];
        audio.src = track.url;
        
        await audio.play();
        isPlaying = true;
        
        showToast(`🎵 Now playing: ${track.name}`, "success");
    } catch (error) {
        showToast(`❌ Failed to play: ${error.message}`, "error");
    }
}

// Pause Music
function pauseMusic() {
    if (audio) {
        audio.pause();
        isPlaying = false;
    }
}

// Next Track
function nextTrack() {
    currentTrack = (currentTrack + 1) % PLAYLIST.length;
    if (isPlaying) {
        playMusic();
    }
}

// Previous Track  
function previousTrack() {
    currentTrack = currentTrack === 0 ? PLAYLIST.length - 1 : currentTrack - 1;
    if (isPlaying) {
        playMusic();
    }
}

// Plugin Export
module.exports = {
    onLoad: () => {
        createAudioPlayer();
        showToast("🔥 WiFiSkeleton Music loaded!", "info");
    },
    
    onUnload: () => {
        if (audio) {
            audio.pause();
            audio = null;
        }
        showToast("WiFiSkeleton Music unloaded", "info");
    },
    
    // Add commands for mobile
    commands: [
        {
            name: "play",
            description: "Play WiFiSkeleton music",
            execute: () => {
                if (isPlaying) {
                    pauseMusic();
                } else {
                    playMusic();
                }
            }
        },
        {
            name: "next",
            description: "Next track",
            execute: nextTrack
        },
        {
            name: "prev", 
            description: "Previous track",
            execute: previousTrack
        },
        {
            name: "playlist",
            description: "Show current playlist",
            execute: () => {
                const trackList = PLAYLIST.map((track, i) => 
                    `${i === currentTrack ? '▶️' : '⏸️'} ${track.name}`
                ).join('\n');
                showToast(`🎵 WiFiSkeleton Playlist:\n${trackList}`, "info");
            }
        }
    ]
};
