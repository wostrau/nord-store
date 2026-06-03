# Algorithms Matrix: вопросы, конспект и live-coding

> Цель файла — собрать собственный конспект по базовым алгоритмам и структурам данных, а также использовать его как матрицу подготовки к live-coding. Это не дословный пересказ книги, а рабочие заметки, объяснения и практические шаблоны.

## Как пользоваться матрицей

- Для каждого вопроса добавлять понятный ответ своими словами.
- После теории добавлять минимум один пример на JavaScript.
- Для live-coding задач фиксировать идею решения, сложность, граничные случаи и типичный шаблон кода.

## Базовая сложность и Big O

- What is an algorithm?

  **Ответ:** Алгоритм — это конечная последовательность шагов, которая преобразует входные данные в результат. В программировании алгоритм важен не только тем, что он "работает", но и тем, насколько предсказуемо он работает при росте входных данных.

  Например, чтобы найти число в массиве, можно проверить каждый элемент подряд. Это алгоритм линейного поиска. Он простой, но на большом массиве может быть медленным.

  ```js
  function contains(numbers, target) {
    for (const number of numbers) {
      if (number === target) {
        return true;
      }
    }

    return false;
  }
  ```

- What is Big O notation?

  **Ответ:** Big O описывает, как растет количество операций алгоритма при увеличении размера входа. Это не точное время в миллисекундах, а модель роста: насколько быстро алгоритм становится тяжелее, если данных становится больше.

  Если массив увеличился с 10 элементов до 1 000 000, нам важно понимать, будет ли алгоритм делать примерно 1 000 000 операций, `log n` операций или `n²` операций.

  ```js
  function getFirst(items) {
    return items[0]; // O(1)
  }

  function printAll(items) {
    for (const item of items) {
      console.log(item); // O(n)
    }
  }
  ```

- What is the difference between O(1), O(log n), O(n), O(n log n), O(n²), and O(2ⁿ)?

  **Ответ:** Эти классы сложности показывают разные темпы роста:

  - `O(1)` — константное время. Количество операций не зависит от размера входа.
  - `O(log n)` — логарифмическое время. На каждом шаге область поиска резко уменьшается, обычно вдвое.
  - `O(n)` — линейное время. Нужно пройти по данным один раз.
  - `O(n log n)` — типичная сложность эффективных сортировок.
  - `O(n²)` — квадратичное время. Часто появляется при двух вложенных циклах.
  - `O(2ⁿ)` — экспоненциальное время. Часто появляется при переборе всех подмножеств или наивной рекурсии.

  ```js
  // O(n²): сравниваем каждую пару
  function hasDuplicateSlow(items) {
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        if (items[i] === items[j]) {
          return true;
        }
      }
    }

    return false;
  }
  ```

- Why do we usually ignore constants in Big O?

  **Ответ:** Big O фокусируется на главном факторе роста. Если один алгоритм делает `2n + 10` операций, а другой `n`, оба считаются `O(n)`, потому что при очень большом `n` линейный рост остается линейным.

  Константы важны в реальной оптимизации, но при выборе алгоритма чаще важнее класс роста. `O(n log n)` почти всегда лучше `O(n²)` на больших данных, даже если у первого больше постоянные накладные расходы.

  ```js
  // Формально два прохода: O(2n), но в Big O это O(n)
  function sumAndCountPositive(numbers) {
    let sum = 0;
    let positives = 0;

    for (const number of numbers) sum += number;
    for (const number of numbers) if (number > 0) positives += 1;

    return { sum, positives };
  }
  ```

- How do time complexity and space complexity differ?

  **Ответ:** Time complexity описывает рост количества операций. Space complexity описывает рост дополнительной памяти. Иногда мы ускоряем алгоритм за счет памяти, например используем `Set` или `Map`, чтобы быстрее находить значения.

  Пример: проверка дубликатов через два цикла использует `O(1)` дополнительной памяти, но работает за `O(n²)`. Через `Set` — `O(n)` по времени и `O(n)` по памяти.

  ```js
  function hasDuplicateFast(items) {
    const seen = new Set();

    for (const item of items) {
      if (seen.has(item)) return true;
      seen.add(item);
    }

    return false;
  }
  ```

- How can we estimate algorithm complexity from loops, recursion, and nested operations?

  **Ответ:** Для циклов смотрим, сколько раз они выполняются относительно размера входа. Один цикл по массиву — `O(n)`. Два независимых цикла подряд — тоже `O(n)`. Два вложенных цикла по одному массиву — обычно `O(n²)`.

  Для рекурсии важно понять, сколько вызовов создается и как уменьшается задача. Если каждый вызов делит задачу пополам — часто `O(log n)`. Если каждый вызов порождает два вызова и пересчитывает одни и те же состояния — может быть `O(2ⁿ)`.

  ```js
  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1); // n вызовов => O(n)
  }
  ```

## Search

- How does linear search work?

  **Ответ:** Линейный поиск проверяет элементы один за другим, пока не найдет нужный или пока не закончится массив. Он работает на любых данных, не требует сортировки и прост в реализации.

  Сложность: `O(n)` по времени, `O(1)` по дополнительной памяти.

  ```js
  function linearSearch(items, target) {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === target) {
        return i;
      }
    }

    return -1;
  }
  ```

- How does binary search work?

  **Ответ:** Бинарный поиск работает на отсортированном массиве. Мы смотрим на середину: если значение равно target — нашли; если target меньше — ищем в левой половине; если больше — в правой. На каждом шаге область поиска уменьшается вдвое.

  Сложность: `O(log n)` по времени, `O(1)` по памяти в итеративной версии.

  ```js
  function binarySearch(sortedNumbers, target) {
    let left = 0;
    let right = sortedNumbers.length - 1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (sortedNumbers[mid] === target) return mid;
      if (sortedNumbers[mid] < target) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  }
  ```

  Интуиция по границам:

  - `left` — левая граница области, где target еще может находиться.
  - `right` — правая граница области, где target еще может находиться.
  - `mid` — проверяемая середина.
  - Если `sortedNumbers[mid] < target`, то все элементы слева от `mid` и сам `mid` уже не подходят, поэтому `left = mid + 1`.
  - Если `sortedNumbers[mid] > target`, то все элементы справа от `mid` и сам `mid` уже не подходят, поэтому `right = mid - 1`.

  Пример для `[1, 3, 5, 7, 9]`, target `7`:

  ```txt
  left = 0, right = 4, mid = 2, value = 5
  5 < 7, значит ищем справа: left = 3

  left = 3, right = 4, mid = 3, value = 7
  нашли target
  ```

