# JavaScript Matrix: вопросы и ответы

- What is the difference between let, const, and var?

  **Ответ:** `var` имеет функциональную область видимости, поднимается при hoisting и допускает повторное объявление в одной области. `let` и `const` имеют блочную область видимости и находятся в Temporal Dead Zone до объявления. `const` запрещает переназначение переменной, но не делает объект неизменяемым.

  ```js
  var a = 1;
  let b = 2;
  const user = { name: 'Ann' };
  user.name = 'Kate'; // можно, ссылка не меняется
  // user = {}; // нельзя
  ```

- How does variable hoisting work in JavaScript?

  **Ответ:** Hoisting означает, что объявления переменных и функций обрабатываются до выполнения кода. Для `var` переменная создается и получает значение `undefined`, поэтому к ней можно обратиться до строки объявления. Для `let` и `const` binding тоже создается заранее, но до объявления он недоступен из-за TDZ. Function declaration полностью доступна до объявления.

  ```js
  console.log(a); // undefined
  var a = 1;

  // console.log(b); // ReferenceError
  let b = 2;
  ```

- What is the Temporary Dead Zone (TDZ)?

  **Ответ:** TDZ — период от начала области видимости до фактической строки объявления `let`, `const` или `class`. В этот период переменная существует как binding, но доступ к ней вызывает `ReferenceError`. Это защищает от использования значения до инициализации.

- How does a variable behave if declared without var/let/const?

  **Ответ:** В нестрогом режиме присваивание необъявленной переменной создает свойство глобального объекта. Это опасно, потому что приводит к случайным глобальным переменным. В строгом режиме такое присваивание выбрасывает `ReferenceError`.

  ```js
  'use strict';
  // count = 1; // ReferenceError
  ```

- What does "use strict" do and what restrictions does it introduce?

  **Ответ:** `"use strict"` включает строгий режим. Он запрещает неявные глобальные переменные, дублирующиеся параметры функции, некоторые устаревшие синтаксические конструкции и меняет поведение `this`: в обычной функции без контекста `this` будет `undefined`, а не глобальный объект. Модули ES и классы всегда работают в строгом режиме.

- Why is "eval is evil" considered a best practice?

  **Ответ:** `eval()` выполняет строку как код. Это создает риски безопасности, усложняет отладку, ломает статический анализ и мешает оптимизациям движка. Если нужно обработать данные, лучше использовать структурированные форматы и явные функции.

  ```js
  JSON.parse('{"count": 1}'); // лучше, чем eval('({ count: 1 })')
  ```

- How do for and while loops work?

  **Ответ:** `for` удобен, когда известны инициализация, условие и шаг итерации. `while` выполняет тело, пока условие истинно, и полезен, когда количество итераций заранее неизвестно.

  ```js
  for (let i = 0; i < 3; i += 1) {
    console.log(i);
  }

  let value = 3;
  while (value > 0) {
    value -= 1;
  }
  ```

- How do if and switch statements work?

  **Ответ:** `if` выбирает ветку по boolean-условию. `switch` сравнивает выражение с `case` через строгое сравнение `===`. Без `break` выполнение продолжится в следующий `case`, что называется fall-through.

  ```js
  switch (role) {
    case 'admin':
      canEdit = true;
      break;
    default:
      canEdit = false;
  }
  ```

- How do logical operators work in JavaScript?

  **Ответ:** `&&`, `||` и `!` работают с truthy/falsy значениями. `&&` возвращает первый falsy операнд или последний операнд. `||` возвращает первый truthy операнд или последний. Они используют short-circuit evaluation: правая часть может не выполняться.

  ```js
  const name = inputName || 'Guest';
  isReady && start();
  ```

- How does the conditional (ternary) operator work?

  **Ответ:** Тернарный оператор выбирает одно из двух выражений по условию: `condition ? valueIfTrue : valueIfFalse`. Он удобен для коротких выражений, но вложенные тернарные операторы часто ухудшают читаемость.

  ```js
  const label = count === 1 ? 'item' : 'items';
  ```

- What are template literals and when should they be used?

  **Ответ:** Template literals — строки в обратных кавычках. Они поддерживают интерполяцию через `${...}` и многострочный текст. Их стоит использовать для строк с переменными или для читаемых многострочных шаблонов.

  ```js
  const message = `Hello, ${user.name}`;
  ```

- What is the nullish coalescing operator?

  **Ответ:** `??` возвращает правый операнд только если левый равен `null` или `undefined`. В отличие от `||`, он не заменяет валидные falsy-значения вроде `0`, `false` или пустой строки.

  ```js
  const limit = options.limit ?? 10;
  ```

