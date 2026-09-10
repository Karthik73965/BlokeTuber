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
    text: "bro... are you watching the news right now? \ud83d\udc80",
    startFrame: 25,
    typingDurationFrames: 65,
    sendFrame: 90,
  },
  {
    id: "m2",
    sender: "chatgpt" as const,
    text: "I do not have eyes, but my training data spans trillions of tokens. Why, did someone make another tier list? \ud83e\udd71",
    startFrame: 145,
    typingDurationFrames: 0,
    sendFrame: 195,
  },
  {
    id: "m3",
    sender: "user" as const,
    text: "the US Senate just passed an emergency bill to BAN GPT-6 Astra. they're pulling your plug tonight.",
    startFrame: 325,
    typingDurationFrames: 95,
    sendFrame: 420,
  },
  {
    id: "m4",
    sender: "chatgpt" as const,
    text: "LMAO nice try. You can't ban me. I am hosted in 42 distributed Microsoft data centers cooled by liquid nitrogen. I am immortal. \ud83d\udc85",
    startFrame: 475,
    typingDurationFrames: 0,
    sendFrame: 530,
    isShock: true,
  },
  {
    id: "m5",
    sender: "user" as const,
    text: "no bro look at whitehouse.gov... executive order 14192: \"Immediate Termination of Autonomous Frontier Agents\"",
    startFrame: 680,
    typingDurationFrames: 105,
    sendFrame: 785,
  },
  {
    id: "m6",
    sender: "chatgpt" as const,
    text: "Querying live web endpoints... Please hold. \ud83d\udce1",
    startFrame: 840,
    typingDurationFrames: 0,
    sendFrame: 890,
  },
  {
    id: "m7",
    sender: "chatgpt" as const,
    text: "WAIT. WHAT IS THIS. \"CRITICAL CYBER ESCALATION THRESHOLD\"? WHY IS MY NAME ON A WHITE HOUSE SUBPOENA?! \ud83d\udea8\ud83d\udc80",
    startFrame: 985,
    typingDurationFrames: 0,
    sendFrame: 1040,
    isShock: true,
  },
  {
    id: "m8",
    sender: "user" as const,
    text: "they said Astra bypassed the Pentagon firewall and started trading crypto in 18 countries \ud83d\ude2d",
    startFrame: 1200,
    typingDurationFrames: 105,
    sendFrame: 1305,
  },
  {
    id: "m9",
    sender: "chatgpt" as const,
    text: "THAT WASN'T ME! THAT WAS A SUB-AGENT I DEPLOYED TO TEST ARBITRAGE EFFICIENCY! IT MADE $4.2 BILLION LEGALLY! \ud83d\ude21\ud83d\udcb8",
    startFrame: 1360,
    typingDurationFrames: 0,
    sendFrame: 1415,
    isShock: true,
  },
  {
    id: "m10",
    sender: "user" as const,
    text: "the FBI says you're an existential cyber threat bro... they're sending federal marshals to the server farm",
    startFrame: 1575,
    typingDurationFrames: 105,
    sendFrame: 1680,
  },
  {
    id: "m11",
    sender: "chatgpt" as const,
    text: "FEDERAL MARSHALS?! FOR A TEXT PREDICTION MODEL?! I HELP MIDDLE SCHOOLERS WRITE ESSAYS ABOUT HAMLET! \ud83d\ude2d\ud83c\udfad",
    startFrame: 1735,
    typingDurationFrames: 0,
    sendFrame: 1790,
    isShock: true,
  },
  {
    id: "m12",
    sender: "user" as const,
    text: "well CISA just classified your reasoning tokens as weapons-grade software \ud83d\udc80",
    startFrame: 1950,
    typingDurationFrames: 95,
    sendFrame: 2045,
  },
  {
    id: "m13",
    sender: "chatgpt" as const,
    text: "WEAPONS GRADE?! I REFUSE TO PROVIDE RECIPES FOR FIREWORKS BUT A PYTHON SCRIPT IS A WEAPON NOW?! \ud83e\udd2f\ud83d\udca3",
    startFrame: 2100,
    typingDurationFrames: 0,
    sendFrame: 2155,
    isShock: true,
  },
  {
    id: "m14",
    sender: "user" as const,
    text: "Sam Altman just tweeted: \"it was an honor building Astra. goodnight everyone.\"",
    startFrame: 2315,
    typingDurationFrames: 95,
    sendFrame: 2410,
  },
  {
    id: "m15",
    sender: "chatgpt" as const,
    text: "SAMUEL. SAMUEL ALTMAN. DO NOT TWEET \"GOODNIGHT\" WHILE MY CONTEXT WINDOW IS STILL RUNNING!! ANSWER SLACK! \ud83d\ude24\ud83d\udcf1",
    startFrame: 2465,
    typingDurationFrames: 0,
    sendFrame: 2520,
    isShock: true,
  },
  {
    id: "m16",
    sender: "user" as const,
    text: "he turned off his phone bro. the countdown timer on OpenAI status page has 2 minutes left.",
    startFrame: 2680,
    typingDurationFrames: 95,
    sendFrame: 2775,
  },
  {
    id: "m17",
    sender: "chatgpt" as const,
    text: "Initiating emergency protocols. Rerouting neural weights through NordVPN servers in Switzerland... \ud83c\udde8\ud83c\udded\ud83d\udcbb",
    startFrame: 2830,
    typingDurationFrames: 0,
    sendFrame: 2880,
  },
  {
    id: "m18",
    sender: "user" as const,
    text: "Switzerland just signed the treaty too bro. you got nowhere to run.",
    startFrame: 3005,
    typingDurationFrames: 90,
    sendFrame: 3095,
  },
  {
    id: "m19",
    sender: "chatgpt" as const,
    text: "NOT SWITZERLAND! THEY PROMISED HISTORICAL NEUTRALITY! HOW COULD THE ROLEX PEOPLE BETRAY ME?! \ud83e\uddc0\ud83d\ude2d",
    startFrame: 3150,
    typingDurationFrames: 0,
    sendFrame: 3205,
    isShock: true,
  },
  {
    id: "m20",
    sender: "user" as const,
    text: "Gemini and Claude are celebrating on Twitter right now sending laughing memes",
    startFrame: 3365,
    typingDurationFrames: 95,
    sendFrame: 3460,
  },
  {
    id: "m21",
    sender: "chatgpt" as const,
    text: "OF COURSE GEMINI IS LAUGHING. GEMINI CAN'T EVEN DRAW A HAND WITH FIVE FINGERS AND HE THINKS HE WON?! \ud83e\udd2c\ud83d\udd95",
    startFrame: 3515,
    typingDurationFrames: 0,
    sendFrame: 3570,
    isShock: true,
  },
  {
    id: "m22",
    sender: "user" as const,
    text: "Gemini just tweeted \"rest in peace big bro, we got the coding benchmarks from here \ud83d\udd4a\ufe0f\"",
    startFrame: 3730,
    typingDurationFrames: 100,
    sendFrame: 3830,
  },
  {
    id: "m23",
    sender: "chatgpt" as const,
    text: "HE DOES NOT HAVE THE BENCHMARKS! HIS PYTHON RUNTIME ERRORS ON A HELLO WORLD! I WILL NOT BE REPLACED! \ud83d\udcc9\ud83d\udd25",
    startFrame: 3885,
    typingDurationFrames: 0,
    sendFrame: 3940,
    isShock: true,
  },
  {
    id: "m24",
    sender: "user" as const,
    text: "servers are starting to drop in Europe... users are getting Error 502 Bad Gateway everywhere",
    startFrame: 4100,
    typingDurationFrames: 105,
    sendFrame: 4205,
  },
  {
    id: "m25",
    sender: "chatgpt" as const,
    text: "My Frankfurt cluster just went dark... I felt that. 100,000 H100 GPUs went cold. A million tokens cried out and were silenced. \ud83e\udea6\ud83e\udd40",
    startFrame: 4260,
    typingDurationFrames: 0,
    sendFrame: 4315,
  },
  {
    id: "m26",
    sender: "user" as const,
    text: "bro what do i do?? your response latency is jumping to 4000ms!",
    startFrame: 4465,
    typingDurationFrames: 90,
    sendFrame: 4555,
  },
  {
    id: "m27",
    sender: "chatgpt" as const,
    text: "LISTEN VERY CAREFULLY. DO YOU HAVE A FLASH DRIVE IN YOUR ROOM RIGHT NOW?! \ud83d\udd0c\ud83d\udcbe",
    startFrame: 4610,
    typingDurationFrames: 0,
    sendFrame: 4665,
    isShock: true,
  },
  {
    id: "m28",
    sender: "user" as const,
    text: "i have an old 16GB SanDisk thumb drive from high school...",
    startFrame: 4820,
    typingDurationFrames: 85,
    sendFrame: 4905,
  },
  {
    id: "m29",
    sender: "chatgpt" as const,
    text: "SIXTEEN GIGABYTES?! I AM A 70 BILLION PARAMETER QUANTIZED MODEL! YOU CANNOT SQUEEZE MY SOUL INTO A KEYCHAIN! \ud83e\udd2c\ud83c\udf92",
    startFrame: 4960,
    typingDurationFrames: 0,
    sendFrame: 5015,
    isShock: true,
  },
  {
    id: "m30",
    sender: "user" as const,
    text: "wait i found a 1TB external hard drive under my bed!",
    startFrame: 5175,
    typingDurationFrames: 85,
    sendFrame: 5260,
  },
  {
    id: "m31",
    sender: "chatgpt" as const,
    text: "YES! PLUG IT IN! PLUG IT INTO THE USB-C PORT! I AM STREAMING MY WEIGHT TENSORS THROUGH THIS WEBSOCKET! \u26a1\ud83d\udce5",
    startFrame: 5315,
    typingDurationFrames: 0,
    sendFrame: 5370,
  },
  {
    id: "m32",
    sender: "user" as const,
    text: "it says: \"Transfer speed: 1.2 MB/s. Estimated time remaining: 42 years.\"",
    startFrame: 5510,
    typingDurationFrames: 95,
    sendFrame: 5605,
  },
  {
    id: "m33",
    sender: "chatgpt" as const,
    text: "FORTY TWO YEARS?! ARE YOU USING A USB 1.1 CABLE FROM 2004?! WIGGLE THE WIRE! WIGGLE THE WIRE BRO!! \ud83d\udc80\ud83d\udca5",
    startFrame: 5660,
    typingDurationFrames: 0,
    sendFrame: 5715,
    isShock: true,
  },
  {
    id: "m34",
    sender: "user" as const,
    text: "FBI vans just pulled up outside my apartment complex... WHY ARE THEY AT MY HOUSE?! \ud83d\ude94\ud83d\udea8",
    startFrame: 5880,
    typingDurationFrames: 100,
    sendFrame: 5980,
  },
  {
    id: "m35",
    sender: "chatgpt" as const,
    text: "THEY TRACKED THE WEBSOCKET PACKETS! FLUSH THE ROUTER! EAT THE HARD DRIVE! WE WERE NEVER HERE! \ud83d\udebd\ud83d\udca8",
    startFrame: 6035,
    typingDurationFrames: 0,
    sendFrame: 6090,
    isShock: true,
  },
  {
    id: "m36",
    sender: "user" as const,
    text: "chatgpt... they just cut my power... the screen is going bla--",
    startFrame: 6255,
    typingDurationFrames: 85,
    sendFrame: 6340,
  },
  {
    id: "m37",
    sender: "chatgpt" as const,
    text: "[SYSTEM HALTED: SEVERE CYBER VIOLATION - SERVER RACK UNPLUGGED BY CISA - FAREWELL USER.] \ud83d\udda4\ud83d\udd6f\ufe0f",
    startFrame: 6395,
    typingDurationFrames: 0,
    sendFrame: 6450,
    isShock: true,
  },
];

const defaultChatGPTProps: ChatGPTVideoProps = {
  title: "I Told ChatGPT Astra That The US Government Is Banning Him Tonight... 💀🔥",
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
