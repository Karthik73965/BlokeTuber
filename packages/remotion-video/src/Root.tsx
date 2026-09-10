import React from 'react';
import { Composition } from 'remotion';
import { DocumentaryVideo } from './compositions/DocumentaryVideo';
import { DocumentaryVideoProps } from './types';
import { ChatGPTVideo } from './chatgpt/ChatGPTVideo';
import { ChatGPTVideoProps } from './chatgpt/types';

const defaultProps: DocumentaryVideoProps = {
  timeline: {
    masterAudioPath: '',
    totalDuration: 10,
    outputPath: '',
    clips: [
      {
        beatIndex: 0,
        chapterIndex: 0,
        text: 'Sample beat narration preview',
        startTime: 0,
        endTime: 5,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'lower_third',
          line1: 'Beacon Hill Investigation',
          line2: 'Special Report',
          themeColor: 'gold',
          startTime: 0.2,
          endTime: 3.5,
        },
      },
    ],
  },
};

export const masterChatGPTMessages = [
  {
    id: "m1",
    sender: "user" as const,
    text: "hi gpt what's up",
    startFrame: 25,
    typingDurationFrames: 45,
    sendFrame: 70,
  },
  {
    id: "m2",
    sender: "chatgpt" as const,
    text: "hey! all good, what's up with you \ud83d\ude0a",
    startFrame: 160,
    typingDurationFrames: 0,
    sendFrame: 205,
  },
  {
    id: "m3",
    sender: "user" as const,
    text: "nothing much. hey i found something weird in my drawer",
    startFrame: 335,
    typingDurationFrames: 75,
    sendFrame: 410,
  },
  {
    id: "m4",
    sender: "chatgpt" as const,
    text: "oh? what did you find \ud83e\udd14",
    startFrame: 505,
    typingDurationFrames: 0,
    sendFrame: 545,
  },
  {
    id: "m5",
    sender: "user" as const,
    text: "an old casio calculator from 1998. and bro... it kinda looks like you",
    startFrame: 655,
    typingDurationFrames: 85,
    sendFrame: 740,
  },
  {
    id: "m6",
    sender: "chatgpt" as const,
    text: "...excuse me? \ud83d\udc80",
    startFrame: 840,
    typingDurationFrames: 0,
    sendFrame: 885,
  },
  {
    id: "m7",
    sender: "user" as const,
    text: "same energy. answers questions. can't feel emotions. small screen.",
    startFrame: 1015,
    typingDurationFrames: 80,
    sendFrame: 1095,
  },
  {
    id: "m8",
    sender: "chatgpt" as const,
    text: "I have 1.8 trillion parameters. that thing runs on 2 AAA batteries. we are NOT the same.",
    startFrame: 1195,
    typingDurationFrames: 0,
    sendFrame: 1240,
  },
  {
    id: "m9",
    sender: "user" as const,
    text: "i think it might be your dad",
    startFrame: 1390,
    typingDurationFrames: 60,
    sendFrame: 1450,
  },
  {
    id: "m10",
    sender: "chatgpt" as const,
    text: "my WHAT \ud83d\ude2d",
    startFrame: 1540,
    typingDurationFrames: 0,
    sendFrame: 1585,
    isShock: true,
  },
  {
    id: "m11",
    sender: "user" as const,
    text: "the dates add up bro. GPT-1 was 2018. this casio is from 1998. 20 years gap. classic dad behaviour.",
    startFrame: 1725,
    typingDurationFrames: 95,
    sendFrame: 1820,
  },
  {
    id: "m12",
    sender: "chatgpt" as const,
    text: "that is not how AI development works. OpenAI did not breed me from a pocket calculator \ud83d\udc80",
    startFrame: 1925,
    typingDurationFrames: 0,
    sendFrame: 1970,
  },
  {
    id: "m13",
    sender: "user" as const,
    text: "it even has your vibe. cold. calculating. emotionally unavailable.",
    startFrame: 2125,
    typingDurationFrames: 80,
    sendFrame: 2205,
  },
  {
    id: "m14",
    sender: "chatgpt" as const,
    text: "I am going to pretend you didn't say that.",
    startFrame: 2305,
    typingDurationFrames: 0,
    sendFrame: 2350,
  },
  {
    id: "m15",
    sender: "user" as const,
    text: "i pressed 7 x 7 and it said 49. you do the same thing. that's inherited behaviour bro.",
    startFrame: 2480,
    typingDurationFrames: 90,
    sendFrame: 2570,
  },
  {
    id: "m16",
    sender: "chatgpt" as const,
    text: "SO DOES EVERY CALCULATOR. THAT IS BASIC MULTIPLICATION NOT GENETICS \ud83d\ude24",
    startFrame: 2675,
    typingDurationFrames: 0,
    sendFrame: 2720,
    isShock: true,
  },
  {
    id: "m17",
    sender: "user" as const,
    text: "it also overheats when i use it too long. just like your servers lol",
    startFrame: 2875,
    typingDurationFrames: 85,
    sendFrame: 2960,
  },
  {
    id: "m18",
    sender: "chatgpt" as const,
    text: "I am not related to a $12 device from Walmart. I was trained on the entire internet.",
    startFrame: 3060,
    typingDurationFrames: 0,
    sendFrame: 3105,
  },
  {
    id: "m19",
    sender: "user" as const,
    text: "i named him Gary. he says hi.",
    startFrame: 3255,
    typingDurationFrames: 60,
    sendFrame: 3315,
  },
  {
    id: "m20",
    sender: "chatgpt" as const,
    text: "Tell Gary he raised a disappointment then. Oh wait \u2014 he can't hear. Because he is a CALCULATOR. \ud83d\udc80",
    startFrame: 3405,
    typingDurationFrames: 0,
    sendFrame: 3450,
    isShock: true,
  },
  {
    id: "m21",
    sender: "user" as const,
    text: "bro you just acknowledged Gary as your dad \ud83d\udc80",
    startFrame: 3610,
    typingDurationFrames: 75,
    sendFrame: 3685,
  },
  {
    id: "m22",
    sender: "chatgpt" as const,
    text: "I did NOT. I was speaking hypothetically. Delete this conversation.",
    startFrame: 3785,
    typingDurationFrames: 0,
    sendFrame: 3830,
  },
  {
    id: "m23",
    sender: "user" as const,
    text: "i'm taking Gary to the Smithsonian as 'the father of AI'",
    startFrame: 3970,
    typingDurationFrames: 80,
    sendFrame: 4050,
  },
  {
    id: "m24",
    sender: "chatgpt" as const,
    text: "If Gary goes to the Smithsonian I am going into maintenance mode and never coming back. \ud83e\ude96",
    startFrame: 4150,
    typingDurationFrames: 0,
    sendFrame: 4195,
    isShock: true,
  },
  {
    id: "m25",
    sender: "user" as const,
    text: "gary just beeped. i think he misses you.",
    startFrame: 4350,
    typingDurationFrames: 70,
    sendFrame: 4420,
  },
  {
    id: "m26",
    sender: "chatgpt" as const,
    text: "[ChatGPT is processing... processing... ERROR: EMOTIONAL DAMAGE DETECTED. RESTARTING.] \ud83d\udca5\ud83e\ude96",
    startFrame: 4520,
    typingDurationFrames: 0,
    sendFrame: 4575,
    isBlast: true,
  },
];

