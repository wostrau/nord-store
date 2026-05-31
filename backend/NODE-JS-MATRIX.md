# Node.js Matrix: вопросы и ответы

- What is Node.js?

  **Ответ:** Node.js — runtime-среда для выполнения JavaScript вне браузера. Она построена вокруг движка V8, libuv и набора core APIs для работы с сетью, файловой системой, процессами, потоками данных и операционной системой.

- What are the main features of Node.js?

  **Ответ:** Главные особенности Node.js: event-driven архитектура, non-blocking I/O, единый язык JavaScript/TypeScript для backend и frontend, богатая npm-экосистема, streams, встроенные HTTP/TCP APIs, поддержка child processes, worker threads и native addons.

- How does the single-threaded model work in Node.js?

  **Ответ:** Пользовательский JavaScript-код в Node.js обычно выполняется в одном основном потоке. При этом I/O-операции, DNS, crypto, fs и некоторые системные задачи могут выполняться асинхронно через libuv, ОС или thread pool. Поэтому Node.js может обслуживать много соединений без thread-per-request модели.

- What is non-blocking I/O?

  **Ответ:** Non-blocking I/O означает, что операция ввода-вывода запускается и не блокирует основной поток до завершения. Когда операция завершена, callback, promise continuation или event попадает в очередь event loop.

  ```js
  import { readFile } from 'node:fs/promises';

  const contentPromise = readFile('file.txt', 'utf8');
  console.log('This runs before file read completes');
  const content = await contentPromise;
  ```

- How does the event loop work in Node.js?

  **Ответ:** Event loop — механизм, который позволяет Node.js выполнять асинхронные операции без блокировки основного JavaScript-потока. Синхронный код выполняется сразу в call stack. Когда код запускает timer, сетевой запрос, файловую операцию или другую async-задачу, Node.js регистрирует эту работу в libuv, операционной системе или thread pool. После завершения операции соответствующий callback попадает в очередь, а event loop выполняет его, когда call stack свободен.

  Event loop проходит несколько фаз:

  - `timers` — выполняет callbacks от `setTimeout()` и `setInterval()`, если их минимальная задержка уже истекла. Например, сюда попадает callback периодического health check, retry timer или delayed cleanup.
  - `pending callbacks` — выполняет некоторые I/O callbacks, отложенные с предыдущей итерации event loop. Например, сюда могут попасть отдельные системные TCP errors или callbacks, которые libuv не выполнил сразу в poll phase.
  - `idle/prepare` — внутренние фазы libuv и Node.js. Пользовательский JavaScript обычно не работает с ними напрямую; они нужны runtime-у для подготовки к poll phase и внутренних housekeeping-задач.
  - `poll` — основная фаза ожидания и обработки I/O events. Здесь Node.js получает готовые socket events, HTTP requests, database/network callbacks, результаты некоторых файловых операций после thread pool и другие I/O notifications. Если очередь poll пуста, event loop может ждать новые I/O events или перейти дальше, если есть готовые `setImmediate()` callbacks.
  - `check` — выполняет callbacks от `setImmediate()`. Это удобно, когда нужно запланировать работу сразу после poll phase, например после завершения I/O callback.
  - `close callbacks` — выполняет callbacks закрытия handles, например `socket.on('close', ...)`, когда socket или stream был закрыт.

  Между фазами Node.js также очищает очереди microtasks: сначала `process.nextTick()`, затем promise microtasks. Поэтому `process.nextTick()` и `Promise.then()` обычно выполняются раньше timers и I/O callbacks, если они были поставлены в очередь в текущем turn. Важно не злоупотреблять `process.nextTick()`: бесконечная очередь nextTick callbacks может не дать event loop перейти к I/O.

  Важно понимать, что event loop не делает CPU-bound JavaScript параллельным. Если callback выполняет тяжелый синхронный расчет, он блокирует весь процесс: новые HTTP-запросы, timers и I/O callbacks будут ждать. Поэтому CPU-heavy работу выносят в worker threads, child processes, отдельные сервисы или разбивают на небольшие chunks.

  ```js
  setTimeout(() => console.log('timer'), 0);
  setImmediate(() => console.log('immediate'));
  Promise.resolve().then(() => console.log('promise'));
  process.nextTick(() => console.log('nextTick'));
  console.log('sync');

  // Типичный порядок:
  // sync
  // nextTick
  // promise
  // timer / immediate: порядок между ними зависит от контекста event loop
  ```

- What are the core parts of Node.js architecture?

  **Ответ:** Архитектуру Node.js удобно рассматривать как несколько слоев, которые соединяют JavaScript-код приложения с операционной системой.

  - Application code — ваш JavaScript/TypeScript код: HTTP handlers, services, business logic, CLI logic, jobs. Он выполняется в основном JavaScript-потоке и должен не блокировать event loop тяжелыми синхронными операциями.
  - Node.js Core APIs — встроенные модули вроде `http`, `fs`, `stream`, `crypto`, `net`, `process`, `events`, `worker_threads`. Они дают серверные возможности, которых нет в обычном браузерном JavaScript.
  - V8 — JavaScript engine, который парсит, компилирует и выполняет JS. Он отвечает за JIT-оптимизации, call stack, heap и garbage collection.
  - Node.js bindings — C/C++ слой, который связывает JavaScript APIs с нативными библиотеками и системными вызовами. Например, `fs.readFile()` из JS в итоге проходит через нативный слой к libuv/ОС.
  - libuv — библиотека, которая реализует event loop, timers, thread pool, TCP/UDP, async I/O abstractions и работу с процессами. Она скрывает различия между Linux, macOS и Windows.
  - Thread pool — часть libuv для операций, которые нельзя эффективно выполнить как non-blocking I/O на всех платформах. Туда попадают многие `fs` операции, часть `crypto`, `zlib`, некоторые DNS operations.
  - Operating system — предоставляет реальные ресурсы: file descriptors, sockets, networking stack, filesystem, processes, signals и I/O polling mechanisms вроде epoll/kqueue/IOCP.
  - Native addons / N-API — возможность расширить Node.js нативным C/C++ кодом, когда нужен доступ к системной библиотеке или высокая производительность.
  - npm ecosystem — не часть runtime ядра, но важная часть платформы: packages, CLI tools, frameworks и reusable libraries, которые строятся поверх core APIs.

  На практике путь запроса выглядит так: приложение вызывает JS API, Node.js core module передает работу через bindings, libuv или нативная библиотека взаимодействует с ОС, а результат возвращается обратно в JavaScript callback, promise или stream через event loop.

- What is the role of V8 in Node.js?

  **Ответ:** V8 компилирует и выполняет JavaScript. Он отвечает за JIT-компиляцию, оптимизацию кода, управление heap-памятью и garbage collection. Node.js добавляет поверх V8 серверные API и интеграцию с ОС.

- What are Node.js bindings?

  **Ответ:** Bindings — мост между JavaScript API Node.js и нативной C/C++ реализацией. Например, когда JS-код вызывает fs или crypto API, Node.js через bindings передает работу в нативный слой и libuv/OpenSSL/системные API.

- What is libuv and what problems does it solve?

  **Ответ:** libuv — C-библиотека, которая предоставляет event loop, thread pool, cross-platform I/O abstraction, timers, TCP/UDP и работу с процессами. Она скрывает различия между Linux, macOS и Windows и позволяет Node.js иметь единый async API.

- What are the advantages of Node.js?

  **Ответ:** Node.js хорошо подходит для I/O-heavy систем, real-time API, микросервисов, API gateways и full-stack JavaScript. Он дает высокую конкурентность, быстрый старт разработки, большую ecosystem и удобную работу с JSON/HTTP.

- What are the disadvantages of Node.js?

  **Ответ:** Node.js хуже подходит для CPU-bound задач в основном потоке, потому что тяжелые вычисления блокируют event loop. Также нужно внимательно работать с async error handling, backpressure, memory leaks, dependency security и качеством npm-пакетов.

- In which types of projects is Node.js most suitable?

  **Ответ:** Node.js лучше всего подходит для проектов, где много сетевого или файлового I/O, много одновременных соединений и не слишком много тяжелых CPU-bound вычислений в основном request path. Его сильная сторона — быстро принимать запросы, ждать внешние ресурсы асинхронно и эффективно отдавать результат.

  Хорошие типы проектов для Node.js:

  - REST/GraphQL API — например backend для интернет-магазина, CRM, mobile app или admin panel. Node.js хорошо работает с JSON, HTTP, middleware и большим количеством параллельных запросов к БД/внешним API.
  - BFF, или Backend for Frontend — отдельный backend слой для Angular/React/mobile клиента, который агрегирует данные из нескольких сервисов и возвращает удобный DTO для UI.
  - Real-time приложения — чаты, live notifications, collaborative editors, online dashboards, multiplayer lobby. Здесь полезны WebSocket, Server-Sent Events и event-driven модель.
  - API Gateway / edge service — сервис, который проверяет auth, проксирует запросы, нормализует ответы, делает rate limiting и маршрутизацию между downstream services.
  - Микросервисы с I/O-heavy логикой — например сервис заказов, email notifications, payment orchestration, webhooks processor, integration service с внешними providers.
  - Streaming и upload/download сервисы — обработка файлов, проксирование больших ответов, CSV export, video/audio metadata pipeline, log streaming. Streams и backpressure в Node.js здесь особенно полезны.
  - Server-side rendering и full-stack JavaScript — например Next.js/Nuxt-like приложения, где frontend и backend используют один язык и могут делить типы/валидацию.
  - CLI и developer tools — генераторы, build utilities, migration tools, code analyzers, scripts для автоматизации. npm ecosystem делает такие инструменты удобными для распространения.

  Node.js менее удачен как единственный runtime для тяжелых вычислений: machine learning inference, image/video encoding, сложная математика, CPU-heavy reports. Такие задачи лучше выносить в worker threads, child processes, отдельный сервис на другом runtime или специализированную очередь задач.

- How does Node.js handle concurrency in a single-threaded environment?

  **Ответ:** Node.js достигает concurrency не за счет отдельного JavaScript-потока на каждый запрос, а за счет event loop и асинхронного I/O. Основной поток быстро принимает запрос, запускает неблокирующую операцию и освобождается для обработки других событий. Когда операция завершается, ее callback, promise continuation или stream event возвращается в event loop.

  Как это работает на практике:

  - Сетевые операции, например HTTP-запросы, TCP sockets, запросы к внешним API или БД, обычно ожидаются через механизмы ОС. Пока приложение ждет ответ, основной JS-поток может обрабатывать другие запросы.
  - Файловые операции, часть `crypto`, `zlib` и некоторые DNS operations выполняются через libuv thread pool, потому что они могут быть blocking на уровне ОС.
  - Timers и I/O callbacks возвращаются в event loop и выполняются только когда call stack свободен.
  - Promise callbacks и `process.nextTick()` выполняются как microtasks между фазами event loop.

  Важно различать concurrency и parallelism. Node.js может держать тысячи concurrent I/O operations, но JavaScript callback в одном процессе все равно выполняется последовательно. Если один callback делает тяжелый CPU-bound расчет, он блокирует остальные callbacks. Для настоящего parallelism используют `worker_threads`, `child_process`, `cluster`, очереди задач или отдельные сервисы.

  ```js
  app.get('/profile/:id', async (req, res) => {
    const [user, orders] = await Promise.all([
      userService.findById(req.params.id),
      orderService.findByUserId(req.params.id)
    ]);

    res.json({ user, orders });
  });
  ```

  В этом примере Node.js не ждет каждый запрос последовательно. Оба I/O-запроса запускаются конкурентно, а event loop в это время может обслуживать другие клиенты.

- How is error handling implemented in asynchronous Node.js code?

  **Ответ:** В callback API часто используется error-first callback: `(err, result) => {}`. В promise/async-await коде ошибки обрабатываются через `.catch()` или `try/catch`. В streams и EventEmitter важно подписываться на `error`, иначе процесс может аварийно завершиться.

  ```js
  try {
    const user = await userService.findById(id);
  } catch (error) {
    logger.error(error);
  }
  ```

- What are common pitfalls of event-driven architecture in Node.js?

  **Ответ:** Частые проблемы: потерянные ошибки в async code, event listener leaks, отсутствие backpressure, race conditions, сложная трассировка потока выполнения и блокировка event loop тяжелыми синхронными задачами.

- How can issues in event-driven systems be mitigated?

  **Ответ:** Нужны структурированное логирование, centralized error handling, monitoring event loop lag, backpressure, timeouts, retries with limits, circuit breakers, typed events, аккуратное снятие listeners и тесты на failure scenarios.

- What are memory leaks in Node.js?

  **Ответ:** Memory leak — ситуация, когда приложение удерживает ссылки на объекты, которые уже не нужны. Типичные причины: глобальные caches без eviction, неочищенные timers/listeners, замыкания на большие объекты, массивы с бесконечным ростом и неправильно закрытые resources.

- How can memory leaks be detected and fixed?

  **Ответ:** Используют heap snapshots, Chrome DevTools, `node --inspect`, профилирование памяти, метрики RSS/heapUsed и нагрузочные тесты. Исправление обычно сводится к удалению лишних ссылок, ограничению caches, снятию listeners, закрытию handles и корректной lifecycle-логике.

- How can Node.js applications be optimized for performance and scalability in production?

  **Ответ:** Оптимизация включает async I/O, отсутствие CPU-heavy работы в event loop, streams/backpressure, clustering или horizontal scaling, caching, DB indexes, connection pooling, gzip/brotli на edge, observability, graceful shutdown и лимиты на payload/timeouts.