- How can binary search find the first or last occurrence with duplicates?

  **Ответ:** Если в массиве есть дубликаты, обычный binary search может вернуть любой индекс target. Чтобы найти первую позицию, при совпадении не останавливаемся, а продолжаем искать левее. Чтобы найти последнюю — продолжаем искать правее.

  Первая позиция target:

  ```js
  function firstOccurrence(sortedNumbers, target) {
    let left = 0;
    let right = sortedNumbers.length - 1;
    let answer = -1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (sortedNumbers[mid] === target) {
        answer = mid;
        right = mid - 1;
      } else if (sortedNumbers[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return answer;
  }
  ```

  Последняя позиция target:

  ```js
  function lastOccurrence(sortedNumbers, target) {
    let left = 0;
    let right = sortedNumbers.length - 1;
    let answer = -1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (sortedNumbers[mid] === target) {
        answer = mid;
        left = mid + 1;
      } else if (sortedNumbers[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return answer;
  }
  ```

  Пример:

  ```js
  const numbers = [1, 2, 2, 2, 5, 8];

  console.log(firstOccurrence(numbers, 2)); // 1
  console.log(lastOccurrence(numbers, 2)); // 3
  ```

- What conditions must be true before binary search can be used?

  **Ответ:** Главное условие — пространство поиска должно быть упорядоченным или монотонным. Для массива это обычно сортировка. Для "binary search on answer" это монотонный predicate: если ответ `x` подходит, то все большие или все меньшие значения тоже подходят.

  Бинарный поиск нельзя применять к произвольному неотсортированному массиву. Если массив нужно сначала сортировать, цена сортировки будет `O(n log n)`, и это нужно учитывать.

  ```js
  const numbers = [1, 3, 7, 10, 15];
  console.log(binarySearch(numbers, 10)); // 3
  ```

- What are common binary search mistakes in live-coding?

  **Ответ:** Частые ошибки: неверное условие цикла (`<` вместо `<=`), неправильное обновление границ, бесконечный цикл, потеря последнего элемента, overflow в языках с fixed integer, непонимание что возвращать, если элемента нет.

  В JavaScript overflow индекса почти не проблема на обычных массивах, но привычка писать `left + (right - left) / 2` полезна.

  ```js
  function lowerBound(sortedNumbers, target) {
    let left = 0;
    let right = sortedNumbers.length;

    while (left < right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (sortedNumbers[mid] < target) left = mid + 1;
      else right = mid;
    }

    return left; // первая позиция, где value >= target
  }
  ```

- How can binary search be used not only on arrays, but also on an answer range?

  **Ответ:** Иногда мы ищем не элемент массива, а минимальное или максимальное значение, удовлетворяющее условию. Например, минимальную скорость, чтобы выполнить работу за `h` часов. Если при скорости `x` задача выполнима, то при большей скорости она тоже выполнима. Это монотонность.

  ```js
  function minEatingSpeed(piles, hours) {
    let left = 1;
    let right = Math.max(...piles);

    const canFinish = (speed) => {
      let neededHours = 0;
      for (const pile of piles) {
        neededHours += Math.ceil(pile / speed);
      }
      return neededHours <= hours;
    };

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (canFinish(mid)) right = mid;
      else left = mid + 1;
    }

    return left;
  }
  ```

## Arrays, Linked Lists, Stacks, and Queues

- How do arrays work internally?

  **Ответ:** В классической модели массив — это последовательный блок памяти, где доступ по индексу работает за `O(1)`: адрес элемента вычисляется как `start + index * elementSize`. В JavaScript массивы более сложные: движок может хранить их оптимизированно как плотные массивы или как sparse/object-like структуру.

  Практически для live-coding важно: чтение по индексу быстрое, `push`/`pop` обычно быстрые, а `shift`/`unshift` часто дорогие, потому что элементы нужно сдвигать.

  ```js
  const items = [10, 20, 30];
  console.log(items[1]); // O(1)
  items.push(40); // обычно O(1)
  items.shift(); // O(n)
  ```

- What are the tradeoffs between arrays and linked lists?

  **Ответ:** Массивы дают быстрый доступ по индексу, но вставка/удаление в середине требует сдвигов. Linked list хранит элементы как узлы со ссылками, поэтому вставка после известного узла может быть `O(1)`, но доступ к `i`-му элементу требует прохода `O(n)`.

  В JavaScript linked list редко пишут в production, но на собеседованиях это частая структура для проверки работы со ссылками.

  ```js
  class ListNode {
    constructor(value, next = null) {
      this.value = value;
      this.next = next;
    }
  }

  const head = new ListNode(1, new ListNode(2, new ListNode(3)));
  ```

- What is a stack and where is it used?

  **Ответ:** Stack — структура данных LIFO: last in, first out. Последний добавленный элемент извлекается первым. Стек используется в call stack, undo/redo, парсинге скобок, DFS, обработке вложенных структур.

  ```js
  const stack = [];
  stack.push('first');
  stack.push('second');
  console.log(stack.pop()); // second
  ```

- What is a queue and where is it used?

  **Ответ:** Queue — структура FIFO: first in, first out. Первый добавленный элемент извлекается первым. Очередь используется в BFS, планировщиках задач, очередях сообщений, обработке запросов.

  В JavaScript не стоит часто использовать `shift()` на больших очередях. Лучше хранить индекс головы.

  ```js
  class Queue {
    constructor() {
      this.items = [];
      this.head = 0;
    }

    enqueue(value) {
      this.items.push(value);
    }

    dequeue() {
      if (this.head >= this.items.length) return undefined;
      const value = this.items[this.head];
      this.head += 1;
      return value;
    }

    get length() {
      return this.items.length - this.head;
    }
  }
  ```

- What is a deque and when is it useful?

  **Ответ:** Deque — double-ended queue, очередь с добавлением и удалением с обоих концов. Она полезна в sliding window maximum, monotonic queue, задачах с BFS, где иногда нужно добавлять элементы в начало, например 0-1 BFS.

  В JS для учебных задач можно использовать массив и индексы, но для производительных реализаций лучше писать специальную структуру.

  ```js
  class Deque {
    constructor() {
      this.items = {};
      this.left = 0;
      this.right = 0;
    }

    pushBack(value) {
      this.items[this.right] = value;
      this.right += 1;
    }

    popFront() {
      if (this.left === this.right) return undefined;
      const value = this.items[this.left];
      delete this.items[this.left];
      this.left += 1;
      return value;
    }
  }
  ```

