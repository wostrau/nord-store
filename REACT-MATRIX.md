- Why do we use the ReactDOM library?

  **Ответ:** `react-dom` связывает React с браузерным DOM. Сам пакет `react` описывает компоненты, элементы, хуки и reconciliation-логику, а `react-dom` умеет смонтировать React-дерево в реальный DOM, обновлять DOM-ноды, обрабатывать browser events, делать hydration и portals.

  Для обычного client-side приложения ReactDOM создает новый root и сам строит DOM:

  ```tsx
  import { createRoot } from 'react-dom/client';
  import { App } from './App';

  createRoot(document.getElementById('root')!).render(<App />);
  ```

  Для SSR-приложения сервер уже присылает готовый HTML. В этом случае ReactDOM не должен заново выбросить и построить DOM с нуля; он должен "подключиться" к существующей разметке, навесить event handlers, восстановить Fiber tree и сделать UI интерактивным. Этот процесс называется hydration.

  ```tsx
  import { hydrateRoot } from 'react-dom/client';
  import { App } from './App';

  hydrateRoot(document.getElementById('root')!, <App />);
  ```

  Практический пример: Next.js отдает HTML страницы товара с сервера, чтобы пользователь быстрее увидел content и поисковые системы получили разметку. Потом ReactDOM на клиенте делает hydration: кнопки `Add to cart`, dropdowns, forms и client navigation начинают работать как React-приложение.

  Важно: HTML, сгенерированный на сервере, должен совпадать с первым render на клиенте. Если сервер отдал одну разметку, а клиент сразу рендерит другую, появятся hydration mismatch warnings и React может быть вынужден исправлять DOM.

- Why was ReactDOM moved into a separate package?

  **Ответ:** React разделили на platform-agnostic core и renderers. Один и тот же React может работать с разными target platforms: browser DOM через `react-dom`, mobile через React Native, terminal/custom renderers через другие renderer-реализации. Это делает core независимым от браузера.

- How does ReactDOM work internally?

  **Ответ:** ReactDOM создает root, принимает React elements, запускает reconciliation через Fiber, вычисляет изменения и применяет commit к DOM: создает/обновляет/удаляет DOM-ноды, выставляет attributes/listeners, синхронизирует controlled inputs и вызывает effects после commit.

- Why did older versions of React require importing React in every component?

  **Ответ:** Старый JSX transform компилировал JSX в `React.createElement(...)`, поэтому переменная `React` должна была быть в scope. Начиная с нового JSX transform, компилятор импортирует runtime helpers автоматически.

  ```tsx
  // JSX
  const title = <h1>Hello</h1>;

  // Старый transform:
  const title = React.createElement('h1', null, 'Hello');
  ```

- What role does React play in JSX-based components?

  **Ответ:** JSX — это синтаксис для описания React elements. React предоставляет модель elements/components, `createElement`, hooks, memoization APIs и правила rendering. JSX сам по себе не браузерная технология; его нужно трансформировать в JavaScript.

- How is JSX transformed into JavaScript?

  **Ответ:** Babel/TypeScript превращает JSX в вызовы JSX runtime. В modern transform это обычно `_jsx`/`_jsxs` из `react/jsx-runtime`; в legacy transform это `React.createElement`.

  ```tsx
  <Button disabled>Save</Button>
  ```

  ```js
  jsx(Button, { disabled: true, children: 'Save' });
  ```

- How does React.createElement() work?

  **Ответ:** `React.createElement(type, props, ...children)` создает immutable React element: plain object с `type`, `props`, `key`, `ref`. Он не создает DOM-ноду сразу. DOM появляется позже, когда renderer обработает element tree.

  Сигнатура:

  ```tsx
  React.createElement(type, props, ...children);
  ```

  Первый аргумент `type` описывает, что именно нужно создать. В `type` можно передать:

  - строку с именем HTML/SVG-тега: `'div'`, `'button'`, `'input'`, `'svg'`;
  - function component: `ProductCard`;
  - class component;
  - special React types: `React.Fragment`, `React.Suspense`, `React.StrictMode`, `React.Profiler`;
  - результат `React.memo(Component)`;
  - результат `React.forwardRef(...)`;
  - lazy component из `React.lazy(...)`;
  - context provider/consumer.

  Второй аргумент `props` — объект props или `null`. Через него передаются обычные props, DOM attributes, event handlers, а также специальные props `key` и `ref`.

  ```tsx
  React.createElement(
    'button',
    {
      type: 'button',
      disabled: true,
      className: 'primary',
      onClick: handleClick,
    },
    'Save'
  );
  ```

  Дети передаются **третьим и последующими аргументами**:

  ```tsx
  React.createElement('button', { disabled: true }, 'Save');
  ```

  Несколько children:

  ```tsx
  React.createElement(
    'ul',
    null,
    React.createElement('li', { key: 'cart' }, 'Cart'),
    React.createElement('li', { key: 'orders' }, 'Orders')
  );
  ```

  Это эквивалентно:

  ```tsx
  <ul>
    <li key="cart">Cart</li>
    <li key="orders">Orders</li>
  </ul>
  ```

  Children также можно передать как `props.children`, но JSX/`createElement` обычно кладет их туда сам:

  ```tsx
  React.createElement('section', { children: 'Content' });
  React.createElement('section', null, 'Content');
  ```

  Оба варианта создают element, где `props.children === 'Content'`, но стандартный и более читаемый способ для `createElement` — использовать третий аргумент и дальше.

- What does React.cloneElement() do?

  **Ответ:** `cloneElement(element, props, children)` создает новый React element на основе существующего, переопределяя props/children. Полезно для compound components, но им лучше не злоупотреблять: часто проще использовать render props, context или явные props.

  ```tsx
  function WithTracking({ children }: { children: React.ReactElement }) {
    return React.cloneElement(children, {
      onClick: () => console.log('clicked'),
    });
  }
  ```

- What are React Fragments?

  **Ответ:** Fragment позволяет вернуть несколько соседних элементов без лишнего DOM wrapper.

  ```tsx
  return (
    <>
      <dt>Name</dt>
      <dd>Nord Store</dd>
    </>
  );
  ```

- Why are Fragments useful?

  **Ответ:** Они не ломают HTML-структуру и CSS layout. Например, внутри `<table>` нельзя вставлять лишний `<div>`, а Fragment позволяет вернуть несколько `<tr>`/`td`-элементов корректно. Для списков можно использовать `<React.Fragment key={id}>`.

- What is React Fiber?

  **Ответ:** React Fiber — это внутренняя архитектура React reconciler-а, которая представляет UI не просто как рекурсивный component tree, а как набор маленьких units of work. Каждый такой unit называется **Fiber node**. Fiber позволяет React разбивать rendering на части, назначать updates приоритеты, прерывать низкоприоритетную работу, возвращаться к ней позже и коммитить результат только тогда, когда новое дерево готово.

  Важно: Fiber — это не публичный API. Разработчик обычно не создает Fiber nodes руками. Но понимание Fiber объясняет, почему работают `key`, batching, `React.memo`, concurrent rendering, Suspense, transitions и почему render phase должна быть pure.

  Что хранит Fiber node:

  - `type` — что рендерим: `'div'`, function component, class component и т.д.;
  - `key` — стабильный идентификатор для reconciliation в списках;
  - `stateNode` — связанный instance: DOM node, class instance или root;
  - `return` — ссылка на parent fiber;
  - `child` — ссылка на первого child fiber;
  - `sibling` — ссылка на следующего соседнего fiber;
  - `alternate` — ссылка на fiber из другого дерева, current <-> work-in-progress;
  - `pendingProps` — props для нового render;
  - `memoizedProps` — props прошлого committed render;
  - `memoizedState` — state/hooks прошлого committed render;
  - `updateQueue` — очередь updates/effects;
  - `flags` / `subtreeFlags` — какие DOM/effect операции нужно выполнить в commit phase;
  - `lanes` / `childLanes` — приоритеты updates.

  Упрощенно Fiber tree — это linked structure:

  ```txt
  App fiber
  ├── Header fiber
  ├── ProductList fiber
  │   ├── ProductCard fiber
  │   └── ProductCard fiber
  └── CartSummary fiber
  ```

  Но физически это не массив children, а связи:

  ```txt
  parent -> child -> sibling -> sibling
       ^      |
       |      v
     return  child
  ```

  **Главная идея алгоритма**

  React держит два дерева:

  - **current tree** — уже показанный пользователю UI;
  - **work-in-progress tree** — новое дерево, которое React строит для следующего состояния.

  Это называется double buffering. Пока React считает новое дерево, пользователь продолжает видеть старое current tree. Когда work-in-progress готов, React одним commit-ом переключает его в current.

  Алгоритм состоит из двух больших фаз:

  1. **Render phase / reconciliation**

     React строит work-in-progress tree, вызывает function components, обрабатывает hooks, сравнивает новые elements со старыми fibers и помечает, какие изменения нужны.

     Эта фаза может быть прервана в concurrent rendering, потому что она не должна иметь side effects.

  2. **Commit phase**

     React применяет изменения к реальному DOM, вызывает layout effects, refs и планирует passive effects. Эта фаза не прерывается, потому что DOM должен перейти из одного консистентного состояния в другое.

  Внутри render phase React делает depth-first traversal. Упрощенно:

  ```txt
  beginWork(App)
    beginWork(Header)
    completeWork(Header)
    beginWork(ProductList)
      beginWork(ProductCard)
      completeWork(ProductCard)
      beginWork(ProductCard)
      completeWork(ProductCard)
    completeWork(ProductList)
    beginWork(CartSummary)
    completeWork(CartSummary)
  completeWork(App)
  commitRoot()
  ```

  Что делают ключевые шаги:

  - `beginWork` — обработать fiber сверху вниз: вызвать component, получить children, сравнить children со старым tree, создать/переиспользовать child fibers.
  - `completeWork` — обработать fiber снизу вверх: подготовить DOM update, собрать flags/effects, завершить subtree.
  - `commitRoot` — применить накопленные изменения к DOM и effects.

  Упрощенный псевдокод:

  ```ts
  function workLoop() {
    while (nextUnitOfWork && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    if (!nextUnitOfWork && workInProgressRoot) {
      commitRoot(workInProgressRoot);
    }
  }

  function performUnitOfWork(fiber) {
    const child = beginWork(fiber);

    if (child) {
      return child;
    }

    let node = fiber;

    while (node) {
      completeWork(node);

      if (node.sibling) {
        return node.sibling;
      }

      node = node.return;
    }

    return null;
  }
  ```

  Это не точный исходный код React, но хорошая mental model: React берет fiber как unit of work, делает часть работы, может уступить main thread браузеру, затем продолжить.

  **Как Fiber делает reconciliation**

  Когда component возвращает JSX, React получает новые React elements и сравнивает их со старыми fibers:

  - если `type` и `key` совпали, React переиспользует fiber и обновляет props;
  - если `type` поменялся, subtree считается новым;
  - если `key` поменялся, React считает элемент другим и remount-ит его;
  - если элемента больше нет, fiber помечается на deletion;
  - если появился новый элемент, создается новый fiber с placement flag.

  Пример:

  ```tsx
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
  ```

  `key={product.id}` помогает React понять, какой `ProductCard` соответствует какому старому fiber после сортировки, удаления или добавления товара.

  **Преимущества Fiber**

  - rendering можно разбивать на маленькие chunks;
  - низкоприоритетную работу можно прерывать;
  - пользовательский input может получить более высокий приоритет;
  - React может подготовить UI в фоне и commit-ить его позже;
  - лучше работают Suspense, transitions и selective hydration;
  - стало проще реализовывать разные renderers;
  - React может хранить больше metadata для scheduling, effects и reconciliation.

  **Отличие от старого stack reconciler**

  Старый reconciler был ближе к обычной рекурсии через JavaScript call stack. Если React начал рендерить большое дерево, он должен был закончить его синхронно. Нельзя было нормально поставить работу на паузу, дать браузеру обработать input и потом продолжить с того же места.

  Fiber заменил эту модель на manual linked-list traversal:

  ```txt
  Stack reconciler:
  recursive call -> recursive call -> recursive call
  нельзя удобно прервать посередине

  Fiber:
  unit of work -> next unit of work -> maybe yield -> continue later
  ```

  **Почему render должен быть pure**

  Render phase может быть запущена, прервана, повторена или вообще не попасть в commit. Поэтому нельзя делать side effects прямо во время render:

  ```tsx
  // Плохо
  function ProductPage() {
    localStorage.setItem('visited', 'true');
    return <div />;
  }
  ```

  Side effects нужно делать в effects или event handlers:

  ```tsx
  function ProductPage() {
    useEffect(() => {
      localStorage.setItem('visited', 'true');
    }, []);

    return <div />;
  }
  ```

  Коротко: Fiber — это реализация React, которая превращает rendering в планируемую работу над деревом. Она дает React контроль над тем, **что обновлять, когда обновлять, с каким приоритетом и когда безопасно применить изменения к DOM**.

