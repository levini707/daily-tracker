export const journalTemplates = {
  freeform: {
    name: 'Free Form',
    content: '',
    showPrompt: false
  },
  prompt: {
    name: 'Daily Prompt',
    content: '',
    showPrompt: true
  },
  gratitude: {
    name: 'Gratitude',
    content: `Three things I'm grateful for today:
1. 
2. 
3. 

Why today mattered:
`,
    showPrompt: false
  },
  reflection: {
    name: 'Reflection',
    content: `What went well today:

What could have gone better:

What I learned:

Tomorrow I will:
`,
    showPrompt: false
  },
  wins: {
    name: 'Wins & Challenges',
    content: `Today's wins:
- 
- 

Today's challenges:
- 

How I handled them:
`,
    showPrompt: false
  },
  bullets: {
    name: 'Quick Bullets',
    content: `• 
- 
- 
- 
- 
`,
    showPrompt: false
  }
};