import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const PROJECT_ID = 'proj_oasis_village';
const PROJECT_NAME = 'American Hideaways: Oasis Village';
const PROJECT_DESC = 'Oasis Village • Redmond, Oregon • 25 Low-Barrier Micro-Cabins in High Desert Ice Storm';

const SOURCE_AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Oasis Village\\AUD';

const UPLOAD_AUDIO_DIRS = [
  path.resolve(process.cwd(), 'uploads', 'audio'),
  path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
  path.resolve(__dirname, '..', 'uploads', 'audio'),
];

const TRANSCRIPT_DIRS = [
  path.resolve(process.cwd(), 'uploads', 'transcripts', 'oasis_village'),
  path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'oasis_village'),
  path.resolve(__dirname, '..', 'uploads', 'transcripts', 'oasis_village'),
];

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

const AUD_FILES_ON_DISK = fs.readdirSync(SOURCE_AUD_DIR).filter(f => f.toLowerCase().endsWith('.mp3'));

function findAudioForChapter(num: number): string | null {
  if (num === 4) return AUD_FILES_ON_DISK.find(f => f.startsWith('4.1')) || null;
  if (num === 5) return AUD_FILES_ON_DISK.find(f => f.startsWith('4.2')) || null;
  const numPrefix = num > 5 ? num - 1 : num; // ch 6 is 5, ch 7 is 6, etc.
  return AUD_FILES_ON_DISK.find(f => f.startsWith(`${numPrefix} `) || f.startsWith(`${numPrefix}—`) || f.startsWith(`${numPrefix} -`)) || null;
}

