# Software Practices Matrix: вопросы и ответы

- What are the three major groups of GoF design patterns?

  **Ответ:** GoF patterns делятся на три группы: creational, structural и behavioral. Creational patterns управляют созданием объектов, structural — композицией классов и объектов, behavioral — взаимодействием и распределением ответственности между объектами.

- How are GoF design patterns applied in software development?

  **Ответ:** Паттерны применяют как готовые языки решений для повторяющихся проблем проектирования. Их не стоит внедрять ради "красоты": хороший паттерн должен уменьшать связность, убирать дублирование или делать изменение поведения проще.

- What are macro-architectural patterns?

  **Ответ:** Macro-architectural patterns описывают структуру системы на крупном уровне: layered architecture, MVC, microservices, SOA, EDA, CQRS, hexagonal architecture. Они определяют границы модулей, потоки данных и правила зависимости между частями системы.

- How does the MVC pattern work?

  **Ответ:** MVC разделяет систему на Model, View и Controller. Model хранит данные и бизнес-состояние, View отвечает за отображение, Controller принимает input и координирует изменение модели/представления. В web-backend MVC часто означает route/controller слой, model слой и view/templates/API response.

- How does the MVP pattern work?

  **Ответ:** MVP разделяет приложение на Model, View и Presenter. View обычно пассивна и делегирует действия Presenter-у. Presenter содержит presentation logic и обновляет View через интерфейс. Такой подход удобен для тестирования UI-логики.

- How does the MVVM pattern work?

  **Ответ:** MVVM использует Model, View и ViewModel. ViewModel хранит состояние UI и команды, а View связывается с ним через data binding. Angular, WPF и похожие frameworks часто используют идеи MVVM.

- What is modularity in software architecture?

  **Ответ:** Modularity — разбиение системы на независимые части с понятными интерфейсами. Хороший модуль скрывает внутреннюю реализацию, имеет узкую ответственность и минимальные зависимости. Это облегчает тестирование, замену и параллельную разработку.

- What is layered architecture?

  **Ответ:** Layered architecture делит систему на слои, например presentation, application, domain и infrastructure. Верхние слои зависят от нижних или от abstractions. Цель — отделить UI/API, бизнес-логику, доступ к данным и внешние integrations.

- What is Inversion of Control (IoC)?

  **Ответ:** IoC — принцип, при котором объект не создает зависимости сам, а получает их извне. Dependency Injection — самый частый способ IoC. Это снижает связность и упрощает тестирование.

  ```ts
  class OrderService {
    constructor(private readonly repository: OrderRepository) {}
  }
  ```

- What is Service-Oriented Architecture (SOA)?

  **Ответ:** SOA — архитектурный стиль, где система состоит из сервисов с четкими контрактами. Сервисы обычно крупнее микросервисов и часто интегрируются через enterprise bus, SOAP/REST, messaging и shared governance.

- What is Event-Driven Architecture (EDA)?

  **Ответ:** EDA строит взаимодействие через события. Producer публикует событие, consumers реагируют на него независимо. Это снижает прямую связность, но требует продуманной доставки, идемпотентности, мониторинга и обработки ошибок.

- What is Domain-Driven Design (DDD)?

  **Ответ:** DDD — подход к моделированию сложной предметной области. Он фокусируется на ubiquitous language, bounded contexts, aggregates, entities, value objects, repositories и domain services. Главная цель — чтобы код отражал бизнес-модель, а не только таблицы БД.

- What is Event Sourcing?

  **Ответ:** Event Sourcing хранит состояние не как текущую запись, а как последовательность событий, которые к нему привели. Текущее состояние восстанавливается replay-ем событий. Плюсы — auditability и временная история; минусы — сложность миграций событий, snapshots и eventual consistency.

- What is Microservice Architecture?

  **Ответ:** Microservice architecture делит систему на маленькие автономные сервисы, каждый со своей ответственностью, lifecycle и часто собственной БД. Она помогает масштабировать команды и части системы, но добавляет distributed systems complexity: network failures, observability, versioning, transactions и deployment orchestration.

- How can software compatibility with previous and future versions be maintained?

  **Ответ:** Совместимость поддерживают через versioned APIs, backward-compatible changes, feature flags, deprecation policy, schema migration strategy, tolerant readers, contract tests и постепенный rollout. Нельзя удалять или менять публичный контракт без периода миграции.

- What is a UML Use Case diagram?

  **Ответ:** Use Case diagram показывает actors и сценарии взаимодействия с системой. Он полезен для описания границ системы и high-level требований, но не показывает внутреннюю архитектуру.

- What is a UML Class diagram?

  **Ответ:** Class diagram показывает классы, поля, методы и отношения: inheritance, composition, aggregation, association. Он полезен для моделирования domain entities и object relationships.

- What is an Entity Relationship diagram?

  **Ответ:** ER diagram описывает сущности БД, их атрибуты и связи. Он помогает проектировать relational schema: primary keys, foreign keys, cardinality и constraints.

- What is a Data Flow diagram?

  **Ответ:** Data Flow diagram показывает, как данные движутся между процессами, внешними сущностями и хранилищами. Он полезен для анализа интеграций, security boundaries и потоков обработки данных.

- What are architecture quality attributes?

  **Ответ:** Quality attributes — нефункциональные характеристики системы: performance, scalability, availability, reliability, security, maintainability, testability, observability, portability. Архитектура должна явно балансировать эти свойства, потому что они часто конфликтуют.

- What is a UML Component diagram?

  **Ответ:** Component diagram показывает крупные компоненты системы, их интерфейсы и зависимости. Он помогает понимать modular structure и integration points.

