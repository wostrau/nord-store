# TypeScript Matrix: вопросы и ответы

- What basic types are provided by TypeScript?

  **Ответ:** TypeScript расширяет JavaScript статической типизацией. Базовые типы включают `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`, `object`, arrays, tuples, enums, literal types, union/intersection types, `void`, `never`, `unknown` и `any`.

  ```ts
  const name: string = 'Ann';
  const age: number = 30;
  const isAdmin: boolean = false;
  const tags: string[] = ['ts', 'node'];
  ```

- What are void, never, unknown, any, tuple, and enum types?

  **Ответ:** `void` обычно означает отсутствие полезного возвращаемого значения. `never` означает значение, которое никогда не появится, например функция всегда бросает ошибку. `unknown` — безопасная версия неизвестного типа: перед использованием нужна проверка. `any` отключает проверку типов. Tuple — массив фиксированной структуры. Enum — набор именованных констант.

  ```ts
  function log(message: string): void {
    console.log(message);
  }

  function fail(message: string): never {
    throw new Error(message);
  }

  const point: [number, number] = [10, 20];
  ```

- How do union types work?

  **Ответ:** Union type позволяет значению быть одним из нескольких типов. Перед использованием операций, специфичных для одного типа, TypeScript требует narrowing через `typeof`, `in`, discriminant field или custom type guard.

  ```ts
  function format(value: string | number): string {
    return typeof value === 'number' ? value.toFixed(2) : value.trim();
  }
  ```

- What are literal types?

  **Ответ:** Literal type ограничивает значение конкретным литералом: строкой, числом или boolean. Они часто используются вместе с union types для описания допустимых состояний, ролей или вариантов API.

  ```ts
  type Status = 'idle' | 'loading' | 'success' | 'error';

  const status: Status = 'loading';
  ```

- How does type casting work in TypeScript?

  **Ответ:** Type casting в TypeScript чаще называют type assertion. Оно говорит компилятору трактовать значение как конкретный тип, но не меняет runtime-значение. Использовать assertion нужно осторожно, потому что можно обойти реальные проверки.

  ```ts
  const input = document.querySelector('input') as HTMLInputElement;
  input.value = 'hello';
  ```

- What are generics and why are they needed?

  **Ответ:** Generics позволяют писать reusable код, который сохраняет информацию о типах. Вместо `any` generic type parameter связывает входы и выходы функции, класса или interface, сохраняя type safety.

  ```ts
  function identity<T>(value: T): T {
    return value;
  }

  const result = identity('text'); // string
  ```

- How do generic functions work?

  **Ответ:** Generic function объявляет type parameter, например `<T>`, и использует его в параметрах или возвращаемом типе. TypeScript часто выводит `T` автоматически из аргументов.

  ```ts
  function first<T>(items: T[]): T | undefined {
    return items[0];
  }

  const user = first([{ id: 1 }]); // { id: number } | undefined
  ```

- How do generic classes work?

  **Ответ:** Generic class принимает type parameter на уровне класса. Это полезно для collections, repositories, services и wrappers, где методы работают с одним согласованным типом.

  ```ts
  class Store<T> {
    private items: T[] = [];

    add(item: T): void {
      this.items.push(item);
    }
  }

  const users = new Store<{ id: number; email: string }>();
  ```

- Why can void behave similarly to undefined or null?

  **Ответ:** `void` означает, что возвращаемое значение не должно использоваться. В JavaScript функция без `return` фактически возвращает `undefined`, поэтому `void` близок к `undefined` в function return context. `null` связан с `void` только при отключенном `strictNullChecks`; в strict mode `null` не присваивается `void` напрямую.

- How do generic constraints with extends work?

  **Ответ:** `extends` в generics ограничивает допустимый тип. Это позволяет использовать свойства constraint внутри функции и не принимать типы, которые не соответствуют минимальному контракту.

  ```ts
  function getId<T extends { id: string }>(value: T): string {
    return value.id;
  }
  ```

- How can class types be used in generics?

  **Ответ:** Class constructor type можно передавать в generic function, чтобы создавать экземпляры или связывать runtime constructor с instance type. Обычно используют signature `new (...args) => T`.

  ```ts
  type Constructor<T> = new (...args: never[]) => T;

  function create<T>(Ctor: Constructor<T>): T {
    return new Ctor();
  }
  ```

