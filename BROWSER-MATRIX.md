- What is the DOM?

  **Ответ:** DOM, Document Object Model, — это объектная модель HTML/XML-документа, которую браузер предоставляет JavaScript-коду. HTML-разметка превращается в дерево объектов: `document`, элементы, текстовые узлы, атрибуты. Через DOM можно читать структуру страницы, менять элементы, стили, атрибуты и подписываться на события.

  ```js
  const title = document.querySelector('h1');
  title.textContent = 'Nord Store';
  ```

- What is the DOM tree?

  **Ответ:** DOM tree — древовидная структура узлов документа. Корень обычно `document`, ниже `html`, затем `head`, `body`, элементы, текстовые узлы и комментарии. Родительский элемент содержит дочерние узлы, а у каждого узла могут быть siblings.

  ```txt
  document
  └── html
      ├── head
      └── body
          └── main
              └── h1
                  └── "Hello"
  ```

- How can the DOM be inspected in the browser?

  **Ответ:** DOM инспектируют через DevTools: вкладка Elements/Inspector показывает DOM tree, attributes, styles, event listeners, layout, accessibility. Также можно использовать Console:

  ```js
  document.body;
  document.querySelector('#root');
  getEventListeners(document.querySelector('button')); // Chrome DevTools helper
  ```

- How is the DOM tree created by the browser?

  **Ответ:** Браузер получает HTML, парсер токенизирует его, строит nodes и формирует DOM tree. Параллельно CSS парсится в CSSOM. DOM + CSSOM используются для render tree, layout и paint. JavaScript может блокировать или изменять процесс, если script выполняется во время parsing.

- How can DOM elements be navigated programmatically?

  **Ответ:** DOM можно обходить через parent/children/sibling свойства и query methods.

  ```js
  const item = document.querySelector('.item');

  item.parentElement;
  item.children;
  item.firstElementChild;
  item.nextElementSibling;
  item.closest('.list');
  ```

  Есть различие между element-only свойствами (`children`, `firstElementChild`) и node-level свойствами (`childNodes`, `firstChild`), где учитываются текстовые узлы и комментарии.

- What is the difference between console.log() and console.dir()?

  **Ответ:** `console.log()` выводит значение в привычном представлении, часто DOM-элемент показывается как HTML. `console.dir()` показывает объектную структуру со свойствами и prototype chain. Для DOM-элемента `console.log(element)` удобен как markup, а `console.dir(element)` — как JS object.

- What are Web Components?

  **Ответ:** Web Components — набор web platform APIs для создания reusable custom elements без привязки к фреймворку. Основные части: Custom Elements, Shadow DOM, HTML templates. Компонент можно использовать как обычный HTML-тег.

  ```js
  class ProductBadge extends HTMLElement {
    connectedCallback() {
      this.textContent = 'New';
    }
  }

  customElements.define('product-badge', ProductBadge);
  ```