- Why was Fiber introduced?

  **Ответ:** Старый stack reconciler работал синхронно: начав render большого дерева, React должен был закончить его целиком. Fiber ввели, чтобы разбивать работу на units, назначать приоритеты, прерывать/возобновлять render, лучше поддерживать animations, input responsiveness и concurrent features.

- How does the Fiber algorithm work?

  **Ответ:** React строит work-in-progress Fiber tree. Во время render phase он проходит fibers, вычисляет новые children и помечает effects. Потом в commit phase применяет изменения к DOM и запускает layout/passive effects. Render phase может быть прервана, commit phase выполняется синхронно.

- How does Fiber improve rendering performance?

  **Ответ:** Fiber не делает каждый render автоматически быстрее, но делает работу управляемой: React может отложить низкоприоритетные обновления, продолжить high-priority input, переиспользовать fibers и избежать блокировки main thread длинным render.

- How does Fiber implement reconciliation internally?

  **Ответ:** Для каждого компонента React сравнивает новый element с прошлым fiber. Если `type` и `key` совпадают, fiber переиспользуется и обновляются props/state. Если нет, старый subtree удаляется и создается новый. Для списков `key` помогает сопоставлять элементы между renders.

- How does prioritization work in React?

  **Ответ:** React назначает updates разные приоритеты, чтобы UI оставался отзывчивым. Не все изменения одинаково срочные: ввод символа в input должен отработать быстрее, чем перерисовка тяжелого списка результатов поиска. В современной реализации React использует внутреннюю модель **lanes**: update попадает в определенную lane, а scheduler решает, какую работу выполнять первой.

  Упрощенно приоритеты можно представить так:

  - **Synchronous / discrete user input** — самый срочный уровень. Click, key press, submit, focus-sensitive interactions. Пользователь ожидает немедленную реакцию.
  - **Continuous input** — drag, scroll, mouse move, pointer move. Важны для плавности, но могут обрабатываться сериями.
  - **Default updates** — обычные state updates: загрузили данные, изменили фильтр, обновили часть UI.
  - **Transition updates** — несрочные визуальные переходы, которые можно прервать или отложить. Например пересчитать большой список после ввода в search box.
  - **Deferred/background work** — обновления, которые могут подождать, пока срочная работа завершится.
  - **Idle work** — работа, которую можно делать, когда main thread свободен.

  Пример: search input.

  ```tsx
  function ProductSearch({ products }: { products: Product[] }) {
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isPending, startTransition] = useTransition();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const nextQuery = event.target.value;

      // Срочно: input должен обновиться сразу.
      setQuery(nextQuery);

      // Менее срочно: фильтрация большого списка может подождать.
      startTransition(() => {
        setFilteredProducts(
          products.filter((product) =>
            product.title.toLowerCase().includes(nextQuery.toLowerCase())
          )
        );
      });
    }

    return (
      <>
        <input value={query} onChange={handleChange} />
        {isPending ? <span>Updating results...</span> : null}
        <ProductList products={filteredProducts} />
      </>
    );
  }
  ```

  Здесь `setQuery(nextQuery)` имеет высокий приоритет, потому что он связан с typing. А `setFilteredProducts(...)` внутри `startTransition` получает transition priority: если пользователь продолжит печатать, React может прервать старый render списка и начать новый.

  Еще пример — `useDeferredValue`. Он позволяет оставить input быстрым, а тяжелую часть UI обновлять с задержкой:

  ```tsx
  function SearchPage({ products }: { products: Product[] }) {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    const filteredProducts = useMemo(() => {
      return products.filter((product) =>
        product.title.toLowerCase().includes(deferredQuery.toLowerCase())
      );
    }, [products, deferredQuery]);

    return (
      <>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
        <ProductList products={filteredProducts} />
      </>
    );
  }
  ```

  Разница между `useTransition` и `useDeferredValue`:

  ```txt
  useTransition     — помечает конкретный state update как менее срочный.
  useDeferredValue  — создает отложенную версию уже существующего значения.
  ```

  `useTransition` используют там, где компонент сам инициирует update и может обернуть его в `startTransition`:

  ```tsx
  const [isPending, startTransition] = useTransition();

  function selectCategory(categoryId: string) {
    setSelectedCategory(categoryId); // срочно: подсветить выбранную категорию

    startTransition(() => {
      setVisibleProducts(filterProducts(categoryId)); // менее срочно: тяжелый список
    });
  }
  ```

  `useDeferredValue` используют там, где значение уже пришло как state/prop, а нужно отложить реакцию тяжелой части UI на его изменение:

  ```tsx
  function ProductResults({ query }: { query: string }) {
    const deferredQuery = useDeferredValue(query);

    const results = useMemo(() => {
      return searchProducts(deferredQuery);
    }, [deferredQuery]);

    return <ProductList products={results} />;
  }
  ```

  Практическое различие:

  - `useTransition` дает `isPending`, поэтому удобно показывать pending indicator.
  - `useDeferredValue` не дает setter и не запускает update сам; он только возвращает lagging version значения.
  - `useTransition` подходит для navigation, tab switching, filter changes, route-like UI transitions.
  - `useDeferredValue` подходит для search query, derived expensive lists, slow child components, когда parent value должен обновиться сразу, а child может отстать.
  - `useTransition` применяется в месте, где update создается.
  - `useDeferredValue` применяется в месте, где значение потребляется.

  Хорошая mental model: `useTransition` говорит React "этот update можно сделать позже", а `useDeferredValue` говорит "дай мне менее срочную копию этого значения для тяжелой части UI".

  Практические примеры приоритетов:

  - ввод в поле формы: высокий приоритет;
  - click по кнопке `Add to cart`: высокий приоритет;
  - открытие modal после click: высокий/обычный, зависит от сценария;
  - рендер 5000 товаров после изменения фильтра: transition;
  - обновление chart после смены date range: часто transition;
  - подгрузка recommendations ниже основного content: background/deferred;
  - analytics state или prefetch: низкий приоритет/idle;
  - hydration интерактивного элемента, с которым пользователь взаимодействует: выше, чем hydration невидимой части страницы.

  Важно различать render и commit:

  - **render phase** может быть прервана, пересчитана или отложена;
  - **commit phase** не прерывается, потому что React должен применить DOM changes консистентно.

  Приоритеты не означают, что React запускает несколько JavaScript-потоков. JavaScript все еще выполняется на main thread. Приоритеты дают React возможность **разбивать render work, выбирать следующую работу и не тратить main thread на устаревшие низкоприоритетные renders**.

- What is React scheduling?

  **Ответ:** Scheduling — это выбор, когда и с каким приоритетом выполнять render work. React может batch-ить updates, отложить transition, прервать background render и вернуться к нему позже. Цель — сохранить отзывчивость UI.

- How does React prioritize updates?

  **Ответ:** User-blocking updates, например typing/click, получают высокий приоритет. Transition updates через `startTransition` получают меньший приоритет. Idle/background work может подождать. Приоритет влияет на то, будет ли render синхронным, прерываемым или отложенным.

- How does concurrent rendering affect prioritization?

  **Ответ:** Concurrent rendering позволяет React начать render, прервать его более важным update, а потом продолжить или пересчитать работу. Пользователь видит только committed UI; незавершенный background render не попадает на экран.

- Why does React use recursion when traversing child components?

  **Ответ:** React tree естественно рекурсивен: компонент возвращает элементы, элементы содержат children, children могут быть компонентами. Рекурсивная модель удобна для обхода дерева, reconciliation и применения одинаковых правил к вложенным subtrees.

- How does recursive traversal work in the React tree?

  **Ответ:** React начинает с root, обрабатывает child, затем sibling и parent links. В Fiber это реализовано не как обычная JS-recursion call stack, а как linked structure, чтобы работу можно было разбивать и продолжать.

- How can this approach be applied in practice?

  **Ответ:** В приложениях похожий подход используют для tree UI: menus, comments, file explorers, category trees.

  ```tsx
  function CategoryNode({ node }: { node: Category }) {
    return (
      <li>
        {node.title}
        {node.children?.length ? (
          <ul>{node.children.map((child) => <CategoryNode key={child.id} node={child} />)}</ul>
        ) : null}
      </li>
    );
  }
  ```

- What are functional components?

  **Ответ:** Functional component — функция, которая принимает props и возвращает React nodes. Сегодня это основной способ писать компоненты.

  ```tsx
  function ProductCard({ title, price }: Product) {
    return <article>{title}: ${price}</article>;
  }
  ```

- Why are functional components used?

  **Ответ:** Они проще class components, лучше компонуются через hooks, легче типизируются, не требуют `this`, хорошо работают с modern React features и обычно дают более локальную структуру side effects/state.

- How is state managed in functional components?

  **Ответ:** Через hooks: `useState` для простого состояния, `useReducer` для сложной логики, `useRef` для mutable values без render, external stores через `useSyncExternalStore`.

  ```tsx
  const [quantity, setQuantity] = useState(1);
  ```

  `useSyncExternalStore` — это публичный React API, а не внутренний механизм. Его добавили, чтобы React мог безопасно читать данные из внешних stores в concurrent rendering. Внешний store — это состояние, которое живет не внутри React: Redux store, Zustand-like store, browser API subscription, custom event emitter, shared cache.

  Сигнатура:

  ```tsx
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot?
  );
  ```

  - `subscribe(callback)` подписывает React на изменения external store и возвращает unsubscribe.
  - `getSnapshot()` возвращает текущее значение store.
  - `getServerSnapshot()` нужен для SSR, чтобы серверный и клиентский initial snapshot совпали.

  Минимальный пример custom store:

  ```tsx
  import { useSyncExternalStore } from 'react';

  let currentTheme = 'light';
  const listeners = new Set<() => void>();

  const themeStore = {
    getSnapshot: () => currentTheme,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setTheme: (theme: string) => {
      currentTheme = theme;
      listeners.forEach((listener) => listener());
    },
  };

  function useThemeStore() {
    return useSyncExternalStore(
      themeStore.subscribe,
      themeStore.getSnapshot,
      themeStore.getSnapshot
    );
  }

  function ThemeLabel() {
    const theme = useThemeStore();
    return <span>{theme}</span>;
  }
  ```

  В обычном компоненте чаще используют `useState`/`useReducer`. `useSyncExternalStore` нужен в основном авторам state libraries или когда приложение напрямую подписывается на внешний источник данных. Например React Redux внутри использует совместимые механизмы, чтобы React корректно подписывался на Redux store.

