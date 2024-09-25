import React, { useEffect, useRef } from 'react';
import Clappr from 'clappr';
import { ChromecastPlugin } from 'clappr-chromecast-plugin';
import LevelSelector from 'clappr-level-selector-plugin';

const LivePlayer = () => {
    const playerRef = useRef(null);
    const playerInstanceRef = useRef(null);

    useEffect(() => {
        const scripts = [
            'https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js',
            'https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/clappr-plugin.min.js',
            'https://cdn.jsdelivr.net/npm/clappr-responsive-container-plugin@1.0.0/dist/clappr-responsive-container-plugin.min.js',
        ];

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        });

        playerInstanceRef.current = new Clappr.Player({
            source: atob('https://live.mywaitserver.com/hls/test.m3u8'),
            parentId: playerRef.current,
            height: '100%',
            width: '100%',
            autoPlay: true,
            disableErrorScreen: true,
            mute: true,
            chromecast: {
                appId: '9DFB77C0',
                media: {
                    type: ChromecastPlugin.Movie,
                    title: 'player',
                    subtitle: 'player'
                }
            },
            events: {
                onError: (e) => {
                    setTimeout(() => {
                        playerInstanceRef.current.configure(playerInstanceRef.current.options);
                    }, 10000);
                }
            },
            plugins: [LevelSelector, ChromecastPlugin],
            levelSelectorConfig: {
                title: 'Quality',
                labels: {
                    2: 'High',
                    1: 'Med',
                    0: 'Low',
                },
                labelCallback: (playbackLevel, customLabel) => {
                    return `${customLabel} ${playbackLevel.level.height}p`;
                }
            },
            mediacontrol: {
                seekbar: '#5089de',
                buttons: '#6c757d'
            },
            mimeType: "application/x-mpegURL"
        });
        const resizePlayer = () => {
            const aspectRatio = 9/16;
            const newWidth = playerRef.current.offsetWidth;
            const newHeight = 2 * Math.round(newWidth * aspectRatio / 2);
            playerInstanceRef.current.resize({ width: newWidth, height: newHeight });
        };
        resizePlayer();
        window.addEventListener('resize', resizePlayer);

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizePlayer);
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="embed-responsive embed-responsive-16by9">
            <div ref={playerRef} className="embed-responsive-item"></div>
        </div>
    );
};

export default LivePlayer;