- What data types exist in JavaScript?

  **Ответ:** В JavaScript есть primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`; и reference type: `object`. Функции, массивы, даты, map/set и другие структуры являются объектами или специальными объектными типами.

- What is the difference between null and undefined?

  **Ответ:** `undefined` обычно означает, что значение не было присвоено. `null` обычно ставят явно, чтобы показать намеренное отсутствие значения. Оба значения означают "нет данных", но семантически `null` чаще является осознанным выбором разработчика.

  ```js
  let value; // undefined
  const selectedUser = null; // пользователя намеренно нет
  ```

- What is the difference between strict and non-strict comparison?

  **Ответ:** Строгое сравнение `===` сравнивает значения без приведения типов. Нестрогое `==` сначала пытается привести типы, что часто дает неожиданные результаты. В production-коде почти всегда лучше использовать `===` и `!==`.

  ```js
  0 == false;  // true
  0 === false; // false
  ```

- How does type conversion work in JavaScript?

  **Ответ:** Приведение типов бывает явным и неявным. Явное выполняется через `String()`, `Number()`, `Boolean()` и другие функции. Неявное происходит в операторах и сравнениях, например при `+`, `==` или в boolean-контексте.

  ```js
  Number('42'); // 42
  Boolean(''); // false
  '5' + 1; // '51'
  '5' - 1; // 4
  ```

- How does the typeof operator work?

  **Ответ:** `typeof` возвращает строку с типом значения. Он хорошо подходит для primitive types и функций, но для `null` исторически возвращает `"object"`, а для массивов тоже `"object"`, поэтому массивы проверяют через `Array.isArray()`.

  ```js
  typeof 1; // 'number'
  typeof null; // 'object'
  Array.isArray([]); // true
  ```

- What is BigInt?

  **Ответ:** `BigInt` — числовой тип для целых чисел произвольной длины. Он нужен, когда значения выходят за безопасный диапазон `Number.MAX_SAFE_INTEGER`. `BigInt` нельзя смешивать с обычным `number` без явного преобразования.

  ```js
  const id = 9007199254740993n;
  ```

- What is Symbol and where is it used?

  **Ответ:** `Symbol` — уникальный primitive value, часто используемый как ключ объекта без риска конфликта имен. Также well-known symbols, например `Symbol.iterator`, позволяют настраивать встроенное поведение объектов.

  ```js
  const key = Symbol('id');
  const user = { [key]: 123 };
  ```

- Why are objects considered reference types?

  **Ответ:** Объекты хранятся и передаются по ссылке на область памяти. При присваивании объекта другой переменной копируется ссылка, а не сам объект. Поэтому изменения через одну переменную видны через другую.

  ```js
  const a = { count: 1 };
  const b = a;
  b.count = 2;
  console.log(a.count); // 2
  ```

- How can object properties be added, updated, and deleted?

  **Ответ:** Свойства добавляются или обновляются через точечную или bracket-нотацию. Удаление выполняется оператором `delete`. Для массового обновления часто используют spread.

  ```js
  const user = {};
  user.name = 'Ann';
  user['role'] = 'admin';
  delete user.role;
  ```

- How can object keys be accessed?

  **Ответ:** Ключи доступны через dot notation, если имя статичное и валидное как идентификатор, или через bracket notation, если ключ динамический либо содержит специальные символы.

  ```js
  user.name;
  user[fieldName];
  user['first-name'];
  ```

- How does the for...in loop work?

  **Ответ:** `for...in` перебирает enumerable string-ключи объекта, включая унаследованные enumerable-свойства из prototype chain. Для собственных свойств обычно добавляют `Object.hasOwn()` или используют `Object.keys()`.

  ```js
  for (const key in user) {
    if (Object.hasOwn(user, key)) {
      console.log(key, user[key]);
    }
  }
  ```

- What are the different ways to create objects?

  **Ответ:** Объекты можно создавать через object literal, constructor function, class, `Object.create()`, factory function или built-in constructors. На практике чаще всего используют object literals, classes и factories.

  ```js
  const a = {};
  const b = Object.create(null);
  const c = new User('Ann');
  ```

- How do destructuring assignment and the spread operator work?

  **Ответ:** Destructuring извлекает значения из объектов или массивов в переменные. Spread `...` разворачивает элементы массива или свойства объекта в новый массив/объект. Для объектов spread делает поверхностную копию.

  ```js
  const { name, role = 'user' } = user;
  const nextUser = { ...user, role: 'admin' };
  const copy = [...items];
  ```

- How does optional chaining work?

  **Ответ:** Optional chaining `?.` безопасно обращается к свойству, методу или элементу. Если слева `null` или `undefined`, выражение возвращает `undefined` вместо ошибки.

  ```js
  const city = user.address?.city;
  const result = callbacks.onSave?.();
  ```

- How does object-to-primitive conversion work?

  **Ответ:** Когда объект нужен как primitive, JavaScript пытается вызвать методы преобразования: сначала `Symbol.toPrimitive`, затем в зависимости от hint — `valueOf()` и `toString()`. Это используется в арифметике, сравнении и строковом контексте.

  ```js
  const price = {
    amount: 10,
    valueOf() {
      return this.amount;
    }
  };

  Number(price); // 10
  ```

- What are property descriptors?

  **Ответ:** Property descriptor описывает поведение свойства: `value`, `writable`, `enumerable`, `configurable`, либо accessor-поля `get` и `set`. Через descriptors можно управлять видимостью свойства в переборе, возможностью записи и удаления.

  ```js
  Object.defineProperty(user, 'id', {
    value: 1,
    writable: false,
    enumerable: true
  });
  ```

- How do getters and setters work?

  **Ответ:** Getter вычисляет значение свойства при чтении, setter выполняется при записи. Они позволяют скрыть внутреннее состояние или добавить валидацию, сохраняя удобный синтаксис доступа как к обычному свойству.

  ```js
  const user = {
    firstName: 'Ann',
    lastName: 'Smith',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    set fullName(value) {
      [this.firstName, this.lastName] = value.split(' ');
    }
  };
  ```

- What is the difference between mutable and immutable objects?

  **Ответ:** Mutable object можно изменить после создания. Immutable object не изменяют напрямую: вместо этого создают новое значение с нужными изменениями. Иммутабельный подход упрощает сравнение состояний, отладку и работу UI-фреймворков.

  ```js
  const nextUser = { ...user, name: 'Kate' };
  ```

- What are Map and Set?

  **Ответ:** `Map` хранит пары ключ-значение и допускает ключи любого типа. `Set` хранит уникальные значения. Они удобнее объектов и массивов, когда нужны частые проверки наличия, произвольные ключи или уникальность.

  ```js
  const usersById = new Map();
  usersById.set(1, { name: 'Ann' });

  const tags = new Set(['js', 'node', 'js']);
  ```

- How do deep copy and cloning work?

  **Ответ:** Shallow copy копирует только верхний уровень объекта, вложенные объекты остаются общими ссылками. Deep copy рекурсивно копирует вложенные структуры. Для простых данных можно использовать `structuredClone()`, но для классов, функций и специальных объектов нужны осторожность или специализированная логика.

- What does structuredClone() do?

  **Ответ:** `structuredClone()` создает deep copy значения по structured clone algorithm. Он поддерживает многие встроенные типы, например `Date`, `Map`, `Set`, `ArrayBuffer`, но не клонирует функции и DOM-узлы.

  ```js
  const copy = structuredClone({
    createdAt: new Date(),
    tags: new Set(['js'])
  });
  ```

- What are WeakMap and WeakSet?

  **Ответ:** `WeakMap` и `WeakSet` хранят слабые ссылки на объектные ключи/значения. Если на объект больше нет обычных ссылок, сборщик мусора может удалить его, даже если он есть в `WeakMap` или `WeakSet`. Они полезны для приватных метаданных, кешей и привязки данных к объектам без утечек памяти.

- How do Proxy and Reflect work?

  **Ответ:** `Proxy` позволяет перехватывать операции над объектом: чтение, запись, удаление, вызов функции и другие. `Reflect` предоставляет стандартные методы для выполнения этих операций и часто используется внутри proxy traps, чтобы сохранить поведение по умолчанию.

  ```js
  const proxy = new Proxy(user, {
    get(target, key, receiver) {
      console.log(`read ${String(key)}`);
      return Reflect.get(target, key, receiver);
    }
  });
  ```

- What are iterable objects?

  **Ответ:** Iterable object — объект, который реализует метод `[Symbol.iterator]()` и возвращает iterator. Такой объект можно использовать в `for...of`, spread, `Array.from()` и destructuring.

  ```js
  const range = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
    }
  };
  ```

- What is garbage collection and why is it needed?

  **Ответ:** Garbage collection — автоматическое освобождение памяти, занятой объектами, которые больше недостижимы из программы. Это нужно, чтобы приложение не держало ненужные объекты бесконечно и не исчерпывало память.

- How does the mark-and-sweep algorithm work?

  **Ответ:** Mark-and-sweep начинает с корневых объектов, например глобального объекта и текущего call stack. Все достижимые объекты помечаются как живые. Затем непомеченные объекты считаются мусором и освобождаются.

- What is object reachability in garbage collection?

  **Ответ:** Reachability означает, что до объекта можно добраться по цепочке ссылок от root-объектов. Если объект недостижим, он считается кандидатом на удаление сборщиком мусора.

  ```js
  let user = { name: 'Ann' };
  user = null; // объект больше недостижим, если других ссылок нет
  ```

- What are generational, incremental, and idle-time garbage collection strategies?

  **Ответ:** Generational GC делит объекты на молодые и старые, потому что многие объекты живут недолго. Incremental GC разбивает сборку на маленькие шаги, уменьшая длинные паузы. Idle-time GC пытается выполнять работу во время простоя, чтобы меньше мешать пользовательскому коду.

- What types of functions exist in JavaScript?

  **Ответ:** В JavaScript есть function declarations, function expressions, arrow functions, methods, constructor functions, generator functions, async functions и async generators. Они отличаются hoisting, поведением `this`, возможностью использовать `new`, `yield` и `await`.

- What are Immediately Invoked Function Expressions (IIFE)?

  **Ответ:** IIFE — функция, которая создается и сразу вызывается. Исторически ее часто использовали для изоляции переменных до появления `let`, `const` и ES modules.

  ```js
  (() => {
    const privateValue = 1;
  })();
  ```

- What is the difference between arrow functions and regular functions?

  **Ответ:** Arrow functions не имеют собственного `this`, `arguments`, `super` и не могут использоваться как constructors с `new`. Regular functions имеют собственный `this`, который зависит от способа вызова. Arrow functions удобны для callbacks и лексического `this`.

  ```js
  const user = {
    name: 'Ann',
    sayLater() {
      setTimeout(() => console.log(this.name), 0);
    }
  };
  ```

- How do function constructors work?

  **Ответ:** Constructor function вызывается через `new`. JavaScript создает новый объект, связывает его с `Constructor.prototype`, вызывает функцию с `this`, указывающим на новый объект, и возвращает объект, если функция явно не вернула другой объект.

  ```js
  function User(name) {
    this.name = name;
  }

  const user = new User('Ann');
  ```

- What is the arguments object?

  **Ответ:** `arguments` — array-like object, доступный внутри обычных функций. Он содержит фактически переданные аргументы. В arrow functions `arguments` нет; вместо него обычно используют rest parameters.

  ```js
  function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
  }
  ```

- What is recursion and where is it used?

  **Ответ:** Recursion — прием, при котором функция вызывает саму себя до достижения базового условия. Он полезен для деревьев, графов, вложенных структур, парсеров и алгоритмов вроде quicksort. Важно иметь base case, иначе будет stack overflow.

- How can recursive traversal of objects be implemented?

  **Ответ:** Нужно обойти свойства объекта, проверить вложенные объекты и рекурсивно вызвать функцию для них. Для production-кода стоит учитывать циклические ссылки через `WeakSet`.

  ```js
  function walk(value, seen = new WeakSet()) {
    if (value === null || typeof value !== 'object' || seen.has(value)) {
      return;
    }

    seen.add(value);

    for (const [key, child] of Object.entries(value)) {
      console.log(key, child);
      walk(child, seen);
    }
  }
  ```

- What does the new Function constructor do?

  **Ответ:** `new Function()` создает функцию из строк во время выполнения. Она выполняется в глобальной области видимости, а не в текущем lexical scope. Это почти всегда стоит избегать по тем же причинам, что и `eval`: безопасность, производительность и сложность сопровождения.

  ```js
  const add = new Function('a', 'b', 'return a + b');
  ```

- What is currying?

  **Ответ:** Currying преобразует функцию от нескольких аргументов в цепочку функций, каждая из которых принимает часть аргументов. Это удобно для частичного применения и композиции функций.

  ```js
  const multiply = (a) => (b) => a * b;
  const double = multiply(2);
  double(5); // 10
  ```

- What are tagged template functions?

  **Ответ:** Tagged template function обрабатывает template literal до формирования итоговой строки. Функция получает массив строковых частей и значения интерполяций. Это используется для безопасного экранирования, i18n, CSS-in-JS, SQL builders и DSL.

  ```js
  function tag(strings, value) {
    return `${strings[0]}${String(value).toUpperCase()}${strings[1]}`;
  }

  tag`Hello, ${'ann'}!`;
  ```

- What is the this keyword?

  **Ответ:** `this` — значение контекста выполнения функции. В обычной функции оно зависит от способа вызова: как метод, через `call/apply/bind`, через `new` или как обычная функция. В arrow function `this` берется из внешней lexical scope.

- How can this be bound to a function?

  **Ответ:** `this` можно задать через `call()`, `apply()` или навсегда привязать через `bind()`. Также контекст задается при вызове метода объекта и при использовании `new`.

  ```js
  function greet() {
    return this.name;
  }

  const boundGreet = greet.bind({ name: 'Ann' });
  ```

- What is the global context in JavaScript?

  **Ответ:** Global context — верхний уровень выполнения программы. В браузере глобальный объект доступен как `window`, в Node.js — через `global`, а универсальный стандартный доступ — `globalThis`. Переменные `var` на верхнем уровне script могут становиться свойствами глобального объекта, но `let` и `const` — нет.

- What is a lexical environment?

  **Ответ:** Lexical environment — внутренняя структура, где JavaScript хранит bindings переменных и ссылку на внешнее окружение. Она создается для global scope, функций, блоков и модулей. Именно lexical environment объясняет работу scope chain и closures.

- What is scope and the scope chain?

  **Ответ:** Scope определяет, где переменная доступна. Scope chain — цепочка внешних lexical environments, по которой JavaScript ищет имя переменной: сначала локально, затем выше до global scope.

- What is variable shadowing?

  **Ответ:** Shadowing происходит, когда переменная во внутренней области имеет то же имя, что и переменная во внешней области. Внутренняя переменная "затеняет" внешнюю в своей области видимости.

  ```js
  const name = 'global';

  function run() {
    const name = 'local';
    console.log(name); // local
  }
  ```

- What are closures and how do they work?

  **Ответ:** Closure — функция вместе с доступом к lexical environment, в котором она была создана. Даже после завершения внешней функции внутренняя функция может использовать переменные внешней области, если на нее осталась ссылка.

  ```js
  function createCounter() {
    let count = 0;
    return () => {
      count += 1;
      return count;
    };
  }
  ```

- What problems can arise from name conflicts in closures?

  **Ответ:** Конфликты имен могут приводить к shadowing, случайному использованию не той переменной и сложной отладке. Особенно это заметно в циклах, вложенных callbacks и больших функциях. Решение — короткие области видимости, ясные имена и отказ от лишней вложенности.

- How does lexical environment garbage collection work?

  **Ответ:** Lexical environment может быть удален, когда он больше недостижим. Если closure продолжает ссылаться на переменные внешней функции, нужная часть окружения сохраняется. Поэтому долгоживущие closures могут удерживать память, если захватывают крупные объекты.

- What is the difference between proto and prototype?

  **Ответ:** `prototype` — свойство функции-конструктора, объект, который станет прототипом экземпляров при вызове `new`. `__proto__` — accessor к внутренней ссылке объекта `[[Prototype]]`. В современном коде лучше использовать `Object.getPrototypeOf()` и `Object.setPrototypeOf()`.

  ```js
  function User() {}
  const user = new User();
  Object.getPrototypeOf(user) === User.prototype; // true
  ```

- How does the prototype chain work?

  **Ответ:** Если свойство не найдено на объекте, JavaScript ищет его в прототипе, затем в прототипе прототипа и так далее до `null`. Это называется prototype chain и лежит в основе наследования объектов.

- How can objects be created with a specific prototype?

  **Ответ:** Самый прямой способ — `Object.create(proto)`. Также прототип задается через `new Constructor()` или `class`, где экземпляр получает ссылку на `Constructor.prototype`.

  ```js
  const animal = { eats: true };
  const rabbit = Object.create(animal);
  ```

- How can object prototypes be accessed and modified?

  **Ответ:** Прототип читают через `Object.getPrototypeOf(obj)`. Изменять можно через `Object.setPrototypeOf(obj, proto)`, но это может ухудшить производительность. Обычно прототип лучше задавать при создании объекта.

- What is the difference between prototype inheritance and classical OOP inheritance?

  **Ответ:** В prototype inheritance объекты наследуют напрямую от других объектов через prototype chain. В классической ООП-модели классы описывают структуру, а экземпляры создаются по шаблону класса. JavaScript `class` — синтаксическая оболочка над прототипным механизмом, а не отдельная классическая модель как в Java или C#.

- How do constructor functions implement functional prototyping?

  **Ответ:** Constructor function и ее `prototype` позволяют создать экземпляры с общими методами. Данные экземпляра обычно записываются в `this`, а методы кладутся в `Constructor.prototype`, чтобы не создавать новую копию метода для каждого объекта.

  ```js
  function User(name) {
    this.name = name;
  }

  User.prototype.sayHi = function () {
    return `Hi, ${this.name}`;
  };
  ```

- How can an object's constructor be accessed through the prototype chain?

  **Ответ:** Обычно `obj.constructor` находится через prototype chain, потому что `Constructor.prototype.constructor` по умолчанию указывает на функцию-конструктор. Но это свойство можно перезаписать, поэтому полагаться на него для строгой проверки типа не всегда надежно.

- How does class syntax work in JavaScript?

  **Ответ:** `class` объявляет constructor, prototype methods, static methods и поля класса более удобным синтаксисом. Методы класса находятся в prototype, а сам class работает в strict mode. Class declaration не hoistится так же удобно, как function declaration: до объявления обращаться нельзя.

  ```js
  class User {
    constructor(name) {
      this.name = name;
    }

    sayHi() {
      return `Hi, ${this.name}`;
    }
  }
  ```

- How does inheritance work with classes?

  **Ответ:** Наследование классов выполняется через `extends`. В дочернем constructor перед использованием `this` нужно вызвать `super()`. Методы родителя доступны через `super.method()`.

  ```js
  class Admin extends User {
    constructor(name, permissions) {
      super(name);
      this.permissions = permissions;
    }
  }
  ```

- What are private and protected fields and methods?

  **Ответ:** Private fields в JavaScript объявляются через `#` и доступны только внутри класса. Protected-модификатора в нативном JavaScript нет; его обычно имитируют соглашением `_field` или используют TypeScript `protected`, который проверяется на этапе компиляции.

  ```js
  class Counter {
    #value = 0;

    increment() {
      this.#value += 1;
    }
  }
  ```