- What are the advantages and disadvantages of functional components?

  **Ответ:** Плюсы: меньше boilerplate, hooks, отсутствие `this`, проще reuse логики, лучше совместимость с современными React APIs, удобнее типизация props и локальной логики.

  Минусы в основном связаны не с самими function components, а с неправильным использованием hooks и JavaScript closures.

  **1. Stale closures**

  Function component заново вызывается на каждый render. Event handlers/effects замыкают значения из конкретного render-а. Если dependencies указаны неверно, код может читать старое значение.

  ```tsx
  function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const id = setInterval(() => {
        console.log(count); // может всегда печатать старое значение
      }, 1000);

      return () => clearInterval(id);
    }, []); // count не указан
  }
  ```

  Исправление зависит от задачи: добавить dependency, использовать functional update, ref или пересмотреть effect.

  **2. Ошибки в dependency arrays**

  `useEffect`, `useMemo`, `useCallback` требуют правильно указывать reactive values. Если dependency забыта, будет stale behavior. Если dependency лишняя или нестабильная, effect может запускаться слишком часто.

  ```tsx
  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId]);
  ```

  Поэтому важно использовать `eslint-plugin-react-hooks`, а не отключать его без причины.

  **3. Слишком много logic внутри одного component**

  Function component легко превратить в большой файл с `useState`, `useEffect`, `useMemo`, handlers и conditions. Такой компонент становится сложнее читать, чем class lifecycle. Решение — разделять UI, domain logic и custom hooks.

  **4. Effects часто используют не по назначению**

  Новички кладут в `useEffect` derived state или логику, которую можно посчитать во время render.

  ```tsx
  // Часто лишнее
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  ```

  Лучше:

  ```tsx
  const fullName = `${firstName} ${lastName}`;
  ```

  Effects нужны для синхронизации с внешними системами: network, subscriptions, DOM APIs, timers, storage.

  **5. Excessive re-renders и identity problems**

  При каждом render создаются новые function/object/array references. Это нормально, пока они не передаются в memoized children или dependency arrays.

  ```tsx
  <ProductList filters={{ categoryId }} />
  ```

  Если `ProductList` обернут в `React.memo`, новый object будет ломать memoization. Иногда нужно `useMemo`, но не стоит memoize все подряд.

  **6. Custom hooks могут скрывать сложность**

  Custom hook улучшает reuse, но большой hook может спрятать много side effects, subscriptions и state transitions. Тогда компонент выглядит простым, но поведение становится неочевидным.

  **7. Сложнее напрямую выразить некоторые lifecycle-сценарии**

  В class components lifecycle names явно говорят "mount/update/unmount". В hooks нужно мыслить через synchronization и dependencies. Это мощнее, но требует дисциплины.

  Практический вывод: functional components — основной и предпочтительный подход в React, но они требуют хорошего понимания closures, dependency arrays, effect cleanup и render purity.

- What are class components?

  **Ответ:** Class component — класс, наследующий `React.Component` или `React.PureComponent`, с методом `render()` и lifecycle methods.

  ```tsx
  class Counter extends React.Component {
    state = { count: 0 };
    render() {
      return <button>{this.state.count}</button>;
    }
  }
  ```

- How is state managed in class components?

  **Ответ:** Через `this.state` и `this.setState()`. `setState` делает shallow merge object-form updates или принимает updater function.

- How are requests and side effects handled in class components?

  **Ответ:** Обычно requests запускали в `componentDidMount`, обновляли при изменении props в `componentDidUpdate`, а subscriptions чистили в `componentWillUnmount`.

- What are the advantages and disadvantages of class components?

  **Ответ:** Плюсы: явные lifecycle methods, зрелый legacy API. Минусы: `this` binding, сложный reuse stateful logic, lifecycle methods часто смешивают unrelated logic, меньше совместимости с modern hooks-подходом.

- Why are functional components generally preferred today?

  **Ответ:** Hooks дают state, effects, refs, context и memoization без классов. React ecosystem, документация и новые APIs ориентированы на function components, хотя class components все еще поддерживаются.

- What are props?

  **Ответ:** Props — входные данные компонента от parent. Они похожи на function arguments: компонент получает props и на их основе возвращает UI.

- Why are props read-only?

  **Ответ:** Props immutable с точки зрения child-компонента, чтобы data flow оставался предсказуемым: parent владеет данными, child их читает. Если child мутирует props, React не сможет надежно понять источник изменений.

- How can reverse data flow from child to parent be implemented?

  **Ответ:** Parent передает callback prop, child вызывает его с данными.

  ```tsx
  function Parent() {
    const [query, setQuery] = useState('');
    return <SearchInput value={query} onChange={setQuery} />;
  }

  function SearchInput({ value, onChange }) {
    return <input value={value} onChange={(event) => onChange(event.target.value)} />;
  }
  ```

- How does state work in React?

  **Ответ:** State — данные, изменение которых должно вызывать re-render компонента. React хранит state между renders и при update заново вызывает component function или `render()` class component.

- What is the difference between state in class and functional components?

  **Ответ:** В class state — объект `this.state`, `setState` делает shallow merge. В function components каждый `useState` хранит отдельное значение, setter заменяет значение целиком.

- How does setState() work?

  **Ответ:** `setState` ставит update в очередь. React batch-ит updates, пересчитывает next state и запускает render. В class components object update merge-ится, functional updater получает previous state.

  ```tsx
  setCount((count) => count + 1);
  ```

- Why is setState() asynchronous?

  **Ответ:** React откладывает и batch-ит updates, чтобы не делать render после каждого маленького изменения. Это позволяет оптимизировать rendering и согласовывать несколько updates в одном commit.

- How does the callback parameter of setState() work?

  **Ответ:** В class components `this.setState(partialState, callback)` вызывает callback после commit. В function components такого параметра нет; для реакции на committed state используют `useEffect`.

- What is batching in React?

  **Ответ:** Batching — объединение нескольких state updates в один render/commit. В React 18 automatic batching работает не только в React events, но и в promises/timeouts/native handlers, если приложение использует modern root.

- How do multiple setState() calls behave?

  **Ответ:** Несколько object updates могут перезаписать друг друга, если используют stale state. Functional updates применяются последовательно.

  ```tsx
  setCount(count + 1);
  setCount(count + 1); // обычно +1

  setCount((c) => c + 1);
  setCount((c) => c + 1); // +2
  ```

- What is the difference between synchronous and asynchronous state updates?

  **Ответ:** Synchronous update применяется сразу в рамках forced sync flow, например `flushSync`. Обычный state update планируется React, batch-ится и становится видимым после следующего commit. Читать state сразу после setter обычно нельзя как "новое значение".

- How many re-renders occur in different setState() scenarios and why?

  **Ответ:** В одном React event несколько setters обычно дают один render. Functional updates внутри batch тоже один render, но state считается последовательно. Updates в разных ticks/events обычно дают разные renders. `flushSync` может принудительно разделить renders.

- What are React lifecycle methods?

  **Ответ:** Lifecycle methods — методы class components, которые React вызывает на стадиях mounting, updating, unmounting и error handling. В function components большая часть lifecycle-поведения моделируется через `useEffect`/`useLayoutEffect`.