- What is Shadow DOM?

  **Ответ:** Shadow DOM — изолированное DOM-дерево, прикрепленное к элементу. Оно скрывает внутреннюю разметку и стили компонента от внешнего документа. Это полезно для encapsulation.

  ```js
  const root = element.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>span { color: red; }</style><span>Badge</span>`;
  ```

- What problems does Shadow DOM solve?

  **Ответ:** Shadow DOM решает проблемы style leakage, name collisions и хрупкой внутренней структуры. Внешние CSS-правила не так легко ломают компонент, а внутренние стили компонента не протекают наружу. Это важно для дизайн-систем, widgets и компонентов, которые встраиваются в чужие страницы.

- What is the difference between client*, offset*, and scroll* properties?

  **Ответ:** `client*` описывает внутренний размер элемента без border и scrollbar, но с padding. `offset*` включает border и scrollbar. `scroll*` описывает полный размер прокручиваемого контента, включая невидимую часть.

  ```txt
  clientWidth  = content + padding
  offsetWidth  = content + padding + border + scrollbar
  scrollWidth  = full scrollable content width
  ```

- What are clientWidth, clientHeight, offsetWidth, and offsetHeight?

  **Ответ:** `clientWidth/clientHeight` — видимая внутренняя область элемента с padding, без border. `offsetWidth/offsetHeight` — layout-размер элемента с padding, border и scrollbar. Их часто используют для измерения элемента.

  ```js
  const box = document.querySelector('.box');
  console.log(box.clientWidth, box.offsetWidth);
  ```

- What are scrollWidth and scrollHeight?

  **Ответ:** `scrollWidth` и `scrollHeight` показывают полный размер содержимого элемента, включая часть, скрытую прокруткой. Если `scrollHeight > clientHeight`, элемент имеет вертикально скрытый content.

  ```js
  const hasVerticalOverflow = element.scrollHeight > element.clientHeight;
  ```

- How can an element's bounding rectangle be obtained?

  **Ответ:** Через `getBoundingClientRect()`. Он возвращает `DOMRect` с `x`, `y`, `top`, `left`, `right`, `bottom`, `width`, `height` относительно viewport.

  ```js
  const rect = element.getBoundingClientRect();
  console.log(rect.top, rect.left, rect.width, rect.height);
  ```

- Which DOM element properties are writable?

  **Ответ:** Многие свойства writable: `textContent`, `innerHTML`, `className`, `id`, `value`, `checked`, `disabled`, `dataset`, `style`, attributes через `setAttribute`. Но layout/read-only свойства вроде `clientWidth`, `offsetHeight`, `scrollHeight` нельзя напрямую установить.

  ```js
  input.value = 'hello';
  button.disabled = true;
  element.dataset.productId = 'p1';
  element.style.display = 'none';
  ```

- What is the difference between classList and className?

  **Ответ:** `className` — строка всех CSS-классов элемента. `classList` — удобный `DOMTokenList` с методами `add`, `remove`, `toggle`, `contains`, `replace`.

  ```js
  element.className = 'card active';
  element.classList.toggle('selected');
  ```

- How can CSS classes be manipulated dynamically with JavaScript?

  **Ответ:** Через `classList`.

  ```js
  item.classList.add('active');
  item.classList.remove('hidden');
  item.classList.toggle('expanded', isExpanded);

  if (item.classList.contains('active')) {
    console.log('selected');
  }
  ```

- How can styles be applied dynamically using JavaScript?

  **Ответ:** Inline styles можно менять через `element.style`, CSS variables через `style.setProperty`, classes через `classList`. Обычно лучше переключать классы, а не массово писать inline styles.

  ```js
  element.style.color = 'red';
  element.style.setProperty('--accent-color', '#0ea5e9');
  element.classList.add('is-open');
  ```

- What is style.cssText?

  **Ответ:** `style.cssText` — строковое представление inline styles элемента. Присваивание `cssText` заменяет все inline styles целиком, поэтому использовать его нужно осторожно.

  ```js
  element.style.cssText = 'color: red; background: white;';
  ```

- What are computed styles?

  **Ответ:** Computed styles — итоговые CSS-значения после cascade, inheritance, specificity, user agent styles и CSS rules. Это не только inline styles, а то, что реально вычислил браузер.

- How can computed styles be retrieved?

  **Ответ:** Через `getComputedStyle(element)`.

  ```js
  const styles = getComputedStyle(element);
  console.log(styles.display);
  console.log(styles.getPropertyValue('--accent-color'));
  ```

- What are the different ways to select DOM elements?

  **Ответ:** Основные методы: `getElementById`, `getElementsByClassName`, `getElementsByTagName`, `querySelector`, `querySelectorAll`, а также traversal APIs вроде `closest`, `matches`.

  ```js
  document.getElementById('root');
  document.querySelector('.product-card');
  document.querySelectorAll('[data-product-id]');
  ```

- How do CSS selectors work in JavaScript?

  **Ответ:** `querySelector` и `querySelectorAll` принимают CSS selector string и возвращают первый matching element или список всех matching elements. Поддерживаются обычные CSS-селекторы: class, id, attributes, descendants, pseudo-classes вроде `:not()`.

  ```js
  document.querySelector('form input[name="email"]');
  document.querySelectorAll('.product-card:not(.hidden)');
  ```

- What is the difference between getElement* methods and querySelector* methods?

  **Ответ:** `getElementById` быстрый и выбирает по id. `getElementsByClassName`/`getElementsByTagName` возвращают live HTMLCollection. `querySelector`/`querySelectorAll` принимают гибкие CSS-селекторы; `querySelectorAll` возвращает static NodeList.

- When should one approach be preferred over the other?

  **Ответ:** Для простого поиска по id используйте `getElementById`. Для сложных условий удобнее `querySelector`. Для новых приложений часто предпочитают `querySelector*` из-за гибкости и предсказуемого static результата. В React/Angular прямой DOM selection используют редко, чаще refs/framework bindings.

- What are DOM events?

  **Ответ:** DOM events — сигналы от браузера о действиях пользователя или системы: click, input, submit, keydown, load, scroll, resize. JavaScript может подписаться на событие и выполнить handler.

- How are event listeners added and removed?

  **Ответ:** Через `addEventListener` и `removeEventListener`. Для удаления нужна та же функция-ссылка.

  ```js
  function handleClick(event) {
    console.log(event.target);
  }

  button.addEventListener('click', handleClick);
  button.removeEventListener('click', handleClick);
  ```

- What are the most common DOM event types?

  **Ответ:** Частые события: `click`, `dblclick`, `input`, `change`, `submit`, `keydown`, `keyup`, `focus`, `blur`, `mouseover`, `mouseout`, `pointerdown`, `pointermove`, `scroll`, `resize`, `load`, `DOMContentLoaded`.

- How can default browser behavior be prevented?

  **Ответ:** Через `event.preventDefault()`. Например, остановить default submit формы или переход по ссылке.

  ```js
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm();
  });
  ```

- What are event bubbling and event capturing?

  **Ответ:** Capturing — событие идет сверху вниз от `window/document` к target. Bubbling — после target событие поднимается обратно вверх к ancestors. По умолчанию большинство handlers работают на bubbling phase.

- How does event propagation work?

  **Ответ:** У события есть путь: ancestors -> target -> ancestors. Handler может узнать `event.target` и `event.currentTarget`. `stopPropagation()` останавливает дальнейшее распространение.

  ```js
  parent.addEventListener('click', (event) => {
    console.log(event.target, event.currentTarget);
  });
  ```

- What is event delegation?

  **Ответ:** Event delegation — прием, когда listener ставится на общего parent, а не на каждый child. Handler проверяет `event.target` и решает, какой child был нажат.

  ```js
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    console.log(button.dataset.action);
  });
  ```

- Why is event delegation useful?

  **Ответ:** Она уменьшает количество listeners, работает для динамически добавленных элементов и упрощает управление списками. Например, в таблице с 1000 строк можно поставить один listener на `<table>`.

- What advanced DOM event types exist?

  **Ответ:** Более продвинутые события: pointer events, touch events, drag/drop, wheel, composition events для IME, clipboard events, animation/transition events, visibilitychange, beforeunload, storage, message, online/offline, custom events.

- What are form events?

  **Ответ:** Form events связаны с вводом и отправкой форм: `input`, `change`, `submit`, `reset`, `focus`, `blur`, `invalid`. `input` срабатывает при каждом изменении, `change` часто после commit/blur в зависимости от control.

- What are custom events?

  **Ответ:** Custom events — пользовательские события, которые приложение создает само. Они полезны для взаимодействия между независимыми DOM-компонентами, widgets и Web Components.

- How can custom events be created and dispatched?

  **Ответ:** Через `CustomEvent` и `dispatchEvent`.

  ```js
  const event = new CustomEvent('cart:item-added', {
    detail: { productId: 'p1' },
    bubbles: true,
  });

  element.dispatchEvent(event);
  ```

- What are document, window, and content load events?

  **Ответ:** `DOMContentLoaded` срабатывает, когда HTML parsed и DOM готов. `load` на `window` ждет загрузку всех subresources: images, styles, scripts. `beforeunload` срабатывает перед уходом со страницы. `visibilitychange` сообщает, что вкладка стала hidden/visible.

- What is CORS?

  **Ответ:** CORS, Cross-Origin Resource Sharing, — это браузерный security-механизм, который контролирует, может ли JavaScript на одной origin читать ответ от другой origin. Origin состоит из scheme, host и port.

  ```txt
  https://shop.example.com
  ├── scheme: https
  ├── host: shop.example.com
  └── port: 443
  ```

  Эти origin разные:

  ```txt
  https://shop.example.com
  https://api.example.com
  http://shop.example.com
  https://shop.example.com:444
  ```

  Важно: CORS не запрещает серверу получить request. Он запрещает браузерному JavaScript прочитать response, если сервер не разрешил cross-origin access нужными headers.

  Пример проблемы:

  ```js
  fetch('https://api.example.com/products')
    .then((response) => response.json())
    .then(console.log);
  ```

  Если frontend открыт на `https://shop.example.com`, а API на `https://api.example.com`, браузер проверит CORS headers в ответе API. Минимально сервер должен вернуть:

  ```http
  Access-Control-Allow-Origin: https://shop.example.com
  ```

  Тогда браузер разрешит JS-коду прочитать response.

  **Simple requests**

  Некоторые requests считаются simple и не требуют preflight. Например `GET` без нестандартных headers или `POST` с простыми content types. Но response все равно должен иметь `Access-Control-Allow-Origin`, иначе браузер заблокирует доступ к данным.

  **Preflight requests**

  Если request потенциально более опасный, браузер сначала отправляет `OPTIONS` preflight. Например:

  - method `PUT`, `PATCH`, `DELETE`;
  - custom header `Authorization`;
  - `Content-Type: application/json`;
  - credentials/cookies в некоторых сценариях.

  Пример preflight:

  ```http
  OPTIONS /products HTTP/1.1
  Origin: https://shop.example.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: authorization, content-type
  ```

  Сервер должен ответить:

  ```http
  Access-Control-Allow-Origin: https://shop.example.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: authorization, content-type
  Access-Control-Max-Age: 86400
  ```

  После этого браузер отправит настоящий request.

  **Credentials, cookies и Authorization**

  Если frontend должен отправлять cookies или auth credentials, в `fetch` нужно указать:

  ```js
  fetch('https://api.example.com/me', {
    credentials: 'include',
  });
  ```

  А сервер должен вернуть:

  ```http
  Access-Control-Allow-Origin: https://shop.example.com
  Access-Control-Allow-Credentials: true
  ```

  Нельзя использовать wildcard `*` вместе с credentials:

  ```http
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Credentials: true
  ```

  Такой вариант браузер не примет. Нужно явно указать origin.

  **CORS в Express**

  В Express часто используют пакет `cors`:

  ```ts
  import cors from 'cors';
  import express from 'express';

  const app = express();

  app.use(
    cors({
      origin: 'https://shop.example.com',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['authorization', 'content-type'],
    })
  );
  ```

  Для нескольких allowed origins:

  ```ts
  const allowedOrigins = new Set([
    'https://shop.example.com',
    'https://admin.example.com',
  ]);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
  ```

  **Частые ошибки**

  - Настроили CORS на frontend, хотя CORS headers должен отдавать API server.
  - Используют `Access-Control-Allow-Origin: *` с cookies.
  - Забыли разрешить `Authorization` в `Access-Control-Allow-Headers`.
  - Не обрабатывают `OPTIONS` preflight.
  - Разрешают все origins в production без необходимости.
  - Путают CORS с auth: CORS не проверяет, кто пользователь; он только ограничивает browser access между origins.

  **CORS и Postman**

  В Postman/curl CORS обычно не проявляется, потому что CORS enforced браузером. Сервер может нормально отвечать Postman, но браузер заблокирует response, если CORS headers неправильные.

  Коротко:

  ```txt
  Same-origin request      -> браузер разрешает по умолчанию
  Cross-origin request     -> браузер требует CORS headers от сервера
  Credentials/cookies      -> нужен credentials: include + Allow-Credentials
  Preflight OPTIONS        -> браузер проверяет разрешения перед настоящим request
  ```

