import type { LocalizedText } from '../i18n';

export type QuizCategory = 'G' | 'M';

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
  },
  {
    id: 3,
    category: 'M',
    topic: 'spindle',
    code: 'M05',
    prompt: {
      en: 'Which command typically stops the spindle?',
      ru: 'Какая команда обычно останавливает шпиндель?',
    },
    options: [
      { en: 'M03', ru: 'M03' },
      { en: 'M05', ru: 'M05' },
      { en: 'G21', ru: 'G21' },
      { en: 'G17', ru: 'G17' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M05 is the standard CNC code to stop the spindle.',
      ru: 'M05 — стандартный код ЧПУ для остановки шпинделя.',
    },
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
  },
  {
    id: 8,
    category: 'M',
    topic: 'program-control',
    code: 'M30',
    prompt: {
      en: 'Which code is used to end a CNC program?',
      ru: 'Какой код используется для завершения программы ЧПУ?',
    },
    options: [
      { en: 'M02', ru: 'M02' },
      { en: 'M30', ru: 'M30' },
      { en: 'M06', ru: 'M06' },
      { en: 'G28', ru: 'G28' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'M30 is commonly used to end the program and rewind the tape or reset.',
      ru: 'M30 обычно используется для завершения программы с перемоткой/сбросом в начало.',
    },
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
        en: 'Cancels coordinate system rotation (G68)',
        ru: 'Отменяет поворот системы координат (G68)',
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
        en: 'Cancels the modal macro call started by G66',
        ru: 'Отменяет модальный вызов макроса, начатый командой G66',
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
  },
];

export function getQuestionsForQuiz(
  count = quizQuestions.length,
): QuizQuestion[] {
  return quizQuestions.slice(0, Math.min(count, quizQuestions.length));
}
