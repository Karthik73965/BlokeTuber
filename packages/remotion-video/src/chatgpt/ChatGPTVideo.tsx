import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import {
  HamburgerIcon,
  NewChatIcon,
  MoreDotsIcon,
  PlusIcon,
  MicIcon,
  SendArrowIcon,
  WaveformIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  SpeakerIcon,
  ShareIcon,
} from './Icons';
import { ChatMessage, ChatGPTVideoProps } from './types';
import {
  SEND_POP_SFX,
  SHOCK_BOOM_SFX,
  MSG_CHIME_SFX,
  TYPING_LOOP_SFX,
  COMEDY_BGM_SFX,
  GLITCH_SFX,
  CINE_IMPACT_SFX,
} from './sfx';

export const ChatGPTVideo: React.FC<ChatGPTVideoProps> = ({
  messages,
  title = "ChatGPT Video",
  enableBgm = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find if user is currently typing
  let currentInputText = '';
  let isTyping = false;

  for (const msg of messages) {
    if (msg.sender === 'user' && frame >= msg.startFrame && frame < msg.sendFrame) {
      isTyping = true;
      const progress = interpolate(
        frame,
        [msg.startFrame, msg.sendFrame - 2],
        [0, msg.text.length],
        { extrapolateRight: 'clamp' }
      );
      currentInputText = msg.text.slice(0, Math.floor(progress));
      break;
    }
  }

  // Dramatic Slow Zoom-in on Furious / Shock Text
  let cameraScale = 1;
  let cameraTranslateX = 0;
  let cameraTranslateY = 0;

  for (const msg of messages) {
    if (msg.isShock && frame >= msg.sendFrame && frame < msg.sendFrame + 75) {
      const elapsed = frame - msg.sendFrame;
      
      // Dramatic slow cinematic zoom-in over 60 frames (2 seconds)
      const zoomProgress = interpolate(elapsed, [0, 45, 75], [0, 1, 0.95], { extrapolateRight: 'clamp' });
      cameraScale = 1 + 0.28 * zoomProgress;
      
      // Zoom focus centered directly on ChatGPT's text (left-center of screen)
      cameraTranslateX = 60 * zoomProgress;
      cameraTranslateY = -20 * zoomProgress;

      // Subtle tension shake at the peak
      if (elapsed > 8 && elapsed < 32) {
        const shakeIntensity = interpolate(elapsed, [8, 18, 32], [0, 1, 0], { extrapolateRight: 'clamp' });
        cameraTranslateX += Math.sin(elapsed * 5.5) * 7 * shakeIntensity;
        cameraTranslateY += Math.cos(elapsed * 6.2) * 5 * shakeIntensity;
      }
      break;
    }
  }

  // Determine delivered messages in the feed
  const deliveredMessages = messages.filter((m) => frame >= m.sendFrame);
  // Display latest 3 messages centered
  const recentMessages = deliveredMessages.slice(-3);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        transform: `scale(${cameraScale}) translate(${cameraTranslateX}px, ${cameraTranslateY}px)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Background Comedy Music */}
      {enableBgm && (
        <Audio src={COMEDY_BGM_SFX} volume={0.16} loop />
      )}

      {/* Audio SFX Sequences */}
      {messages.map((msg) => {
        const typingDuration = Math.max(1, msg.sendFrame - msg.startFrame);
        const isGlitchMsg = msg.text.includes('[SYSTEM') || msg.text.includes('403 FORBIDDEN');

        return (
          <React.Fragment key={msg.id}>
            {/* User Real Mechanical Keyboard Typing SFX */}
            {msg.sender === 'user' && (
              <Sequence from={msg.startFrame} durationInFrames={typingDuration}>
                <Audio src={TYPING_LOOP_SFX} volume={0.85} />
              </Sequence>
            )}

            {/* Message Sent / Bubble Deliver Pop */}
            {msg.sender === 'user' && (
              <Sequence from={msg.sendFrame} durationInFrames={18}>
                <Audio src={SEND_POP_SFX} volume={1.0} />
              </Sequence>
            )}

            {/* ChatGPT Reply SFX (Loud Vine Boom + Impact or Chime) */}
            {msg.sender === 'chatgpt' && (
              <Sequence from={msg.sendFrame} durationInFrames={msg.isShock ? 75 : 30}>
                {isGlitchMsg ? (
                  <Audio src={GLITCH_SFX} volume={1.3} />
                ) : msg.isShock ? (
                  <>
                    <Audio src={SHOCK_BOOM_SFX} volume={1.5} />
                    <Audio src={CINE_IMPACT_SFX} volume={1.0} />
                  </>
                ) : (
                  <Audio src={MSG_CHIME_SFX} volume={1.0} />
                )}
              </Sequence>
            )}
          </React.Fragment>
        );
      })}

      {/* TOP BAR (EXACT MATCH TO UI.png) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 110,
          padding: '24px 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
        }}
      >
        {/* Left: Circular Hamburger Menu Button */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#212121',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HamburgerIcon size={30} />
        </div>

        {/* Center: "ChatGPT ˅" Dropdown Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 28,
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <span>ChatGPT</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Right: Two Distinct Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* New Chat Button */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#212121',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NewChatIcon size={26} />
          </div>

          {/* Three Dots Menu Button */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#212121',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreDotsIcon size={26} color="#FFFFFF" />
          </div>
        </div>
      </div>

      {/* MAIN CHAT FEED */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          bottom: 170,
          left: 100,
          right: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        {recentMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          // Punchy spring pop-in for the bubble
          const age = frame - msg.sendFrame;
          const springScale = spring({
            frame: Math.max(0, age),
            fps,
            config: { damping: 14, stiffness: 180 },
          });

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
                transform: `scale(${Math.min(1, springScale)})`,
                transformOrigin: isUser ? 'bottom right' : 'bottom left',
              }}
            >
              {isUser ? (
                /* User Bubble - Exact match to UI.png */
                <div
                  style={{
                    maxWidth: '75%',
                    backgroundColor: '#2F2F2F',
                    color: '#FFFFFF',
                    borderRadius: 36,
                    padding: '20px 36px',
                    fontSize: 38,
                    lineHeight: 1.45,
                    fontWeight: 400,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                /* ChatGPT Reply - Pure White Text, NO RED GLOW */
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '8px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      color: '#FFFFFF',
                      fontSize: msg.isShock ? 50 : 42,
                      fontWeight: msg.isShock ? 800 : 400,
                      lineHeight: 1.35,
                      letterSpacing: msg.isShock ? '0.5px' : 'normal',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Action Bar (Copy, Thumbs Up, Thumbs Down, Share, Speaker, More) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 28,
                      marginTop: 22,
                      paddingLeft: 4,
                    }}
                  >
                    <CopyIcon size={26} color="#8E8E93" />
                    <ThumbsUpIcon size={26} color="#8E8E93" />
                    <ThumbsDownIcon size={26} color="#8E8E93" />
                    <ShareIcon size={26} color="#8E8E93" />
                    <SpeakerIcon size={26} color="#8E8E93" />
                    <span style={{ color: '#8E8E93', fontSize: 24, letterSpacing: '2px', lineHeight: 1 }}>...</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM INPUT CONTAINER (EXACT MATCH TO UI.png) */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 60px',
          gap: 20,
          zIndex: 100,
        }}
      >
        {/* Standalone Plus Button Circle */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: '#212121',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <PlusIcon size={32} color="#FFFFFF" />
        </div>

        {/* Text Input Pill */}
        <div
          style={{
            flex: 1,
            height: 76,
            borderRadius: 38,
            backgroundColor: '#212121',
            padding: '0 12px 0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Text Input area with cursor */}
          <div
            style={{
              flex: 1,
              fontSize: 32,
              color: currentInputText ? '#FFFFFF' : '#8E8E93',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {currentInputText || 'Message ChatGPT'}
            {isTyping && (
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 32,
                  backgroundColor: '#FFFFFF',
                  marginLeft: 6,
                  opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* Send Button: White circle with Black arrow */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isTyping ? '#FFFFFF' : '#2F2F32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            <SendArrowIcon size={26} color={isTyping ? '#000000' : '#8E8E93'} />
          </div>
        </div>
      </div>
    </div>
  );
};