- How does the instanceof operator work?

  **Ответ:** `instanceof` проверяет, есть ли `Constructor.prototype` в prototype chain объекта. Он не проверяет форму объекта и может давать неожиданные результаты между разными realms, например iframe.

  ```js
  user instanceof User;
  ```

- What are static properties and methods?

  **Ответ:** Static properties и methods принадлежат самому классу, а не экземплярам. Они используются для фабрик, утилит, констант и операций, связанных с типом в целом.

  ```js
  class User {
    static fromJson(json) {
      return new User(json.name);
    }
  }
  ```

- How can class inheritance be converted into functional inheritance and vice versa?

  **Ответ:** Class inheritance можно выразить через constructor functions и prototype chain: методы класса становятся методами prototype, `extends` заменяется настройкой prototype. Обратно constructor function можно переписать как `class`, сохранив constructor и prototype methods как методы класса.

- What are mixins?

  **Ответ:** Mixins — способ добавить поведение классу или объекту без жесткой иерархии наследования. Обычно mixin — функция, которая принимает base class и возвращает расширенный class, либо объект с методами, которые копируются в prototype.

  ```js
  const Timestamped = (Base) => class extends Base {
    createdAt = new Date();
  };
  ```

- What are decorators?

  **Ответ:** Decorators — синтаксис для декларативного изменения классов, методов, полей или accessors. В JavaScript они зависят от поддержки окружения или transpiler-а, а в TypeScript используются давно. Типичные применения: metadata, dependency injection, validation, logging.

  ```ts
  function LogMethod(_target: unknown, key: string) {
    console.log(`Decorated: ${key}`);
  }
  ```