- How can stacks and queues be implemented in JavaScript?

  **Ответ:** Стек в JS удобно реализовать обычным массивом через `push` и `pop`. Очередь тоже можно хранить в массиве, но не через `shift` на больших данных, а через pointer `head`.

  ```js
  const stack = [];
  stack.push(1);
  stack.push(2);
  stack.pop();

  const queue = [];
  let head = 0;
  queue.push(1);
  queue.push(2);
  const first = queue[head];
  head += 1;
  ```

## Recursion

- What is recursion?

  **Ответ:** Recursion — прием, когда функция вызывает саму себя для решения меньшей версии той же задачи. Рекурсия хорошо подходит для деревьев, графов, divide and conquer, backtracking.

  ```js
  function sum(numbers, index = 0) {
    if (index === numbers.length) return 0;
    return numbers[index] + sum(numbers, index + 1);
  }
  ```

- What are base case and recursive case?

  **Ответ:** Base case — условие остановки рекурсии. Recursive case — шаг, который уменьшает задачу и вызывает функцию снова. Без base case рекурсия будет бесконечной до stack overflow.

  ```js
  function factorial(n) {
    if (n <= 1) return 1; // base case
    return n * factorial(n - 1); // recursive case
  }
  ```

- How does the call stack work during recursion?

  **Ответ:** Каждый вызов функции помещается в call stack со своими локальными переменными и параметрами. Когда функция возвращает значение, ее frame удаляется со стека. При рекурсии создается цепочка frames.

  Для `factorial(3)` стек примерно такой: `factorial(3)` ждет `factorial(2)`, тот ждет `factorial(1)`, затем значения возвращаются обратно.

  ```js
  factorial(3);
  // 3 * factorial(2)
  // 3 * 2 * factorial(1)
  // 3 * 2 * 1
  ```

- What is stack overflow and how can it happen?

  **Ответ:** Stack overflow происходит, когда call stack переполняется из-за слишком глубокой или бесконечной рекурсии. В JavaScript лимит стека зависит от движка и окружения.

  ```js
  function broken() {
    return broken();
  }

  // broken(); // RangeError: Maximum call stack size exceeded
  ```

- When should recursion be replaced with iteration?

  **Ответ:** Рекурсию стоит заменить итерацией, если глубина может быть большой, если есть риск stack overflow или если итеративный код проще и дешевле по памяти. Например, обход длинного linked list безопаснее делать циклом.

  ```js
  function sumIterative(numbers) {
    let total = 0;

    for (const number of numbers) {
      total += number;
    }

    return total;
  }
  ```

## Hash Tables

- What is a hash table?

  **Ответ:** Hash table — структура данных, которая хранит пары key-value и позволяет быстро находить значение по ключу. В JavaScript ближайшие структуры — `Map`, `Set` и plain object.

  ```js
  const prices = new Map();
  prices.set('hoodie', 49);
  prices.set('cap', 19);

  console.log(prices.get('hoodie')); // 49
  ```

- How does hashing work conceptually?

  **Ответ:** Hash function преобразует ключ в число, а это число используется для выбора bucket/index внутри таблицы. Хорошая hash function равномерно распределяет ключи, чтобы разные ключи реже попадали в одно место.

  В JS мы обычно не пишем hash function вручную для `Map`, но концептуально процесс такой:

  ```js
  function simpleHash(key, bucketCount) {
    let hash = 0;
    for (const char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % bucketCount;
  }
  ```

- What are hash collisions?

  **Ответ:** Collision — ситуация, когда два разных ключа попадают в один bucket. Это нормально и неизбежно, потому что количество возможных ключей больше количества buckets. Hash table должна уметь хранить несколько значений в одном bucket или искать другое место.

  Типичные стратегии: chaining, open addressing, probing. Важно, что большое количество collision ухудшает производительность.

- Why are hash table operations usually O(1)?

  **Ответ:** В среднем hash table быстро вычисляет bucket по ключу и сразу переходит к нужному месту. Поэтому `get`, `set`, `has`, `delete` обычно считаются `O(1)`.

  Но это средний случай. В худшем случае, если много collision, операции могут деградировать до `O(n)`. Хорошие реализации и resize таблицы помогают сохранять среднюю эффективность.

  ```js
  function countFrequencies(items) {
    const freq = new Map();

    for (const item of items) {
      freq.set(item, (freq.get(item) ?? 0) + 1);
    }

    return freq;
  }
  ```

- What is the difference between JavaScript Object, Map, Set, and WeakMap?

  **Ответ:** `Object` хранит string/symbol keys и подходит для простых records. `Map` хранит ключи любого типа, сохраняет порядок вставки и удобен для алгоритмов. `Set` хранит уникальные значения. `WeakMap` принимает только object keys и не мешает garbage collection, поэтому полезен для metadata/cache по объектам.

  ```js
  const object = { role: 'admin' };

  const map = new Map();
  map.set(object, 'metadata');

  const set = new Set([1, 2, 2, 3]);
  console.log([...set]); // [1, 2, 3]
  ```

- What live-coding problems are commonly solved with hash maps?

  **Ответ:** Hash maps часто применяются для задач "быстро найти уже увиденное": Two Sum, поиск дубликатов, частоты элементов, group anagrams, longest consecutive sequence, subarray sum equals k.

  ```js
  function twoSum(numbers, target) {
    const indexByValue = new Map();

    for (let i = 0; i < numbers.length; i += 1) {
      const need = target - numbers[i];
      if (indexByValue.has(need)) {
        return [indexByValue.get(need), i];
      }
      indexByValue.set(numbers[i], i);
    }

    return [];
  }
  ```

  `Subarray sum equals k` решается похожей идеей, но вместо уже увиденных чисел мы храним уже увиденные prefix sums. Prefix sum — это сумма всех элементов от начала массива до текущей позиции. Если текущая сумма равна `currentSum`, то нам нужен предыдущий prefix sum `currentSum - k`. Тогда сумма элементов между тем предыдущим индексом и текущим индексом будет ровно `k`.

  Важно хранить не просто наличие prefix sum, а количество таких prefix sums, потому что одинаковая сумма может встретиться несколько раз.

  ```js
  function subarraySumEqualsK(numbers, k) {
    const prefixCount = new Map();
    prefixCount.set(0, 1);

    let currentSum = 0;
    let result = 0;

    for (const number of numbers) {
      currentSum += number;

      const neededPrefix = currentSum - k;
      result += prefixCount.get(neededPrefix) ?? 0;

      prefixCount.set(currentSum, (prefixCount.get(currentSum) ?? 0) + 1);
    }

    return result;
  }

  console.log(subarraySumEqualsK([1, 2, 3], 3)); // 2: [1, 2] and [3]
  console.log(subarraySumEqualsK([1, -1, 0], 0)); // 3: [1, -1], [0], [1, -1, 0]
  ```

  Сложность: `O(n)` по времени и `O(n)` по памяти. Это лучше, чем brute force `O(n²)`, где мы проверяем сумму каждого возможного подмассива.