- What are cookies?

  **Ответ:** Cookies — небольшие key-value данные, которые браузер хранит для сайта и отправляет с HTTP-запросами к matching domain/path. Их используют для sessions, auth, preferences, tracking, A/B tests.

- How are cookies created, read, and updated?

  **Ответ:** Сервер задает cookies через `Set-Cookie`, клиент может писать через `document.cookie`, если cookie не `HttpOnly`. Обновление — это установка cookie с тем же name/domain/path и новым value/options.

  ```js
  document.cookie = 'theme=dark; Path=/; Max-Age=31536000; SameSite=Lax';
  console.log(document.cookie);
  ```

- What is cookie expiration?

  **Ответ:** Expiration определяет срок жизни cookie. `Expires` задает дату, `Max-Age` — секунды. Session cookie без срока обычно живет до закрытия браузерной сессии, но поведение может зависеть от восстановления сессий браузером.

- What are secure cookies?

  **Ответ:** Secure cookie имеет флаг `Secure` и отправляется только по HTTPS. Для auth cookies также часто ставят `HttpOnly`, чтобы JavaScript не мог прочитать cookie, и `SameSite=Lax/Strict/None`, чтобы управлять cross-site отправкой.

  ```http
  Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax; Path=/
  ```

- How can cookies be removed?

  **Ответ:** Нужно установить cookie с тем же name/path/domain и истекшим сроком.

  ```js
  document.cookie = 'theme=; Path=/; Max-Age=0';
  ```

- What are cookie size limitations?

  **Ответ:** Обычно cookie ограничена примерно 4 KB, а количество cookies на domain тоже ограничено браузером. Cookies отправляются с каждым matching HTTP-запросом, поэтому нельзя хранить в них большие данные.

- What are third-party cookies?

  **Ответ:** Third-party cookies — cookies, установленные доменом, отличным от сайта в address bar, например через embedded iframe/script/ad network. Они часто используются для tracking и постепенно ограничиваются браузерами.

- What are GDPR requirements regarding cookies?

  **Ответ:** В общем виде GDPR/ePrivacy требуют прозрачности и законного основания обработки. Для strictly necessary cookies согласие обычно не требуется, а для analytics/ads/tracking cookies часто нужно предварительное informed consent, возможность отказаться, отозвать согласие и получить понятное описание целей. Это не юридическая консультация: в реальном продукте требования нужно сверять с юристом и локальным регулированием.

- What is the difference between localStorage and sessionStorage?

  **Ответ:** `localStorage` хранит данные без срока до явного удаления. `sessionStorage` живет в рамках одной browser tab/session. Оба работают синхронно, хранят строки и доступны только для same origin.

- What are browser storages used for?

  **Ответ:** Для client-side persistence: UI preferences, draft forms, feature flags cache, non-sensitive tokens в некоторых architectures, offline data, last selected filters. Sensitive auth лучше хранить осторожно: XSS может читать Web Storage.

- How can values be stored, retrieved, and removed?

  **Ответ:** Через `setItem`, `getItem`, `removeItem`, `clear`. Объекты нужно сериализовать.

  ```js
  localStorage.setItem('settings', JSON.stringify({ theme: 'dark' }));
  const settings = JSON.parse(localStorage.getItem('settings') ?? '{}');
  localStorage.removeItem('settings');
  ```

- What are storage events?

  **Ответ:** `storage` event срабатывает в других tabs/windows same origin, когда `localStorage` изменился. В той же вкладке, которая сделала изменение, событие не срабатывает.

  ```js
  window.addEventListener('storage', (event) => {
    console.log(event.key, event.newValue);
  });
  ```

- What are the size limitations of browser storage?

  **Ответ:** Лимиты зависят от браузера и режима. Web Storage часто порядка нескольких MB на origin. IndexedDB обычно дает значительно больше и управляется quota manager. Для надежности нужно обрабатывать quota errors.

- What is IndexedDB?

  **Ответ:** IndexedDB — асинхронная browser database для хранения больших объемов structured data на client side. Она поддерживает object stores, indexes, transactions, cursors и версионирование. Подходит для offline-first apps, caches, drafts, large client datasets.

- How is IndexedDB initialized and configured?

  **Ответ:** База открывается через `indexedDB.open(name, version)`. Object stores и indexes создаются в `onupgradeneeded`, потому что schema changes привязаны к версии.

  ```js
  const request = indexedDB.open('shop', 1);

  request.onupgradeneeded = () => {
    const db = request.result;
    const store = db.createObjectStore('products', { keyPath: 'id' });
    store.createIndex('by-category', 'category');
  };
  ```

- How do transactions work in IndexedDB?

  **Ответ:** Все операции выполняются внутри transaction. Transaction имеет object stores и mode: `readonly` или `readwrite`. Она автоматически commit-ится, когда все requests завершены, или abort-ится при ошибке.

  ```js
  const tx = db.transaction('products', 'readwrite');
  tx.objectStore('products').put({ id: 'p1', title: 'Laptop' });
  ```

- How does querying and searching work in IndexedDB?

  **Ответ:** Можно читать по primary key через `get`, все записи через `getAll`, искать через index и range queries через `IDBKeyRange`.

  ```js
  const index = tx.objectStore('products').index('by-category');
  const request = index.getAll('electronics');
  ```

- How is database versioning handled?

  **Ответ:** Версия задается вторым аргументом `indexedDB.open(name, version)`. Если версия больше текущей, браузер вызывает `onupgradeneeded`, где можно создать/изменить object stores и indexes. Версию нельзя уменьшить.

- What are IndexedDB cursors?

  **Ответ:** Cursor — механизм последовательного обхода records в object store или index. Он полезен для обработки больших наборов без загрузки всего в память и для фильтрации/пагинации.

- How do cursors work?

  **Ответ:** `openCursor()` возвращает request. В `onsuccess` получаем cursor, читаем `cursor.value`, затем вызываем `cursor.continue()`.

  ```js
  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) return;
    console.log(cursor.key, cursor.value);
    cursor.continue();
  };
  ```

- What is minification?

  **Ответ:** Minification — уменьшение размера JS/CSS/HTML без изменения поведения: удаление пробелов, комментариев, переносов, сокращение синтаксиса. Цель — быстрее передавать и парсить assets.