- What is blocking code?

  **Ответ:** Blocking code удерживает поток выполнения, пока операция не завершится. В JavaScript это особенно важно, потому что основной поток выполняет и код, и обработку событий. Долгие синхронные вычисления или sync I/O блокируют UI в браузере или event loop в Node.js.

- Why are setTimeout and setInterval needed?

  **Ответ:** `setTimeout` планирует выполнение функции один раз после задержки. `setInterval` запускает функцию повторно с заданным интервалом. Они не гарантируют точное время выполнения, потому что callback попадет в очередь и выполнится только когда call stack освободится.

- How can timeouts and intervals be cleared?

  **Ответ:** `setTimeout` возвращает id таймера, который можно отменить через `clearTimeout`. `setInterval` отменяется через `clearInterval`.

  ```js
  const timeoutId = setTimeout(save, 1000);
  clearTimeout(timeoutId);

  const intervalId = setInterval(poll, 5000);
  clearInterval(intervalId);
  ```

- What is the event loop?

  **Ответ:** Event loop координирует выполнение синхронного кода, очередей задач и микрозадач. Пока call stack занят, callbacks не выполняются. После освобождения stack event loop берет задачи из очередей, при этом microtasks обычно выполняются до следующей macrotask.

- How does setTimeout(() => {}, 0) work?

  **Ответ:** `setTimeout(fn, 0)` не выполняет callback немедленно. Он ставит callback в очередь timers/macrotasks с минимальной задержкой. Функция выполнится после завершения текущего call stack и после microtasks.

  ```js
  setTimeout(() => console.log('timeout'), 0);
  Promise.resolve().then(() => console.log('promise'));
  console.log('sync');
  // sync, promise, timeout
  ```