## Sorting

- How does selection sort work?

  **Ответ:** Selection sort на каждом шаге ищет минимальный элемент в неотсортированной части массива и ставит его в начало этой части. Алгоритм простой, но медленный на больших данных.

  Сложность: `O(n²)` по времени, `O(1)` по дополнительной памяти.

  ```js
  function selectionSort(numbers) {
    const result = [...numbers];

    for (let i = 0; i < result.length; i += 1) {
      let minIndex = i;

      for (let j = i + 1; j < result.length; j += 1) {
        if (result[j] < result[minIndex]) {
          minIndex = j;
        }
      }

      [result[i], result[minIndex]] = [result[minIndex], result[i]];
    }

    return result;
  }
  ```

- How does quicksort work?

  **Ответ:** Quicksort выбирает pivot, делит массив на элементы меньше pivot и больше pivot, затем рекурсивно сортирует части. Это divide and conquer: разделить задачу, решить подзадачи, объединить результат.

  ```js
  function quickSort(numbers) {
    if (numbers.length <= 1) return numbers;

    const pivot = numbers[Math.floor(numbers.length / 2)];
    const less = [];
    const equal = [];
    const greater = [];

    for (const number of numbers) {
      if (number < pivot) less.push(number);
      else if (number > pivot) greater.push(number);
      else equal.push(number);
    }

    return [...quickSort(less), ...equal, ...quickSort(greater)];
  }
  ```

- What is the role of the pivot in quicksort?

  **Ответ:** Pivot — элемент, относительно которого массив разделяется на части. Хороший pivot делает части примерно равными, и quicksort работает быстро. Плохой pivot, например всегда минимальный или максимальный, может привести к глубокой рекурсии и `O(n²)`.

  Практически pivot часто выбирают случайно, из середины или медиану из трех значений.

  ```js
  function choosePivotIndex(left, right) {
    return Math.floor(left + Math.random() * (right - left + 1));
  }
  ```

- What are best, average, and worst cases for quicksort?

  **Ответ:** Best и average case: `O(n log n)`, когда partition делит массив примерно пополам. Worst case: `O(n²)`, когда partition каждый раз отделяет только один элемент. Space complexity зависит от реализации: functional version создает новые массивы, in-place version использует стек рекурсии.

  Для live-coding проще писать functional quicksort, но важно понимать, что он тратит больше памяти.

- How does merge sort work?

  **Ответ:** Merge sort делит массив пополам до одиночных элементов, затем сливает отсортированные половины. Он стабильно работает за `O(n log n)` независимо от входа, но требует `O(n)` дополнительной памяти.

  ```js
  function mergeSort(numbers) {
    if (numbers.length <= 1) return numbers;

    const mid = Math.floor(numbers.length / 2);
    const left = mergeSort(numbers.slice(0, mid));
    const right = mergeSort(numbers.slice(mid));

    return merge(left, right);
  }

  function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }

    return result.concat(left.slice(i), right.slice(j));
  }
  ```

- When should we use built-in sorting instead of implementing a sort manually?

  **Ответ:** В production почти всегда стоит использовать встроенную сортировку, потому что она оптимизирована движком, хорошо протестирована и проще читается. Реализовывать сортировки вручную нужно для обучения, собеседований или если требуется специфический алгоритм.

  В JavaScript важно передавать comparator для чисел, иначе сортировка будет строковой.

  ```js
  const numbers = [10, 2, 30];
  numbers.sort((a, b) => a - b);
  console.log(numbers); // [2, 10, 30]
  ```

## Divide and Conquer

- What is divide and conquer?

  **Ответ:** Divide and conquer — подход, где задача делится на меньшие подзадачи того же типа, подзадачи решаются независимо, а результаты объединяются. Классические примеры: binary search, quicksort, merge sort.

  Шаблон: base case, divide, solve, combine.

  ```js
  function sumDivideAndConquer(numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return numbers[0];

    const mid = Math.floor(numbers.length / 2);
    return (
      sumDivideAndConquer(numbers.slice(0, mid)) +
      sumDivideAndConquer(numbers.slice(mid))
    );
  }
  ```

- How is divide and conquer used in binary search, quicksort, and merge sort?

  **Ответ:** В binary search мы выбираем половину и отбрасываем вторую. В quicksort мы делим массив по pivot и сортируем части. В merge sort делим массив пополам, сортируем части и сливаем.

  Главное отличие: binary search не решает обе подзадачи, а выбирает одну. Quicksort и merge sort обычно решают обе части.

- What questions should we ask when trying to solve a problem with divide and conquer?

  **Ответ:** Нужно спросить: можно ли разбить задачу на независимые меньшие задачи? Какой base case? Как объединить результаты? Уменьшается ли размер задачи? Не пересчитываются ли одни и те же подзадачи?

  Если подзадачи пересекаются, это уже может быть dynamic programming, а не чистый divide and conquer.

## Graphs

- What is a graph?

  **Ответ:** Graph — структура из вершин и связей между ними. Графы моделируют сети: пользователей и подписки, города и дороги, страницы и ссылки, сервисы и зависимости.

  ```js
  const graph = {
    alice: ['bob', 'claire'],
    bob: ['anuj', 'peggy'],
    claire: ['thom', 'jonny']
  };
  ```

- What are nodes and edges?

  **Ответ:** Node или vertex — объект графа. Edge — связь между двумя nodes. Например, в социальной сети user — node, friendship/follow — edge. В карте город — node, дорога — edge.

- What is the difference between directed and undirected graphs?

  **Ответ:** В directed graph ребро имеет направление: `A -> B` не означает `B -> A`. Например, подписка в соцсети. В undirected graph связь двусторонняя: если `A` связан с `B`, то `B` связан с `A`. Например, дружба или дорога в обе стороны.

  ```js
  const directed = { a: ['b'], b: [] };
  const undirected = { a: ['b'], b: ['a'] };
  ```