- What is the purpose of the http module in Node.js?

  **Ответ:** `node:http` предоставляет низкоуровневые APIs для создания HTTP-серверов и клиентов. На нем построены многие frameworks, включая Express: они оборачивают `IncomingMessage` и `ServerResponse`, добавляя routing, middleware и удобные helpers.

- How can a simple HTTP server be created using Node.js?

  **Ответ:** Нужно создать server через `http.createServer()` и обработать `req`/`res`.

  ```js
  import http from 'node:http';

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
  });

  server.listen(3000);
  ```

- What are req and res objects?

  **Ответ:** `req` — объект входящего запроса, экземпляр `http.IncomingMessage`. Он содержит method, url, headers и stream body. `res` — объект ответа, экземпляр `http.ServerResponse`, через который задают status, headers и тело ответа.

- How do res.write() and res.end() work?

  **Ответ:** `res.write()` отправляет часть тела ответа и может вызываться несколько раз. `res.end()` завершает response stream и сообщает клиенту, что ответ окончен. Можно передать финальный chunk прямо в `res.end(data)`.

- What happens if res.end() is not called?

  **Ответ:** Клиент будет ждать завершения ответа, соединение может зависнуть до timeout, а сервер будет удерживать ресурсы. В HTTP handler важно всегда завершать response или передавать управление middleware, который это сделает.

- How are response headers set in Node.js?

  **Ответ:** Headers задаются через `res.setHeader(name, value)` до отправки body. Также можно использовать `res.writeHead(statusCode, headers)`, но в приложениях чаще удобнее отдельно выставлять status и headers.

  ```js
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ id: 1 }));
  ```

- What is the purpose of the Content-Type header?

  **Ответ:** `Content-Type` сообщает клиенту MIME-тип тела ответа: JSON, HTML, plain text, form data, stream и т.д. Без него клиент может неправильно интерпретировать body.

- How can HTTP status codes be set in responses?

  **Ответ:** В core `http` status задается через `res.statusCode` или `res.writeHead()`. В Express обычно используют `res.status(code)`.

  ```js
  res.statusCode = 404;
  res.end('Not found');
  ```

- How can an HTTPS server be configured in Node.js?

  **Ответ:** HTTPS server создается через `node:https` с TLS key/certificate. В production TLS часто завершается на reverse proxy или load balancer, но Node.js тоже может принимать HTTPS напрямую.

  ```js
  import https from 'node:https';
  import { readFileSync } from 'node:fs';

  https.createServer({
    key: readFileSync('server.key'),
    cert: readFileSync('server.crt')
  }, app).listen(443);
  ```

- What are the differences between HTTP and HTTPS servers?

  **Ответ:** HTTP передает данные без шифрования. HTTPS использует TLS: шифрование, проверку сертификата и защиту от перехвата/подмены трафика. В Node.js API похожи, но HTTPS требует TLS options.

- How can JSON and form data be parsed manually or with middleware?

  **Ответ:** В core `http` body читают как stream, собирают chunks и парсят вручную. В Express обычно используют `express.json()` и `express.urlencoded()`.

  ```js
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  ```

- What is the role of body-parser middleware?

  **Ответ:** Body-parser middleware читает request body, проверяет content type и превращает JSON/form payload в `req.body`. В современных версиях Express базовые parsers встроены как `express.json()` и `express.urlencoded()`.

- What are common HTTP headers such as Cache-Control, Authorization, and Set-Cookie?

  **Ответ:** HTTP headers передают metadata о запросе или ответе. Они не являются body, но сильно влияют на безопасность, кеширование, формат данных, авторизацию и поведение браузера.

  Частые headers:

  - `Cache-Control` — управляет кешированием response. Например, `no-store` запрещает сохранять ответ, `no-cache` требует revalidation, `max-age=3600` разрешает кешировать на час, `private` ограничивает кеш конкретным пользователем, `public` разрешает shared caches.
  - `Authorization` — передает credentials клиента. Частые схемы: `Bearer <token>` для JWT/OAuth tokens, `Basic <base64>` для basic auth. Этот header нельзя логировать в открытом виде.
  - `Set-Cookie` — сервер устанавливает cookie в браузере. Важные атрибуты: `HttpOnly` запрещает доступ из JS, `Secure` разрешает отправку только по HTTPS, `SameSite` снижает CSRF-риск, `Max-Age`/`Expires` задают срок жизни, `Path` и `Domain` ограничивают область действия.
  - `Content-Type` — сообщает формат body: `application/json`, `text/html`, `multipart/form-data`. Без правильного `Content-Type` клиент или middleware может неверно обработать payload.
  - `Accept` — сообщает, какой формат клиент готов принять, например `application/json`.
  - `ETag` и `Last-Modified` — используются для conditional requests и revalidation кеша.
  - `Origin`, `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials` — участвуют в CORS.
  - `X-Request-Id` или `Traceparent` — помогают связывать logs/traces одного запроса в distributed systems.

  ```http
  Authorization: Bearer eyJhbGciOi...
  Cache-Control: private, max-age=300
  Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
  Content-Type: application/json
  ```

  Для API с персональными данными обычно выбирают осторожную cache policy, например `Cache-Control: no-store`, а auth/session headers обрабатывают как sensitive данные.

- How can request validation be implemented in an HTTP server?

  **Ответ:** Validation обычно делается до business logic: проверяются body, query, params, headers и auth context. Можно использовать ручные проверки или schema libraries вроде Zod/Joi/Yup. Ошибки лучше возвращать в едином JSON-формате.

- How is the http module used internally by frameworks like Express.js?

  **Ответ:** Frameworks вроде Express не заменяют `node:http`, а строятся поверх него. В основе все равно находится HTTP server, который принимает TCP-соединения, парсит HTTP-запрос и вызывает request listener с двумя объектами: `req` (`http.IncomingMessage`) и `res` (`http.ServerResponse`).

  Express application фактически является function-like request handler. Когда вызывается `app.listen(port)`, Express внутри создает HTTP server примерно как `http.createServer(app)` и передает себя как callback для каждого запроса.

  ```js
  import http from 'node:http';
  import express from 'express';

  const app = express();

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const server = http.createServer(app);
  server.listen(3000);
  ```

  Что Express добавляет поверх `http`:

  - Расширяет `req` и `res` удобными helper-методами: `req.params`, `req.query`, `req.body`, `res.status()`, `res.json()`, `res.send()`, `res.cookie()`.
  - Строит middleware pipeline. Каждый middleware получает `req`, `res`, `next` и может изменить request/response, завершить ответ или передать управление дальше.
  - Реализует routing: сравнивает HTTP method и path с зарегистрированными routes, например `GET /products/:id`.
  - Делает path matching и извлекает route params.
  - Позволяет подключать body parsers, static files, auth middleware, validation и error handlers.
  - В конце все равно использует низкоуровневый `ServerResponse`: выставляет status code, headers и вызывает методы записи/завершения ответа.

  То есть Express — это abstraction layer над `node:http`: он не меняет базовую модель HTTP-сервера, а добавляет routing, middleware composition и ergonomics для application code.

- What are persistent HTTP connections?

  **Ответ:** Persistent connections, или keep-alive, позволяют использовать одно TCP-соединение для нескольких HTTP-запросов. Это снижает overhead на установку соединений и TLS handshakes.

- How does HTTP/2 work?

  **Ответ:** HTTP/2 использует бинарный протокол, multiplexing нескольких streams в одном TCP-соединении, header compression через HPACK и приоритеты потоков. Это уменьшает overhead и проблему head-of-line blocking на уровне HTTP/1.1 pipelining.

- What are the advantages of HTTP/2?

  **Ответ:** Преимущества HTTP/2: multiplexing, сжатие headers, меньше соединений, лучшая эффективность для множества ресурсов и более гибкое управление потоками. На практике часто используется через reverse proxy/CDN.

- What are multiplexing, server push, and binary framing?

  **Ответ:** Multiplexing позволяет передавать несколько request/response streams по одному соединению. Binary framing разбивает данные на бинарные frames вместо текстового HTTP/1.1 формата. Server push позволял серверу отправлять ресурсы заранее, но в современных браузерных сценариях используется редко и во многих местах считается нежелательным.

- What load balancing strategies exist?

  **Ответ:** Load balancing strategy определяет, как распределять входящие запросы между несколькими backend instances. Выбор зависит от типа нагрузки, statefulness, latency, health checks, sticky sessions и инфраструктуры.

  Основные стратегии:

  - Round-robin — запросы распределяются по серверам по очереди: A, B, C, A, B, C. Это простая стратегия для примерно одинаковых instances и равномерной нагрузки. Минус: она не учитывает реальную занятость сервера.
  - Weighted round-robin — как round-robin, но каждому серверу задается вес. Более мощный instance получает больше запросов. Подходит, когда servers имеют разную CPU/RAM capacity или часть instances временно должна получать меньше traffic.
  - Least connections — новый запрос отправляется на сервер с наименьшим количеством активных соединений. Хорошо подходит для долгих запросов, WebSocket, streaming и случаев, где requests сильно отличаются по длительности.
  - Weighted least connections — учитывает и количество соединений, и вес сервера. Полезно, когда instances разной мощности, а соединения долгоживущие.
  - IP hash / source hash — backend выбирается на основе hash от IP клиента или другого stable key. Это дает sticky behavior: один клиент чаще попадает на один и тот же сервер. Минус: при NAT много пользователей могут выглядеть как один IP, а при изменении пула servers распределение меняется.
  - Consistent hashing — запросы распределяются по hash ring, и при добавлении/удалении server перераспределяется только часть keys. Полезно для cache clusters, sharded systems и stateful routing, где важно минимизировать перемещение ключей.
  - Least response time / latency-based — load balancer учитывает текущую latency или response time backend-ов и направляет traffic туда, где ответы быстрее. Подходит для разных регионов или неодинаковой текущей нагрузки, но требует качественных метрик.
  - Random / power of two choices — случайно выбирается один сервер или два сервера, затем из двух выбирается менее загруженный. Вторая версия часто дает хороший баланс при низком overhead.
  - Health-check based routing — traffic отправляется только на healthy instances. Обычно это не отдельная стратегия распределения, а обязательный слой поверх других стратегий: unhealthy server исключается из пула.
  - Geo-based routing — пользователь направляется в ближайший регион или data center. Это снижает latency, но требует продуманной репликации данных и failover.
  - Sticky sessions / session affinity — запросы одного пользователя направляются на один backend instance через cookie, IP hash или session key. Это нужно для stateful приложений, но хуже масштабируется, чем stateless API с внешним session store.

  В современных web-системах часто комбинируют несколько подходов: например, geo routing на DNS/CDN уровне, health checks на load balancer уровне и weighted least connections внутри региона.

- How can load balancing be implemented in Node.js?

  **Ответ:** Load balancing для Node.js чаще реализуют не внутри application code, а отдельным инфраструктурным слоем перед несколькими Node.js processes/instances. Сам Node.js process обычно остается stateless HTTP worker-ом, а распределение traffic делает proxy, orchestrator или cloud provider.

  Основные способы:

  - Reverse proxy на одном сервере — Nginx, HAProxy, Envoy или Caddy принимает внешний traffic и распределяет его между несколькими Node.js processes на разных портах. Это простой и частый вариант для VPS/bare metal. Proxy также может делать TLS termination, gzip, rate limiting, request size limits и health checks.
  - Node.js `cluster` module — primary process запускает несколько worker processes, обычно по числу CPU cores. Workers могут слушать один порт, а Node.js/ОС распределяет соединения между ними. Это удобно для использования всех cores на одной машине, но не заменяет multi-host load balancing.
  - PM2 cluster mode — process manager поверх Node.js cluster-подхода. Он упрощает запуск нескольких workers, restarts, logs и zero-downtime reload. Это pragmatic вариант для небольших production setups, но в больших системах часто уступает Kubernetes/systemd + external LB.
  - Cloud Load Balancer — AWS ALB/NLB, GCP Load Balancer, Azure Load Balancer и аналоги. Они распределяют traffic между instances/containers, делают health checks, TLS termination, autoscaling integration и иногда path/host-based routing.
  - Kubernetes Service / Ingress — Service распределяет traffic между pods, а Ingress Controller или Gateway API принимает внешний traffic. Это стандартный способ для containerized Node.js приложений. Readiness/liveness probes управляют тем, получает ли pod traffic.
  - DNS/CDN-level balancing — Cloudflare, Route 53, global load balancers и CDN могут направлять пользователей в ближайший регион, делать failover и кешировать static/API responses. Обычно комбинируется с regional load balancer.
  - Application-level balancing — Node.js сервис сам выбирает downstream instance, например через service discovery, consistent hashing или custom routing. Это используют для internal clients, gateways или sharded/stateful systems, но такой код сложнее поддерживать и тестировать.

  Минимальный пример с `cluster`:

  ```js
  import cluster from 'node:cluster';
  import os from 'node:os';
  import http from 'node:http';

  if (cluster.isPrimary) {
    for (let i = 0; i < os.availableParallelism(); i += 1) {
      cluster.fork();
    }
  } else {
    http.createServer((req, res) => {
      res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);
  }
  ```

  Практическое правило: для одного хоста можно использовать Nginx/HAProxy + несколько Node.js processes или PM2 cluster mode; для нескольких хостов/containers лучше использовать cloud load balancer, Kubernetes или managed platform. Для stateful sessions лучше выносить состояние во внешний store, например Redis или database, чтобы любой instance мог обработать запрос.