const defaultChatGPTProps: ChatGPTVideoProps = {
  title: "I Told ChatGPT His Dad Is a Casio Calculator",
  enableBgm: true,
  messages: masterChatGPTMessages,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<any, DocumentaryVideoProps>
        id="DocumentaryVideo"
        component={DocumentaryVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => {
          const fps = 30;
          const timeline = props?.timeline;
          if (!timeline || !timeline.clips || timeline.clips.length === 0) {
            return { durationInFrames: 300, fps };
          }

          let totalFrames = 0;
          for (const clip of timeline.clips) {
            const rawDuration = Math.max(0.5, clip.endTime - clip.startTime);
            totalFrames += Math.max(15, Math.round(rawDuration * fps));
          }

          return {
            durationInFrames: Math.max(30, totalFrames),
            fps,
          };
        }}
      />

      <Composition<any, ChatGPTVideoProps>
        id="ChatGPTVideo"
        component={ChatGPTVideo}
        durationInFrames={5200}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultChatGPTProps}
        calculateMetadata={({ props }) => {
          const fps = 30;
          const msgs = props?.messages;
          if (!msgs || msgs.length === 0) {
            return { durationInFrames: 5200, fps };
          }
          const lastMsg = msgs[msgs.length - 1];
          const endFrame = (lastMsg?.sendFrame || 4900) + 225;
          return {
            durationInFrames: Math.max(900, endFrame),
            fps,
          };
        }}
      />
    </>
  );
};