- What is the difference between weighted and unweighted graphs?

  **Ответ:** В unweighted graph все ребра считаются равными. В weighted graph у ребер есть стоимость: расстояние, цена, время, latency. BFS хорошо ищет кратчайший путь по количеству ребер в unweighted graph. Для weighted graph обычно нужен Dijkstra или другой алгоритм.

  ```js
  const weightedGraph = {
    a: [{ node: 'b', weight: 5 }, { node: 'c', weight: 2 }],
    b: [{ node: 'd', weight: 1 }],
    c: [{ node: 'd', weight: 7 }]
  };
  ```

- How can graphs be represented with adjacency lists and adjacency matrices?

  **Ответ:** Adjacency list хранит для каждой вершины список соседей. Это удобно для sparse graphs, где связей не очень много. Adjacency matrix хранит таблицу `n x n`, где значение показывает наличие или вес ребра. Matrix быстрее проверяет наличие конкретного ребра, но требует `O(n²)` памяти.

  ```js
  const adjacencyList = {
    0: [1, 2],
    1: [0, 3],
    2: [0],
    3: [1]
  };

  const adjacencyMatrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 0],
    [0, 1, 0, 0]
  ];
  ```

- How does breadth-first search work?

  **Ответ:** BFS обходит граф слоями: сначала стартовая вершина, потом все соседи, потом соседи соседей. Для этого используется очередь. BFS на unweighted graph находит кратчайший путь по количеству ребер.

  ```js
  function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    let head = 0;
    const order = [];

    while (head < queue.length) {
      const node = queue[head++];
      order.push(node);

      for (const neighbor of graph[node] ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return order;
  }
  ```

- How does depth-first search work?

  **Ответ:** DFS идет в глубину: выбирает соседа, затем соседа соседа, пока не упрется в конец, после чего возвращается назад. DFS можно реализовать рекурсией или стеком. Он полезен для обхода деревьев, поиска connected components, cycle detection, backtracking.

  ```js
  function dfs(graph, start, visited = new Set(), order = []) {
    if (visited.has(start)) return order;

    visited.add(start);
    order.push(start);

    for (const neighbor of graph[start] ?? []) {
      dfs(graph, neighbor, visited, order);
    }

    return order;
  }
  ```

- When should BFS be used instead of DFS?

  **Ответ:** BFS выбирают, когда нужен кратчайший путь в unweighted graph, минимальное количество шагов или обход по уровням. DFS выбирают, когда нужно исследовать все варианты, проверить достижимость, пройти дерево, найти компоненты или выполнить backtracking.

  Пример BFS-задач: shortest path in maze, minimum moves, level order traversal.

- How can graph traversal avoid infinite loops?

  **Ответ:** В графе могут быть циклы, поэтому нужно хранить `visited`. В BFS обычно добавляют вершину в `visited` в момент постановки в очередь, чтобы не поставить ее много раз. В DFS — при входе в вершину.

  ```js
  function hasPath(graph, start, target) {
    const visited = new Set();
    const stack = [start];

    while (stack.length > 0) {
      const node = stack.pop();
      if (node === target) return true;
      if (visited.has(node)) continue;

      visited.add(node);
      for (const neighbor of graph[node] ?? []) {
        stack.push(neighbor);
      }
    }

    return false;
  }
  ```

## Shortest Path

- What problem does Dijkstra's algorithm solve?

  **Ответ:** Dijkstra ищет кратчайшие расстояния от стартовой вершины до остальных вершин в weighted graph с неотрицательными весами. Например, минимальное время доставки, кратчайший маршрут, минимальная стоимость переходов.

- Why does Dijkstra's algorithm require non-negative edge weights?

  **Ответ:** Dijkstra считает, что если вершина выбрана как текущая с минимальным известным расстоянием, то это расстояние уже окончательное. Negative edge может позже уменьшить путь к уже обработанной вершине, ломая это предположение.

  Для графов с отрицательными весами используют другие алгоритмы, например Bellman-Ford.

- How does a priority queue improve Dijkstra's algorithm?

  **Ответ:** На каждом шаге Dijkstra нужно брать вершину с минимальной текущей дистанцией. Если искать ее линейно, это дорого. Priority queue позволяет извлекать минимум за `O(log n)`, что ускоряет алгоритм на больших графах.

  ```js
  class MinHeap {
    constructor() {
      this.items = [];
    }

    push(item) {
      this.items.push(item);
      this.bubbleUp(this.items.length - 1);
    }

    pop() {
      if (this.items.length === 0) return undefined;
      const min = this.items[0];
      const last = this.items.pop();

      if (this.items.length > 0) {
        this.items[0] = last;
        this.bubbleDown(0);
      }

      return min;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.items[parent].priority <= this.items[index].priority) break;
        [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
        index = parent;
      }
    }

    bubbleDown(index) {
      while (true) {
        let smallest = index;
        const left = index * 2 + 1;
        const right = index * 2 + 2;

        if (left < this.items.length && this.items[left].priority < this.items[smallest].priority) {
          smallest = left;
        }

        if (right < this.items.length && this.items[right].priority < this.items[smallest].priority) {
          smallest = right;
        }

        if (smallest === index) break;
        [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
        index = smallest;
      }
    }

    get size() {
      return this.items.length;
    }
  }
  ```

- What is the difference between BFS shortest path and Dijkstra shortest path?

  **Ответ:** BFS подходит, когда все ребра имеют одинаковую стоимость. Он минимизирует количество ребер. Dijkstra подходит, когда ребра имеют разные неотрицательные веса. Он минимизирует сумму весов.

  Если веса все равны `1`, Dijkstra будет работать, но BFS проще и обычно быстрее.

  ```js
  function dijkstra(graph, start) {
    const distances = new Map([[start, 0]]);
    const heap = new MinHeap();
    heap.push({ value: start, priority: 0 });

    while (heap.size > 0) {
      const { value: node, priority: distance } = heap.pop();
      if (distance > distances.get(node)) continue;

      for (const edge of graph[node] ?? []) {
        const nextDistance = distance + edge.weight;
        if (nextDistance < (distances.get(edge.node) ?? Infinity)) {
          distances.set(edge.node, nextDistance);
          heap.push({ value: edge.node, priority: nextDistance });
        }
      }
    }

    return distances;
  }
  ```

