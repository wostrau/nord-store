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

  **Ответ:** Event loop обрабатывает очереди callbacks по фазам: timers, pending callbacks, idle/prepare, poll, check и close callbacks. Между фазами Node.js также выполняет microtasks, включая promise callbacks, и очередь `process.nextTick()`.

- What are the core parts of Node.js architecture?

  **Ответ:** Основные части архитектуры Node.js: V8 для выполнения JavaScript, libuv для event loop и асинхронного I/O, C/C++ bindings между JS API и системными вызовами, core modules, npm ecosystem и слой native addons.

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

  **Ответ:** Node.js особенно уместен в REST/GraphQL APIs, real-time приложениях, чатах, streaming-сервисах, BFF-слоях, CLI, SSR, API gateways и микросервисах с большим количеством сетевого I/O.

- How does Node.js handle concurrency in a single-threaded environment?

  **Ответ:** Node.js использует event loop для планирования callbacks и async operations. Сетевой I/O обычно обслуживается ОС через non-blocking mechanisms, а некоторые операции уходят в libuv thread pool. Для настоящего параллелизма можно использовать worker threads, child processes или cluster.

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

  **Ответ:** `Cache-Control` управляет кешированием. `Authorization` передает credentials, например Bearer token. `Set-Cookie` устанавливает cookie на клиенте и может включать атрибуты `HttpOnly`, `Secure`, `SameSite`, `Max-Age`.

- How can request validation be implemented in an HTTP server?

  **Ответ:** Validation обычно делается до business logic: проверяются body, query, params, headers и auth context. Можно использовать ручные проверки или schema libraries вроде Zod/Joi/Yup. Ошибки лучше возвращать в едином JSON-формате.

- How is the http module used internally by frameworks like Express.js?

  **Ответ:** Express получает `req` и `res` от `http.createServer()`, расширяет их helper-методами, пропускает запрос через router/middleware stack и в итоге пишет ответ через тот же `ServerResponse`.

- What are persistent HTTP connections?

  **Ответ:** Persistent connections, или keep-alive, позволяют использовать одно TCP-соединение для нескольких HTTP-запросов. Это снижает overhead на установку соединений и TLS handshakes.

- How does HTTP/2 work?

  **Ответ:** HTTP/2 использует бинарный протокол, multiplexing нескольких streams в одном TCP-соединении, header compression через HPACK и приоритеты потоков. Это уменьшает overhead и проблему head-of-line blocking на уровне HTTP/1.1 pipelining.

- What are the advantages of HTTP/2?

  **Ответ:** Преимущества HTTP/2: multiplexing, сжатие headers, меньше соединений, лучшая эффективность для множества ресурсов и более гибкое управление потоками. На практике часто используется через reverse proxy/CDN.

- What are multiplexing, server push, and binary framing?

  **Ответ:** Multiplexing позволяет передавать несколько request/response streams по одному соединению. Binary framing разбивает данные на бинарные frames вместо текстового HTTP/1.1 формата. Server push позволял серверу отправлять ресурсы заранее, но в современных браузерных сценариях используется редко и во многих местах считается нежелательным.

- What load balancing strategies exist?

  **Ответ:** Частые стратегии: round-robin, least connections, weighted round-robin, IP hash, consistent hashing, latency-based routing и health-check based routing. Выбор зависит от sticky sessions, нагрузки, statefulness и инфраструктуры.

- How can load balancing be implemented in Node.js?

  **Ответ:** Обычно load balancing делают на уровне Nginx, HAProxy, cloud load balancer или Kubernetes Service. Внутри одного хоста можно использовать `cluster`, PM2 cluster mode или несколько процессов Node.js за reverse proxy.

- What is request smuggling?

  **Ответ:** Request smuggling — атака, при которой злоумышленник заставляет proxy и backend по-разному интерпретировать границы HTTP-запросов, например через конфликт `Content-Length` и `Transfer-Encoding`. Это может привести к обходу auth, cache poisoning или подмешиванию запросов.

- How can request smuggling attacks be prevented?

  **Ответ:** Нужно использовать актуальные reverse proxies и Node.js версии, нормализовать headers, отклонять неоднозначные запросы, не принимать конфликтующие `Content-Length`/`Transfer-Encoding`, ограничивать body size и держать единый HTTP parsing path между proxy и backend.

- What are strategies for horizontal scaling in Node.js?

  **Ответ:** Horizontal scaling достигается запуском нескольких instances за load balancer, stateless API, external session store, shared cache, queue-based background jobs, autoscaling и разделением read/write нагрузки.

- How can memory usage and I/O operations be optimized?

  **Ответ:** Для памяти: ограничивать caches, использовать streams, избегать лишнего buffering, отслеживать heap snapshots. Для I/O: connection pooling, batching, compression where appropriate, backpressure, timeouts и минимизация sync fs/crypto операций.

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

  **Ответ:** Debounce откладывает выполнение до паузы во входящих событиях. Throttle ограничивает частоту выполнения. Оба паттерна используют timers, чтобы контролировать частоту дорогих операций.

  ```js
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  ```

- How does timer cancellation work with AbortController?

  **Ответ:** В promise-based timers из `node:timers/promises` можно передать `AbortSignal`. При abort timer promise будет rejected с `AbortError`, что удобно для cancellation-aware кода.

  ```js
  import { setTimeout } from 'node:timers/promises';

  const controller = new AbortController();
  const promise = setTimeout(1000, 'done', { signal: controller.signal });
  controller.abort();
  ```