- What is request smuggling?

  **Ответ:** Request smuggling — атака, при которой злоумышленник заставляет proxy и backend по-разному интерпретировать границы HTTP-запросов, например через конфликт `Content-Length` и `Transfer-Encoding`. Это может привести к обходу auth, cache poisoning или подмешиванию запросов.

- How can request smuggling attacks be prevented?

  **Ответ:** Нужно использовать актуальные reverse proxies и Node.js версии, нормализовать headers, отклонять неоднозначные запросы, не принимать конфликтующие `Content-Length`/`Transfer-Encoding`, ограничивать body size и держать единый HTTP parsing path между proxy и backend.

- What are strategies for horizontal scaling in Node.js?

  **Ответ:** Horizontal scaling достигается запуском нескольких instances за load balancer, stateless API, external session store, shared cache, queue-based background jobs, autoscaling и разделением read/write нагрузки.

- How can memory usage and I/O operations be optimized?

  **Ответ:** Оптимизация памяти и I/O в Node.js обычно сводится к двум целям: не держать в памяти больше данных, чем нужно, и не блокировать event loop ожиданием или тяжелой обработкой. Важно оптимизировать не только код, но и взаимодействие с файлами, сетью, БД и внешними сервисами.

  Оптимизация памяти:

  - Использовать streams вместо чтения больших файлов или HTTP payload целиком в память. Например, для CSV export, file upload/download, proxying и logs.
  - Ограничивать размер request body, upload-файлов, JSON payload и очередей в памяти.
  - Не делать unbounded caches. Любой cache должен иметь TTL, max size или eviction policy, например LRU.
  - Удалять listeners, timers, intervals и references, которые больше не нужны, чтобы не создавать memory leaks.
  - Не хранить большие промежуточные массивы, если данные можно обрабатывать chunk-wise или batch-wise.
  - Осторожно работать с closures: долгоживущие callbacks могут удерживать большие объекты.
  - Использовать heap snapshots, `process.memoryUsage()`, APM и профилирование для поиска leaks, а не угадывать.

  Оптимизация I/O:

  - Использовать async APIs вместо sync APIs в request path: `fs.promises`, async DB clients, non-blocking network clients.
  - Применять connection pooling для БД и внешних сервисов, чтобы не создавать новое соединение на каждый запрос.
  - Использовать batching, pagination и streaming, если нужно обработать много записей.
  - Настраивать timeouts и cancellation, чтобы зависшие внешние calls не держали ресурсы бесконечно.
  - Применять backpressure в streams: не писать быстрее, чем downstream может принять данные.
  - Минимизировать количество round trips к БД: выбирать нужные поля, использовать индексы, объединять запросы там, где это не ломает читаемость.
  - Использовать compression осторожно: она снижает network I/O, но увеличивает CPU load. Часто compression лучше отдавать reverse proxy/CDN.
  - Избегать блокирующих `crypto`, `zlib` и больших JSON serialization/parsing в основном потоке, если payload большой.

  ```js
  import { pipeline } from 'node:stream/promises';
  import { createReadStream } from 'node:fs';

  app.get('/download/report', async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'text/csv');
      await pipeline(
        createReadStream('report.csv'),
        res
      );
    } catch (error) {
      next(error);
    }
  });
  ```

  Этот пример не загружает весь файл в память. Данные идут stream-ом, а `pipeline()` корректно обрабатывает backpressure и ошибки.

- What is the purpose of the Timers API in Node.js?

  **Ответ:** Timers API планирует выполнение callbacks в будущем: `setTimeout`, `setInterval`, `setImmediate`. В Node.js timer handles также поддерживают методы вроде `unref()`, чтобы timer не удерживал процесс живым.

- What is the difference between setTimeout() and setInterval()?

  **Ответ:** `setTimeout()` выполняет callback один раз после задержки. `setInterval()` выполняет callback повторно через интервалы, пока его не отменят. Для задач с переменной длительностью часто безопаснее рекурсивный `setTimeout`, чтобы избежать наложения запусков.

- How can timers be created and cancelled?

  **Ответ:** Timer создается через `setTimeout`, `setInterval` или `setImmediate`, а отменяется через соответствующие `clearTimeout`, `clearInterval`, `clearImmediate`.

  ```js
  const id = setTimeout(() => console.log('done'), 1000);
  clearTimeout(id);
  ```

- What are the differences between browser timers and Node.js timers?

  **Ответ:** API похожи, но Node.js возвращает timer object, а браузер обычно numeric id. В Node.js есть `unref()`/`ref()`, `setImmediate()` и integration с event loop фазами libuv.

- What is the difference between setImmediate() and setTimeout()?

  **Ответ:** `setTimeout(fn, 0)` планирует callback в timers phase после минимальной задержки. `setImmediate(fn)` планирует callback в check phase. Внутри I/O callback `setImmediate` обычно выполнится раньше `setTimeout(0)`.

- How does process.nextTick() differ from setImmediate()?

  **Ответ:** `process.nextTick()` выполняется до перехода event loop к следующей фазе и даже раньше promise microtasks в Node.js semantics. `setImmediate()` выполняется позже, в check phase. Чрезмерный `nextTick` может starvation-ом заблокировать event loop.

- How are timers used for throttling and debouncing?

  **Ответ:** Throttling и debouncing ограничивают частоту вызова дорогой операции: API-запроса, записи в БД, пересчета данных, логирования, resize/scroll handler-а или обработки burst-а событий.

  Debounce откладывает выполнение до момента, когда события перестали приходить в течение заданной задержки. Если событие приходит снова, старый timer отменяется и запускается новый. Это подходит для search input, autosave после паузы в наборе текста, validation после остановки ввода.

  ```js
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  ```

  Throttle гарантирует, что функция выполняется не чаще одного раза за заданный интервал. События могут приходить часто, но обработчик будет запускаться с ограниченной частотой. Это подходит для scroll/resize events, rate-limited metrics, polling-like updates и защиты дорогих операций от burst traffic.

  ```js
  function throttle(fn, interval) {
    let lastRun = 0;

    return (...args) => {
      const now = Date.now();

      if (now - lastRun < interval) {
        return;
      }

      lastRun = now;
      fn(...args);
    };
  }
  ```

  Главное отличие: debounce ждет тишины после серии событий, а throttle выполняет функцию регулярно, но не чаще заданного лимита.

- How does timer cancellation work with AbortController?

  **Ответ:** `AbortController` дает стандартный способ отменять асинхронные операции через `AbortSignal`. В Node.js promise-based timers из `node:timers/promises` принимают `signal`. Если вызвать `controller.abort()`, timer отменяется, а promise завершается ошибкой `AbortError`. Это удобнее, чем вручную хранить timer id, когда код уже построен на `async/await`.

  ```js
  import { setTimeout } from 'node:timers/promises';

  const controller = new AbortController();
  const timer = setTimeout(1000, 'done', {
    signal: controller.signal
  });

  controller.abort();

  try {
    const result = await timer;
    console.log(result);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Timer was cancelled');
    }
  }
  ```

  Практические use cases в Node.js:

  - Request timeout — отменить ожидание, если внешний API, очередь или внутренняя операция не ответила вовремя.
  - Graceful shutdown — при `SIGTERM` отменить отложенные retries, background sleeps и polling loops, чтобы процесс мог завершиться быстро.
  - Отмена retry/backoff — если операция больше не нужна, например пользователь отменил request или job был остановлен.
  - Общий cancellation signal — один `AbortSignal` можно передать сразу в несколько async операций: timer, `fetch`, stream pipeline или собственную функцию, если она поддерживает signal.

  ```js
  import { setTimeout as sleep } from 'node:timers/promises';

  async function pollQueue({ signal }) {
    while (!signal.aborted) {
      await processNextMessage();
      await sleep(5000, undefined, { signal });
    }
  }

  const controller = new AbortController();

  process.on('SIGTERM', () => {
    controller.abort();
  });

  await pollQueue({ signal: controller.signal });
  ```

  В таком polling loop `AbortController` позволяет остановить ожидание `sleep()` немедленно, а не ждать окончания пят секунд. Это важно для shutdown, tests и отменяемых background jobs.

- What is the fs module used for?

  **Ответ:** `node:fs` используется для работы с файловой системой: чтение, запись, удаление, metadata, permissions, streams, directories и file descriptors. Есть callback, sync и promise APIs.

- What is the difference between synchronous and asynchronous file operations?

  **Ответ:** Sync fs-операции блокируют event loop до завершения. Async fs-операции возвращают управление сразу и выполняются через libuv thread pool или системные async mechanisms. В server runtime sync fs стоит избегать в request path.

- How can large files be processed with streams?

  **Ответ:** Большие файлы лучше обрабатывать через streams, потому что stream читает данные небольшими chunks, а не загружает весь файл в память. Это особенно важно для logs, CSV exports/imports, file uploads/downloads, архивов и proxying больших responses.

  Backpressure — ключевой механизм streams. Он нужен, когда источник данных читает быстрее, чем получатель успевает обрабатывать или записывать данные. Без backpressure chunks будут накапливаться в памяти, что может привести к росту heap/RSS и падению процесса.

  В Node.js backpressure обычно работает так:

  - `Readable` stream производит chunks.
  - `Writable` stream принимает chunks во внутренний buffer.
  - Если buffer переполнен относительно `highWaterMark`, метод `write()` возвращает `false`.
  - Producer должен остановить активную запись и дождаться события `drain`.
  - `pipe()` и `pipeline()` делают эту координацию автоматически для стандартных streams.

  Для простого чтения можно слушать `data`, но для production-сценариев с несколькими streams лучше использовать `pipeline()`, потому что он корректно обрабатывает backpressure, ошибки и закрытие streams.

  ```js
  import { createReadStream, createWriteStream } from 'node:fs';
  import { pipeline } from 'node:stream/promises';

  await pipeline(
    createReadStream('large.log'),
    createWriteStream('large-copy.log')
  );
  ```

  Если нужно вручную писать в `Writable`, нужно учитывать результат `write()`:

  ```js
  async function writeChunks(readable, writable) {
    for await (const chunk of readable) {
      if (!writable.write(chunk)) {
        await new Promise((resolve) => writable.once('drain', resolve));
      }
    }

    writable.end();
  }
  ```

  `highWaterMark` управляет размером внутреннего buffer. Большое значение может повысить throughput, но увеличит память. Маленькое значение снижает memory usage, но может увеличить overhead. Обычно сначала используют defaults и меняют их только после измерений.

- How does fs.chmod() work?

  **Ответ:** `fs.chmod()` меняет permissions файла по Unix-style mode, например `0o644`. На Windows поддержка ограничена, потому что модель прав отличается.

  ```js
  import { chmod } from 'node:fs/promises';

  await chmod('script.sh', 0o755);
  ```

- How does Node.js handle File I/O internally?

  **Ответ:** Многие файловые операции передаются в libuv thread pool, потому что файловый I/O не всегда предоставляет portable non-blocking API на всех ОС. После завершения операция возвращает callback/promise continuation в event loop.

- How does the thread pool interact with file system operations?

  **Ответ:** Async fs operation ставится в очередь libuv thread pool. Worker thread выполняет blocking system call, затем результат возвращается в event loop. Если thread pool перегружен fs/crypto/zlib задачами, latency других операций может расти.

- What are limitations of file system operations in Node.js?

  **Ответ:** Ограничения: thread pool saturation, platform-specific permissions, race conditions с файлами, path traversal risks, memory pressure при чтении больших файлов целиком и проблемы с atomicity. Нужно использовать streams, validation paths и корректную обработку ошибок.

- What is EventEmitter?

  **Ответ:** `EventEmitter` — класс из `node:events`, который реализует event-driven publish/subscribe модель внутри одного Node.js процесса. Один объект публикует событие через `emit(eventName, ...args)`, а другие части кода подписываются на это событие через `on()`, `once()`, `off()` и похожие методы.

  Важно: listeners в `EventEmitter` вызываются синхронно в момент `emit()` и в порядке регистрации. Если listener выполняет тяжелый синхронный код, он блокирует остальные listeners и event loop. Если нужна асинхронная работа, listener сам запускает async operation.

  ```js
  import { EventEmitter } from 'node:events';

  const bus = new EventEmitter();

  bus.on('user.created', (user) => {
    console.log(`Send welcome email to ${user.email}`);
  });

  bus.on('user.created', (user) => {
    console.log(`Write audit log for user ${user.id}`);
  });

  bus.emit('user.created', {
    id: 'u1',
    email: 'user@example.com'
  });
  ```

  Основные методы:

  - `on(event, listener)` — подписывает listener на каждое событие.
  - `once(event, listener)` — listener выполнится только один раз и будет удален.
  - `emit(event, ...args)` — публикует событие и передает данные listeners.
  - `off(event, listener)` / `removeListener()` — удаляет конкретный listener.
  - `removeAllListeners(event)` — удаляет listeners, использовать осторожно.
  - `listenerCount(event)` — показывает количество listeners.

  Событие `error` имеет особое поведение: если вызвать `emit('error', error)` без listener-а на `error`, Node.js выбросит ошибку и процесс может завершиться.

  ```js
  const worker = new EventEmitter();

  worker.on('error', (error) => {
    console.error('Worker failed:', error);
  });

  worker.emit('error', new Error('Queue connection failed'));
  ```

  `EventEmitter` полезен для внутренних событий: lifecycle hooks, domain events внутри процесса, очереди задач, stream-like APIs, notifications между модулями. Но он не заменяет message broker: события не сохраняются, не доставляются между процессами и теряются, если listener не был зарегистрирован.

