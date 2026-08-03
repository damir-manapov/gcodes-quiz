import type { LocalizedText } from '../i18n';

export type QuizCategory = 'G' | 'M';

// One address word's expected value in a line-mode worked example, e.g.
// { letter: 'X', value: '10' } for the X10 word in "G81 X10 Y5 Z-12 R2 F100".
export type CodeLineParam = {
  letter: string;
  value: string;
};

export type LineExample = {
  // Describes a concrete scenario (with the param values spelled out in
  // words) that the user must translate into a full code line.
  prompt: LocalizedText;
  params: CodeLineParam[];
};

export type QuizQuestion = {
  id: number;
  category: QuizCategory;
  topic: string;
  prompt: LocalizedText;
  options: LocalizedText[];
  correctAnswer: number;
  explanation: LocalizedText;
  // The single G/M code this question is about, e.g. 'G54', used to build the
  // "action -> code" reverse quiz mode. Omitted for questions that aren't
  // about one specific code (conceptual questions).
  code?: string;
  // Alternate phrasings of `prompt`, used in forward mode; one is picked at
  // random (alongside the base prompt) each time the question is presented,
  // so the exact question wording isn't memorized.
  promptVariants?: LocalizedText[];
  // Alternate phrasings of the correct answer (options[correctAnswer]); one
  // is picked at random (alongside the base text) each time the question is
  // presented. Used both as the forward-mode correct option text and as the
  // reverse/typed-mode action-description prompt, so varying it changes
  // what's memorized in both modes.
  answerVariants?: LocalizedText[];
  // Worked examples used to build the "write the line" quiz mode; a random
  // one is picked each time the question is presented. Only present for the
  // curated subset of codes that take parameters.
  lineExamples?: LineExample[];
  // The example picked for the current session, set by `buildSessionQuestion`
  // and read by `buildExpectedLineText`/`isCorrectLineAnswer`. Not present in
  // the question bank itself.
  lineExample?: LineExample;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'G',
    topic: 'motion',
    code: 'G00',
    prompt: {
      en: 'What does G00 command do on a CNC machine?',
      ru: 'Что делает команда G00 на станке с ЧПУ?',
    },
    options: [
      {
        en: 'Linear interpolation at feed rate',
        ru: 'Линейная интерполяция на рабочей подаче',
      },
      { en: 'Rapid positioning move', ru: 'Быстрое позиционирование' },
      { en: 'Dwell', ru: 'Пауза (выдержка времени)' },
      { en: 'Tool change', ru: 'Смена инструмента' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G00 performs a rapid positioning move without cutting feed.',
      ru: 'G00 выполняет быстрое позиционирование без рабочей подачи.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G00 used for?',
        ru: 'Для чего используется команда G00 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Performs a rapid, non-cutting positioning move',
        ru: 'Выполняет быстрое позиционирующее перемещение без резания',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Rapidly move the tool to X=50, Y=25, Z=10.',
          ru: 'Быстро переместите инструмент в точку X=50, Y=25, Z=10.',
        },
        params: [
          { letter: 'X', value: '50' },
          { letter: 'Y', value: '25' },
          { letter: 'Z', value: '10' },
        ],
      },
      {
        prompt: {
          en: 'Rapidly retract to the tool change position at X=0, Y=0, Z=100.',
          ru: 'Быстро отведите в позицию смены инструмента X=0, Y=0, Z=100.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '100' },
        ],
      },
      {
        prompt: {
          en: 'Rapidly move the tool to X=-15, Y=60.',
          ru: 'Быстро переместите инструмент в точку X=-15, Y=60.',
        },
        params: [
          { letter: 'X', value: '-15' },
          { letter: 'Y', value: '60' },
        ],
      },
    ],
  },
  {
    id: 2,
    category: 'G',
    topic: 'motion',
    code: 'G01',
    prompt: {
      en: 'What does G01 command do?',
      ru: 'Что делает команда G01?',
    },
    options: [
      { en: 'Rapid traverse', ru: 'Быстрый ход' },
      {
        en: 'Linear interpolation at feed rate',
        ru: 'Линейная интерполяция на рабочей подаче',
      },
      { en: 'Spindle stop', ru: 'Остановка шпинделя' },
      { en: 'Coolant off', ru: 'Выключение СОЖ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G01 moves the tool in a straight line at the programmed feed rate.',
      ru: 'G01 перемещает инструмент по прямой линии с заданной рабочей подачей.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G01 used for?',
        ru: 'Для чего используется команда G01 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Moves the tool along a straight path at the programmed feed rate',
        ru: 'Перемещает инструмент по прямой линии с заданной рабочей подачей',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Move the tool in a straight line to X=30, Y=-10 at a feed rate of F=200.',
          ru: 'Переместите инструмент по прямой в точку X=30, Y=-10 с подачей F=200.',
        },
        params: [
          { letter: 'X', value: '30' },
          { letter: 'Y', value: '-10' },
          { letter: 'F', value: '200' },
        ],
      },
      {
        prompt: {
          en: 'Feed straight down to Z=-5 at a feed rate of F=80 to start the cut.',
          ru: 'Подайте прямо вниз до Z=-5 с подачей F=80, чтобы начать резание.',
        },
        params: [
          { letter: 'Z', value: '-5' },
          { letter: 'F', value: '80' },
        ],
      },
      {
        prompt: {
          en: 'Move in a straight line to X=100, Y=45, Z=-2 at a feed rate of F=300.',
          ru: 'Переместитесь по прямой в точку X=100, Y=45, Z=-2 с подачей F=300.',
        },
        params: [
          { letter: 'X', value: '100' },
          { letter: 'Y', value: '45' },
          { letter: 'Z', value: '-2' },
          { letter: 'F', value: '300' },
        ],
      },
    ],
  },
  {
    id: 3,
    category: 'M',
    topic: 'spindle',
    code: 'M05',
    prompt: {
      en: 'What does M05 do?',
      ru: 'Что делает M05?',
    },
    options: [
      {
        en: 'Starts the spindle clockwise',
        ru: 'Запускает шпиндель по часовой стрелке',
      },
      { en: 'Stops the spindle', ru: 'Останавливает шпиндель' },
      {
        en: 'Switches to metric units',
        ru: 'Переключает на метрические единицы',
      },
      { en: 'Selects the XY plane', ru: 'Выбирает плоскость XY' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M05 is the standard CNC code to stop the spindle.',
      ru: 'M05 — стандартный код ЧПУ для остановки шпинделя.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M05 used for?',
        ru: 'Для чего используется команда M05 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Halts spindle rotation',
        ru: 'Останавливает вращение шпинделя',
      },
    ],
  },
  {
    id: 4,
    category: 'G',
    topic: 'units',
    code: 'G21',
    prompt: {
      en: 'What does G21 specify?',
      ru: 'Что задаёт команда G21?',
    },
    options: [
      { en: 'Inches', ru: 'Дюймы' },
      { en: 'Millimeters', ru: 'Миллиметры' },
      { en: 'Radians', ru: 'Радианы' },
      { en: 'Degrees', ru: 'Градусы' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G21 switches the machine to metric units, meaning millimeters.',
      ru: 'G21 переключает станок на метрические единицы измерения, то есть миллиметры.',
    },
    promptVariants: [
      {
        en: 'Which units does G21 select?',
        ru: 'Какие единицы измерения выбирает команда G21?',
      },
    ],
    answerVariants: [
      {
        en: 'Metric units (millimeters)',
        ru: 'Метрические единицы (миллиметры)',
      },
    ],
  },
  {
    id: 5,
    category: 'G',
    topic: 'positioning',
    prompt: {
      en: 'Which coordinate system is commonly used in CNC programming?',
      ru: 'Какая система координат обычно используется в программировании ЧПУ?',
    },
    options: [
      { en: 'Polar', ru: 'Полярная' },
      { en: 'Absolute', ru: 'Абсолютная' },
      { en: 'Relative only', ru: 'Только относительная' },
      { en: 'Hexadecimal', ru: 'Шестнадцатеричная' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'CNC programs commonly use absolute coordinates unless otherwise specified.',
      ru: 'Программы ЧПУ обычно используют абсолютные координаты, если не указано иное.',
    },
    promptVariants: [
      {
        en: 'In CNC part programs, which coordinate system is the default choice?',
        ru: 'Какая система координат обычно является выбором по умолчанию в программах ЧПУ?',
      },
    ],
    answerVariants: [
      { en: 'Absolute coordinates', ru: 'Абсолютные координаты' },
    ],
  },
  {
    id: 6,
    category: 'M',
    topic: 'spindle',
    code: 'M03',
    prompt: {
      en: 'What does M03 command do?',
      ru: 'Что делает команда M03?',
    },
    options: [
      {
        en: 'Turn spindle clockwise',
        ru: 'Включить вращение шпинделя по часовой стрелке',
      },
      {
        en: 'Turn spindle counterclockwise',
        ru: 'Включить вращение шпинделя против часовой стрелки',
      },
      { en: 'Start coolant', ru: 'Включить СОЖ' },
      { en: 'End program', ru: 'Завершить программу' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M03 starts the spindle clockwise.',
      ru: 'M03 запускает вращение шпинделя по часовой стрелке.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M03 used for?',
        ru: 'Для чего используется команда M03 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Starts the spindle turning clockwise',
        ru: 'Запускает вращение шпинделя по часовой стрелке',
      },
    ],
  },
  {
    id: 7,
    category: 'G',
    topic: 'general',
    prompt: {
      en: 'What is the purpose of a G code?',
      ru: 'Какова цель G-кода?',
    },
    options: [
      { en: 'Defines tool geometry', ru: 'Определяет геометрию инструмента' },
      {
        en: 'Defines machine movement behavior',
        ru: 'Определяет характер перемещения станка',
      },
      { en: 'Stores part numbers', ru: 'Хранит номера деталей' },
      { en: 'Sets program language', ru: 'Задаёт язык программы' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G codes control the machine motion and behavior during a program.',
      ru: 'G-коды управляют перемещением и поведением станка во время выполнения программы.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what role do G codes play?',
        ru: 'Какую роль играют G-коды в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'They control how the machine moves during the program',
        ru: 'Они управляют перемещением станка во время выполнения программы',
      },
    ],
  },
  {
    id: 8,
    category: 'M',
    topic: 'program-control',
    code: 'M30',
    prompt: {
      en: 'What does M30 do?',
      ru: 'Что делает M30?',
    },
    options: [
      {
        en: 'Ends the program without rewinding',
        ru: 'Завершает программу без перемотки',
      },
      {
        en: 'Ends the program and rewinds/resets',
        ru: 'Завершает программу с перемоткой/сбросом',
      },
      { en: 'Changes the tool', ru: 'Меняет инструмент' },
      {
        en: 'Returns to the machine reference (home) position',
        ru: 'Возвращается в исходную (нулевую) точку станка',
      },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M30 is commonly used to end the program and rewind the tape or reset.',
      ru: 'M30 обычно используется для завершения программы с перемоткой/сбросом в начало.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M30 used for?',
        ru: 'Для чего используется команда M30 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Finishes the program and resets/rewinds it',
        ru: 'Завершает программу и выполняет сброс/перемотку',
      },
    ],
  },
  {
    id: 9,
    category: 'G',
    topic: 'motion',
    code: 'G02',
    prompt: {
      en: 'What does G02 command in CNC programming?',
      ru: 'Что задаёт команда G02 в программировании ЧПУ?',
    },
    options: [
      {
        en: 'Circular interpolation clockwise (CW)',
        ru: 'Круговая интерполяция по часовой стрелке (CW)',
      },
      {
        en: 'Circular interpolation counterclockwise (CCW)',
        ru: 'Круговая интерполяция против часовой стрелки (CCW)',
      },
      { en: 'Linear interpolation', ru: 'Линейная интерполяция' },
      { en: 'Rapid traverse', ru: 'Быстрый ход' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G02 produces a clockwise circular (arc) move, typically defined with I/J/K or R parameters.',
      ru: 'G02 выполняет круговое (дуговое) перемещение по часовой стрелке, обычно задаётся параметрами I/J/K или R.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G02 used for?',
        ru: 'Для чего используется команда G02 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Produces a clockwise arc move',
        ru: 'Выполняет дуговое перемещение по часовой стрелке',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Cut a clockwise arc ending at X=40, Y=0, with the arc center offset from the start at I=-20, J=0, feed rate F=150.',
          ru: 'Выполните дугу по часовой стрелке до точки X=40, Y=0, со смещением центра дуги от начала I=-20, J=0, подача F=150.',
        },
        params: [
          { letter: 'X', value: '40' },
          { letter: 'Y', value: '0' },
          { letter: 'I', value: '-20' },
          { letter: 'J', value: '0' },
          { letter: 'F', value: '150' },
        ],
      },
      {
        prompt: {
          en: 'Cut a clockwise arc ending at X=0, Y=-30, with the arc center offset from the start at I=0, J=-30, feed rate F=120.',
          ru: 'Выполните дугу по часовой стрелке до точки X=0, Y=-30, со смещением центра дуги от начала I=0, J=-30, подача F=120.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '-30' },
          { letter: 'I', value: '0' },
          { letter: 'J', value: '-30' },
          { letter: 'F', value: '120' },
        ],
      },
      {
        prompt: {
          en: 'Cut a clockwise arc ending at X=25, Y=25, with the arc center offset from the start at I=25, J=0, feed rate F=100.',
          ru: 'Выполните дугу по часовой стрелке до точки X=25, Y=25, со смещением центра дуги от начала I=25, J=0, подача F=100.',
        },
        params: [
          { letter: 'X', value: '25' },
          { letter: 'Y', value: '25' },
          { letter: 'I', value: '25' },
          { letter: 'J', value: '0' },
          { letter: 'F', value: '100' },
        ],
      },
    ],
  },
  {
    id: 10,
    category: 'G',
    topic: 'motion',
    code: 'G03',
    prompt: {
      en: 'What does G03 command?',
      ru: 'Что задаёт команда G03?',
    },
    options: [
      {
        en: 'Circular interpolation clockwise (CW)',
        ru: 'Круговая интерполяция по часовой стрелке (CW)',
      },
      {
        en: 'Circular interpolation counterclockwise (CCW)',
        ru: 'Круговая интерполяция против часовой стрелки (CCW)',
      },
      { en: 'Dwell', ru: 'Пауза (выдержка времени)' },
      { en: 'Tool length compensation', ru: 'Коррекция на длину инструмента' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G03 produces a counterclockwise circular (arc) move.',
      ru: 'G03 выполняет круговое (дуговое) перемещение против часовой стрелки.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G03 used for?',
        ru: 'Для чего используется команда G03 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Produces a counterclockwise arc move',
        ru: 'Выполняет дуговое перемещение против часовой стрелки',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Cut a counterclockwise arc ending at X=0, Y=40, with the arc center offset from the start at I=0, J=-20, feed rate F=150.',
          ru: 'Выполните дугу против часовой стрелки до точки X=0, Y=40, со смещением центра дуги от начала I=0, J=-20, подача F=150.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '40' },
          { letter: 'I', value: '0' },
          { letter: 'J', value: '-20' },
          { letter: 'F', value: '150' },
        ],
      },
      {
        prompt: {
          en: 'Cut a counterclockwise arc ending at X=-30, Y=0, with the arc center offset from the start at I=-30, J=0, feed rate F=120.',
          ru: 'Выполните дугу против часовой стрелки до точки X=-30, Y=0, со смещением центра дуги от начала I=-30, J=0, подача F=120.',
        },
        params: [
          { letter: 'X', value: '-30' },
          { letter: 'Y', value: '0' },
          { letter: 'I', value: '-30' },
          { letter: 'J', value: '0' },
          { letter: 'F', value: '120' },
        ],
      },
      {
        prompt: {
          en: 'Cut a counterclockwise arc ending at X=20, Y=20, with the arc center offset from the start at I=0, J=20, feed rate F=100.',
          ru: 'Выполните дугу против часовой стрелки до точки X=20, Y=20, со смещением центра дуги от начала I=0, J=20, подача F=100.',
        },
        params: [
          { letter: 'X', value: '20' },
          { letter: 'Y', value: '20' },
          { letter: 'I', value: '0' },
          { letter: 'J', value: '20' },
          { letter: 'F', value: '100' },
        ],
      },
    ],
  },
  {
    id: 11,
    category: 'G',
    topic: 'dwell',
    code: 'G04',
    prompt: {
      en: 'What is the function of G04?',
      ru: 'Какую функцию выполняет G04?',
    },
    options: [
      {
        en: 'Dwell (pause) for a specified time',
        ru: 'Пауза (выдержка времени) заданной длительности',
      },
      { en: 'Spindle orientation', ru: 'Ориентация шпинделя' },
      { en: 'Coolant control', ru: 'Управление СОЖ' },
      { en: 'Return to reference point', ru: 'Возврат в исходную точку' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G04 pauses program execution for a specified dwell time, usually set with a P or X address.',
      ru: 'G04 приостанавливает выполнение программы на заданное время, обычно задаётся адресом P или X.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G04 used for?',
        ru: 'Для чего используется команда G04 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Pauses execution for a set amount of time',
        ru: 'Приостанавливает выполнение программы на заданное время',
      },
    ],
  },
  {
    id: 12,
    category: 'G',
    topic: 'plane-selection',
    code: 'G17',
    prompt: {
      en: 'What does G17 select?',
      ru: 'Какую плоскость выбирает G17?',
    },
    options: [
      { en: 'XY plane', ru: 'Плоскость XY' },
      { en: 'ZX plane', ru: 'Плоскость ZX' },
      { en: 'YZ plane', ru: 'Плоскость YZ' },
      { en: 'Polar plane', ru: 'Полярную плоскость' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G17 selects the XY plane, the default plane for most milling operations.',
      ru: 'G17 выбирает плоскость XY — плоскость по умолчанию для большинства фрезерных операций.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, which plane is active under G17?',
        ru: 'Какая плоскость активна при команде G17?',
      },
    ],
    answerVariants: [{ en: 'The XY plane', ru: 'Плоскость XY' }],
  },
  {
    id: 13,
    category: 'G',
    topic: 'plane-selection',
    code: 'G18',
    prompt: {
      en: 'What does G18 select?',
      ru: 'Какую плоскость выбирает G18?',
    },
    options: [
      { en: 'XY plane', ru: 'Плоскость XY' },
      { en: 'ZX plane', ru: 'Плоскость ZX' },
      { en: 'YZ plane', ru: 'Плоскость YZ' },
      { en: 'None of these', ru: 'Ни одну из перечисленных' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G18 selects the ZX (XZ) plane, commonly used on lathes and some milling cycles.',
      ru: 'G18 выбирает плоскость ZX (XZ), часто используется на токарных станках и в некоторых фрезерных циклах.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, which plane is active under G18?',
        ru: 'Какая плоскость активна при команде G18?',
      },
    ],
    answerVariants: [{ en: 'The ZX plane', ru: 'Плоскость ZX' }],
  },
  {
    id: 14,
    category: 'G',
    topic: 'plane-selection',
    code: 'G19',
    prompt: {
      en: 'What does G19 select?',
      ru: 'Какую плоскость выбирает G19?',
    },
    options: [
      { en: 'XY plane', ru: 'Плоскость XY' },
      { en: 'ZX plane', ru: 'Плоскость ZX' },
      { en: 'YZ plane', ru: 'Плоскость YZ' },
      { en: 'Reference plane', ru: 'Исходную плоскость' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'G19 selects the YZ plane.',
      ru: 'G19 выбирает плоскость YZ.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, which plane is active under G19?',
        ru: 'Какая плоскость активна при команде G19?',
      },
    ],
    answerVariants: [{ en: 'The YZ plane', ru: 'Плоскость YZ' }],
  },
  {
    id: 15,
    category: 'G',
    topic: 'units',
    code: 'G20',
    prompt: {
      en: 'What does G20 specify?',
      ru: 'Что задаёт команда G20?',
    },
    options: [
      { en: 'Millimeters', ru: 'Миллиметры' },
      { en: 'Inches', ru: 'Дюймы' },
      { en: 'Radians', ru: 'Радианы' },
      { en: 'Feed per revolution', ru: 'Подача на оборот' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G20 switches the machine to inch units, the counterpart of G21 for millimeters.',
      ru: 'G20 переключает станок на дюймовые единицы измерения — аналог G21 для миллиметров.',
    },
    promptVariants: [
      {
        en: 'Which units does G20 select?',
        ru: 'Какие единицы измерения выбирает команда G20?',
      },
    ],
    answerVariants: [
      { en: 'Imperial units (inches)', ru: 'Дюймовые единицы (дюймы)' },
    ],
  },
  {
    id: 16,
    category: 'G',
    topic: 'homing',
    code: 'G28',
    prompt: {
      en: 'What does G28 command a CNC machine to do?',
      ru: 'Что предписывает станку команда G28?',
    },
    options: [
      { en: 'Move to a work offset', ru: 'Переместиться к рабочему смещению' },
      {
        en: 'Return to the machine reference (home) position',
        ru: 'Вернуться в исходную (нулевую) точку станка',
      },
      { en: 'Cancel tool compensation', ru: 'Отменить коррекцию инструмента' },
      { en: 'Start a canned cycle', ru: 'Запустить постоянный цикл' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G28 sends the machine to its reference (home) position, often via an intermediate point.',
      ru: 'G28 направляет станок в исходную (нулевую) точку, часто через промежуточную точку.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G28 used for?',
        ru: 'Для чего используется команда G28 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Sends the machine back to its home/reference position',
        ru: 'Отправляет станок обратно в исходную (нулевую) позицию',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Return to the machine reference position, passing through an intermediate point at X=0, Y=0, Z=0.',
          ru: 'Вернитесь в исходную точку станка через промежуточную точку X=0, Y=0, Z=0.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '0' },
        ],
      },
      {
        prompt: {
          en: 'Return to the machine reference point, passing through an intermediate point at X=50, Y=50, Z=0.',
          ru: 'Вернитесь в исходную точку станка через промежуточную точку X=50, Y=50, Z=0.',
        },
        params: [
          { letter: 'X', value: '50' },
          { letter: 'Y', value: '50' },
          { letter: 'Z', value: '0' },
        ],
      },
      {
        prompt: {
          en: 'Return to the machine reference point, passing through an intermediate point at Z=100.',
          ru: 'Вернитесь в исходную точку станка через промежуточную точку Z=100.',
        },
        params: [{ letter: 'Z', value: '100' }],
      },
    ],
  },
  {
    id: 17,
    category: 'G',
    topic: 'compensation',
    code: 'G40',
    prompt: {
      en: 'What does G40 do?',
      ru: 'Что делает G40?',
    },
    options: [
      {
        en: 'Activate cutter compensation left',
        ru: 'Включить коррекцию на радиус фрезы слева',
      },
      {
        en: 'Activate cutter compensation right',
        ru: 'Включить коррекцию на радиус фрезы справа',
      },
      {
        en: 'Cancel cutter radius compensation',
        ru: 'Отменить коррекцию на радиус фрезы',
      },
      {
        en: 'Cancel tool length compensation',
        ru: 'Отменить коррекцию на длину инструмента',
      },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'G40 cancels cutter radius compensation (G41/G42).',
      ru: 'G40 отменяет коррекцию на радиус инструмента (G41/G42).',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G40 used for?',
        ru: 'Для чего используется команда G40 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns off cutter radius compensation',
        ru: 'Отключает коррекцию на радиус инструмента',
      },
    ],
  },
  {
    id: 18,
    category: 'G',
    topic: 'compensation',
    code: 'G41',
    prompt: {
      en: 'What does G41 activate?',
      ru: 'Что включает G41?',
    },
    options: [
      { en: 'Cutter compensation left', ru: 'Коррекцию на радиус фрезы слева' },
      {
        en: 'Cutter compensation right',
        ru: 'Коррекцию на радиус фрезы справа',
      },
      { en: 'Tool length compensation', ru: 'Коррекцию на длину инструмента' },
      { en: 'Constant surface speed', ru: 'Постоянная скорость резания' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G41 applies cutter radius compensation to the left of the programmed path.',
      ru: 'G41 применяет коррекцию на радиус инструмента слева от запрограммированной траектории.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does G41 turn on?',
        ru: 'Что включает команда G41 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Cutter radius compensation offset to the left of the path',
        ru: 'Коррекцию на радиус инструмента со смещением влево от траектории',
      },
    ],
  },
  {
    id: 19,
    category: 'G',
    topic: 'compensation',
    code: 'G42',
    prompt: {
      en: 'What does G42 activate?',
      ru: 'Что включает G42?',
    },
    options: [
      { en: 'Cutter compensation left', ru: 'Коррекцию на радиус фрезы слева' },
      {
        en: 'Cutter compensation right',
        ru: 'Коррекцию на радиус фрезы справа',
      },
      {
        en: 'Cutter compensation cancel',
        ru: 'Отмену коррекции на радиус фрезы',
      },
      { en: 'Spindle speed control', ru: 'Управление скоростью шпинделя' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G42 applies cutter radius compensation to the right of the programmed path.',
      ru: 'G42 применяет коррекцию на радиус инструмента справа от запрограммированной траектории.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does G42 turn on?',
        ru: 'Что включает команда G42 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Cutter radius compensation offset to the right of the path',
        ru: 'Коррекцию на радиус инструмента со смещением вправо от траектории',
      },
    ],
  },
  {
    id: 20,
    category: 'G',
    topic: 'compensation',
    code: 'G43',
    prompt: {
      en: 'What does G43 apply?',
      ru: 'Что применяет G43?',
    },
    options: [
      {
        en: 'Tool length compensation (positive)',
        ru: 'Коррекцию на длину инструмента (положительную)',
      },
      {
        en: 'Tool length compensation cancel',
        ru: 'Отмену коррекции на длину инструмента',
      },
      { en: 'Cutter radius compensation', ru: 'Коррекцию на радиус фрезы' },
      { en: 'Work offset selection', ru: 'Выбор рабочего смещения' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G43 applies positive tool length compensation, usually paired with an H offset number.',
      ru: 'G43 применяет положительную коррекцию на длину инструмента, обычно вместе с номером коррекции H.',
    },
    promptVariants: [
      {
        en: 'Which compensation does G43 apply, and in which direction?',
        ru: 'Какую коррекцию и в каком направлении применяет G43?',
      },
    ],
    answerVariants: [
      {
        en: 'Positive tool length compensation',
        ru: 'Положительную коррекцию на длину инструмента',
      },
    ],
  },
  {
    id: 21,
    category: 'G',
    topic: 'compensation',
    code: 'G49',
    prompt: {
      en: 'What does G49 do?',
      ru: 'Что делает G49?',
    },
    options: [
      {
        en: 'Apply tool length compensation',
        ru: 'Применить коррекцию на длину инструмента',
      },
      {
        en: 'Cancel tool length compensation',
        ru: 'Отменить коррекцию на длину инструмента',
      },
      {
        en: 'Cancel cutter radius compensation',
        ru: 'Отменить коррекцию на радиус фрезы',
      },
      {
        en: 'Select a work coordinate system',
        ru: 'Выбрать систему координат детали',
      },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G49 cancels tool length compensation set by G43/G44.',
      ru: 'G49 отменяет коррекцию на длину инструмента, заданную G43/G44.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G49 used for?',
        ru: 'Для чего используется команда G49 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns off tool length compensation',
        ru: 'Отключает коррекцию на длину инструмента',
      },
    ],
  },
  {
    id: 22,
    category: 'G',
    topic: 'work-offset',
    code: 'G54',
    prompt: {
      en: 'What is the purpose of G54 (through G59)?',
      ru: 'Какова цель команд G54 (по G59)?',
    },
    options: [
      {
        en: 'Select a work coordinate system offset',
        ru: 'Выбрать смещение системы координат детали',
      },
      { en: 'Set feed rate mode', ru: 'Задать режим подачи' },
      {
        en: 'Select a tool length offset',
        ru: 'Выбрать коррекцию на длину инструмента',
      },
      { en: 'Cancel canned cycles', ru: 'Отменить постоянные циклы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G54-G59 select one of several stored work coordinate system offsets.',
      ru: 'G54-G59 выбирают одно из нескольких сохранённых смещений системы координат детали.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is the G54-G59 group used for?',
        ru: 'Для чего используется группа команд G54-G59 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Selects one of the stored work coordinate offsets',
        ru: 'Выбирает одно из сохранённых смещений системы координат детали',
      },
    ],
  },
  {
    id: 23,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G80',
    prompt: {
      en: 'What does G80 do?',
      ru: 'Что делает G80?',
    },
    options: [
      { en: 'Start a drilling canned cycle', ru: 'Запустить цикл сверления' },
      { en: 'Cancel a canned cycle', ru: 'Отменить постоянный цикл' },
      { en: 'Start a tapping cycle', ru: 'Запустить цикл нарезания резьбы' },
      {
        en: 'Select constant surface speed',
        ru: 'Включить постоянную скорость резания',
      },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G80 cancels any active canned (fixed) cycle such as drilling or tapping.',
      ru: 'G80 отменяет любой активный постоянный цикл, например сверление или нарезание резьбы.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G80 used for?',
        ru: 'Для чего используется команда G80 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Ends whichever canned cycle is currently active',
        ru: 'Завершает любой активный постоянный цикл',
      },
    ],
  },
  {
    id: 24,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G81',
    prompt: {
      en: 'What operation does G81 perform?',
      ru: 'Какую операцию выполняет G81?',
    },
    options: [
      { en: 'Simple drilling cycle', ru: 'Простой цикл сверления' },
      { en: 'Peck drilling cycle', ru: 'Цикл прерывистого сверления' },
      { en: 'Tapping cycle', ru: 'Цикл нарезания резьбы' },
      { en: 'Boring cycle with dwell', ru: 'Цикл растачивания с выдержкой' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G81 is a basic drilling canned cycle: rapid to position, feed to depth, rapid retract.',
      ru: 'G81 — базовый цикл сверления: быстрый подвод, подача на глубину, быстрый отвод.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G81 used for?',
        ru: 'Для чего используется команда G81 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      { en: 'A basic drilling cycle', ru: 'Простой цикл сверления' },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Drill a hole at X=10, Y=5. Retract plane R=2, hole depth Z=-12, feed rate F=100.',
          ru: 'Просверлите отверстие в точке X=10, Y=5. Плоскость отвода R=2, глубина отверстия Z=-12, подача F=100.',
        },
        params: [
          { letter: 'X', value: '10' },
          { letter: 'Y', value: '5' },
          { letter: 'Z', value: '-12' },
          { letter: 'R', value: '2' },
          { letter: 'F', value: '100' },
        ],
      },
      {
        prompt: {
          en: 'Drill a hole at X=0, Y=0. Retract plane R=3, hole depth Z=-8, feed rate F=120.',
          ru: 'Просверлите отверстие в точке X=0, Y=0. Плоскость отвода R=3, глубина отверстия Z=-8, подача F=120.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-8' },
          { letter: 'R', value: '3' },
          { letter: 'F', value: '120' },
        ],
      },
      {
        prompt: {
          en: 'Drill a hole at X=-20, Y=15. Retract plane R=5, hole depth Z=-20, feed rate F=90.',
          ru: 'Просверлите отверстие в точке X=-20, Y=15. Плоскость отвода R=5, глубина отверстия Z=-20, подача F=90.',
        },
        params: [
          { letter: 'X', value: '-20' },
          { letter: 'Y', value: '15' },
          { letter: 'Z', value: '-20' },
          { letter: 'R', value: '5' },
          { letter: 'F', value: '90' },
        ],
      },
    ],
  },
  {
    id: 25,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G82',
    prompt: {
      en: 'How does G82 differ from G81?',
      ru: 'Чем G82 отличается от G81?',
    },
    options: [
      {
        en: 'It adds a dwell at the bottom of the hole',
        ru: 'Добавляет выдержку времени на дне отверстия',
      },
      {
        en: 'It retracts at feed rate',
        ru: 'Отводит инструмент на рабочей подаче',
      },
      { en: 'It uses peck cycles', ru: 'Использует прерывистые циклы' },
      {
        en: 'It is used only for tapping',
        ru: 'Используется только для нарезания резьбы',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G82 is a drilling cycle like G81 but adds a dwell at the bottom of the hole for a better finish.',
      ru: 'G82 — цикл сверления, как G81, но с выдержкой на дне отверстия для лучшего качества поверхности.',
    },
    promptVariants: [
      {
        en: 'What extra step does G82 add compared to G81?',
        ru: 'Какой дополнительный шаг добавляет G82 по сравнению с G81?',
      },
    ],
    answerVariants: [
      {
        en: 'A dwell pause at the bottom of the hole',
        ru: 'Паузу (выдержку) на дне отверстия',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Drill a hole with a dwell at the bottom at X=20, Y=15. Retract plane R=2, hole depth Z=-10, dwell time P=500, feed rate F=80.',
          ru: 'Просверлите отверстие с выдержкой на дне в точке X=20, Y=15. Плоскость отвода R=2, глубина отверстия Z=-10, время выдержки P=500, подача F=80.',
        },
        params: [
          { letter: 'X', value: '20' },
          { letter: 'Y', value: '15' },
          { letter: 'Z', value: '-10' },
          { letter: 'R', value: '2' },
          { letter: 'P', value: '500' },
          { letter: 'F', value: '80' },
        ],
      },
      {
        prompt: {
          en: 'Drill a hole with a dwell at the bottom at X=0, Y=0. Retract plane R=3, hole depth Z=-6, dwell time P=300, feed rate F=100.',
          ru: 'Просверлите отверстие с выдержкой на дне в точке X=0, Y=0. Плоскость отвода R=3, глубина отверстия Z=-6, время выдержки P=300, подача F=100.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-6' },
          { letter: 'R', value: '3' },
          { letter: 'P', value: '300' },
          { letter: 'F', value: '100' },
        ],
      },
      {
        prompt: {
          en: 'Drill a hole with a dwell at the bottom at X=-8, Y=12. Retract plane R=4, hole depth Z=-14, dwell time P=800, feed rate F=70.',
          ru: 'Просверлите отверстие с выдержкой на дне в точке X=-8, Y=12. Плоскость отвода R=4, глубина отверстия Z=-14, время выдержки P=800, подача F=70.',
        },
        params: [
          { letter: 'X', value: '-8' },
          { letter: 'Y', value: '12' },
          { letter: 'Z', value: '-14' },
          { letter: 'R', value: '4' },
          { letter: 'P', value: '800' },
          { letter: 'F', value: '70' },
        ],
      },
    ],
  },
  {
    id: 26,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G83',
    prompt: {
      en: 'What is G83 used for?',
      ru: 'Для чего используется G83?',
    },
    options: [
      {
        en: 'Peck drilling cycle for deep holes',
        ru: 'Цикл прерывистого сверления глубоких отверстий',
      },
      { en: 'Rigid tapping', ru: 'Жёсткое нарезание резьбы' },
      {
        en: 'Boring with feed-rate retract',
        ru: 'Растачивание с отводом на подаче',
      },
      { en: 'Circular interpolation', ru: 'Круговая интерполяция' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G83 performs a peck drilling cycle, fully retracting between pecks to clear chips on deep holes.',
      ru: 'G83 выполняет цикл прерывистого сверления с полным отводом между проходами для удаления стружки из глубоких отверстий.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G83 used for?',
        ru: 'Для чего используется команда G83 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A peck drilling cycle for clearing chips from deep holes',
        ru: 'Цикл прерывистого сверления для удаления стружки из глубоких отверстий',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Peck-drill a hole at X=5, Y=5. Retract plane R=3, hole depth Z=-25, peck depth Q=5, feed rate F=60.',
          ru: 'Просверлите отверстие с прерывистой подачей в точке X=5, Y=5. Плоскость отвода R=3, глубина отверстия Z=-25, глубина шага Q=5, подача F=60.',
        },
        params: [
          { letter: 'X', value: '5' },
          { letter: 'Y', value: '5' },
          { letter: 'Z', value: '-25' },
          { letter: 'R', value: '3' },
          { letter: 'Q', value: '5' },
          { letter: 'F', value: '60' },
        ],
      },
      {
        prompt: {
          en: 'Peck-drill a hole at X=0, Y=0. Retract plane R=2, hole depth Z=-35, peck depth Q=6, feed rate F=70.',
          ru: 'Просверлите отверстие с прерывистой подачей в точке X=0, Y=0. Плоскость отвода R=2, глубина отверстия Z=-35, глубина шага Q=6, подача F=70.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-35' },
          { letter: 'R', value: '2' },
          { letter: 'Q', value: '6' },
          { letter: 'F', value: '70' },
        ],
      },
      {
        prompt: {
          en: 'Peck-drill a hole at X=18, Y=-12. Retract plane R=4, hole depth Z=-45, peck depth Q=8, feed rate F=55.',
          ru: 'Просверлите отверстие с прерывистой подачей в точке X=18, Y=-12. Плоскость отвода R=4, глубина отверстия Z=-45, глубина шага Q=8, подача F=55.',
        },
        params: [
          { letter: 'X', value: '18' },
          { letter: 'Y', value: '-12' },
          { letter: 'Z', value: '-45' },
          { letter: 'R', value: '4' },
          { letter: 'Q', value: '8' },
          { letter: 'F', value: '55' },
        ],
      },
    ],
  },
  {
    id: 27,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G84',
    prompt: {
      en: 'What does G84 perform?',
      ru: 'Какую операцию выполняет G84?',
    },
    options: [
      { en: 'Reaming cycle', ru: 'Цикл развёртывания' },
      { en: 'Tapping cycle', ru: 'Цикл нарезания резьбы' },
      { en: 'Boring cycle', ru: 'Цикл растачивания' },
      { en: 'Rapid positioning', ru: 'Быстрое позиционирование' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G84 is a canned cycle for tapping, synchronizing spindle rotation with feed to cut threads.',
      ru: 'G84 — постоянный цикл нарезания резьбы, синхронизирующий вращение шпинделя с подачей.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G84 used for?',
        ru: 'Для чего используется команда G84 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A tapping cycle that synchronizes spindle rotation with feed',
        ru: 'Цикл нарезания резьбы, синхронизирующий вращение шпинделя с подачей',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Tap a hole at X=0, Y=0. Retract plane R=5, thread depth Z=-15, feed rate F=150 (matched to the thread pitch).',
          ru: 'Нарежьте резьбу в точке X=0, Y=0. Плоскость отвода R=5, глубина резьбы Z=-15, подача F=150 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-15' },
          { letter: 'R', value: '5' },
          { letter: 'F', value: '150' },
        ],
      },
      {
        prompt: {
          en: 'Tap a hole at X=20, Y=10. Retract plane R=4, thread depth Z=-18, feed rate F=175 (matched to the thread pitch).',
          ru: 'Нарежьте резьбу в точке X=20, Y=10. Плоскость отвода R=4, глубина резьбы Z=-18, подача F=175 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '20' },
          { letter: 'Y', value: '10' },
          { letter: 'Z', value: '-18' },
          { letter: 'R', value: '4' },
          { letter: 'F', value: '175' },
        ],
      },
      {
        prompt: {
          en: 'Tap a hole at X=-15, Y=-5. Retract plane R=6, thread depth Z=-22, feed rate F=200 (matched to the thread pitch).',
          ru: 'Нарежьте резьбу в точке X=-15, Y=-5. Плоскость отвода R=6, глубина резьбы Z=-22, подача F=200 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '-15' },
          { letter: 'Y', value: '-5' },
          { letter: 'Z', value: '-22' },
          { letter: 'R', value: '6' },
          { letter: 'F', value: '200' },
        ],
      },
    ],
  },
  {
    id: 28,
    category: 'G',
    topic: 'positioning',
    code: 'G90',
    prompt: {
      en: 'What does G90 specify?',
      ru: 'Что задаёт команда G90?',
    },
    options: [
      { en: 'Incremental positioning', ru: 'Относительное позиционирование' },
      { en: 'Absolute positioning', ru: 'Абсолютное позиционирование' },
      { en: 'Constant surface speed', ru: 'Постоянная скорость резания' },
      { en: 'Feed per revolution', ru: 'Подача на оборот' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G90 sets absolute positioning mode, where coordinates are referenced from a fixed origin.',
      ru: 'G90 устанавливает режим абсолютного позиционирования, где координаты отсчитываются от фиксированного начала.',
    },
    promptVariants: [
      {
        en: 'Which positioning mode does G90 set?',
        ru: 'Какой режим позиционирования устанавливает G90?',
      },
    ],
    answerVariants: [
      {
        en: 'Absolute positioning mode',
        ru: 'Режим абсолютного позиционирования',
      },
    ],
  },
  {
    id: 29,
    category: 'G',
    topic: 'positioning',
    code: 'G91',
    prompt: {
      en: 'What does G91 specify?',
      ru: 'Что задаёт команда G91?',
    },
    options: [
      { en: 'Absolute positioning', ru: 'Абсолютное позиционирование' },
      { en: 'Incremental positioning', ru: 'Относительное позиционирование' },
      { en: 'Metric units', ru: 'Метрические единицы' },
      { en: 'Plane selection', ru: 'Выбор плоскости' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G91 sets incremental positioning mode, where each move is relative to the current position.',
      ru: 'G91 устанавливает режим относительного позиционирования, где каждое перемещение отсчитывается от текущей позиции.',
    },
    promptVariants: [
      {
        en: 'Which positioning mode does G91 set?',
        ru: 'Какой режим позиционирования устанавливает G91?',
      },
    ],
    answerVariants: [
      {
        en: 'Incremental positioning mode',
        ru: 'Режим относительного позиционирования',
      },
    ],
  },
  {
    id: 30,
    category: 'G',
    topic: 'feed-mode',
    code: 'G94',
    prompt: {
      en: 'What feed mode does G94 set?',
      ru: 'Какой режим подачи задаёт G94?',
    },
    options: [
      { en: 'Feed per revolution', ru: 'Подача на оборот' },
      { en: 'Feed per minute', ru: 'Подача в минуту' },
      { en: 'Constant surface speed', ru: 'Постоянная скорость резания' },
      { en: 'Rapid feed only', ru: 'Только быстрый ход' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G94 sets feed per minute mode, the common feed rate mode for milling.',
      ru: 'G94 устанавливает режим подачи в минуту — распространённый режим подачи для фрезерования.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what feed mode does G94 activate?',
        ru: 'Какой режим подачи включает G94 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      { en: 'Feed-per-minute mode', ru: 'Режим подачи в минуту' },
    ],
  },
  {
    id: 31,
    category: 'G',
    topic: 'feed-mode',
    code: 'G95',
    prompt: {
      en: 'What feed mode does G95 set?',
      ru: 'Какой режим подачи задаёт G95?',
    },
    options: [
      { en: 'Feed per minute', ru: 'Подача в минуту' },
      { en: 'Feed per revolution', ru: 'Подача на оборот' },
      { en: 'Dwell mode', ru: 'Режим паузы' },
      { en: 'Rapid traverse', ru: 'Быстрый ход' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G95 sets feed per revolution mode, commonly used on lathes.',
      ru: 'G95 устанавливает режим подачи на оборот, часто используемый на токарных станках.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what feed mode does G95 activate?',
        ru: 'Какой режим подачи включает G95 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      { en: 'Feed-per-revolution mode', ru: 'Режим подачи на оборот' },
    ],
  },
  {
    id: 32,
    category: 'G',
    topic: 'spindle',
    code: 'G96',
    prompt: {
      en: 'What does G96 activate on a CNC lathe?',
      ru: 'Что включает G96 на токарном станке с ЧПУ?',
    },
    options: [
      {
        en: 'Constant surface speed control',
        ru: 'Постоянную скорость резания',
      },
      { en: 'Constant spindle RPM', ru: 'Постоянные обороты шпинделя' },
      { en: 'Tapping mode', ru: 'Режим нарезания резьбы' },
      { en: 'Cutter compensation', ru: 'Коррекцию на радиус фрезы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G96 activates constant surface speed control, adjusting spindle RPM as the tool diameter changes to keep cutting speed constant.',
      ru: 'G96 включает постоянную скорость резания, изменяя обороты шпинделя при изменении диаметра, чтобы скорость резания оставалась постоянной.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does G96 turn on for a lathe?',
        ru: 'Что включает команда G96 на токарном станке?',
      },
    ],
    answerVariants: [
      {
        en: 'Adjusts spindle RPM to hold a constant cutting speed',
        ru: 'Регулирует обороты шпинделя для поддержания постоянной скорости резания',
      },
    ],
  },
  {
    id: 33,
    category: 'G',
    topic: 'spindle',
    code: 'G97',
    prompt: {
      en: 'What does G97 do?',
      ru: 'Что делает G97?',
    },
    options: [
      {
        en: 'Activate constant surface speed',
        ru: 'Включить постоянную скорость резания',
      },
      {
        en: 'Cancel constant surface speed and use constant RPM',
        ru: 'Отменить постоянную скорость резания и вернуться к постоянным оборотам',
      },
      { en: 'Select a work offset', ru: 'Выбрать рабочее смещение' },
      { en: 'Start a canned cycle', ru: 'Запустить постоянный цикл' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'G97 cancels constant surface speed control (G96) and returns to a constant spindle speed in RPM.',
      ru: 'G97 отменяет постоянную скорость резания (G96) и возвращает постоянные обороты шпинделя (об/мин).',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G97 used for?',
        ru: 'Для чего используется команда G97 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Cancels constant surface speed and holds a fixed RPM',
        ru: 'Отменяет постоянную скорость резания и удерживает постоянные обороты',
      },
    ],
  },
  {
    id: 34,
    category: 'M',
    topic: 'program-control',
    code: 'M00',
    prompt: {
      en: 'What does M00 do?',
      ru: 'Что делает M00?',
    },
    options: [
      { en: 'Optional program stop', ru: 'Необязательная остановка программы' },
      {
        en: 'Unconditional program stop',
        ru: 'Безусловная остановка программы',
      },
      { en: 'Program end and reset', ru: 'Завершение программы со сбросом' },
      { en: 'Tool change', ru: 'Смена инструмента' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M00 causes an unconditional stop; the operator must press cycle start to continue.',
      ru: 'M00 вызывает безусловную остановку; оператор должен нажать «пуск цикла», чтобы продолжить.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M00 used for?',
        ru: 'Для чего используется команда M00 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Stops the program unconditionally until the operator resumes it',
        ru: 'Безусловно останавливает программу, пока оператор её не возобновит',
      },
    ],
  },
  {
    id: 35,
    category: 'M',
    topic: 'program-control',
    code: 'M01',
    prompt: {
      en: 'What does M01 do?',
      ru: 'Что делает M01?',
    },
    options: [
      {
        en: 'Optional stop, only if enabled on the control',
        ru: 'Необязательная остановка, только если она включена на пульте управления',
      },
      { en: 'Unconditional stop', ru: 'Безусловная остановка' },
      { en: 'Spindle stop', ru: 'Остановка шпинделя' },
      { en: 'End of program', ru: 'Конец программы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M01 is an optional stop that only pauses the program if the operator has enabled optional stop on the control.',
      ru: 'M01 — необязательная остановка, которая приостанавливает программу, только если оператор включил её на пульте управления.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M01 used for?',
        ru: 'Для чего используется команда M01 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Pauses the program, but only when optional stop is switched on',
        ru: 'Приостанавливает программу, но только если включена необязательная остановка',
      },
    ],
  },
  {
    id: 36,
    category: 'M',
    topic: 'program-control',
    code: 'M02',
    prompt: {
      en: 'What does M02 do?',
      ru: 'Что делает M02?',
    },
    options: [
      {
        en: 'End the program without rewinding',
        ru: 'Завершить программу без перемотки',
      },
      {
        en: 'End the program and rewind/reset',
        ru: 'Завершить программу с перемоткой/сбросом',
      },
      { en: 'Stop the spindle', ru: 'Остановить шпиндель' },
      { en: 'Change the tool', ru: 'Сменить инструмент' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M02 marks the end of the program; unlike M30 it typically does not reset the program pointer to the beginning.',
      ru: 'M02 обозначает конец программы; в отличие от M30, обычно не возвращает указатель программы в начало.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M02 used for?',
        ru: 'Для чего используется команда M02 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Marks the end of the program without resetting to the start',
        ru: 'Обозначает конец программы без возврата в начало',
      },
    ],
  },
  {
    id: 37,
    category: 'M',
    topic: 'spindle',
    code: 'M04',
    prompt: {
      en: 'What does M04 command?',
      ru: 'Что задаёт команда M04?',
    },
    options: [
      {
        en: 'Spindle on clockwise',
        ru: 'Включить шпиндель по часовой стрелке',
      },
      {
        en: 'Spindle on counterclockwise',
        ru: 'Включить шпиндель против часовой стрелки',
      },
      { en: 'Spindle stop', ru: 'Остановка шпинделя' },
      { en: 'Spindle orientation', ru: 'Ориентация шпинделя' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M04 starts the spindle rotating counterclockwise.',
      ru: 'M04 запускает вращение шпинделя против часовой стрелки.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M04 used for?',
        ru: 'Для чего используется команда M04 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Starts the spindle turning counterclockwise',
        ru: 'Запускает вращение шпинделя против часовой стрелки',
      },
    ],
  },
  {
    id: 38,
    category: 'M',
    topic: 'tool-change',
    code: 'M06',
    prompt: {
      en: 'What does M06 command?',
      ru: 'Что задаёт команда M06?',
    },
    options: [
      { en: 'Coolant on', ru: 'Включить СОЖ' },
      { en: 'Tool change', ru: 'Смену инструмента' },
      { en: 'Program stop', ru: 'Остановку программы' },
      { en: 'Spindle speed override', ru: 'Коррекцию скорости шпинделя' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M06 executes a tool change, typically to the tool number specified by a preceding T address.',
      ru: 'M06 выполняет смену инструмента, обычно на номер, заданный предшествующим адресом T.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M06 used for?',
        ru: 'Для чего используется команда M06 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Swaps in a new tool',
        ru: 'Меняет установленный инструмент на новый',
      },
    ],
  },
  {
    id: 39,
    category: 'M',
    topic: 'coolant',
    code: 'M08',
    prompt: {
      en: 'What does M08 do?',
      ru: 'Что делает M08?',
    },
    options: [
      { en: 'Turn coolant on', ru: 'Включить СОЖ' },
      { en: 'Turn coolant off', ru: 'Выключить СОЖ' },
      { en: 'Turn spindle on', ru: 'Включить шпиндель' },
      { en: 'Turn spindle off', ru: 'Выключить шпиндель' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M08 turns on flood coolant.',
      ru: 'M08 включает подачу охлаждающей жидкости (СОЖ).',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M08 used for?',
        ru: 'Для чего используется команда M08 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Switches on flood coolant',
        ru: 'Включает подачу охлаждающей жидкости (СОЖ)',
      },
    ],
  },
  {
    id: 40,
    category: 'M',
    topic: 'coolant',
    code: 'M09',
    prompt: {
      en: 'What does M09 do?',
      ru: 'Что делает M09?',
    },
    options: [
      { en: 'Turn coolant on', ru: 'Включить СОЖ' },
      { en: 'Turn coolant off', ru: 'Выключить СОЖ' },
      { en: 'Stop the spindle', ru: 'Остановить шпиндель' },
      { en: 'End the program', ru: 'Завершить программу' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M09 turns off coolant.',
      ru: 'M09 выключает подачу СОЖ.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M09 used for?',
        ru: 'Для чего используется команда M09 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Switches off the coolant supply',
        ru: 'Отключает подачу охлаждающей жидкости (СОЖ)',
      },
    ],
  },
  {
    id: 41,
    category: 'M',
    topic: 'subprogram',
    code: 'M98',
    prompt: {
      en: 'What does M98 do?',
      ru: 'Что делает M98?',
    },
    options: [
      { en: 'Call a subprogram', ru: 'Вызвать подпрограмму' },
      { en: 'Return from a subprogram', ru: 'Вернуться из подпрограммы' },
      { en: 'End the main program', ru: 'Завершить основную программу' },
      { en: 'Cancel a canned cycle', ru: 'Отменить постоянный цикл' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M98 calls a subprogram, usually specified with a P address for the program number.',
      ru: 'M98 вызывает подпрограмму, обычно указываемую адресом P с номером программы.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M98 used for?',
        ru: 'Для чего используется команда M98 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      { en: 'Invokes a subprogram', ru: 'Вызывает выполнение подпрограммы' },
    ],
  },
  {
    id: 42,
    category: 'M',
    topic: 'subprogram',
    code: 'M99',
    prompt: {
      en: 'What does M99 do?',
      ru: 'Что делает M99?',
    },
    options: [
      { en: 'Call a subprogram', ru: 'Вызвать подпрограмму' },
      {
        en: 'Return from a subprogram (or loop in the main program)',
        ru: 'Вернуться из подпрограммы (или перейти в начало основной программы)',
      },
      { en: 'Start the spindle', ru: 'Запустить шпиндель' },
      { en: 'Cancel a tool offset', ru: 'Отменить коррекцию инструмента' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M99 returns control from a subprogram to the calling program, or loops back to the start of the main program.',
      ru: 'M99 возвращает управление из подпрограммы в вызывающую программу или переходит в начало основной программы.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M99 used for?',
        ru: 'Для чего используется команда M99 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Hands control back from a subprogram, or loops the main program',
        ru: 'Возвращает управление из подпрограммы или зацикливает основную программу',
      },
    ],
  },
  {
    id: 43,
    category: 'G',
    topic: 'work-offset',
    code: 'G53',
    prompt: {
      en: 'What does G53 do?',
      ru: 'Что делает G53?',
    },
    options: [
      {
        en: 'Move using the machine coordinate system for one block',
        ru: 'Выполнить перемещение в системе координат станка для одного кадра',
      },
      { en: 'Select work offset G54', ru: 'Выбрать смещение G54' },
      {
        en: 'Set a local coordinate system',
        ru: 'Задать локальную систему координат',
      },
      {
        en: 'Cancel tool length compensation',
        ru: 'Отменить коррекцию на длину инструмента',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G53 is a non-modal command that positions the machine using the machine coordinate system, ignoring any active work offset, for the block it appears in.',
      ru: 'G53 — немодальная команда, задающая перемещение в системе координат станка, игнорируя активное смещение, только для кадра, в котором она указана.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G53 used for?',
        ru: 'Для чего используется команда G53 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: "A one-shot move in the machine's own coordinate system, ignoring work offsets",
        ru: 'Однократное перемещение в системе координат станка без учёта рабочих смещений',
      },
    ],
  },
  {
    id: 44,
    category: 'G',
    topic: 'work-offset',
    code: 'G52',
    prompt: {
      en: 'What does G52 set up?',
      ru: 'Что настраивает G52?',
    },
    options: [
      {
        en: 'A local coordinate system offset from the current work offset',
        ru: 'Локальную систему координат со смещением от текущего рабочего смещения',
      },
      { en: 'The machine coordinate system', ru: 'Систему координат станка' },
      { en: 'A canned drilling cycle', ru: 'Постоянный цикл сверления' },
      { en: 'Coordinate rotation', ru: 'Поворот системы координат' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G52 defines a local coordinate system offset from the active work coordinate system, useful for programming a feature at a convenient local origin.',
      ru: 'G52 задаёт локальную систему координат со смещением от активной рабочей системы координат — удобно для программирования элемента относительно локального начала отсчёта.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G52 used for?',
        ru: 'Для чего используется команда G52 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Establishes a local coordinate system shifted from the active work offset',
        ru: 'Задаёт локальную систему координат со сдвигом от активного рабочего смещения',
      },
    ],
  },
  {
    id: 45,
    category: 'G',
    topic: 'motion',
    code: 'G61',
    prompt: {
      en: 'What does G61 (exact stop check) do?',
      ru: 'Что делает G61 (точная остановка)?',
    },
    options: [
      {
        en: 'Decelerates to a full stop at the end of each block before moving to the next',
        ru: 'Замедляет движение до полной остановки в конце каждого кадра перед переходом к следующему',
      },
      {
        en: 'Blends corners for smoother continuous motion',
        ru: 'Сглаживает углы для более плавного непрерывного движения',
      },
      {
        en: 'Rounds sharp corners automatically',
        ru: 'Автоматически скругляет острые углы',
      },
      {
        en: 'Increases feed rate at corners',
        ru: 'Увеличивает подачу на углах',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G61 sets exact stop check mode, causing the machine to decelerate to a complete stop at the end of every block for precise cornering, at the cost of cycle time.',
      ru: 'G61 включает режим точной остановки: станок полностью останавливается в конце каждого кадра для точного прохождения углов, но это увеличивает время цикла.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does exact stop check mode (G61) do?',
        ru: 'Что делает режим точной остановки (G61) в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Brings the machine to a complete stop at the end of every block before continuing',
        ru: 'Полностью останавливает станок в конце каждого кадра перед продолжением',
      },
    ],
  },
  {
    id: 46,
    category: 'G',
    topic: 'motion',
    code: 'G64',
    prompt: {
      en: 'What does G64 do?',
      ru: 'Что делает G64?',
    },
    options: [
      {
        en: 'Cancels exact stop check and enables continuous cutting mode',
        ru: 'Отменяет точную остановку и включает режим непрерывной обработки',
      },
      { en: 'Enables exact stop check', ru: 'Включает точную остановку' },
      { en: 'Selects a canned cycle', ru: 'Выбирает постоянный цикл' },
      {
        en: 'Sets the local coordinate system',
        ru: 'Задаёт локальную систему координат',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G64 cancels G61 exact stop check and returns to continuous (cutting) mode, letting the control blend moves for smoother, faster motion.',
      ru: 'G64 отменяет режим точной остановки G61 и возвращает непрерывный режим обработки, позволяя ЧПУ сглаживать переходы для более плавного и быстрого движения.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G64 used for?',
        ru: 'Для чего используется команда G64 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns off exact stop check so cuts blend smoothly between blocks',
        ru: 'Отключает точную остановку, позволяя плавно переходить между кадрами',
      },
    ],
  },
  {
    id: 47,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G68',
    prompt: {
      en: 'What does G68 activate?',
      ru: 'Что включает G68?',
    },
    options: [
      { en: 'Coordinate system rotation', ru: 'Поворот системы координат' },
      {
        en: 'Scaling of programmed dimensions',
        ru: 'Масштабирование программируемых размеров',
      },
      { en: 'Mirror imaging', ru: 'Зеркальное отображение' },
      { en: 'Tool length compensation', ru: 'Коррекцию на длину инструмента' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G68 activates coordinate system rotation, letting a program run at a specified angle around a defined center point.',
      ru: 'G68 включает поворот системы координат, позволяя выполнить программу под заданным углом вокруг указанного центра.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does G68 turn on?',
        ru: 'Что включает команда G68 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Rotation of the active coordinate system',
        ru: 'Поворот активной системы координат',
      },
    ],
  },
  {
    id: 48,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G69',
    prompt: {
      en: 'What does G69 do?',
      ru: 'Что делает G69?',
    },
    options: [
      {
        en: 'Cancels coordinate system rotation',
        ru: 'Отменяет поворот системы координат',
      },
      {
        en: 'Starts coordinate system rotation',
        ru: 'Включает поворот системы координат',
      },
      { en: 'Cancels canned cycles', ru: 'Отменяет постоянные циклы' },
      { en: 'Selects a work offset', ru: 'Выбирает рабочее смещение' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G69 cancels the coordinate system rotation activated by G68, returning the program to the unrotated coordinate system.',
      ru: 'G69 отменяет поворот системы координат, включённый командой G68, возвращая программу к неповёрнутой системе координат.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G69 used for?',
        ru: 'Для чего используется команда G69 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns off the coordinate rotation started by G68',
        ru: 'Отключает поворот системы координат, включённый командой G68',
      },
    ],
  },
  {
    id: 49,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G73',
    prompt: {
      en: 'How does G73 (high-speed peck drilling) differ from G83?',
      ru: 'Чем G73 (высокоскоростное прерывистое сверление) отличается от G83?',
    },
    options: [
      {
        en: 'It only retracts a small clearance amount between pecks instead of fully out of the hole',
        ru: 'Отвод между проходами небольшой, а не полный вывод из отверстия',
      },
      {
        en: 'It synchronizes feed with spindle rotation like tapping',
        ru: 'Синхронизирует подачу с вращением шпинделя, как при нарезании резьбы',
      },
      {
        en: 'It cuts threads instead of drilling',
        ru: 'Нарезает резьбу вместо сверления',
      },
      {
        en: 'It requires no dwell or retract at all',
        ru: 'Не требует выдержки или отвода вообще',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G73 is a high-speed peck drilling cycle that retracts only a small amount to break chips between pecks, unlike G83 which fully retracts out of the hole.',
      ru: 'G73 — цикл высокоскоростного прерывистого сверления, при котором между проходами выполняется небольшой отвод для дробления стружки, в отличие от G83, где отвод полный.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what makes G73 different from G83?',
        ru: 'Чем команда G73 отличается от G83 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'It only backs off a short clearance amount between pecks rather than clearing the hole entirely',
        ru: 'Между проходами выполняется лишь небольшой отвод, а не полный выход из отверстия',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Peck-drill a hole at X=15, Y=10 with quick chip-breaking retracts. Retract plane R=2, hole depth Z=-30, peck depth Q=4, feed rate F=90.',
          ru: 'Просверлите отверстие с быстрыми отводами для дробления стружки в точке X=15, Y=10. Плоскость отвода R=2, глубина отверстия Z=-30, глубина шага Q=4, подача F=90.',
        },
        params: [
          { letter: 'X', value: '15' },
          { letter: 'Y', value: '10' },
          { letter: 'Z', value: '-30' },
          { letter: 'R', value: '2' },
          { letter: 'Q', value: '4' },
          { letter: 'F', value: '90' },
        ],
      },
      {
        prompt: {
          en: 'Peck-drill a deep hole at X=0, Y=0. Retract plane R=3, hole depth Z=-40, peck depth Q=3, feed rate F=110.',
          ru: 'Просверлите глубокое отверстие в точке X=0, Y=0. Плоскость отвода R=3, глубина отверстия Z=-40, глубина шага Q=3, подача F=110.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-40' },
          { letter: 'R', value: '3' },
          { letter: 'Q', value: '3' },
          { letter: 'F', value: '110' },
        ],
      },
      {
        prompt: {
          en: 'Peck-drill a hole at X=22, Y=-8. Retract plane R=2, hole depth Z=-18, peck depth Q=5, feed rate F=100.',
          ru: 'Просверлите отверстие в точке X=22, Y=-8. Плоскость отвода R=2, глубина отверстия Z=-18, глубина шага Q=5, подача F=100.',
        },
        params: [
          { letter: 'X', value: '22' },
          { letter: 'Y', value: '-8' },
          { letter: 'Z', value: '-18' },
          { letter: 'R', value: '2' },
          { letter: 'Q', value: '5' },
          { letter: 'F', value: '100' },
        ],
      },
    ],
  },
  {
    id: 50,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G74',
    prompt: {
      en: 'What is G74 used for?',
      ru: 'Для чего используется G74?',
    },
    options: [
      {
        en: 'Left-hand (reverse) tapping cycle',
        ru: 'Цикл нарезания левой резьбы',
      },
      { en: 'Right-hand tapping cycle', ru: 'Цикл нарезания правой резьбы' },
      { en: 'Boring cycle', ru: 'Цикл растачивания' },
      { en: 'Peck drilling cycle', ru: 'Цикл прерывистого сверления' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G74 is a canned cycle for left-hand tapping, spinning the spindle counterclockwise while feeding in and reversing to back out.',
      ru: 'G74 — постоянный цикл нарезания левой резьбы: шпиндель вращается против часовой стрелки при входе и меняет направление при выходе.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G74 used for?',
        ru: 'Для чего используется команда G74 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A cycle for cutting left-hand threads',
        ru: 'Цикл нарезания левой резьбы',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Tap a left-hand thread at X=25, Y=0. Retract plane R=5, thread depth Z=-18, feed rate F=120 (matched to the thread pitch).',
          ru: 'Нарежьте левую резьбу в точке X=25, Y=0. Плоскость отвода R=5, глубина резьбы Z=-18, подача F=120 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '25' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-18' },
          { letter: 'R', value: '5' },
          { letter: 'F', value: '120' },
        ],
      },
      {
        prompt: {
          en: 'Tap a left-hand thread at X=0, Y=10. Retract plane R=4, thread depth Z=-20, feed rate F=100 (matched to the thread pitch).',
          ru: 'Нарежьте левую резьбу в точке X=0, Y=10. Плоскость отвода R=4, глубина резьбы Z=-20, подача F=100 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '10' },
          { letter: 'Z', value: '-20' },
          { letter: 'R', value: '4' },
          { letter: 'F', value: '100' },
        ],
      },
      {
        prompt: {
          en: 'Tap a left-hand thread at X=-12, Y=6. Retract plane R=6, thread depth Z=-25, feed rate F=140 (matched to the thread pitch).',
          ru: 'Нарежьте левую резьбу в точке X=-12, Y=6. Плоскость отвода R=6, глубина резьбы Z=-25, подача F=140 (согласованная с шагом резьбы).',
        },
        params: [
          { letter: 'X', value: '-12' },
          { letter: 'Y', value: '6' },
          { letter: 'Z', value: '-25' },
          { letter: 'R', value: '6' },
          { letter: 'F', value: '140' },
        ],
      },
    ],
  },
  {
    id: 51,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G76',
    prompt: {
      en: 'What does the G76 fine boring cycle add compared to a basic boring cycle?',
      ru: 'Что добавляет цикл точного растачивания G76 по сравнению с базовым циклом растачивания?',
    },
    options: [
      {
        en: 'It orients the spindle and shifts the tool away from the wall before retracting to avoid marking the finished bore',
        ru: 'Ориентирует шпиндель и отводит инструмент от стенки перед отводом, чтобы не оставить след на обработанной поверхности',
      },
      {
        en: 'It taps threads instead of boring',
        ru: 'Нарезает резьбу вместо растачивания',
      },
      {
        en: 'It only works in rapid traverse',
        ru: 'Работает только на быстром ходу',
      },
      {
        en: 'It requires no spindle rotation',
        ru: 'Не требует вращения шпинделя',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G76 performs fine boring: at the bottom of the hole the spindle orients to a fixed angle and the tool shifts away from the bore wall before retracting, leaving a clean finish.',
      ru: 'G76 выполняет точное растачивание: на дне отверстия шпиндель ориентируется под фиксированным углом, инструмент отводится от стенки перед выходом, обеспечивая чистую поверхность.',
    },
    promptVariants: [
      {
        en: 'Compared to a plain boring cycle, what extra step does G76 include?',
        ru: 'Какой дополнительный шаг включает G76 по сравнению с обычным растачиванием?',
      },
    ],
    answerVariants: [
      {
        en: 'It orients the spindle and pulls the tool off the wall before retracting',
        ru: 'Ориентирует шпиндель и отводит инструмент от стенки перед выходом',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Fine-bore a hole at X=0, Y=0. Retract plane R=3, bore depth Z=-20, tool shift Q=0.5, feed rate F=50.',
          ru: 'Выполните точное растачивание в точке X=0, Y=0. Плоскость отвода R=3, глубина растачивания Z=-20, смещение инструмента Q=0.5, подача F=50.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-20' },
          { letter: 'R', value: '3' },
          { letter: 'Q', value: '0.5' },
          { letter: 'F', value: '50' },
        ],
      },
      {
        prompt: {
          en: 'Fine-bore a hole at X=30, Y=15. Retract plane R=4, bore depth Z=-25, tool shift Q=0.3, feed rate F=40.',
          ru: 'Выполните точное растачивание в точке X=30, Y=15. Плоскость отвода R=4, глубина растачивания Z=-25, смещение инструмента Q=0.3, подача F=40.',
        },
        params: [
          { letter: 'X', value: '30' },
          { letter: 'Y', value: '15' },
          { letter: 'Z', value: '-25' },
          { letter: 'R', value: '4' },
          { letter: 'Q', value: '0.3' },
          { letter: 'F', value: '40' },
        ],
      },
      {
        prompt: {
          en: 'Fine-bore a hole at X=-10, Y=5. Retract plane R=2, bore depth Z=-12, tool shift Q=1, feed rate F=60.',
          ru: 'Выполните точное растачивание в точке X=-10, Y=5. Плоскость отвода R=2, глубина растачивания Z=-12, смещение инструмента Q=1, подача F=60.',
        },
        params: [
          { letter: 'X', value: '-10' },
          { letter: 'Y', value: '5' },
          { letter: 'Z', value: '-12' },
          { letter: 'R', value: '2' },
          { letter: 'Q', value: '1' },
          { letter: 'F', value: '60' },
        ],
      },
    ],
  },
  {
    id: 52,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G85',
    prompt: {
      en: 'What does G85 do?',
      ru: 'Что делает G85?',
    },
    options: [
      {
        en: 'Boring cycle that feeds in and feeds back out',
        ru: 'Цикл растачивания с подачей на входе и на выходе',
      },
      {
        en: 'Boring cycle that feeds in and rapids out',
        ru: 'Цикл растачивания с подачей на входе и быстрым отводом',
      },
      { en: 'Peck drilling cycle', ru: 'Цикл прерывистого сверления' },
      { en: 'Tapping cycle', ru: 'Цикл нарезания резьбы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G85 is a boring cycle that feeds into the hole and feeds back out at the same rate, giving a smoother bore finish than a rapid retract.',
      ru: 'G85 — цикл растачивания, при котором подача выполняется как при входе, так и при выходе из отверстия, что даёт более чистую поверхность, чем быстрый отвод.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G85 used for?',
        ru: 'Для чего используется команда G85 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A boring cycle that feeds in and out at the same rate',
        ru: 'Цикл растачивания с одинаковой подачей на входе и выходе',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Bore a hole at X=12, Y=8. Retract plane R=2, bore depth Z=-16, feed rate F=70.',
          ru: 'Расточите отверстие в точке X=12, Y=8. Плоскость отвода R=2, глубина растачивания Z=-16, подача F=70.',
        },
        params: [
          { letter: 'X', value: '12' },
          { letter: 'Y', value: '8' },
          { letter: 'Z', value: '-16' },
          { letter: 'R', value: '2' },
          { letter: 'F', value: '70' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=0, Y=0. Retract plane R=3, bore depth Z=-10, feed rate F=90.',
          ru: 'Расточите отверстие в точке X=0, Y=0. Плоскость отвода R=3, глубина растачивания Z=-10, подача F=90.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-10' },
          { letter: 'R', value: '3' },
          { letter: 'F', value: '90' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=-6, Y=20. Retract plane R=4, bore depth Z=-22, feed rate F=55.',
          ru: 'Расточите отверстие в точке X=-6, Y=20. Плоскость отвода R=4, глубина растачивания Z=-22, подача F=55.',
        },
        params: [
          { letter: 'X', value: '-6' },
          { letter: 'Y', value: '20' },
          { letter: 'Z', value: '-22' },
          { letter: 'R', value: '4' },
          { letter: 'F', value: '55' },
        ],
      },
    ],
  },
  {
    id: 53,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G86',
    prompt: {
      en: 'What does G86 do?',
      ru: 'Что делает G86?',
    },
    options: [
      {
        en: 'Boring cycle that stops the spindle at the bottom and rapids out',
        ru: 'Цикл растачивания с остановкой шпинделя на дне и быстрым отводом',
      },
      {
        en: 'Boring cycle that feeds out at the same rate as feeding in',
        ru: 'Цикл растачивания с подачей на выходе, равной подаче на входе',
      },
      { en: 'Left-hand tapping cycle', ru: 'Цикл нарезания левой резьбы' },
      {
        en: 'Rigid tapping with synchronized feed',
        ru: 'Жёсткое нарезание резьбы с синхронизированной подачей',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G86 is a boring cycle: the tool feeds to the bottom of the hole, the spindle stops, and the tool rapids out, which can leave a witness mark but is faster than G85.',
      ru: 'G86 — цикл растачивания: инструмент подаётся до дна отверстия, шпиндель останавливается, и инструмент быстро отводится; это быстрее G85, но может оставить след на поверхности.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G86 used for?',
        ru: 'Для чего используется команда G86 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A boring cycle that halts the spindle at the bottom then rapids out',
        ru: 'Цикл растачивания, останавливающий шпиндель на дне и затем быстро отводящий инструмент',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Bore a hole at X=18, Y=6, stopping the spindle at the bottom before a rapid retract. Retract plane R=2, bore depth Z=-14, feed rate F=65.',
          ru: 'Расточите отверстие в точке X=18, Y=6 с остановкой шпинделя на дне перед быстрым отводом. Плоскость отвода R=2, глубина растачивания Z=-14, подача F=65.',
        },
        params: [
          { letter: 'X', value: '18' },
          { letter: 'Y', value: '6' },
          { letter: 'Z', value: '-14' },
          { letter: 'R', value: '2' },
          { letter: 'F', value: '65' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=0, Y=0, stopping the spindle at the bottom before a rapid retract. Retract plane R=3, bore depth Z=-9, feed rate F=80.',
          ru: 'Расточите отверстие в точке X=0, Y=0 с остановкой шпинделя на дне перед быстрым отводом. Плоскость отвода R=3, глубина растачивания Z=-9, подача F=80.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-9' },
          { letter: 'R', value: '3' },
          { letter: 'F', value: '80' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=25, Y=-10, stopping the spindle at the bottom before a rapid retract. Retract plane R=2, bore depth Z=-20, feed rate F=50.',
          ru: 'Расточите отверстие в точке X=25, Y=-10 с остановкой шпинделя на дне перед быстрым отводом. Плоскость отвода R=2, глубина растачивания Z=-20, подача F=50.',
        },
        params: [
          { letter: 'X', value: '25' },
          { letter: 'Y', value: '-10' },
          { letter: 'Z', value: '-20' },
          { letter: 'R', value: '2' },
          { letter: 'F', value: '50' },
        ],
      },
    ],
  },
  {
    id: 54,
    category: 'G',
    topic: 'measurement',
    code: 'G31',
    prompt: {
      en: 'What is G31 used for?',
      ru: 'Для чего используется G31?',
    },
    options: [
      {
        en: 'Skip function: motion stops early if a probe/skip signal is received',
        ru: 'Функция пропуска: движение прерывается досрочно при получении сигнала от щупа',
      },
      { en: 'Coordinate rotation', ru: 'Поворот системы координат' },
      { en: 'Rigid tapping', ru: 'Жёсткое нарезание резьбы' },
      {
        en: 'Setting a local coordinate system',
        ru: 'Задание локальной системы координат',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G31 is the skip function, used with a touch probe: the linear move is interrupted early when the skip signal is triggered, and the position is captured.',
      ru: 'G31 — функция пропуска, используемая с измерительным щупом: линейное перемещение прерывается досрочно при срабатывании сигнала пропуска, а позиция фиксируется.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G31 used for?',
        ru: 'Для чего используется команда G31 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A skip move that ends early once a probe signal arrives',
        ru: 'Перемещение с функцией пропуска, которое прерывается досрочно при сигнале от щупа',
      },
    ],
  },
  {
    id: 55,
    category: 'G',
    topic: 'motion',
    code: 'G33',
    prompt: {
      en: 'What does G33 do on a CNC lathe?',
      ru: 'Что делает G33 на токарном станке с ЧПУ?',
    },
    options: [
      {
        en: 'Cuts a thread by synchronizing feed with spindle rotation',
        ru: 'Нарезает резьбу, синхронизируя подачу с вращением шпинделя',
      },
      {
        en: 'Performs rapid positioning',
        ru: 'Выполняет быстрое позиционирование',
      },
      {
        en: 'Selects constant surface speed',
        ru: 'Включает постоянную скорость резания',
      },
      {
        en: 'Activates a canned drilling cycle',
        ru: 'Включает постоянный цикл сверления',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G33 performs thread cutting by synchronizing axis feed with spindle rotation so each pass follows the same thread lead.',
      ru: 'G33 выполняет нарезание резьбы, синхронизируя подачу по оси с вращением шпинделя, чтобы каждый проход шёл по одному и тому же шагу резьбы.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what does G33 do on a lathe?',
        ru: 'Что делает команда G33 на токарном станке в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Cuts threads by locking feed to spindle rotation',
        ru: 'Нарезает резьбу, синхронизируя подачу с вращением шпинделя',
      },
    ],
  },
  {
    id: 56,
    category: 'G',
    topic: 'work-offset',
    code: 'G10',
    prompt: {
      en: 'What is G10 used for?',
      ru: 'Для чего используется G10?',
    },
    options: [
      {
        en: 'Programmable data input, e.g. setting work offsets or tool offsets from within the program',
        ru: 'Программируемый ввод данных, например задание рабочих смещений или коррекций инструмента прямо из программы',
      },
      { en: 'Circular interpolation', ru: 'Круговая интерполяция' },
      { en: 'Dwell', ru: 'Пауза (выдержка времени)' },
      {
        en: 'Cancelling tool compensation',
        ru: 'Отмену коррекции инструмента',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G10 allows programmable data input, letting a program set values such as work offsets or tool offsets directly instead of requiring manual entry.',
      ru: 'G10 позволяет программируемый ввод данных, позволяя программе задавать значения, такие как рабочие смещения или коррекции инструмента, без ручного ввода.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is G10 used for?',
        ru: 'Для чего используется команда G10 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Lets the program set offsets (work or tool) programmatically',
        ru: 'Позволяет программе задавать смещения (рабочие или инструментальные) программно',
      },
    ],
  },
  {
    id: 57,
    category: 'M',
    topic: 'coolant',
    code: 'M07',
    prompt: {
      en: 'What does M07 typically turn on?',
      ru: 'Что обычно включает M07?',
    },
    options: [
      { en: 'Mist coolant', ru: 'Туманное охлаждение (масляный туман)' },
      { en: 'Flood coolant', ru: 'Обильное охлаждение (СОЖ)' },
      { en: 'Air blast', ru: 'Обдув воздухом' },
      { en: 'Chip conveyor', ru: 'Конвейер стружки' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M07 typically turns on mist coolant, a fine spray used when flood coolant is unnecessary or undesirable.',
      ru: 'M07 обычно включает туманное охлаждение — мелкодисперсный распыл, используемый, когда обильное охлаждение не нужно или нежелательно.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, which coolant type does M07 switch on?',
        ru: 'Какой тип охлаждения включает команда M07 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'A fine mist coolant spray',
        ru: 'Мелкодисперсное туманное охлаждение',
      },
    ],
  },
  {
    id: 58,
    category: 'M',
    topic: 'spindle',
    code: 'M19',
    prompt: {
      en: 'What does M19 do?',
      ru: 'Что делает M19?',
    },
    options: [
      {
        en: 'Orients the spindle to a fixed angular position',
        ru: 'Ориентирует шпиндель в фиксированное угловое положение',
      },
      {
        en: 'Starts the spindle clockwise',
        ru: 'Запускает шпиндель по часовой стрелке',
      },
      {
        en: 'Stops the spindle at any position',
        ru: 'Останавливает шпиндель в произвольном положении',
      },
      { en: 'Changes the tool', ru: 'Меняет инструмент' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M19 performs spindle orientation, stopping the spindle at a specific angular position, often needed before a tool change or a boring bar retract.',
      ru: 'M19 выполняет ориентацию шпинделя, останавливая его в определённом угловом положении, что часто требуется перед сменой инструмента или отводом расточной оправки.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M19 used for?',
        ru: 'Для чего используется команда M19 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Stops and orients the spindle at a specific angle',
        ru: 'Останавливает и ориентирует шпиндель в заданном угловом положении',
      },
    ],
  },
  {
    id: 59,
    category: 'M',
    topic: 'feed-mode',
    code: 'M48',
    prompt: {
      en: 'What does M48 do?',
      ru: 'Что делает M48?',
    },
    options: [
      {
        en: 'Enables feed rate and spindle speed overrides',
        ru: 'Разрешает работу корректоров подачи и скорости шпинделя',
      },
      { en: 'Disables feed rate overrides', ru: 'Отключает корректоры подачи' },
      { en: 'Turns on coolant', ru: 'Включает СОЖ' },
      { en: 'Cancels a canned cycle', ru: 'Отменяет постоянный цикл' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M48 re-enables feed rate and speed override controls after they were disabled, letting the operator adjust them from the control panel again.',
      ru: 'M48 повторно разрешает работу корректоров подачи и скорости после их отключения, позволяя оператору снова регулировать их с пульта управления.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M48 used for?',
        ru: 'Для чего используется команда M48 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns back on the feed and speed override controls',
        ru: 'Снова включает корректоры подачи и скорости шпинделя',
      },
    ],
  },
  {
    id: 60,
    category: 'M',
    topic: 'feed-mode',
    code: 'M49',
    prompt: {
      en: 'What does M49 do?',
      ru: 'Что делает M49?',
    },
    options: [
      {
        en: 'Disables feed rate and spindle speed overrides, locking them at programmed values',
        ru: 'Отключает корректоры подачи и скорости шпинделя, фиксируя их на запрограммированных значениях',
      },
      { en: 'Enables feed rate overrides', ru: 'Включает корректоры подачи' },
      { en: 'Starts the spindle', ru: 'Запускает шпиндель' },
      { en: 'Ends the program', ru: 'Завершает программу' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M49 disables feed rate and spindle speed override controls, forcing the machine to run at the programmed values regardless of the operator panel settings.',
      ru: 'M49 отключает корректоры подачи и скорости шпинделя, заставляя станок работать на запрограммированных значениях независимо от настроек на пульте.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is M49 used for?',
        ru: 'Для чего используется команда M49 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Locks feed rate and spindle speed at their programmed values',
        ru: 'Фиксирует подачу и скорость шпинделя на запрограммированных значениях',
      },
    ],
  },
  {
    id: 61,
    category: 'G',
    topic: 'motion',
    code: 'G09',
    prompt: {
      en: 'What does G09 do?',
      ru: 'Что делает G09?',
    },
    options: [
      {
        en: 'Exact stop check for a single block only (non-modal)',
        ru: 'Точная остановка только для одного кадра (немодально)',
      },
      {
        en: 'Activates exact stop check as a modal, persistent state',
        ru: 'Включает точную остановку как модальное, постоянное состояние',
      },
      {
        en: 'Cancels tool length compensation',
        ru: 'Отменяет коррекцию на длину инструмента',
      },
      {
        en: 'Selects continuous path mode for all following blocks',
        ru: 'Включает непрерывный режим обработки для всех последующих кадров',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G09 forces an exact stop check for only the block it appears in, without changing the modal path-control mode set by G61 or G64.',
      ru: 'G09 задаёт точную остановку только для того кадра, в котором указана, не изменяя модальный режим управления траекторией, заданный G61 или G64.',
    },
    promptVariants: [
      {
        en: 'What is the effect of programming G09 in a block?',
        ru: 'Каков эффект программирования G09 в кадре?',
      },
    ],
    answerVariants: [
      {
        en: 'Forces an exact stop check for just that one block, without changing the modal path-control mode',
        ru: 'Задаёт точную остановку только для этого одного кадра, не изменяя модальный режим управления траекторией',
      },
    ],
  },
  {
    id: 62,
    category: 'G',
    topic: 'homing',
    code: 'G27',
    prompt: {
      en: 'What does G27 do?',
      ru: 'Что делает G27?',
    },
    options: [
      {
        en: 'Moves to the reference point and alarms if the machine does not arrive there exactly',
        ru: 'Перемещается в исходную точку и выдаёт сигнал тревоги, если станок не приходит туда точно',
      },
      {
        en: 'Returns to the reference point without any position check',
        ru: 'Возвращается в исходную точку без проверки позиции',
      },
      {
        en: 'Moves to a secondary (2nd/3rd/4th) reference point',
        ru: 'Перемещается во вторую (2-ю/3-ю/4-ю) исходную точку',
      },
      {
        en: 'Cancels reference point return',
        ru: 'Отменяет возврат в исходную точку',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G27 sends the machine to the reference (home) position and checks that it actually arrives there exactly, raising an alarm if it does not, unlike G28 which performs no such check.',
      ru: 'G27 направляет станок в исходную точку и проверяет, что он действительно приходит туда точно, выдавая сигнал тревоги в противном случае — в отличие от G28, которая такой проверки не выполняет.',
    },
    promptVariants: [
      {
        en: 'In CNC programming, what is the purpose of G27?',
        ru: 'Какова цель команды G27 в программировании ЧПУ?',
      },
    ],
    answerVariants: [
      {
        en: 'Sends the machine to the reference point and raises an alarm if it does not land there exactly',
        ru: 'Направляет станок в исходную точку и выдаёт сигнал тревоги, если он не приходит туда точно',
      },
    ],
  },
  {
    id: 63,
    category: 'G',
    topic: 'homing',
    code: 'G29',
    prompt: {
      en: 'What does G29 do?',
      ru: 'Что делает G29?',
    },
    options: [
      {
        en: 'Moves from the reference position to a specified point via the intermediate point used by the preceding G28',
        ru: 'Перемещается из исходной точки в заданную точку через промежуточную точку, использованную предыдущей командой G28',
      },
      {
        en: 'Moves to the reference (home) position',
        ru: 'Перемещается в исходную (нулевую) точку',
      },
      {
        en: 'Checks that the machine reached the reference point',
        ru: 'Проверяет, что станок достиг исходной точки',
      },
      {
        en: 'Moves to a secondary reference point',
        ru: 'Перемещается во вторую исходную точку',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G29 moves the machine from the reference position to a specified point, passing through the same intermediate point used by the G28 that preceded it. It is typically used right after a G28 to return toward the work.',
      ru: 'G29 перемещает станок из исходной точки в заданную точку через ту же промежуточную точку, что использовалась предшествующей командой G28. Обычно применяется сразу после G28 для возврата к детали.',
    },
    promptVariants: [
      {
        en: 'What motion does G29 perform?',
        ru: 'Какое перемещение выполняет G29?',
      },
    ],
    answerVariants: [
      {
        en: 'Moves from the reference position to a target point through the same intermediate point used by the preceding G28',
        ru: 'Перемещается из исходной точки в заданную через ту же промежуточную точку, что использовалась предыдущей командой G28',
      },
    ],
  },
  {
    id: 64,
    category: 'G',
    topic: 'homing',
    code: 'G30',
    prompt: {
      en: 'What does G30 do?',
      ru: 'Что делает G30?',
    },
    options: [
      {
        en: 'Returns the machine to a secondary reference point (2nd, 3rd or 4th), selected via a P address',
        ru: 'Возвращает станок во вторую исходную точку (2-ю, 3-ю или 4-ю), выбираемую адресом P',
      },
      {
        en: 'Returns to the primary machine reference point',
        ru: 'Возвращает станок в основную исходную точку',
      },
      {
        en: 'Sets a new work coordinate system',
        ru: 'Задаёт новую систему координат детали',
      },
      {
        en: 'Cancels canned cycles',
        ru: 'Отменяет постоянные циклы',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G30 returns the machine to one of the secondary reference points (2nd, 3rd, or 4th), chosen with a P address, as opposed to G28 which returns to the primary reference point.',
      ru: 'G30 возвращает станок в одну из вторых исходных точек (2-ю, 3-ю или 4-ю), выбираемую адресом P, в отличие от G28, которая возвращает в основную исходную точку.',
    },
    promptVariants: [
      {
        en: 'What is G30 used for?',
        ru: 'Для чего используется G30?',
      },
    ],
    answerVariants: [
      {
        en: 'Sends the machine to a secondary reference point (2nd, 3rd, or 4th) selected with a P address',
        ru: 'Направляет станок во вторую исходную точку (2-ю, 3-ю или 4-ю), выбираемую адресом P',
      },
    ],
  },
  {
    id: 65,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G50',
    prompt: {
      en: 'What does G50 do?',
      ru: 'Что делает G50?',
    },
    options: [
      {
        en: 'Cancels scaling, returning to programmed (1:1) dimensions',
        ru: 'Отменяет масштабирование, возвращая программные (1:1) размеры',
      },
      {
        en: 'Activates scaling of programmed dimensions by a specified factor',
        ru: 'Включает масштабирование программных размеров на заданный коэффициент',
      },
      {
        en: 'Activates coordinate system rotation',
        ru: 'Включает поворот системы координат',
      },
      {
        en: 'Sets a local coordinate system',
        ru: 'Задаёт локальную систему координат',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G50 cancels scaling activated by G51, returning subsequent moves to programmed, unscaled (1:1) dimensions.',
      ru: 'G50 отменяет масштабирование, включённое командой G51, возвращая последующие перемещения к программным, немасштабированным (1:1) размерам.',
    },
    promptVariants: [
      {
        en: 'What is the function of G50?',
        ru: 'Какова функция G50?',
      },
    ],
    answerVariants: [
      {
        en: 'Cancels active scaling, restoring programmed, unscaled (1:1) dimensions',
        ru: 'Отменяет активное масштабирование, возвращая программные немасштабированные (1:1) размеры',
      },
    ],
  },
  {
    id: 66,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G51',
    prompt: {
      en: 'What does G51 do?',
      ru: 'Что делает G51?',
    },
    options: [
      {
        en: 'Scales programmed dimensions from a defined center point by a specified factor',
        ru: 'Масштабирует программные размеры относительно заданного центра на указанный коэффициент',
      },
      {
        en: 'Cancels scaling',
        ru: 'Отменяет масштабирование',
      },
      {
        en: 'Activates coordinate system rotation',
        ru: 'Включает поворот системы координат',
      },
      {
        en: 'Sets a local coordinate system',
        ru: 'Задаёт локальную систему координат',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G51 activates scaling, multiplying programmed dimensions measured from a defined center point by a specified factor, letting a part be enlarged or shrunk without rewriting coordinates. G50 cancels it.',
      ru: 'G51 включает масштабирование, умножая программные размеры, отсчитываемые от заданного центра, на указанный коэффициент, позволяя увеличить или уменьшить деталь без переписывания координат. G50 отменяет масштабирование.',
    },
    promptVariants: [
      {
        en: 'What is the function of G51?',
        ru: 'Какова функция G51?',
      },
    ],
    answerVariants: [
      {
        en: 'Multiplies programmed dimensions, measured from a defined center, by a given scale factor',
        ru: 'Умножает программные размеры, отсчитываемые от заданного центра, на указанный коэффициент',
      },
    ],
  },
  {
    id: 67,
    category: 'G',
    topic: 'motion',
    code: 'G62',
    prompt: {
      en: 'What does G62 (automatic corner override) do?',
      ru: 'Что делает G62 (автоматическая коррекция подачи на углах)?',
    },
    options: [
      {
        en: 'Automatically reduces feed rate at inside corners while cutter compensation is active, to avoid tool overload',
        ru: 'Автоматически снижает подачу на внутренних углах при активной коррекции на радиус фрезы, чтобы избежать перегрузки инструмента',
      },
      {
        en: 'Increases feed rate at corners',
        ru: 'Увеличивает подачу на углах',
      },
      {
        en: 'Rounds corners for smoother motion',
        ru: 'Скругляет углы для более плавного движения',
      },
      {
        en: 'Cancels cutter compensation',
        ru: 'Отменяет коррекцию на радиус фрезы',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G62 automatically reduces feed rate at inside corners while cutter radius compensation is active, preventing excess chip load and tool overload at those corners.',
      ru: 'G62 автоматически снижает подачу на внутренних углах при активной коррекции на радиус фрезы, предотвращая избыточную нагрузку на инструмент в этих углах.',
    },
    promptVariants: [
      {
        en: 'What is the purpose of automatic corner override G62?',
        ru: 'Какова цель автоматической коррекции подачи на углах G62?',
      },
    ],
    answerVariants: [
      {
        en: 'Automatically slows the feed rate at inside corners while cutter compensation is on, to protect the tool',
        ru: 'Автоматически снижает подачу на внутренних углах при включённой коррекции на радиус фрезы, защищая инструмент',
      },
    ],
  },
  {
    id: 68,
    category: 'G',
    topic: 'motion',
    code: 'G63',
    prompt: {
      en: 'What does G63 (tapping mode) do?',
      ru: 'Что делает G63 (режим нарезания резьбы)?',
    },
    options: [
      {
        en: 'Switches to tapping mode, disabling feed and speed overrides and feed hold during the tap cycle',
        ru: 'Включает режим нарезания резьбы, отключая корректоры подачи и скорости, а также стоп подачи на время цикла нарезания',
      },
      {
        en: 'Cancels a tapping cycle',
        ru: 'Отменяет цикл нарезания резьбы',
      },
      {
        en: 'Activates rigid tapping synchronization',
        ru: 'Включает синхронизацию жёсткого нарезания резьбы',
      },
      {
        en: 'Selects a boring canned cycle',
        ru: 'Выбирает постоянный цикл растачивания',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G63 switches the control into tapping mode, disabling feed rate and spindle speed overrides and feed hold so the tap cycle runs without interruption, typically used with a floating tap holder rather than rigid tapping.',
      ru: 'G63 переключает ЧПУ в режим нарезания резьбы, отключая корректоры подачи и скорости шпинделя, а также стоп подачи, чтобы цикл нарезания выполнялся без прерываний — обычно используется с плавающим патроном, а не при жёстком нарезании.',
    },
    promptVariants: [
      {
        en: 'What happens when tapping mode G63 is active?',
        ru: 'Что происходит, когда активен режим нарезания резьбы G63?',
      },
    ],
    answerVariants: [
      {
        en: 'Puts the control into tapping mode, disabling feed/speed overrides and feed hold for the duration of the tap',
        ru: 'Переключает ЧПУ в режим нарезания, отключая корректоры подачи/скорости и стоп подачи на время цикла',
      },
    ],
  },
  {
    id: 69,
    category: 'G',
    topic: 'subprogram',
    code: 'G65',
    prompt: {
      en: 'What does G65 do?',
      ru: 'Что делает G65?',
    },
    options: [
      {
        en: 'Calls a custom macro once, passing arguments to it like a parameterized subprogram',
        ru: 'Однократно вызывает пользовательский макрос, передавая ему аргументы, как параметризованной подпрограмме',
      },
      {
        en: 'Calls a macro automatically before every subsequent motion block, until cancelled',
        ru: 'Автоматически вызывает макрос перед каждым последующим кадром перемещения, пока не будет отменено',
      },
      {
        en: 'Calls a standard subprogram without argument passing',
        ru: 'Вызывает обычную подпрограмму без передачи аргументов',
      },
      {
        en: 'Cancels a modal macro call',
        ru: 'Отменяет модальный вызов макроса',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G65 makes a single (non-modal) call to a custom macro, passing arguments through local variables, unlike M98 which calls a plain subprogram with no argument passing.',
      ru: 'G65 выполняет однократный (немодальный) вызов пользовательского макроса, передавая аргументы через локальные переменные — в отличие от M98, которая вызывает обычную подпрограмму без передачи аргументов.',
    },
    promptVariants: [
      {
        en: 'What is the function of G65?',
        ru: 'Какова функция G65?',
      },
    ],
    answerVariants: [
      {
        en: 'Performs a one-time call to a custom macro, passing it arguments like a parameterized subprogram',
        ru: 'Выполняет однократный вызов пользовательского макроса, передавая ему аргументы, как параметризованной подпрограмме',
      },
    ],
  },
  {
    id: 70,
    category: 'G',
    topic: 'subprogram',
    code: 'G66',
    prompt: {
      en: 'What does G66 do?',
      ru: 'Что делает G66?',
    },
    options: [
      {
        en: 'Calls a macro automatically before every subsequent motion block, until cancelled',
        ru: 'Автоматически вызывает макрос перед каждым последующим кадром перемещения, пока не будет отменено',
      },
      {
        en: 'Calls a macro exactly once',
        ru: 'Вызывает макрос ровно один раз',
      },
      {
        en: 'Cancels a modal macro call',
        ru: 'Отменяет модальный вызов макроса',
      },
      {
        en: 'Calls a standard subprogram',
        ru: 'Вызывает обычную подпрограмму',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G66 sets up a modal macro call: the specified macro runs automatically before every subsequent motion block until cancelled by G67, unlike the single-shot call made by G65.',
      ru: 'G66 задаёт модальный вызов макроса: указанный макрос автоматически выполняется перед каждым последующим кадром перемещения до отмены командой G67 — в отличие от однократного вызова G65.',
    },
    promptVariants: [
      {
        en: 'What is the function of G66?',
        ru: 'Какова функция G66?',
      },
    ],
    answerVariants: [
      {
        en: 'Sets up a modal macro call that runs automatically before every following motion block until cancelled',
        ru: 'Задаёт модальный вызов макроса, который автоматически выполняется перед каждым следующим кадром перемещения до отмены',
      },
    ],
  },
  {
    id: 71,
    category: 'G',
    topic: 'subprogram',
    code: 'G67',
    prompt: {
      en: 'What does G67 do?',
      ru: 'Что делает G67?',
    },
    options: [
      {
        en: 'Cancels the modal macro call',
        ru: 'Отменяет модальный вызов макроса',
      },
      {
        en: 'Starts a modal macro call',
        ru: 'Запускает модальный вызов макроса',
      },
      {
        en: 'Calls a macro once',
        ru: 'Однократно вызывает макрос',
      },
      {
        en: 'Cancels a canned cycle',
        ru: 'Отменяет постоянный цикл',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G67 cancels the modal macro call activated by G66, so subsequent motion blocks execute normally without automatically invoking the macro.',
      ru: 'G67 отменяет модальный вызов макроса, активированный командой G66, поэтому последующие кадры перемещения выполняются в обычном режиме без автоматического вызова макроса.',
    },
    promptVariants: [
      {
        en: 'What is the function of G67?',
        ru: 'Какова функция G67?',
      },
    ],
    answerVariants: [
      {
        en: 'Turns off the modal macro call that was started by G66',
        ru: 'Отключает модальный вызов макроса, запущенный командой G66',
      },
    ],
  },
  {
    id: 72,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G92',
    prompt: {
      en: 'What does G92 do on a milling machine control?',
      ru: 'Что делает G92 в системе ЧПУ фрезерного станка?',
    },
    options: [
      {
        en: 'Presets the active coordinate system so the current tool position is assigned the specified coordinate values',
        ru: 'Задаёт активную систему координат так, чтобы текущей позиции инструмента были присвоены указанные координаты',
      },
      {
        en: 'Selects a stored work offset, like G54',
        ru: 'Выбирает сохранённое рабочее смещение, как G54',
      },
      {
        en: 'Returns to the machine reference position',
        ru: 'Возвращается в исходную точку станка',
      },
      {
        en: 'Cancels the local coordinate system',
        ru: 'Отменяет локальную систему координат',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'On milling controls, G92 presets the coordinate system by assigning the specified coordinate values to the tool\u2019s current position, effectively shifting the whole coordinate system without moving the machine.',
      ru: 'В системах ЧПУ фрезерных станков G92 задаёт систему координат, присваивая текущей позиции инструмента указанные значения координат, фактически смещая всю систему координат без перемещения станка.',
    },
    promptVariants: [
      {
        en: 'On a milling machine control, what is the function of G92?',
        ru: 'Какая функция у G92 в ЧПУ фрезерного станка?',
      },
    ],
    answerVariants: [
      {
        en: 'Assigns the specified coordinate values to the tool\u2019s current position, presetting the whole coordinate system',
        ru: 'Присваивает текущей позиции инструмента указанные координаты, задавая всю систему координат',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Preset the coordinate system so the tool\u2019s current position becomes X=0, Y=0, Z=0.',
          ru: 'Задайте систему координат так, чтобы текущая позиция инструмента стала X=0, Y=0, Z=0.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '0' },
        ],
      },
      {
        prompt: {
          en: 'Preset the coordinate system so the tool\u2019s current position becomes X=10, Y=0, Z=0.',
          ru: 'Задайте систему координат так, чтобы текущая позиция инструмента стала X=10, Y=0, Z=0.',
        },
        params: [
          { letter: 'X', value: '10' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '0' },
        ],
      },
      {
        prompt: {
          en: 'Preset the coordinate system so the tool\u2019s current position becomes Z=50.',
          ru: 'Задайте систему координат так, чтобы текущая позиция инструмента стала Z=50.',
        },
        params: [{ letter: 'Z', value: '50' }],
      },
    ],
  },
  {
    id: 73,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G98',
    prompt: {
      en: 'What does G98 do in a canned cycle?',
      ru: 'Что делает G98 в постоянном цикле?',
    },
    options: [
      {
        en: 'Retracts to the initial Z level (the height before the cycle started) after each repetition',
        ru: 'Возвращает на исходный уровень Z (высоту до начала цикла) после каждого повторения',
      },
      {
        en: 'Retracts only to the R point after each repetition',
        ru: 'Возвращает только на уровень точки R после каждого повторения',
      },
      {
        en: 'Cancels the active canned cycle',
        ru: 'Отменяет активный постоянный цикл',
      },
      {
        en: 'Retracts to the machine reference point',
        ru: 'Возвращает в исходную точку станка',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G98 sets canned cycles to retract to the initial Z level (the height the tool was at before the cycle began) after each repetition, which is safer around obstacles but slower than G99.',
      ru: 'G98 задаёт возврат постоянных циклов на исходный уровень Z (высоту, на которой находился инструмент до начала цикла) после каждого повторения — это безопаснее при наличии препятствий, но медленнее, чем G99.',
    },
    promptVariants: [
      {
        en: 'In a canned cycle, what does G98 control?',
        ru: 'Что управляет G98 в постоянном цикле?',
      },
    ],
    answerVariants: [
      {
        en: 'Returns to the initial pre-cycle Z height after each repetition',
        ru: 'Возвращает на исходную высоту Z до начала цикла после каждого повторения',
      },
    ],
  },
  {
    id: 74,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G99',
    prompt: {
      en: 'What does G99 do in a canned cycle?',
      ru: 'Что делает G99 в постоянном цикле?',
    },
    options: [
      {
        en: 'Retracts only to the R point (clearance plane) after each repetition, saving cycle time',
        ru: 'Возвращает только на уровень точки R (плоскость безопасности) после каждого повторения, сокращая время цикла',
      },
      {
        en: 'Retracts to the initial pre-cycle height after each repetition',
        ru: 'Возвращает на исходную высоту до начала цикла после каждого повторения',
      },
      {
        en: 'Cancels the canned cycle',
        ru: 'Отменяет постоянный цикл',
      },
      {
        en: 'Selects incremental positioning',
        ru: 'Выбирает относительное позиционирование',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G99 sets canned cycles to retract only to the R point (clearance plane) after each repetition rather than the initial Z level, saving cycle time when that clearance is safe.',
      ru: 'G99 задаёт возврат постоянных циклов только на уровень точки R (плоскость безопасности) после каждого повторения вместо исходного уровня Z, сокращая время цикла, если такого зазора достаточно.',
    },
    promptVariants: [
      {
        en: 'In a canned cycle, what does G99 control?',
        ru: 'Что управляет G99 в постоянном цикле?',
      },
    ],
    answerVariants: [
      {
        en: 'Returns only to the R point (clearance plane) after each repetition, saving cycle time',
        ru: 'Возвращает только на уровень точки R после каждого повторения, сокращая время цикла',
      },
    ],
  },
  {
    id: 75,
    category: 'M',
    topic: 'clamping',
    code: 'M10',
    prompt: {
      en: 'What does M10 do?',
      ru: 'Что делает M10?',
    },
    options: [
      {
        en: 'Engages a clamp, locking an axis, pallet, or fixture in place',
        ru: 'Включает зажим, фиксируя ось, паллету или приспособление на месте',
      },
      {
        en: 'Releases a previously engaged clamp',
        ru: 'Освобождает ранее включённый зажим',
      },
      {
        en: 'Starts the spindle',
        ru: 'Запускает шпиндель',
      },
      {
        en: 'Turns on coolant',
        ru: 'Включает СОЖ',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M10 engages a clamp, locking a rotary axis, pallet, or fixture in place so it stays fixed during machining. M11 releases it.',
      ru: 'M10 включает зажим, фиксируя поворотную ось, паллету или приспособление на месте, чтобы оно оставалось неподвижным во время обработки. M11 освобождает зажим.',
    },
    promptVariants: [
      {
        en: 'What is the function of M10?',
        ru: 'Какова функция M10?',
      },
    ],
    answerVariants: [
      {
        en: 'Clamps an axis, pallet, or fixture in place',
        ru: 'Фиксирует ось, паллету или приспособление на месте',
      },
    ],
  },
  {
    id: 76,
    category: 'M',
    topic: 'clamping',
    code: 'M11',
    prompt: {
      en: 'What does M11 do?',
      ru: 'Что делает M11?',
    },
    options: [
      {
        en: 'Releases a previously engaged clamp',
        ru: 'Освобождает ранее включённый зажим',
      },
      {
        en: 'Engages a clamp',
        ru: 'Включает зажим',
      },
      {
        en: 'Stops the spindle',
        ru: 'Останавливает шпиндель',
      },
      {
        en: 'Ends the program',
        ru: 'Завершает программу',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M11 releases a clamp previously engaged by M10, typically done before indexing a rotary axis or changing a pallet or fixture.',
      ru: 'M11 освобождает зажим, ранее включённый командой M10, обычно перед поворотом индексируемой оси или сменой паллеты либо приспособления.',
    },
    promptVariants: [
      {
        en: 'What is the function of M11?',
        ru: 'Какова функция M11?',
      },
    ],
    answerVariants: [
      {
        en: 'Unclamps whatever M10 previously locked in place',
        ru: 'Освобождает то, что ранее было зафиксировано командой M10',
      },
    ],
  },
  {
    id: 77,
    category: 'M',
    topic: 'spindle',
    code: 'M13',
    prompt: {
      en: 'What does M13 do?',
      ru: 'Что делает M13?',
    },
    options: [
      {
        en: 'Starts the spindle clockwise and turns on coolant in a single command',
        ru: 'Запускает шпиндель по часовой стрелке и включает СОЖ одной командой',
      },
      {
        en: 'Starts the spindle counterclockwise and turns on coolant',
        ru: 'Запускает шпиндель против часовой стрелки и включает СОЖ',
      },
      {
        en: 'Stops the spindle and turns off coolant',
        ru: 'Останавливает шпиндель и отключает СОЖ',
      },
      {
        en: 'Starts the spindle clockwise only, without coolant',
        ru: 'Запускает шпиндель только по часовой стрелке, без СОЖ',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M13 combines M03 (spindle clockwise) and M08 (coolant on) into a single command, saving a block when both are needed together.',
      ru: 'M13 объединяет M03 (шпиндель по часовой стрелке) и M08 (включение СОЖ) в одну команду, экономя кадр программы, когда нужны обе функции одновременно.',
    },
    promptVariants: [
      {
        en: 'What does M13 combine?',
        ru: 'Что объединяет команда M13?',
      },
    ],
    answerVariants: [
      {
        en: 'Starts the spindle clockwise while also turning on coolant, in one command',
        ru: 'Запускает шпиндель по часовой стрелке и одновременно включает СОЖ одной командой',
      },
    ],
  },
  {
    id: 78,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G87',
    prompt: {
      en: 'What does G87 do?',
      ru: 'Что делает G87?',
    },
    options: [
      {
        en: 'Back boring cycle, cutting a counterbore from the underside',
        ru: 'Цикл обратного растачивания с обработкой раззенковки с обратной стороны',
      },
      {
        en: 'Boring cycle with dwell and manual retract',
        ru: 'Цикл растачивания с выдержкой и ручным отводом',
      },
      { en: 'Peck drilling cycle', ru: 'Цикл прерывистого сверления' },
      { en: 'Rigid tapping cycle', ru: 'Цикл жёсткого нарезания резьбы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G87 is a back boring cycle: the spindle orients and shifts the tool away from center, positions it below the hole, then feeds upward to cut a counterbore on the underside of the workpiece.',
      ru: 'G87 — цикл обратного растачивания: шпиндель ориентируется, инструмент смещается от центра, позиционируется под отверстием, а затем подаётся вверх для обработки раззенковки с обратной стороны заготовки.',
    },
    promptVariants: [
      {
        en: 'What operation does G87 perform?',
        ru: 'Какую операцию выполняет G87?',
      },
    ],
    answerVariants: [
      {
        en: 'Performs back boring, shifting off-center to cut a counterbore from underneath the workpiece',
        ru: 'Выполняет обратное растачивание, смещаясь от центра, чтобы обработать раззенковку с обратной стороны заготовки',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Back-bore a counterbore at X=0, Y=0. Retract plane R=-5, counterbore depth Z=-3, tool shift Q=3, feed rate F=40.',
          ru: 'Выполните обратное растачивание в точке X=0, Y=0. Плоскость отвода R=-5, глубина раззенковки Z=-3, смещение инструмента Q=3, подача F=40.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-3' },
          { letter: 'R', value: '-5' },
          { letter: 'Q', value: '3' },
          { letter: 'F', value: '40' },
        ],
      },
      {
        prompt: {
          en: 'Back-bore a counterbore at X=15, Y=0. Retract plane R=-8, counterbore depth Z=-4, tool shift Q=2, feed rate F=35.',
          ru: 'Выполните обратное растачивание в точке X=15, Y=0. Плоскость отвода R=-8, глубина раззенковки Z=-4, смещение инструмента Q=2, подача F=35.',
        },
        params: [
          { letter: 'X', value: '15' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-4' },
          { letter: 'R', value: '-8' },
          { letter: 'Q', value: '2' },
          { letter: 'F', value: '35' },
        ],
      },
      {
        prompt: {
          en: 'Back-bore a counterbore at X=-5, Y=10. Retract plane R=-4, counterbore depth Z=-2, tool shift Q=4, feed rate F=45.',
          ru: 'Выполните обратное растачивание в точке X=-5, Y=10. Плоскость отвода R=-4, глубина раззенковки Z=-2, смещение инструмента Q=4, подача F=45.',
        },
        params: [
          { letter: 'X', value: '-5' },
          { letter: 'Y', value: '10' },
          { letter: 'Z', value: '-2' },
          { letter: 'R', value: '-4' },
          { letter: 'Q', value: '4' },
          { letter: 'F', value: '45' },
        ],
      },
    ],
  },
  {
    id: 79,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G88',
    prompt: {
      en: 'What does G88 do?',
      ru: 'Что делает G88?',
    },
    options: [
      {
        en: 'Boring cycle that dwells, stops the spindle, and waits for a manual retract',
        ru: 'Цикл растачивания с выдержкой, остановкой шпинделя и ожиданием ручного отвода',
      },
      {
        en: 'Boring cycle that feeds out at the same rate as feeding in',
        ru: 'Цикл растачивания с подачей на выходе, равной подаче на входе',
      },
      { en: 'Simple drilling cycle', ru: 'Простой цикл сверления' },
      { en: 'Tapping cycle', ru: 'Цикл нарезания резьбы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G88 is a boring cycle: the tool feeds to the bottom of the hole, dwells, the spindle stops, and the operator retracts the tool manually before the cycle continues.',
      ru: 'G88 — цикл растачивания: инструмент подаётся до дна отверстия, выдерживается пауза, шпиндель останавливается, и оператор вручную отводит инструмент перед продолжением цикла.',
    },
    promptVariants: [
      {
        en: 'What operation does G88 perform?',
        ru: 'Какую операцию выполняет G88?',
      },
    ],
    answerVariants: [
      {
        en: 'Feeds to the bottom of the hole, dwells, stops the spindle, and waits for a manual retract',
        ru: 'Подаётся до дна отверстия, выдерживает, останавливает шпиндель и ждёт ручного отвода',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Bore a hole at X=8, Y=8 with a dwell and manual retract at the bottom. Retract plane R=2, bore depth Z=-15, dwell time P=1000, feed rate F=55.',
          ru: 'Расточите отверстие в точке X=8, Y=8 с выдержкой и ручным отводом на дне. Плоскость отвода R=2, глубина растачивания Z=-15, время выдержки P=1000, подача F=55.',
        },
        params: [
          { letter: 'X', value: '8' },
          { letter: 'Y', value: '8' },
          { letter: 'Z', value: '-15' },
          { letter: 'R', value: '2' },
          { letter: 'P', value: '1000' },
          { letter: 'F', value: '55' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=0, Y=0 with a dwell and manual retract at the bottom. Retract plane R=3, bore depth Z=-10, dwell time P=600, feed rate F=65.',
          ru: 'Расточите отверстие в точке X=0, Y=0 с выдержкой и ручным отводом на дне. Плоскость отвода R=3, глубина растачивания Z=-10, время выдержки P=600, подача F=65.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-10' },
          { letter: 'R', value: '3' },
          { letter: 'P', value: '600' },
          { letter: 'F', value: '65' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=-10, Y=15 with a dwell and manual retract at the bottom. Retract plane R=4, bore depth Z=-20, dwell time P=1200, feed rate F=45.',
          ru: 'Расточите отверстие в точке X=-10, Y=15 с выдержкой и ручным отводом на дне. Плоскость отвода R=4, глубина растачивания Z=-20, время выдержки P=1200, подача F=45.',
        },
        params: [
          { letter: 'X', value: '-10' },
          { letter: 'Y', value: '15' },
          { letter: 'Z', value: '-20' },
          { letter: 'R', value: '4' },
          { letter: 'P', value: '1200' },
          { letter: 'F', value: '45' },
        ],
      },
    ],
  },
  {
    id: 80,
    category: 'G',
    topic: 'canned-cycle',
    code: 'G89',
    prompt: {
      en: 'How does G89 differ from G85?',
      ru: 'Чем G89 отличается от G85?',
    },
    options: [
      {
        en: 'It adds a dwell at the bottom of the hole before feeding back out',
        ru: 'Добавляет выдержку на дне отверстия перед подачей на выходе',
      },
      {
        en: 'It stops the spindle at the bottom instead of feeding out',
        ru: 'Останавливает шпиндель на дне вместо подачи на выходе',
      },
      {
        en: 'It uses peck cycles to clear chips',
        ru: 'Использует прерывистые циклы для удаления стружки',
      },
      { en: 'It requires a manual retract', ru: 'Требует ручного отвода' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G89 is a boring cycle like G85 (feed in, feed out) but adds a dwell at the bottom of the hole for a cleaner finish.',
      ru: 'G89 — цикл растачивания, как G85 (подача на входе и выходе), но с добавлением выдержки на дне отверстия для более чистой поверхности.',
    },
    promptVariants: [
      {
        en: 'In what way does G89 differ from G85?',
        ru: 'Чем G89 отличается от G85?',
      },
    ],
    answerVariants: [
      {
        en: 'Adds a dwell at the bottom of the hole before feeding back out, unlike plain G85',
        ru: 'Добавляет выдержку на дне отверстия перед подачей на выходе, в отличие от обычного G85',
      },
    ],
    lineExamples: [
      {
        prompt: {
          en: 'Bore a hole at X=14, Y=4 with a dwell at the bottom. Retract plane R=2, bore depth Z=-18, dwell time P=750, feed rate F=60.',
          ru: 'Расточите отверстие в точке X=14, Y=4 с выдержкой на дне. Плоскость отвода R=2, глубина растачивания Z=-18, время выдержки P=750, подача F=60.',
        },
        params: [
          { letter: 'X', value: '14' },
          { letter: 'Y', value: '4' },
          { letter: 'Z', value: '-18' },
          { letter: 'R', value: '2' },
          { letter: 'P', value: '750' },
          { letter: 'F', value: '60' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=0, Y=0 with a dwell at the bottom. Retract plane R=3, bore depth Z=-12, dwell time P=500, feed rate F=75.',
          ru: 'Расточите отверстие в точке X=0, Y=0 с выдержкой на дне. Плоскость отвода R=3, глубина растачивания Z=-12, время выдержки P=500, подача F=75.',
        },
        params: [
          { letter: 'X', value: '0' },
          { letter: 'Y', value: '0' },
          { letter: 'Z', value: '-12' },
          { letter: 'R', value: '3' },
          { letter: 'P', value: '500' },
          { letter: 'F', value: '75' },
        ],
      },
      {
        prompt: {
          en: 'Bore a hole at X=-8, Y=22 with a dwell at the bottom. Retract plane R=4, bore depth Z=-24, dwell time P=900, feed rate F=45.',
          ru: 'Расточите отверстие в точке X=-8, Y=22 с выдержкой на дне. Плоскость отвода R=4, глубина растачивания Z=-24, время выдержки P=900, подача F=45.',
        },
        params: [
          { letter: 'X', value: '-8' },
          { letter: 'Y', value: '22' },
          { letter: 'Z', value: '-24' },
          { letter: 'R', value: '4' },
          { letter: 'P', value: '900' },
          { letter: 'F', value: '45' },
        ],
      },
    ],
  },
  {
    id: 81,
    category: 'M',
    topic: 'spindle',
    code: 'M14',
    prompt: {
      en: 'What does M14 do?',
      ru: 'Что делает M14?',
    },
    options: [
      {
        en: 'Starts the spindle counterclockwise and turns on coolant in a single command',
        ru: 'Запускает шпиндель против часовой стрелки и включает СОЖ одной командой',
      },
      {
        en: 'Starts the spindle clockwise and turns on coolant',
        ru: 'Запускает шпиндель по часовой стрелке и включает СОЖ',
      },
      {
        en: 'Stops the spindle and turns off coolant',
        ru: 'Останавливает шпиндель и отключает СОЖ',
      },
      {
        en: 'Starts the spindle counterclockwise only, without coolant',
        ru: 'Запускает шпиндель только против часовой стрелки, без СОЖ',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: "M14 combines M04 (spindle counterclockwise) and M08 (coolant on) into a single command, mirroring M13's combination of M03 and M08.",
      ru: 'M14 объединяет M04 (шпиндель против часовой стрелки) и M08 (включение СОЖ) в одну команду, аналогично тому, как M13 объединяет M03 и M08.',
    },
    promptVariants: [
      {
        en: 'What does M14 combine?',
        ru: 'Что объединяет команда M14?',
      },
    ],
    answerVariants: [
      {
        en: 'Starts the spindle counterclockwise while also turning on coolant, in one command',
        ru: 'Запускает шпиндель против часовой стрелки и одновременно включает СОЖ одной командой',
      },
    ],
  },
  {
    id: 82,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G15',
    prompt: {
      en: 'What does G15 do?',
      ru: 'Что делает G15?',
    },
    options: [
      {
        en: 'Cancels polar coordinate command mode',
        ru: 'Отменяет режим полярных координат',
      },
      {
        en: 'Activates polar coordinate command mode',
        ru: 'Включает режим полярных координат',
      },
      {
        en: 'Cancels coordinate system rotation',
        ru: 'Отменяет поворот системы координат',
      },
      { en: 'Cancels scaling', ru: 'Отменяет масштабирование' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G15 cancels polar coordinate command mode, returning subsequent moves to standard Cartesian (X/Y) programming.',
      ru: 'G15 отменяет режим полярных координат, возвращая последующие перемещения к стандартному программированию в декартовых координатах (X/Y).',
    },
    promptVariants: [
      {
        en: 'What is the effect of G15?',
        ru: 'Каков эффект от G15?',
      },
    ],
    answerVariants: [
      {
        en: 'Switches back to standard Cartesian (X/Y) programming, cancelling polar mode',
        ru: 'Возвращает стандартное программирование в декартовых координатах (X/Y), отменяя полярный режим',
      },
    ],
  },
  {
    id: 83,
    category: 'G',
    topic: 'coordinate-system',
    code: 'G16',
    prompt: {
      en: 'What does G16 do?',
      ru: 'Что делает G16?',
    },
    options: [
      {
        en: 'Activates polar coordinate command mode',
        ru: 'Включает режим полярных координат',
      },
      {
        en: 'Cancels polar coordinate command mode',
        ru: 'Отменяет режим полярных координат',
      },
      {
        en: 'Activates coordinate system rotation',
        ru: 'Включает поворот системы координат',
      },
      { en: 'Activates scaling', ru: 'Включает масштабирование' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G16 activates polar coordinate command mode, letting subsequent moves be programmed as a radius and angle from the current work coordinate system origin instead of X/Y.',
      ru: 'G16 включает режим полярных координат, позволяя задавать последующие перемещения радиусом и углом относительно начала текущей системы координат вместо X/Y.',
    },
    promptVariants: [
      {
        en: 'What is the effect of G16?',
        ru: 'Каков эффект от G16?',
      },
    ],
    answerVariants: [
      {
        en: 'Lets subsequent moves be programmed as a radius and angle instead of X/Y',
        ru: 'Позволяет задавать последующие перемещения радиусом и углом вместо X/Y',
      },
    ],
  },
  {
    id: 84,
    category: 'G',
    topic: 'compensation',
    code: 'G44',
    prompt: {
      en: 'What does G44 apply?',
      ru: 'Что применяет G44?',
    },
    options: [
      {
        en: 'Tool length compensation (negative)',
        ru: 'Коррекцию на длину инструмента (отрицательную)',
      },
      {
        en: 'Tool length compensation (positive)',
        ru: 'Коррекцию на длину инструмента (положительную)',
      },
      {
        en: 'Tool length compensation cancel',
        ru: 'Отмену коррекции на длину инструмента',
      },
      { en: 'Cutter radius compensation', ru: 'Коррекцию на радиус фрезы' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G44 applies negative tool length compensation, subtracting the H offset value instead of adding it like G43; it is less commonly used.',
      ru: 'G44 применяет отрицательную коррекцию на длину инструмента, вычитая значение коррекции H вместо прибавления, как это делает G43; используется реже.',
    },
    promptVariants: [
      {
        en: 'What kind of compensation does G44 apply?',
        ru: 'Какую коррекцию применяет G44?',
      },
    ],
    answerVariants: [
      {
        en: 'Applies tool length compensation by subtracting the H offset value (negative compensation)',
        ru: 'Применяет коррекцию на длину инструмента, вычитая значение коррекции H (отрицательная коррекция)',
      },
    ],
  },
  {
    id: 85,
    category: 'G',
    topic: 'motion',
    code: 'G60',
    prompt: {
      en: 'What does G60 (unidirectional positioning) do?',
      ru: 'Что делает G60 (однонаправленное позиционирование)?',
    },
    options: [
      {
        en: 'Always approaches the programmed position from the same direction to eliminate backlash',
        ru: 'Всегда подходит к запрограммированной позиции с одного и того же направления, устраняя люфт',
      },
      {
        en: 'Blends corners for smoother continuous motion',
        ru: 'Сглаживает углы для более плавного непрерывного движения',
      },
      { en: 'Selects a canned cycle', ru: 'Выбирает постоянный цикл' },
      {
        en: 'Cancels cutter radius compensation',
        ru: 'Отменяет коррекцию на радиус фрезы',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'G60 sets unidirectional positioning, always approaching the target from the same direction to cancel out backlash for precise positioning moves such as hole boring.',
      ru: 'G60 включает однонаправленное позиционирование: станок всегда подходит к цели с одного направления, устраняя люфт для точного позиционирования, например при растачивании отверстий.',
    },
    promptVariants: [
      {
        en: 'What is the purpose of unidirectional positioning G60?',
        ru: 'Какова цель однонаправленного позиционирования G60?',
      },
    ],
    answerVariants: [
      {
        en: 'Always approaches the target position from one fixed direction, cancelling out backlash',
        ru: 'Всегда подходит к целевой позиции с одного фиксированного направления, устраняя люфт',
      },
    ],
  },
  {
    id: 86,
    category: 'M',
    topic: 'canned-cycle',
    code: 'M29',
    prompt: {
      en: 'What does M29 do?',
      ru: 'Что делает M29?',
    },
    options: [
      {
        en: 'Enables rigid tapping mode, synchronizing spindle rotation with feed before a tapping cycle',
        ru: 'Включает жёсткое нарезание резьбы, синхронизируя вращение шпинделя с подачей перед циклом нарезания резьбы',
      },
      { en: 'Cancels a canned cycle', ru: 'Отменяет постоянный цикл' },
      { en: 'Calls a subprogram', ru: 'Вызывает подпрограмму' },
      {
        en: 'Starts the spindle clockwise',
        ru: 'Запускает шпиндель по часовой стрелке',
      },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'M29 enables rigid tapping mode, locking the spindle to the feed axis so a tapping cycle like G84 can cut threads without a floating tap holder.',
      ru: 'M29 включает режим жёсткого нарезания резьбы, синхронизируя шпиндель с осью подачи, чтобы цикл нарезания резьбы (например, G84) мог работать без плавающего патрона.',
    },
    promptVariants: [
      {
        en: 'What is the purpose of M29?',
        ru: 'Какова цель команды M29?',
      },
    ],
    answerVariants: [
      {
        en: 'Switches on rigid tapping, locking spindle rotation to the feed axis before a tapping cycle',
        ru: 'Включает жёсткое нарезание резьбы, синхронизируя вращение шпинделя с осью подачи перед циклом нарезания',
      },
    ],
  },
];

export function getQuestionsForQuiz(
  count = quizQuestions.length,
): QuizQuestion[] {
  return quizQuestions.slice(0, Math.min(count, quizQuestions.length));
}