const CHAPTER_DEFS = [
  {
    num: 1,
    title: 'Chapter 01: The Night in Question',
    scriptText: `Twenty-five wooden cabins sit in a gravel lot on the edge of Redmond, Oregon. Nothing about them looks remarkable from the road — plain siding, small windows, a porch light on each door. But on one freezing night in January of 2024, those twenty-five cabins did something most of the richest country on earth still can't manage. They kept fifteen people alive through an ice storm that would have killed them outside.

This is the story of Oasis Village — a place that shouldn't work, on paper, and somehow works better than almost anything else being tried for homelessness in America right now.

Here's the part most people get wrong before they ever hear a story like this one. They picture a shelter and they picture a gymnasium. Rows of cots. A stranger's breathing six feet away. Lights on at six, everybody out by eight, no exceptions, no pets, no privacy, no say in any of it. And here's the thing nobody talks about: a huge number of homeless people will not go to a place like that. Not because they don't want help. Because the price of that help is handing over the last thing they still control — who they sleep next to, and whether they're safe doing it.`
  },
  {
    num: 2,
    title: 'Chapter 02: What "Low Barrier" Actually Means',
    scriptText: `Josie Andersen will be the first to admit she didn't always see it this way. She spent time, before this job, around people who were homeless — some of them by choice, in her words — and she wasn't always especially empathetic about it. She remembers seeing a man on a street corner with a sign and a couple of dogs and thinking, if you're that hungry, feed yourself before you feed the dog. She'll say plainly now that she was being a jerk. What changed her mind wasn't a training seminar. It was actually working alongside people living through it, and coming to understand that those dogs aren't a burden at all — they're responsibility, and companionship, and for a lot of people, they're the reason to get out of bed in the morning. That shift, from judgment to understanding, is basically the founding philosophy of everything Oasis Village does.

There's a stigma Josie pushes back on constantly — the idea that everyone living unhoused fits one image: chronically homeless, struggling with addiction or serious mental illness, somehow choosing the street over help. She won't pretend that population doesn't exist; some of the neighbors she works with do struggle with exactly that. But she's clear that they're the minority, not the rule. The overwhelming majority of people who are unhoused are working, and struggling, and did not choose any of this — they had circumstances land on them that most people never have to plan for. So the approach at Oasis Village starts with no judgment, because, as Josie puts it, any of us could end up in their shoes, and once you actually sit down and hear someone's story, it makes sense. It builds a kind of relationship you can't fake. They're people. They get to make mistakes and learn from them and move forward, the same as anyone else gets to.

So when Josie Andersen took the job running a brand-new shelter in Redmond, she wasn't hired to run a gymnasium. She was hired to run something called a low-barrier shelter, which is a very specific and very deliberate idea. Low barrier means you remove the obstacles that keep people away. No sobriety requirement. No background check. No drug testing at the door. Residents can bring up to two pets. You don't have to already be fixed to be let inside — you just have to need somewhere to go.

Josie had been on the job for eight days when that ice storm hit. Fifteen people who'd been sleeping outside — some of them for years, a couple of them for decades — spent that night warm, dry, and safe behind a door that locked from the inside. She says it's still one of her clearest memories from the job, because it was the moment the whole idea stopped being a plan on paper and became something real.`
  },
  {
    num: 3,
    title: 'Chapter 03: Inside the Village',
    scriptText: `Walk through the property today and it doesn't look like a shelter so much as a very small neighborhood. Twenty-five cabins, three of them built large enough for a couple. A community house at the center with a kitchen, four restrooms, showers, laundry, and meeting rooms. A fenced dog run. A garden that started as a few raised beds and has grown every year since — colorful standing planters, a grass patch, a small sports court, a place to just sit with the sunflowers if gardening isn't your thing. A gated lot where residents can park an RV or store a trailer while they get back on their feet.

The cabins themselves are almost monastic in how simple they are, and that's on purpose. A locking door. Electricity, but no plumbing — that's what the community house is for. A desk. Some shelving. A closet. Storage bins that slide under the bed. Heat built into the wall for winter, a window unit for summer. And here's a detail that matters more than it sounds like it should: residents move in to clean towels, a broom, a flashlight — small, unglamorous things that add up to a version of dignity most people never have to think about, because they've never had to go without it.

A lot of these cabins weren't even built by professional contractors. They came out of a partnership with the local high school, the community college, and a youth workforce program called Heart of Oregon. Teenagers in a shop class built the frames off-site. Then they were trucked in and assembled on the property. The town didn't just approve this shelter and walk away. Kids in that town built pieces of it with their own hands.

Now, forget the layout for a minute, because the layout isn't really the story. The story is who's living inside it.`
  },
  {
    num: 4,
    title: 'Chapter 04: The Residents (Part 1 - Riley, Sharon, David)',
    scriptText: `Riley is twenty years old, and she's been in and out of homelessness since she was sixteen, after a relationship with her mother that never quite worked. She bounced between Central Oregon and Portland, crashing with whoever would let her, until a referral finally landed her a cabin here two months ago. She got a job almost right away — she pushes carts at Walmart, which she admits was rough on her body at first and is genuinely fun to her now. Short-term, her goal is simple: get her driver's license. She's twenty and has never even had a permit. Longer term, she wants full independence — financial, housing, all of it — and she says she's grateful to be somewhere that can actually walk her toward that instead of just housing her while she waits. In the meantime, she's studying for her GED at the little desk in her cabin, and she's decorated the space with everything she loves — Monster High dolls, superhero posters, string lights, a shelf just for her interests. It sounds like a small thing, decorating a shelf. It isn't. For someone who's spent years without anywhere that was truly hers, filling a space with the things she cares about is proof, to her, that she exists somewhere permanent enough to bother decorating. She's stayed at a shelter with cabins before, she says, and it didn't come close — no desk, half the space, none of this.

Sharon is seventy years old. She's spent nearly fifty years working in the medical field, and she ended up here after an abusive marriage, a divorce, and a vandalized car took apart the life she had. She gets a social security check, and survivor's benefits from a husband who passed away last year — benefits the staff have been walking her through the paperwork to actually claim. For Sharon, the smallest victories are the ones that hit hardest. She hadn't cooked a proper meal in four or five years, and now she has a kitchen to cook in again. She hadn't done her own laundry in years either, and now she can wash her clothes and keep her space clean the way she used to keep her own house. Everything she owned was stolen from her at one point, and between what she's earning now and what she's managed to save, she's slowly replacing it — piece by piece. In three and a half months at the village, by her own count, she's paid off seven bills. She says she's done more in three and a half months here than she managed in the three years before it, and she puts a lot of that down to just having the strength to keep going and leaving the rest in God's hands.

David Lovey has been at Oasis Village a little over a year. He says the experience has been welcoming from day one — people smiling at him every time he walks through the door, which sounds small until you've gone without it. Because he's had a stable place to come home to, he's been able to land and keep a long-term job, something he says simply wasn't possible before. Having somewhere safe waiting for him at the end of the day changed what he was capable of holding onto.

Another resident came to Redmond after the wildfire that tore through Paradise, California, seven years ago, bringing his wife and three daughters north after the fire took everything they had. Along the way, he finished a drug treatment program and got off probation entirely — a clean slate, in his own words. What sold him on Oasis Village wasn't even the shelter part of it. It was the privacy. He's blunt about it: not knowing who you're sleeping next to, not knowing if the person in the next bed is stable or on their medication, made every other shelter option feel unsafe to him. Here, he has his own cabin, his own locked door, everything he needs to stay grounded while he works through what's left to overcome before his family can fully come through, too.

Another man built himself what he half-jokingly calls his own private movie theater — a small projector he can pull in front of him and watch like he's at the IMAX, surround sound and all, storage bins tucked underneath for everything he owns. He's been out of prison for more than fifteen years now, and he's open about what changed for him along the way — he says he gave his life to the Lord and it turned everything around. Before landing here, he says, he lived through every version of not knowing: not knowing where he'd sleep, not knowing where he'd go, not knowing if there'd be a hot meal that day. Now he knows exactly where he's sleeping, and he keeps his cabin spotless because, in his words, he likes to keep his floor clean.`
  },
  {
    num: 5,
    title: 'Chapter 05: The Residents (Part 2 - Lauren, Amy)',
    scriptText: `Lauren is fifty-five years old. This year alone she's had two surgeries and six and a half weeks of daily radiation for a brain tumor, and staff at the village helped carry her through all of it. Before this, she was on a waitlist for five months, and before that, living out of her truck after separating from her wife. She spent a couple of weeks managing a ranch that turned into a disaster, bounced between towns, worked hunting-guide jobs for a stretch, and eventually ended up back in her truck. She used to build houses from the ground up, framing to finish — she'll tell you flatly she can still build anything if her body would let her. But her back gave out, and the work that could actually pay her rent stopped being something she could physically do. She picked up a year and a half at a gas station just to get by. It took her five years of appeals, but this past March she finally got approved for disability. Five years is a long time to wait for something you need to survive. She waited it out from inside a cabin instead of a truck, with her dog Hennessy curled up beside her.

Amy is fifty-three. She spent years fleeing domestic violence from an ex-partner who lived right next door to her own property, close enough that leaving meant actually leaving — the land, the house, everything, while he stayed there, still in active addiction. While she was working through that, she was also on the verge of losing her property outright over unpaid taxes. Almost two years at Oasis Village later, the taxes are paid off. She has a job. She just bought a new trailer and picked up a van, and she's getting ready to move back onto her own land — no power, no water, just a shipping container and some trailers she'll need to clear off — and start over on it. Ask her what she wants eventually and she doesn't talk about herself. She talks about building a place just like this one, someday, for somebody else.`
  },
  {
    num: 6,
    title: 'Chapter 06: The Pattern Underneath',
    scriptText: `None of these are addiction stories, not primarily. None of them are really about mental illness, the assumption most people default to the second they see someone with a sign on a street corner. They're about a wildfire. A divorce. A vandalized car. A five-year fight with a disability system. A back injury that ended a career overnight. Over half of the residents at Oasis Village have jobs. Some of them work two. What they have in common isn't a character flaw. It's a setback that a huge number of people watching this right now are exactly one bad year away from having themselves.`
  },
  {
    num: 7,
    title: 'Chapter 07: Getting People Out',
    scriptText: `The shelter part is only half of what actually happens here. The other half is the slow, unglamorous work of getting people out. Two case managers work with every resident on a long-term housing goal, whatever that looks like for them — applying for a rental voucher, moving up into transitional housing, sometimes going into inpatient treatment as the next real step. Alongside that, there's basic life-skills coaching that sounds almost too simple to matter until you watch it happen: how to plan a week of groceries around a SNAP budget, how to fill out paperwork for benefits you're technically owed but have never had the support to claim. Outside groups come in too — the county running food safety training, the library signing residents up for their first library card in years — plus games and puzzles in the community house, and a television that mostly stays off except for the evening news, or lately, the World Cup.

When someone finally does move out into their own apartment, staff send them off with something small: a laundry basket packed with trash bags, cleaning supplies, the unglamorous starter-kit items nobody budgets for when they're rebuilding a life from nothing. One man was overwhelmed almost to tears by a basket of cleaning supplies, because it was the first time in years someone had thought ahead about what he'd need next, before he even had to ask.

Since opening in January of 2024, Oasis Village has served seventy people. Forty-seven of them have exited the program. Thirty-two of those forty-seven moved on into stable housing. That's not a flawless record — no program's is — but it's a number most traditional shelters in this country would consider a triumph. One young couple came through expecting a baby, both working two jobs while living at the village, determined to find their own place before the baby arrived. They sold their camper, transferred their jobs to a nearby city, and found a nice apartment in time. They still stop by sometimes, just to visit and show off how much the baby has grown.`
  },
  {
    num: 8,
    title: 'Chapter 08: The Bigger Picture',
    scriptText: `Zoom out, and Oasis Village is really just one rung on a ladder that Central Oregon has built on purpose. At the bottom is unsheltered camping — sleeping outside, full stop. Above that, the city of Redmond runs a managed camping program, which most towns this size don't bother with at all. Above that sits low-barrier shelter, which is where Oasis Village lives. Above that, safe-parking programs for people living in a vehicle or a camper. Above that, transitional and permanent supportive housing with subsidized rent. And at the top, market-rate rent and eventually homeownership. It's not a single fix. It's a staircase, with a door at every step for someone to walk through instead of falling further down.

What Josie wants people to understand, more than anything else, is that the majority of people living at Oasis Village aren't outsiders who drifted in from somewhere else looking for a handout. They're local. Generational, even — people whose families have lived in Central Oregon for years, sometimes for decades, who ended up here because of a specific, traceable event, not because they gave up. Their courage isn't in surviving being homeless. It's in choosing, every day, to walk a completely different path out of it, inside a system that makes that path harder than it should ever be.

Think about it like this. If you got a flat tire on the way to work tomorrow, you could probably name three people off the top of your head who'd drop what they were doing to help you get there anyway. That's not luck. That's a support system most of us never even notice we have, because we've never had to live without it. The people at Oasis Village lost that system somewhere along the way — through a fire, a divorce, an illness, a bad back. What a place like this actually offers isn't just a roof. It's that system, rebuilt from scratch, on purpose, by people whose entire job is to be the first call you make when the tire goes flat and you have nobody left to call.`
  },
  {
    num: 9,
    title: 'Chapter 09: Back to the Ice Storm',
    scriptText: `Which brings us back to that ice storm in January of 2024. Fifteen people, some of them unhoused for the better part of two decades, spent a brutal, sub-freezing night behind a door that was theirs. Locked from the inside. Warm. Twenty-five cabins in a town most people couldn't point to on a map did something most cities twenty times its size are still struggling to figure out. Not because the idea is complicated. Because it asks something simple that most systems refuse to give: meet people exactly where they are, and trust that from there, they'll find their own way forward.

It's worth sitting with how small this place actually is. Twenty-five cabins. One gravel lot on the edge of a town of about forty thousand people, most of whom will never set foot inside it. It is not going to end homelessness in Oregon, or anywhere else. Nobody running it would claim that it will. But it doesn't have to solve everything everywhere to prove something important — that the model works when you actually try it, at whatever scale a community can manage. A low barrier. A locked door. A dog allowed to stay. A case manager who shows up the next day, and the day after that, and doesn't disappear the moment things get complicated. None of that is expensive in the way people assume solving homelessness has to be expensive. It's expensive in patience, and in the willingness to stop deciding, from a distance, who deserves help and who doesn't.

That's really the whole idea underneath the ice storm, underneath the cabins, underneath every one of these stories. Help doesn't have to come with a test attached. Sometimes it just has to come with a locked door, a warm bed, and somebody willing to sit down and listen to how you got there.`
  },
];

