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
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'G',
    topic: 'motion',
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
    prompt: {
      en: 'What operation does G81 perform?',
      ru: 'Какую операцию выполняет G81?',
    },
    options: [
      { en: 'Simple drilling cycle', ru: 'Простой цикл сверления' },
      { en: 'Peck drilling cycle', ru: 'Цикл прерывистого сверления (пекинг)' },
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
];

export function getQuestionsForQuiz(
  count = quizQuestions.length,
): QuizQuestion[] {
  return quizQuestions.slice(0, Math.min(count, quizQuestions.length));
}