- What is a UML Package diagram?

  **Ответ:** Package diagram группирует классы или компоненты в packages/modules и показывает зависимости между ними. Он полезен для контроля coupling и правил layering.

- What is a UML Deployment diagram?

  **Ответ:** Deployment diagram показывает, где физически или виртуально развернуты компоненты: servers, containers, nodes, databases, networks. Он полезен для инфраструктуры, DevOps и security review.

- What is a UML Activity diagram?

  **Ответ:** Activity diagram описывает workflow: действия, условия, параллельные ветки и переходы. Он подходит для бизнес-процессов, approval flows и алгоритмов.

- What is a UML Sequence diagram?

  **Ответ:** Sequence diagram показывает взаимодействие участников во времени: кто кому отправляет сообщения и в каком порядке. Он полезен для API flows, distributed transactions и debugging сложных сценариев.

- What are common patterns of enterprise application architecture?

  **Ответ:** Частые patterns: layered architecture, domain model, transaction script, active record, repository, unit of work, service layer, CQRS, event sourcing, gateway, mapper, dependency injection и message bus. Выбор зависит от сложности домена и требований к системе.

- What are the main cloud types?

  **Ответ:** Основные cloud types: public cloud, private cloud, hybrid cloud и multi-cloud. Public cloud предоставляет ресурсы провайдера, private cloud контролируется организацией, hybrid сочетает оба подхода, multi-cloud использует нескольких провайдеров.

- What are cloud service models?

  **Ответ:** Основные модели: IaaS, PaaS, SaaS, FaaS/serverless. IaaS дает виртуальную инфраструктуру, PaaS управляемую платформу, SaaS готовое приложение, FaaS выполнение функций по событиям.

- What are cloud computing patterns?

  **Ответ:** Типичные cloud patterns: autoscaling, queue-based load leveling, circuit breaker, retry with backoff, bulkhead, cache-aside, sidecar, health checks, blue-green deployment, canary release, strangler fig и externalized configuration.

- What is the difference between a class and an object?

  **Ответ:** Class — описание структуры и поведения. Object — конкретный экземпляр с состоянием. В JavaScript `class` является синтаксической оболочкой над prototype-based моделью.

- What is the difference between prototypical inheritance and classical inheritance?

  **Ответ:** Classical inheritance строится вокруг классов и экземпляров. Prototypical inheritance строится вокруг объектов, которые делегируют поиск свойств прототипам. JavaScript использует prototype chain, даже когда код написан через `class`.

- What is inheritance in OOP?

  **Ответ:** Inheritance позволяет одному типу переиспользовать или расширять поведение другого. Оно удобно для общего контракта, но при злоупотреблении создает жесткие иерархии. Часто composition оказывается гибче inheritance.

- What is polymorphism in OOP?

  **Ответ:** Polymorphism означает, что разные объекты могут использоваться через общий интерфейс, но выполнять поведение по-разному. Например, разные payment providers имеют метод `pay()`, но реализация отличается.

- What is encapsulation in OOP?

  **Ответ:** Encapsulation скрывает внутреннее состояние и детали реализации за публичным API. Это защищает инварианты объекта и позволяет менять реализацию без изменения клиентов.

- What is abstraction in OOP?

  **Ответ:** Abstraction выделяет существенные свойства и операции, скрывая неважные детали. Хорошая abstraction упрощает работу с системой и уменьшает когнитивную нагрузку.

- How can polymorphism be applied in practice?

  **Ответ:** Через общий interface/contract и разные реализации. Например, `EmailNotifier`, `SmsNotifier` и `PushNotifier` могут реализовывать `send(message)`, а service работает только с `Notifier`.

  ```ts
  interface Notifier {
    send(message: string): Promise<void>;
  }
  ```

- What are the SOLID principles?

  **Ответ:** SOLID включает Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation и Dependency Inversion. Эти принципы помогают строить код с низкой связностью, понятными обязанностями и заменяемыми зависимостями.

- What are GRASP principles?

  **Ответ:** GRASP — набор принципов распределения ответственности: Information Expert, Creator, Controller, Low Coupling, High Cohesion, Polymorphism, Pure Fabrication, Indirection, Protected Variations. Они помогают решать, какой объект должен выполнять конкретную работу.

- What is functional programming?

  **Ответ:** Functional programming — стиль, где вычисления строятся из функций, immutable данных и композиции. Он поощряет pure functions, отсутствие side effects и декларативное описание преобразований.

- What are first-class functions?

  **Ответ:** First-class functions можно хранить в переменных, передавать как аргументы, возвращать из функций и хранить в структурах данных. JavaScript поддерживает first-class functions.

- What are higher-order functions?

  **Ответ:** Higher-order function принимает функцию как аргумент или возвращает функцию. Примеры: `map`, `filter`, `reduce`, middleware wrappers и decorators.

  ```js
  const activeUsers = users.filter((user) => user.active);
  ```

- What are lambda functions?

  **Ответ:** Lambda function — анонимная функция, обычно короткая и передаваемая как значение. В JavaScript часто используется arrow syntax: `(x) => x * 2`.

- What is data immutability in functional programming?

  **Ответ:** Immutability означает, что данные не изменяются на месте. Вместо мутации создается новое значение. Это упрощает reasoning, undo/redo, state comparison и предотвращает случайные side effects.

- What is lazy evaluation?

  **Ответ:** Lazy evaluation откладывает вычисление до момента, когда результат реально нужен. Это позволяет работать с потенциально большими или бесконечными последовательностями и избегать лишних вычислений.

- How is recursion used in functional programming?

  **Ответ:** Recursion часто заменяет циклы: функция вызывает себя с новым состоянием до base case. Она хорошо подходит для деревьев, списков и вложенных структур, но требует контроля глубины стека.