- What is the difference between an interface and a class?

  **Ответ:** `interface` существует только на этапе компиляции и описывает форму объекта. `class` существует и в TypeScript type system, и в JavaScript runtime: она создает constructor, prototype methods и может иметь реализацию. Interface задает контракт, class может этот контракт реализовать.

- How do optional properties work in interfaces?

  **Ответ:** Optional property помечается `?` и может отсутствовать. При чтении такого свойства TypeScript учитывает возможность `undefined`, поэтому код должен обработать этот случай.

  ```ts
  interface User {
    id: string;
    nickname?: string;
  }
  ```

- How do readonly properties work?

  **Ответ:** `readonly` запрещает присваивание свойству после инициализации на уровне TypeScript. Это compile-time защита, а не runtime freeze. Для массивов можно использовать `readonly T[]` или `ReadonlyArray<T>`.

  ```ts
  interface User {
    readonly id: string;
    email: string;
  }
  ```

- How are function types defined in interfaces?

  **Ответ:** Function type можно описать как property с function signature или как call signature interface. Это полезно для callbacks, strategies и callable objects.

  ```ts
  interface Validator {
    (value: string): boolean;
  }

  interface UserService {
    findById(id: string): Promise<User>;
  }
  ```

- What are indexable types?

  **Ответ:** Indexable type описывает объект, к которому обращаются по динамическому ключу. Index signature задает тип ключа и значения. Чаще всего используются string или number keys.

  ```ts
  interface Dictionary {
    [key: string]: string;
  }

  const labels: Dictionary = { save: 'Save' };
  ```

- How can interfaces be implemented by classes?

  **Ответ:** Class может объявить `implements InterfaceName`, и TypeScript проверит, что public members класса соответствуют interface. `implements` не добавляет runtime-поведение, это только проверка типов.

  ```ts
  interface Notifier {
    send(message: string): Promise<void>;
  }

  class EmailNotifier implements Notifier {
    async send(message: string): Promise<void> {
      console.log(message);
    }
  }
  ```

- How can a class act as an interface?

  **Ответ:** Class в TypeScript создает instance type, поэтому его можно использовать как тип. Другой class может `implements SomeClass`, если реализует его public shape. Private/protected members усложняют это: они требуют совместимого происхождения.

  ```ts
  class Point {
    x = 0;
    y = 0;
  }

  const point: Point = { x: 1, y: 2 };
  ```

- What is a construct signature in an interface?

  **Ответ:** Construct signature описывает тип объекта, который можно вызвать через `new`. Она нужна для передачи class/constructor как зависимости.

  ```ts
  interface UserConstructor {
    new (email: string): User;
  }

  function buildUser(Ctor: UserConstructor): User {
    return new Ctor('user@example.com');
  }
  ```

- What are hybrid interfaces and hybrid types?

  **Ответ:** Hybrid type описывает значение, которое одновременно является callable object и имеет свойства или методы. Это встречается в JavaScript-библиотеках, где функция также хранит configuration или helpers.

  ```ts
  interface Counter {
    (): number;
    value: number;
    reset(): void;
  }
  ```

- How are functions typed in TypeScript?

  **Ответ:** Функции типизируются через типы параметров и возвращаемого значения. TypeScript может вывести return type, но для публичных APIs его часто лучше указывать явно.

  ```ts
  function sum(a: number, b: number): number {
    return a + b;
  }

  const multiply: (a: number, b: number) => number = (a, b) => a * b;
  ```

- How are rest parameters typed?

  **Ответ:** Rest parameters типизируются как array или tuple. Array подходит для произвольного количества одинаковых аргументов, tuple — для фиксированной структуры.

  ```ts
  function sum(...numbers: number[]): number {
    return numbers.reduce((total, value) => total + value, 0);
  }
  ```

- How are optional parameters typed?

  **Ответ:** Optional parameter помечается `?` и должен идти после обязательных параметров. Внутри функции его тип включает `undefined`, поэтому нужно задать default или сделать проверку.

  ```ts
  function greet(name: string, title?: string): string {
    return title ? `${title} ${name}` : name;
  }
  ```