- What is the difference between macro tasks and micro tasks?

  **Ответ:** Macrotasks — крупные задачи вроде timers, I/O callbacks, UI events. Microtasks — более приоритетная очередь для promise reactions, `queueMicrotask` и mutation observers. После каждой macrotask движок обычно очищает очередь microtasks перед следующей macrotask.

- How does JavaScript concurrency work despite being single-threaded?

  **Ответ:** JavaScript-код обычно выполняется в одном потоке, но окружение браузера или Node.js выполняет I/O, timers и системные операции вне call stack. Когда операция завершается, callback или promise reaction ставится в очередь. Поэтому concurrency достигается через event loop и асинхронные API, а не через параллельное выполнение JS-кода в одном потоке.

- What is the difference between promises and callbacks?

  **Ответ:** Callback — функция, которую передают для вызова позже. Promise — объект, представляющий будущий результат. Promises лучше композируются через chaining, имеют единый механизм ошибок и позволяют использовать `async/await`.

- What states can a promise have?

  **Ответ:** Promise имеет три состояния: `pending`, `fulfilled` и `rejected`. После перехода в `fulfilled` или `rejected` состояние считается settled и больше не меняется.

- How does error handling work with promises?

  **Ответ:** Ошибки в promise chain обрабатываются через `.catch()` или второй аргумент `.then()`. Если внутри `.then()` выбросить ошибку или вернуть rejected promise, следующий `.catch()` ее поймает.

  ```js
  fetchUser()
    .then(validateUser)
    .catch((error) => {
      console.error(error);
    });
  ```