## Greedy Algorithms

- What is a greedy algorithm?

  **Ответ:** Greedy algorithm на каждом шаге выбирает локально лучший вариант, надеясь получить глобально оптимальное решение. Например, взять ближайшее окончание интервала, самый большой номинал монеты или самый дешевый следующий переход.

  Greedy не всегда работает. Нужно доказать или хотя бы объяснить, почему локальный выбор не мешает оптимальному решению.

- When does a greedy approach work?

  **Ответ:** Greedy работает, когда задача имеет greedy-choice property: существует оптимальное решение, которое начинается с локально оптимального выбора. Также часто требуется optimal substructure: после выбора оставшаяся задача имеет тот же тип.

  Классический пример — выбор максимального количества непересекающихся интервалов по самому раннему окончанию.

  ```js
  function maxNonOverlappingIntervals(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);

    let count = 0;
    let currentEnd = -Infinity;

    for (const [start, end] of intervals) {
      if (start >= currentEnd) {
        count += 1;
        currentEnd = end;
      }
    }

    return count;
  }
  ```

- What is a counterexample and why is it important for greedy solutions?

  **Ответ:** Counterexample — входные данные, на которых предложенный greedy-выбор дает неправильный результат. Он помогает быстро проверить, не является ли решение слишком наивным.

  Например, для coin change greedy "берем самую большую монету" работает не для всех наборов монет. Для coins `[1, 3, 4]` и amount `6` greedy даст `4 + 1 + 1`, а оптимально `3 + 3`.

  ```js
  function greedyCoins(coins, amount) {
    coins.sort((a, b) => b - a);
    const result = [];

    for (const coin of coins) {
      while (amount >= coin) {
        result.push(coin);
        amount -= coin;
      }
    }

    return amount === 0 ? result : null;
  }
  ```

- What are typical greedy live-coding problems?

  **Ответ:** Частые greedy-задачи: interval scheduling, merge intervals, jump game, gas station, assign cookies, minimum arrows to burst balloons, task scheduling, stock buy/sell variants.

  Общий подход: отсортировать данные по правильному критерию, делать локальный выбор, обновлять текущее состояние и уметь объяснить, почему выбор корректен.

## Dynamic Programming

- What is dynamic programming?

  **Ответ:** Dynamic programming — подход для задач, где есть overlapping subproblems и optimal substructure. Мы не пересчитываем одинаковые подзадачи много раз, а сохраняем их ответы.

  Простой пример — Fibonacci. Наивная рекурсия пересчитывает одни и те же значения. DP сохраняет результаты.

  ```js
  function fib(n, memo = new Map()) {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n);

    const result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.set(n, result);
    return result;
  }
  ```

- What are overlapping subproblems?

  **Ответ:** Overlapping subproblems — ситуация, когда разные ветки решения снова и снова решают одну и ту же подзадачу. В Fibonacci `fib(5)` вызывает `fib(4)` и `fib(3)`, а `fib(4)` снова вызывает `fib(3)`.

  Если подзадачи не пересекаются, как в merge sort, это divide and conquer, но не DP.

- What is optimal substructure?

  **Ответ:** Optimal substructure означает, что оптимальный ответ задачи можно выразить через оптимальные ответы меньших задач. Например, минимальное число монет для amount `x` можно выразить через `min(dp[x - coin] + 1)`.

  ```js
  function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let current = 1; current <= amount; current += 1) {
      for (const coin of coins) {
        if (current >= coin) {
          dp[current] = Math.min(dp[current], dp[current - coin] + 1);
        }
      }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
  }
  ```

- What is the difference between memoization and tabulation?

  **Ответ:** Memoization — top-down подход: рекурсивно решаем задачу и кэшируем результаты. Tabulation — bottom-up подход: строим таблицу от базовых случаев к целевому ответу.

  Memoization часто проще придумать. Tabulation часто лучше контролирует память и избегает глубокого call stack.

  ```js
  function fibTab(n) {
    if (n <= 1) return n;

    const dp = Array(n + 1).fill(0);
    dp[1] = 1;

    for (let i = 2; i <= n; i += 1) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
  }
  ```

- How do we define DP state and transition?

  **Ответ:** DP state — что означает один элемент таблицы или memo. Transition — как получить текущее состояние из предыдущих. Base case — начальные значения.

  Пример для climbing stairs: `dp[i]` — количество способов дойти до ступеньки `i`. Transition: `dp[i] = dp[i - 1] + dp[i - 2]`.

  ```js
  function climbStairs(n) {
    if (n <= 2) return n;

    let prev2 = 1;
    let prev1 = 2;

    for (let i = 3; i <= n; i += 1) {
      const current = prev1 + prev2;
      prev2 = prev1;
      prev1 = current;
    }

    return prev1;
  }
  ```

- How can dynamic programming be recognized in live-coding problems?

  **Ответ:** DP часто появляется, если нужно найти минимум/максимум/количество способов, есть выбор на каждом шаге, а полный перебор повторяет состояния. Сигналы: "count ways", "minimum cost", "maximum profit", "can we reach", "longest subsequence", "knapsack-like".

  Вопросы к задаче: какие параметры полностью описывают состояние? Что является base case? Какие варианты перехода? Можно ли сжать память?

## Heaps and Priority Queues

- What is a heap?

  **Ответ:** Heap — деревообразная структура, где parent упорядочен относительно children. В min-heap parent меньше или равен children, поэтому минимум всегда в корне. В max-heap максимум всегда в корне.

  Heap обычно хранят массивом: для индекса `i` левый child `2i + 1`, правый child `2i + 2`, parent `Math.floor((i - 1) / 2)`.

- What is a priority queue?

  **Ответ:** Priority queue — очередь, где первым извлекается элемент с наивысшим приоритетом, а не первый добавленный. Heap — стандартная реализация priority queue.

  Примеры: Dijkstra, top-k, scheduling, merge k sorted lists.

- How are heaps used in top-k problems?

  **Ответ:** Если нужно найти top k элементов, можно держать heap размера `k`. Для top k largest используют min-heap: если новый элемент больше корня, удаляем корень и вставляем новый. Так heap хранит только k лучших элементов.

  Сложность: `O(n log k)` по времени и `O(k)` по памяти.