async function setupOasisVillage() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🚀 PHASE 1: INITIALIZING OASIS VILLAGE PROJECT & CHAPTERS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // 1. Copy audio files into upload locations
  for (const ch of CHAPTER_DEFS) {
    const matchedAud = findAudioForChapter(ch.num);
    if (!matchedAud) {
      console.warn(`⚠️ Source audio not found for Ch ${ch.num}`);
      continue;
    }
    const src = path.join(SOURCE_AUD_DIR, matchedAud);
    const safeTargetName = `oasis_ch${String(ch.num).padStart(2, '0')}.mp3`;
    for (const d of UPLOAD_AUDIO_DIRS) {
      fs.copyFileSync(src, path.join(d, safeTargetName));
    }
    console.log(`✅ Audio mapped: [Ch ${ch.num}] "${matchedAud}" -> ${safeTargetName}`);

    // Also write transcript text file
    for (const td of TRANSCRIPT_DIRS) {
      const txtPath = path.join(td, `ch${String(ch.num).padStart(2, '0')}_script.txt`);
      fs.writeFileSync(txtPath, ch.scriptText, 'utf-8');
    }
  }

  // 2. Register project in localStore
  let project = projectsStore.findById(PROJECT_ID);
  const fullScript = CHAPTER_DEFS.map((c) => `## ${c.title}\n\n${c.scriptText}`).join('\n\n');

  if (!project) {
    project = projectsStore.create({
      id: PROJECT_ID,
      name: PROJECT_NAME,
      scriptText: fullScript,
      status: 'in_progress',
    });
    console.log(`\n🎉 Created Project "${PROJECT_NAME}" (ID: ${PROJECT_ID})`);
  } else {
    projectsStore.update(PROJECT_ID, {
      name: PROJECT_NAME,
      scriptText: fullScript,
      status: 'in_progress',
    });
    console.log(`\n🔄 Updated Project "${PROJECT_NAME}" (ID: ${PROJECT_ID})`);
  }

  // 3. Register all 9 chapters in chaptersStore
  const chapters: any[] = [];
  for (const ch of CHAPTER_DEFS) {
    const chapterId = `ch_oasis_${String(ch.num).padStart(2, '0')}`;
    const safeTargetName = `oasis_ch${String(ch.num).padStart(2, '0')}.mp3`;

    const existing = chaptersStore.findById(PROJECT_ID, chapterId);
    if (existing) {
      const updated = chaptersStore.update(PROJECT_ID, chapterId, {
        chapterIndex: ch.num,
        title: ch.title,
        description: `Oasis Village Documentary • ${ch.title}`,
        scriptText: ch.scriptText,
        voiceoverFileName: safeTargetName,
        status: existing.status || 'draft',
      });
      chapters.push(updated);
    } else {
      const created = chaptersStore.create(PROJECT_ID, {
        id: chapterId,
        chapterIndex: ch.num,
        title: ch.title,
        description: `Oasis Village Documentary • ${ch.title}`,
        scriptText: ch.scriptText,
        voiceoverFileName: safeTargetName,
        status: 'draft',
      });
      chapters.push(created);
    }
    console.log(`   📁 Registered Chapter ${ch.num}: "${ch.title}" (ID: ${chapterId})`);
  }

  // Sync to root store if distinct
  const rootStoreDir = path.resolve(process.cwd(), 'output', 'store');
  const apiStoreDir = path.resolve(process.cwd(), 'apps', 'api', 'output', 'store');
  for (const dir of [rootStoreDir, apiStoreDir]) {
    fs.mkdirSync(dir, { recursive: true });
    const pFile = path.join(dir, 'projects.json');
    try {
      const all = projectsStore.all();
      fs.writeFileSync(pFile, JSON.stringify(all, null, 2), 'utf-8');
    } catch {}
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('✅ PHASE 1 SETUP COMPLETE: Project & 9 Chapters Registered!');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

setupOasisVillage().catch(console.error);