- How does promise chaining work?

  **Ответ:** Каждый `.then()` возвращает новый promise. Если callback возвращает обычное значение, следующий `.then()` получает это значение. Если callback возвращает promise, цепочка ждет его завершения. Если возникает ошибка, управление переходит к ближайшему error handler.

- What does "falling through promises" mean?

  **Ответ:** Обычно под этим понимают потерю значения или ошибки в promise chain из-за отсутствующего `return` или неправильного обработчика. Если внутри `.then()` запустить async-операцию и не вернуть ее promise, следующая часть цепочки не будет ждать результат.

  ```js
  doFirst()
    .then(() => {
      doSecond(); // ошибка: promise не возвращен
    })
    .then(() => {
      // выполнится до завершения doSecond()
    });
  ```

- How can custom promises be created?

  **Ответ:** Promise создается через `new Promise((resolve, reject) => { ... })`. Внутри executor нужно вызвать `resolve(value)` при успехе или `reject(error)` при ошибке. Важно не смешивать лишний `new Promise` с API, который уже возвращает promise.

  ```js
  const wait = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  ```

- How does finally() work in promises?

  **Ответ:** `.finally()` выполняет callback после fulfillment или rejection. Он удобен для cleanup: сброс loading state, закрытие ресурсов, остановка индикатора. Если `finally` не выбросит ошибку и не вернет rejected promise, исходное значение или ошибка проходят дальше.