- What are pure functions?

  **Ответ:** Pure function возвращает одинаковый результат для одинаковых входов и не имеет side effects. Она не мутирует внешнее состояние, не пишет в БД, не читает время и не зависит от случайности.

- What is the difference between imperative and functional programming?

  **Ответ:** Imperative programming описывает шаги изменения состояния. Functional programming описывает преобразования данных через функции. Imperative код часто ближе к алгоритму выполнения, functional — к декларативной модели результата.

- What are functors?

  **Ответ:** Functor — структура, к которой можно применить функцию внутри контекста через `map`, сохранив сам контекст. В JavaScript массив можно рассматривать как практический пример functor.

  ```js
  [1, 2, 3].map((x) => x * 2);
  ```

- What are monads?

  **Ответ:** Monad — abstraction для последовательной композиции вычислений в контексте, например optional value, async value или error handling. В JavaScript Promise часто рассматривают как monad-like структуру: `then` связывает шаги вычисления.

- What is functional composition?

  **Ответ:** Functional composition объединяет маленькие функции в pipeline, где output одной функции становится input другой. Это помогает строить сложное поведение из простых частей.

  ```js
  const trimLower = (value) => value.trim().toLowerCase();
  ```

- What is currying?

  **Ответ:** Currying превращает функцию с несколькими аргументами в цепочку функций по одному аргументу. Это удобно для частичного применения и построения reusable transformations.

  ```js
  const multiply = (a) => (b) => a * b;
  const double = multiply(2);
  ```

- What are practical examples of pure functions?

  **Ответ:** Примеры: форматирование строки, расчет суммы, фильтрация массива, преобразование DTO, расчет скидки по переданным аргументам. Если функция не зависит от внешнего состояния и не мутирует вход, ее проще тестировать.

- What is tail call optimization?

  **Ответ:** Tail call optimization позволяет переиспользовать stack frame, если рекурсивный вызов является последней операцией функции. В JavaScript поддержка ограничена и не должна считаться надежной для production recursion.

- What is reactive programming?

  **Ответ:** Reactive programming работает с потоками событий и изменениями данных во времени. Вместо ручного управления последовательностью callbacks код описывает реакции на streams: values, errors, completion.

- What are the main building blocks of reactive programming?

  **Ответ:** Основные элементы: stream/observable, observer/subscriber, subscription, operators, scheduler, subject и backpressure strategy. Конкретные названия зависят от библиотеки, например RxJS.

- What is a stream?

  **Ответ:** Stream — последовательность данных или событий во времени. Stream может быть конечным, например чтение файла, или долгоживущим, например пользовательские события или сообщения WebSocket.

- What is an observable?

  **Ответ:** Observable — объект, на который можно подписаться, чтобы получать значения, ошибки и сигнал завершения. В RxJS observable ленивый: источник часто начинает работать только после subscription.

- What is a subscription?

  **Ответ:** Subscription представляет активную подписку на observable/stream. Ее нужно закрывать, когда данные больше не нужны, иначе возможны memory leaks и лишняя работа.

- What are common implementation challenges in reactive programming?

  **Ответ:** Частые сложности: управление lifecycle подписок, error handling, backpressure, сложные operator chains, race conditions, debugging async flows и overengineering для простых задач.

- What is a reactive system?

  **Ответ:** Reactive system — система, спроектированная быть responsive, resilient, elastic и message-driven. Это архитектурная идея из Reactive Manifesto, а не просто использование RxJS.

- What does it mean for a system to be responsive?

  **Ответ:** Responsive system отвечает пользователю или другой системе в приемлемое время. Для этого нужны latency budgets, timeouts, load shedding, monitoring и отсутствие blocking bottlenecks.

- What does it mean for a system to be resilient?

  **Ответ:** Resilient system продолжает работать при частичных сбоях. Она использует isolation, retries with limits, circuit breakers, replication, graceful degradation и recovery mechanisms.

- What does it mean for a system to be elastic?

  **Ответ:** Elastic system масштабируется вверх и вниз под нагрузку. Она эффективно использует ресурсы, добавляет/убирает instances и не требует ручного вмешательства при обычных изменениях traffic.

- What does it mean for a system to be message-driven?

  **Ответ:** Message-driven system взаимодействует через asynchronous messages. Это помогает развязать компоненты, буферизовать нагрузку и изолировать сбои, но требует идемпотентности и обработки повторной доставки.

- What is an algorithm?

  **Ответ:** Algorithm — конечная последовательность шагов для решения задачи. Хороший алгоритм имеет понятные входы, выходы, корректность и оценимую сложность.

- What are basic data structures?

  **Ответ:** Базовые структуры данных: array, linked list, stack, queue, hash table/map, set, tree, graph, heap. Выбор структуры влияет на сложность операций поиска, вставки, удаления и обхода.

- What is Big-O notation?

  **Ответ:** Big-O описывает асимптотический рост времени или памяти алгоритма относительно размера входа. Например, `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n^2)`.

- How do sorting algorithms work?

  **Ответ:** Sorting algorithms упорядочивают элементы по comparator. Простые алгоритмы вроде bubble sort имеют `O(n^2)`, эффективные вроде merge sort и quicksort обычно `O(n log n)`. Встроенные сортировки языков часто используют гибридные оптимизированные алгоритмы.

- How do searching algorithms work?

  **Ответ:** Searching algorithms находят элемент или условие в структуре данных. Linear search работает за `O(n)`, binary search — за `O(log n)`, но требует отсортированных данных. Hash lookup в среднем дает `O(1)`.

- How is algorithm complexity calculated?

  **Ответ:** Считают, как количество операций или памяти растет с размером входа. Константы и младшие члены обычно отбрасывают. Важно анализировать worst, average и sometimes amortized complexity.