- What is uglification?

  **Ответ:** Uglification — более агрессивное преобразование JavaScript: переименование локальных переменных, упрощение expressions, dead code removal. Термин исторически связан с UglifyJS. Сегодня часто говорят minification/terser optimization.

- Why are minification and uglification used?

  **Ответ:** Чтобы уменьшить bundle size, ускорить загрузку, снизить bandwidth и немного усложнить чтение production-кода. Это не security mechanism: секреты нельзя хранить во frontend bundle.

- What is compression in web applications?

  **Ответ:** Compression — сжатие HTTP responses перед отправкой: Gzip, Brotli, иногда Zstd. Браузер указывает поддержку через `Accept-Encoding`, сервер отвечает с `Content-Encoding`.

- What is tree shaking?

  **Ответ:** Tree shaking — удаление неиспользуемого кода из bundle на основе static ES module imports/exports. Работает лучше, если package не имеет side effects и использует ESM.

- How does tree shaking remove unused code?

  **Ответ:** Bundler строит dependency graph, определяет used exports, удаляет unreachable/unused exports и передает код minifier-у. Dynamic imports, CommonJS и side effects могут мешать tree shaking.

- What causes dependency duplication in npm projects?

  **Ответ:** Разные версии одной зависимости, nested dependencies, несовместимые peer dependencies, bundling library с зависимостью внутри, symlinks/monorepo misconfiguration. Дубликаты увеличивают bundle и могут ломать singleton libraries.

- What is the difference between static and dynamic compression?

  **Ответ:** Static compression — assets заранее сжимаются при build/deploy, например `.br`/`.gz` files. Dynamic compression — сервер сжимает response на лету. Static дешевле по CPU для неизменяемых assets, dynamic удобен для HTML/API.

- What is the difference between Gzip and Brotli?

  **Ответ:** Brotli обычно дает лучший compression ratio для text assets, особенно на high quality, но сжатие может быть медленнее. Gzip старее и поддерживается почти везде. На практике static assets часто отдают Brotli, fallback — Gzip.

- How does browser caching work?

  **Ответ:** Браузер сохраняет responses в HTTP cache и решает, можно ли использовать копию, по headers: `Cache-Control`, `ETag`, `Last-Modified`, `Expires`. Fresh response используется без запроса, stale response может revalidate-иться.

  ```http
  Cache-Control: public, max-age=31536000, immutable
  ETag: "abc123"
  ```

- How can static assets be optimized and compressed?

  **Ответ:** Использовать hashed filenames, long-term caching, minification, tree shaking, code splitting, image optimization, modern formats, Brotli/Gzip, CDN, preloading critical assets. Пример: `app.8f3a1.js` можно кешировать долго, потому что имя меняется при изменении содержимого.

- What is the difference between async and defer scripts?

  **Ответ:** `async` загружает script параллельно и выполняет сразу после загрузки, порядок между async scripts не гарантирован. `defer` загружает параллельно, но выполняет после HTML parsing и сохраняет порядок. Для обычных app bundles часто подходит `defer`.

  ```html
  <script src="/analytics.js" async></script>
  <script src="/app.js" defer></script>
  ```

- What is Critical CSS?

  **Ответ:** Critical CSS — минимальный CSS, нужный для first viewport/above-the-fold content. Его часто inline-ят в HTML, чтобы страница быстрее отрисовалась без ожидания полного CSS bundle.

- Why is Critical CSS important?

  **Ответ:** CSS блокирует render. Если критический CSS встроен или загружен рано, браузер быстрее показывает первый экран. Это улучшает perceived performance и метрики вроде First Contentful Paint/LCP.

