const L = (w, e, t) => ({ w, e, t })
const N = t => ({ w: 'narrator', t })

export const COMMUNICATION_STORIES = [
  {
    id: 'comm-listen',
    mode: 'communication',
    layout: 'chat',
    title: 'Really Listening',
    blurb: 'Nia is nervous about the school play. Can you listen without fixing?',
    skills: ['communication', 'empathy'],
    minutes: 4,
    cast: ['nia'],
    start: 'n1',
    tip: 'Active listening means: look at the person, let them finish, show you understand, and ask questions.',
    nodes: {
      n1: {
        scene: 'bench',
        lines: [
          L('nia', 'worried', 'Can I tell you something? I got the main part in the school play.'),
          L('nia', 'worried', 'Everyone thinks it’s amazing, but I keep imagining forgetting my lines in front of the whole school.'),
        ],
        choices: [
          { id: 'reflect', t: '“So it’s exciting, but also really scary?”', q: 'helpful', next: 'n2', why: 'Repeating back what you heard, in your own words, shows Nia you really understood her. That’s called reflecting.' },
          { id: 'me', t: '“Oh, I was in a play once! I was a tree. It was so funny because…”', q: 'unhelpful', next: 'n_me', why: 'Sharing your story can feel friendly, but it moved the attention away from Nia when she needed it.' },
          { id: 'fix', t: '“Just practise more and you’ll be fine.”', q: 'mixed', next: 'n_fix', why: 'Practising is good advice! But jumping to advice before listening can make her feel unheard.' },
        ],
      },
      n_me: {
        scene: 'bench',
        lines: [
          L('nia', 'sad', '…Yeah. Ha. Anyway, never mind.'),
          N('Nia looks at her shoes. She’s stopped sharing.'),
        ],
        choices: [
          { id: 'back', t: '“Sorry, I got carried away. Tell me more about your worry.”', q: 'helpful', next: 'n2', why: 'Noticing you drifted and bringing the focus back is a great listening skill.' },
          { id: 'cont', t: 'Keep telling your tree story.', q: 'unhelpful', next: 'end_unheard', why: 'Nia has stopped talking about her feelings. She doesn’t feel listened to.' },
        ],
      },
      n_fix: {
        scene: 'bench',
        lines: [L('nia', 'frustrated', 'I HAVE been practising. Every night. That’s not the problem.')],
        choices: [
          { id: 'ask', t: '“Oh, sorry. What part worries you the most?”', q: 'helpful', next: 'n2', why: 'Asking an open question invites her to explain more. You switched from fixing to listening.' },
          { id: 'more', t: '“Well, practise even more then.”', q: 'unhelpful', next: 'end_unheard', why: 'Repeating advice that she’s told you isn’t the problem can feel dismissive.' },
        ],
      },
      n2: {
        scene: 'bench',
        lines: [
          L('nia', 'sad', 'Yes! Exactly. It’s the moment when everyone is looking at me. My mind goes blank.'),
          L('nia', 'worried', 'What if I freeze?'),
        ],
        choices: [
          { id: 'question', t: '“Has that happened before, or is it a worry about what might happen?”', q: 'helpful', next: 'n3', why: 'A gentle question helps Nia think about her worry more clearly.' },
          { id: 'nod', t: 'Nod, look at her, and wait for her to keep going.', q: 'helpful', next: 'n3', why: 'Sometimes the best listening is quiet. A pause gives people space to say more.' },
          { id: 'phone', t: 'Check your phone while she talks.', q: 'unhelpful', next: 'end_unheard', why: 'Looking away from someone when they share something important tells them you’re not really listening.' },
        ],
      },
      n3: {
        scene: 'bench',
        lines: [
          L('nia', 'calm', 'It hasn’t happened. I just worry it will. Talking about it actually helps.'),
          L('nia', 'hopeful', 'Do you… have any ideas?'),
        ],
        choices: [
          { id: 'offer', t: '“Now that you ask, what if I helped you practise in front of a few people first?”', q: 'helpful', next: 'end_bright', why: 'She asked for ideas, so now advice is welcome! Waiting until she asked made your idea land well.' },
          { id: 'feel', t: '“I think you’re brave for doing it at all.”', q: 'helpful', next: 'end_bright', why: 'Encouragement after listening helps her feel supported and strong.' },
        ],
      },
      end_bright: {
        scene: 'bench',
        lines: [L('nia', 'happy', 'Thank you. I feel so much better. Will you sit in the front row?')],
        end: {
          tone: 'bright',
          title: 'Truly heard',
          happened: 'You listened, reflected her feelings, asked good questions, and only gave ideas when she asked.',
          feel: 'Nia felt understood and lighter, like her worry got smaller just by being shared.',
          why: 'People often don’t need answers right away. They need to feel heard first. Then advice is welcome.',
          try: ['Use phrases like “It sounds like…” or “So you feel…”'],
          reflect: 'Who is a good listener in your life? What do they do that makes you feel heard?',
        },
      },
      end_unheard: {
        scene: 'bench',
        lines: [L('nia', 'sad', 'It’s fine. I have to go.')],
        end: {
          tone: 'stormy',
          title: 'A missed chance to listen',
          happened: 'Nia tried to share a worry, but the conversation didn’t stay on her.',
          feel: 'Nia feels unheard and a little embarrassed for sharing. She might not share next time.',
          why: 'It’s really common to want to talk about ourselves or jump to solutions. Real listening keeps the focus on the other person.',
          try: ['Reflect: “It sounds like you’re nervous.”', 'Ask: “What worries you most?”', 'Put your phone away and look at them.'],
          reflect: 'Rewind and try reflecting back what Nia said. What changes?',
        },
      },
    },
  },
  {
    id: 'comm-disagree',
    mode: 'communication',
    layout: 'chat',
    title: 'The Class Vote',
    blurb: 'You and Tomás disagree about how to spend the class prize money.',
    skills: ['communication', 'cooperation', 'conflict'],
    minutes: 4,
    cast: ['tomas'],
    start: 'n1',
    requires: 'comm-listen',
    tip: 'You can disagree with an idea and still respect the person.',
    nodes: {
      n1: {
        scene: 'classroom',
        lines: [
          N('Your class won a prize for recycling. You can spend it on a class trip or on a vegetable garden.'),
          L('tomas', 'proud', 'A garden is obviously better. A trip is one day. A garden lasts forever.'),
          N('You really want the trip to the science museum.'),
        ],
        choices: [
          { id: 'respect', t: '“That’s a good point about it lasting. I see it differently though. Can I explain?”', q: 'helpful', next: 'n2', why: 'Starting by naming what’s good in their idea shows respect, and makes them more willing to hear yours.' },
          { id: 'dumb', t: '“A garden is boring. Nobody wants that.”', q: 'unhelpful', next: 'n_dumb', why: 'Calling an idea boring, and speaking for everyone, makes the other person feel put down.' },
          { id: 'quiet', t: 'Say nothing. Tomás is louder, so he’ll win anyway.', q: 'mixed', next: 'n_quiet', why: 'Your opinion matters as much as anyone’s. Staying quiet means the class never hears your idea.' },
        ],
      },
      n_dumb: {
        scene: 'classroom',
        lines: [L('tomas', 'angry', 'Lots of people want it! At least my idea isn’t selfish.')],
        choices: [
          { id: 'reset', t: '“Sorry, that was rude. Let me explain why I like the trip.”', q: 'helpful', next: 'n2', why: 'Apologising for the way you said something lets you get back to discussing the ideas.' },
          { id: 'loud', t: '“Yours is the selfish one!”', q: 'unhelpful', next: 'end_stormy', why: 'Now it’s about who is selfish, not which plan is better.' },
        ],
      },
      n_quiet: {
        scene: 'classroom',
        lines: [L('uwase', 'calm', 'I’d like to hear from someone who hasn’t spoken yet. What do you think?')],
        choices: [
          { id: 'speak', t: '“I think the trip could be great, because…”', q: 'helpful', next: 'n2', why: 'Speaking up when invited is brave. Your view adds something new.' },
          { id: 'shrug', t: '“I don’t mind.”', q: 'mixed', next: 'end_mixed', why: 'It’s okay to be shy. But your ideas deserve to be heard too.' },
        ],
      },
      n2: {
        scene: 'classroom',
        lines: [
          L('you', 'calm', 'Lots of us have never been to a museum. It could help with our science topic.'),
          L('tomas', 'neutral', 'Hmm. But the garden helps the whole school, and we could grow food for lunch.'),
        ],
        choices: [
          { id: 'both', t: '“What if we use part for a small garden and ask the school to help pay for the trip?”', q: 'helpful', next: 'end_bright', why: 'Looking for a solution that includes both ideas is a smart way to handle disagreement.' },
          { id: 'vote', t: '“We both have good reasons. Let’s explain both to the class and vote fairly.”', q: 'helpful', next: 'end_vote', why: 'Agreeing on a fair process, even if you might lose, is a sign of respect.' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [N('The class loves the idea. The headteacher agrees to help with the trip, and the garden gets its first tomato seeds the next week.')],
        end: {
          tone: 'bright',
          title: 'Two ideas, one plan',
          happened: 'You disagreed respectfully, listened to Tomás’s reasons, and found a creative compromise.',
          feel: 'Tomás felt respected even though you disagreed. He was happy his idea was part of the plan.',
          why: 'Respectful disagreement focuses on ideas, not people. It makes room for better solutions than either idea alone.',
          try: ['Use phrases like “I see it differently” and “That’s a good point, and…”'],
          reflect: 'Can you remember a time someone disagreed with you respectfully? How did it feel?',
        },
      },
      end_vote: {
        scene: 'classroom',
        lines: [N('You both explain your ideas. The class votes for the garden, by two votes. Tomás says, “Your museum idea was really good. Maybe next year?”')],
        end: {
          tone: 'bright',
          title: 'A fair vote',
          happened: 'Your idea didn’t win, but you shared it well and the vote was fair.',
          feel: 'Tomás felt respected and wanted to respect you back. You might feel a bit disappointed, which is normal.',
          why: 'Disagreeing well doesn’t mean always winning. It means everyone gets heard and the decision is fair.',
          try: ['Help with the garden, even if it wasn’t your choice.'],
          reflect: 'How do you handle it when a decision doesn’t go your way?',
        },
      },
      end_mixed: {
        scene: 'classroom',
        lines: [N('The class picks the garden quickly. Later, three other people say they wanted the trip too, but nobody said anything.')],
        end: {
          tone: 'mixed',
          title: 'Unspoken ideas',
          happened: 'The class made a decision without hearing everyone’s view.',
          feel: 'You feel a bit invisible. Others who agreed with you feel the same.',
          why: 'Disagreeing can feel uncomfortable, but sharing your view respectfully helps the whole group make better decisions.',
          try: ['“I see it differently. I think the trip could be great because…”'],
          reflect: 'What makes it hard to share an opinion that’s different from others?',
        },
      },
      end_stormy: {
        scene: 'classroom',
        lines: [N('The discussion turns into shouting. Ms. Uwase stops the vote. “We’ll decide when we can talk respectfully.”')],
        end: {
          tone: 'stormy',
          title: 'Too loud to decide',
          happened: 'The disagreement became personal, so the class couldn’t decide anything.',
          feel: 'Tomás feels insulted. The class feels frustrated.',
          why: 'Caring a lot about something can make us say things we don’t mean. Attacking the person instead of the idea makes everyone stop listening.',
          try: ['Say what’s good about their idea first.', 'Explain your reasons calmly.', 'Suggest a compromise or fair vote.'],
          reflect: 'Rewind and try starting with respect. Does Tomás listen?',
        },
      },
    },
  },
  {
    id: 'comm-help',
    mode: 'communication',
    layout: 'chat',
    title: 'Asking for Help',
    blurb: 'You’re stuck on fractions and feel embarrassed to ask.',
    skills: ['communication', 'decisions'],
    minutes: 4,
    cast: ['uwase'],
    start: 'n1',
    requires: 'comm-disagree',
    tip: 'Asking for help is a skill, not a weakness. Be specific about what you need.',
    nodes: {
      n1: {
        scene: 'classroom',
        lines: [
          N('Everyone else seems to understand the fractions homework. You’ve read question 3 five times and it still doesn’t make sense.'),
          N('Ms. Uwase is at her desk. Your face feels hot just thinking about asking.'),
        ],
        choices: [
          { id: 'ask', t: 'Walk up: “Ms. Uwase, I’m stuck on question 3. Could you help me?”', q: 'helpful', next: 'n_ask', why: 'Being specific about where you’re stuck makes it easy for someone to help you.' },
          { id: 'copy', t: 'Copy the answers from the person next to you.', q: 'unhelpful', next: 'n_copy', why: 'Copying gets the page done, but you still won’t understand fractions, and the problem gets bigger later.' },
          { id: 'friend', t: 'Whisper to Amani: “Do you get question 3? Can you explain it?”', q: 'helpful', next: 'n_friend', why: 'Asking a classmate to explain (not to give answers) is a good way to get help.' },
        ],
      },
      n_ask: {
        scene: 'classroom',
        lines: [
          L('uwase', 'happy', 'Of course! Thank you for asking. Which part is confusing?'),
        ],
        choices: [
          { id: 'specific', t: '“I don’t get why 2/4 is the same as 1/2.”', q: 'helpful', next: 'end_bright', why: 'The more specific you are, the better the help you’ll get.' },
          { id: 'all', t: '“All of it. I’m just bad at maths.”', q: 'mixed', next: 'n_bad', why: 'Feeling lost is real, but calling yourself “bad at maths” is a harsh label. You’re learning, not bad.' },
        ],
      },
      n_bad: {
        scene: 'classroom',
        lines: [L('uwase', 'calm', 'You’re not bad at maths. You’re learning something new, and that always feels hard at first. Let’s start with one thing.')],
        choices: [
          { id: 'try', t: '“Okay. Can we start with question 3?”', q: 'helpful', next: 'end_bright', why: 'Breaking a big problem into one small step makes it manageable.' },
          { id: 'never', t: '“I’ll never get it.”', q: 'mixed', next: 'end_growth', why: 'That feeling is understandable when you’re frustrated. “I don’t get it YET” is often more true.' },
        ],
      },
      n_copy: {
        scene: 'classroom',
        lines: [N('The next day there’s a quiz on fractions. You stare at the paper. You don’t know how to start.')],
        choices: [
          { id: 'after', t: 'After the quiz, ask Ms. Uwase: “I didn’t understand the homework. Can you help me?”', q: 'helpful', next: 'n_ask', why: 'It’s never too late to ask for help. Teachers would much rather know.' },
          { id: 'hide', t: 'Hide your quiz and hope nobody notices.', q: 'unhelpful', next: 'end_stuck', why: 'Hiding a struggle makes it feel bigger and lonelier.' },
        ],
      },
      n_friend: {
        scene: 'classroom',
        lines: [L('amani', 'happy', 'Sure! Think of a pizza. If you cut it in 4 and eat 2 slices, you ate half!')],
        choices: [
          { id: 'thanks', t: '“Ohhh! Thanks! Can I try the next one and you check?”', q: 'helpful', next: 'end_friend', why: 'Trying it yourself after getting help is how you really learn.' },
          { id: 'answers', t: '“Can you just tell me the answers?”', q: 'mixed', next: 'n_copy', why: 'Getting answers is quicker, but you won’t learn how to do it yourself.' },
        ],
      },
      end_bright: {
        scene: 'classroom',
        lines: [N('Ms. Uwase draws two pizzas. Suddenly it clicks! You finish the homework yourself and even help Sam with question 5.')],
        end: {
          tone: 'bright',
          title: 'It clicked!',
          happened: 'You pushed through the embarrassment, asked for help, and told Ms. Uwase exactly where you were stuck.',
          feel: 'Ms. Uwase felt glad you asked. Teachers love it when students tell them what they need.',
          why: 'Everybody needs help sometimes. Asking clearly is a skill that will help you your whole life.',
          try: ['Next time, try: “I understand this part, but not this part.”'],
          reflect: 'What makes asking for help feel hard? What makes it easier?',
        },
      },
      end_growth: {
        scene: 'classroom',
        lines: [
          L('uwase', 'calm', 'You don’t get it YET. Let’s try one together.'),
          N('After two examples, you solve one on your own. Maybe you can do this after all.'),
        ],
        end: {
          tone: 'mixed',
          title: 'Not yet, but getting there',
          happened: 'You asked for help, and even though you felt discouraged, you kept going.',
          feel: 'You felt frustrated and doubted yourself. Ms. Uwase believed you could do it.',
          why: 'Being frustrated when learning is normal. Adding the word “yet” reminds us we’re still growing.',
          try: ['Say “I don’t understand this YET.”', 'Ask about one specific question at a time.'],
          reflect: 'What is something you couldn’t do before, but can do now?',
        },
      },
      end_friend: {
        scene: 'classroom',
        lines: [N('With Amani’s pizza trick you solve the next three questions. You draw little pizzas in the margin to remember.')],
        end: {
          tone: 'bright',
          title: 'Learning together',
          happened: 'You asked a friend to explain (not just give answers) and then tried it yourself.',
          feel: 'Amani felt proud to help. You felt relieved and capable.',
          why: 'Friends can be great helpers. Asking for an explanation, not answers, is how learning sticks.',
          try: ['Return the favour when Amani is stuck on something.'],
          reflect: 'Who could you ask for help in different subjects?',
        },
      },
      end_stuck: {
        scene: 'classroom',
        lines: [N('Fractions keep coming up in maths, and each lesson feels more confusing. You start to dread maths class.')],
        end: {
          tone: 'stormy',
          title: 'Stuck and alone',
          happened: 'Because nobody knew you were confused, the confusion kept growing.',
          feel: 'You feel embarrassed and worried. Ms. Uwase would be sad to know you were struggling alone.',
          why: 'Feeling embarrassed about asking is very common. But asking early keeps small problems small.',
          try: ['Tell your teacher: “I’m stuck on this part.”', 'Ask a classmate to explain.', 'Remember: everybody needs help sometimes.'],
          reflect: 'Rewind and try asking Ms. Uwase. What happens?',
        },
      },
    },
  },
]

export const BUILDERS = [
  {
    id: 'comm-imessage',
    mode: 'communication',
    kind: 'builder',
    title: 'Feelings in Words',
    blurb: 'Build “I-messages” that say how you feel without blaming.',
    skills: ['communication', 'calm'],
    minutes: 4,
    requires: 'comm-help',
    intro: 'An I-message tells someone how you feel and what you need, without blaming. It sounds like: “I feel ___ when ___ because ___. Could we ___?”',
    rounds: [
      {
        who: 'leo',
        situation: 'Leo keeps interrupting you every time you try to tell your group your idea.',
        slots: [
          { label: 'I feel…', options: [
            { t: 'frustrated', q: 'helpful', why: 'Naming a real feeling clearly helps Leo understand.' },
            { t: 'like you’re so rude', q: 'unhelpful', why: '“You’re rude” is a judgement, not a feeling. It will make Leo defensive.' },
            { t: 'annoyed', q: 'helpful', why: 'Annoyed is honest and clear.' },
          ] },
          { label: 'when…', options: [
            { t: 'I get interrupted before I finish', q: 'helpful', why: 'Describing what happens, not what kind of person Leo is, keeps it fair.' },
            { t: 'you never let anyone talk', q: 'unhelpful', why: '“Never” is an exaggeration, and Leo will argue with it instead of listening.' },
            { t: 'you talk over me', q: 'mixed', why: 'This is true and clear, though starting with “you” can sound a little like blame.' },
          ] },
          { label: 'because…', options: [
            { t: 'I want my idea to be heard too', q: 'helpful', why: 'Explaining what matters to you helps Leo see why it’s important.' },
            { t: 'you think you’re the boss', q: 'unhelpful', why: 'Guessing what Leo thinks puts words in his mouth.' },
          ] },
          { label: 'Could we…', options: [
            { t: 'take turns so everyone finishes their idea?', q: 'helpful', why: 'A clear, fair request gives Leo a way to fix it.' },
            { t: 'just have you be quiet?', q: 'unhelpful', why: 'This sounds like a punishment rather than a solution.' },
          ] },
        ],
      },
      {
        who: 'keza',
        situation: 'Keza promised to save you a seat on the bus trip, but gave it to someone else.',
        slots: [
          { label: 'I feel…', options: [
            { t: 'disappointed', q: 'helpful', why: 'Disappointed is the feeling underneath, and it invites care instead of defence.' },
            { t: 'like you’re a terrible friend', q: 'unhelpful', why: 'This is an attack on Keza, not a feeling.' },
            { t: 'left out', q: 'helpful', why: 'Honest and clear. Keza can understand that feeling.' },
          ] },
          { label: 'when…', options: [
            { t: 'a promise to me gets broken', q: 'helpful', why: 'Clear and fair. It describes what happened.' },
            { t: 'you always pick other people over me', q: 'unhelpful', why: '“Always” makes it bigger than this one moment.' },
          ] },
          { label: 'because…', options: [
            { t: 'I was looking forward to sitting together', q: 'helpful', why: 'This shows the friendship matters to you.' },
            { t: 'that’s just mean', q: 'unhelpful', why: 'Labelling it “mean” doesn’t explain your feeling.' },
          ] },
          { label: 'Could we…', options: [
            { t: 'sit together on the way back?', q: 'helpful', why: 'A specific, simple request is easy to say yes to.' },
            { t: 'not be friends anymore?', q: 'unhelpful', why: 'Ending a friendship over one mistake is a very big reaction to a fixable problem.' },
          ] },
        ],
      },
      {
        who: 'sam',
        situation: 'Your little cousin Sam keeps coming into your room and touching your things when you’re doing homework.',
        slots: [
          { label: 'I feel…', options: [
            { t: 'distracted', q: 'helpful', why: 'Being specific about the feeling helps Sam understand.' },
            { t: 'stressed', q: 'helpful', why: 'Honest and clear.' },
            { t: 'like you’re so annoying', q: 'unhelpful', why: 'Calling someone annoying is a label, not a feeling.' },
          ] },
          { label: 'when…', options: [
            { t: 'my things get moved while I’m working', q: 'helpful', why: 'Describes exactly what happens.' },
            { t: 'you ruin everything', q: 'unhelpful', why: 'An exaggeration that will upset Sam.' },
          ] },
          { label: 'because…', options: [
            { t: 'I need to concentrate on my homework', q: 'helpful', why: 'Gives a real reason that Sam can respect.' },
            { t: 'you’re a baby', q: 'unhelpful', why: 'Name-calling makes people stop listening.' },
          ] },
          { label: 'Could we…', options: [
            { t: 'play together after I finish?', q: 'helpful', why: 'Offering a better time shows you still care about Sam.' },
            { t: 'agree you knock first, and wait until I’m done?', q: 'helpful', why: 'A clear boundary, kindly said. There’s more than one good answer!' },
          ] },
        ],
      },
    ],
  },
  {
    id: 'comm-apology',
    mode: 'communication',
    kind: 'builder',
    title: 'The Real Apology',
    blurb: 'Learn the four parts of an apology that really fixes things.',
    skills: ['communication', 'conflict', 'friendship'],
    minutes: 4,
    requires: 'comm-imessage',
    intro: 'A real apology has four parts: say sorry, name what you did, show you understand how they feel, and offer to make it right.',
    rounds: [
      {
        who: 'tomas',
        situation: 'You laughed when Tomás tripped in the hallway, and he heard you.',
        slots: [
          { label: 'Say sorry', options: [
            { t: 'I’m sorry.', q: 'helpful', why: 'Simple and sincere.' },
            { t: 'Sorry, but it was kind of funny.', q: 'unhelpful', why: '“But” cancels out the apology.' },
            { t: 'Sorry if you were upset.', q: 'mixed', why: '“If you were upset” sounds like you’re not sure you did anything wrong.' },
          ] },
          { label: 'Name what you did', options: [
            { t: 'I laughed when you tripped.', q: 'helpful', why: 'Naming exactly what you did shows you understand your part.' },
            { t: 'Something happened earlier.', q: 'unhelpful', why: 'Being vague can feel like you’re avoiding responsibility.' },
          ] },
          { label: 'Show you understand', options: [
            { t: 'That must have felt embarrassing.', q: 'helpful', why: 'Imagining how he felt shows empathy.' },
            { t: 'You shouldn’t be so sensitive.', q: 'unhelpful', why: 'This tells Tomás his feelings are wrong.' },
          ] },
          { label: 'Make it right', options: [
            { t: 'Next time I’ll help you up instead.', q: 'helpful', why: 'A promise to do better shows you’ve learned.' },
            { t: 'Want to sit together at lunch?', q: 'helpful', why: 'A kind gesture can help repair the friendship.' },
            { t: 'Let’s just forget it.', q: 'mixed', why: 'Moving on is good, but it doesn’t show what you’ll do differently.' },
          ] },
        ],
      },
      {
        who: 'mei',
        situation: 'You borrowed Mei’s favourite book and spilled juice on it.',
        slots: [
          { label: 'Say sorry', options: [
            { t: 'I’m really sorry, Mei.', q: 'helpful', why: 'Using her name makes it personal and sincere.' },
            { t: 'It’s not a big deal, sorry.', q: 'unhelpful', why: 'Saying it’s not a big deal decides for Mei how she should feel.' },
          ] },
          { label: 'Name what you did', options: [
            { t: 'I spilled juice on your book.', q: 'helpful', why: 'Clear and honest.' },
            { t: 'Your book got a bit wet.', q: 'mixed', why: '“Got wet” makes it sound like it happened by itself.' },
          ] },
          { label: 'Show you understand', options: [
            { t: 'I know it’s your favourite, so that must be upsetting.', q: 'helpful', why: 'You remembered why it matters to her.' },
            { t: 'It’s just a book.', q: 'unhelpful', why: 'It’s not “just” anything to Mei.' },
          ] },
          { label: 'Make it right', options: [
            { t: 'Can I save up and buy you a new copy?', q: 'helpful', why: 'Offering to replace it takes real responsibility.' },
            { t: 'I’ll be more careful with things I borrow.', q: 'helpful', why: 'Promising to change shows you learned from it.' },
          ] },
        ],
      },
    ],
  },
]