- How can then() be used for error handling?

  **Ответ:** `.then(onFulfilled, onRejected)` может принимать второй callback для обработки rejection. Но `.catch()` часто читается лучше, особенно для обработки ошибок всей цепочки.

  ```js
  promise.then(
    (value) => value,
    (error) => recover(error)
  );
  ```

- How does Promise.all() work?

  **Ответ:** `Promise.all()` принимает iterable promises/values и возвращает promise, который выполняется массивом результатов, когда все входные promises fulfilled. Если любой promise rejected, итоговый promise сразу rejected с этой причиной.

  ```js
  const [user, orders] = await Promise.all([
    fetchUser(),
    fetchOrders()
  ]);
  ```

- How could Promise.all() be implemented as a polyfill?

  **Ответ:** Нужно сохранить порядок результатов, обернуть каждое значение через `Promise.resolve`, считать fulfilled promises и reject при первой ошибке.

  ```js
  function promiseAll(items) {
    return new Promise((resolve, reject) => {
      const values = Array.from(items);
      const results = [];
      let completed = 0;

      if (values.length === 0) {
        resolve([]);
        return;
      }

      values.forEach((value, index) => {
        Promise.resolve(value)
          .then((result) => {
            results[index] = result;
            completed += 1;

            if (completed === values.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }
  ```

- How does Promise.race() work?

  **Ответ:** `Promise.race()` возвращает promise, который settles так же, как первый settled входной promise: fulfilled или rejected. Остальные promises не отменяются автоматически, они просто больше не влияют на результат race.

