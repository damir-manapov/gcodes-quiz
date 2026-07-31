export type QuizQuestion = {
  id: number;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'What does G00 command do on a CNC machine?',
    options: [
      'Linear interpolation at feed rate',
      'Rapid positioning move',
      'Dwell',
      'Tool change',
    ],
    correctAnswer: 1,
    explanation: 'G00 performs a rapid positioning move without cutting feed.',
  },
  {
    id: 2,
    prompt: 'What does G01 command do?',
    options: [
      'Rapid traverse',
      'Linear interpolation at feed rate',
      'Spindle stop',
      'Coolant off',
    ],
    correctAnswer: 1,
    explanation:
      'G01 moves the tool in a straight line at the programmed feed rate.',
  },
  {
    id: 3,
    prompt: 'Which command typically stops the spindle?',
    options: ['M03', 'M05', 'G21', 'G17'],
    correctAnswer: 1,
    explanation: 'M05 is the standard CNC code to stop the spindle.',
  },
  {
    id: 4,
    prompt: 'What does G21 specify?',
    options: ['Inches', 'Millimeters', 'Radians', 'Degrees'],
    correctAnswer: 1,
    explanation:
      'G21 switches the machine to metric units, meaning millimeters.',
  },
  {
    id: 5,
    prompt: 'Which coordinate system is commonly used in CNC programming?',
    options: ['Polar', 'Absolute', 'Relative only', 'Hexadecimal'],
    correctAnswer: 1,
    explanation:
      'CNC programs commonly use absolute coordinates unless otherwise specified.',
  },
  {
    id: 6,
    prompt: 'What does M03 command do?',
    options: [
      'Turn spindle clockwise',
      'Turn spindle counterclockwise',
      'Start coolant',
      'End program',
    ],
    correctAnswer: 0,
    explanation: 'M03 starts the spindle clockwise.',
  },
  {
    id: 7,
    prompt: 'What is the purpose of a G code?',
    options: [
      'Defines tool geometry',
      'Defines machine movement behavior',
      'Stores part numbers',
      'Sets program language',
    ],
    correctAnswer: 1,
    explanation:
      'G codes control the machine motion and behavior during a program.',
  },
  {
    id: 8,
    prompt: 'Which code is used to end a CNC program?',
    options: ['M02', 'M30', 'M06', 'G28'],
    correctAnswer: 1,
    explanation:
      'M30 is commonly used to end the program and rewind the tape or reset.',
  },
];

export function getQuestionsForQuiz(count = 8): QuizQuestion[] {
  return quizQuestions.slice(0, Math.min(count, quizQuestions.length));
}