- What is the Critical Rendering Path?

  **Ответ:** Critical Rendering Path, CRP, — это цепочка этапов, через которые браузер проходит, чтобы превратить HTML, CSS и JavaScript в пиксели на экране. Иногда это ошибочно называют "Critical Rendering Pass", но стандартный термин — **Critical Rendering Path**.

  Упрощенно:

  ```txt
  HTML/CSS/JS
      ↓
  DOM + CSSOM
      ↓
  Render Tree
      ↓
  Layout
      ↓
  Paint
      ↓
  Composite
      ↓
  Pixels on screen
  ```

  Цель оптимизации CRP — как можно быстрее показать пользователю meaningful first content и не блокировать первый рендер лишними ресурсами.

  **1. Navigation и получение HTML**

  Все начинается с navigation request. Браузер делает DNS lookup, TCP/TLS connection, отправляет HTTP request и получает HTML response.

  ```txt
  User opens URL
      ↓
  DNS
      ↓
  TCP/TLS
      ↓
  HTTP request
      ↓
  HTML response
  ```

  На этом этапе важны:

  - server response time;
  - redirects;
  - CDN;
  - compression;
  - cache;
  - HTTP/2 или HTTP/3;
  - размер HTML.

  Если сервер долго отдает первый байт, браузер не может начать строить страницу. Это влияет на TTFB, Time To First Byte.

  **2. HTML parsing и построение DOM**

  Браузер читает HTML потоково, токенизирует его и строит DOM tree.

  ```html
  <main>
    <h1>Nord Store</h1>
    <p>Products</p>
  </main>
  ```

  Превращается в DOM:

  ```txt
  main
  ├── h1
  │   └── "Nord Store"
  └── p
      └── "Products"
  ```

  DOM — это не то же самое, что исходный HTML-текст. DOM — runtime object tree, с которым работает JavaScript.

  **3. Preload scanner**

  Пока основной HTML parser строит DOM, браузер также может запускать preload scanner. Он ищет ресурсы, которые понадобятся странице:

  ```html
  <link rel="stylesheet" href="/styles.css" />
  <script src="/app.js" defer></script>
  <img src="/hero.webp" />
  ```

  Scanner помогает начать загрузку CSS, JS, fonts и images раньше, не дожидаясь полного parsing HTML.

  Практически полезно явно помогать браузеру:

  ```html
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/hero.webp" as="image" />
  ```

  Но preload нужно использовать осторожно: если preload-ить слишком много, критичные ресурсы начнут конкурировать друг с другом.

  **4. CSS loading и построение CSSOM**

  CSS парсится в CSSOM, CSS Object Model. CSSOM описывает итоговые CSS rules, selectors, cascade, inheritance и computed values.

  ```css
  body {
    font-family: Inter, sans-serif;
  }

  .product-card {
    display: grid;
    gap: 12px;
  }
  ```

  Важно: CSS обычно render-blocking. Браузер не может корректно отрисовать страницу, пока не знает стили, потому что CSS влияет на:

  - видимость элементов;
  - размеры;
  - fonts;
  - layout;
  - media queries;
  - cascade.

  Поэтому большой CSS bundle может задержать first paint.

  Оптимизации:

  ```html
  <!-- Критический CSS можно inline-ить -->
  <style>
    body { margin: 0; font-family: system-ui; }
    .hero { min-height: 60vh; }
  </style>

  <!-- Остальной CSS грузить отдельно -->
  <link rel="stylesheet" href="/app.css" />
  ```

  **5. JavaScript loading, parsing и execution**

  JavaScript может блокировать HTML parsing и rendering. Обычный script без `defer` или `async` останавливает parser:

  ```html
  <script src="/app.js"></script>
  ```

  Почему? Потому что JS может изменить DOM или CSSOM:

  ```js
  document.body.innerHTML = '<h1>Changed</h1>';
  ```

  Поэтому браузер должен выполнить script, прежде чем безопасно продолжить parsing.

  Лучше:

  ```html
  <script src="/app.js" defer></script>
  ```

  `defer`:

  - загружает script параллельно с HTML parsing;
  - выполняет после parsing;
  - сохраняет порядок scripts;
  - обычно подходит для application bundle.

  `async`:

  - загружает script параллельно;
  - выполняет сразу после загрузки;
  - порядок не гарантирован;
  - хорошо для независимых scripts, например analytics.

  **6. Render Tree**

  Когда DOM и CSSOM готовы, браузер строит render tree. Render tree содержит только видимые элементы, которые нужно нарисовать.

  Например:

  ```html
  <body>
    <h1>Visible</h1>
    <div style="display: none">Hidden</div>
  </body>
  ```

  `display: none` элемент будет в DOM, но не попадет в render tree.

  В render tree учитываются:

  - DOM nodes;
  - computed styles;
  - visibility;
  - pseudo-elements;
  - anonymous boxes;
  - layout roles.

  **7. Style calculation**

  Браузер вычисляет итоговые стили для элементов:

  ```txt
  selector matching
      ↓
  cascade
      ↓
  inheritance
      ↓
  computed values
  ```

  На этом этапе сложные selectors, большое количество DOM nodes и частые class/style изменения могут быть дорогими.

  Пример:

  ```css
  .catalog .section .grid .card .content .title {
    color: black;
  }
  ```

  Современные браузеры хорошо оптимизированы, но слишком глубокие selectors и огромные DOM-деревья все равно могут повышать cost style recalculation.

  **8. Layout / Reflow**

  Layout, или reflow, — этап вычисления геометрии: где находится каждый элемент и какого он размера.

  Браузер отвечает на вопросы:

  ```txt
  Какая ширина элемента?
  Какая высота?
  Где x/y координаты?
  Как line breaks влияют на текст?
  Как flex/grid распределяют пространство?
  ```

  На layout влияют:

  - viewport size;
  - fonts;
  - content;
  - CSS box model;
  - flex/grid;
  - images dimensions;
  - media queries.

  Пример layout-triggering изменений:

  ```js
  element.style.width = '400px';
  console.log(element.offsetWidth);
  ```

  Если чередовать запись layout-свойств и чтение layout-свойств, можно получить forced synchronous layout:

  ```js
  // Плохо: layout thrashing
  items.forEach((item) => {
    item.style.width = '200px';
    console.log(item.offsetHeight);
  });
  ```

  Лучше сгруппировать reads и writes:

  ```js
  const heights = items.map((item) => item.offsetHeight);

  items.forEach((item) => {
    item.style.width = '200px';
  });
  ```

  **9. Paint**

  Paint — этап, где браузер рисует визуальные части элементов:

  - text;
  - colors;
  - backgrounds;
  - borders;
  - shadows;
  - images;
  - SVG;
  - outlines.

  Paint может быть дорогим, если есть:

  - большие shadows;
  - complex gradients;
  - fixed backgrounds;
  - большие repaint areas;
  - частые изменения цветов/размеров.

  Изменения вроде `background-color` обычно требуют paint, но не всегда layout.

  **10. Compositing**

  Compositing — этап сборки painted layers в финальный кадр. Некоторые элементы могут быть вынесены в отдельные compositor layers, например из-за:

  - `transform`;
  - `opacity`;
  - `position: fixed`;
  - video/canvas;
  - `will-change`;
  - 3D transforms.

  Для анимаций лучше менять `transform` и `opacity`, потому что они часто могут обрабатываться compositor-ом без layout и paint.

  Хорошо:

  ```css
  .panel {
    transform: translateX(0);
    transition: transform 200ms ease;
  }

  .panel.is-open {
    transform: translateX(100%);
  }
  ```

  Хуже:

  ```css
  .panel {
    left: 0;
    transition: left 200ms ease;
  }

  .panel.is-open {
    left: 300px;
  }
  ```

  `left` может вызвать layout, а `transform` чаще ограничивается compositing.

  **11. Rasterization и display**

  Painted commands превращаются в pixels. Часть работы может выполняться GPU/compositor thread. После этого кадр отображается на экране.

  Для плавной анимации при 60Hz у браузера есть примерно 16.7ms на кадр:

  ```txt
  JavaScript
  Style
  Layout
  Paint
  Composite
  <= ~16.7ms
  ```

  Если работа занимает больше, пользователь видит jank.

  **Какие ресурсы критичны для CRP**

  Критичные ресурсы — те, без которых браузер не может быстро показать первый экран:

  - HTML document;
  - critical CSS;
  - blocking fonts;
  - blocking scripts;
  - hero image / LCP image;
  - render-blocking third-party scripts.

  Некритичные ресурсы лучше отложить:

  - analytics;
  - below-the-fold images;
  - widgets;
  - heavy charts;
  - non-critical CSS;
  - route chunks, которые не нужны на первом экране.

  **Пример плохого CRP**

  ```html
  <head>
    <link rel="stylesheet" href="/huge.css" />
    <script src="/big-app.js"></script>
    <script src="/analytics.js"></script>
  </head>
  ```

  Проблемы:

  - большой CSS блокирует render;
  - `big-app.js` блокирует HTML parser;
  - analytics тоже может задерживать parsing/execution;
  - первый экран появится позже.

  **Пример более хорошего CRP**

  ```html
  <head>
    <style>
      body { margin: 0; font-family: system-ui; }
      .hero { min-height: 60vh; }
    </style>
    <link rel="preload" href="/hero.webp" as="image" />
    <link rel="stylesheet" href="/app.css" />
    <script src="/app.js" defer></script>
    <script src="/analytics.js" async></script>
  </head>
  ```

  Здесь:

  - critical CSS доступен сразу;
  - hero image получает высокий приоритет;
  - app JS не блокирует HTML parsing;
  - analytics не блокирует приложение.

  **Как оптимизировать Critical Rendering Path**

  1. Уменьшить TTFB:

     - CDN;
     - server caching;
     - faster backend;
     - streaming SSR;
     - avoid unnecessary redirects.

  2. Уменьшить render-blocking CSS:

     - inline critical CSS;
     - удалить unused CSS;
     - split CSS по routes;
     - minify CSS;
     - избегать огромных CSS frameworks без tree shaking.

  3. Уменьшить blocking JavaScript:

     - `defer` для app scripts;
     - `async` для независимых third-party scripts;
     - code splitting;
     - tree shaking;
     - меньше client-side JS;
     - lazy load heavy widgets.

  4. Оптимизировать fonts:

     ```html
     <link rel="preload" href="/inter.woff2" as="font" type="font/woff2" crossorigin />
     ```

     ```css
     @font-face {
       font-family: Inter;
       src: url('/inter.woff2') format('woff2');
       font-display: swap;
     }
     ```

  5. Оптимизировать images:

     - указать `width`/`height`;
     - использовать modern formats: AVIF/WebP;
     - preload LCP image;
     - lazy-load below-the-fold images;
     - не lazy-load hero image.

     ```html
     <img
       src="/hero.webp"
       width="1200"
       height="600"
       alt="Nord Store products"
       fetchpriority="high"
     />
     ```

  6. Избегать layout shifts:

     - задавать размеры images/video/iframes;
     - резервировать место под banners/widgets;
     - не вставлять content сверху без placeholder;
     - следить за fonts.

  7. Делать анимации дешевыми:

     - предпочитать `transform` и `opacity`;
     - избегать анимации `width`, `height`, `top`, `left`;
     - использовать `will-change` только точечно и временно.

  8. Уменьшать DOM size:

     - не рендерить тысячи элементов сразу;
     - использовать virtualization;
     - удалять hidden/unneeded DOM;
     - избегать чрезмерной вложенности.

  **Связь с Core Web Vitals**

  CRP напрямую влияет на:

  - **FCP** — когда появился первый content;
  - **LCP** — когда появился самый большой meaningful элемент;
  - **CLS** — насколько layout стабилен;
  - **INP** — насколько быстро страница реагирует на взаимодействия после загрузки.

  Хороший Critical Rendering Path не только быстро показывает первый экран, но и не перегружает main thread тяжелым JavaScript после загрузки.

  **Короткая mental model**

  ```txt
  DOM tells browser what exists.
  CSSOM tells browser how it looks.
  Render Tree combines visible DOM + styles.
  Layout decides geometry.
  Paint draws pixels.
  Composite assembles layers.
  ```

  Оптимизация CRP — это уменьшение количества критичных ресурсов, их размера и времени, в течение которого они блокируют первый meaningful render.

