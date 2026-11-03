const L = (w, e, t) => ({ w, e, t })
const N = t => ({ w: 'narrator', t })

export const CONFLICT_STORIES = [
  {
    id: 'conflict-football',
    mode: 'conflict',
    title: 'The Bump at Break Time',
    blurb: 'Kofi crashes into you during a football match and everyone laughs.',
    skills: ['conflict', 'calm', 'decisions'],
    minutes: 5,
    cast: ['kofi', 'daniel'],
    start: 'n1',
    nodes: {
      n1: {
        scene: 'field',
        lines: [
          N('Break time. The score is 3–3 and everyone wants the winning goal.'),
          N('You dribble towards the goal. Kofi sprints for the ball, slams into your shoulder, and you hit the grass hard. Your knee stings. A few kids laugh.'),
          L('kofi', 'surprised', 'Whoa! I didn’t —'),
          L('you', 'angry', 'My knee is burning and my face feels hot. Everyone is staring.'),
        ],
        choices: [
          { id: 'push', t: 'Jump up and shove Kofi back.', q: 'unhelpful', next: 'n_push', why: 'When we feel hurt and embarrassed, our body wants to hit back fast. But a shove turns an accident into a fight.' },
          { id: 'talk', t: 'Take one slow breath, then say: “Ow. That really hurt. What happened?”', q: 'helpful', next: 'n_talk', why: 'A slow breath gives your thinking brain time to catch up. Saying how you feel, without blaming, invites Kofi to explain.' },
          { id: 'walk', t: 'Grab the ball and walk off: “Game over.”', q: 'mixed', next: 'n_walk', why: 'Walking away can stop things getting worse, which is good. Taking the ball, though, punishes everyone, not just the person who bumped you.' },
        ],
      },
      n_push: {
        scene: 'field',
        lines: [
          N('Kofi stumbles back. His surprise turns into anger.'),
          L('kofi', 'angry', 'It was an ACCIDENT! Why did you push me?'),
          N('Some kids start chanting “fight, fight!”. Coach Daniel looks over from the other side of the field.'),
        ],
        choices: [
          { id: 'sorry', t: '“Sorry I pushed you. I was angry because I fell and people laughed.”', q: 'helpful', next: 'end_repair', why: 'Owning your part takes courage. Explaining the feeling behind it helps Kofi understand you instead of fighting you.' },
          { id: 'blame', t: '“You started it!”', q: 'unhelpful', next: 'end_stormy', why: 'Blaming keeps both of you defending yourselves. Nobody is listening anymore, so the problem can’t get solved.' },
          { id: 'cool', t: 'Say “I need a minute” and walk to the bench to cool down.', q: 'helpful', next: 'n_cool', why: 'Taking space when you are too angry to talk is a smart move, as long as you come back to fix things.' },
        ],
      },
      n_talk: {
        scene: 'field',
        lines: [
          L('kofi', 'worried', 'I’m so sorry! I was watching the ball, not you. Are you okay?'),
          N('Kofi holds out his hand to help you up. The laughing stops.'),
        ],
        choices: [
          { id: 'accept', t: 'Take his hand: “I’m okay. Can we be more careful near the goal?”', q: 'helpful', next: 'end_bright', why: 'You accepted his apology and suggested a fix so it doesn’t happen again. That’s solving the problem, not just ending it.' },
          { id: 'out', t: '“Fine. But you’re out of the game.”', q: 'mixed', next: 'end_mixed', why: 'It makes sense to want something fair after getting hurt. But punishing someone for an accident can leave them feeling bad for a long time.' },
        ],
      },
      n_walk: {
        scene: 'field',
        lines: [
          N('The game stops. Players groan. Kofi jogs after you.'),
          L('kofi', 'frustrated', 'Come on, it was an accident! Everyone wants to play.'),
        ],
        choices: [
          { id: 'explain', t: 'Stop and turn around: “My knee hurts, and I felt embarrassed when they laughed.”', q: 'helpful', next: 'end_repair', why: 'Naming your real feelings, hurt and embarrassed, helps Kofi see why you reacted that way.' },
          { id: 'keep', t: '“Not my problem.” Keep the ball.', q: 'unhelpful', next: 'end_stormy', why: 'Holding on to the ball keeps the conflict going and pulls the whole team into it.' },
        ],
      },
      n_cool: {
        scene: 'bench',
        lines: [
          N('You sit on the bench. In for four, out for four. Your heartbeat slows down.'),
          N('A few minutes later, Kofi walks over, rubbing his arm.'),
          L('kofi', 'sad', 'Hey… I didn’t mean to knock you over.'),
        ],
        choices: [
          { id: 'both', t: '“I know. I’m sorry I pushed you too. Want to finish the game?”', q: 'helpful', next: 'end_repair', why: 'Both of you made mistakes and both of you are fixing them. That’s what repair looks like.' },
          { id: 'coach', t: '“Can we ask Coach Daniel to help us sort this out?”', q: 'helpful', next: 'end_coach', why: 'Asking a trusted adult to help is not “telling on” someone. It’s a strong choice when feelings are still big.' },
        ],
      },
      end_bright: {
        scene: 'field',
        lines: [
          L('kofi', 'happy', 'Deal. And nice dribbling, by the way.'),
          N('The game restarts. Ten minutes later, Kofi passes you the ball and you score the winner.'),
        ],
        end: {
          tone: 'bright',
          title: 'Teammates again',
          happened: 'You paused before reacting, said how you felt, and listened to Kofi’s side. It turned out to be an accident.',
          feel: 'Kofi probably felt guilty and worried at first, then relieved and grateful that you gave him a chance to explain.',
          why: 'Accidents feel like attacks when we are hurt. Asking “what happened?” before deciding gave the truth a chance to come out.',
          try: ['Ask a friend to help you clean your scrape before playing again.', 'Laugh it off together if the laughing kids bother you.'],
          reflect: 'Think of a time something felt on purpose but was really an accident. What helped you find out?',
        },
      },
      end_repair: {
        scene: 'field',
        lines: [
          L('kofi', 'calm', 'I’m sorry too. I should have looked where I was running.'),
          N('You shake hands. Coach Daniel nods at you both. The game starts again.'),
        ],
        end: {
          tone: 'bright',
          title: 'Mistakes repaired',
          happened: 'Things got bumpy, but you came back, explained your feelings and apologised for your part.',
          feel: 'Kofi felt attacked at first. When you apologised, he felt respected enough to apologise too.',
          why: 'Repair is a superpower. Even after a mistake, saying sorry and explaining the feeling behind it can fix a friendship.',
          try: ['Next time, try the slow breath before reacting, so there is less to repair.', 'Tell Kofi something you like about playing with him.'],
          reflect: 'What does your body feel like when you are about to get angry? What could you do at that moment?',
        },
      },
      end_mixed: {
        scene: 'bench',
        lines: [
          N('Kofi sits on the bench for the rest of break. He doesn’t look at you.'),
          L('kofi', 'sad', 'I said I was sorry…'),
        ],
        end: {
          tone: 'mixed',
          title: 'Game on, friend on the bench',
          happened: 'Kofi apologised, but he had to sit out for an accident. The game went on without him.',
          feel: 'Kofi probably feels left out and a bit embarrassed, like his apology didn’t matter.',
          why: 'Wanting fairness is understandable. But when someone sincerely apologises for an accident, punishing them can hurt the friendship more than the fall hurt your knee.',
          try: ['“Thanks for saying sorry. Let’s keep playing, but slow down near the goal.”', 'Ask Kofi to help you set the rule about tackling for the whole game.'],
          reflect: 'What is the difference between an accident and doing something on purpose? Should they be handled the same way?',
        },
      },
      end_coach: {
        scene: 'field',
        lines: [
          L('daniel', 'calm', 'Thanks for coming to me, you two. Let’s each say what happened, one at a time.'),
          N('You both explain. Coach Daniel suggests a “no slide tackles” rule. Everyone agrees.'),
        ],
        end: {
          tone: 'bright',
          title: 'A new rule for everyone',
          happened: 'You cooled down, then asked a trusted adult to help you and Kofi talk it through. The problem turned into a better rule.',
          feel: 'Kofi probably felt nervous about the coach at first, then relieved that it was about solving, not punishing.',
          why: 'Some conflicts are easier to solve with a helper. Coach Daniel made sure both of you got heard.',
          try: ['Try saying sorry for the push yourself too.', 'Remind the team about the new rule before the next game.'],
          reflect: 'Who are the trusted adults you could ask for help when a conflict feels too big?',
        },
      },
      end_stormy: {
        scene: 'field',
        lines: [
          N('Coach Daniel blows his whistle and walks over. Break time is over for both of you.'),
          L('kofi', 'angry', 'Whatever. I’m not playing with you anymore.'),
        ],
        end: {
          tone: 'stormy',
          title: 'A tangled ending',
          happened: 'An accident turned into a fight. You both lost the game, and you both feel worse.',
          feel: 'Kofi probably feels angry and unfairly blamed. Underneath, he might be sad about losing a friend to play with.',
          why: 'When we are hurt and embarrassed, it is very normal to want to hit back. But blaming and pushing kept the problem growing instead of shrinking.',
          try: ['Pause and take a slow breath before you react.', 'Ask “what happened?” before deciding it was on purpose.', 'Tomorrow, try: “I’m sorry I pushed you. Can we start over?”'],
          reflect: 'If you could rewind to the moment you fell, what would you do differently? Rewind and try it!',
        },
      },
    },
  },
  {
    id: 'conflict-markers',
    mode: 'conflict',
    title: 'The Missing Markers',
    blurb: 'Your brand-new markers are on Leo’s desk, and one is dried out.',
    skills: ['conflict', 'communication'],
    minutes: 5,
    cast: ['leo'],
    start: 'n1',
    nodes: {
      n1: {
        scene: 'classroom',
        lines: [
          N('You got a new set of 24 markers for your birthday. You saved them for the art project.'),
          N('After lunch you find them on Leo’s desk. He’s colouring a poster. The blue one has no cap and is completely dried out.'),
          L('you', 'frustrated', 'Those are MINE. And I didn’t even get to use the blue one yet.'),
        ],
        choices: [
          { id: 'snatch', t: 'Snatch the markers back: “Thief!”', q: 'unhelpful', next: 'n_snatch', why: 'Your markers matter and your anger makes sense. But calling Leo a thief in front of everyone will make him defensive instead of sorry.' },
          { id: 'ask', t: '“Leo, those are my markers. Can you tell me why you have them?”', q: 'helpful', next: 'n_ask', why: 'Stating the fact calmly and asking a question gives Leo a chance to explain. Maybe there’s something you don’t know yet.' },
          { id: 'quiet', t: 'Say nothing, but feel angry all afternoon.', q: 'mixed', next: 'n_quiet', why: 'Staying quiet avoids a scene, but the feeling stays inside and the problem doesn’t get solved.' },
        ],
      },
      n_snatch: {
        scene: 'classroom',
        lines: [
          N('A marker flies off the desk. The class goes silent.'),
          L('leo', 'embarrassed', 'I’m NOT a thief! Ms. Uwase said we could borrow from the art table. They were there!'),
        ],
        choices: [
          { id: 'oops', t: '“Oh… I left them on the art table? I’m sorry I called you a thief.”', q: 'helpful', next: 'end_fixit', why: 'When we learn new information, it’s brave to change our mind out loud and apologise.' },
          { id: 'still', t: '“Well, you still ruined my blue one!”', q: 'mixed', next: 'n_blue', why: 'The blue marker really did get ruined, so this feeling is fair. The way it’s said, though, still sounds like an attack.' },
        ],
      },
      n_ask: {
        scene: 'classroom',
        lines: [
          L('leo', 'surprised', 'Wait, they’re yours? They were on the art table. I thought they were for everyone.'),
          N('You remember: you put them down there before lunch.'),
        ],
        choices: [
          { id: 'explain', t: '“I left them there by mistake. Could you ask next time? And the blue one dried out.”', q: 'helpful', next: 'n_blue_calm', why: 'You owned your part (leaving them out) and explained the problem clearly. That’s fair to both of you.' },
          { id: 'forget', t: '“Oh, okay. Never mind.” Take them back quietly.', q: 'mixed', next: 'end_quiet', why: 'It’s kind not to make a fuss, but Leo doesn’t learn that the blue one dried out, and you still feel bad about it.' },
        ],
      },
      n_quiet: {
        scene: 'classroom',
        lines: [
          N('All afternoon, you stare at Leo using your markers. Your stomach feels tight.'),
          N('At home time, he leaves them on the art table. The blue one is still capless.'),
        ],
        choices: [
          { id: 'tomorrow', t: 'Next morning, say: “Leo, yesterday you used my markers. I felt upset. Can we talk?”', q: 'helpful', next: 'n_ask', why: 'It’s never too late to speak up calmly. Giving yourself time to cool down first can even help.' },
          { id: 'revenge', t: 'Take Leo’s pencil case to see how he likes it.', q: 'unhelpful', next: 'end_stormy', why: 'Revenge feels fair in the moment, but it makes two problems instead of one.' },
        ],
      },
      n_blue: {
        scene: 'classroom',
        lines: [
          L('leo', 'frustrated', 'I didn’t know they were yours! How was I supposed to know?'),
          N('Ms. Uwase walks over. She asks you both to step into the corridor.'),
        ],
        choices: [
          { id: 'calm', t: 'Take a breath: “You’re right, you didn’t know. I’m upset about the blue one.”', q: 'helpful', next: 'end_fixit', why: 'You separated what Leo did wrong (left the cap off) from what he didn’t (stealing). That’s fair thinking.' },
          { id: 'sulk', t: 'Cross your arms and refuse to talk.', q: 'unhelpful', next: 'end_stormy', why: 'Refusing to talk when an adult is trying to help means nobody can understand your side.' },
        ],
      },
      n_blue_calm: {
        scene: 'classroom',
        lines: [
          L('leo', 'embarrassed', 'Oh no. I’m really sorry. I forgot to put the cap back.'),
          N('Leo looks in his bag and pulls out his own blue marker.'),
          L('leo', 'hopeful', 'You can have this one. It’s almost new.'),
        ],
        choices: [
          { id: 'thanks', t: '“Thanks, Leo. That’s really fair.”', q: 'helpful', next: 'end_bright', why: 'Accepting someone’s way of making it right helps both of you move on.' },
          { id: 'share', t: '“Keep it. Let’s share my set for the project instead, and keep caps on!”', q: 'helpful', next: 'end_bright', why: 'Turning a conflict into cooperation is a great outcome. There’s more than one good answer here!' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [N('You and Leo finish your posters side by side. He reminds everyone at the table: “Caps on!”')],
        end: {
          tone: 'bright',
          title: 'Problem solved together',
          happened: 'You asked instead of accusing, discovered it was a mix-up, and explained the real problem. Leo made it right.',
          feel: 'Leo felt surprised and a bit embarrassed, then good about being able to fix his mistake.',
          why: 'Asking a question first helps you find out what really happened. Sometimes the other person didn’t know they were doing something wrong.',
          try: ['Label your belongings so mix-ups happen less.', 'Suggest a “caps on” rule for the art table.'],
          reflect: 'Why do you think asking “why do you have them?” worked better than accusing?',
        },
      },
      end_fixit: {
        scene: 'hallway',
        lines: [
          L('leo', 'calm', 'It’s okay. I should have asked whose they were. Sorry about the blue one.'),
          N('Ms. Uwase smiles. “That’s how you fix a mix-up.”'),
        ],
        end: {
          tone: 'bright',
          title: 'A rocky start, a good finish',
          happened: 'Your first reaction was big, but you listened, changed your mind with new information, and apologised.',
          feel: 'Leo felt embarrassed and hurt when he was called a thief in front of the class. Your apology helped him feel respected again.',
          why: 'Calling someone a name in public hurts more than we expect. Fixing it quickly made a big difference.',
          try: ['Next time, ask a question before you accuse.', 'Tell Leo you’re sorry in front of the same people who heard you shout.'],
          reflect: 'How would you feel if someone called you a thief by mistake? What would you want them to do?',
        },
      },
      end_quiet: {
        scene: 'classroom',
        lines: [N('You put the markers away. Leo goes back to his poster. You still feel sad every time you see the dried-out blue one.')],
        end: {
          tone: 'mixed',
          title: 'Quiet, but not quite solved',
          happened: 'You got your markers back peacefully, but you didn’t mention the ruined blue marker.',
          feel: 'Leo feels fine. He doesn’t even know there was a problem. You still feel a little upset.',
          why: 'Being calm was great. But your feelings matter too. Speaking up kindly lets the other person help fix it.',
          try: ['“One more thing, the blue one dried out because the cap was off. Can you help me with that?”'],
          reflect: 'Is it hard for you to speak up about something that bothers you? What words could make it easier?',
        },
      },
      end_stormy: {
        scene: 'classroom',
        lines: [N('Now Leo is upset too. You both go home angry, and the art project feels ruined.')],
        end: {
          tone: 'stormy',
          title: 'Two problems instead of one',
          happened: 'The conflict grew bigger. Nobody found out it was a mix-up, and both of you feel wronged.',
          feel: 'Leo probably feels blamed for something he didn’t know was wrong, and now he’s upset too.',
          why: 'Feeling angry about your markers is completely normal. Revenge or silence just didn’t give the truth a chance to come out.',
          try: ['Ask a calm question: “Why do you have my markers?”', 'Name the feeling: “I feel upset because they’re new.”', 'Ask Ms. Uwase for help if talking feels too hard.'],
          reflect: 'Rewind the story and try asking Leo a question first. What changes?',
        },
      },
    },
  },
  {
    id: 'conflict-project',
    mode: 'conflict',
    title: 'The Volcano Project',
    blurb: 'Zara wants to do everything her way and Tomás isn’t helping.',
    skills: ['cooperation', 'conflict', 'communication'],
    minutes: 6,
    cast: ['zara', 'tomas'],
    start: 'n1',
    requires: 'conflict-markers',
    nodes: {
      n1: {
        scene: 'classroom',
        lines: [
          N('Your group, you, Zara and Tomás, has one week to build a model volcano that really erupts.'),
          L('zara', 'proud', 'I’ve planned it all. I’ll build, I’ll paint, I’ll present. You two can just hold things.'),
          L('tomas', 'neutral', '…Okay, whatever.'),
          N('Tomás puts his headphones on. You had a really cool idea for the lava.'),
        ],
        choices: [
          { id: 'roles', t: '“Zara, your plan is good. Can we split the jobs so we all get to do something?”', q: 'helpful', next: 'n_roles', why: 'Starting with something positive about her plan makes Zara more likely to listen. Then you suggested a fair change.' },
          { id: 'boss', t: '“You’re so bossy! It’s not YOUR project.”', q: 'unhelpful', next: 'n_boss', why: 'Zara might be bossy right now, but calling her bossy is a label. Labels make people defend themselves instead of change.' },
          { id: 'teacher', t: 'Go and tell Ms. Uwase that your group isn’t working.', q: 'mixed', next: 'n_teacher', why: 'Asking for help is good, but trying to talk to your group first gives everyone a chance to fix it themselves.' },
        ],
      },
      n_roles: {
        scene: 'classroom',
        lines: [
          L('zara', 'worried', 'But… last time my group got a bad mark because someone didn’t do their part.'),
          N('Oh. Zara isn’t just bossy. She’s worried.'),
          L('tomas', 'sad', 'I’m not good at building stuff anyway.'),
        ],
        choices: [
          { id: 'strengths', t: '“Tomás, you’re great at drawing. Could you design the labels and poster? I’ll do the lava.”', q: 'helpful', next: 'end_bright', why: 'You noticed what each person is good at. Matching jobs to strengths makes cooperation easier.' },
          { id: 'checklist', t: '“Let’s make a checklist so Zara can see everyone is doing their part.”', q: 'helpful', next: 'end_checklist', why: 'You understood Zara’s worry and found a way to make her feel safe sharing the work.' },
        ],
      },
      n_boss: {
        scene: 'classroom',
        lines: [
          L('zara', 'angry', 'Fine! Then I’ll do it ALONE and you can explain to Ms. Uwase why you did nothing.'),
          N('Zara turns her chair away. Tomás sinks lower in his seat.'),
        ],
        choices: [
          { id: 'restart', t: '“Sorry, that came out wrong. I just want to help. Can we start over?”', q: 'helpful', next: 'n_roles', why: 'A quick “that came out wrong” can rescue a conversation. It shows you care more about the group than about winning.' },
          { id: 'fine', t: '“Fine, do it alone then.”', q: 'unhelpful', next: 'end_stormy', why: 'Giving up on the group means the work isn’t shared, and nobody learns how to cooperate.' },
        ],
      },
      n_teacher: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'Thank you for telling me. Have you tried talking about it as a group first?'),
          L('you', 'embarrassed', 'Not really…'),
          L('uwase', 'happy', 'Give it a try. If it still doesn’t work, come back and I’ll help.'),
        ],
        choices: [
          { id: 'try', t: 'Go back: “Can we each say what we’d like to do?”', q: 'helpful', next: 'n_roles', why: 'Asking everyone to share gives the quiet people, like Tomás, a chance to speak.' },
          { id: 'give', t: 'Sit down and let Zara do it all.', q: 'mixed', next: 'end_mixed', why: 'Keeping the peace is nice, but your ideas and Tomás’s ideas get lost.' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [
          N('Zara builds the cone, you mix the lava, and Tomás draws a poster so good other groups come to look.'),
          N('On presentation day, the volcano erupts perfectly. Zara grins at both of you.'),
        ],
        end: {
          tone: 'bright',
          title: 'An eruption of teamwork',
          happened: 'You found out why Zara was controlling, why Tomás had given up, and matched the jobs to everyone’s strengths.',
          feel: 'Zara felt relieved that others cared about the project. Tomás felt valued for the first time in the group.',
          why: 'Behind “bossy” there was worry, and behind “whatever” there was feeling not good enough. Curiosity found both.',
          try: ['Ask quiet group members directly what they would enjoy doing.', 'Celebrate each person’s part when you present.'],
          reflect: 'When someone acts bossy or doesn’t help, what feelings might be hiding underneath?',
        },
      },
      end_checklist: {
        scene: 'classroom',
        lines: [N('You draw a checklist with three columns. Every day, everyone ticks off their jobs. Zara relaxes. Tomás even adds his own idea: glow-in-the-dark lava.')],
        end: {
          tone: 'bright',
          title: 'A plan everyone trusts',
          happened: 'You understood Zara’s worry and built a system that made sharing the work feel safe.',
          feel: 'Zara felt understood, not judged. Tomás felt like part of the team.',
          why: 'When you solve the worry behind a behaviour, the behaviour often changes on its own.',
          try: ['Check in with the group halfway through the week.', 'Ask Tomás which part he’d like to present.'],
          reflect: 'Have you ever acted bossy because you were worried? What would have helped you?',
        },
      },
      end_mixed: {
        scene: 'classroom',
        lines: [N('Zara builds a good volcano on her own. The group gets a decent mark. But you and Tomás never really got to take part.')],
        end: {
          tone: 'mixed',
          title: 'Done, but not together',
          happened: 'There was no fighting, but the work wasn’t shared and two people’s ideas were never heard.',
          feel: 'Zara is probably tired and stressed from doing everything. Tomás feels like he doesn’t matter in groups.',
          why: 'Peace without fairness only lasts a little while. Group work needs everyone’s voice.',
          try: ['“Zara, I have an idea for the lava. Can I show you?”', 'Invite Tomás: “What would you like to do?”'],
          reflect: 'Why is it important for everyone in a group to have a job?',
        },
      },
      end_stormy: {
        scene: 'classroom',
        lines: [N('Zara works alone and is exhausted by Friday. The volcano doesn’t erupt. Ms. Uwase asks why the group didn’t work together.')],
        end: {
          tone: 'stormy',
          title: 'A volcano that didn’t erupt',
          happened: 'The group split apart. Nobody shared ideas, and the project suffered.',
          feel: 'Zara probably feels overwhelmed and alone. Tomás feels left out. You might feel frustrated too.',
          why: 'It’s really frustrating when someone takes over. Labels like “bossy” and giving up just made the split wider.',
          try: ['Start with something positive about the other person’s idea.', 'Ask why someone is acting the way they are.', 'Suggest dividing jobs by strengths.'],
          reflect: 'Rewind and try asking the group to split the jobs. What happens to Zara?',
        },
      },
    },
  },
  {
    id: 'conflict-excluded',
    mode: 'conflict',
    title: 'Only Four Can Play',
    blurb: 'Nia’s group won’t let you join their game at break.',
    skills: ['conflict', 'friendship', 'calm'],
    minutes: 5,
    cast: ['nia', 'keza'],
    start: 'n1',
    requires: 'conflict-project',
    nodes: {
      n1: {
        scene: 'playground',
        lines: [
          N('Nia, Keza and two others are playing a clapping game you love. You walk over.'),
          L('you', 'hopeful', 'Can I play too?'),
          L('nia', 'neutral', 'Sorry, it only works with four people.'),
          N('Keza looks at the ground. Your chest feels heavy.'),
        ],
        choices: [
          { id: 'rule', t: '“That’s not a real rule! You just don’t like me.”', q: 'unhelpful', next: 'n_rule', why: 'Feeling rejected really hurts, and it’s easy to think the worst. Accusing them makes it harder for them to change their mind.' },
          { id: 'idea', t: '“Oh. Could I play the next round, or could we try a version with five?”', q: 'helpful', next: 'n_idea', why: 'You stayed friendly and offered solutions. That gives the group an easy way to say yes.' },
          { id: 'leave', t: 'Walk away and play somewhere else.', q: 'mixed', next: 'n_leave', why: 'Looking after yourself is okay! Some days, finding another game is the right call. But the feeling might still need care.' },
        ],
      },
      n_rule: {
        scene: 'playground',
        lines: [
          L('nia', 'frustrated', 'See, this is why. You always make a big deal about everything.'),
          N('The others start the game again without looking at you.'),
        ],
        choices: [
          { id: 'breathe', t: 'Walk to a quiet spot and take a few slow breaths.', q: 'helpful', next: 'n_leave', why: 'When feelings get big, stepping back to calm down is a smart first move.' },
          { id: 'tell', t: 'Shout that you’ll tell everyone Nia is mean.', q: 'unhelpful', next: 'end_stormy', why: 'Threatening to spread things about someone turns you into part of the problem.' },
        ],
      },
      n_idea: {
        scene: 'playground',
        lines: [
          L('keza', 'hopeful', 'We could do the version with a leader in the middle! That works with five.'),
          L('nia', 'neutral', 'Hmm… okay, fine. But you have to learn the new song.'),
        ],
        choices: [
          { id: 'join', t: '“Deal! Can you teach me?”', q: 'helpful', next: 'end_bright', why: 'Being open to learning their way shows you want to be part of the group, not take it over.' },
          { id: 'extra', t: 'Join, and invite Mei, who is standing alone nearby, too.', q: 'helpful', next: 'end_bright_mei', why: 'You know what being left out feels like, and you used that to include someone else. That’s empathy in action.' },
        ],
      },
      n_leave: {
        scene: 'playground',
        lines: [
          N('You sit on the steps. Being left out still stings.'),
          N('You notice Mei, the new girl, also sitting alone, drawing in a notebook.'),
        ],
        choices: [
          { id: 'mei', t: 'Go over: “Hi Mei, what are you drawing?”', q: 'helpful', next: 'end_newfriend', why: 'Turning a sad moment into a chance to connect with someone else is a powerful way to feel better.' },
          { id: 'adult', t: 'Tell Ms. Uwase that you keep getting left out.', q: 'helpful', next: 'end_adult', why: 'If being excluded happens again and again, telling a trusted adult is exactly the right thing to do.' },
          { id: 'sulk', t: 'Sit alone and decide that nobody likes you.', q: 'unhelpful', next: 'end_lonely', why: 'One group saying no doesn’t mean nobody likes you. That thought can make things feel much worse than they are.' },
        ],
      },
      end_bright: {
        scene: 'playground',
        lines: [N('Keza teaches you the new song. By the end of break, you’re the fastest clapper in the circle. Nia even laughs at your joke.')],
        end: {
          tone: 'bright',
          title: 'Room for one more',
          happened: 'You stayed friendly and suggested a way to include you. Keza found a five-player version.',
          feel: 'Nia might have been worried about the game changing. Keza probably felt uncomfortable about leaving you out and was happy to help.',
          why: 'Groups often say no because changing feels hard, not because they dislike you. Offering an easy solution helped.',
          try: ['Thank Keza for speaking up for you.', 'Next time, ask to join at the start of a round.'],
          reflect: 'How did it feel when you were told no? What helped you stay calm?',
        },
      },
      end_bright_mei: {
        scene: 'playground',
        lines: [N('Mei smiles for the first time all week. Now six people are playing, and Keza invents an even better version of the game.')],
        end: {
          tone: 'bright',
          title: 'The circle gets bigger',
          happened: 'You got yourself included, and then you included someone else who was alone.',
          feel: 'Mei felt seen and welcome. Being invited when you’re new can make your whole week.',
          why: 'You remembered how being left out felt and made sure someone else didn’t feel that way.',
          try: ['Sit with Mei at lunch too.', 'Look out for others standing alone at break.'],
          reflect: 'Why do you think it’s easier to notice people who are left out once it has happened to you?',
        },
      },
      end_newfriend: {
        scene: 'playground',
        lines: [
          L('mei', 'happy', 'It’s a dragon. Do you want to help me name it?'),
          N('You spend the whole break inventing a dragon story together.'),
        ],
        end: {
          tone: 'bright',
          title: 'A new friend',
          happened: 'You didn’t get into the game, but you looked after your feelings and made a new connection.',
          feel: 'Mei felt lonely too. Your question probably made her feel noticed and happy.',
          why: 'You can’t control whether a group includes you, but you can control what you do next.',
          try: ['If being left out keeps happening, tell a trusted adult.', 'Ask Nia’s group to join next time, at the start of the game.'],
          reflect: 'What can you do to feel better when you have been left out?',
        },
      },
      end_adult: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'Thank you for telling me. That sounds really hard. Let’s think about what could help, together.'),
          N('Later that week, Ms. Uwase teaches the class some new games that everyone can join.'),
        ],
        end: {
          tone: 'bright',
          title: 'A helper on your side',
          happened: 'You recognised that being left out again and again is a real problem and asked a trusted adult for help.',
          feel: 'You might have felt nervous telling, then relieved to be heard.',
          why: 'Repeated exclusion is a kind of unkindness that adults should know about. Telling is not tattling. It’s getting help.',
          try: ['Keep telling an adult if it keeps happening.', 'Find a buddy to play with in the meantime.'],
          reflect: 'What is the difference between tattling and getting help?',
        },
      },
      end_lonely: {
        scene: 'playground',
        lines: [N('Break time feels very long. You go back to class feeling sad and small.')],
        end: {
          tone: 'stormy',
          title: 'A heavy feeling',
          happened: 'Being left out hurt, and the hurt grew into a big, unfair thought: “nobody likes me.”',
          feel: 'You feel lonely. Mei, sitting nearby, probably felt the same way, and neither of you knew.',
          why: 'Our minds sometimes turn one bad moment into a story about everything. Noticing that thought is the first step to changing it.',
          try: ['Say to yourself: “One group said no. That doesn’t mean everyone.”', 'Say hi to someone else who is alone.', 'Talk to a trusted adult about how you feel.'],
          reflect: 'What would you say to a friend who thought “nobody likes me”?',
        },
      },
      end_stormy: {
        scene: 'playground',
        lines: [N('Nia’s friends look at you warily for the rest of the week. The group is even less likely to include you now.')],
        end: {
          tone: 'stormy',
          title: 'Further apart',
          happened: 'Hurt turned into anger and threats, which made the group feel they were right to keep you out.',
          feel: 'Nia probably feels angry and a little scared of what you might say. You feel rejected and alone.',
          why: 'Being excluded hurts a lot, so these feelings make sense. But threats push people further away.',
          try: ['Offer a friendly idea: “Could we play with five?”', 'Find another game, then talk to an adult if it keeps happening.'],
          reflect: 'Rewind and try suggesting a five-player game. What does Keza do?',
        },
      },
    },
  },
  {
    id: 'conflict-rumor',
    mode: 'conflict',
    title: 'The Rumour',
    blurb: 'Someone says Ira told everyone you cheated on the spelling test.',
    skills: ['conflict', 'communication', 'decisions'],
    minutes: 6,
    cast: ['ira', 'sam'],
    start: 'n1',
    requires: 'conflict-excluded',
    nodes: {
      n1: {
        scene: 'hallway',
        lines: [
          N('You got 20 out of 20 on your spelling test. You studied for days.'),
          L('sam', 'worried', 'Hey… Ira is telling people you copied from the answer sheet. Half the class thinks you cheated.'),
          N('Ira is your friend. Your face goes hot and your hands shake.'),
        ],
        choices: [
          { id: 'confront', t: 'Storm over to Ira in front of everyone: “You LIAR!”', q: 'unhelpful', next: 'n_confront', why: 'Being lied about is one of the worst feelings. But a public showdown makes Ira defend herself instead of telling the truth.' },
          { id: 'check', t: 'Ask Sam: “Did you hear Ira say it herself?”', q: 'helpful', next: 'n_check', why: 'Rumours change as they travel. Checking where it came from before reacting is wise.' },
          { id: 'spread', t: 'Start a rumour about Ira to get back at her.', q: 'unhelpful', next: 'end_stormy', why: 'Spreading a rumour to fight a rumour makes the hurt grow for everyone.' },
        ],
      },
      n_confront: {
        scene: 'hallway',
        lines: [
          L('ira', 'embarrassed', 'What?! I didn’t say you cheated! I said you got full marks and I didn’t know how!'),
          N('Everyone is watching. Ira looks like she might cry.'),
        ],
        choices: [
          { id: 'private', t: '“Can we talk somewhere quieter?”', q: 'helpful', next: 'n_private', why: 'Moving a hard talk to a private place helps people be honest instead of putting on a show.' },
          { id: 'storm', t: 'Turn around and walk off angry.', q: 'mixed', next: 'end_mixed', why: 'Leaving stopped the scene, but the misunderstanding wasn’t cleared up.' },
        ],
      },
      n_check: {
        scene: 'hallway',
        lines: [
          L('sam', 'neutral', 'Well… no. Leo told me that Zara heard Ira say something.'),
          N('That’s three people away from Ira. Things get twisted as they travel.'),
        ],
        choices: [
          { id: 'ask', t: 'Find Ira alone at lunch: “I heard something that upset me. Can I ask you about it?”', q: 'helpful', next: 'n_private', why: 'Going straight to the source, privately and calmly, is the best way to find the truth.' },
          { id: 'adult', t: 'Tell Ms. Uwase you’re worried people think you cheated.', q: 'helpful', next: 'end_adult', why: 'When a rumour is about something important like cheating, it’s fine to ask an adult for help.' },
        ],
      },
      n_private: {
        scene: 'bench',
        lines: [
          L('ira', 'sad', 'I really didn’t say you cheated. I said “I don’t know how they got full marks, I only got 12.” I was jealous, I guess.'),
          L('ira', 'embarrassed', 'I’m sorry it turned into this.'),
        ],
        choices: [
          { id: 'fix', t: '“Thanks for telling me. Will you help me tell people the truth?”', q: 'helpful', next: 'end_bright', why: 'You asked Ira to help fix the damage. That repairs your reputation and your friendship.' },
          { id: 'study', t: '“I studied every night. Want to study with me for the next test?”', q: 'helpful', next: 'end_study', why: 'You understood the jealousy behind Ira’s words and offered friendship instead of blame.' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [N('Ira tells the class she was wrong. “They studied hard. I was just grumpy about my score.” The whispers stop.')],
        end: {
          tone: 'bright',
          title: 'Truth travels too',
          happened: 'You checked the facts, talked privately, and asked Ira to help set things straight.',
          feel: 'Ira felt guilty and embarrassed, but also relieved to fix it. You felt respected again.',
          why: 'Rumours twist as they spread. Going to the source calmly let you find out what was really said.',
          try: ['Next time you hear a rumour about someone else, don’t pass it on.'],
          reflect: 'How can you check if something you hear about someone is true?',
        },
      },
      end_study: {
        scene: 'library',
        lines: [N('The next week, you and Ira study in the library together. She gets 17 out of 20 and does a happy dance.')],
        end: {
          tone: 'bright',
          title: 'From jealous to study buddies',
          happened: 'You discovered that Ira’s comment came from feeling jealous and disappointed, and you turned it into teamwork.',
          feel: 'Ira felt ashamed of her score. Your offer made her feel supported instead of judged.',
          why: 'Understanding why someone said something hurtful can help you respond with kindness, while still setting the record straight.',
          try: ['Also ask Ira to tell others the truth, so the rumour stops.'],
          reflect: 'Have you ever said something unkind because you felt jealous? What happened?',
        },
      },
      end_adult: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'I know how hard you studied. I’ll talk to the class about rumours, without naming anyone.'),
          N('The next day, Ms. Uwase leads a talk on how rumours hurt. Ira finds you afterwards to say sorry.'),
        ],
        end: {
          tone: 'bright',
          title: 'Help from a trusted adult',
          happened: 'You didn’t react with anger. You asked a trusted adult to help, and the rumour lost its power.',
          feel: 'Ira probably felt guilty when she realised how far her words had travelled.',
          why: 'Some problems, especially ones about fairness or reputation, are fine to bring to a teacher.',
          try: ['You could also talk to Ira yourself, so you hear her side.'],
          reflect: 'When is it a good idea to ask an adult for help with a friendship problem?',
        },
      },
      end_mixed: {
        scene: 'hallway',
        lines: [N('People keep whispering for days. You and Ira avoid each other. You both miss being friends.')],
        end: {
          tone: 'mixed',
          title: 'A misunderstanding left hanging',
          happened: 'The confrontation stopped, but nobody found out what was really said.',
          feel: 'Ira feels embarrassed and accused. You still feel hurt and misjudged.',
          why: 'Walking away to cool down is good, but coming back to talk is what clears things up.',
          try: ['“Ira, can we talk about what happened? I want to understand.”'],
          reflect: 'What makes it hard to go back and talk after an argument?',
        },
      },
      end_stormy: {
        scene: 'hallway',
        lines: [N('Now there are two rumours going around. Ms. Uwase has to stop the class to talk about it. Both you and Ira are hurt.')],
        end: {
          tone: 'stormy',
          title: 'Rumour vs. rumour',
          happened: 'Getting back at Ira made the whole class part of the conflict.',
          feel: 'Ira feels hurt and attacked. Others feel confused about who to believe.',
          why: 'Being lied about makes us want revenge. That’s a very human feeling. But revenge rumours only make more people get hurt.',
          try: ['Check where a rumour came from before reacting.', 'Talk to the person privately.', 'Ask a trusted adult for help.'],
          reflect: 'Rewind and try checking where the rumour came from. What do you discover?',
        },
      },
    },
  },
  {
    id: 'conflict-tablet',
    mode: 'conflict',
    title: 'One Tablet, Two Players',
    blurb: 'You and Sam both reach for the last tablet during free time.',
    skills: ['conflict', 'cooperation', 'decisions'],
    minutes: 4,
    cast: ['sam'],
    start: 'n1',
    nodes: {
      n1: {
        scene: 'library',
        lines: [
          N('Free time in the library. There’s one tablet left with the drawing app, and you and Sam grab it at the same time.'),
          L('sam', 'frustrated', 'I touched it first!'),
          L('you', 'frustrated', 'No, I did!'),
        ],
        choices: [
          { id: 'pull', t: 'Pull it harder towards you.', q: 'unhelpful', next: 'n_pull', why: 'A tug-of-war can break the tablet and turns the problem into who is stronger, not what is fair.' },
          { id: 'timer', t: '“What if we take turns, ten minutes each? We can use the clock.”', q: 'helpful', next: 'n_timer', why: 'Turn-taking with a clear rule is one of the fairest ways to share something both people want.' },
          { id: 'together', t: '“Want to draw something together on it?”', q: 'helpful', next: 'end_together', why: 'Sometimes the best solution is one where you both get what you want at the same time.' },
        ],
      },
      n_pull: {
        scene: 'library',
        lines: [
          N('The librarian looks over. Sam pulls back. The tablet slips and clatters on the floor.'),
          L('sam', 'scared', 'Oh no… is it broken?'),
        ],
        choices: [
          { id: 'check', t: 'Pick it up together: “It’s okay, it still works. Let’s take turns.”', q: 'helpful', next: 'n_timer', why: 'Good recovery! Stopping the tug-of-war and switching to a fair plan is a strong choice, even after a rough start.' },
          { id: 'blame', t: '“You dropped it! I’m telling!”', q: 'unhelpful', next: 'end_stormy', why: 'You both pulled, so you both had a part. Blaming only one person isn’t fair and keeps the argument going.' },
        ],
      },
      n_timer: {
        scene: 'library',
        lines: [
          L('sam', 'neutral', 'Okay… but who goes first?'),
        ],
        choices: [
          { id: 'rps', t: '“Rock, paper, scissors?”', q: 'helpful', next: 'end_bright', why: 'A quick fair game for choosing removes the arguing. Simple and fun!' },
          { id: 'you', t: '“You go first. I’ll read until it’s my turn.”', q: 'helpful', next: 'end_kind', why: 'Letting someone else go first is generous, and it often makes them more generous back.' },
        ],
      },
      end_together: {
        scene: 'library',
        lines: [
          L('sam', 'happy', 'A comic! You draw the characters and I’ll do the backgrounds!'),
          N('Your comic about a dragon who loves libraries ends up on the class wall.'),
        ],
        end: {
          tone: 'bright',
          title: 'Better together',
          happened: 'Instead of fighting over who got the tablet, you found a way to both use it.',
          feel: 'Sam felt surprised and happy. A competitor became a creative partner.',
          why: 'When two people want the same thing, look for a “win–win”: a solution where nobody has to lose.',
          try: ['Turn-taking would also have been fair.'],
          reflect: 'Can you think of something you could share with a friend instead of taking turns?',
        },
      },
      end_bright: {
        scene: 'library',
        lines: [N('Sam wins with paper. You read a comic for ten minutes, then it’s your turn. Sam even shows you a cool brush he found.')],
        end: {
          tone: 'bright',
          title: 'Fair and square',
          happened: 'You suggested turns and a fair way to decide who starts.',
          feel: 'Sam felt it was fair, so he didn’t feel the need to argue.',
          why: 'When a rule is fair and clear, there’s nothing left to fight about.',
          try: ['Drawing together could also have worked.'],
          reflect: 'What are some fair ways to decide who goes first?',
        },
      },
      end_kind: {
        scene: 'library',
        lines: [N('After his ten minutes, Sam hands you the tablet early. “Thanks for letting me go first.”')],
        end: {
          tone: 'bright',
          title: 'Kindness comes back',
          happened: 'You let Sam go first, and he returned the kindness.',
          feel: 'Sam felt grateful and wanted to be fair back.',
          why: 'Generosity often makes others generous. It’s also okay to stand up for your turn when it matters to you.',
          try: ['If someone never gives you a turn, it’s okay to ask an adult for help.'],
          reflect: 'When is it good to let someone go first? When is it okay to ask for your turn?',
        },
      },
      end_stormy: {
        scene: 'library',
        lines: [N('The librarian takes the tablet away. “If you can’t share, nobody uses it.” You and Sam both sit with nothing to do.')],
        end: {
          tone: 'stormy',
          title: 'Nobody wins',
          happened: 'Pulling and blaming meant you both lost the tablet.',
          feel: 'Sam feels scared and blamed. You feel frustrated. Both of you are bored.',
          why: 'Wanting something badly is normal, but when we fight over it, it often gets taken away from everyone.',
          try: ['Suggest taking turns with a timer.', 'Use rock, paper, scissors to decide who goes first.', 'Look for a way to use it together.'],
          reflect: 'Rewind and try suggesting turns. Does Sam agree?',
        },
      },
    },
  },
  {
    id: 'conflict-bully',
    mode: 'conflict',
    title: 'The Lunch Line',
    blurb: 'An older student keeps taking your snack and making fun of you.',
    skills: ['bullying', 'decisions', 'calm'],
    minutes: 6,
    cast: ['jabari', 'amani', 'uwase'],
    start: 'n1',
    requires: 'conflict-rumor',
    nodes: {
      n1: {
        scene: 'lunch',
        lines: [
          N('For the third day in a row, Jabari, an older student, cuts in front of you in the lunch line.'),
          L('jabari', 'smirk', 'I’ll take that.'),
          N('He takes the banana off your tray and laughs. “What are you going to do about it, tiny?”'),
          N('Your friend Amani is behind you. Your stomach drops.'),
        ],
        choices: [
          { id: 'fight', t: 'Shove Jabari and grab the banana back.', q: 'unhelpful', next: 'n_fight', why: 'Wanting to stand up for yourself is right. But fighting someone bigger can get you hurt or in trouble, and it doesn’t stop the bullying.' },
          { id: 'firm', t: 'Stand tall and say in a steady voice: “Stop. Give it back.” Then walk to an adult.', q: 'helpful', next: 'n_firm', why: 'A short, firm message and walking towards help shows you won’t be an easy target, without starting a fight.' },
          { id: 'ignore', t: 'Say nothing and hope he stops.', q: 'mixed', next: 'n_ignore', why: 'Ignoring can work once. But when someone does it again and again, it’s bullying, and staying quiet usually lets it continue.' },
        ],
      },
      n_fight: {
        scene: 'lunch',
        lines: [
          N('Jabari barely moves. He pushes you back and you drop your tray. Food everywhere.'),
          L('jabari', 'smirk', 'Ha! Look at the mess you made.'),
          N('A lunch supervisor is walking towards you both.'),
        ],
        choices: [
          { id: 'truth', t: 'Tell the supervisor everything, including that this has happened three days in a row.', q: 'helpful', next: 'end_adult', why: 'Telling an adult the whole story, especially that it keeps happening, helps them see it’s bullying.' },
          { id: 'hide', t: 'Say “It was nothing” because you’re scared he’ll get you later.', q: 'mixed', next: 'n_ignore', why: 'Being scared of what might happen is completely understandable. But adults can only protect you if they know.' },
        ],
      },
      n_firm: {
        scene: 'lunch',
        lines: [
          L('jabari', 'surprised', 'Whoa, chill. It’s just a joke.'),
          N('He drops the banana on your tray. Amani steps up next to you.'),
          L('amani', 'calm', 'It’s not funny if it happens every day. Come on, let’s go.'),
        ],
        choices: [
          { id: 'tell', t: 'Tell Ms. Uwase what’s been happening, with Amani as your witness.', q: 'helpful', next: 'end_bright', why: 'Even when it stops for today, telling an adult makes sure it stops for good, for you and for others.' },
          { id: 'done', t: 'It stopped today, so let it go.', q: 'mixed', next: 'end_mixed', why: 'You handled the moment really well! But because it’s happened three days in a row, it might happen again.' },
        ],
      },
      n_ignore: {
        scene: 'lunch',
        lines: [
          N('The next day, Jabari takes your snack again. And the day after. He starts calling you “tiny” in the hallway.'),
          L('amani', 'worried', 'This isn’t okay. You should tell someone. I’ll come with you.'),
        ],
        choices: [
          { id: 'go', t: '“Okay. Let’s tell Ms. Uwase together.”', q: 'helpful', next: 'end_adult', why: 'Having a friend come with you can make telling much easier. It’s brave to ask for help.' },
          { id: 'no', t: '“No, it’ll make it worse.”', q: 'unhelpful', next: 'end_stormy', why: 'Many people worry that telling will make bullying worse. In fact, adults have ways to stop it safely. Staying silent usually lets it grow.' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'Thank you both for telling me. That took courage. This is not okay, and I will make sure it stops.'),
          N('The school talks to Jabari and his family. The lunch line has a supervisor now. Jabari never takes your food again.'),
        ],
        end: {
          tone: 'bright',
          title: 'Brave, firm and supported',
          happened: 'You stood up for yourself calmly, a friend backed you up, and you told a trusted adult.',
          feel: 'You may have felt scared, then relieved and proud. Amani felt proud to help.',
          why: 'Bullying is when someone keeps hurting or scaring a person who finds it hard to defend themselves. It’s not a normal conflict. The right move is to get adult help.',
          try: ['If you see someone else being bullied, stand with them and help them tell.'],
          reflect: 'Who could you tell if someone was bullying you? Who could you be a “backup” friend for?',
        },
      },
      end_adult: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'You did exactly the right thing by telling me. None of this is your fault.'),
          N('Ms. Uwase speaks with the headteacher. A plan is made to keep you safe at lunch.'),
        ],
        end: {
          tone: 'bright',
          title: 'Getting the right help',
          happened: 'Even after a rough moment, you told an adult the whole story and got help.',
          feel: 'You probably felt nervous about telling, then safer once someone knew.',
          why: 'Bullying is repeated and on purpose. It’s not something you should solve alone. Telling an adult is the strongest move.',
          try: ['Use a firm, short message like “Stop. Give it back.”', 'Walk towards adults or friends, not away from them.'],
          reflect: 'Why do you think people sometimes don’t tell anyone when they are being bullied?',
        },
      },
      end_mixed: {
        scene: 'hallway',
        lines: [N('A week later, Jabari is back to taking snacks, this time from a younger student. You wonder if you should have said something.')],
        end: {
          tone: 'mixed',
          title: 'Stopped for now',
          happened: 'You stood up for yourself brilliantly, but the pattern wasn’t reported, so it moved on to someone else.',
          feel: 'The younger student is now feeling what you felt. Scared, small and alone.',
          why: 'When unkind behaviour happens again and again, adults need to know so they can stop it for everyone.',
          try: ['It’s not too late. Tell Ms. Uwase now, with Amani.'],
          reflect: 'Why is reporting bullying good for other people, not just you?',
        },
      },
      end_stormy: {
        scene: 'hallway',
        lines: [N('The teasing gets worse. You start dreading lunch and even pretend to be sick so you can stay home.')],
        end: {
          tone: 'stormy',
          title: 'Carrying it alone',
          happened: 'The bullying continued because no adult knew about it.',
          feel: 'You feel scared and alone. Amani feels worried and helpless.',
          why: 'Being afraid that telling will make things worse is one of the most common feelings, and it’s okay to feel it. But bullying is too heavy to carry alone. Adults can help safely.',
          try: ['Tell a trusted adult. A teacher, parent or school counsellor.', 'Bring a friend with you when you tell.', 'Write it down if saying it out loud feels too hard.'],
          reflect: 'Rewind and let Amani help you tell. How does the story change?',
        },
      },
    },
  },
]