- What is the fs module used for?

  **Ответ:** `node:fs` используется для работы с файловой системой: чтение, запись, удаление, metadata, permissions, streams, directories и file descriptors. Есть callback, sync и promise APIs.

- What is the difference between synchronous and asynchronous file operations?

  **Ответ:** Sync fs-операции блокируют event loop до завершения. Async fs-операции возвращают управление сразу и выполняются через libuv thread pool или системные async mechanisms. В server runtime sync fs стоит избегать в request path.

- How can large files be processed with streams?

  **Ответ:** Большие файлы лучше читать через `createReadStream()`, чтобы не загружать весь файл в память. Stream отдает chunks и поддерживает backpressure.

  ```js
  import { createReadStream } from 'node:fs';

  createReadStream('large.log', 'utf8')
    .on('data', (chunk) => processChunk(chunk))
    .on('error', console.error);
  ```

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

  **Ответ:** `EventEmitter` — класс из `node:events`, реализующий publish/subscribe модель внутри процесса. Объект может генерировать события через `emit`, а другие части кода подписываются через `on`, `once` и другие методы.

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

  **Ответ:** Signals вроде `SIGTERM` и `SIGINT` обрабатываются через `process.on(signal, handler)`. В production их используют для graceful shutdown: перестать принимать запросы, закрыть DB connections и завершить процесс.

  ```js
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
  ```

- What are process exit codes?

  **Ответ:** Exit code сообщает ОС, успешно ли завершился процесс. `0` обычно означает успех, ненулевые коды — ошибку. В Node.js можно установить `process.exitCode` или вызвать `process.exit(code)`.

- How can process usage statistics and reports be collected?

  **Ответ:** Можно использовать `process.memoryUsage()`, `process.cpuUsage()`, `process.resourceUsage()`, diagnostic reports, heap snapshots, performance hooks и APM-инструменты. Для production важны метрики event loop lag, heap, RSS, GC и latency.

- What is graceful degradation in Node.js processes?

  **Ответ:** Graceful degradation — способность сервиса продолжать частично работать при сбоях зависимостей. Например, при недоступном cache приложение может читать напрямую из DB, при падении внешнего API возвращать fallback или degraded response.

- What is the purpose of the child_process module?

  **Ответ:** `child_process` запускает внешние процессы из Node.js. Это нужно для CLI-интеграций, shell-команд, изоляции задач, запуска worker-процессов и IPC.

- How does child_process.exec() work?

  **Ответ:** `exec()` запускает команду через shell и буферизует stdout/stderr в память. Он удобен для коротких команд, но опасен с пользовательским input из-за command injection и не подходит для большого output.

  ```js
  import { exec } from 'node:child_process';

  exec('node -v', (error, stdout) => {
    if (error) throw error;
    console.log(stdout);
  });
  ```

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

  **Ответ:** `cluster` позволяет запускать несколько Node.js worker processes, которые могут слушать один порт и распределять нагрузку между CPU cores. Это способ использовать multi-core CPU для HTTP-сервера без отдельного process manager.

- How does the cluster module help Node.js utilize multiple CPU cores?

  **Ответ:** Так как один Node.js process выполняет JS в одном основном потоке, cluster запускает несколько процессов. ОС или primary process распределяет входящие соединения между workers, и каждый worker имеет собственный event loop и memory heap.

- How does cluster.fork() work?

  **Ответ:** `cluster.fork()` создает worker process из текущего Node.js модуля. Worker получает IPC-канал с primary process и может запускать тот же server code.

- What is the relationship between master and worker processes?

  **Ответ:** В современной терминологии Node.js использует primary/worker. Primary управляет workers, может перезапускать их и распределять соединения. Workers выполняют application code и обрабатывают запросы.

- How are worker lifecycle events handled?

  **Ответ:** Cluster emits events вроде `fork`, `online`, `listening`, `disconnect`, `exit`. Обычно primary подписывается на `exit`, логирует причину и при необходимости запускает новый worker.

- What is the purpose of streams in Node.js?

  **Ответ:** Streams позволяют обрабатывать данные постепенно, chunk за chunk, без загрузки всего payload в память. Они важны для файлов, HTTP responses, compression, uploads, logs и IPC.

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

  **Ответ:** File streams читают и пишут файлы chunk-wise. HTTP request/response в Node.js тоже streams, поэтому можно stream-ить uploads/downloads. В child process IPC stdout/stderr/stdin также работают как streams.

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

  **Ответ:** Thread pool libuv — пул worker threads для выполнения blocking или CPU-heavy native operations, которые нельзя эффективно выполнить через non-blocking OS APIs. Он скрыт от обычного JS-кода, но влияет на latency.

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

  **Ответ:** Нужно избегать sync APIs в request path, лимитировать payload size, использовать streams, выносить CPU work, мониторить event loop lag, ставить timeouts и профилировать hot paths.

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

  **Ответ:** Используют autocannon, wrk, k6, профилирование CPU/heap и APM. Оптимизация: убрать sync work, включить compression на edge, правильно использовать DB indexes, кеширование, keep-alive, clustering/horizontal scaling и минимальные middleware на hot paths.

- How does Express internally implement routing and middleware?

  **Ответ:** Express хранит stack layers с path, method и handler. Request проходит по stack, каждый layer проверяет match и вызывает handler. `next()` продвигает выполнение к следующему layer.

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

  **Ответ:** `console` пишет в stdout/stderr и предоставляет методы `log`, `error`, `warn`, `time`, `table` и другие. Для production лучше использовать structured logger, потому что `console` ограничен по форматированию, routing и correlation metadata.

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