- What is REST?

  **Ответ:** REST — архитектурный стиль для распределенных систем, основанный на resources, representations, stateless communication и uniform interface. В web API REST обычно выражается через HTTP methods, status codes, URIs и media types.

- How does request caching work as one of the REST architectural constraints?

  **Ответ:** REST допускает кеширование ответов, если сервер явно указывает cache semantics. HTTP headers вроде `Cache-Control`, `ETag`, `Last-Modified` позволяют клиентам и proxy переиспользовать response и снижать нагрузку.

- What are the six REST architectural constraints?

  **Ответ:** Классические constraints REST: client-server, stateless, cacheable, uniform interface, layered system и code-on-demand как optional constraint. Нарушение stateless или uniform interface часто превращает API в обычный RPC поверх HTTP.

- What is GraphQL?

  **Ответ:** GraphQL — query language и runtime для API, где клиент явно запрашивает нужные поля. Обычно есть schema, types, queries, mutations и resolvers. GraphQL удобен для сложных клиентских views и агрегирования данных.

- What is the difference between GraphQL and REST?

  **Ответ:** REST строится вокруг resources и HTTP semantics, GraphQL — вокруг typed schema и client-defined queries. REST проще кешировать на HTTP-уровне, GraphQL снижает overfetching/underfetching, но требует контроля complexity, authorization на уровне fields и resolver performance.

- How can a simple request be made with fetch()?

  **Ответ:** `fetch()` возвращает Promise с `Response`. Для простого GET достаточно передать URL.

  ```js
  const response = await fetch('/api/products');
  const data = await response.json();
  ```

- How can a response be handled with fetch()?

  **Ответ:** Нужно проверить `response.ok`, затем прочитать body нужным методом: `json()`, `text()`, `blob()`, `arrayBuffer()`, `formData()`. Ошибочные HTTP statuses не отклоняют promise автоматически.

  ```js
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  ```

- How can binary data be read from a fetch() response body?

  **Ответ:** Binary response можно прочитать через `arrayBuffer()` или `blob()` в браузере. Для stream processing используют `response.body`, если окружение поддерживает Web Streams.

  ```js
  const buffer = await response.arrayBuffer();
  ```

- How can headers be read and set with fetch()?

  **Ответ:** Request headers задаются в options, response headers читаются через `response.headers.get(name)`.

  ```js
  const response = await fetch('/api', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const contentType = response.headers.get('content-type');
  ```

- What is the difference between XHR and fetch()?

  **Ответ:** XHR — старый callback/event-based API с progress events и широкой legacy-поддержкой. `fetch()` — современный Promise-based API с более чистым интерфейсом, streams и лучшей композиционностью, но upload progress в браузере исторически проще через XHR.

- What is AJAX?

  **Ответ:** AJAX — подход, при котором web page обменивается данными с сервером асинхронно без полной перезагрузки страницы. Сейчас AJAX реализуют через `fetch`, XHR или higher-level HTTP clients.

- How can a simple request be made with XHR?

  **Ответ:** Нужно создать `XMLHttpRequest`, открыть соединение, настроить обработчики и вызвать `send()`.

  ```js
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/products');
  xhr.onload = () => console.log(xhr.responseText);
  xhr.send();
  ```

- How can a response be handled with XHR?

  **Ответ:** Response обрабатывают в событиях `load`, `error`, `timeout`, `readystatechange`. Нужно проверять `xhr.status` и читать `responseText`, `responseXML` или `response` в зависимости от `responseType`.

- What are the main CRUD HTTP methods?

  **Ответ:** Основные CRUD methods: `GET` для чтения, `POST` для создания, `PUT` для полной замены, `PATCH` для частичного обновления, `DELETE` для удаления. Реальное поведение должно быть описано API contract.

- What are the OPTIONS, HEAD, and PATCH HTTP methods?

  **Ответ:** `OPTIONS` сообщает поддерживаемые методы и используется в CORS preflight. `HEAD` похож на `GET`, но без body. `PATCH` применяет частичное изменение resource.

- What is the difference between PUT, PATCH, and POST?

  **Ответ:** `POST` обычно создает subordinate resource или запускает action. `PUT` idempotent и обычно полностью заменяет resource по известному URI. `PATCH` частично изменяет resource и может быть idempotent или нет в зависимости от patch format.

- What is the difference between AJAX and COMET?

  **Ответ:** AJAX обычно означает клиентские async-запросы к серверу. COMET — набор техник server push до широкого распространения WebSockets: long polling и streaming responses, где сервер держит соединение открытым для отправки событий.

- What are the CONNECT and TRACE HTTP methods?

  **Ответ:** `CONNECT` создает tunnel, чаще для HTTPS через proxy. `TRACE` возвращает request обратно для диагностики, но обычно отключен из соображений безопасности.

- How can XHR be used in advanced scenarios?

  **Ответ:** XHR поддерживает upload/download progress, timeouts, abort, custom headers, credentials и разные `responseType`. Он полезен, когда нужен upload progress или legacy browser support.

- Why is CORS needed?

  **Ответ:** CORS нужен, чтобы браузер безопасно разрешал cross-origin requests. Same-Origin Policy запрещает произвольный доступ к ресурсам другого origin, а CORS дает серверу способ явно разрешить доступ.