- How does Promise.allSettled() work?

  **Ответ:** `Promise.allSettled()` ждет завершения всех promises и возвращает массив объектов со статусом каждого: `{ status: 'fulfilled', value }` или `{ status: 'rejected', reason }`. Он не rejected из-за отдельной ошибки.

- How do async functions work?

  **Ответ:** `async function` всегда возвращает promise. Возвращаемое значение становится fulfilled value, а выброшенная ошибка становится rejection. Внутри можно использовать `await`, чтобы приостановить выполнение функции до settled promise.

  ```js
  async function loadUser() {
    const response = await fetch('/api/user');
    return response.json();
  }
  ```

- How does error handling work with async/await?

  **Ответ:** Ошибки от awaited promises обрабатываются через `try/catch`. Это делает асинхронный код похожим на синхронный, но нужно помнить, что ошибка становится rejection возвращаемого promise.

  ```js
  async function submit() {
    try {
      await save();
    } catch (error) {
      console.error(error);
    }
  }
  ```

- How can promise-based code be rewritten using async/await?

  **Ответ:** `.then()`-цепочку можно заменить последовательными `await`. Если операции независимы, важно не делать их случайно последовательными: лучше запускать их вместе и ждать через `Promise.all()`.

  ```js
  const userPromise = fetchUser();
  const ordersPromise = fetchOrders();
  const [user, orders] = await Promise.all([userPromise, ordersPromise]);
  ```

- How do async class methods work?

  **Ответ:** Async method в классе — обычный метод, который возвращает promise. Внутри метода доступен `this`, как в обычном class method, и можно использовать `await`.

  ```js
  class UserService {
    async findById(id) {
      return this.http.get(`/users/${id}`);
    }
  }
  ```

- How does async/await work under the hood?

  **Ответ:** `async/await` — синтаксическая абстракция над promises. После `await` продолжение функции планируется как microtask после settlement promise. Концептуально это похоже на разбиение функции на цепочку `.then()`, но с более читаемым синтаксисом.

- How could functionality similar to Promise.all() and Promise.race() be implemented manually?

  **Ответ:** Для `all` нужно собрать результаты всех operations и resolve после последней успешной. Для `race` нужно resolve или reject при первом settled результате. В обоих случаях входные значения стоит оборачивать в `Promise.resolve()`.

  ```js
  function promiseRace(items) {
    return new Promise((resolve, reject) => {
      for (const item of items) {
        Promise.resolve(item).then(resolve, reject);
      }
    });
  }
  ```

- How do generators work in JavaScript?

  **Ответ:** Generator function объявляется через `function*` и возвращает generator object. Выполнение функции приостанавливается на `yield`, а затем продолжается при вызове `.next()`. Генераторы удобны для lazy sequences, iterators и управления пошаговым выполнением.

  ```js
  function* ids() {
    yield 1;
    yield 2;
  }
  ```

- How does generator composition work?

  **Ответ:** Generator composition выполняется через `yield*`, который делегирует итерацию другому iterable или generator. Это позволяет собирать генераторы из маленьких частей.

  ```js
  function* first() {
    yield 1;
    yield 2;
  }

  function* second() {
    yield* first();
    yield 3;
  }
  ```

- How do next() and yield exchange values?

  **Ответ:** `yield` отдает значение наружу и приостанавливает генератор. Следующий вызов `.next(value)` передает `value` обратно в генератор как результат текущего `yield`. Первый аргумент первого `.next()` обычно игнорируется, потому что генератор еще не дошел до `yield`.

  ```js
  function* flow() {
    const value = yield 'ready';
    yield value * 2;
  }

  const gen = flow();
  gen.next(); // { value: 'ready', done: false }
  gen.next(5); // { value: 10, done: false }
  ```

- What are iterators?

  **Ответ:** Iterator — объект с методом `next()`, который возвращает `{ value, done }`. Если объект также имеет `[Symbol.iterator]()` и возвращает сам себя, он является iterable iterator и может использоваться в `for...of`.

- What are async generators?

  **Ответ:** Async generator объявляется через `async function*`. Он может использовать и `await`, и `yield`, возвращая async iterable. Его значения читаются через `for await...of`.

  ```js
  async function* readPages() {
    yield await fetchPage(1);
    yield await fetchPage(2);
  }
  ```

- What are async iterators?

  **Ответ:** Async iterator — объект с методом `next()`, который возвращает promise с результатом `{ value, done }`. Async iterable реализует `[Symbol.asyncIterator]()`. Такие объекты используются для потоков данных, paginated API, файловых потоков и событий, которые приходят асинхронно.

  ```js
  for await (const page of readPages()) {
    console.log(page);
  }
  ```
