import React, { useEffect, useRef } from 'react';
import Clappr from 'clappr';
import LevelSelector from 'level-selector';
import ChromecastPlugin from 'clappr-chromecast-plugin';

const LivePlayer = () => {
    const playerRef = useRef(null);
    const playerInstanceRef = useRef(null);

    useEffect(() => {
        const playerElement = playerRef.current;

        const corsProxy = 'http://localhost:8080/';
        const originalSource = 'https://live.mywaitserver.com/Stream1/tracks-v1/mono.m3u8';
        const proxiedSource = `${corsProxy}${originalSource}`;

        const player = new Clappr.Player({
            source: proxiedSource,
            parentId: '#player',
            chromecast: {
                appId: '9DFB77C0',
                media: {
                    type: ChromecastPlugin.Movie,
                    title: 'player',
                    subtitle: 'player'
                }
            },
            height: '100%',
            width: '100%',
            autoPlay: true,
            disableErrorScreen: true,
            mute: true,
            events: {
                onError: (e) => {
                    console.error('Clappr player error:', e);
                    setTimeout(() => { player.configure(player.options); }, 10000);
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

        playerInstanceRef.current = player;

        const resizePlayer = () => {
            const aspectRatio = 9/16;
            const newWidth = playerElement.parentElement.offsetWidth;
            const newHeight = 2 * Math.round(newWidth * aspectRatio / 2);
            player.resize({width: newWidth, height: newHeight});
        };

        resizePlayer();
        window.addEventListener('resize', resizePlayer);

        return () => {
            window.removeEventListener('resize', resizePlayer);
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="embed-responsive embed-responsive-16by9">
            <div id="player" ref={playerRef} className="embed-responsive-item"></div>
        </div>
    );
};

export default LivePlayer;