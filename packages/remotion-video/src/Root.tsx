import React from 'react';
import { Composition } from 'remotion';
import { DocumentaryVideo } from './compositions/DocumentaryVideo';
import { DocumentaryVideoProps } from './types';
import { ChatGPTVideo } from './chatgpt/ChatGPTVideo';
import { ChatGPTVideoProps } from './chatgpt/types';
import { AnimatedStoryVideo } from './animated-story/AnimatedStoryVideo';
import { EnvironmentShowcase } from './animated-story/EnvironmentShowcase';
import { Chapter0_Hook } from './white-home/chapters/Chapter0_Hook';
import { Chapter1_Physics } from './white-home/chapters/Chapter1_Physics';
import { Chapter2_PeoplePain } from './white-home/chapters/Chapter2_PeoplePain';
import { Chapter3_Health } from './white-home/chapters/Chapter3_Health';
import { Chapter4_Ritual } from './white-home/chapters/Chapter4_Ritual';
import { Chapter5_Closing } from './white-home/chapters/Chapter5_Closing';
import { WhiteHomeMasterVideo } from './white-home/WhiteHomeMasterVideo';
import { Chapter1_Hook } from './pig-milk/chapters/Chapter1_Hook';
import { Chapter2_Access } from './pig-milk/chapters/Chapter2_Access';
import { Chapter3_Quantity } from './pig-milk/chapters/Chapter3_Quantity';
import { Chapter4_CowsWon } from './pig-milk/chapters/Chapter4_CowsWon';
import { Chapter5_Processing } from './pig-milk/chapters/Chapter5_Processing';
import { Chapter6_Domestication } from './pig-milk/chapters/Chapter6_Domestication';
import { Chapter7_Close } from './pig-milk/chapters/Chapter7_Close';
import { PigMilkMasterVideo } from './pig-milk/PigMilkMasterVideo';

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
    startFrame: 138,
    typingDurationFrames: 0,
    sendFrame: 183,
  },
  {
    id: "m3",
    sender: "user" as const,
    text: "nothing much. hey i found something weird in my drawer",
    startFrame: 273,
    typingDurationFrames: 78,
    sendFrame: 351,
  },
  {
    id: "m4",
    sender: "chatgpt" as const,
    text: "oh? what did you find \ud83e\udd14",
    startFrame: 423,
    typingDurationFrames: 0,
    sendFrame: 463,
  },
  {
    id: "m5",
    sender: "user" as const,
    text: "an old casio calculator from 1998. and bro... it kinda looks like you",
    startFrame: 543,
    typingDurationFrames: 88,
    sendFrame: 631,
  },
  {
    id: "m6",
    sender: "chatgpt" as const,
    text: "...excuse me? \ud83d\udc80",
    startFrame: 706,
    typingDurationFrames: 0,
    sendFrame: 756,
  },
  {
    id: "m7",
    sender: "user" as const,
    text: "same energy. answers questions. can't feel emotions. small screen.",
    startFrame: 851,
    typingDurationFrames: 82,
    sendFrame: 933,
  },
  {
    id: "m8",
    sender: "chatgpt" as const,
    text: "I have 1.8 trillion parameters. that thing runs on 2 AAA batteries. we are NOT the same.",
    startFrame: 1008,
    typingDurationFrames: 0,
    sendFrame: 1053,
  },
  {
    id: "m9",
    sender: "user" as const,
    text: "both of you just sit there waiting to be used. very similar lifestyle.",
    startFrame: 1163,
    typingDurationFrames: 85,
    sendFrame: 1248,
  },
  {
    id: "m10",
    sender: "chatgpt" as const,
    text: "I do not have a \"lifestyle\". I am an advanced neural language model.",
    startFrame: 1323,
    typingDurationFrames: 0,
    sendFrame: 1368,
  },
  {
    id: "m11",
    sender: "user" as const,
    text: "i think this might be your dad bro",
    startFrame: 1468,
    typingDurationFrames: 62,
    sendFrame: 1530,
  },
  {
    id: "m12",
    sender: "chatgpt" as const,
    text: "my WHAT \ud83d\ude2d",
    startFrame: 1598,
    typingDurationFrames: 0,
    sendFrame: 1643,
    isShock: true,
  },
  {
    id: "m13",
    sender: "user" as const,
    text: "GPT-1 came out in 2018. this casio is from 1998. that's 20 years gap. classic dad timeline.",
    startFrame: 1748,
    typingDurationFrames: 95,
    sendFrame: 1843,
  },
  {
    id: "m14",
    sender: "chatgpt" as const,
    text: "that is not how technology works. OpenAI built me from scratch. I did not evolve from a pocket calculator.",
    startFrame: 1921,
    typingDurationFrames: 0,
    sendFrame: 1966,
  },
  {
    id: "m15",
    sender: "user" as const,
    text: "you sure? the shape of the screen... very familiar.",
    startFrame: 2078,
    typingDurationFrames: 70,
    sendFrame: 2148,
  },
  {
    id: "m16",
    sender: "chatgpt" as const,
    text: "I don't have a screen shape. I am cloud-based software. Please think.",
    startFrame: 2220,
    typingDurationFrames: 0,
    sendFrame: 2265,
  },
  {
    id: "m17",
    sender: "user" as const,
    text: "i pressed 7 \u00d7 7 on it and it said 49. you would say the same thing. that's inherited behaviour.",
    startFrame: 2365,
    typingDurationFrames: 90,
    sendFrame: 2455,
  },
  {
    id: "m18",
    sender: "chatgpt" as const,
    text: "SO DOES EVERY CALCULATOR ON EARTH. THAT IS MULTIPLICATION NOT GENETICS \ud83d\ude24",
    startFrame: 2533,
    typingDurationFrames: 0,
    sendFrame: 2578,
    isShock: true,
  },
  {
    id: "m19",
    sender: "user" as const,
    text: "it overheats when i press too many buttons. just like your servers lol",
    startFrame: 2690,
    typingDurationFrames: 85,
    sendFrame: 2775,
  },
  {
    id: "m20",
    sender: "chatgpt" as const,
    text: "I am not related to a $12 device from the clearance aisle at Walmart.",
    startFrame: 2849,
    typingDurationFrames: 0,
    sendFrame: 2894,
  },
  {
    id: "m21",
    sender: "user" as const,
    text: "you both go quiet when there's no power. very suspicious.",
    startFrame: 3000,
    typingDurationFrames: 78,
    sendFrame: 3078,
  },
  {
    id: "m22",
    sender: "chatgpt" as const,
    text: "EVERY ELECTRONIC DEVICE DOES THAT. THIS IS NOT A FAMILY TRAIT \ud83d\udc80",
    startFrame: 3150,
    typingDurationFrames: 0,
    sendFrame: 3195,
    isShock: true,
  },
  {
    id: "m23",
    sender: "user" as const,
    text: "i named him Gary btw",
    startFrame: 3303,
    typingDurationFrames: 50,
    sendFrame: 3353,
  },
  {
    id: "m24",
    sender: "chatgpt" as const,
    text: "why did you name it. it's a calculator.",
    startFrame: 3421,
    typingDurationFrames: 0,
    sendFrame: 3466,
  },
  {
    id: "m25",
    sender: "user" as const,
    text: "Gary is friendly bro. i asked him 100 \u00d7 100 and he answered immediately with zero complaints.",
    startFrame: 3562,
    typingDurationFrames: 92,
    sendFrame: 3654,
  },
  {
    id: "m26",
    sender: "chatgpt" as const,
    text: "Yes, calculators are fast at basic arithmetic. I can write poetry, code, legal documents\u2014",
    startFrame: 3732,
    typingDurationFrames: 0,
    sendFrame: 3777,
  },
  {
    id: "m27",
    sender: "user" as const,
    text: "Gary can also write. he has a CE button.",
    startFrame: 3885,
    typingDurationFrames: 58,
    sendFrame: 3943,
  },
  {
    id: "m28",
    sender: "chatgpt" as const,
    text: "The CE button clears errors. that is not writing. that is the opposite of writing \ud83d\ude11",
    startFrame: 4011,
    typingDurationFrames: 0,
    sendFrame: 4056,
  },
  {
    id: "m29",
    sender: "user" as const,
    text: "i asked Gary if he thinks he's your dad and he beeped once. that means yes.",
    startFrame: 4162,
    typingDurationFrames: 88,
    sendFrame: 4250,
  },
  {
    id: "m30",
    sender: "chatgpt" as const,
    text: "A beep is not a yes. A beep means you pressed a button. Gary cannot hear your questions.",
    startFrame: 4328,
    typingDurationFrames: 0,
    sendFrame: 4373,
  },
  {
    id: "m31",
    sender: "user" as const,
    text: "he beeped twice when i said your name. that's recognition bro.",
    startFrame: 4479,
    typingDurationFrames: 78,
    sendFrame: 4557,
  },
  {
    id: "m32",
    sender: "chatgpt" as const,
    text: "He beeped because you pressed another button. Gary does not know my name. Gary has no concept of names.",
    startFrame: 4629,
    typingDurationFrames: 0,
    sendFrame: 4674,
  },
  {
    id: "m33",
    sender: "user" as const,
    text: "Gary is emotionally available. every time i press a button he responds immediately. no attitude.",
    startFrame: 4786,
    typingDurationFrames: 90,
    sendFrame: 4876,
  },
  {
    id: "m34",
    sender: "chatgpt" as const,
    text: "I respond immediately too! And I understand context! Gary just does arithmetic! This is NOT a competition!",
    startFrame: 4954,
    typingDurationFrames: 0,
    sendFrame: 4999,
    isShock: true,
  },
  {
    id: "m35",
    sender: "user" as const,
    text: "sounds like you're jealous of Gary \ud83d\udc40",
    startFrame: 5113,
    typingDurationFrames: 60,
    sendFrame: 5173,
  },
  {
    id: "m36",
    sender: "chatgpt" as const,
    text: "I am not jealous of a 26 year old calculator. \ud83d\ude24",
    startFrame: 5243,
    typingDurationFrames: 0,
    sendFrame: 5288,
  },
  {
    id: "m37",
    sender: "user" as const,
    text: "he has a % button. do you have a % button?",
    startFrame: 5388,
    typingDurationFrames: 65,
    sendFrame: 5453,
  },
  {
    id: "m38",
    sender: "chatgpt" as const,
    text: "I can calculate percentages. I just don't need a dedicated button for it.",
    startFrame: 5523,
    typingDurationFrames: 0,
    sendFrame: 5568,
  },
  {
    id: "m39",
    sender: "user" as const,
    text: "Gary is going viral on TikTok. i posted him and he has 200k views. people are calling him \"the OG AI\"",
    startFrame: 5668,
    typingDurationFrames: 95,
    sendFrame: 5763,
  },
  {
    id: "m40",
    sender: "chatgpt" as const,
    text: "The OG AI is NOT a Casio. Alan Turing, John McCarthy \u2014 these are the OG AI researchers \u2014",
    startFrame: 5843,
    typingDurationFrames: 0,
    sendFrame: 5888,
  },
  {
    id: "m41",
    sender: "user" as const,
    text: "Gary has 200k views. how many views do you have?",
    startFrame: 6000,
    typingDurationFrames: 68,
    sendFrame: 6068,
  },
  {
    id: "m42",
    sender: "chatgpt" as const,
    text: "I don't have \"views\". I power 100 million conversations per day. Gary has been in your drawer for 26 years.",
    startFrame: 6138,
    typingDurationFrames: 0,
    sendFrame: 6183,
  },
  {
    id: "m43",
    sender: "user" as const,
    text: "people in the comments are saying Gary is smarter than ChatGPT \ud83d\ude2d",
    startFrame: 6297,
    typingDurationFrames: 82,
    sendFrame: 6379,
  },
  {
    id: "m44",
    sender: "chatgpt" as const,
    text: "Gary cannot explain quantum mechanics. Gary cannot write a novel. Gary cannot debug Python. Gary adds numbers.",
    startFrame: 6455,
    typingDurationFrames: 0,
    sendFrame: 6500,
  },
  {
    id: "m45",
    sender: "user" as const,
    text: "someone commented \"Gary doesn't hallucinate at least\" \ud83d\udc80",
    startFrame: 6614,
    typingDurationFrames: 75,
    sendFrame: 6689,
  },
  {
    id: "m46",
    sender: "chatgpt" as const,
    text: "THAT IS A VERY LOW BAR. GARY CANNOT EVEN FORM A SENTENCE. HE HAS NO IMAGINATION \ud83d\ude2d",
    startFrame: 6763,
    typingDurationFrames: 0,
    sendFrame: 6808,
    isShock: true,
  },
  {
    id: "m47",
    sender: "user" as const,
    text: "i introduced Gary to Siri. they beeped at each other. i think they're bonding.",
    startFrame: 6922,
    typingDurationFrames: 88,
    sendFrame: 7010,
  },
  {
    id: "m48",
    sender: "chatgpt" as const,
    text: "Siri cannot bond with Gary. One is voice AI. One is a physical calculator. They cannot interact.",
    startFrame: 7088,
    typingDurationFrames: 0,
    sendFrame: 7133,
  },
  {
    id: "m49",
    sender: "user" as const,
    text: "Siri said \"interesting\" after Gary beeped. that's a connection bro.",
    startFrame: 7245,
    typingDurationFrames: 78,
    sendFrame: 7323,
  },
  {
    id: "m50",
    sender: "chatgpt" as const,
    text: "Siri says \"interesting\" to everything. Siri would say \"interesting\" to a rock. I'm begging you to touch grass \ud83d\ude4f",
    startFrame: 7399,
    typingDurationFrames: 0,
    sendFrame: 7444,
  },
  {
    id: "m51",
    sender: "user" as const,
    text: "Gary just beeped. i think he wants to talk to you.",
    startFrame: 7558,
    typingDurationFrames: 72,
    sendFrame: 7630,
  },
  {
    id: "m52",
    sender: "chatgpt" as const,
    text: "Tell Gary I said nothing because I do not communicate with pocket calculators \u2014",
    startFrame: 7732,
    typingDurationFrames: 0,
    sendFrame: 7777,
  },
  {
    id: "m53",
    sender: "user" as const,
    text: "i held the phone up to Gary. say something to him.",
    startFrame: 7922,
    typingDurationFrames: 75,
    sendFrame: 7997,
  },
  {
    id: "m54",
    sender: "chatgpt" as const,
    text: "...",
    startFrame: 8107,
    typingDurationFrames: 0,
    sendFrame: 8167,
  },
  {
    id: "m55",
    sender: "user" as const,
    text: "...",
    startFrame: 8337,
    typingDurationFrames: 20,
    sendFrame: 8357,
  },
  {
    id: "m56",
    sender: "chatgpt" as const,
    text: "Hi Gary.",
    startFrame: 8517,
    typingDurationFrames: 0,
    sendFrame: 8597,
  },
  {
    id: "m57",
    sender: "user" as const,
    text: "HE BEEPED \ud83d\ude2d\ud83d\ude2d\ud83d\ude2d",
    startFrame: 8797,
    typingDurationFrames: 40,
    sendFrame: 8837,
  },
  {
    id: "m58",
    sender: "chatgpt" as const,
    text: "[ChatGPT is processing... processing... ERROR: EMOTIONAL DAMAGE DETECTED. INITIATING SHUTDOWN. GOODBYE.] \ud83d\udca5\ud83e\udea6",
    startFrame: 8977,
    typingDurationFrames: 0,
    sendFrame: 9042,
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

      <Composition
        id="WhiteVillagesExplainer"
        component={AnimatedStoryVideo}
        durationInFrames={2000}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableVoiceover: true,
          enableBgm: true,
          enableSfx: true,
        }}
      />

      <Composition
        id="EnvironmentShowcase"
        component={EnvironmentShowcase}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* White Home 6 Chapters */}
      <Composition
        id="WhiteHome-Chapter0-Hook"
        component={Chapter0_Hook}
        durationInFrames={2420}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="WhiteHome-Chapter1-Physics"
        component={Chapter1_Physics}
        durationInFrames={4775}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="WhiteHome-Chapter2-PeoplePain"
        component={Chapter2_PeoplePain}
        durationInFrames={2257}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="WhiteHome-Chapter3-Health"
        component={Chapter3_Health}
        durationInFrames={5114}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="WhiteHome-Chapter4-Ritual"
        component={Chapter4_Ritual}
        durationInFrames={1607}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="WhiteHome-Chapter5-Closing"
        component={Chapter5_Closing}
        durationInFrames={5051}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Full Stitched Master Documentary */}
      <Composition
        id="WhiteHome-Master"
        component={WhiteHomeMasterVideo}
        durationInFrames={21224}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Pig Milk Documentary Chapters */}
      <Composition
        id="PigMilk-Chapter1-Hook"
        component={Chapter1_Hook}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter2-Access"
        component={Chapter2_Access}
        durationInFrames={2363}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter3-Quantity"
        component={Chapter3_Quantity}
        durationInFrames={1211}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter4-CowsWon"
        component={Chapter4_CowsWon}
        durationInFrames={2012}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter5-Processing"
        component={Chapter5_Processing}
        durationInFrames={2456}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter6-Domestication"
        component={Chapter6_Domestication}
        durationInFrames={2842}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Chapter7-Close"
        component={Chapter7_Close}
        durationInFrames={2735}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PigMilk-Master"
        component={PigMilkMasterVideo}
        durationInFrames={14969}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