- What is lazy loading of code chunks?

  **Ответ:** Lazy loading chunks — загрузка JS-модулей по требованию, обычно через dynamic `import()`. Например, admin page, chart library или rich editor грузятся только при переходе пользователя.

  ```js
  const module = await import('./admin-dashboard.js');
  ```

- What is requestAnimationFrame()?

  **Ответ:** `requestAnimationFrame(callback)` просит браузер вызвать callback перед следующим repaint. Он синхронизирован с refresh rate экрана и подходит для animations и visual updates.

- Why is requestAnimationFrame() used?

  **Ответ:** Он помогает делать плавные анимации без лишних кадров и layout thrashing. В отличие от `setTimeout`, callback запускается в правильный момент перед paint.

  ```js
  function animate(time) {
    element.style.transform = `translateX(${time / 10}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
  ```

- What is browser support for requestAnimationFrame()?

  **Ответ:** `requestAnimationFrame` поддерживается современными браузерами давно. В background tabs браузер может снижать частоту или приостанавливать callbacks для экономии ресурсов. Для legacy browsers раньше использовали polyfills.

- What are Web Workers?

  **Ответ:** Web Workers — способ выполнять JavaScript в отдельном background thread, не блокируя main UI thread. Worker не имеет доступа к DOM, но может выполнять CPU-heavy work, parsing, data processing.

- Why are Web Workers needed?

  **Ответ:** Чтобы вынести тяжелые вычисления из main thread: обработка изображений, compression, large JSON parsing, search indexing, crypto, data transforms. Это сохраняет responsiveness UI.

- How are Web Workers created?

  **Ответ:** Через `new Worker(url, options)`. В bundlers часто используют `new URL()`.

  ```js
  const worker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module',
  });
  ```

- How are Web Workers terminated?

  **Ответ:** С main thread — `worker.terminate()`. Внутри worker — `self.close()`.

  ```js
  worker.terminate();
  ```

- How is communication implemented between the main thread and Web Workers?

  **Ответ:** Через message passing: `postMessage` и `message` event. Данные копируются structured clone algorithm или передаются как Transferable objects.

  ```js
  worker.postMessage({ type: 'calculate', payload: [1, 2, 3] });

  worker.onmessage = (event) => {
    console.log(event.data);
  };
  ```

- What are subworkers?

  **Ответ:** Subworkers — workers, созданные из другого worker. Они позволяют worker-у распараллелить работу дальше. Поддержка и ограничения зависят от браузера и origin/security policies.

- How are errors handled in Web Workers?

  **Ответ:** На main thread можно слушать `error` и `messageerror`. Внутри worker использовать `try/catch` и отправлять ошибку через `postMessage`.

  ```js
  worker.onerror = (event) => {
    console.error(event.message, event.filename, event.lineno);
  };
  ```

- What are Shared Workers?

  **Ответ:** Shared Worker может быть общим для нескольких tabs/iframes same origin. Коммуникация идет через `MessagePort`. Он полезен для shared connection/cache/state между вкладками, но используется реже обычных workers.

- What are Embedded Workers?

  **Ответ:** Embedded Worker — worker code, встроенный в страницу, например через `Blob` URL или `<script type="text/plain">`, а не отдельный `.js` файл. Это удобно для demos, но в production обычно лучше отдельный worker bundle.

  ```js
  const blob = new Blob(['self.onmessage = () => postMessage("ok")'], {
    type: 'text/javascript',
  });
  const worker = new Worker(URL.createObjectURL(blob));
  ```

- How does Content Security Policy affect Web Workers?

  **Ответ:** CSP может ограничивать, откуда можно загружать workers, через `worker-src` или fallback directives. Если CSP запрещает `blob:`, embedded workers через Blob URL не запустятся. Для production нужно явно разрешать нужные worker sources.

- What is a Service Worker?

  **Ответ:** Service Worker — special worker, который работает как programmable network proxy между страницей и сетью. Он может перехватывать `fetch`, кешировать responses, поддерживать offline mode, push notifications и background sync.

- How does a Service Worker work?

  **Ответ:** Страница регистрирует service worker. Браузер устанавливает и активирует его. После активации SW может контролировать pages в своем scope и обрабатывать events: `install`, `activate`, `fetch`, `push`, `sync`.

- What browser requirements exist for Service Workers?

  **Ответ:** Нужен secure context: HTTPS или localhost. Service Worker должен быть same origin, иметь корректный MIME type JavaScript, находиться в scope, поддерживаться браузером и не быть заблокированным настройками.

- What is the architecture of a Service Worker?

  **Ответ:** Service Worker живет отдельно от страницы, не имеет DOM access, общается через `postMessage`, работает event-driven и может быть остановлен браузером между событиями. Поэтому нельзя полагаться на in-memory state как на постоянное хранилище.

- What steps are required to register and use a Service Worker?

  **Ответ:** Создать `service-worker.js`, зарегистрировать его, обработать `install/activate/fetch`, добавить cache strategy.

  ```js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  ```

- How can outdated caches be removed?

  **Ответ:** В `activate` event получить `caches.keys()` и удалить cache names, которых нет в allowlist.

  ```js
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== 'v2').map((key) => caches.delete(key)))
      )
    );
  });
  ```

- What is the difference between Service Workers and AppCache?

  **Ответ:** AppCache — устаревшая декларативная offline technology с множеством проблем. Service Worker — programmable API с контролем requests, cache strategies и lifecycle. AppCache deprecated/removed, Service Worker — современный подход.

- How can IndexedDB be used together with Service Workers?

  **Ответ:** Service Worker может хранить structured data, metadata, queued offline actions или API responses в IndexedDB. Cache Storage хорош для HTTP responses, IndexedDB — для объектов, очередей, timestamps, sync state.

- How is Service Worker versioning managed?

  **Ответ:** Обычно меняют service worker file или cache names. Браузер скачивает новый SW, запускает install, затем activate после закрытия старых clients или через `skipWaiting`/`clients.claim`. Нужно аккуратно чистить старые caches и избегать несовместимых assets.

- What is the basic structure of an HTML document?

  **Ответ:** Базовый HTML включает doctype, `html`, `head`, `body`, metadata и content.

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Nord Store</title>
    </head>
    <body>
      <main>Hello</main>
    </body>
  </html>
  ```

- What are HTML entities and symbols?

  **Ответ:** HTML entities — escape-последовательности для специальных символов: `&lt;`, `&gt;`, `&amp;`, `&quot;`, `&nbsp;`. Они нужны, чтобы символы не интерпретировались как HTML syntax.