- What are CORS headers?

  **Ответ:** Основные headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`, `Access-Control-Max-Age`. Для preflight браузер отправляет `OPTIONS`.

- What is the difference between JSONP and CORS?

  **Ответ:** JSONP — legacy workaround через `<script>` и callback, работает только для GET и имеет security risks. CORS — стандартный механизм браузера для controlled cross-origin HTTP requests.

- How does long polling work?

  **Ответ:** Клиент отправляет запрос, сервер держит его открытым до появления события или timeout. После ответа клиент сразу отправляет новый запрос. Так имитируется server push поверх обычного HTTP.

- What is the difference between long polling and regular polling?

  **Ответ:** Regular polling спрашивает сервер через фиксированный интервал, даже если событий нет. Long polling держит запрос открытым и отвечает только при событии или timeout, поэтому снижает пустые ответы и latency.

- Where is long polling commonly used?

  **Ответ:** Long polling используют для уведомлений, чатов, live status updates и fallback-сценариев, где WebSocket или SSE недоступны. Сейчас чаще выбирают WebSocket или EventSource, если они подходят.

- What are WebSocket API methods?

  **Ответ:** Основные методы и свойства WebSocket API: constructor `new WebSocket(url)`, `send(data)`, `close()`, `readyState`, `url`, `protocol`, `binaryType`.

- What are WebSocket API events?

  **Ответ:** Основные события: `open`, `message`, `error`, `close`. Через них клиент узнает о соединении, входящих сообщениях, ошибках и закрытии канала.

- What are cross-origin limitations for WebSockets?

  **Ответ:** WebSocket не использует CORS так же, как `fetch`, но браузер отправляет `Origin` header. Сервер должен проверять `Origin`, authentication и authorization, иначе можно получить cross-site WebSocket hijacking.

- What are the main ways to integrate WebSockets?

  **Ответ:** Интеграция бывает через native WebSocket server, Socket.IO, ws library, reverse proxy support, managed realtime platforms или message broker behind gateway. Важно решить auth, reconnect, heartbeats и scaling между instances.

- What are WebSocket extensions and subprotocols?

  **Ответ:** Extensions расширяют поведение соединения, например compression `permessage-deflate`. Subprotocols согласуют application-level protocol через `Sec-WebSocket-Protocol`, например `graphql-transport-ws`.

- What are EventSource API methods?

  **Ответ:** EventSource используется для Server-Sent Events. Основной API: constructor `new EventSource(url)`, `close()`, свойства `readyState`, `url`, `withCredentials`.

- What are EventSource API events?

  **Ответ:** Основные события: `open`, `message`, `error`, а также custom event types через `addEventListener('eventName', handler)`. Сервер отправляет события в формате `text/event-stream`.

- How does CORS work with EventSource?

  **Ответ:** EventSource подчиняется CORS. Сервер должен выставить `Access-Control-Allow-Origin`, а для cookies/credentials нужен `withCredentials: true` на клиенте и `Access-Control-Allow-Credentials: true` на сервере.

- What is the difference between EventSource and WebSocket?

  **Ответ:** EventSource — однонаправленный server-to-client поток поверх HTTP, удобный для notifications и live feeds. WebSocket — двунаправленный persistent channel, удобный для чатов, игр и интерактивных realtime-протоколов.

- What are HTTP and HTTPS protocols?

  **Ответ:** HTTP — application protocol для передачи ресурсов и API messages. HTTPS — HTTP поверх TLS, добавляющий шифрование, integrity и authentication сервера через сертификат.

- What are the differences and similarities between HTTP and HTTPS?

  **Ответ:** Оба используют одинаковую HTTP semantics: methods, headers, status codes. HTTPS отличается TLS-слоем, защищающим данные от прослушивания и подмены. В production почти всегда нужен HTTPS.

- How should passwords be stored securely?

  **Ответ:** Пароли нельзя хранить в открытом виде или обычным быстрым hash. Нужно использовать password hashing algorithms с salt и cost factor: Argon2id, bcrypt или scrypt. Также важны rate limiting, MFA и защита reset flows.

- What are hashing capabilities?

  **Ответ:** Hash function преобразует данные в фиксированный digest. Хороший cryptographic hash устойчив к collisions и preimage attacks. Для паролей нужны медленные password hashes, для integrity — SHA-256/SHA-512, для authentication messages — HMAC.

- What is the difference between a hash and HMAC?

  **Ответ:** Hash не использует секрет и проверяет целостность данных. HMAC использует secret key и подтверждает, что сообщение создано стороной, знающей ключ. HMAC подходит для подписи webhook payloads и API messages.

- What are common form and URL attacks?

  **Ответ:** Частые атаки: SQL/NoSQL injection, XSS, CSRF, open redirect, parameter tampering, path traversal, mass assignment, HTTP parameter pollution и credential stuffing. Защита: validation, encoding, auth checks, CSRF tokens, allowlists и safe redirects.

- What is CSRF?

  **Ответ:** CSRF заставляет браузер аутентифицированного пользователя отправить нежелательный запрос на доверенный сайт. Защита: SameSite cookies, CSRF tokens, проверка Origin/Referer, отказ от state-changing GET и re-auth для критичных действий.

- What is XSS?

  **Ответ:** XSS — внедрение JavaScript/HTML в страницу, которую увидит другой пользователь. Виды: reflected, stored, DOM-based. Защита: output encoding, sanitization, CSP, безопасные template engines и запрет dangerous HTML APIs.

- What is the semantic URLs security problem?

  **Ответ:** Semantic URLs могут раскрывать структуру системы, IDs, роли, имена файлов или бизнес-операции. Сама понятная URL-структура не уязвимость, но нельзя полагаться на "скрытые" URLs вместо authorization. Каждый resource должен проверять доступ.

- What is input data filtering?

  **Ответ:** Input filtering — проверка и нормализация входных данных до использования. Лучше использовать allowlist validation: типы, длины, форматы, диапазоны. Filtering не заменяет output encoding и parameterized queries.

- What are common web security threats such as defacement, infiltration, phishing, pharming, and DoS?

  **Ответ:** Defacement меняет вид сайта, infiltration означает проникновение в систему, phishing обманывает пользователя через фальшивую коммуникацию, pharming перенаправляет на поддельный сайт, DoS/DDoS нарушает доступность. Защита требует hardening, monitoring, WAF/CDN, auth controls и incident response.

- What are session management attacks?

  **Ответ:** Это атаки на session lifecycle: hijacking, fixation, stolen cookies, weak tokens, missing rotation, long-lived sessions. Защита: secure random session IDs, `HttpOnly`, `Secure`, `SameSite`, rotation after login, expiration и logout invalidation.

- What are attacks against JSON?

  **Ответ:** Возможны JSON injection, prototype pollution, JSON hijacking, parsing bombs, excessive nesting, mass assignment и data exposure. Защита: strict content type, schema validation, payload limits и безопасная сериализация.

- What is JSON hijacking?

  **Ответ:** JSON hijacking — legacy attack, где злоумышленник пытался прочитать JSON через `<script>` в старых браузерах. Современная защита: CORS, правильный `Content-Type: application/json`, anti-CSRF, отказ от sensitive GET JSON endpoints без защиты.

- What is symmetric key cryptography?

  **Ответ:** Symmetric cryptography использует один общий secret key для шифрования и расшифрования. Она быстрая и подходит для больших данных, но требует безопасного обмена ключом. Примеры: AES-GCM, ChaCha20-Poly1305.

- What is asymmetric key cryptography?

  **Ответ:** Asymmetric cryptography использует пару ключей: public и private. Public key можно распространять, private key хранится секретно. Используется для TLS handshakes, digital signatures, key exchange и certificates.

- What is SSI injection?

  **Ответ:** SSI injection возникает, когда пользовательский input попадает в Server Side Includes и выполняется сервером как SSI directive. Защита: отключать SSI, не включать user input в SSI templates, экранировать данные и ограничивать upload/templating.

- What are authentication and access control attacks?

  **Ответ:** Authentication attacks направлены на вход в систему: brute force, credential stuffing, session theft, MFA bypass. Access control attacks используют ошибки authorization: IDOR, privilege escalation, missing checks. Защита требует strong auth и server-side authorization на каждый resource/action.

- What are the OWASP Top 10 vulnerabilities?

  **Ответ:** OWASP Top 10 — актуализируемый список ключевых рисков web application security. По опубликованной версии 2025 это: Broken Access Control, Security Misconfiguration, Software Supply Chain Failures, Cryptographic Failures, Injection, Insecure Design, Authentication Failures, Software or Data Integrity Failures, Security Logging and Alerting Failures, Mishandling of Exceptional Conditions.

- How does TLS/SSL work?

  **Ответ:** TLS устанавливает защищенный канал: клиент проверяет сертификат сервера, стороны согласуют параметры, выполняют key exchange и затем используют symmetric encryption для трафика. SSL — устаревшее название; современные системы должны использовать TLS.

- What is the automated build concept?

  **Ответ:** Automated build — воспроизводимый процесс, который без ручных действий устанавливает зависимости, компилирует код, запускает проверки, собирает artifacts и готовит release/deployment package.

- How can a project be built with build tools such as Gulp, Grunt, Webpack, or Bazel?

  **Ответ:** Build tool описывает tasks или dependency graph: transpilation, bundling, minification, assets, tests. Gulp/Grunt чаще task runners, Webpack — bundler, Bazel — hermetic build system с сильным caching и dependency graph.

- How can build output be cleaned up?

  **Ответ:** Build output очищают отдельным clean step: удаляют `dist`, `build`, coverage, temp artifacts. Важно не удалять source files и не полагаться на stale outputs.

  ```bash
  rm -rf dist coverage
  npm run build
  ```

- How can build scripts be developed and edited in CI tools such as TeamCity, Hudson, Jenkins, Travis, or Bamboo?

  **Ответ:** Build scripts лучше хранить в репозитории как pipeline-as-code: Jenkinsfile, `.travis.yml`, TeamCity Kotlin DSL и т.д. Это дает code review, history и воспроизводимость. UI-настройки CI стоит минимизировать.

- How can a multiphase build process be scripted?

  **Ответ:** Pipeline делят на stages: checkout, install, lint, unit tests, build, integration tests, package, security scan, deploy. Каждый stage должен иметь понятные inputs/outputs и fail-fast behavior.

- How can product installer generation be integrated into the build process?

  **Ответ:** Installer generation добавляют как отдельный stage после успешной сборки и тестов. Он берет versioned artifacts, подписывает их при необходимости, создает package/installer и публикует в artifact repository.

- How can release notes or release documentation be generated?

  **Ответ:** Release notes можно генерировать из conventional commits, PR labels, changelog fragments, issue tracker и git tags. Хороший процесс включает human review перед публикацией.

- How can scheduled or nightly builds be developed?

  **Ответ:** Nightly builds запускаются по расписанию в CI. Они полезны для длинных тестов, security scans, dependency checks и сборки snapshot artifacts. Их статус должен мониториться так же, как обычный pipeline.

- How can the build process be monitored?

  **Ответ:** Мониторят статус jobs, duration, failure rate, flaky tests, queue time, artifact publishing и resource usage. Важно видеть тренды, а не только последний failed build.

- How can build status reporting and notifications be configured?

  **Ответ:** CI должен отправлять уведомления в pull request checks, email, Slack/Teams или dashboard. Уведомления должны быть actionable: какой stage упал, где logs, кто владелец.

- How can deployment stages be integrated into the build process?

  **Ответ:** Deployment stages добавляют после build/test/package: deploy to dev, staging, production. Обычно используют approvals, environment-specific config, secrets manager, rollout strategy и rollback plan.

- How can a product be moved to a release area?

  **Ответ:** Release artifacts публикуют в controlled storage: artifact repository, container registry, package registry или release bucket. Artifact должен быть versioned, immutable, подписан/проверяем и связан с commit/tag.

- How can build processes be integrated with source control?

  **Ответ:** CI запускается на push, pull request, tag или schedule. Source control дает commit SHA, branch, tags, diff и review gates. Build artifacts должны ссылаться на конкретный commit.

- How are versioning, tagging, and release builds handled?

  **Ответ:** Версии задают через SemVer или другой release scheme. Release build обычно создается из protected branch или tag. Tag фиксирует исходный код release, а build metadata связывает tag, commit и artifacts.

- What is continuous integration?

  **Ответ:** Continuous Integration — практика частого слияния изменений в shared branch с автоматическими проверками. Цель — быстро находить интеграционные ошибки и держать main branch в рабочем состоянии.

- What are continuous integration best practices?

  **Ответ:** Лучшие практики: small commits, fast pipeline, deterministic tests, build every PR, fail fast, no broken main, artifact reuse, visible status, isolated environments и регулярное устранение flaky tests.

- What are common CI frameworks and tools?

  **Ответ:** Частые инструменты: GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis CI, TeamCity, Bamboo, Azure Pipelines, Buildkite. Выбор зависит от SCM, infrastructure, security и стоимости.

- How can appropriate tools for a build environment be selected?

  **Ответ:** Оценивают compatibility с stack, caching, secrets, runners, permission model, integrations, cost, maintainability, on-prem/cloud требования и опыт команды. Важно выбрать tool, который команда реально сможет поддерживать.

- How can a build be launched from the command line?

  **Ответ:** Build должен запускаться локально одной или несколькими документированными командами, например `npm ci && npm test && npm run build`. CI должен использовать те же команды, чтобы избежать расхождения.

- How can build outcomes be cleaned up?

  **Ответ:** Нужно удалять временные файлы, старые artifacts, caches по retention policy и окружения review apps. Cleanup должен быть безопасным и не удалять artifacts, нужные для audit/release.

- How can trivial build processes be automated with shell scripts and simple tools?

  **Ответ:** Для простых проектов достаточно shell scripts, npm scripts, Makefile или task runner. Главное — idempotency, понятные exit codes, строгий режим shell и документация.

- What is Software Configuration Management?

  **Ответ:** SCM управляет версиями исходного кода, конфигураций, build scripts, environments и release artifacts. Цель — воспроизводимость, traceability и контроль изменений.

- What tools are used for Software Configuration Management?

  **Ответ:** Для version control используют Git, SVN, Mercurial. Для configuration/infrastructure: Ansible, Puppet, Chef, Terraform, Helm, Kubernetes manifests. Для artifacts: Nexus, Artifactory, registries.

- How are release documents created?

  **Ответ:** Release documents создаются из changelog, issue tracker, PRs, test reports, known issues, migration notes и deployment instructions. Они должны быть связаны с конкретной версией и artifact.

- What are the fundamental concepts of group work and version control?

  **Ответ:** Основы: shared repository, branches, commits, pull requests, code review, merge strategy, conflict resolution, tags, access control и traceability от требования до release.

- What are basic version control operations?

  **Ответ:** Базовые операции Git: clone, status, add, commit, pull, push, branch, switch/checkout, merge, rebase, log, diff, tag, revert. Их цель — фиксировать и синхронизировать изменения.

- How do branching, tagging, and merging work?

  **Ответ:** Branch изолирует линию разработки, tag фиксирует конкретный commit как версию, merge объединяет изменения из одной ветки в другую. Стратегия может быть trunk-based, Git Flow или release branches.

- How can changes from a specific branch be merged?

  **Ответ:** Обычно переключаются на target branch, обновляют его и выполняют `git merge source-branch` или создают PR. После конфликтов нужны ручное разрешение, тесты и review.

- How can a repository be configured?

  **Ответ:** Конфигурация включает remotes, branch protections, hooks, CI checks, CODEOWNERS, `.gitignore`, commit conventions, access rights и repository settings. Локальные настройки задаются через `git config`.

- How can sources be imported and exported?

  **Ответ:** Import — перенос исходников в репозиторий с сохранением структуры и, если возможно, истории. Export — получение snapshot кода через archive, clone, package или vendor drop. Важно не переносить secrets и лишние artifacts.

- What is blame or annotate in version control?

  **Ответ:** Blame/annotate показывает, какой commit и автор изменили каждую строку файла. Это инструмент расследования контекста, а не поиска виноватых.

- What is the difference between resetting and reverting changes?

  **Ответ:** `reset` перемещает branch pointer и может переписать историю, особенно с `--hard`. `revert` создает новый commit, который отменяет изменения старого commit, сохраняя историю. В shared branches безопаснее `revert`.

- How can version control infrastructure be developed and implemented?

  **Ответ:** Нужно выбрать SCM platform, настроить access control, branch policies, backups, CI integration, audit logs, repository templates, hooks и disaster recovery. Также нужны правила работы команды.

- How are revision graphs and logs used?

  **Ответ:** Logs и revision graphs помогают понять историю изменений, ветвления, merges, release points и regressions. Они полезны для code archaeology и debugging production issues.

- How are version control policy documents created?

  **Ответ:** Policy documents описывают branching model, commit message format, review requirements, merge rules, release tagging, hotfix process и protected branches. Документ должен быть коротким и реально применяемым.

- How are patches applied?

  **Ответ:** Patch можно применить через `git apply` или `git am`, если это email patch с metadata. После применения нужны review, tests и commit. Конфликты решаются вручную.

- What are Test Plan, Test Suite, and Test Case?

  **Ответ:** Test Plan описывает стратегию и scope тестирования. Test Suite — набор тестов для области или feature. Test Case — конкретный сценарий с preconditions, steps, expected result.

- What are different test types such as unit, integration, and functional testing?

  **Ответ:** Unit tests проверяют маленькие части кода изолированно. Integration tests проверяют взаимодействие компонентов. Functional tests проверяют поведение системы с точки зрения требований. Также есть e2e, contract, performance, security и smoke tests.

- What is the Testing Pyramid?

  **Ответ:** Testing Pyramid предлагает иметь много быстрых unit tests, меньше integration tests и еще меньше дорогих e2e tests. Это снижает стоимость поддержки и ускоряет feedback.

- What is Test-Driven Development (TDD)?

  **Ответ:** TDD — цикл red-green-refactor: сначала пишется failing test, затем минимальный код для прохождения, затем refactoring. Он помогает проектировать API и держать поведение покрытым тестами.

- What are test fixtures?

  **Ответ:** Fixtures — подготовленные данные, объекты, mocks или environment state для теста. Хорошие fixtures минимальны, понятны и не создают скрытой зависимости между тестами.

- How can dependencies be broken in tests?

  **Ответ:** Зависимости изолируют через dependency injection, mocks, stubs, fakes, test doubles, interfaces, in-memory adapters и contract tests. Цель — контролировать внешнее поведение без хрупкого теста.

- What are stubs?

  **Ответ:** Stub — test double, который возвращает заранее заданные ответы. Он используется, чтобы заменить реальную зависимость и проверить поведение объекта при известных входах.

- What are mocks?

  **Ответ:** Mock — test double, который проверяет взаимодействия: был ли вызван метод, с какими аргументами, сколько раз. Mocks полезны для side effects, но чрезмерное mock-ирование делает тесты хрупкими.

- What is interaction testing?

  **Ответ:** Interaction testing проверяет, как объект взаимодействует с зависимостями, а не только итоговое состояние. Например, был ли вызван repository.save() после валидации.

- What is Behavior-Driven Development (BDD)?

  **Ответ:** BDD описывает поведение системы на языке бизнеса через scenarios: Given, When, Then. Он помогает синхронизировать понимание между разработчиками, QA и stakeholders.

- What are the F.I.R.S.T. properties of a good unit test?

  **Ответ:** F.I.R.S.T. означает Fast, Independent, Repeatable, Self-validating, Timely. Хороший unit test быстрый, независимый, воспроизводимый, сам проверяет результат и пишется вовремя.

- What is a code smell?

  **Ответ:** Code smell — признак возможной проблемы в дизайне кода. Он не всегда bug, но сигнал, что код может быть трудно читать, тестировать или изменять.

- What are common code smells?

  **Ответ:** Частые smells: long method, large class, duplicated code, feature envy, shotgun surgery, primitive obsession, deep nesting, god object, data clumps, inappropriate intimacy и hidden side effects.

- What are project coding conventions?

  **Ответ:** Coding conventions — правила форматирования, именования, структуры файлов, error handling, testing и архитектурных ограничений. Они уменьшают субъективность и делают код единообразным.

- What are examples of coding conventions?

  **Ответ:** Примеры: naming style, max line length, import order, no unused variables, preferred async style, folder structure, commit messages, API response format, error naming и test file placement.

- What are common refactoring techniques?

  **Ответ:** Частые техники: extract function, extract class, inline variable, rename, move method, introduce parameter object, replace conditional with polymorphism, split phase, encapsulate collection, remove dead code.

- What are code quality tools such as ESLint, JSHint, and TSLint?

  **Ответ:** Это static analysis tools для поиска ошибок, нарушения стиля и потенциальных проблем. ESLint — современный стандарт для JavaScript/TypeScript. JSHint устарел для большинства новых проектов, TSLint deprecated в пользу ESLint.

- How are SonarQube and Lighthouse used as code quality services?

  **Ответ:** SonarQube анализирует code smells, bugs, vulnerabilities, duplication и coverage. Lighthouse анализирует web performance, accessibility, SEO, PWA и best practices. Оба инструмента полезны как CI quality gates.

- What are PWA constraints?

  **Ответ:** PWA требует HTTPS, service worker, web app manifest, responsive UI, offline/caching strategy и надежного performance. Ограничения включают browser support, storage limits, push permissions и platform-specific behavior.

- What are code policy documents?

  **Ответ:** Code policy documents фиксируют правила команды: style, architecture boundaries, review checklist, security requirements, testing expectations и dependency policy. Они должны быть короткими, поддерживаемыми и применяться через tooling.

- What is refactoring to patterns?

  **Ответ:** Refactoring to patterns — постепенное изменение существующего кода в сторону известного design pattern, когда он действительно решает текущую проблему. Например, заменить сложный conditional на Strategy pattern.

- What are software metrics?

  **Ответ:** Software metrics — количественные показатели кода, процесса или продукта: complexity, coverage, defect rate, lead time, deployment frequency, MTTR, performance, reliability. Метрики помогают видеть тренды, но не должны заменять инженерное мышление.

- What are SLOC, code coverage, cohesion, coupling, and cyclomatic complexity?

  **Ответ:** SLOC — количество строк кода. Code coverage — доля кода, выполненная тестами. Cohesion показывает, насколько элементы модуля связаны одной ответственностью. Coupling — степень зависимости между модулями. Cyclomatic complexity измеряет количество независимых путей выполнения.

- What are non-common quality tools?

  **Ответ:** К менее типичным quality tools относятся mutation testing, architecture fitness functions, dependency graph analyzers, bundle analyzers, accessibility scanners, security SAST/DAST/IAST, performance profilers, chaos testing tools и license compliance scanners.