- What lifecycle methods exist in class components?

  **Ответ:** Основные lifecycle methods class components делятся на mounting, updating, unmounting и error handling.

  **Mounting**

  `constructor(props)` вызывается при создании instance. Обычно используется для initial state и binding methods. Side effects и requests здесь делать не стоит.

  ```tsx
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
  }
  ```

  `static getDerivedStateFromProps(props, state)` вызывается перед render на mount и update. Позволяет синхронизировать state с props, но нужен редко. Метод static, поэтому не имеет доступа к `this`.

  ```tsx
  static getDerivedStateFromProps(props, state) {
    if (props.userId !== state.previousUserId) {
      return { previousUserId: props.userId, selectedTab: 'profile' };
    }

    return null;
  }
  ```

  `render()` возвращает React nodes. Должен быть pure: без requests, subscriptions, timers и прямых DOM mutations.

  ```tsx
  render() {
    return <button>{this.state.count}</button>;
  }
  ```

  `componentDidMount()` вызывается после первого commit в DOM. Подходит для data fetching, subscriptions, timers, imperative DOM integrations.

  ```tsx
  componentDidMount() {
    this.subscription = store.subscribe(this.handleStoreChange);
    this.loadProducts();
  }
  ```

  **Updating**

  `shouldComponentUpdate(nextProps, nextState)` позволяет пропустить render, вернув `false`. Используется для performance optimization, но ошибка в сравнении может привести к stale UI.

  ```tsx
  shouldComponentUpdate(nextProps) {
    return nextProps.product.id !== this.props.product.id;
  }
  ```

  `getSnapshotBeforeUpdate(prevProps, prevState)` вызывается после render, но до того, как React применит DOM updates. Возвращенное значение передается третьим аргументом в `componentDidUpdate`. Используется редко, например для сохранения scroll position.

  ```tsx
  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.items.length < this.props.items.length) {
      return this.listRef.current.scrollHeight;
    }

    return null;
  }
  ```

  `componentDidUpdate(prevProps, prevState, snapshot)` вызывается после update commit. Подходит для requests на изменение props, синхронизации с внешними системами, работы с snapshot.

  ```tsx
  componentDidUpdate(prevProps) {
    if (prevProps.categoryId !== this.props.categoryId) {
      this.loadProducts();
    }
  }
  ```

  **Unmounting**

  `componentWillUnmount()` вызывается перед удалением component из DOM. Здесь чистят subscriptions, timers, pending requests, observers.

  ```tsx
  componentWillUnmount() {
    this.subscription?.unsubscribe();
    clearInterval(this.intervalId);
  }
  ```

  **Error handling**

  `static getDerivedStateFromError(error)` вызывается, когда child component выбросил ошибку во время render/lifecycle. Позволяет показать fallback UI.

  ```tsx
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  ```

  `componentDidCatch(error, info)` вызывается после ошибки и подходит для logging/reporting.

  ```tsx
  componentDidCatch(error, info) {
    reportError(error, info.componentStack);
  }
  ```

  Вместе эти методы используются для error boundary:

  ```tsx
  class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      reportError(error, info.componentStack);
    }

    render() {
      if (this.state.hasError) {
        return <p>Something went wrong.</p>;
      }

      return this.props.children;
    }
  }
  ```

  Важный момент для functional components: в стабильном React error boundary по-прежнему реализуется через class component, потому что API завязан на `static getDerivedStateFromError` и `componentDidCatch`. Hook вроде `useErrorBoundary` в самом React для создания boundary пока не является стандартной заменой этим lifecycle methods.

  Но это не мешает работать с functional components: обычно class-based `ErrorBoundary` просто оборачивает subtree, внутри которого могут быть любые function components.

  ```tsx
  function ProductPage() {
    return (
      <ErrorBoundary>
        <ProductDetails />
        <Recommendations />
      </ErrorBoundary>
    );
  }
  ```

  Если `ProductDetails` или `Recommendations` выбросят ошибку во время render, React покажет fallback из `ErrorBoundary`, а не сломает весь UI.

  На практике часто делают reusable boundary с props:

  ```tsx
  type ErrorBoundaryProps = {
    fallback: React.ReactNode;
    children: React.ReactNode;
  };

  type ErrorBoundaryState = {
    hasError: boolean;
  };

  class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
  > {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
      return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      reportError(error, info.componentStack);
    }

    render() {
      if (this.state.hasError) {
        return this.props.fallback;
      }

      return this.props.children;
    }
  }
  ```

  Использование:

  ```tsx
  <ErrorBoundary fallback={<p>Не удалось загрузить товар.</p>}>
    <ProductDetails />
  </ErrorBoundary>
  ```

  Если хочется работать в более "function-style" API, часто используют библиотеку `react-error-boundary`. Она предоставляет готовый class boundary под капотом, но API выглядит удобно для functional components:

  ```tsx
  import { ErrorBoundary } from 'react-error-boundary';

  function ProductErrorFallback({ error, resetErrorBoundary }) {
    return (
      <div role="alert">
        <p>Не удалось загрузить товар.</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Попробовать снова</button>
      </div>
    );
  }

  function ProductPage({ productId }: { productId: string }) {
    return (
      <ErrorBoundary
        FallbackComponent={ProductErrorFallback}
        resetKeys={[productId]}
      >
        <ProductDetails productId={productId} />
      </ErrorBoundary>
    );
  }
  ```

  Что error boundary ловит:

  - ошибки во время render child components;
  - ошибки в lifecycle methods child class components;
  - ошибки в constructors child class components.

  Что error boundary не ловит:

  - ошибки внутри event handlers;
  - ошибки в async callbacks: `setTimeout`, `Promise`, `fetch`;
  - ошибки на server-side rendering;
  - ошибки внутри самого error boundary.

  Для event handlers нужен обычный `try/catch` или перевод ошибки в state:

  ```tsx
  function SaveButton() {
    const [error, setError] = useState<Error | null>(null);

    async function handleClick() {
      try {
        await saveProduct();
      } catch (error) {
        setError(error as Error);
      }
    }

    if (error) {
      return <p>Save failed: {error.message}</p>;
    }

    return <button onClick={handleClick}>Save</button>;
  }
  ```

  Практическая рекомендация: ставить error boundaries на границах крупных UI-зон: route/page, widget, sidebar, product details, recommendations. Не нужно оборачивать каждый маленький компонент. Boundary должен изолировать поломку части интерфейса и дать пользователю понятный fallback.

  **Legacy unsafe methods**

  `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, `UNSAFE_componentWillUpdate` — старые lifecycle methods. Их не рекомендуют использовать, потому что они плохо совместимы с async/concurrent rendering. В legacy code они могут встречаться, но новый код лучше писать через безопасные lifecycle methods или function components с hooks.

- In what order are lifecycle methods executed?

  **Ответ:** Mount: `constructor` -> `getDerivedStateFromProps` -> `render` -> DOM commit -> `componentDidMount`. Update: `getDerivedStateFromProps` -> `shouldComponentUpdate` -> `render` -> `getSnapshotBeforeUpdate` -> DOM commit -> `componentDidUpdate`. Unmount: `componentWillUnmount`.

- What is the purpose of each lifecycle method?

  **Ответ:** `constructor` инициализирует state/bindings. `render` описывает UI. `componentDidMount` подходит для requests/subscriptions. `componentDidUpdate` реагирует на prop/state changes. `componentWillUnmount` чистит ресурсы. `shouldComponentUpdate` оптимизирует render. Error lifecycle methods строят error boundaries.

- How does runtime type checking work in React?

  **Ответ:** Runtime checking обычно делали через `prop-types`: во время development React проверяет props и выводит warnings. Это не заменяет TypeScript, потому что ошибки обнаруживаются только во время выполнения.

- What are defaultProps?

  **Ответ:** `defaultProps` задают значения props по умолчанию, если prop не передан. Для function components сегодня часто используют default parameters.

  ```tsx
  function Button({ variant = 'primary' }) {
    return <button className={variant} />;
  }
  ```

- What are PropTypes?

  **Ответ:** PropTypes — runtime validators для props.

  ```tsx
  ProductCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  };
  ```

- What are the static typing capabilities available for React?

  **Ответ:** Главный выбор сегодня — TypeScript. Он типизирует props, state, events, refs, context, reducers и API contracts на compile time. Flow тоже возможен, но встречается реже.

- Why are TypeScript or Flow used with React?

  **Ответ:** Они ловят ошибки до runtime: неправильные props, nullable values, неверные event types, нарушенные API contracts. В больших приложениях это дешевле, чем искать ошибки в браузере.

- What is PureComponent?

  **Ответ:** `React.PureComponent` — class component, который реализует shallow comparison props/state в `shouldComponentUpdate`. Если shallow values не изменились, render пропускается.

- Why was PureComponent introduced?

  **Ответ:** Чтобы уменьшать лишние renders class components без ручного `shouldComponentUpdate`. Он полезен для компонентов, которые получают immutable props/state.

- What is the difference between Component and PureComponent?

  **Ответ:** `Component` re-render-ится при каждом update parent/state, если не определить `shouldComponentUpdate`. `PureComponent` автоматически делает shallow compare. Если props содержат мутируемые объекты, `PureComponent` может не заметить изменение.

- Why do we need React.memo()?

  **Ответ:** `React.memo` — аналог shallow memoization для function components. Он пропускает render, если props shallow-equal.

  ```tsx
  const ProductRow = React.memo(function ProductRow({ product }) {
    return <li>{product.title}</li>;
  });
  ```

- How does React.memo() compare with PureComponent?

  **Ответ:** `React.memo` работает с function components и сравнивает props. `PureComponent` работает с class components и сравнивает props/state. `memo` можно дать custom compare function, но ее нужно использовать осторожно.

- What are refs in React?

  **Ответ:** Refs — способ получить mutable reference, чаще всего на DOM element или imperative API child-компонента. Изменение `ref.current` не вызывает render.

- Why do we need refs?

  **Ответ:** Для задач, которые нельзя удобно выразить declarative props: focus input, измерить DOM, scroll, интеграция с non-React library, хранение timer id или предыдущего значения.

- How do refs work?

  **Ответ:** `useRef(initialValue)` возвращает стабильный объект `{ current }`. React заполняет `current` DOM-ноды после commit и очищает при unmount.

  ```tsx
  const inputRef = useRef<HTMLInputElement>(null);
  return <input ref={inputRef} />;
  ```

- What is forwardRef()?

  **Ответ:** `forwardRef` позволяет parent передать ref внутрь custom component. Без него `ref` не является обычным prop.

  ```tsx
  const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return <input ref={ref} {...props} />;
  });
  ```

- What are common use cases for refs?

  **Ответ:** Focus management, text selection, media playback, scroll position, measuring layout, integrating charts/maps/editors, exposing imperative methods через `useImperativeHandle`.

- What is React Context?

  **Ответ:** Context — механизм передачи значения глубоко по дереву без prop drilling. Он состоит из provider и consumers.

  ```tsx
  const AuthContext = createContext<AuthState | null>(null);
  ```

- Why do we need Context?

  **Ответ:** Он полезен для данных, которые нужны многим компонентам: current user, theme, locale, feature flags, router state, dependency injection.

- How does Context work?

  **Ответ:** Provider кладет value в context, consumer через `useContext` читает ближайшее значение выше по дереву. Когда provider value меняется, consumers re-render-ятся.

  ```tsx
  <AuthContext.Provider value={auth}>
    <App />
  </AuthContext.Provider>
  ```

- What are common use cases for Context?

  **Ответ:** Auth state, theme, i18n, current organization/project, permissions, analytics clients, API clients, settings.

- What are the limitations of Context?

  **Ответ:** Context не является полноценным state manager. Частые изменения provider value могут re-render-ить много consumers. Для сложного client state нужны selectors, external store, Redux/Zustand/Jotai или разделение context по зонам.

- What are React Portals?

  **Ответ:** Portal рендерит React children в DOM container вне обычной DOM-иерархии parent-компонента, сохраняя принадлежность к React tree.

  ```tsx
  createPortal(<Modal />, document.getElementById('modal-root')!);
  ```

- Why do we need Portals?

  **Ответ:** Для модалок, tooltips, popovers, dropdowns, toasts, когда элемент должен визуально выходить за пределы parent container, не ломаться из-за `overflow: hidden` или `z-index`.

- How do Portals work?

  **Ответ:** React создает child tree как часть текущего React tree, но commit делает в другой DOM node. Context и event bubbling по React tree сохраняются.

- How do events bubble through Portals?

  **Ответ:** DOM-нода portal находится в другом месте, но React events bubble по React tree, а не только по physical DOM tree. Поэтому click внутри modal portal может всплыть к React parent, который его создал.

- What practical problems do Portals solve?

  **Ответ:** Modal layering, focus trap overlays, dropdown positioning, breaking out of clipping containers, global notifications, rendering tooltips near `document.body`.

- What is conditional rendering?

  **Ответ:** Conditional rendering — выбор, что отрисовать, на основе state/props.

  ```tsx
  return isLoggedIn ? <Dashboard /> : <Login />;
  ```

- What are Render Props?

  **Ответ:** Render prop — это паттерн, где компонент принимает функцию-prop и вызывает ее, чтобы caller сам решил, какой UI отрисовать. Компонент с render prop обычно отвечает за behavior/state, а внешний код отвечает за presentation.

  ```tsx
  <MouseTracker render={({ x, y }) => <Tooltip x={x} y={y} />} />
  ```

  Идея:

  ```txt
  Component owns logic/state
          ↓
  calls render function with data
          ↓
  caller returns JSX
  ```

  Пример: компонент отслеживает позицию мыши, но не знает, как именно ее показать.

  ```tsx
  type MousePosition = {
    x: number;
    y: number;
  };

  function MouseTracker({
    render,
  }: {
    render: (position: MousePosition) => React.ReactNode;
  }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    function handleMouseMove(event: React.MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
    }

    return (
      <div onMouseMove={handleMouseMove}>
        {render(position)}
      </div>
    );
  }
  ```

  Использование:

  ```tsx
  <MouseTracker
    render={({ x, y }) => (
      <p>
        Mouse position: {x}, {y}
      </p>
    )}
  />
  ```

  Тот же behavior можно переиспользовать с другим UI:

  ```tsx
  <MouseTracker
    render={({ x, y }) => (
      <Tooltip style={{ left: x, top: y }}>
        Cursor is here
      </Tooltip>
    )}
  />
  ```

  Частые use cases:

  - shared behavior без HOC: mouse position, window size, permissions, feature flags;
  - data fetching component, где caller решает, как показать loading/error/success;
  - form field wrappers;
  - authorization gates;
  - reusable layout logic;
  - animation/state machine components.

  Пример data loader:

  ```tsx
  function ProductLoader({
    productId,
    children,
  }: {
    productId: string;
    children: (state: {
      product: Product | null;
      isLoading: boolean;
      error: Error | null;
    }) => React.ReactNode;
  }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setIsLoading(true);
      api.getProduct(productId)
        .then(setProduct)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }, [productId]);

    return children({ product, isLoading, error });
  }
  ```

  Использование:

  ```tsx
  <ProductLoader productId="p1">
    {({ product, isLoading, error }) => {
      if (isLoading) return <Spinner />;
      if (error) return <p>Failed to load product.</p>;
      if (!product) return null;

      return <ProductDetails product={product} />;
    }}
  </ProductLoader>
  ```

  Render prop не обязательно должен называться `render`. Часто используют `children` как функцию:

  ```tsx
  <AuthGate>
    {({ user }) => user ? <Dashboard user={user} /> : <Login />}
  </AuthGate>
  ```

  Плюсы:

  - хорошо отделяет logic от presentation;
  - caller получает полный контроль над JSX;
  - меньше проблем с prop name collisions, чем в HOC;
  - удобно типизировать contract между logic component и UI.

  Минусы:

  - может привести к вложенной "пирамиде" render functions;
  - новая inline function создается на каждый render, что иногда мешает memoization;
  - после появления hooks многие render props стали менее нужны.

  Сегодня во многих случаях вместо render props пишут custom hook:

  ```tsx
  function ProductPage({ productId }: { productId: string }) {
    const { product, isLoading, error } = useProduct(productId);

    if (isLoading) return <Spinner />;
    if (error) return <p>Failed to load product.</p>;

    return <ProductDetails product={product} />;
  }
  ```

  Но render props все еще полезны в библиотеках и компонентах, где нужно дать caller-у полный контроль над разметкой, не заставляя его использовать конкретный hook или структуру UI.

- What are Higher-Order Components (HOCs)?

  **Ответ:** HOC — функция, которая принимает компонент и возвращает новый компонент с дополнительным поведением.

  ```tsx
  const withAuth = (Component) => (props) =>
    isLoggedIn() ? <Component {...props} /> : <Navigate to="/login" />;
  ```

- How do custom HOCs work?

  **Ответ:** HOC оборачивает original component, может читать context, подписываться на store, инжектить props, обрабатывать loading/errors. Важно прокидывать props и ref/displayName при необходимости.

- When should Render Props be preferred over HOCs?

  **Ответ:** Render props удобны, когда caller должен контролировать JSX и composition. HOCs хороши для cross-cutting wrappers, но могут создавать wrapper hell и проблемы с типами/refs. Сегодня многие use cases решаются custom hooks.

- What is the difference between native DOM event handlers and React event handlers?

  **Ответ:** Native handler назначается напрямую на DOM node через `addEventListener` или DOM property и получает настоящий browser `Event`. React handler задается JSX prop-ом, например `onClick`, `onChange`, `onSubmit`, и получает React `SyntheticEvent`.

  Native DOM:

  ```ts
  const button = document.querySelector('button');

  button?.addEventListener('click', (event) => {
    console.log(event); // MouseEvent
  });
  ```

  React:

  ```tsx
  function SaveButton() {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      console.log(event); // SyntheticEvent wrapper
    }

    return <button onClick={handleClick}>Save</button>;
  }
  ```

  Главные отличия:

  - **Назначение handler-а:** native — через `addEventListener`, React — через JSX prop.
  - **Имена событий:** native — lowercase strings: `'click'`, `'input'`; React — camelCase props: `onClick`, `onInput`, `onChange`.
  - **Тип события:** native получает `Event`/`MouseEvent`/`KeyboardEvent`; React получает `SyntheticEvent`.
  - **Делегирование:** React обычно делегирует события на root container и сам вызывает нужные handlers по React tree.
  - **Batching:** state updates внутри React event handlers batch-ятся и участвуют в React scheduling/priority.
  - **Cross-browser normalization:** SyntheticEvent дает более единый API поверх различий браузеров.
  - **Propagation:** React propagation идет через React tree; для portals это особенно важно.

  `SyntheticEvent` — это обертка над native event. У него похожие методы:

  ```tsx
  function Form() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      event.stopPropagation();
    }

    return <form onSubmit={handleSubmit} />;
  }
  ```

  Если нужен настоящий browser event, он доступен через `event.nativeEvent`:

  ```tsx
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const nativeEvent = event.nativeEvent;
    console.log(nativeEvent instanceof MouseEvent);
  }
  ```

  Важный нюанс: в старых версиях React SyntheticEvent использовал pooling, поэтому нельзя было асинхронно читать event без `event.persist()`. В современных React версиях pooling убран, и это обычно не проблема.

  Когда использовать native listener в React:

  - подписка на `window`, `document`, `resize`, `scroll`, `visibilitychange`;
  - интеграция с non-React library;
  - события, которые не удобно повесить через JSX;
  - low-level performance/gesture cases.

  В таких случаях listener добавляют и удаляют в effect:

  ```tsx
  useEffect(() => {
    function handleResize() {
      console.log(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  ```

- How can context be lost in JavaScript event handlers?

  **Ответ:** В class components метод теряет `this`, если передать его как callback без binding.

  ```tsx
  <button onClick={this.handleClick}>Save</button>
  ```

  Если `handleClick` не bound, внутри может быть `this === undefined`.

- How can context be preserved in React applications?

  **Ответ:** Использовать arrow class fields, bind в constructor, function components с closures или `useCallback` при необходимости стабильной ссылки.

  ```tsx
  handleClick = () => {
    this.setState({ saved: true });
  };
  ```

- What is SyntheticEvent?

  **Ответ:** SyntheticEvent — React wrapper вокруг native browser event с нормализованным API: `target`, `currentTarget`, `preventDefault`, `stopPropagation`. Он помогает React поддерживать единое поведение между браузерами и управлять event system.

- Why does React use SyntheticEvent?

  **Ответ:** Для cross-browser consistency, event delegation, интеграции с batching/priority и uniform API. Исторически события еще pooling-ились, но в React 17 pooling убрали.

- Which events are supported by SyntheticEvent?

  **Ответ:** Mouse, keyboard, focus, form, pointer, touch, wheel, clipboard, composition, drag, media, animation, transition и другие browser events через JSX props вроде `onClick`, `onChange`, `onKeyDown`.

- What changed in event handling between React 17 and previous versions?

  **Ответ:** React 17 изменил event delegation: слушатели стали крепиться к root container, а не к `document`. Это упростило incremental upgrades и embedding нескольких React versions. Также SyntheticEvent pooling больше не используется; `event.persist()` стал практически не нужен.

- What types of events exist in React?

  **Ответ:** Form events (`onChange`, `onSubmit`), mouse/pointer (`onClick`, `onPointerMove`), keyboard (`onKeyDown`), focus (`onFocus`, `onBlur`), clipboard, drag/drop, media, animation/transition, wheel/touch и custom events через native APIs.

- How does the React event system work internally?

  **Ответ:** React делегирует event listeners на root, получает native event, определяет target fiber, собирает capture/bubble listeners по React tree, создает SyntheticEvent и вызывает handlers в правильном порядке с учетом priority/batching.

- What is the difference between controlled and uncontrolled components?

  **Ответ:** Controlled component хранит значение формы в React state. Uncontrolled component хранит значение в DOM, а React читает его через ref или submit.

  ```tsx
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  ```

- What are the advantages and disadvantages of controlled components?

  **Ответ:** Плюсы: single source of truth, easy validation, conditional UI, formatting, disabling submit. Минусы: больше renders, больше boilerplate, нужны аккуратные handlers для больших форм.

- What are the advantages and disadvantages of uncontrolled components?

  **Ответ:** Плюсы: меньше state-кода, хорошо для простых форм, file inputs, интеграций. Минусы: сложнее live validation, conditional state, синхронизация с UI и тестирование сложной логики.

- How do uncontrolled components work internally?

  **Ответ:** DOM сам хранит текущее значение input. React может задать initial value через `defaultValue`/`defaultChecked`, но дальше не контролирует каждое изменение. Значение читают через `ref.current.value`.

- How can custom forms be implemented in React?

  **Ответ:** Custom form в React обычно строится как controlled form: React хранит `values`, `errors`, `touched`, `isSubmitting`, а inputs получают `value` и `onChange`. Такой подход дает полный контроль над validation, disabled states, форматированием, server errors и submit flow.

  Минимальные части формы:

  - `values` — текущие значения полей;
  - `errors` — ошибки validation;
  - `touched` — поля, с которыми пользователь уже взаимодействовал;
  - `isSubmitting` — идет ли submit;
  - `handleChange` — обновляет values;
  - `handleBlur` — помечает поле touched;
  - `validate` — проверяет values;
  - `handleSubmit` — предотвращает default submit, валидирует, вызывает API;
  - `reset` — возвращает форму в initial state.

  ```tsx
  function LoginForm() {
    const [values, setValues] = useState({
      email: '',
      password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validate(nextValues = values) {
      const nextErrors: Record<string, string> = {};

      if (!nextValues.email) {
        nextErrors.email = 'Email is required';
      }

      if (nextValues.password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters';
      }

      return nextErrors;
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;

      setValues((currentValues) => ({
        ...currentValues,
        [name]: value,
      }));
    }

    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
      const { name } = event.target;

      setTouched((currentTouched) => ({
        ...currentTouched,
        [name]: true,
      }));
    }

    async function handleSubmit(event: React.FormEvent) {
      event.preventDefault();

      const validationErrors = validate();
      setErrors(validationErrors);
      setTouched({ email: true, password: true });

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      try {
        setIsSubmitting(true);
        await api.login(values);
      } catch (error) {
        setErrors({
          form: 'Invalid email or password',
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <form onSubmit={handleSubmit} noValidate>
        {errors.form ? <p role="alert">{errors.form}</p> : null}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
          />
        </label>
        {touched.email && errors.email ? <p>{errors.email}</p> : null}

        <label>
          Password
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.password && errors.password)}
          />
        </label>
        {touched.password && errors.password ? <p>{errors.password}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
  }
  ```

  Для нескольких полей удобно делать reusable handler через `name`, как в примере выше. Для checkbox/select нужны небольшие отличия:

  ```tsx
  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setValues((currentValues) => ({
      ...currentValues,
      [target.name]: value,
    }));
  }
  ```

  Если форма становится больше, логику часто выносят в custom hook:

  ```tsx
  function useForm<TValues>({
    initialValues,
    validate,
    onSubmit,
  }: {
    initialValues: TValues;
    validate: (values: TValues) => Partial<Record<keyof TValues, string>>;
    onSubmit: (values: TValues) => Promise<void>;
  }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
      event.preventDefault();

      const nextErrors = validate(values);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }

    return {
      values,
      setValues,
      errors,
      isSubmitting,
      handleSubmit,
    };
  }
  ```

  Реальные нюансы:

  - client validation нужна для UX, но server validation все равно обязательна;
  - server errors нужно маппить либо в `form` error, либо в field errors;
  - file inputs обычно uncontrolled, потому что их value нельзя безопасно контролировать;
  - для больших форм controlled inputs могут давать много renders, поэтому используют React Hook Form, Final Form или оптимизацию по полям;
  - accessibility важна: `label`, `aria-invalid`, `aria-describedby`, `role="alert"`;
  - submit button нужно блокировать на время submit, чтобы избежать double submit;
  - после успешного submit форму можно reset-ить или оставить значения, зависит от сценария.

  Accessibility в формах означает, что форма понятна не только визуально, но и для клавиатуры, screen readers и других assistive technologies. Главное правило: пользователь должен понимать, что это за поле, какая в нем ошибка и как исправить ввод.

  Хороший field pattern:

  ```tsx
  function EmailField({
    value,
    error,
    onChange,
    onBlur,
  }: {
    value: string;
    error?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  }) {
    const inputId = 'email';
    const errorId = 'email-error';

    return (
      <div>
        <label htmlFor={inputId}>Email</label>
        <input
          id={inputId}
          name="email"
          type="email"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete="email"
        />
        {error ? (
          <p id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
  ```

  Что здесь важно:

  - `label htmlFor` связан с `input id`, поэтому screen reader озвучит название поля;
  - `aria-invalid` сообщает, что поле сейчас невалидно;
  - `aria-describedby` связывает input с текстом ошибки;
  - `role="alert"` просит assistive technology озвучить появившуюся ошибку;
  - `autoComplete` помогает браузеру и password managers;
  - настоящий `<button type="submit">` доступнее, чем кликабельный `<div>`.

  Для общей ошибки формы можно использовать отдельный alert:

  ```tsx
  {errors.form ? (
    <div role="alert" aria-live="polite">
      {errors.form}
    </div>
  ) : null}
  ```

  Дополнительные правила:

  - не полагаться только на цвет ошибки, добавлять текст;
  - сохранять нормальный keyboard flow: Tab, Shift+Tab, Enter;
  - после неуспешного submit можно переводить focus на первую ошибку или summary ошибок;
  - disabled button не всегда лучший UX, иногда лучше оставить кнопку активной и объяснить ошибку;
  - loading state должен быть доступен: текст `Logging in...`, `aria-busy` или status region;
  - custom select/checkbox/radio нужно делать особенно аккуратно, потому что native элементы уже имеют accessibility из коробки.

- How do Formik and React Final Form work?

  **Ответ:** Они управляют form state, validation, touched/dirty flags, submit lifecycle и field subscriptions. Formik хранит форму в React state/context. React Final Form использует subscription model, чтобы re-render-ить только заинтересованные поля.

- How does form validation work?

  **Ответ:** Validation может быть synchronous, asynchronous, field-level или form-level. Часто используют schema validators вроде Yup/Zod. Валидация запускается на change, blur, submit или вручную.

- What is the lifecycle of a form library?

  **Ответ:** Initialize values -> register fields -> handle change/blur -> validate -> show errors/touched -> submit -> set submitting -> process API result -> reset/update errors/success. Хорошая library минимизирует renders и сохраняет predictable state.

- How does event bubbling work in React?

  **Ответ:** Bubbling — событие сначала обрабатывается на target, потом поднимается к ancestors. В React это происходит через synthetic event system и React tree. Capture-фаза доступна через `onClickCapture`.

- How does bubbling work through components?

  **Ответ:** Components не являются DOM-нормами, но их rendered DOM участвует в event path. React сопоставляет DOM target с fiber и вызывает handlers у parent components, если они отрисовали ancestor elements.

- How does bubbling work through Portals?

  **Ответ:** В portal событие физически происходит в другой DOM ветке, но React bubbles его по React parent tree. Это удобно для modal close handlers, но иногда требует `event.stopPropagation()`.

- Why are keys required in React lists?

  **Ответ:** `key` помогает React сопоставить элементы списка между renders. Без стабильных keys React использует позицию, что может ломать state, focus и animations при reorder/delete/insert.

- How do keys affect reconciliation?

  **Ответ:** Если `key` и `type` совпали, React переиспользует fiber/component state. Если key изменился, React считает элемент новым, unmount-ит старый и mount-ит новый.

- How does shouldComponentUpdate() work?

  **Ответ:** `shouldComponentUpdate(nextProps, nextState)` в class component возвращает boolean. `false` пропускает render subtree. Используют для optimization, но ошибка в сравнении может привести к stale UI.

- When should Component, PureComponent, React.memo(), and memoization be used?

  **Ответ:** `Component` — базовый legacy class. `PureComponent` — class с shallow compare. `React.memo` — function component optimization. Memoization нужна для дорогих renders/derived values/stable callbacks, но только после понимания bottleneck.

- How can unnecessary re-renders be avoided?

  **Ответ:** Локализовать state, не поднимать его слишком высоко, использовать stable keys, `React.memo`, `useMemo`, `useCallback`, context splitting, selectors, virtualization, avoid inline object props when memoized children depend on identity.

- How can React performance bottlenecks be profiled?

  **Ответ:** React DevTools Profiler показывает commits, render duration, why components rendered. Browser Performance panel помогает увидеть scripting/layout/paint. Для production используют monitoring и user timing/APM.

- What are Reselect and Recompose?

  **Ответ:** Reselect — library для memoized selectors, чаще в Redux. Recompose — legacy utility library для HOCs в эпоху до hooks; сейчас почти не нужна.

- Why are they used?

  **Ответ:** Reselect предотвращает повторные дорогие вычисления derived data и стабилизирует references. Recompose раньше помогал строить HOC composition: `withState`, `withHandlers`, `compose`.

- How do they work internally?

  **Ответ:** Reselect запоминает последние inputs и output; если inputs по reference equality не изменились, возвращает cached result. Recompose строит функции-обертки вокруг компонентов, передавая дополнительные props.

- What is virtualization?

  **Ответ:** Virtualization — rendering только видимой части большого списка/таблицы плюс небольшой overscan. Вместо 10 000 DOM nodes на странице может быть 30-100.

- Why is virtualization needed?

  **Ответ:** Большие списки замедляют render, layout, paint и memory. Virtualization сохраняет responsive UI при таблицах заказов, каталогах, logs, chats.

- How do virtualization libraries work?

  **Ответ:** Library знает высоту элементов или измеряет ее, создает scroll container с total height, а видимые rows позиционирует через absolute transform. Примеры: `react-window`, `react-virtualized`, TanStack Virtual.

- How does virtualization improve rendering performance?

  **Ответ:** Она уменьшает количество mounted components/DOM nodes и объем reconciliation. Скролл становится дешевле, но появляются trade-offs: сложнее dynamic heights, accessibility, browser find, sticky elements.

- What is the difference between useMemo() and useCallback()?

  **Ответ:** `useMemo` memoizes вычисленное значение, `useCallback` memoizes function reference. `useCallback(fn, deps)` примерно равен `useMemo(() => fn, deps)`.

- When should useMemo() be used?

  **Ответ:** Для дорогих derived computations или стабильных object/array props, которые идут в memoized child.

  ```tsx
  const filtered = useMemo(() => products.filter(matchesQuery), [products, query]);
  ```

- When should useCallback() be used?

  **Ответ:** Когда stable function identity важна: memoized child, dependency of another hook, subscription cleanup, event handler passed deep.

  ```tsx
  const addToCart = useCallback((id: string) => dispatch(cartAdded(id)), [dispatch]);
  ```

- How can excessive memoization be avoided?

  **Ответ:** Не memoize все подряд. Сначала измерить. Memoization имеет цену: dependency tracking, memory, cognitive overhead. Часто лучше локализовать state, split components и avoid expensive renders.

- What is lazy loading in React?

  **Ответ:** Lazy loading — загрузка кода/данных только когда они нужны. В React для компонентов используют `React.lazy` и `Suspense`.

- Why is lazy loading useful?

  **Ответ:** Она уменьшает initial bundle, ускоряет first load и позволяет грузить admin pages, charts, editors, product detail modules только при переходе пользователя.

- How does React.lazy() work?

  **Ответ:** `lazy(load)` принимает функцию, возвращающую dynamic import. React вызывает ее при первом render lazy component, ждет promise и рендерит `default` export.

  ```tsx
  const AdminPage = lazy(() => import('./AdminPage'));
  ```

- How does Suspense work?

  **Ответ:** `Suspense` показывает fallback, пока child subtree "suspends", например lazy component еще грузится. В React frameworks Suspense также используется для data loading patterns.

  ```tsx
  <Suspense fallback={<Spinner />}>
    <AdminPage />
  </Suspense>
  ```

- What is Concurrent Mode?

  **Ответ:** "Concurrent Mode" — старое название набора возможностей concurrent rendering. В React 18 нет отдельного `<ConcurrentMode>` для обычного использования; concurrent behavior включается modern root (`createRoot`) и APIs вроде transitions/Suspense.

- What problems does Concurrent Mode solve?

  **Ответ:** Он помогает не блокировать UI тяжелыми renders, делает updates interruptible, позволяет показывать stale UI while rendering fresh UI, уменьшает jarring loading states и поддерживает better SSR/hydration patterns.

- What concurrent rendering APIs exist?

  **Ответ:** `createRoot`, `hydrateRoot`, `startTransition`, `useTransition`, `useDeferredValue`, `Suspense`, streaming SSR APIs. Некоторые новые experimental/canary APIs зависят от версии React.

- What UI patterns can be implemented using Concurrent features?

  **Ответ:** Non-blocking navigation, responsive search with deferred results, tab switching without hiding old content, progressive loading with Suspense, streaming server-rendered pages, selective hydration.

- What is tree shaking?

  **Ответ:** Tree shaking — удаление неиспользуемого кода из bundle на основе ES modules static imports/exports. Работает лучше с side-effect-free modules.

- What is code splitting?

  **Ответ:** Code splitting делит bundle на chunks, которые можно грузить по требованию. Обычно делается через dynamic `import()` и route-level lazy loading.

- How does lazy loading affect bundle size?

  **Ответ:** Общий объем кода приложения не исчезает, но initial bundle уменьшается. Пользователь загружает меньше JS на первом экране, а дополнительные chunks приходят позже.

- What are chunks?

  **Ответ:** Chunks — отдельные JS/CSS файлы, которые bundler генерирует из entry points и dynamic imports. Browser может кешировать chunks независимо.

- How can Webpack bundles be optimized?

  **Ответ:** Production mode, code splitting, tree shaking, minification, splitChunks/vendor chunks, analyzing bundle, removing heavy dependencies, using modern builds, asset compression, long-term caching.

- What is import cost?

  **Ответ:** Import cost — сколько JS добавляет dependency/import в bundle. Например импорт всей utility library может быть дороже, чем импорт одной функции из modular package.

- How does caching affect frontend performance?

  **Ответ:** HTTP caching и hashed filenames позволяют браузеру переиспользовать chunks. Хорошая стратегия: `index.html` кешировать осторожно, static assets с content hash кешировать долго.

- What React tools help optimize bundle size?

  **Ответ:** React DevTools Profiler для render cost, bundle analyzers для JS size, source-map-explorer, Webpack Bundle Analyzer, Lighthouse, framework-level reports Next.js/Vite plugins.

- How are React DevTools used?

  **Ответ:** React DevTools показывают component tree, props, state, hooks, context, owners. Profiler показывает commits и render durations.

- How are Redux DevTools used?

  **Ответ:** Redux DevTools показывают action history, state diff, time travel, dispatched payloads. Это помогает debug-ить reducers, middleware и async flows.

- How can component state and props be inspected?

  **Ответ:** В React DevTools выбрать компонент в tree и посмотреть props/hooks/state/context. В browser console можно использовать selected component helpers, если DevTools их поддерживает.

- How can component performance be profiled?

  **Ответ:** В React DevTools Profiler нажать record, выполнить user flow, остановить запись и смотреть expensive commits/components. Важно профилировать production-like build, потому что dev mode и StrictMode искажают цифры.

- What are Service Workers?

  **Ответ:** Service Worker — script, который браузер запускает отдельно от page thread. Он может перехватывать network requests, кешировать assets, работать с push notifications и background sync.

- Why are Service Workers useful?

  **Ответ:** Для offline mode, PWA installability, asset caching, faster repeat visits, push notifications, background sync. В React это обычно часть PWA setup, не React-specific API.

- How do Service Workers work?

  **Ответ:** Page регистрирует SW. Browser устанавливает его, активирует и затем направляет matching fetch requests через `fetch` event. SW может вернуть response из cache или network.

- How are Service Workers registered?

  **Ответ:** Через `navigator.serviceWorker.register('/service-worker.js')` в браузере с HTTPS или localhost.

  ```ts
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  ```

- Why might a Service Worker fail to register?

  **Ответ:** Не HTTPS, неверный path/scope, 404 или wrong MIME type, syntax error в SW file, blocked browser settings, старый unsupported browser, cache конфликт при обновлении.

- How does caching work with Service Workers?

  **Ответ:** Через Cache Storage API. SW может использовать стратегии cache-first, network-first, stale-while-revalidate. Для API responses нужно быть осторожным с auth/user-specific data.

- What is ReactDOMServer?

  **Ответ:** `react-dom/server` — renderer для генерации HTML на сервере. Он превращает React tree в HTML string/stream для SSR или static rendering.

- What is hydration?

  **Ответ:** Hydration — процесс, когда React на клиенте подключается к уже существующему server-rendered HTML, навешивает event handlers и строит client Fiber tree без полной перерисовки DOM.

- How does server-side rendering work in React?

  **Ответ:** Сервер получает request, рендерит React tree в HTML, отправляет HTML браузеру, браузер показывает content до загрузки JS, затем client bundle делает hydration и UI становится интерактивным.

- What do renderToString(), renderToStaticMarkup(), renderToNodeStream(), and renderToStaticNodeStream() do?

  **Ответ:** `renderToString` генерирует HTML для hydration. `renderToStaticMarkup` генерирует HTML без React hydration attributes. `renderToNodeStream` и `renderToStaticNodeStream` — legacy streaming APIs. В React 18 чаще используют `renderToPipeableStream` для Node.js и `renderToReadableStream` для Web Streams.

- How does SSR work internally?

  **Ответ:** Server renderer проходит React tree, вызывает components, формирует HTML chunks, учитывает Suspense boundaries и stream. На клиенте `hydrateRoot` сопоставляет HTML с React tree и attaches handlers.

- How does Next.js implement SSR?

  **Ответ:** Next.js строит routing, data fetching, bundling и rendering pipeline вокруг React. Он может делать SSR per request, static generation, incremental regeneration, streaming и React Server Components в App Router.

- How does Gatsby implement SSR and static rendering?

  **Ответ:** Gatsby в основном генерирует static HTML на build time из React pages и data layer, затем hydrated React app берет управление на клиенте. SSR APIs могут кастомизировать HTML и render.

- What are Jest and Enzyme used for?

  **Ответ:** Jest — test runner/assertion/mocking framework. Enzyme — legacy utility для shallow/mount rendering React components. Сегодня чаще используют React Testing Library, потому что она тестирует поведение через DOM/user interactions.

- How are React components tested?

  **Ответ:** Рендерят компонент, имитируют user actions, проверяют visible output и side effects.

  ```tsx
  render(<LoginForm />);
  await user.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  ```

- How are utilities tested?

  **Ответ:** Как чистые функции: вход -> выход, edge cases, errors. Такие тесты быстрые и не требуют DOM.

- How are HOCs and modals tested?

  **Ответ:** HOC тестируют через wrapped dummy component и проверяют injected behavior. Modals тестируют через DOM/portal root: visible content, focus, close on Escape/backdrop, callbacks.

- What test patterns are commonly used in React?

  **Ответ:** Arrange-Act-Assert, testing behavior over implementation, mock network with MSW, accessible queries, user-event вместо raw fireEvent, avoid testing private state, integration tests for workflows.

- What is the Testing Pyramid?

  **Ответ:** Модель баланса тестов: много unit tests, меньше integration tests, еще меньше E2E tests. Чем выше уровень, тем тест дороже и медленнее, но больше confidence.

- What is TDD?

  **Ответ:** Test-Driven Development: сначала написать failing test, затем минимальный код для pass, потом refactor. В React это полезно для hooks, reducers, forms, business components.

- What is snapshot testing?

  **Ответ:** Snapshot test сохраняет serialized output компонента/функции и сравнивает будущие результаты с ним.

- Why is snapshot testing useful?

  **Ответ:** Быстро ловит неожиданные структурные изменения в UI output, полезен для стабильных presentational components, serializers, generated configs.

- What are the limitations of snapshot testing?

  **Ответ:** Snapshots часто становятся шумными, легко обновляются без review, плохо проверяют поведение и accessibility. Они не заменяют interaction tests.

- What are E2E tests?

  **Ответ:** End-to-end tests запускают приложение как пользователь: browser открывает страницу, кликает, вводит данные, проверяет результат через UI и backend.

- What is the difference between unit, integration, and E2E testing?

  **Ответ:** Unit тестирует маленький модуль изолированно. Integration тестирует взаимодействие нескольких частей. E2E тестирует полный user flow через реальный/почти реальный runtime.

- How does Cypress work?

  **Ответ:** Cypress запускает тесты в браузере рядом с приложением, управляет DOM/network/time, дает retry assertions, screenshots/videos. Он удобен для E2E и component testing.

- What tools are commonly used for E2E testing?

  **Ответ:** Playwright, Cypress, Selenium/WebDriver, WebdriverIO. Для modern frontend часто выбирают Playwright или Cypress.

- How does React Router work?

  **Ответ:** React Router синхронизирует URL/history с React state и выбирает, какие route components рендерить. Он не делает full page reload для client-side navigation.

- What problems does React Router solve?

  **Ответ:** URL-based navigation, nested routes, route params, redirects, protected routes, data loading APIs, back/forward integration, links without reload.

- What are Route, Switch, Link, and Redirect used for?

  **Ответ:** В React Router v5 `Route` сопоставляет path с component, `Switch` выбирает первый match, `Link` меняет URL без reload, `Redirect` перенаправляет. В v6 `Switch` заменен на `Routes`, `Redirect` на `Navigate`.

- What are BrowserRouter and StaticRouter?

  **Ответ:** `BrowserRouter` использует browser History API на клиенте. `StaticRouter` используют для SSR/static rendering, где location задается извне и browser history недоступен.

- How do routing hooks work?

  **Ответ:** Hooks читают router context: `useParams`, `useNavigate`, `useLocation`, `useSearchParams`, data router hooks. Они позволяют компонентам работать с URL без prop drilling.

- How can custom routing hooks be implemented?

  **Ответ:** Custom hook может обернуть стандартные router hooks и дать domain API.

  ```tsx
  function useProductId() {
    const { productId } = useParams();
    if (!productId) throw new Error('Missing productId');
    return productId;
  }
  ```

- How can a simple router be implemented from scratch?

  **Ответ:** Минимальный router хранит `location.pathname`, слушает `popstate`, перехватывает clicks на links и выбирает component по path. В production лучше использовать готовый router из-за nested routes, accessibility и edge cases.

- What is the difference between React routing and native browser routing?

  **Ответ:** Native routing запрашивает новый document с сервера. React client routing меняет URL через History API и перерисовывает часть UI в текущем document.

- How does client-side routing work internally?

  **Ответ:** `history.pushState` меняет URL без reload, router обновляет state/context, React рендерит matching route. Back/forward вызывают `popstate`, router снова пересчитывает match.

- How do Axios and Fetch differ?

  **Ответ:** `fetch` встроен в браузер, promise не rejected на HTTP 4xx/5xx, требует ручного JSON parsing. Axios — library с interceptors, automatic JSON transform, timeout helpers, older browser conveniences, cancellation support.

- How should server communication be organized in React applications?

  **Ответ:** Вынести API calls в services/client layer, типизировать DTO, централизовать auth headers/errors, использовать hooks/query libraries для loading/cache/retry. UI не должен знать детали endpoint-ов.

- How does server communication differ in React and React + Redux applications?

  **Ответ:** В plain React server state можно держать в component/hooks или React Query/SWR. В Redux async flows идут через thunks/sagas/listeners, data попадает в store. Сегодня server cache часто лучше хранить в TanStack Query/RTK Query, а Redux оставить для client state.

- What is a mock server?

  **Ответ:** Mock server имитирует backend API для разработки и тестов. Он возвращает predictable responses без реального backend.

- Why are mock servers used?

  **Ответ:** Чтобы frontend мог развиваться до готовности backend, тесты были стабильными, edge cases легко воспроизводились, а API contracts проверялись раньше.

- How do json-server and json-graphql-server work?

  **Ответ:** `json-server` берет JSON файл и поднимает REST endpoints. `json-graphql-server` генерирует GraphQL schema/resolvers из JSON-like данных. Они хороши для prototypes, не для production.

- Why are WebSockets used in React applications?

  **Ответ:** Для realtime updates: chat, notifications, order status, live dashboards, collaborative editing, market data. WebSocket держит постоянное двустороннее соединение.

- How are WebSockets integrated into React?

  **Ответ:** Обычно connection создают в custom hook/effect, подписываются на messages, обновляют state/store, чистят connection на unmount.

  ```tsx
  function useOrderUpdates(orderId: string) {
    const [status, setStatus] = useState<string>();

    useEffect(() => {
      const socket = new WebSocket(`wss://api.example.com/orders/${orderId}`);
      socket.onmessage = (event) => setStatus(JSON.parse(event.data).status);
      return () => socket.close();
    }, [orderId]);

    return status;
  }
  ```

- How do WebSockets work internally?

  **Ответ:** Browser начинает HTTP request с `Upgrade: websocket`. После handshake соединение становится persistent TCP channel, где обе стороны могут отправлять frames до закрытия.

- What libraries are commonly used for WebSocket communication?

  **Ответ:** Native `WebSocket`, Socket.IO, `ws` на Node.js, SockJS, SignalR, GraphQL subscriptions clients. Выбор зависит от fallback-ов, rooms/reconnect semantics, protocol и backend stack.

- What is Redux?

  **Ответ:** Redux — predictable state container. Он хранит global state в одном store, изменяет его через actions и reducers, а UI читает state через selectors.

- Why is Redux used?

  **Ответ:** Для сложного shared client state, time-travel debugging, predictable updates, middleware, consistent architecture в больших командах. Не каждый React app нуждается в Redux.

- How does Redux work internally?

  **Ответ:** `dispatch(action)` отправляет plain object в reducer tree. Reducers получают previous state и action, возвращают next state. Store сохраняет next state и уведомляет subscribers.

- What are the core Redux entities?

  **Ответ:** Store, actions, reducers, dispatch, selectors, middleware. В Redux Toolkit также slices, `configureStore`, `createSlice`, thunks/listener middleware.

- What is connect() in React Redux?

  **Ответ:** `connect` — HOC из React Redux, который подписывает component на store и передает selected state/dispatch props. Сейчас часто используют hooks `useSelector` и `useDispatch`.

- Why was connect() introduced?

  **Ответ:** Он позволял отделять presentational components от container components, оптимизировать subscriptions и скрывать store access за declarative mapping functions.

- What role does connect() play in application architecture?

  **Ответ:** `connect(mapStateToProps, mapDispatchToProps)` связывает UI с Redux store. Он инкапсулирует selection и action dispatching на границе container component.

- What are Redux actions?

  **Ответ:** Actions — plain objects, описывающие событие, которое произошло. Обычно имеют `type` и payload.

  ```ts
  { type: 'cart/itemAdded', payload: { productId: 'p1' } }
  ```

- How do actions work?

  **Ответ:** Component или middleware dispatch-ит action. Store передает action reducers. Reducers решают, как изменить state. Middleware может логировать, делать async requests или трансформировать flow.

- What is a reducer?

  **Ответ:** Reducer — pure function `(state, action) => nextState`. Он описывает state transition без side effects.

- What rules should reducers follow?

  **Ответ:** Не мутировать state напрямую, не делать async requests, не генерировать random/time values внутри, возвращать new state для изменений и previous state для неизвестных actions.

- How are reducers implemented using switch/case?

  **Ответ:** Классический reducer выбирает logic по `action.type`.

  ```ts
  function cartReducer(state = initialState, action) {
    switch (action.type) {
      case 'cart/itemAdded':
        return { ...state, items: [...state.items, action.payload] };
      default:
        return state;
    }
  }
  ```

- How does Redux Toolkit simplify reducers?

  **Ответ:** `createSlice` генерирует actions/reducer и использует Immer, поэтому можно писать "mutating" syntax, а реально создается immutable update.

  ```ts
  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      itemAdded(state, action) {
        state.items.push(action.payload);
      },
    },
  });
  ```

- How can reducers follow the Open/Closed Principle?

  **Ответ:** Разделять reducers по slices/features и комбинировать их. Новая feature добавляет новый slice, а не правит один огромный reducer. Также можно использовать builder callbacks для extra reducers.

- What is middleware in Redux?

  **Ответ:** Middleware — функции между dispatch и reducer. Они перехватывают actions, могут логировать, запускать async work, dispatch-ить новые actions.

- Why is middleware needed?

  **Ответ:** Reducers должны быть pure. Middleware выносит side effects: HTTP requests, analytics, logging, WebSocket, persistence, routing side effects.

- How can custom middleware be implemented?

  **Ответ:** Middleware имеет форму `store => next => action`.

  ```ts
  const logger = (store) => (next) => (action) => {
    console.log('dispatch', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
  };
  ```

- What are selectors?

  **Ответ:** Selectors — функции, которые читают или вычисляют данные из state.

  ```ts
  const selectCartItems = (state) => state.cart.items;
  ```

- Why are selectors used?

  **Ответ:** Они инкапсулируют state shape, переиспользуют derived logic, упрощают refactoring и могут memoize дорогие вычисления.

- How can complex selectors be implemented?

  **Ответ:** Через Reselect/RTK `createSelector`: inputs selectors + result function.

  ```ts
  const selectCartTotal = createSelector(
    [selectCartItems],
    (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  ```

- What is redux-form?

  **Ответ:** `redux-form` — legacy library, которая хранит form state в Redux store. Сейчас чаще выбирают React Hook Form, Formik или Final Form, потому что не весь form state нужно делать global.

- How does redux-form work?

  **Ответ:** Она регистрирует fields, dispatch-ит actions при change/blur/focus, хранит values/errors/touched/submitting в Redux и подключает форму через HOC.

- What is its API?

  **Ответ:** Основные API: `reduxForm`, `Field`, `FieldArray`, form-level validation, async validation, `handleSubmit`, selectors. Примерно:

  ```tsx
  export default reduxForm({ form: 'login' })(LoginForm);
  ```

- What are the advantages and disadvantages of redux-form?

  **Ответ:** Плюсы: centralized form state, Redux DevTools, integration with Redux. Минусы: много actions/renders, boilerplate, global store pollution, legacy status.

- What is MobX?

  **Ответ:** MobX — state management library на основе observable state и automatic reactions. UI re-render-ится, когда observables, прочитанные во время render, изменяются.

- How does MobX differ from Redux?

  **Ответ:** Redux использует explicit actions/reducers/immutable updates. MobX более reactive и mutable-friendly: изменяешь observable, observers обновляются автоматически. Redux проще трассировать, MobX часто требует дисциплины для предсказуемости.

- What are Redux Saga and Redux Thunk?

  **Ответ:** Redux Thunk позволяет dispatch-ить функции для async logic. Redux Saga использует generator functions и effects для описания сложных async workflows: cancellation, retries, races, background tasks.

- What problems do they solve?

  **Ответ:** Они выносят side effects из reducers: HTTP requests, orchestration, dependent actions, polling, optimistic updates, cancellation.

- What are Apollo and Relay?

  **Ответ:** Apollo Client и Relay — GraphQL clients для React. Они выполняют queries/mutations/subscriptions, кешируют normalized data и связывают GraphQL responses с UI.

- How do Apollo and Relay work with GraphQL?

  **Ответ:** Component описывает query, client отправляет GraphQL operation, получает typed data, normalizes cache по entity ids, обновляет subscribed components при изменениях.

- What is required on the GraphQL server side?

  **Ответ:** GraphQL schema, resolvers, data sources, auth, pagination, error policy, subscriptions if needed. Для хорошего client cache нужны стабильные IDs и типы.

- What are React Hooks?

  **Ответ:** Hooks — функции React API, которые позволяют function components использовать state, effects, context, refs, reducers и другие возможности React.

- Why were Hooks introduced?

  **Ответ:** Чтобы переиспользовать stateful logic без HOCs/render props, уменьшить class boilerplate и группировать related logic в одном effect/hook вместо разнесения по lifecycle methods.

- What are the advantages of Hooks?

  **Ответ:** Better composition, custom hooks, no `this`, меньше wrapper components, easier testing of pure logic, closer grouping of setup/cleanup.

- Why can't Hooks be used inside loops, conditions, or nested functions?

  **Ответ:** React сопоставляет hook state по порядку вызовов. Если порядок меняется между renders, React прочитает неправильный state/effect slot. Поэтому hooks вызываются только на top level component/custom hook.

- How can branching logic be implemented while following the Rules of Hooks?

  **Ответ:** Вызвать hook всегда, а условие поместить внутрь effect/callback или возвращаемой логики.

  ```tsx
  useEffect(() => {
    if (!enabled) return;
    return subscribe();
  }, [enabled]);
  ```

- How can custom Hooks be written?

  **Ответ:** Custom hook — функция с именем `use...`, которая вызывает другие hooks и возвращает reusable state/behavior.

  ```tsx
  function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
  }
  ```

- How can Hooks be optimized?

  **Ответ:** Правильные dependency arrays, splitting effects by responsibility, `useMemo`/`useCallback` только для реальных identity/performance needs, avoiding derived state, using refs for mutable non-render data, profiling before optimization.

- What lifecycle methods can useEffect() replace?

  **Ответ:** `useEffect` может покрыть `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` через setup и cleanup. Но это не 1:1 mapping; эффекты должны описывать synchronization with external systems.

- What is the purpose of the dependency array?

  **Ответ:** Dependency array говорит React, когда effect/memo/callback нужно пересчитать. Все reactive values из component scope, используемые внутри, должны быть dependencies.

- How can subscriptions and side effects be cleaned up?

  **Ответ:** Effect может вернуть cleanup function. React вызывает ее перед следующим запуском effect и при unmount.

  ```tsx
  useEffect(() => {
    const unsubscribe = store.subscribe(forceUpdate);
    return unsubscribe;
  }, []);
  ```

- How do useState() and useReducer() work?

  **Ответ:** `useState` хранит одно значение и setter. `useReducer` хранит state, обновляемый reducer-ом через dispatch actions. Оба привязаны к hook slot текущего fiber.

- What arguments do useState() and useReducer() accept?

  **Ответ:** `useState(initialState | initializerFn)`. `useReducer(reducer, initialArg, init?)`. Lazy initializer полезен для дорогого initial state.

- When should useState() be used?

  **Ответ:** Для локального простого state: input value, boolean open/closed, selected tab, pagination page.

- When should useReducer() be used?

  **Ответ:** Для state с несколькими связанными transitions, сложной form logic, state machine-like flows, undo/redo, когда next state зависит от action.

- When should each built-in React Hook be used?

  **Ответ:** `useState` используют для local state, `useReducer` — для сложных transitions, `useEffect` — для synchronization with external systems, `useLayoutEffect` — для layout reads/writes до paint, `useInsertionEffect` — для CSS-in-JS insertion до layout effects, `useMemo` — для memoized value, `useCallback` — для stable function, `useRef` — для mutable refs, `useContext` — для context, `useId` — для stable IDs, `useTransition`/`useDeferredValue` — для non-blocking UI, `useSyncExternalStore` — для external stores, `useImperativeHandle` — для custom imperative ref API, `useDebugValue` — для DevTools labels. В React 19 также важны form/action hooks: `useActionState` для состояния async action, `useOptimistic` для optimistic UI, `useEffectEvent` для чтения свежих значений внутри effects без добавления их в dependencies, а `useFormStatus` из `react-dom` — для статуса ближайшей формы.

- What are custom Hooks?

  **Ответ:** Custom hooks — reusable functions that compose hooks. Они не делят state автоматически между callers; каждый вызов получает независимое hook state.

- How can simple custom Hooks be implemented?

  **Ответ:** Вынести повторяющуюся state/effect логику.

  ```tsx
  function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
  }
  ```

- How can complex custom Hooks be designed?

  **Ответ:** Определить ответственность, входные параметры, returned API, loading/error states, cancellation, cleanup, testing strategy. Лучше разделять hooks: data fetching, subscription, form logic, domain actions.

- What is useRef() used for?

  **Ответ:** Для DOM refs и mutable values, которые должны переживать renders, но не вызывать render при изменении: timer ids, previous value, external instance.

- What does useImperativeHandle() do?

  **Ответ:** Позволяет component с `forwardRef` expose custom imperative API вместо raw DOM node.

  ```tsx
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));
  ```

- What is useLayoutEffect()?

  **Ответ:** `useLayoutEffect` запускается синхронно после DOM mutations, но до browser paint. Используется для измерений layout и синхронных DOM adjustments. На сервере не выполняется.

- What is useDebugValue()?

  **Ответ:** `useDebugValue` показывает label для custom hook в React DevTools.

  ```tsx
  useDebugValue(isOnline ? 'Online' : 'Offline');
  ```

- How can third-party hook libraries such as react-use be utilized?

  **Ответ:** Такие библиотеки дают готовые hooks для common browser/state patterns: media queries, localStorage, debounce, intervals, clipboard. Их стоит использовать после проверки качества, SSR-safety, bundle size и соответствия project conventions.

- What is the React use() API?

  **Ответ:** `use()` — это публичный React API для чтения значения из resource во время render. Resource сейчас может быть `Promise` или `Context`. API актуален в React 19+: его можно использовать в последних версиях React, но важно понимать ограничения. В документации React `use` описан как API, а не как обычный Hook, хотя вызывается он из компонента или custom hook.

  Сигнатура:

  ```tsx
  import { use } from 'react';

  const value = use(resource);
  ```

  Что можно передать в `use(resource)`:

  - `Promise` — React дождется результата через Suspense;
  - `Context` — React прочитает значение context provider.

  Пример с `Promise`:

  ```tsx
  import { Suspense, use } from 'react';

  function ProductDetails({
    productPromise,
  }: {
    productPromise: Promise<Product>;
  }) {
    const product = use(productPromise);

    return (
      <article>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
      </article>
    );
  }

  function ProductPage({ productPromise }: { productPromise: Promise<Product> }) {
    return (
      <Suspense fallback={<p>Loading product...</p>}>
        <ProductDetails productPromise={productPromise} />
      </Suspense>
    );
  }
  ```

  Как это работает:

  - если Promise pending, компонент "suspends";
  - ближайший `<Suspense fallback={...}>` показывает fallback;
  - когда Promise resolved, React продолжает render с готовым значением;
  - если Promise rejected, ошибку должен обработать ближайший Error Boundary или `.catch()` на Promise.

  Пример с Error Boundary:

  ```tsx
  <ErrorBoundary fallback={<p>Failed to load product.</p>}>
    <Suspense fallback={<p>Loading product...</p>}>
      <ProductDetails productPromise={productPromise} />
    </Suspense>
  </ErrorBoundary>
  ```

  Пример с context:

  ```tsx
  import { createContext, use } from 'react';

  const ThemeContext = createContext('light');

  function Button({ showTheme }: { showTheme: boolean }) {
    if (showTheme) {
      const theme = use(ThemeContext);
      return <button className={`button-${theme}`}>Save</button>;
    }

    return <button>Save</button>;
  }
  ```

  Отличие от обычных Hooks: `use()` можно вызывать внутри `if` и циклов. Например `useContext()` должен быть на top level, а `use(ThemeContext)` можно вызвать условно. Но `use()` все равно нельзя вызывать где угодно: он должен вызываться внутри React component или custom hook, не в event handler, не в обычной utility function.

  Ограничения и практические правила:

  - В Server Components для data fetching чаще лучше использовать `async/await`, а не `use()`, потому что `await` продолжает render с места ожидания.
  - В Client Components лучше не создавать Promise прямо во время render: такой Promise будет пересоздаваться на каждый render. Лучше создать Promise на сервере, в route loader/framework layer или закешировать его.
  - `use()` нельзя оборачивать обычным `try/catch` для rejected Promise; используйте Error Boundary или `promise.catch(...)`.
  - Для обычного local state `use()` не нужен: используйте `useState`/`useReducer`.
  - Для обычного context чаще можно использовать `useContext`, но `use(Context)` полезен, когда context нужно читать условно.

  Пример, чего лучше избегать:

  ```tsx
  function ProductDetails({ productId }: { productId: string }) {
    // Плохо: Promise создается заново на каждый render.
    const product = use(fetch(`/api/products/${productId}`).then((res) => res.json()));

    return <h1>{product.title}</h1>;
  }
  ```

  Лучше передать стабильный Promise:

  ```tsx
  function ProductPage({ productPromise }: { productPromise: Promise<Product> }) {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <ProductDetails productPromise={productPromise} />
      </Suspense>
    );
  }

  function ProductDetails({
    productPromise,
  }: {
    productPromise: Promise<Product>;
  }) {
    const product = use(productPromise);
    return <h1>{product.title}</h1>;
  }
  ```

  Коротко: `use()` актуален в React 19+, это публичный API для чтения Promise/context в render. Он особенно полезен вместе с Suspense, Server Components и streaming data, но это не универсальная замена `useEffect`, `useState`, `useContext` или `async/await`.