- How are text formatting and paragraphs implemented in HTML?

  **Ответ:** Параграфы — `<p>`. Семантическое выделение: `<strong>` для важности, `<em>` для акцента, `<mark>`, `<small>`, headings `<h1>`-`<h6>`. Не стоит использовать теги только ради внешнего вида, CSS отвечает за styling.

- How do HTML links work?

  **Ответ:** Ссылки создаются через `<a href="...">`. Они могут вести на страницы, anchors, files, mailto/tel links. Browser navigation зависит от URL, target, download и security attributes.

  ```html
  <a href="/products">Products</a>
  <a href="https://example.com" rel="noreferrer">External</a>
  ```

- What is the purpose of the target attribute?

  **Ответ:** `target` указывает, где открыть ссылку/form response: `_self`, `_blank`, `_parent`, `_top`, named browsing context. Для `_blank` обычно добавляют `rel="noopener noreferrer"` для безопасности.

- How are tables implemented in HTML?

  **Ответ:** Таблицы используют `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`. Таблицы нужны для tabular data, не для layout.

  ```html
  <table>
    <caption>Orders</caption>
    <thead><tr><th>ID</th><th>Total</th></tr></thead>
    <tbody><tr><td>1</td><td>$120</td></tr></tbody>
  </table>
  ```

- How are scripts added to an HTML document?

  **Ответ:** Через `<script>`. Можно inline или external. Для module scripts используют `type="module"`. Для performance часто добавляют `defer`.

  ```html
  <script src="/app.js" defer></script>
  <script type="module" src="/main.js"></script>
  ```

- What is the difference between block and inline elements?

  **Ответ:** Block elements обычно занимают всю доступную ширину и начинаются с новой строки: `div`, `p`, `section`. Inline elements занимают ширину содержимого и текут внутри текста: `span`, `a`, `strong`. CSS `display` может менять поведение.

- How are media elements used in HTML?

  **Ответ:** Images через `<img>`, video через `<video>`, audio через `<audio>`, responsive images через `srcset`/`picture`.

  ```html
  <img src="/shoe.jpg" alt="Black running shoe" loading="lazy" />
  <video controls src="/demo.mp4"></video>
  ```

- How do HTML forms work?

  **Ответ:** `<form>` собирает controls и отправляет данные через `action` и `method`. Inputs должны иметь `name`, чтобы попасть в submitted data. Browser поддерживает built-in validation, labels, fieldsets.

  ```html
  <form action="/login" method="post">
    <label>Email <input name="email" type="email" required /></label>
    <button type="submit">Login</button>
  </form>
  ```

- What is SVG?

  **Ответ:** SVG — XML-based vector graphics format, встроенный в HTML. Подходит для icons, charts, logos, scalable illustrations. SVG можно стилизовать CSS и изменять через DOM.