- How can a min-heap or max-heap be implemented in TypeScript?

  **Ответ:** В JavaScript можно реализовать generic heap через comparator. Для min-heap comparator возвращает меньшее значение выше, для max-heap — большее.

  ```js
  class Heap {
    constructor(compare) {
      this.items = [];
      this.compare = compare;
    }

    push(value) {
      this.items.push(value);
      this.bubbleUp(this.items.length - 1);
    }

    pop() {
      if (this.items.length === 0) return undefined;
      const top = this.items[0];
      const last = this.items.pop();

      if (this.items.length > 0) {
        this.items[0] = last;
        this.bubbleDown(0);
      }

      return top;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.compare(this.items[parent], this.items[index]) <= 0) break;
        [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
        index = parent;
      }
    }

    bubbleDown(index) {
      while (true) {
        let best = index;
        const left = index * 2 + 1;
        const right = index * 2 + 2;

        if (left < this.items.length && this.compare(this.items[left], this.items[best]) < 0) {
          best = left;
        }

        if (right < this.items.length && this.compare(this.items[right], this.items[best]) < 0) {
          best = right;
        }

        if (best === index) break;
        [this.items[index], this.items[best]] = [this.items[best], this.items[index]];
        index = best;
      }
    }

    get size() {
      return this.items.length;
    }
  }

  const minHeap = new Heap((a, b) => a - b);
  const maxHeap = new Heap((a, b) => b - a);
  ```

## Trees

- What is a tree?

  **Ответ:** Tree — граф без циклов с иерархической структурой. Есть root, parent/child отношения и leaf nodes. Деревья используются для DOM, файловых систем, AST, индексов, меню, категорий.

- What is a binary tree?

  **Ответ:** Binary tree — дерево, где у каждого узла максимум два ребенка: left и right. Оно не обязательно отсортировано.

  ```js
  class TreeNode {
    constructor(value, left = null, right = null) {
      this.value = value;
      this.left = left;
      this.right = right;
    }
  }
  ```

- What is a binary search tree?

  **Ответ:** Binary search tree — binary tree с правилом: значения слева меньше текущего узла, значения справа больше. Это позволяет искать, вставлять и удалять в среднем за `O(log n)`, если дерево сбалансировано.

  В худшем случае дерево может стать похожим на linked list, и операции станут `O(n)`.

  ```js
  function searchBST(root, target) {
    let node = root;

    while (node) {
      if (node.value === target) return node;
      node = target < node.value ? node.left : node.right;
    }

    return null;
  }
  ```

- What are preorder, inorder, postorder, and level-order traversal?

  **Ответ:** Это способы обхода дерева. Preorder: node-left-right. Inorder: left-node-right. Postorder: left-right-node. Level-order: по уровням через BFS.

  ```js
  function preorder(root, result = []) {
    if (!root) return result;
    result.push(root.value);
    preorder(root.left, result);
    preorder(root.right, result);
    return result;
  }

  function inorder(root, result = []) {
    if (!root) return result;
    inorder(root.left, result);
    result.push(root.value);
    inorder(root.right, result);
    return result;
  }

  function levelOrder(root) {
    if (!root) return [];

    const queue = [root];
    let head = 0;
    const result = [];

    while (head < queue.length) {
      const node = queue[head++];
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }
  ```

- How are recursion and queues used in tree problems?

  **Ответ:** Рекурсия естественно подходит для DFS по дереву: функция решает задачу для текущего узла и рекурсивно вызывает себя для детей. Очередь используется для BFS/level-order, когда нужно идти по уровням.

  Пример: максимальная глубина через рекурсию.

  ```js
  function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  }
  ```

## Live-Coding Patterns

- How does the two pointers pattern work?

  **Ответ:** Two pointers использует два индекса, которые движутся по массиву. Часто работает на отсортированных данных или строках. Паттерн помогает заменить вложенный цикл `O(n²)` на один проход `O(n)`.

  ```js
  function pairWithSum(sortedNumbers, target) {
    let left = 0;
    let right = sortedNumbers.length - 1;

    while (left < right) {
      const sum = sortedNumbers[left] + sortedNumbers[right];
      if (sum === target) return [left, right];
      if (sum < target) left += 1;
      else right -= 1;
    }

    return [];
  }
  ```

- How does the sliding window pattern work?

  **Ответ:** Sliding window поддерживает текущий диапазон элементов и двигает его границы. Он полезен для подмассивов/подстрок: максимум суммы длины k, longest substring without repeating characters, minimum window substring.

  ```js
  function maxSumOfK(numbers, k) {
    let windowSum = 0;
    let best = -Infinity;

    for (let right = 0; right < numbers.length; right += 1) {
      windowSum += numbers[right];

      if (right >= k) {
        windowSum -= numbers[right - k];
      }

      if (right >= k - 1) {
        best = Math.max(best, windowSum);
      }
    }

    return best;
  }
  ```

- How do prefix sums help optimize range queries?

  **Ответ:** Prefix sums заранее считают сумму всех элементов до каждой позиции. Тогда сумму диапазона можно получить за `O(1)`: `prefix[right + 1] - prefix[left]`.

  ```js
  function buildPrefixSums(numbers) {
    const prefix = Array(numbers.length + 1).fill(0);

    for (let i = 0; i < numbers.length; i += 1) {
      prefix[i + 1] = prefix[i] + numbers[i];
    }

    return prefix;
  }

  function rangeSum(prefix, left, right) {
    return prefix[right + 1] - prefix[left];
  }
  ```

- How does the monotonic stack pattern work?

  **Ответ:** Monotonic stack хранит элементы в возрастающем или убывающем порядке. Когда новый элемент нарушает порядок, мы выталкиваем элементы и находим для них ответ. Частые задачи: next greater element, daily temperatures, largest rectangle in histogram.

  ```js
  function nextGreaterElements(numbers) {
    const result = Array(numbers.length).fill(-1);
    const stack = [];

    for (let i = 0; i < numbers.length; i += 1) {
      while (stack.length > 0 && numbers[i] > numbers[stack.at(-1)]) {
        const index = stack.pop();
        result[index] = numbers[i];
      }

      stack.push(i);
    }

    return result;
  }
  ```

- How does backtracking work?

  **Ответ:** Backtracking перебирает варианты, строя решение шаг за шагом. Если путь не подходит, алгоритм откатывает выбор и пробует следующий. Это DFS по дереву решений.

  ```js
  function subsets(numbers) {
    const result = [];
    const path = [];

    function backtrack(index) {
      if (index === numbers.length) {
        result.push([...path]);
        return;
      }

      path.push(numbers[index]);
      backtrack(index + 1);
      path.pop();

      backtrack(index + 1);
    }

    backtrack(0);
    return result;
  }
  ```