- How can this be typed inside functions?

  **Ответ:** TypeScript позволяет указать fake first parameter `this`, который не попадает в JavaScript, но типизирует контекст вызова функции. Это полезно для callback APIs и object methods.

  ```ts
  function format(this: { prefix: string }, value: string): string {
    return `${this.prefix}${value}`;
  }
  ```

- How do function overloads work?

  **Ответ:** Overloads позволяют описать несколько публичных signatures для одной функции. После overload signatures идет одна implementation signature, которая должна обработать все варианты.

  ```ts
  function parse(value: string): string[];
  function parse(value: number): number[];
  function parse(value: string | number): string[] | number[] {
    return typeof value === 'string' ? value.split(',') : [value];
  }
  ```

- What are access modifiers in TypeScript?

  **Ответ:** Access modifiers управляют доступом к members класса: `public`, `protected`, `private`. `public` доступен везде, `protected` — внутри класса и наследников, `private` — только внутри класса. TypeScript `private` проверяется компилятором; JavaScript runtime-private fields используют `#field`.

- What are parameter properties?

  **Ответ:** Parameter properties позволяют объявить и инициализировать class property прямо в constructor parameter через modifier `public`, `private`, `protected` или `readonly`.

  ```ts
  class UserService {
    constructor(private readonly repository: UserRepository) {}
  }
  ```

- What are abstract classes?

  **Ответ:** Abstract class нельзя создать напрямую. Он может содержать общую реализацию и abstract members, которые обязаны реализовать subclasses. Abstract class полезен, когда нужен общий base behavior, а не только контракт.

  ```ts
  abstract class Repository<T> {
    abstract findById(id: string): Promise<T | null>;
  }
  ```

- Why and when are private constructors used?

  **Ответ:** Private constructor запрещает создание экземпляра через `new` снаружи класса. Его используют для singleton, static factory methods, utility classes или контроля создания объектов.

  ```ts
  class Config {
    private constructor() {}

    static load(): Config {
      return new Config();
    }
  }
  ```

- What are numeric and string enums?

  **Ответ:** Numeric enum хранит числовые значения и может иметь auto-increment. String enum хранит строковые значения, лучше читается в logs/API и не имеет reverse mapping как numeric enum.

  ```ts
  enum Role {
    User = 'user',
    Admin = 'admin'
  }
  ```

- What are static and computed enums?

  **Ответ:** Enum member может быть constant/static, если значение известно на этапе компиляции, или computed, если вычисляется выражением. Computed members ограничивают некоторые compile-time возможности и создают runtime-код.

  ```ts
  enum Size {
    Small = 1,
    Large = Small * 2,
    Random = Math.random()
  }
  ```

- How do enums behave during compilation and at runtime?

  **Ответ:** Обычные enums компилируются в JavaScript object и существуют runtime. Numeric enums создают reverse mapping from value to name. `const enum` обычно inline-ится и исчезает из runtime output, но требует осторожности при library publishing и transpilation settings.

- Why are declaration files needed in TypeScript?

  **Ответ:** Declaration files `.d.ts` описывают типы JavaScript-кода без реализации. Они нужны для библиотек без TypeScript source, global APIs, generated contracts и shared type-only packages.

  ```ts
  declare module 'legacy-lib' {
    export function format(value: string): string;
  }
  ```

- What does the declare keyword do?

  **Ответ:** `declare` сообщает TypeScript, что сущность существует где-то во внешнем runtime, но реализация находится не в текущем файле. Он используется в `.d.ts`, ambient declarations, global variables и module declarations.

  ```ts
  declare const API_URL: string;
  ```

- What are namespaces in TypeScript?

  **Ответ:** Namespace — старый TypeScript-механизм группировки кода и типов в одном global/module scope. В современных проектах чаще используют ES modules. Namespaces все еще встречаются в declaration files и legacy code.

- What are best practices for writing and organizing typings?

  **Ответ:** Типы лучше держать рядом с кодом, если они локальны, и выносить в shared/contracts слой, если они описывают публичный API. Нужно избегать `any`, использовать `unknown` для непроверенных данных, экспортировать минимальные контракты, отделять DTO от database models и проверять runtime input schema отдельно от TypeScript types.