- How are meta tags used?

  **Ответ:** `<meta>` задает metadata: charset, viewport, description, robots, Open Graph, theme color. Они находятся в `<head>` и влияют на browser behavior, SEO, sharing previews.

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Online shop" />
  ```

- What is the purpose of the template element?

  **Ответ:** `<template>` хранит inert HTML, который не рендерится сразу. JavaScript может клонировать его content и вставлять в DOM. Часто используется в Web Components.

  ```js
  const clone = template.content.cloneNode(true);
  document.body.append(clone);
  ```

- What is the purpose of the iframe element?

  **Ответ:** `<iframe>` встраивает другую страницу в текущую. Используется для embedded maps, payments, videos, third-party widgets. Важно управлять `sandbox`, `allow`, size и security boundaries.

- What is the purpose of the canvas element?

  **Ответ:** `<canvas>` дает bitmap drawing surface для JavaScript. Используется для games, charts, image editing, visualizations. В отличие от SVG, canvas не хранит отдельные DOM-объекты для фигур.

- What are HTML style guides and coding conventions?

  **Ответ:** Style guides задают правила разметки: lowercase tags/attributes, quotes, indentation, semantic tags, alt text, valid nesting, accessible labels. Они повышают читаемость и consistency команды.

- What are common HTML best practices?

  **Ответ:** Использовать семантические теги, валидную структуру headings, labels для форм, alt для meaningful images, `button` для действий, `a` для navigation, не хранить secrets в HTML, подключать scripts/styles оптимально, соблюдать accessibility.

- What layout techniques are commonly used in CSS frameworks?

  **Ответ:** CSS frameworks используют grids, flex utilities, responsive breakpoints, spacing scales, container classes, utility classes, CSS variables. Например Bootstrap grid, Tailwind utilities, Material layout primitives.

- How do CSS selectors work?

  **Ответ:** CSS selectors выбирают элементы по tag, class, id, attributes, relationships и states. Browser применяет rules к matching elements с учетом cascade, specificity и order.

  ```css
  .product-card > h2:hover {
    color: blue;
  }
  ```

- What is CSS specificity?

  **Ответ:** Specificity — вес селектора. Упрощенно: inline styles сильнее, затем IDs, classes/attributes/pseudo-classes, затем tags/pseudo-elements. Если specificity равна, побеждает правило ниже в CSS.

- How does CSS positioning work?

  **Ответ:** `position` управляет layout-поведением: `static` default, `relative` с offset от обычной позиции, `absolute` относительно ближайшего positioned ancestor, `fixed` относительно viewport, `sticky` гибрид scroll/relative.

- What is the difference between margin and padding?

  **Ответ:** `padding` — внутренний отступ между content и border. `margin` — внешний отступ между элементом и соседями. Background элемента распространяется на padding, но не на margin.

- How are custom fonts added to a webpage?

  **Ответ:** Через `@font-face` или external font provider. Лучше использовать `font-display`, preload для критических fonts, ограничивать веса и форматы.

  ```css
  @font-face {
    font-family: Inter;
    src: url('/fonts/inter.woff2') format('woff2');
    font-display: swap;
  }
  ```

- What are the different ways to hide an element?

  **Ответ:** `display: none` удаляет из layout и accessibility tree. `visibility: hidden` скрывает, но место остается. `opacity: 0` делает прозрачным, но элемент остается interactive, если не отключить pointer events. `hidden` attribute скрывает элемент. Visually-hidden class скрывает визуально, но оставляет для screen readers.

- How does z-index work?

  **Ответ:** `z-index` управляет порядком наложения внутри stacking context. Он работает для positioned/flex/grid items и зависит от stacking contexts, созданных `position`, `opacity`, `transform`, `filter`, `isolation`, etc. Высокий `z-index` не выйдет за пределы своего stacking context.

- How does Flexbox work?

  **Ответ:** Flexbox — one-dimensional layout model: он раскладывает элементы вдоль одной главной оси и управляет их выравниванием по поперечной оси. Когда у container стоит `display: flex`, его прямые дети становятся flex items.

  Базовая модель:

  ```txt
  flex container
  ├── flex item
  ├── flex item
  └── flex item

  main axis  = основное направление раскладки
  cross axis = перпендикулярное направление
  ```

  Пример:

  ```css
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  ```

  **Свойства flex container**

  `display: flex` включает flex layout. `display: inline-flex` делает сам container inline-level, но children все равно становятся flex items.

  ```css
  .row {
    display: flex;
  }
  ```

  `flex-direction` задает main axis:

  ```css
  .row {
    flex-direction: row; /* слева направо в LTR */
  }

  .column {
    flex-direction: column; /* сверху вниз */
  }
  ```

  Возможные значения:

  - `row` — элементы идут по горизонтали;
  - `row-reverse` — горизонтально в обратном порядке;
  - `column` — вертикально;
  - `column-reverse` — вертикально в обратном порядке.

  `justify-content` выравнивает items вдоль main axis:

  ```css
  .nav {
    justify-content: space-between;
  }
  ```

  Частые значения:

  - `flex-start` — прижать к началу main axis;
  - `center` — центрировать;
  - `flex-end` — прижать к концу;
  - `space-between` — первый в начале, последний в конце, расстояние между равное;
  - `space-around` — равные промежутки вокруг items;
  - `space-evenly` — равные промежутки между всеми краями и items.

  `align-items` выравнивает items по cross axis:

  ```css
  .card-row {
    align-items: stretch;
  }
  ```

  Частые значения:

  - `stretch` — растянуть по cross axis, если item не имеет фиксированного размера;
  - `flex-start` — к началу cross axis;
  - `center` — по центру cross axis;
  - `flex-end` — к концу cross axis;
  - `baseline` — выровнять по текстовой baseline.

  `flex-wrap` управляет переносом items:

  ```css
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  ```

  Значения:

  - `nowrap` — все items остаются в одной линии;
  - `wrap` — items переносятся на новые линии;
  - `wrap-reverse` — переносятся в обратном направлении cross axis.

  `align-content` работает только когда есть несколько flex lines, то есть при `flex-wrap: wrap`. Оно распределяет сами линии по cross axis.

  ```css
  .wrapped-grid {
    align-content: space-between;
  }
  ```

  `gap`, `row-gap`, `column-gap` задают расстояние между flex items без margin hacks:

  ```css
  .actions {
    display: flex;
    gap: 8px;
  }
  ```

  `flex-flow` — shorthand для `flex-direction` и `flex-wrap`:

  ```css
  .list {
    flex-flow: row wrap;
  }
  ```

  **Свойства flex item**

  `flex-grow` говорит, как item забирает свободное пространство вдоль main axis.

  ```css
  .search {
    flex-grow: 1;
  }
  ```

  Если у одного item `flex-grow: 1`, а у остальных `0`, он займет оставшееся место.

  `flex-shrink` говорит, насколько item может сжиматься, если места не хватает.

  ```css
  .logo {
    flex-shrink: 0;
  }
  ```

  `flex-basis` задает начальный размер item до распределения свободного места.

  ```css
  .sidebar {
    flex-basis: 280px;
  }
  ```

  `flex` — shorthand для `flex-grow`, `flex-shrink`, `flex-basis`.

  ```css
  .content {
    flex: 1; /* обычно интерпретируется как 1 1 0% */
  }

  .sidebar {
    flex: 0 0 280px; /* не растет, не сжимается, база 280px */
  }
  ```

  Практические варианты:

  ```css
  .item {
    flex: 1;
  }

  .fixed {
    flex: 0 0 auto;
  }

  .fluid-with-minimum {
    flex: 1 1 240px;
  }
  ```

  `align-self` переопределяет `align-items` для конкретного item:

  ```css
  .avatar {
    align-self: flex-start;
  }
  ```

  `order` меняет визуальный порядок item:

  ```css
  .primary-action {
    order: -1;
  }
  ```

  Использовать `order` нужно осторожно: visual order может отличаться от DOM order, что влияет на keyboard navigation и screen readers.

  Пример layout: header с логотипом, поиском и actions.

  ```css
  .header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo {
    flex: 0 0 auto;
  }

  .search {
    flex: 1 1 320px;
    min-width: 160px;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex: 0 0 auto;
  }
  ```

  Главный практический вывод: `justify-content` работает вдоль main axis, `align-items` — вдоль cross axis, а `flex` на item управляет тем, сколько места item занимает и как реагирует на нехватку/избыток пространства.

- What problems does Flexbox solve?

  **Ответ:** Flexbox упрощает выравнивание, распределение свободного места, вертикальное центрирование, responsive rows/columns, одинаковые высоты элементов. Он лучше float/table hacks для component layouts.

- What is responsive design?

  **Ответ:** Responsive design — подход, при котором layout адаптируется к разным размерам экранов, input methods и density. Используются fluid grids, flexible media, media queries, responsive typography, mobile-first design.

- How do CSS preprocessors such as SASS and LESS work?

  **Ответ:** SASS/LESS расширяют CSS переменными, nesting, mixins, functions и partials. Потом компилируются в обычный CSS, который понимает браузер.

  ```scss
  $accent: #0ea5e9;

  .button {
    color: $accent;
    &:hover { color: darken($accent, 10%); }
  }
  ```

- What are the differences between SASS and LESS?

  **Ответ:** Оба препроцессора похожи, но SASS/SCSS более распространен, имеет мощную ecosystem и syntax. LESS исторически проще и часто использовался с Bootstrap ранних версий. В modern CSS часть возможностей заменили CSS variables, nesting и build tools.

- What are pseudo-elements?

  **Ответ:** Pseudo-elements создают стилизуемую часть элемента: `::before`, `::after`, `::first-line`, `::first-letter`, `::marker`, `::selection`. Часто `::before/::after` используют для декоративного content.

  ```css
  .badge::before {
    content: '★';
  }
  ```

- What are pseudo-classes?

  **Ответ:** Pseudo-classes выбирают элемент по состоянию или положению: `:hover`, `:focus`, `:checked`, `:disabled`, `:first-child`, `:nth-child`, `:not`, `:has`. Они не создают новый элемент, а описывают condition.

- What layout techniques exist besides Flexbox?

  **Ответ:** CSS Grid, normal flow/block layout, inline layout, float, multi-column layout, table layout, absolute/fixed/sticky positioning, container queries, subgrid, framework grids. Для page-level 2D layouts часто лучше Grid, для component alignment — Flexbox.

- What is the difference between Float, Flexbox, CSS Grid, and framework-based layouts?

  **Ответ:** Float изначально для обтекания текста, layout на float — legacy. Flexbox — one-dimensional layout: row или column. CSS Grid — two-dimensional layout: rows и columns одновременно. Framework layouts дают готовые classes/components, но добавляют conventions и ограничения.

- How is responsive design implemented in practice?

  **Ответ:** Mobile-first CSS, fluid units, media queries, responsive images, flexible grids, container queries, scalable typography, touch-friendly controls, testing on real breakpoints.

  ```css
  .grid {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  ```

- How do CSS animations work?

  **Ответ:** CSS animations используют `@keyframes` и свойства `animation-*`. Браузер интерполирует значения между keyframes. Для performance лучше анимировать `transform` и `opacity`, а не layout-heavy свойства вроде `width/top`.

- What are keyframes?

  **Ответ:** `@keyframes` описывает этапы анимации. Можно использовать `from/to` или проценты.

  ```css
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  ```

- What are CSS transitions?

  **Ответ:** Transitions плавно изменяют значение CSS-свойства при изменении состояния, например `:hover` или добавлении class.

  ```css
  .button {
    transition: background-color 150ms ease, transform 150ms ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }
  ```

- How are browser-specific styles handled?

  **Ответ:** Через feature detection, progressive enhancement, vendor prefixes, Autoprefixer, `@supports`, normalization/reset styles и testing в target browsers. Лучше проверять поддержку свойства, чем sniff-ить user agent.

  ```css
  @supports (display: grid) {
    .layout {
      display: grid;
    }
  }
  ```