- How can we choose between BFS, DFS, DP, greedy, and binary search?

  **Ответ:** Если нужен минимальный путь в unweighted graph — BFS. Если нужно исследовать структуру, компоненты или все варианты — DFS/backtracking. Если есть повторяющиеся подзадачи и нужно min/max/count — DP. Если локальный выбор можно доказать оптимальным — greedy. Если ответ монотонен или массив отсортирован — binary search.

  Практический вопрос на интервью: "Что является состоянием? Есть ли монотонность? Есть ли веса? Нужно ли все варианты или первый кратчайший?"

## Practice Tasks

- Implement binary search.

  **Решение:** Ищем target в отсортированном массиве, поддерживая границы `left` и `right`. На каждом шаге сравниваем target с серединой.

  Сложность: `O(log n)` time, `O(1)` space.

  ```js
  function binarySearch(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (numbers[mid] === target) return mid;
      if (numbers[mid] < target) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  }
  ```

- Solve Two Sum.

  **Решение:** Храним в `Map` уже увиденные значения и их индексы. Для текущего числа считаем `target - current`. Если complement уже есть, возвращаем пару индексов.

  Сложность: `O(n)` time, `O(n)` space.

  ```js
  function twoSum(numbers, target) {
    const seen = new Map();

    for (let i = 0; i < numbers.length; i += 1) {
      const complement = target - numbers[i];

      if (seen.has(complement)) {
        return [seen.get(complement), i];
      }

      seen.set(numbers[i], i);
    }

    return [];
  }
  ```

- Reverse a linked list.

  **Решение:** Идем по списку и перенаправляем `next` текущего узла на предыдущий. Нужно сохранить следующий узел перед изменением ссылки.

  Сложность: `O(n)` time, `O(1)` space.

  ```js
  function reverseList(head) {
    let prev = null;
    let current = head;

    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    return prev;
  }
  ```

- Validate parentheses.

  **Решение:** Используем стек. Открывающие скобки кладем в стек. Для закрывающей проверяем, соответствует ли она верхушке стека. В конце стек должен быть пустым.

  Сложность: `O(n)` time, `O(n)` space.

  ```js
  function isValidParentheses(input) {
    const stack = [];
    const pairs = {
      ')': '(',
      ']': '[',
      '}': '{'
    };

    for (const char of input) {
      if (char === '(' || char === '[' || char === '{') {
        stack.push(char);
      } else if (pairs[char]) {
        if (stack.pop() !== pairs[char]) {
          return false;
        }
      }
    }

    return stack.length === 0;
  }
  ```

- Find the maximum subarray sum.

  **Решение:** Используем алгоритм Kadane. На каждом шаге решаем: продолжать текущий subarray или начать новый с текущего элемента.

  Сложность: `O(n)` time, `O(1)` space.

  ```js
  function maxSubArray(numbers) {
    let current = numbers[0];
    let best = numbers[0];

    for (let i = 1; i < numbers.length; i += 1) {
      current = Math.max(numbers[i], current + numbers[i]);
      best = Math.max(best, current);
    }

    return best;
  }
  ```

- Find the shortest path in an unweighted graph.

  **Решение:** Используем BFS, потому что все ребра имеют одинаковую стоимость. Храним parent для восстановления пути.

  Сложность: `O(V + E)` time, `O(V)` space.

  ```js
  function shortestPath(graph, start, target) {
    const queue = [start];
    const visited = new Set([start]);
    const parent = new Map();
    let head = 0;

    while (head < queue.length) {
      const node = queue[head++];

      if (node === target) {
        const path = [];
        let current = target;

        while (current !== undefined) {
          path.push(current);
          current = parent.get(current);
        }

        return path.reverse();
      }

      for (const neighbor of graph[node] ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, node);
          queue.push(neighbor);
        }
      }
    }

    return [];
  }
  ```

- Implement quicksort.

  **Решение:** Выбираем pivot, разделяем элементы на `less`, `equal`, `greater`, рекурсивно сортируем части и объединяем.

  Average complexity: `O(n log n)`. Worst complexity: `O(n²)`. Space зависит от реализации; здесь дополнительные массивы.

  ```js
  function quickSort(numbers) {
    if (numbers.length <= 1) return numbers;

    const pivot = numbers[Math.floor(numbers.length / 2)];
    const less = [];
    const equal = [];
    const greater = [];

    for (const number of numbers) {
      if (number < pivot) less.push(number);
      else if (number > pivot) greater.push(number);
      else equal.push(number);
    }

    return [...quickSort(less), ...equal, ...quickSort(greater)];
  }
  ```

- Implement merge sort.

  **Решение:** Делим массив пополам до одиночных элементов, затем сливаем отсортированные половины двумя указателями.

  Сложность: `O(n log n)` time, `O(n)` space.

  ```js
  function mergeSort(numbers) {
    if (numbers.length <= 1) return numbers;

    const mid = Math.floor(numbers.length / 2);
    const left = mergeSort(numbers.slice(0, mid));
    const right = mergeSort(numbers.slice(mid));

    return merge(left, right);
  }

  function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }

    while (i < left.length) result.push(left[i++]);
    while (j < right.length) result.push(right[j++]);

    return result;
  }
  ```

- Solve a top-k frequent elements problem.

  **Решение:** Считаем частоты через `Map`, затем сортируем пары по frequency. Для interview можно упомянуть, что heap даст `O(n log k)`, но сортировка проще и часто приемлема.

  Сложность sorting version: `O(n log n)` time, `O(n)` space.

  ```js
  function topKFrequent(numbers, k) {
    const freq = new Map();

    for (const number of numbers) {
      freq.set(number, (freq.get(number) ?? 0) + 1);
    }

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([number]) => number);
  }
  ```

- Solve a basic dynamic programming problem.

  **Решение:** Пример — climbing stairs. На каждую ступеньку можно прийти с предыдущей или с предпредыдущей. Значит `ways[i] = ways[i - 1] + ways[i - 2]`.

  Сложность: `O(n)` time, `O(1)` space.

  ```js
  function climbStairs(n) {
    if (n <= 2) return n;

    let oneStepBefore = 2;
    let twoStepsBefore = 1;

    for (let step = 3; step <= n; step += 1) {
      const current = oneStepBefore + twoStepsBefore;
      twoStepsBefore = oneStepBefore;
      oneStepBefore = current;
    }

    return oneStepBefore;
  }
  ```