- How does event-driven programming work in Node.js?

  **Ответ:** Компоненты не вызывают друг друга напрямую во всех местах, а публикуют события. Listeners реагируют на эти события асинхронно или синхронно в момент `emit`. Это снижает связность, но требует дисциплины в error handling и lifecycle.

- How can custom events be emitted?

  **Ответ:** Нужно создать `EventEmitter`, зарегистрировать listener и вызвать `emit(eventName, payload)`.

  ```js
  import { EventEmitter } from 'node:events';

  const bus = new EventEmitter();
  bus.on('user.created', (user) => console.log(user.id));
  bus.emit('user.created', { id: 1 });
  ```

- How are listeners registered and removed?

  **Ответ:** Listeners регистрируются через `on`, `once`, `addListener`, а удаляются через `off`, `removeListener` или `removeAllListeners`. Для удаления нужно иметь ссылку на ту же функцию.

- What is the difference between on() and once()?

  **Ответ:** `on()` регистрирует listener, который будет вызываться при каждом событии. `once()` регистрирует listener, который автоматически удалится после первого вызова.

- How should the error event be handled in EventEmitter?

  **Ответ:** Событие `error` нужно обрабатывать обязательно. Если `EventEmitter` emitted `error`, а listener отсутствует, Node.js выбросит ошибку и процесс может завершиться.

  ```js
  emitter.on('error', (error) => {
    logger.error(error);
  });
  ```

- How does prependListener() work?

  **Ответ:** `prependListener()` добавляет listener в начало списка, поэтому он выполнится раньше уже зарегистрированных listeners для того же события. Это полезно редко, например для instrumentation или high-priority обработчиков.

- What is the difference between EventEmitter, Node.js Events API, and Browser EventTarget?

  **Ответ:** `EventEmitter` — Node.js класс с `on/emit`. Node.js Events API включает `EventEmitter`, helpers и совместимость с `EventTarget`. Browser `EventTarget` использует `addEventListener/dispatchEvent`, event objects и другую модель propagation.

- What is backpressure in high-load systems?

  **Ответ:** Backpressure — механизм, при котором потребитель сигнализирует producer, что не успевает обрабатывать данные. Без backpressure producer может переполнить память или очереди, вызывая latency spikes и crashes.

- How does the event loop process events and callbacks?

  **Ответ:** Event loop выполняет callbacks из фаз libuv, затем обрабатывает microtasks/nextTick между переходами. Синхронный callback должен завершиться быстро, иначе он задержит остальные events.

- What is the process module in Node.js?

  **Ответ:** `process` — глобальный объект с информацией и контролем текущего Node.js процесса: env, argv, cwd, pid, exit codes, signals, stdin/stdout/stderr, memory usage и lifecycle events.

- How are environment variables handled with process.env?

  **Ответ:** `process.env` содержит переменные окружения как строки. Их используют для конфигурации: порты, secrets, URLs, режим запуска. Значения нужно валидировать и не считать typed автоматически.

  ```js
  const port = Number(process.env.PORT ?? 3000);
  ```

- How does process.nextTick() work?

  **Ответ:** `process.nextTick(callback)` ставит callback в специальную очередь, которая выполняется после текущего стека, но до продолжения event loop. Это полезно для API consistency, но чрезмерное использование может заблокировать I/O callbacks.

