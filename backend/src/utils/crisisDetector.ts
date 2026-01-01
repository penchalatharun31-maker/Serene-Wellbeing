export const CRISIS_KEYWORDS = [
    'kill myself', 'suicide', 'graduate', 'end my life', 'want to die',
    'hurt myself', 'self-harm', 'cutting myself', 'overdose',
    'better off dead', 'no reason to live', 'hopeless', 'give up'
];

export const detectCrisis = (text: string): boolean => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export const getCrisisResources = () => {
    return [
        { name: 'National Suicide Prevention Lifeline', contact: '988' },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
        { name: 'Emergency Services', contact: '911' } // Customize based on user region if possible
    ];
};
