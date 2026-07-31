export type QuizCategory = 'G' | 'M';

export type QuizQuestion = {
  id: number;
  category: QuizCategory;
  topic: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'G',
    topic: 'motion',
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
    category: 'G',
    topic: 'motion',
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
    category: 'M',
    topic: 'spindle',
    prompt: 'Which command typically stops the spindle?',
    options: ['M03', 'M05', 'G21', 'G17'],
    correctAnswer: 1,
    explanation: 'M05 is the standard CNC code to stop the spindle.',
  },
  {
    id: 4,
    category: 'G',
    topic: 'units',
    prompt: 'What does G21 specify?',
    options: ['Inches', 'Millimeters', 'Radians', 'Degrees'],
    correctAnswer: 1,
    explanation:
      'G21 switches the machine to metric units, meaning millimeters.',
  },
  {
    id: 5,
    category: 'G',
    topic: 'positioning',
    prompt: 'Which coordinate system is commonly used in CNC programming?',
    options: ['Polar', 'Absolute', 'Relative only', 'Hexadecimal'],
    correctAnswer: 1,
    explanation:
      'CNC programs commonly use absolute coordinates unless otherwise specified.',
  },
  {
    id: 6,
    category: 'M',
    topic: 'spindle',
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
    category: 'G',
    topic: 'general',
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
    category: 'M',
    topic: 'program-control',
    prompt: 'Which code is used to end a CNC program?',
    options: ['M02', 'M30', 'M06', 'G28'],
    correctAnswer: 1,
    explanation:
      'M30 is commonly used to end the program and rewind the tape or reset.',
  },
  {
    id: 9,
    category: 'G',
    topic: 'motion',
    prompt: 'What does G02 command in CNC programming?',
    options: [
      'Circular interpolation clockwise (CW)',
      'Circular interpolation counterclockwise (CCW)',
      'Linear interpolation',
      'Rapid traverse',
    ],
    correctAnswer: 0,
    explanation:
      'G02 produces a clockwise circular (arc) move, typically defined with I/J/K or R parameters.',
  },
  {
    id: 10,
    category: 'G',
    topic: 'motion',
    prompt: 'What does G03 command?',
    options: [
      'Circular interpolation clockwise (CW)',
      'Circular interpolation counterclockwise (CCW)',
      'Dwell',
      'Tool length compensation',
    ],
    correctAnswer: 1,
    explanation: 'G03 produces a counterclockwise circular (arc) move.',
  },
  {
    id: 11,
    category: 'G',
    topic: 'dwell',
    prompt: 'What is the function of G04?',
    options: [
      'Dwell (pause) for a specified time',
      'Spindle orientation',
      'Coolant control',
      'Return to reference point',
    ],
    correctAnswer: 0,
    explanation:
      'G04 pauses program execution for a specified dwell time, usually set with a P or X address.',
  },
  {
    id: 12,
    category: 'G',
    topic: 'plane-selection',
    prompt: 'What does G17 select?',
    options: ['XY plane', 'ZX plane', 'YZ plane', 'Polar plane'],
    correctAnswer: 0,
    explanation:
      'G17 selects the XY plane, the default plane for most milling operations.',
  },
  {
    id: 13,
    category: 'G',
    topic: 'plane-selection',
    prompt: 'What does G18 select?',
    options: ['XY plane', 'ZX plane', 'YZ plane', 'None of these'],
    correctAnswer: 1,
    explanation:
      'G18 selects the ZX (XZ) plane, commonly used on lathes and some milling cycles.',
  },
  {
    id: 14,
    category: 'G',
    topic: 'plane-selection',
    prompt: 'What does G19 select?',
    options: ['XY plane', 'ZX plane', 'YZ plane', 'Reference plane'],
    correctAnswer: 2,
    explanation: 'G19 selects the YZ plane.',
  },
  {
    id: 15,
    category: 'G',
    topic: 'units',
    prompt: 'What does G20 specify?',
    options: ['Millimeters', 'Inches', 'Radians', 'Feed per revolution'],
    correctAnswer: 1,
    explanation:
      'G20 switches the machine to inch units, the counterpart of G21 for millimeters.',
  },
  {
    id: 16,
    category: 'G',
    topic: 'homing',
    prompt: 'What does G28 command a CNC machine to do?',
    options: [
      'Move to a work offset',
      'Return to the machine reference (home) position',
      'Cancel tool compensation',
      'Start a canned cycle',
    ],
    correctAnswer: 1,
    explanation:
      'G28 sends the machine to its reference (home) position, often via an intermediate point.',
  },
  {
    id: 17,
    category: 'G',
    topic: 'compensation',
    prompt: 'What does G40 do?',
    options: [
      'Activate cutter compensation left',
      'Activate cutter compensation right',
      'Cancel cutter radius compensation',
      'Cancel tool length compensation',
    ],
    correctAnswer: 2,
    explanation: 'G40 cancels cutter radius compensation (G41/G42).',
  },
  {
    id: 18,
    category: 'G',
    topic: 'compensation',
    prompt: 'What does G41 activate?',
    options: [
      'Cutter compensation left',
      'Cutter compensation right',
      'Tool length compensation',
      'Constant surface speed',
    ],
    correctAnswer: 0,
    explanation:
      'G41 applies cutter radius compensation to the left of the programmed path.',
  },
  {
    id: 19,
    category: 'G',
    topic: 'compensation',
    prompt: 'What does G42 activate?',
    options: [
      'Cutter compensation left',
      'Cutter compensation right',
      'Cutter compensation cancel',
      'Spindle speed control',
    ],
    correctAnswer: 1,
    explanation:
      'G42 applies cutter radius compensation to the right of the programmed path.',
  },
  {
    id: 20,
    category: 'G',
    topic: 'compensation',
    prompt: 'What does G43 apply?',
    options: [
      'Tool length compensation (positive)',
      'Tool length compensation cancel',
      'Cutter radius compensation',
      'Work offset selection',
    ],
    correctAnswer: 0,
    explanation:
      'G43 applies positive tool length compensation, usually paired with an H offset number.',
  },
  {
    id: 21,
    category: 'G',
    topic: 'compensation',
    prompt: 'What does G49 do?',
    options: [
      'Apply tool length compensation',
      'Cancel tool length compensation',
      'Cancel cutter radius compensation',
      'Select a work coordinate system',
    ],
    correctAnswer: 1,
    explanation: 'G49 cancels tool length compensation set by G43/G44.',
  },
  {
    id: 22,
    category: 'G',
    topic: 'work-offset',
    prompt: 'What is the purpose of G54 (through G59)?',
    options: [
      'Select a work coordinate system offset',
      'Set feed rate mode',
      'Select a tool length offset',
      'Cancel canned cycles',
    ],
    correctAnswer: 0,
    explanation:
      'G54-G59 select one of several stored work coordinate system offsets.',
  },
  {
    id: 23,
    category: 'G',
    topic: 'canned-cycle',
    prompt: 'What does G80 do?',
    options: [
      'Start a drilling canned cycle',
      'Cancel a canned cycle',
      'Start a tapping cycle',
      'Select constant surface speed',
    ],
    correctAnswer: 1,
    explanation:
      'G80 cancels any active canned (fixed) cycle such as drilling or tapping.',
  },
  {
    id: 24,
    category: 'G',
    topic: 'canned-cycle',
    prompt: 'What operation does G81 perform?',
    options: [
      'Simple drilling cycle',
      'Peck drilling cycle',
      'Tapping cycle',
      'Boring cycle with dwell',
    ],
    correctAnswer: 0,
    explanation:
      'G81 is a basic drilling canned cycle: rapid to position, feed to depth, rapid retract.',
  },
  {
    id: 25,
    category: 'G',
    topic: 'canned-cycle',
    prompt: 'How does G82 differ from G81?',
    options: [
      'It adds a dwell at the bottom of the hole',
      'It retracts at feed rate',
      'It uses peck cycles',
      'It is used only for tapping',
    ],
    correctAnswer: 0,
    explanation:
      'G82 is a drilling cycle like G81 but adds a dwell at the bottom of the hole for a better finish.',
  },
  {
    id: 26,
    category: 'G',
    topic: 'canned-cycle',
    prompt: 'What is G83 used for?',
    options: [
      'Peck drilling cycle for deep holes',
      'Rigid tapping',
      'Boring with feed-rate retract',
      'Circular interpolation',
    ],
    correctAnswer: 0,
    explanation:
      'G83 performs a peck drilling cycle, fully retracting between pecks to clear chips on deep holes.',
  },
  {
    id: 27,
    category: 'G',
    topic: 'canned-cycle',
    prompt: 'What does G84 perform?',
    options: [
      'Reaming cycle',
      'Tapping cycle',
      'Boring cycle',
      'Rapid positioning',
    ],
    correctAnswer: 1,
    explanation:
      'G84 is a canned cycle for tapping, synchronizing spindle rotation with feed to cut threads.',
  },
  {
    id: 28,
    category: 'G',
    topic: 'positioning',
    prompt: 'What does G90 specify?',
    options: [
      'Incremental positioning',
      'Absolute positioning',
      'Constant surface speed',
      'Feed per revolution',
    ],
    correctAnswer: 1,
    explanation:
      'G90 sets absolute positioning mode, where coordinates are referenced from a fixed origin.',
  },
  {
    id: 29,
    category: 'G',
    topic: 'positioning',
    prompt: 'What does G91 specify?',
    options: [
      'Absolute positioning',
      'Incremental positioning',
      'Metric units',
      'Plane selection',
    ],
    correctAnswer: 1,
    explanation:
      'G91 sets incremental positioning mode, where each move is relative to the current position.',
  },
  {
    id: 30,
    category: 'G',
    topic: 'feed-mode',
    prompt: 'What feed mode does G94 set?',
    options: [
      'Feed per revolution',
      'Feed per minute',
      'Constant surface speed',
      'Rapid feed only',
    ],
    correctAnswer: 1,
    explanation:
      'G94 sets feed per minute mode, the common feed rate mode for milling.',
  },
  {
    id: 31,
    category: 'G',
    topic: 'feed-mode',
    prompt: 'What feed mode does G95 set?',
    options: [
      'Feed per minute',
      'Feed per revolution',
      'Dwell mode',
      'Rapid traverse',
    ],
    correctAnswer: 1,
    explanation: 'G95 sets feed per revolution mode, commonly used on lathes.',
  },
  {
    id: 32,
    category: 'G',
    topic: 'spindle',
    prompt: 'What does G96 activate on a CNC lathe?',
    options: [
      'Constant surface speed control',
      'Constant spindle RPM',
      'Tapping mode',
      'Cutter compensation',
    ],
    correctAnswer: 0,
    explanation:
      'G96 activates constant surface speed control, adjusting spindle RPM as the tool diameter changes to keep cutting speed constant.',
  },
  {
    id: 33,
    category: 'G',
    topic: 'spindle',
    prompt: 'What does G97 do?',
    options: [
      'Activate constant surface speed',
      'Cancel constant surface speed and use constant RPM',
      'Select a work offset',
      'Start a canned cycle',
    ],
    correctAnswer: 1,
    explanation:
      'G97 cancels constant surface speed control (G96) and returns to a constant spindle speed in RPM.',
  },
  {
    id: 34,
    category: 'M',
    topic: 'program-control',
    prompt: 'What does M00 do?',
    options: [
      'Optional program stop',
      'Unconditional program stop',
      'Program end and reset',
      'Tool change',
    ],
    correctAnswer: 1,
    explanation:
      'M00 causes an unconditional stop; the operator must press cycle start to continue.',
  },
  {
    id: 35,
    category: 'M',
    topic: 'program-control',
    prompt: 'What does M01 do?',
    options: [
      'Optional stop, only if enabled on the control',
      'Unconditional stop',
      'Spindle stop',
      'End of program',
    ],
    correctAnswer: 0,
    explanation:
      'M01 is an optional stop that only pauses the program if the operator has enabled optional stop on the control.',
  },
  {
    id: 36,
    category: 'M',
    topic: 'program-control',
    prompt: 'What does M02 do?',
    options: [
      'End the program without rewinding',
      'End the program and rewind/reset',
      'Stop the spindle',
      'Change the tool',
    ],
    correctAnswer: 0,
    explanation:
      'M02 marks the end of the program; unlike M30 it typically does not reset the program pointer to the beginning.',
  },
  {
    id: 37,
    category: 'M',
    topic: 'spindle',
    prompt: 'What does M04 command?',
    options: [
      'Spindle on clockwise',
      'Spindle on counterclockwise',
      'Spindle stop',
      'Spindle orientation',
    ],
    correctAnswer: 1,
    explanation: 'M04 starts the spindle rotating counterclockwise.',
  },
  {
    id: 38,
    category: 'M',
    topic: 'tool-change',
    prompt: 'What does M06 command?',
    options: [
      'Coolant on',
      'Tool change',
      'Program stop',
      'Spindle speed override',
    ],
    correctAnswer: 1,
    explanation:
      'M06 executes a tool change, typically to the tool number specified by a preceding T address.',
  },
  {
    id: 39,
    category: 'M',
    topic: 'coolant',
    prompt: 'What does M08 do?',
    options: [
      'Turn coolant on',
      'Turn coolant off',
      'Turn spindle on',
      'Turn spindle off',
    ],
    correctAnswer: 0,
    explanation: 'M08 turns on flood coolant.',
  },
  {
    id: 40,
    category: 'M',
    topic: 'coolant',
    prompt: 'What does M09 do?',
    options: [
      'Turn coolant on',
      'Turn coolant off',
      'Stop the spindle',
      'End the program',
    ],
    correctAnswer: 1,
    explanation: 'M09 turns off coolant.',
  },
  {
    id: 41,
    category: 'M',
    topic: 'subprogram',
    prompt: 'What does M98 do?',
    options: [
      'Call a subprogram',
      'Return from a subprogram',
      'End the main program',
      'Cancel a canned cycle',
    ],
    correctAnswer: 0,
    explanation:
      'M98 calls a subprogram, usually specified with a P address for the program number.',
  },
  {
    id: 42,
    category: 'M',
    topic: 'subprogram',
    prompt: 'What does M99 do?',
    options: [
      'Call a subprogram',
      'Return from a subprogram (or loop in the main program)',
      'Start the spindle',
      'Cancel a tool offset',
    ],
    correctAnswer: 1,
    explanation:
      'M99 returns control from a subprogram to the calling program, or loops back to the start of the main program.',
  },
];

export function getQuestionsForQuiz(
  count = quizQuestions.length,
): QuizQuestion[] {
  return quizQuestions.slice(0, Math.min(count, quizQuestions.length));
}