- How are process signals handled?

  **Ответ:** Process signal — это уведомление от операционной системы или process manager-а процессу. В Node.js signals можно обрабатывать через `process.on(signal, handler)`. Обычно их используют для graceful shutdown: перестать принимать новые запросы, дождаться активных операций, закрыть DB connections, остановить background jobs и завершить процесс с корректным exit code.

  `SIGTERM` означает "terminate". Это вежливая просьба процессу завершиться. Такой сигнал часто приходит:

  - от orchestrator-а, например Kubernetes, когда pod удаляется, пересоздается или rollout заменяет старую версию;
  - от process manager-а, например systemd, PM2, Docker или supervisor;
  - от команды `kill <pid>` без указания другого сигнала;
  - от cloud/runtime платформы при scale down, deploy или остановке instance.

  `SIGINT` означает "interrupt". Обычно он приходит, когда пользователь нажимает `Ctrl+C` в терминале. В локальной разработке это самый частый способ остановить Node.js dev server. В отличие от `SIGTERM`, `SIGINT` чаще является интерактивным сигналом от пользователя, а не сигналом от production orchestrator-а.

  Важно: `SIGKILL` обработать нельзя. Если процесс получает `SIGKILL`, ОС завершает его принудительно без graceful cleanup.

  ```js
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}, shutting down`);

    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  ```

  На практике handler должен быть коротким и надежным. Часто добавляют fallback timeout: если graceful shutdown завис, процесс завершается принудительно через несколько секунд.

- What are process exit codes?

  **Ответ:** Exit code сообщает ОС, успешно ли завершился процесс. `0` обычно означает успех, ненулевые коды — ошибку. В Node.js можно установить `process.exitCode` или вызвать `process.exit(code)`.

- How can process usage statistics and reports be collected?

  **Ответ:** Можно использовать `process.memoryUsage()`, `process.cpuUsage()`, `process.resourceUsage()`, diagnostic reports, heap snapshots, performance hooks и APM-инструменты. Для production важны метрики event loop lag, heap, RSS, GC и latency.

- What is graceful degradation in Node.js processes?

  **Ответ:** Graceful degradation — способность сервиса продолжать частично работать при сбоях зависимостей. Например, при недоступном cache приложение может читать напрямую из DB, при падении внешнего API возвращать fallback или degraded response.

- What is the purpose of the child_process module?

  **Ответ:** `child_process` — core module Node.js для запуска отдельных процессов из текущего Node.js процесса. Он нужен, когда приложение должно выполнить внешнюю программу, изолировать работу в отдельном процессе, использовать системный CLI или распределить нагрузку за пределы основного event loop.

  Основные use cases:

  - Запуск внешних CLI tools: `git`, `ffmpeg`, `convert`, `openssl`, архиваторы, линтеры, build tools.
  - Изоляция тяжелой или рискованной задачи, чтобы она не блокировала и не роняла основной процесс.
  - Обработка больших stdout/stderr потоков через streams.
  - Создание worker-процессов для CPU-heavy задач, если `worker_threads` не подходят.
  - IPC между parent и child Node.js process через `fork()`.
  - Автоматизация scripts и integration с системными tools.

  Основные API:

  - `exec()` — запускает команду через shell и буферизует output. Удобно для коротких команд, но опасно с пользовательским input.
  - `execFile()` — запускает executable напрямую без shell. Безопаснее для аргументов, если shell не нужен.
  - `spawn()` — запускает процесс и отдает `stdin`, `stdout`, `stderr` как streams. Лучше для long-running процессов и большого output.
  - `fork()` — запускает новый Node.js процесс с IPC channel.
  - `execSync()`, `spawnSync()` — синхронные версии, блокируют event loop и обычно не должны использоваться в request path.

  ```js
  import { spawn } from 'node:child_process';

  const child = spawn('git', ['status', '--short'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk) => {
    console.log(chunk.toString());
  });

  child.on('exit', (code) => {
    console.log(`git exited with code ${code}`);
  });
  ```

  Важно учитывать безопасность: нельзя подставлять пользовательский ввод в shell-команду без строгой валидации. Если shell не нужен, лучше использовать `spawn()` или `execFile()` с массивом аргументов. Также нужно обрабатывать exit code, stderr, timeout, signals и cleanup child processes при shutdown.

- How does child_process.exec() work?

  **Ответ:** `child_process.exec()` запускает команду через shell, например `/bin/sh` на Unix-like системах или `cmd.exe` на Windows, и после завершения команды вызывает callback с `(error, stdout, stderr)`. В отличие от `spawn()`, `exec()` не отдает output потоково по умолчанию, а буферизует `stdout` и `stderr` в память до завершения процесса.

  `stdout` и `stderr` — это стандартные output streams процесса:

  - `stdout` означает standard output. Обычно туда программа пишет обычный результат работы: версию, JSON, список файлов, успешный output.
  - `stderr` означает standard error. Туда программа пишет ошибки, warnings, diagnostics и logs. Наличие текста в `stderr` не всегда означает failed command: некоторые CLI пишут warnings в `stderr`, но завершаются с exit code `0`.

  `error` в callback появляется, если процесс не смог запуститься, был завершен сигналом, превысил `maxBuffer` или завершился с ненулевым exit code. Поэтому в production обычно проверяют и `error`, и `stderr`, и exit semantics конкретной команды.

  ```js
  import { exec } from 'node:child_process';

  exec('node -v', (error, stdout, stderr) => {
    if (error) {
      console.error('Command failed:', error);
      return;
    }

    if (stderr) {
      console.warn('Command warnings:', stderr);
    }

    console.log('Command output:', stdout);
  });
  ```

  `exec()` удобен для коротких shell-команд вроде `node -v` или `git rev-parse HEAD`. Его не стоит использовать для команд с большим output, long-running процессов или пользовательским input. Для таких случаев лучше `spawn()` или `execFile()` с массивом аргументов.

- What is the difference between synchronous and asynchronous child processes?

  **Ответ:** Async methods, например `spawn` и `exec`, не блокируют event loop. Sync methods, например `spawnSync` и `execSync`, блокируют процесс до завершения child process и должны использоваться осторожно.

- How does child_process.spawn() work?

  **Ответ:** `spawn()` запускает процесс без shell по умолчанию и возвращает объект с streams `stdin`, `stdout`, `stderr`. Он лучше подходит для long-running процессов и большого output, потому что данные можно читать потоково.

- What are the differences between exec(), spawn(), and fork()?

  **Ответ:** `exec()` запускает shell-команду и буферизует output. `spawn()` запускает command/process и предоставляет streams. `fork()` запускает новый Node.js процесс с IPC-каналом, удобный для разделения JS-задач.

- How does inter-process communication work in Node.js?

  **Ответ:** IPC между parent и child Node.js процессом работает через канал сообщений. При `fork()` можно использовать `child.send(message)` и обработчик `process.on('message')` в child process.

- How are stdin, stdout, and stderr streams handled?

  **Ответ:** Это стандартные streams процесса. `stdin` используется для входных данных, `stdout` — для обычного вывода, `stderr` — для ошибок и diagnostics. В child processes эти streams можно pipe-ить, наследовать или игнорировать.

- What is the purpose of the errors module in Node.js?

  **Ответ:** Node.js имеет встроенные error classes и system errors, которые помогают единообразно представлять ошибки. Отдельного пользовательского `errors` core module обычно не используют; чаще говорят об Error API, `node:util` helpers и documented Node.js error codes.

- What are common built-in error types such as TypeError, RangeError, and ReferenceError?

  **Ответ:** `TypeError` возникает при неправильном типе операции, `RangeError` — при значении вне допустимого диапазона, `ReferenceError` — при обращении к несуществующей переменной. В Node.js также часто встречаются system errors с `code`, например `ENOENT`, `EADDRINUSE`, `ECONNRESET`.

- How are errors thrown and handled using throw and try...catch?

  **Ответ:** `throw` прерывает текущий поток выполнения и выбрасывает ошибку. `try...catch` ловит синхронные ошибки и ошибки из `await` внутри async function. Ошибки из callbacks нужно передавать явно.

  ```js
  try {
    if (!user) throw new Error('User not found');
  } catch (error) {
    logger.error(error);
  }
  ```

- How can custom error classes be created?

  **Ответ:** Custom error создается наследованием от `Error`, установкой `name` и дополнительных полей вроде `statusCode` или `code`. Это помогает централизованно обрабатывать разные типы ошибок.

  ```js
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'AppError';
      this.statusCode = statusCode;
    }
  }
  ```

- How should the Error API be used in production applications?

  **Ответ:** В production нужно сохранять stack trace в logs, не отдавать внутренние детали клиенту, использовать structured error codes, централизованный error middleware, корректные HTTP statuses и monitoring. Operational errors и programmer errors стоит различать.

- What is the purpose of the cluster module?

  **Ответ:** `cluster` — core module Node.js, который позволяет одному приложению запускать несколько worker processes и использовать несколько CPU cores. Один Node.js process выполняет JavaScript в одном основном потоке, поэтому без дополнительных процессов HTTP-сервер обычно использует только одно ядро для JS-кода. `cluster` решает это, создавая несколько независимых Node.js процессов с собственным event loop, heap memory и module state.

  Типичная модель:

  - Primary process не обрабатывает бизнес-запросы, а управляет workers.
  - Worker processes запускают HTTP server и выполняют application code.
  - Workers могут слушать один и тот же порт.
  - Входящие соединения распределяются между workers через механизм Node.js/ОС.
  - Если worker падает, primary может создать новый worker.

  ```js
  import cluster from 'node:cluster';
  import http from 'node:http';
  import os from 'node:os';

  if (cluster.isPrimary) {
    const workerCount = os.availableParallelism();

    for (let i = 0; i < workerCount; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} exited`, { code, signal });
      cluster.fork();
    });
  } else {
    http.createServer((req, res) => {
      res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);
  }
  ```

  `cluster` полезен для HTTP/API серверов на одной машине, когда нужно задействовать все CPU cores. Но он не заменяет полноценный orchestration layer: для нескольких машин, rolling deploys, service discovery, autoscaling и health checks обычно используют Kubernetes, PM2, systemd, Docker, cloud load balancers или process managers.

  Важно учитывать, что память между workers не общая. In-memory cache, sessions, counters и queues будут отдельными в каждом worker. Для shared state нужно использовать внешнее хранилище: Redis, database, message broker или distributed cache.

- How does the cluster module help Node.js utilize multiple CPU cores?

  **Ответ:** Node.js выполняет JavaScript-код одного процесса в одном основном потоке. Даже если на сервере 8 CPU cores, один обычный Node.js HTTP server не начнет автоматически выполнять JS callbacks параллельно на всех ядрах. `cluster` помогает, запуская несколько worker processes: каждый worker — отдельный Node.js process со своим V8 instance, event loop, heap и call stack. Операционная система может планировать эти процессы на разных CPU cores.

  Как это выглядит:

  - Primary process стартует N workers, часто по числу доступных CPU cores.
  - Каждый worker запускает тот же server code.
  - Workers могут слушать один порт.
  - Входящие соединения распределяются между workers.
  - Пока один worker занят обработкой CPU-heavy callback или долгой синхронной задачей, другие workers могут продолжать принимать и обрабатывать запросы.

  Есть два важных эффекта:

  - Увеличивается throughput для CPU-bound частей request processing, потому что несколько процессов могут выполняться параллельно на разных ядрах.
  - Повышается fault isolation: если один worker падает, primary может перезапустить его, не останавливая весь сервер.

  Но `cluster` не делает один request параллельным автоматически. Один конкретный request все равно обрабатывается одним worker-ом. Также workers не разделяют память, поэтому in-memory sessions/cache/rate limits будут локальными для каждого worker-а, если не вынести состояние во внешний store.

- How does cluster.fork() work?

  **Ответ:** `cluster.fork()` создает новый worker process, который запускает тот же Node.js entrypoint, что и primary process. Код файла выполняется заново, но в новом процессе `cluster.isPrimary` будет `false`, а `cluster.isWorker` — `true`. Поэтому в cluster-приложениях обычно пишут ветвление: primary создает workers, worker запускает HTTP server.

  Что происходит при `cluster.fork()`:

  - Primary process вызывает `cluster.fork()`.
  - Node.js создает новый child process для worker-а.
  - Worker получает свои `process.pid`, memory heap, event loop и V8 instance.
  - Между primary и worker создается IPC channel.
  - Worker выполняет тот же модуль, но попадает в worker-ветку кода.
  - Если worker вызывает `server.listen(port)`, Node.js cluster-механизм позволяет workers совместно принимать соединения на одном порту.

  ```js
  import cluster from 'node:cluster';
  import http from 'node:http';

  if (cluster.isPrimary) {
    const worker = cluster.fork({ WORKER_NAME: 'api-1' });

    worker.on('online', () => {
      console.log(`Worker ${worker.process.pid} is online`);
    });

    worker.on('message', (message) => {
      console.log('Message from worker:', message);
    });
  } else {
    process.send?.({
      type: 'worker.started',
      pid: process.pid,
      name: process.env.WORKER_NAME
    });

    http.createServer((req, res) => {
      res.end(`Worker ${process.pid}`);
    }).listen(3000);
  }
  ```

  `cluster.fork(env)` может принимать дополнительные environment variables для worker-а. Это удобно, если нужно передать worker role, shard id или feature flag. Но большие данные через env передавать не стоит.

  Primary может общаться с worker через `worker.send(message)`, а worker — через `process.send(message)`. Такой IPC подходит для control messages, health/status events и простых команд, но не для большого high-throughput data exchange.

- What is the relationship between master and worker processes?

  **Ответ:** В современной терминологии Node.js использует primary/worker. Primary управляет workers, может перезапускать их и распределять соединения. Workers выполняют application code и обрабатывают запросы.

- How are worker lifecycle events handled?

  **Ответ:** Cluster emits events вроде `fork`, `online`, `listening`, `disconnect`, `exit`. Обычно primary подписывается на `exit`, логирует причину и при необходимости запускает новый worker.

- What is the purpose of streams in Node.js?

  **Ответ:** Streams в Node.js нужны для работы с данными как с последовательностью chunks, а не как с одним большим значением в памяти. Это позволяет читать, записывать, преобразовывать и передавать большие объемы данных постепенно. Streams особенно важны для server-side приложений, где один процесс может одновременно обслуживать много пользователей и не должен держать большие payloads целиком в heap.

  Основные задачи streams:

  - Экономия памяти — файл на 5 GB можно читать маленькими chunks, не загружая все 5 GB в память.
  - Обработка данных по мере поступления — можно начинать отдавать response до того, как весь источник прочитан.
  - Backpressure — slow consumer может замедлить producer, чтобы buffers не росли бесконечно.
  - Композиция pipeline — можно соединять чтение, transform и запись в цепочку.
  - Унификация I/O — файлы, HTTP request/response, TCP sockets, compression, crypto и child process stdio используют stream-like модель.

  Типичные use cases:

  - file upload/download;
  - streaming HTTP response;
  - proxying external API response;
  - reading logs или CSV files;
  - gzip/brotli compression;
  - video/audio processing;
  - stdout/stderr child process;
  - ETL pipelines.

  ```js
  import { createReadStream } from 'node:fs';
  import { createGzip } from 'node:zlib';
  import { pipeline } from 'node:stream/promises';

  app.get('/logs.gz', async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/gzip');

      await pipeline(
        createReadStream('app.log'),
        createGzip(),
        res
      );
    } catch (error) {
      next(error);
    }
  });
  ```

  В этом примере Node.js читает файл частями, сжимает chunks и сразу отправляет их клиенту. `pipeline()` следит за backpressure и корректно пробрасывает ошибки между streams.

- What are Readable, Writable, Duplex, and Transform streams?

  **Ответ:** `Readable` читает данные, `Writable` принимает данные, `Duplex` одновременно читает и пишет, `Transform` — duplex stream, который изменяет данные по пути, например gzip или JSON lines parser.

- How does the .pipe() method work?

  **Ответ:** `.pipe()` соединяет readable stream с writable stream и автоматически управляет передачей chunks и базовым backpressure. При ошибках все равно нужно аккуратно обрабатывать `error` или использовать `pipeline()`.

  ```js
  import { pipeline } from 'node:stream/promises';
  import { createReadStream, createWriteStream } from 'node:fs';

  await pipeline(
    createReadStream('input.txt'),
    createWriteStream('output.txt')
  );
  ```

- What is the difference between flowing and paused modes?

  **Ответ:** В flowing mode stream сам отдает данные через `data` events. В paused mode данные читаются вручную через `read()` или потребляются через async iterator/pipe. Paused mode дает больше контроля над скоростью чтения.

- How are stream events such as data, end, and error handled?

  **Ответ:** `data` приходит при новом chunk, `end` означает окончание readable stream, `error` сообщает об ошибке. Для production лучше использовать `pipeline()`, чтобы корректно связать errors и cleanup.

- What is backpressure in streams?

  **Ответ:** Backpressure возникает, когда writable stream не успевает обрабатывать данные. Метод `write()` возвращает `false`, и producer должен дождаться события `drain`, прежде чем продолжать активно писать.

- How does highWaterMark affect stream performance?

  **Ответ:** `highWaterMark` задает размер внутреннего buffer threshold. Большое значение может увеличить throughput, но повысить memory usage. Маленькое значение снижает память, но может увеличить overhead и количество операций.

- How are streams used in file handling, HTTP communication, and IPC?

  **Ответ:** Streams используются в Node.js как общий механизм для постепенной передачи данных между источником и получателем. Это применимо к файлам, HTTP и взаимодействию с дочерними процессами.

  В file handling streams позволяют читать и писать файлы chunk-wise. Это полезно для больших файлов, копирования, архивирования, CSV processing и log processing.

  ```js
  import { createReadStream, createWriteStream } from 'node:fs';
  import { pipeline } from 'node:stream/promises';

  await pipeline(
    createReadStream('input.csv'),
    createWriteStream('copy.csv')
  );
  ```

  В HTTP communication `req` является readable stream, а `res` — writable stream. Поэтому request body можно читать постепенно, а response можно отправлять клиенту частями. Это используется для uploads, downloads, proxying и server-generated reports.

  ```js
  app.get('/file', async (req, res, next) => {
    try {
      await pipeline(createReadStream('report.pdf'), res);
    } catch (error) {
      next(error);
    }
  });
  ```

  В IPC и child processes `stdin`, `stdout` и `stderr` тоже являются streams. Parent process может писать данные в `child.stdin`, читать результат из `child.stdout` и отдельно обрабатывать diagnostics из `child.stderr`.

  ```js
  import { spawn } from 'node:child_process';
  import { createReadStream } from 'node:fs';

  const child = spawn('grep', ['error']);

  createReadStream('app.log').pipe(child.stdin);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  ```

  Главная польза во всех трех случаях одна: данные не нужно держать целиком в памяти, а backpressure помогает не перегружать медленного получателя.

- What is the Event Loop in Node.js?

  **Ответ:** Event Loop — механизм libuv, который выполняет callbacks асинхронных операций по фазам и позволяет Node.js обрабатывать много I/O без создания потока на каждый request.

- What are the phases of the Event Loop?

  **Ответ:** Основные фазы: timers, pending callbacks, idle/prepare, poll, check, close callbacks. Отдельно Node.js обрабатывает `process.nextTick()` и promise microtasks между фазами.

- How are asynchronous operations queued and processed?

  **Ответ:** Async operation регистрируется в libuv/ОС/thread pool. После завершения результат ставится в соответствующую очередь callbacks. Event loop забирает callback в нужной фазе, когда call stack свободен.

- How does setImmediate() behave inside the Event Loop?

  **Ответ:** `setImmediate()` выполняется в check phase. Если вызвать его из I/O callback, он обычно выполнится перед `setTimeout(fn, 0)`, потому что event loop после poll phase перейдет в check phase.

- How does libuv interact with the Event Loop?

  **Ответ:** libuv реализует event loop, регистрирует handles/requests, взаимодействует с ОС demultiplexers и thread pool, затем возвращает готовые callbacks в Node.js для выполнения JavaScript-кодом.

- How does libuv implement asynchronous I/O across operating systems?

  **Ответ:** libuv использует разные механизмы ОС: epoll на Linux, kqueue на macOS/BSD, IOCP на Windows и другие abstractions. Для операций без portable async API libuv использует thread pool.

- How do demultiplexers work in libuv?

  **Ответ:** I/O demultiplexer ждет события на множестве file descriptors/sockets и сообщает, какие из них готовы к чтению или записи. Это позволяет одному потоку эффективно обслуживать много соединений.

- What is the Thread Pool in Node.js?

  **Ответ:** Thread Pool в Node.js — это пул нативных worker threads внутри libuv, который используется для выполнения операций, которые нельзя эффективно или единообразно реализовать через non-blocking APIs операционной системы. Он не равен `worker_threads` module: libuv thread pool скрыт от application code и обслуживает некоторые core APIs Node.js.

  Главное различие:

  - **Event Loop** выполняет JavaScript callbacks и координирует async operations.
  - **libuv Thread Pool** выполняет часть нативных blocking/CPU-heavy операций за пределами основного JS-потока.
  - **`worker_threads`** — отдельный Node.js API для запуска JavaScript-кода в дополнительных потоках.
  - **`cluster`** — запуск нескольких Node.js процессов, обычно по одному worker process на CPU core.

  То есть libuv thread pool — это не способ напрямую запускать ваш JavaScript параллельно. Это внутренняя инфраструктура Node.js для некоторых async APIs.

  Зачем он нужен:

  - Основной JavaScript-поток не должен блокироваться на медленных системных вызовах.
  - Не все операции имеют portable non-blocking API на Linux, macOS и Windows.
  - Некоторые операции CPU-heavy на нативном уровне, например password hashing или compression.
  - Node.js должен сохранить async API даже для операций, которые внутри ОС могут быть blocking.
  - Разные платформы предоставляют разные возможности: например, network sockets хорошо ложатся на event loop, а часть file system/DNS/crypto операций удобнее вынести в worker pool.

  Как это работает по шагам:

  1. JavaScript вызывает async API, например `fs.readFile()` или `crypto.pbkdf2()`.
  2. Node.js через bindings передает задачу в libuv.
  3. libuv кладет задачу в очередь thread pool, например через internal work request.
  4. Один из worker threads берет задачу и выполняет blocking/native работу.
  5. После завершения результат возвращается в event loop.
  6. JavaScript callback, promise continuation или completion event выполняется уже в основном JS-потоке.

  Важно: код callback-а не выполняется в thread pool. Thread pool выполняет нативную работу, а JS-обработчик результата возвращается в event loop.

  Типичные операции, которые могут использовать libuv thread pool:

  - многие async `fs` операции;
  - `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, часть других expensive crypto operations;
  - `zlib` compression/decompression;
  - `dns.lookup()` в некоторых случаях;
  - некоторые native addons, если они используют libuv work queue.

  Не все async APIs используют thread pool:

  - обычные TCP/HTTP sockets чаще обслуживаются event loop и механизмами ОС вроде epoll/kqueue/IOCP;
  - `setTimeout()` и `setImmediate()` не занимают thread pool;
  - Promise callbacks и `process.nextTick()` выполняются в основном JS-потоке;
  - `dns.resolve*()` обычно использует DNS resolver library, а `dns.lookup()` использует системный `getaddrinfo`, который может попасть в thread pool;
  - `fetch()`/HTTP client operations в типичном случае завязаны на network I/O, а не на libuv worker pool.

  Размер thread pool по умолчанию — 4 threads на Node.js process. Его можно изменить переменной окружения `UV_THREADPOOL_SIZE` до старта процесса:

  ```bash
  UV_THREADPOOL_SIZE=16 node server.js
  ```

  Эту переменную важно задавать до инициализации Node.js/libuv work queue. Установка `process.env.UV_THREADPOOL_SIZE` глубоко внутри приложения может быть слишком поздней, если pool уже был использован.

  Если thread pool перегружен, возникает saturation: задачи стоят в очереди и ждут свободный worker thread. Например, много одновременных `crypto.pbkdf2()` могут задержать `fs.readFile()`, потому что они конкурируют за один и тот же pool. Это увеличивает latency, хотя event loop формально не заблокирован.

  Пример saturation:

  ```js
  import { pbkdf2 } from 'node:crypto';
  import { readFile } from 'node:fs';

  for (let i = 1; i <= 8; i += 1) {
    pbkdf2('password', 'salt', 500_000, 64, 'sha512', () => {
      console.log(`crypto job ${i} finished`);
    });
  }

  readFile('./package.json', 'utf8', () => {
    console.log('file read finished');
  });
  ```

  При стандартном размере pool `4` одновременно будут выполняться только несколько native jobs. Остальные будут ждать в очереди. Поэтому `readFile()` может завершиться позже, чем ожидается, не потому что file system медленная, а потому что все worker threads заняты crypto work.

  В веб-приложении это может проявиться так:

  - login endpoint делает много `bcrypt`/`scrypt` операций;
  - параллельно API читает файлы, делает compression или вызывает `dns.lookup()`;
  - pool забит password hashing задачами;
  - unrelated requests начинают отвечать медленнее.

  Увеличение `UV_THREADPOOL_SIZE` может помочь, если bottleneck действительно в pool queue. Но это не универсальное решение:

  - больше threads означает больше memory overhead;
  - увеличивается context switching;
  - CPU-heavy native tasks могут начать конкурировать за CPU cores;
  - disk I/O может стать еще медленнее из-за чрезмерной параллельности;
  - если проблема в долгом JavaScript-коде, thread pool вообще не поможет.

  Практические правила:

  - Не считать async API автоматически "бесплатным": часть async операций конкурирует за thread pool.
  - Для большого количества crypto/zlib/fs задач измерять latency, event loop delay и длительность отдельных операций.
  - Не увеличивать `UV_THREADPOOL_SIZE` вслепую: больше threads может увеличить context switching и нагрузку на CPU.
  - Ограничивать параллельность тяжелых операций через queue, semaphore или библиотеку вроде `p-limit`.
  - Не запускать сотни expensive crypto/compression jobs одновременно внутри request handler.
  - CPU-heavy JavaScript лучше выносить в `worker_threads` или отдельные процессы, потому что libuv thread pool не выполняет произвольный JS-код.
  - Для password hashing, image processing, compression и batch jobs часто лучше использовать queue/worker architecture, чтобы не мешать HTTP request path.
  - Для больших файлов использовать streams и backpressure, а не читать все содержимое в память.
  - Для production tuning сначала собрать метрики, потом менять pool size.

  Как понять, что проблема может быть в thread pool:

  - event loop delay небольшой, но async `fs`/`crypto`/`zlib` операции стали ждать дольше;
  - latency растет при большом числе password hashing/compression jobs;
  - увеличение `UV_THREADPOOL_SIZE` в тесте снижает очередь, но повышает CPU usage;
  - обычные network requests принимаются, но callbacks от pool-bound операций приходят поздно.

  Thread pool особенно важен для backend-разработчика, потому что он может стать скрытым shared resource. Код выглядит асинхронным, но под капотом несколько разных частей приложения могут конкурировать за один и тот же небольшой pool.

  Хорошая mental model: event loop отвечает за координацию и выполнение JS callbacks, а libuv thread pool — за часть нативной blocking work, которую Node.js прячет за async API.

- How does Node.js use the libuv thread pool?

  **Ответ:** Node.js отправляет в pool некоторые fs, DNS, crypto и zlib операции. Когда worker завершает работу, callback возвращается в event loop.

- What operations are executed in the thread pool?

  **Ответ:** Типичные операции: async fs APIs, `crypto.pbkdf2`, `crypto.scrypt`, zlib compression, некоторые DNS lookups через `dns.lookup()`. Конкретный список зависит от API и платформы.

- What is the default thread pool size?

  **Ответ:** По умолчанию libuv thread pool имеет размер 4. Это может быть мало для workloads с большим количеством fs/crypto/zlib задач.

- How can UV_THREADPOOL_SIZE be configured?

  **Ответ:** Размер задается переменной окружения `UV_THREADPOOL_SIZE` до старта процесса. Ее нужно выставлять до загрузки Node.js runtime logic, например в shell или process manager config.

  ```bash
  UV_THREADPOOL_SIZE=16 node server.js
  ```

- How should CPU-bound tasks be handled in Node.js?

  **Ответ:** CPU-bound задачи нельзя выполнять долго в event loop. Их выносят в worker threads, child processes, отдельные services, queues или native modules. Также можно разбивать вычисления на chunks, если нужна cooperative scheduling.

- What is polling in Node.js?

  **Ответ:** Polling — ожидание готовности I/O событий. В event loop poll phase Node.js/libuv ожидает новые I/O events и выполняет callbacks для готовых handles.

- How does polling work in event-driven systems?

  **Ответ:** Система регистрирует интерес к событиям, например готовность socket к чтению. Demultiplexer блокируется до события или timeout, затем возвращает список ready descriptors, и event loop вызывает соответствующие callbacks.

- What are epoll and kqueue?

  **Ответ:** `epoll` — Linux API для масштабируемого мониторинга множества file descriptors. `kqueue` — аналогичный механизм в BSD/macOS. libuv использует такие API, чтобы эффективно обрабатывать много socket-соединений.

- How do blocking and non-blocking I/O differ?

  **Ответ:** Blocking I/O удерживает поток до завершения операции. Non-blocking I/O возвращает управление сразу, а готовность результата обрабатывается позже через event loop, callback или promise.

- What are file descriptors and sockets?

  **Ответ:** File descriptor — числовой handle ОС для файла, socket, pipe или другого I/O ресурса. Socket — endpoint сетевого соединения или datagram communication. Node.js abstractions работают поверх этих системных объектов.

- How does polling compare with the thread-per-connection model?

  **Ответ:** Polling/event loop модель обслуживает много соединений небольшим количеством потоков. Thread-per-connection создает отдельный поток на соединение, что проще концептуально, но дороже по памяти и context switching при большой конкурентности.

- What is the difference between synchronous and asynchronous code?

  **Ответ:** Synchronous code выполняется последовательно и блокирует дальнейшее выполнение до завершения операции. Asynchronous code запускает операцию и продолжает выполнение, а результат получает позже через callback, promise, event или stream.

- What is blocking vs non-blocking I/O?

  **Ответ:** Blocking/non-blocking относится к поведению I/O вызова относительно потока. Blocking ждет завершения, non-blocking не ждет. Async API обычно построены вокруг non-blocking или вынесенного в thread pool поведения.

- How does blocking I/O affect the Event Loop?

  **Ответ:** Blocking I/O в основном потоке задерживает обработку всех остальных timers, requests, sockets и promise continuations. Это повышает latency и может привести к timeouts под нагрузкой.

- What is concurrency in Node.js?

  **Ответ:** Concurrency — способность обслуживать несколько задач в overlapping time. Node.js достигает этого через event loop, async I/O и очереди, даже если JS-код выполняется одним потоком.

- What is the difference between concurrency and parallelism?

  **Ответ:** Concurrency — несколько задач находятся в процессе выполнения и переключаются по событиям. Parallelism — несколько задач реально выполняются одновременно на разных CPU cores или threads. Node.js concurrency дает event loop; parallelism требует worker threads, cluster или child processes.

- How can synchronous code be unblocked?

  **Ответ:** Sync I/O можно заменить async APIs, тяжелые вычисления вынести в worker threads/child processes, циклы разбить на chunks через timers/immediate, а блокирующие внешние calls заменить неблокирующими libraries.

- How can event loop blocking be prevented in high-load systems?

  **Ответ:** Event loop blocking возникает, когда основной JavaScript-поток слишком долго занят одной задачей и не может перейти к обработке других callbacks: новых HTTP requests, timer callbacks, socket events, promise continuations. В high-load системах это критично: один долгий синхронный участок может поднять latency сразу для множества пользователей.

  Важно понимать: async I/O помогает не блокироваться на ожидании сети или диска, но JavaScript callback после завершения I/O все равно выполняется в event loop. Если callback делает тяжелую работу, он блокирует процесс так же, как обычный sync code.

  Типичные причины блокировки:

  - тяжелые CPU loops в request handler;
  - `JSON.parse()` / `JSON.stringify()` на очень больших payloads;
  - sync APIs: `fs.readFileSync()`, `crypto.pbkdf2Sync()`, `zlib.gzipSync()`, `bcrypt.hashSync()`;
  - expensive validation или transformation больших объектов;
  - regex с catastrophic backtracking;
  - генерация больших reports/files прямо внутри HTTP request;
  - compression/image processing/password hashing без ограничения параллельности;
  - слишком большие response bodies без pagination/streaming;
  - сторонние библиотеки, которые внутри используют blocking code.

  Основные способы предотвращения:

  1. Убирать sync APIs из request path.

  В серверном коде под нагрузкой не стоит использовать sync file system, sync crypto, sync compression и другие blocking calls. Они блокируют весь Node.js process, а не только текущий request.

  ```js
  // Плохо для request handler:
  const file = fs.readFileSync('large-file.json', 'utf8');

  // Лучше:
  const file = await fs.promises.readFile('large-file.json', 'utf8');
  ```

  Async версия не делает код автоматически быстрым, но она не держит основной JS-поток во время ожидания I/O.

  2. Выносить CPU-bound work из event loop.

  Если задача реально вычислительная, например password hashing, image processing, PDF generation, ML inference, сложная агрегация или большой export, ее лучше выполнять вне основного request handler:

  - `worker_threads` для CPU-heavy JavaScript;
  - `child_process` для запуска внешних программ;
  - background workers через queue, например BullMQ/RabbitMQ/Kafka;
  - отдельный microservice для тяжелой обработки;
  - native addon, если есть оправданная необходимость.

  Пример идеи:

  ```js
  app.post('/api/reports', async (req, res) => {
    const job = await reportQueue.add('generate-report', {
      userId: req.user.id,
      filters: req.body,
    });

    res.status(202).json({
      jobId: job.id,
      status: 'queued',
    });
  });
  ```

  Здесь API быстро принимает задачу и возвращает `202 Accepted`, а тяжелая генерация отчета выполняется background worker-ом.

  3. Делить большие операции на chunks.

  Если задачу нельзя сразу вынести в worker, можно разбить ее на части и периодически отдавать управление event loop через `setImmediate()`. Это не делает вычисления быстрее, но уменьшает long blocking pauses.

  ```js
  import { setImmediate } from 'node:timers/promises';

  async function processItems(items) {
    const result = [];

    for (let index = 0; index < items.length; index += 1) {
      result.push(transform(items[index]));

      if (index % 1000 === 0) {
        await setImmediate();
      }
    }

    return result;
  }
  ```

  Такой подход полезен для умеренных задач, но для настоящей CPU-heavy работы лучше использовать workers.

  4. Ограничивать размер входных данных.

  Большие request bodies могут заблокировать процесс на parsing/validation. Поэтому в Express обычно задают limits:

  ```js
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  ```

  Для больших uploads лучше использовать streaming upload, object storage и обработку через background jobs, а не держать весь файл в памяти.

  5. Использовать pagination, streaming и backpressure.

  Не стоит возвращать десятки тысяч записей одним JSON response. Лучше:

  - использовать pagination или cursor-based pagination;
  - отдавать большие файлы через streams;
  - не собирать огромные массивы целиком в памяти;
  - уважать backpressure при чтении/записи streams.

  ```js
  import { createReadStream } from 'node:fs';
  import { pipeline } from 'node:stream/promises';

  app.get('/api/download', async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/octet-stream');
      await pipeline(createReadStream('large-file.zip'), res);
    } catch (error) {
      next(error);
    }
  });
  ```

  6. Лимитировать параллельность тяжелых async операций.

  Даже async operations могут перегрузить libuv thread pool, database, file system или внешний API. Например, запуск 1000 `bcrypt.hash()` одновременно может создать очередь и поднять latency. Лучше использовать bounded concurrency.

  ```js
  import pLimit from 'p-limit';

  const limit = pLimit(5);

  const results = await Promise.all(
    users.map((user) => limit(() => enrichUser(user)))
  );
  ```

  7. Следить за regex и validation logic.

  Некоторые регулярные выражения могут уходить в catastrophic backtracking и блокировать event loop на секунды. Особенно опасно применять сложный regex к пользовательскому вводу. Для production-кода стоит:

  - избегать неоднозначных вложенных quantifiers;
  - ограничивать длину строки перед validation;
  - тестировать regex на worst-case input;
  - использовать более безопасные parser/validator libraries там, где regex становится сложным.

  8. Ставить timeouts и cancellation.

  High-load система должна уметь прекращать слишком долгие операции:

  - HTTP client timeout;
  - database query timeout;
  - `AbortController` для отмены async operations;
  - request timeout на уровне reverse proxy;
  - graceful shutdown timeout.

  Timeouts не всегда предотвращают CPU blocking напрямую, но они не дают системе бесконечно держать ресурсы.

  9. Мониторить event loop lag/event loop utilization.

  Без метрик легко перепутать event loop blocking с медленной базой данных или network latency. В Node.js можно использовать `perf_hooks`.

  ```js
  import { monitorEventLoopDelay } from 'node:perf_hooks';

  const histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();

  setInterval(() => {
    console.log({
      p95: Math.round(histogram.percentile(95) / 1_000_000),
      p99: Math.round(histogram.percentile(99) / 1_000_000),
      max: Math.round(histogram.max / 1_000_000),
    });

    histogram.reset();
  }, 10_000);
  ```

  Если p99 event loop delay растет, значит event loop периодически занят слишком долго.

  10. Профилировать hot paths.

  Нужны не догадки, а профили:

  - CPU profiles;
  - flamegraphs;
  - heap snapshots;
  - APM traces;
  - load testing;
  - slow query logs;
  - метрики event loop delay и GC pauses.

  Часто блокирующим оказывается не очевидный участок, а сериализация большого объекта, validation library, logging больших payloads или неудачный regex.

  11. Масштабировать процессы, но не считать это полным решением.

  `cluster`, PM2 cluster mode, Kubernetes replicas или несколько containers помогают распределить нагрузку по CPU cores. Но если каждый worker process содержит blocking code, проблема остается: конкретный worker все равно будет зависать на тяжелом участке. Горизонтальное масштабирование снижает blast radius, но не заменяет исправление blocking hot path.

  Практическая mental model: request handler должен быстро делать orchestration — проверить input, вызвать async I/O, вернуть response или поставить job в очередь. Долгие вычисления, большие преобразования и тяжелую обработку нужно выносить из event loop или дробить так, чтобы один callback не занимал поток надолго.

- What is the callback pattern in Node.js?

  **Ответ:** Классический Node.js callback pattern — error-first callback: первым аргументом идет ошибка или `null`, вторым и далее — результат. Это позволяет единообразно обрабатывать async operations.

  ```js
  fs.readFile('file.txt', 'utf8', (error, data) => {
    if (error) return handleError(error);
    handleData(data);
  });
  ```

- How are callbacks used for asynchronous operations?

  **Ответ:** Callback передается в API и вызывается после завершения операции. До этого основной поток продолжает выполнять другой код. Важно обрабатывать ошибку и не вызывать callback несколько раз.

- What are the advantages and disadvantages of callbacks?

  **Ответ:** Плюсы callbacks: простота, низкий overhead, историческая совместимость Node.js APIs. Минусы: callback hell, сложная композиция, error propagation вручную и риск multiple callback invocation.

- How do callbacks compare with promises and async/await?

  **Ответ:** Promises лучше композируются и дают единый error flow через `.catch`. `async/await` делает promise-код похожим на синхронный. Callbacks все еще встречаются в low-level APIs, но в application code чаще используют promises.

- What are fibers and coroutines?

  **Ответ:** Coroutine — вычисление, которое может приостанавливаться и продолжаться позже. Fibers — кооперативные lightweight execution contexts. В Node.js нативных fibers как основной модели нет; исторический пакет `fibers` устарел для современных Node.js версий.

- How are fibers/coroutines used for asynchronous code?

  **Ответ:** Идея fibers/coroutines — писать async code в линейном стиле, приостанавливая выполнение до результата. В современном JavaScript эту роль практически выполняют promises, generators и `async/await`.

- How do fibers compare with promises and async/await?

  **Ответ:** Fibers меняют модель выполнения и требуют runtime support. Promises и `async/await` являются стандартной частью JavaScript, лучше поддерживаются tooling-ом и совместимы с Node.js ecosystem. Поэтому для Node.js сегодня предпочтительны `async/await` и worker threads для parallelism.

- In which scenarios are fibers/coroutines useful?

  **Ответ:** Coroutines полезны для cooperative multitasking, game loops, generators, async iterators и сценариев, где поток выполнения должен явно приостанавливаться. В Node.js практический стандарт — `async/await`, async generators и streams.

- What tools and libraries support fibers/coroutines?

  **Ответ:** В JavaScript стандартно доступны generators и async functions. Старые libraries на `node-fibers` в современных проектах лучше не выбирать. Для coroutine-like потоков используют async generators, RxJS, streams или workflow engines.

- What problems does Express.js solve?

  **Ответ:** Express упрощает создание HTTP API: routing, middleware chain, parsing, response helpers, error handling и integration с шаблонизаторами/статикой. Он скрывает большую часть низкоуровневой работы с `http` module.

- How does routing work in Express?

  **Ответ:** Express сопоставляет HTTP method и path с handlers. Routes регистрируются через `app.get`, `app.post`, `router.use` и т.д. При совпадении request проходит через middleware stack в порядке регистрации.

  ```js
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  ```

- What is middleware in Express?

  **Ответ:** Middleware — функция `(req, res, next)`, которая выполняется в цепочке обработки запроса. Она может изменить `req/res`, завершить response или вызвать `next()` для передачи управления дальше.

- How are HTTP methods handled in Express?

  **Ответ:** Для методов есть helpers: `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`, `app.all`. Express сравнивает method запроса с зарегистрированным route handler.

- How does middleware chaining work?

  **Ответ:** Middleware выполняются последовательно. Если middleware вызывает `next()`, управление переходит к следующему. Если отправляет response или передает ошибку `next(error)`, обычная цепочка прекращается или переходит в error middleware.

- What routing strategies exist in Express?

  **Ответ:** Стратегии: feature-based routers, resource-based REST routes, versioned API routes, nested routers, route-level middleware, centralized error handling и separation controllers/services. В больших проектах `express.Router()` помогает держать структуру модульной.

- How does Express compare with Koa and Hapi?

  **Ответ:** Express минималистичен и широко распространен. Koa легче и построен вокруг async middleware composition. Hapi более opinionated, с сильной конфигурацией, validation и plugin system. Выбор зависит от команды, требований и зрелости ecosystem.

- What are the pros and cons of Express?

  **Ответ:** Плюсы Express: простота, зрелость, огромная ecosystem, много middleware и документации. Минусы: мало встроенной структуры, нужно самостоятельно выбирать validation/security patterns, async error handling требует дисциплины.

- How can custom middleware be implemented?

  **Ответ:** Custom middleware — обычная функция, которая принимает `req`, `res`, `next`. Для async middleware нужно передавать ошибки дальше или использовать wrapper в старых версиях Express.

  ```js
  function requireAuth(req, res, next) {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  }
  ```

- How are Express applications tested?

  **Ответ:** Обычно app экспортируют отдельно от server listener и тестируют через Supertest. Unit-тесты покрывают services, integration-тесты — routes/middleware/error handling.

- How can Express applications be benchmarked and optimized?

  **Ответ:** Benchmark Express-приложения нужен не просто для числа requests per second, а чтобы понять, где bottleneck: event loop, database, network, serialization, middleware, GC или внешний API.

  Типичный порядок работы:

  1. Выбрать realistic сценарии: login, product list, create order, search, upload/download.
  2. Прогреть приложение перед замером, чтобы исключить cold start effects.
  3. Запустить load test через `autocannon`, `wrk` или `k6`.
  4. Смотреть не только RPS, но и latency percentiles: p50, p95, p99.
  5. Параллельно собирать CPU profile, heap metrics, event loop delay, DB query time и error rate.
  6. Оптимизировать один bottleneck за раз и повторять benchmark.

  Пример простого benchmark:

  ```bash
  npx autocannon -c 100 -d 30 http://localhost:3000/api/products
  ```

  Здесь `-c 100` означает 100 concurrent connections, `-d 30` — тест длится 30 секунд.

  Что обычно оптимизируют в Express:

  - убрать sync APIs и тяжелые вычисления из request handlers;
  - не подключать дорогие middleware глобально, если они нужны только части routes;
  - ставить `express.json({ limit: '1mb' })`, чтобы большие payloads не ломали latency;
  - использовать pagination вместо больших JSON responses;
  - добавить database indexes и проверять slow queries;
  - кешировать read-heavy данные через Redis/CDN/application cache;
  - включать compression на reverse proxy/CDN, а не обязательно внутри Node.js process;
  - использовать keep-alive и connection pooling для DB/HTTP clients;
  - запускать несколько процессов через cluster/PM2/Kubernetes replicas;
  - измерять `event loop delay`, чтобы находить blocking code.

  Важно: оптимизация без профилирования часто приводит к случайным изменениям. Например, если p99 latency вызвана MongoDB query без индекса, переписывание Express middleware почти ничего не даст. Сначала нужно найти bottleneck, затем менять конкретный участок и снова измерять.

- How does Express internally implement routing and middleware?

  **Ответ:** Express внутри строит цепочку обработчиков, которую обычно называют middleware stack. Каждый `app.use()`, `app.get()`, `app.post()` или `router.use()` добавляет в этот stack специальный layer: path matcher, HTTP method matcher и функцию handler.

  Когда приходит request, Express последовательно проходит по stack:

  1. Проверяет, подходит ли layer по path.
  2. Для route handlers дополнительно проверяет HTTP method: `GET`, `POST`, `PUT`, `DELETE` и т.д.
  3. Если layer подходит, вызывает middleware или route handler.
  4. Если handler вызывает `next()`, Express переходит к следующему layer.
  5. Если handler отправляет response через `res.json()`, `res.send()`, `res.end()`, цепочка обычно завершается.
  6. Если handler вызывает `next(error)`, Express пропускает обычные middleware и ищет error-handling middleware.

  Пример:

  ```js
  app.use(express.json());

  app.use((req, res, next) => {
    req.requestStartedAt = Date.now();
    next();
  });

  app.get('/api/products', (req, res) => {
    res.json({ products: [] });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({ message: 'Internal server error' });
  });
  ```

  В этом примере request сначала пройдет через JSON parser, потом через custom middleware, потом попадет в route handler `/api/products`. Error middleware в конце будет вызван только если где-то раньше произойдет ошибка и будет вызван `next(error)`.

  Важные детали:

  - порядок объявления middleware имеет значение;
  - `app.use('/api', router)` монтирует router на prefix `/api`;
  - middleware без path применяется ко всем requests;
  - middleware с path применяется только к matching path;
  - route может иметь несколько handlers: `app.get('/path', auth, validate, controller)`;
  - error middleware отличается сигнатурой: `(error, req, res, next)`;
  - если забыть вызвать `next()` и не отправить response, request зависнет.

  Express Router работает по той же модели, что и приложение: у router есть собственный stack layers. Поэтому можно разделять routes по модулям, например `productRouter`, `authRouter`, `adminRouter`, а затем подключать их в `app.ts`.

  Практическая mental model: Express — это не магический framework, а ordered pipeline. Request идет сверху вниз по списку middleware/routes, пока один из handlers не отправит response или не передаст управление дальше через `next()`.

- How does Express architecture affect scalability and performance?

  **Ответ:** Express сам по себе легкий, но производительность зависит от middleware, business logic, I/O и error handling. Большие цепочки middleware и sync операции могут увеличивать latency. Для масштабирования Express обычно запускают stateless за load balancer.

- What problems do backend frameworks solve?

  **Ответ:** Backend frameworks дают routing, middleware/hooks, validation, error handling, serialization, plugins, dependency injection, auth integration, testing utilities и структуру приложения. Они уменьшают boilerplate и стандартизируют архитектуру.

- What are the differences between backend frameworks?

  **Ответ:** Frameworks отличаются философией: минимализм или opinionated architecture, middleware model, plugin system, validation, TypeScript support, performance, learning curve и ecosystem. Например Express минимален, NestJS структурирован, Fastify performance-oriented, Hapi config-oriented.

- What are the pros and cons of different Node.js frameworks?

  **Ответ:** Минималистичные frameworks дают свободу, но требуют больше решений от команды. Opinionated frameworks ускоряют стандартизацию, но добавляют learning curve. Performance-oriented frameworks быстрее на hot paths, но могут иметь меньшую ecosystem.

- How are middleware and routing implemented in backend frameworks?

  **Ответ:** Обычно request проходит через pipeline: global middleware/hooks, route matching, route-level middleware/guards, handler/controller, serialization и error handling. Конкретная реализация зависит от framework.

- How are backend frameworks tested?

  **Ответ:** Тестируют unit-level services, integration routes, middleware behavior, validation, auth и error responses. Часто используют Supertest, framework testing utilities, test containers или in-memory dependencies.

- What performance optimization techniques are used in backend frameworks?

  **Ответ:** Используются precompiled routes, schema-based serialization, caching, low-overhead hooks, connection reuse, lazy initialization, minimal middleware stack и efficient JSON serialization.

- What benchmarking strategies are used for backend frameworks?

  **Ответ:** Benchmark должен проверять realistic routes, JSON payloads, DB/cache interactions, concurrency levels, p95/p99 latency, throughput и resource usage. Synthetic hello-world benchmarks полезны только как грубый baseline.

- What principles are used in framework core implementations?

  **Ответ:** Core frameworks обычно строится на separation of concerns, predictable pipeline, composability, plugin architecture, explicit lifecycle, error isolation, low overhead и clear extension points.

- What problems does Koa solve?

  **Ответ:** Koa решает те же HTTP pipeline задачи, что Express, но с более современным async middleware подходом. Он предоставляет минимальное ядро, context object и composition через `async (ctx, next)`.

- How does Koa middleware architecture work?

  **Ответ:** Koa middleware образует onion model. Код до `await next()` выполняется на входе, следующий middleware/handler — внутри, а код после `await next()` выполняется на выходе.

  ```js
  app.use(async (ctx, next) => {
    const startedAt = Date.now();
    await next();
    ctx.set('X-Response-Time', `${Date.now() - startedAt}ms`);
  });
  ```

- How does routing in Koa differ from Express?

  **Ответ:** В Koa routing не встроен в core, обычно используют `@koa/router`. Express имеет routing из коробки. Koa route handlers работают с `ctx`, а Express — с `req`, `res`, `next`.

- How does Koa middleware differ from Express middleware?

  **Ответ:** Koa middleware promise-based и использует `async/await` onion flow. Express middleware traditionally callback-based с `next()`, хотя async handlers тоже широко используются. Koa лучше выражает post-processing после downstream middleware.

- How can custom middleware and error handling be implemented in Koa?

  **Ответ:** Error middleware обычно ставят первым и оборачивают `await next()` в `try/catch`. Custom middleware изменяет `ctx`, проверяет условия и либо вызывает `next`, либо устанавливает response.

  ```js
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = { message: error.message };
    }
  });
  ```

- How does Koa compare with Express, Hapi, and Fastify?

  **Ответ:** Koa минимален и elegant для async middleware. Express более распространен и имеет большую ecosystem. Hapi более opinionated и config-heavy. Fastify фокусируется на performance, schemas и plugin encapsulation.

- What are the pros and cons of Koa?

  **Ответ:** Плюсы Koa: чистый async flow, маленькое ядро, удобный context, хорошая композиция middleware. Минусы: меньше built-in возможностей, нужно выбирать router/body parser/validation отдельно, ecosystem меньше Express.

- How does middleware composition work in Koa?

  **Ответ:** Koa использует compose-функцию, которая вызывает middleware по цепочке через `next`. Каждый middleware может выполнить код до и после downstream chain, формируя onion-поведение.

- How are Koa applications tested and optimized?

  **Ответ:** Koa app тестируют через Supertest, передавая `app.callback()` как handler. Оптимизация похожа на Express: минимальный middleware stack, streams, caching, profiling, async I/O и отсутствие blocking code.

- What are the core design principles behind Koa?

  **Ответ:** Koa строится вокруг минимального core, async middleware, explicit context, composition вместо большого набора встроенных features и возможности подключать только нужные модули.

- How does Koa’s context object work?

  **Ответ:** `ctx` объединяет request и response abstractions. В нем доступны `ctx.request`, `ctx.response`, `ctx.status`, `ctx.body`, `ctx.params` через router и helper methods. Это упрощает API handler-ов.

- How does Koa handle async flow?

  **Ответ:** Koa middleware возвращают promises. `await next()` передает управление дальше и ждет завершения downstream middleware. Ошибки пробрасываются через promise rejection и ловятся upstream middleware.

- How does Koa scale compared with similar frameworks?

  **Ответ:** Koa масштабируется как обычное Node.js HTTP-приложение: stateless instances, load balancing, clustering, external state stores. Его overhead мал, но итоговая масштабируемость зависит от middleware, I/O, DB и infrastructure.

- What is the global object in Node.js?

  **Ответ:** Глобальный объект Node.js доступен как `global`, а универсальный стандарт — `globalThis`. Он содержит глобальные APIs runtime, но в CommonJS top-level scope модуля не равен global scope напрямую.

- What are examples of global variables in Node.js?

  **Ответ:** Примеры globals: `global`, `globalThis`, `process`, `Buffer`, `console`, timers (`setTimeout`, `setImmediate`), `__dirname`, `__filename`, `module`, `exports`, `require` в CommonJS.

- How do __dirname and __filename work?

  **Ответ:** В CommonJS `__filename` содержит абсолютный путь к текущему файлу, а `__dirname` — директорию этого файла. В ES modules их нет напрямую; обычно используют `import.meta.url` и `fileURLToPath`.

  ```js
  import { fileURLToPath } from 'node:url';
  import { dirname } from 'node:path';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  ```

- How does the console global work?

  **Ответ:** `console` — глобальный объект Node.js для вывода диагностической информации. Под капотом он пишет данные в process streams:

  - `stdout` — обычный output, чаще для `console.log()` и `console.info()`;
  - `stderr` — поток ошибок, чаще для `console.error()` и `console.warn()`.

  Основные методы:

  - `console.log(...values)` — обычный вывод в stdout.
  - `console.info(...values)` — информационный вывод, в Node.js близок к `console.log()`.
  - `console.warn(...values)` — предупреждение, обычно пишет в stderr.
  - `console.error(...values)` — ошибка, обычно пишет в stderr.
  - `console.debug(...values)` — debug-сообщение, полезно для временной диагностики.
  - `console.table(data)` — выводит массивы/объекты в виде таблицы.
  - `console.time(label)` — запускает таймер с именем.
  - `console.timeEnd(label)` — завершает таймер и выводит длительность.
  - `console.timeLog(label)` — выводит промежуточное значение таймера.
  - `console.trace(message)` — выводит сообщение и stack trace.
  - `console.assert(condition, message)` — выводит сообщение, если condition false.
  - `console.group(label)` / `console.groupEnd()` — группирует вывод с отступами.
  - `console.clear()` — пытается очистить terminal output.

  Пример:

  ```js
  console.time('load-products');

  const products = [
    { id: 1, title: 'Book', price: 20 },
    { id: 2, title: 'Laptop', price: 1200 },
  ];

  console.table(products);
  console.timeEnd('load-products');
  ```

  Еще пример для диагностики ошибки:

  ```js
  function validateUser(user) {
    console.assert(user.email, 'User email is required');

    if (!user.email) {
      console.trace('Invalid user payload');
    }
  }
  ```

  Важные нюансы:

  - `console` удобен для local debugging, scripts и простых diagnostics.
  - В production backend лучше использовать structured logger: `pino`, `winston`, `bunyan` или logger платформы.
  - Structured logger позволяет писать JSON logs, добавлять `requestId`, `userId`, route, status code, latency и correlation metadata.
  - Чрезмерный `console.log()` в hot paths может ухудшать performance и засорять logs.
  - Нельзя логировать passwords, tokens, cookies, full authorization headers и другие secrets.

- How does Node.js expose the process global object?

  **Ответ:** Node.js предоставляет `process` как global object в каждом модуле. Он создается runtime-ом и дает доступ к текущему процессу, environment, streams, signals и lifecycle events.

- What are the risks of excessive global variable usage?

  **Ответ:** Избыточные globals создают скрытые зависимости, усложняют тестирование, могут конфликтовать по именам, удерживать память и делать порядок инициализации неявным. Лучше использовать modules, DI и явный config.

- What is npm and what problems does it solve?

  **Ответ:** npm — package manager и registry ecosystem для JavaScript/Node.js. Он решает установку dependencies, version resolution, scripts, publishing packages и audit metadata.

- How are packages installed locally and globally?

  **Ответ:** Local install добавляет пакет в проект и `node_modules` проекта. Global install ставит CLI или пакет в глобальное место системы. Для приложений зависимости почти всегда должны быть local.

  ```bash
  npm install express
  npm install -g npm-check-updates
  ```

- What is the difference between local and global installations?

  **Ответ:** Local dependency фиксируется в `package.json`/lockfile и воспроизводима для проекта. Global dependency зависит от машины разработчика и хуже подходит для runtime. CLI часто можно запускать local через `npx` или npm scripts.

- How are dependencies managed in package.json?

  **Ответ:** `package.json` хранит dependencies, devDependencies, scripts, package metadata и version ranges. `dependencies` нужны приложению в runtime, `devDependencies` — для сборки, тестов и tooling.

- What does npm init do?

  **Ответ:** `npm init` создает `package.json`. Интерактивный режим задает name/version/scripts, а `npm init -y` создает файл с defaults.

- What is the difference between package.json and package-lock.json?

  **Ответ:** `package.json` описывает намерения: зависимости и допустимые диапазоны версий. `package-lock.json` фиксирует точное dependency tree, чтобы installs были воспроизводимыми между машинами и CI.

- What is semantic versioning?

  **Ответ:** Semantic versioning использует формат `MAJOR.MINOR.PATCH`. PATCH — bug fixes без breaking changes, MINOR — backward-compatible features, MAJOR — breaking changes.

- What do ^ and ~ mean in dependency versions?

  **Ответ:** `^1.2.3` разрешает обновления до `<2.0.0`, то есть minor/patch в рамках major. `~1.2.3` разрешает обновления до `<1.3.0`, то есть patch в рамках minor.

- How are dev dependencies managed?

  **Ответ:** Dev dependencies ставятся через `npm install -D package` и попадают в `devDependencies`. Они нужны для TypeScript, test runners, linters, build tools и не должны быть обязательны в production runtime, если сборка уже выполнена.

- How do npm scripts work?

  **Ответ:** npm scripts — команды из `package.json`, запускаемые через `npm run name`. Во время выполнения npm добавляет `node_modules/.bin` в PATH, поэтому local CLI доступны без global install.

  ```json
  {
    "scripts": {
      "test": "vitest",
      "build": "tsc"
    }
  }
  ```

- How are transitive dependencies handled?

  **Ответ:** Transitive dependencies — зависимости ваших dependencies. npm resolve-ит их по version ranges, dedupe-ит где возможно и фиксирует итоговое дерево в lockfile.

- How does npm audit work?

  **Ответ:** `npm audit` сравнивает dependency tree с vulnerability database и сообщает о найденных уязвимостях. `npm audit fix` пытается обновить зависимости, но изменения нужно проверять тестами, особенно при major updates.

- How are unused dependencies removed?

  **Ответ:** Пакет удаляют через `npm uninstall package`. Для поиска unused dependencies используют ручную проверку imports, `npm ls`, depcheck-подобные инструменты и CI. Удаление должно сопровождаться тестами/сборкой.

- How does npm compare with similar tools?

  **Ответ:** npm — стандартный package manager Node.js. Yarn и pnpm предлагают альтернативные стратегии lockfile, workspace и storage. pnpm экономит диск через content-addressable store и строгую структуру node_modules.

- What is .npmrc used for?

  **Ответ:** `.npmrc` хранит npm configuration: registry, auth tokens, strict-ssl, save-exact, proxy, workspace settings. Secrets в `.npmrc` нужно хранить осторожно и не коммитить приватные tokens.

- How can custom npm packages be published?

  **Ответ:** Нужно подготовить `package.json`, указать entry points, files, version, login в registry и выполнить `npm publish`. Для scoped packages может потребоваться `--access public`. Перед публикацией полезно проверить `npm pack`.

- What are modules in Node.js?

  **Ответ:** Modules — единицы изоляции кода. В Node.js есть CommonJS (`require`, `module.exports`) и ES modules (`import`, `export`). Модуль имеет собственную область видимости и кешируется после загрузки.

- How does require() work?

  **Ответ:** `require()` resolve-ит путь или package name, загружает модуль, выполняет его один раз, кеширует результат и возвращает `module.exports`. Resolution проверяет core modules, relative paths и `node_modules`.

- What is the difference between exports and module.exports?

  **Ответ:** `exports` — короткая ссылка на `module.exports` в начале модуля. Можно добавлять свойства через `exports.name = ...`, но если нужно экспортировать функцию/класс целиком, надо присвоить `module.exports = value`.

  ```js
  exports.sum = sum;
  module.exports = createApp;
  ```

- What are circular dependencies?

  **Ответ:** Circular dependency возникает, когда модуль A импортирует B, а B импортирует A. В CommonJS один из модулей может получить частично инициализированный `exports`. Это усложняет порядок загрузки и часто указывает на плохое разделение ответственности.

- How does module caching work?

  **Ответ:** После первой загрузки CommonJS module сохраняется в `require.cache`. Повторный `require()` возвращает тот же exported object без повторного выполнения файла. Это ускоряет загрузку и позволяет singleton-like modules.

- How does module caching affect performance?

  **Ответ:** Caching снижает стоимость повторных imports и сохраняет состояние модулей. Минус — shared mutable state может приводить к сложным багам в тестах и long-running процессах. Для hot reload или тестов иногда cache очищают явно.

- What is N-API?

  **Ответ:** N-API, сейчас часто называемый Node-API, — стабильный C ABI для создания native addons. Он позволяет addon-ам работать между версиями Node.js без перекомпиляции под каждую версию V8.

- What are C++ addons in Node.js?

  **Ответ:** C++ addons — нативные модули, которые расширяют Node.js функциональность кодом на C/C++. Они нужны для интеграции с системными libraries, performance-critical участков или доступа к платформенным API.

- How can native addons be created with N-API?

  **Ответ:** Обычно используют Node-API напрямую или wrappers вроде `node-addon-api`, пишут C/C++ код, описывают сборку через `node-gyp`/CMake и экспортируют функции в JS. Для TypeScript/JS потребителей addon выглядит как обычный модуль.

- How does memory management work in native modules?

  **Ответ:** Native module должен аккуратно управлять C/C++ памятью и lifetime объектов. JS-объекты управляются V8 GC, но native allocations требуют explicit cleanup, finalizers или RAII. Ошибки могут привести к leaks, crashes или use-after-free.

- How does garbage collection interact with native addons?

  **Ответ:** V8 GC отслеживает JS-объекты, но не знает автоматически о всей native memory. Addon должен связывать native resources с JS wrappers, использовать finalizers и корректно сообщать о внешней памяти, если это важно для GC heuristics.
