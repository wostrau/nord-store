# Database Matrix: вопросы и ответы

- Why do SQL databases provide multiple integer types?

  **Ответ:** SQL databases дают несколько integer types, чтобы точнее управлять диапазоном значений, размером хранения и производительностью. Например, `SMALLINT` занимает меньше места, чем `BIGINT`, а `BIGINT` нужен для очень больших счетчиков, идентификаторов и финансовых/аналитических данных. Выбор типа влияет на storage, indexes и cache efficiency.

- Why can’t a single integer type be used everywhere?

  **Ответ:** Один универсальный integer type был бы либо слишком маленьким для больших значений, либо слишком большим для большинства колонок. Если везде использовать `BIGINT`, таблицы и индексы будут занимать больше памяти и диска. Если везде использовать `INT`, можно столкнуться с overflow.

- What is the difference between INT and FLOAT?

  **Ответ:** `INT` хранит целые числа без дробной части и подходит для счетчиков, идентификаторов, количества товаров. `FLOAT` хранит числа с плавающей точкой и может иметь погрешность представления, поэтому не подходит для денег. Для финансовых значений лучше использовать `DECIMAL`/`NUMERIC`.

  ```sql
  price DECIMAL(10, 2) -- лучше для денег
  rating FLOAT         -- допустимо для приблизительных значений
  ```

- What are unsigned types and what advantages do they provide?

  **Ответ:** Unsigned types хранят только неотрицательные значения, расширяя верхнюю границу диапазона при том же размере. Например, unsigned integer удобен для ID, счетчиков и количества, если отрицательные значения невозможны. Поддержка зависит от конкретной СУБД: например, MySQL поддерживает `UNSIGNED`, PostgreSQL — нет.

- What is the difference between CHAR and VARCHAR?

  **Ответ:** `CHAR(n)` хранит строку фиксированной длины и может дополнять ее пробелами. `VARCHAR(n)` хранит строку переменной длины до лимита `n`. `CHAR` подходит для строго фиксированных значений вроде country code, а `VARCHAR` — для имен, email и описаний.

- What is BLOB data type?

  **Ответ:** `BLOB` хранит binary large object: изображения, файлы, архивы, бинарные payloads. Это не текстовый тип, поэтому СУБД не интерпретирует содержимое как строку и не применяет collation.

- How does BLOB differ from TEXT and other string types?

  **Ответ:** `BLOB` хранит байты, `TEXT` хранит текст с кодировкой и правилами сравнения. `TEXT` можно искать и сортировать как строку, а `BLOB` обычно обрабатывают как бинарные данные. Для больших файлов часто лучше хранить файл в object storage, а в БД — metadata и ссылку.

- What types of keys exist in SQL databases?

  **Ответ:** Основные ключи: primary key, foreign key, candidate key, alternate key, composite key, surrogate key и natural key. Primary key уникально идентифицирует строку, foreign key связывает таблицы, composite key состоит из нескольких колонок, surrogate key создается искусственно, например auto-increment ID или UUID.

- What is a Primary Key?

  **Ответ:** Primary Key — constraint, который уникально идентифицирует каждую строку таблицы. Значение primary key должно быть уникальным и не `NULL`. Часто primary key используется как цель foreign key из других таблиц.

  ```sql
  CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
  );
  ```

- What is a Foreign Key?

  **Ответ:** Foreign Key — constraint, который гарантирует ссылочную целостность между таблицами. Значение в дочерней таблице должно ссылаться на существующую строку родительской таблицы или быть `NULL`, если это разрешено.

  ```sql
  CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id)
  );
  ```

- How many Primary Keys can a table have?

  **Ответ:** Таблица может иметь только один primary key. Но этот primary key может быть composite, то есть состоять из нескольких колонок.

  ```sql
  PRIMARY KEY (order_id, product_id)
  ```

- What are the requirements for a Primary Key?

  **Ответ:** Primary key должен быть уникальным, не `NULL`, стабильным и минимальным по смыслу. Значение не должно часто изменяться, потому что на него могут ссылаться другие таблицы. На практике часто используют surrogate key: auto-increment, sequence или UUID.

- What constraints and hooks can be attached to a Foreign Key?

  **Ответ:** Для foreign key можно задать действия `ON DELETE` и `ON UPDATE`: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`. Они определяют, что произойдет с дочерними строками при изменении или удалении родительской строки.

  ```sql
  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
  ```

- What happens when deleting a row referenced by a Foreign Key with NO ACTION strategy?

  **Ответ:** Если дочерние строки ссылаются на удаляемую родительскую строку, `NO ACTION` запрещает удаление и СУБД вернет ошибку нарушения foreign key. В некоторых СУБД `NO ACTION` может проверяться в конце statement или transaction, если constraint deferrable.

- What does CASCADE strategy do?

  **Ответ:** `CASCADE` автоматически применяет действие к дочерним строкам. `ON DELETE CASCADE` удаляет дочерние записи при удалении родителя. `ON UPDATE CASCADE` обновляет foreign key в дочерних строках при изменении parent key.

- Can tables be joined without Foreign Keys?

  **Ответ:** Да. `JOIN` работает по условию в запросе и не требует физического foreign key constraint. Но без foreign key СУБД не гарантирует ссылочную целостность, поэтому могут появиться "висячие" ссылки.

  ```sql
  SELECT *
  FROM orders o
  JOIN users u ON u.id = o.user_id;
  ```

- What are relationships between tables?

  **Ответ:** Relationships описывают логические связи между сущностями в разных таблицах. Они показывают, как строки одной таблицы соответствуют строкам другой: один-к-одному, один-ко-многим или многие-ко-многим.

- What types of table relationships exist?

  **Ответ:** Основные типы: one-to-one, one-to-many и many-to-many. One-to-many — самый частый пример: один пользователь имеет много заказов. Many-to-many обычно реализуется через отдельную join table.

- How is a many-to-many relationship implemented in practice?

  **Ответ:** Many-to-many реализуется через связующую таблицу, которая хранит foreign keys на обе таблицы. Часто composite primary key состоит из этих двух ключей.

  ```sql
  CREATE TABLE order_products (
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id)
  );
  ```

- What are database constraints?

  **Ответ:** Constraints — правила, которые СУБД применяет к данным. Они ограничивают допустимые значения и связи: `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, `DEFAULT`.

- Why are constraints needed in tables?

  **Ответ:** Constraints защищают data integrity на уровне БД, а не только приложения. Это важно, потому что данные могут изменяться разными сервисами, scripts, migrations и admin tools. Constraint делает нарушение невозможным независимо от источника записи.

- How can constraints be added to an existing table?

  **Ответ:** Обычно через `ALTER TABLE ... ADD CONSTRAINT`. Перед добавлением нужно убедиться, что существующие данные не нарушают новое правило.

  ```sql
  ALTER TABLE users
  ADD CONSTRAINT users_email_unique UNIQUE (email);
  ```

- What is an index?

  **Ответ:** Index — дополнительная структура данных, которую база строит поверх таблицы/коллекции, чтобы быстрее находить записи. Индекс похож на оглавление или алфавитный указатель в книге: вместо полного просмотра всех страниц база сначала смотрит в index, находит нужные pointers/row ids/document ids, а затем читает сами данные.

  Без индекса база часто делает full scan:

  ```sql
  SELECT *
  FROM users
  WHERE email = 'alex@example.com';
  ```

  Если на `email` нет индекса, database engine может проверить каждую строку в `users`. Если строк миллионы, это дорого. С индексом по `email` база быстро находит нужное значение в index structure и читает только подходящие строки.

  Что ускоряют индексы:

  - поиск по `WHERE`;
  - сортировку через `ORDER BY`;
  - соединения таблиц через `JOIN`;
  - проверку уникальности, например unique index на `email`;
  - range queries, например `created_at >= ...`;
  - иногда чтение только из индекса без обращения к таблице, если index покрывает все нужные поля.

  Примеры:

  ```sql
  CREATE INDEX users_email_idx ON users (email);
  CREATE INDEX orders_user_id_created_at_idx ON orders (user_id, created_at);
  CREATE UNIQUE INDEX users_email_unique_idx ON users (email);
  ```

  В MongoDB:

  ```js
  db.products.createIndex({ title: 1 });
  db.orders.createIndex({ userId: 1, createdAt: -1 });
  db.users.createIndex({ email: 1 }, { unique: true });
  ```

  Цена индекса:

  - index занимает дополнительное место на диске и в памяти;
  - insert/update/delete становятся дороже, потому что нужно обновлять не только данные, но и indexes;
  - слишком много индексов может замедлить запись;
  - неправильный index может вообще не использоваться query planner-ом;
  - composite index зависит от порядка полей.

  Виды индексов:

  - **B-tree index** — самый распространенный, хорошо подходит для equality, range queries и sorting.
  - **Hash index** — хорош для точного поиска по equality, но обычно не подходит для range/sort.
  - **Unique index** — не только ускоряет поиск, но и запрещает дубликаты.
  - **Composite index** — индекс по нескольким полям, например `(user_id, created_at)`.
  - **Partial index** — индекс только по части строк/documents, например только активные users.
  - **Text index** — для полнотекстового поиска.

  Важно: индекс нужен под конкретный query pattern. Хорошая практика — смотреть `EXPLAIN` / `explain()` и проверять, использует ли запрос index, сколько строк/documents он просматривает и насколько это влияет на latency.

- How can a constraint or rule be removed from a table?

  **Ответ:** Constraint удаляется через `ALTER TABLE ... DROP CONSTRAINT`. Синтаксис и имена constraints зависят от СУБД. Индексы обычно удаляются через `DROP INDEX`.

  ```sql
  ALTER TABLE users DROP CONSTRAINT users_email_unique;
  DROP INDEX users_email_idx;
  ```

- What types of indexes exist?

  **Ответ:** Тип индекса определяет, какие запросы база сможет ускорить. Индекс нужно выбирать не "на всякий случай", а под конкретный query pattern: поиск товара, фильтрация заказов пользователя, сортировка по цене, уникальный email, поиск по тексту и т.д.

  **B-tree index**

  Самый распространенный тип индекса. Хорошо подходит для:

  - точного поиска: `email = ...`;
  - диапазонов: `price >= 100`;
  - сортировки: `ORDER BY created_at`;
  - сравнений: `<`, `<=`, `>`, `>=`.

  Пример для интернет-магазина: быстро найти пользователя по email при логине.

  ```js
  db.users.createIndex({ email: 1 });
  ```

  Пример: быстро показать товары от дешевых к дорогим.

  ```js
  db.products.createIndex({ price: 1 });
  ```

  **Unique index**

  Гарантирует, что значение не повторяется. Это не только performance optimization, но и data integrity rule.

  Пример: два пользователя не должны иметь один и тот же email.

  ```js
  db.users.createIndex({ email: 1 }, { unique: true });
  ```

  **Composite index**

  Индекс по нескольким полям. Полезен, когда запрос почти всегда фильтрует/сортирует по комбинации полей.

  Пример: показать заказы конкретного пользователя, сначала новые.

  ```js
  db.orders.createIndex({ userId: 1, createdAt: -1 });
  ```

  Такой индекс хорошо подходит для запроса:

  ```js
  db.orders
    .find({ userId })
    .sort({ createdAt: -1 });
  ```

  Важно: порядок полей имеет значение. Индекс `{ userId: 1, createdAt: -1 }` хорошо работает, когда запрос начинается с `userId`.

  **Partial / filtered index**

  Индексирует только часть документов/строк. Полезен, если часто запрашивается не вся коллекция, а только определенное состояние.

  Пример: быстро искать только активные товары, не индексируя archived products.

  ```js
  db.products.createIndex(
    { category: 1, price: 1 },
    { partialFilterExpression: { isActive: true } }
  );
  ```

  Такой индекс подходит для запроса:

  ```js
  db.products.find({
    isActive: true,
    category: 'electronics',
  });
  ```

  **Text index**

  Используется для полнотекстового поиска по словам, а не для точного совпадения. Подходит для поиска товаров по названию и описанию.

  ```js
  db.products.createIndex({
    title: 'text',
    description: 'text',
  });
  ```

  Пример запроса:

  ```js
  db.products.find({
    $text: { $search: 'wireless headphones' },
  });
  ```

  **Hash index**

  Оптимизирован для точного equality lookup, но обычно не подходит для range queries и сортировки.

  Пример: быстрый поиск cart/session по token-like значению.

  ```js
  db.sessions.createIndex({ token: 'hashed' });
  ```

  Такой индекс полезен для:

  ```js
  db.sessions.findOne({ token });
  ```

  Но он не поможет для запроса вроде `createdAt > ...`.

  **Multikey index**

  В MongoDB создается, когда индексируемое поле — массив. Полезен для поиска документов по элементам массива.

  Пример: товары имеют массив tags.

  ```js
  db.products.createIndex({ tags: 1 });
  ```

  Запрос:

  ```js
  db.products.find({ tags: 'sale' });
  ```

  **TTL index**

  Автоматически удаляет документы после определенного времени. Полезен для временных данных.

  Пример: удалить password reset tokens через 1 час.

  ```js
  db.passwordResetTokens.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }
  );
  ```

  **Geospatial index**

  Используется для запросов по координатам. В интернет-магазине может пригодиться для поиска ближайших pickup points или stores.

  ```js
  db.pickupPoints.createIndex({ location: '2dsphere' });
  ```

  Пример: найти пункты выдачи рядом с пользователем.

  ```js
  db.pickupPoints.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [27.56, 53.9] },
        $maxDistance: 5000,
      },
    },
  });
  ```

  **Covering index**

  Это не отдельный физический тип, а ситуация, когда index содержит все поля, нужные запросу. Тогда база может ответить из index без чтения полного документа/строки.

  Пример: список заказов в профиле показывает только `userId`, `status`, `createdAt`, `total`.

  ```js
  db.orders.createIndex({
    userId: 1,
    status: 1,
    createdAt: -1,
    total: 1,
  });
  ```

  Если query выбирает только эти поля, база может использовать index особенно эффективно.

  Практическое правило: для интернет-магазина чаще всего нужны индексы на `users.email`, `products.category`, `products.price`, `products.title/description` для поиска, `orders.userId + createdAt`, `orders.status`, а также unique indexes для email и других бизнес-уникальных полей. После добавления индекса нужно проверять `explain()`, чтобы убедиться, что запрос действительно его использует.

- What are the disadvantages of indexes?

  **Ответ:** Индексы занимают место, замедляют `INSERT`, `UPDATE`, `DELETE`, требуют обслуживания и могут быть бесполезны при низкой селективности. Избыточные индексы усложняют query planner и увеличивают storage cost.

- What is a CHECK constraint?

  **Ответ:** `CHECK` задает условие, которому должна соответствовать строка. Он полезен для бизнес-правил, которые можно выразить на уровне одной строки.

  ```sql
  ALTER TABLE products
  ADD CONSTRAINT products_price_positive CHECK (price >= 0);
  ```

- What is a trigger?

  **Ответ:** Trigger — это database mechanism, который автоматически запускает заданную логику при событии в таблице: `INSERT`, `UPDATE`, `DELETE`, иногда `TRUNCATE`. Идея в том, что часть реакции на изменение данных живет прямо в базе, а не только в application code.

  Триггер отвечает на вопрос: "что база должна автоматически сделать, когда в этой таблице изменились данные?"

  Частые сценарии:

  - audit log: записать, кто и когда изменил заказ;
  - автоматически обновить `updated_at`;
  - запретить сложное изменение, которое неудобно выразить через `CHECK`;
  - сохранить историю изменений цены товара;
  - обновить denormalized/derived данные;
  - синхронизировать related table;
  - реализовать soft business rule на уровне базы.

  Основные варианты:

  - `BEFORE INSERT` — перед добавлением строки;
  - `AFTER INSERT` — после добавления строки;
  - `BEFORE UPDATE` — перед обновлением;
  - `AFTER UPDATE` — после обновления;
  - `BEFORE DELETE` — перед удалением;
  - `AFTER DELETE` — после удаления;
  - `INSTEAD OF` — вместо операции, чаще для views;
  - row-level trigger — срабатывает для каждой строки;
  - statement-level trigger — срабатывает один раз на весь SQL statement.

  Пример 1: автоматически обновлять `updated_at` у товара в PostgreSQL.

  Сначала создается trigger function:

  ```sql
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

  Затем эта функция привязывается к таблице через trigger:

  ```sql
  CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
  ```

  Теперь при любом:

  ```sql
  UPDATE products
  SET price = 120
  WHERE id = 10;
  ```

  база сама обновит `updated_at`.

  Пример 2: писать историю изменения цены товара.

  ```sql
  CREATE TABLE product_price_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    old_price NUMERIC NOT NULL,
    new_price NUMERIC NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  ```

  Trigger function:

  ```sql
  CREATE OR REPLACE FUNCTION log_product_price_change()
  RETURNS TRIGGER AS $$
  BEGIN
    IF OLD.price IS DISTINCT FROM NEW.price THEN
      INSERT INTO product_price_history (product_id, old_price, new_price)
      VALUES (OLD.id, OLD.price, NEW.price);
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

  Trigger:

  ```sql
  CREATE TRIGGER products_price_history
  AFTER UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION log_product_price_change();
  ```

  Здесь `OLD` — старая версия строки, `NEW` — новая версия строки.

  Как пользоваться триггерами на практике:

  1. Понять событие: `INSERT`, `UPDATE`, `DELETE`.
  2. Выбрать момент: `BEFORE` или `AFTER`.
  3. Выбрать уровень: для каждой строки или один раз на statement.
  4. Написать trigger function.
  5. Создать trigger на нужной таблице.
  6. Проверить поведение на тестовых данных.
  7. Документировать trigger, потому что side effect не виден из application code.

  Когда лучше использовать trigger:

  - правило должно гарантироваться независимо от приложения;
  - несколько сервисов пишут в одну базу;
  - нужно audit/history на уровне базы;
  - значение должно поддерживаться консистентно при любом изменении данных.

  Когда лучше не использовать:

  - бизнес-логика сложная и активно меняется;
  - side effects должны быть явно видны в коде приложения;
  - trigger делает внешние вызовы или тяжелые операции;
  - из-за trigger трудно понять, почему изменилась другая таблица;
  - логика лучше выражается через `CHECK`, foreign key, default value или application service.

  Главный риск trigger-ов — скрытые side effects. Разработчик может выполнить простой `UPDATE products`, а база дополнительно изменит `updated_at`, запишет историю, обновит related table и повлияет на performance. Поэтому trigger должен быть простым, хорошо названным, покрытым миграцией и понятным команде.

- What types of triggers exist?

  **Ответ:** Триггеры бывают `BEFORE`, `AFTER`, `INSTEAD OF`; row-level и statement-level; для `INSERT`, `UPDATE`, `DELETE`. Набор возможностей зависит от СУБД.

- How can inserted or updated rows be accessed inside a trigger?

  **Ответ:** В PostgreSQL row-level trigger использует `NEW` для новой версии строки и `OLD` для старой. В SQL Server используются pseudo-tables `inserted` и `deleted`. В MySQL доступны `NEW.column` и `OLD.column`.

- At which stages can a trigger execute?

  **Ответ:** Обычно trigger может выполниться до операции (`BEFORE`), после операции (`AFTER`) или вместо операции (`INSTEAD OF`, чаще для views). Stage выбирают по цели: validation до записи, audit после записи, custom write logic вместо стандартной операции.

- How can triggers be disabled and enabled?

  **Ответ:** Синтаксис зависит от СУБД. В PostgreSQL можно использовать `ALTER TABLE ... DISABLE TRIGGER` и `ENABLE TRIGGER`. В production это нужно делать осторожно, потому что можно временно отключить важные правила целостности.

  ```sql
  ALTER TABLE orders DISABLE TRIGGER orders_audit_trigger;
  ALTER TABLE orders ENABLE TRIGGER orders_audit_trigger;
  ```

- What is the purpose of INSTEAD OF triggers?

  **Ответ:** `INSTEAD OF` trigger выполняется вместо исходной операции. Он часто используется для writable views: приложение делает `INSERT` или `UPDATE` во view, а trigger сам раскладывает изменения по базовым таблицам.

- What is a migration?

  **Ответ:** Migration — это версионированное изменение базы данных, которое хранится в коде проекта и выполняется в определенном порядке. Простыми словами, migration — это "коммит для базы": она описывает, как перевести базу из старого состояния в новое.

  Миграции нужны, потому что база живет дольше одного запуска приложения. Если сегодня приложение ожидает поле `orders.status`, а в production базе этого поля нет, код начнет падать или работать неправильно. Migration делает изменение схемы/данных повторяемым и контролируемым.

  Что может делать migration:

  - создать таблицу/коллекцию;
  - добавить колонку/поле;
  - удалить или переименовать колонку;
  - создать index;
  - добавить constraint;
  - перенести или пересчитать данные;
  - заполнить default values для старых записей;
  - изменить тип данных;
  - создать trigger/function/view.

  Пример SQL migration для интернет-магазина: добавить статус заказа.

  ```sql
  ALTER TABLE orders
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

  CREATE INDEX orders_status_idx ON orders (status);
  ```

  После такой migration приложение может безопасно делать:

  ```sql
  SELECT *
  FROM orders
  WHERE status = 'paid';
  ```

  Пример MongoDB migration: добавить поле `isActive` старым товарам.

  ```js
  await db.collection('products').updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );
  ```

  Это data migration: она меняет существующие документы, чтобы они соответствовали новой версии приложения.

  Часто migration имеет две функции:

  ```js
  export async function up(db) {
    await db.collection('products').createIndex({ category: 1, price: 1 });
  }

  export async function down(db) {
    await db.collection('products').dropIndex('category_1_price_1');
  }
  ```

  - `up` применяет изменение;
  - `down` откатывает изменение, если rollback возможен.

  Пример из интернет-магазина:

  1. Сначала была модель товара:

     ```js
     {
       title: 'Laptop',
       price: 1200
     }
     ```

  2. Потом бизнесу понадобились категории:

     ```js
     {
       title: 'Laptop',
       price: 1200,
       category: 'electronics'
     }
     ```

  3. Нужно:
     - обновить backend model;
     - обновить frontend form;
     - добавить поле старым товарам;
     - создать index по `category`, если товары часто фильтруются по категории.

  Migration как раз фиксирует database part этого изменения.

  Хорошие практики:

  - миграции должны лежать в repository рядом с кодом;
  - каждая migration должна иметь уникальное имя/номер/timestamp;
  - migrations должны выполняться один раз и в правильном порядке;
  - migration tool обычно хранит служебную таблицу/коллекцию с уже примененными migrations;
  - destructive changes лучше делать staged: сначала добавить новое поле, потом перевести код, потом удалить старое поле;
  - перед production migration нужен backup;
  - большие data migrations лучше выполнять batch-ами, чтобы не заблокировать базу;
  - rollback нужно продумывать заранее, но не все изменения можно безопасно откатить автоматически.

  Важно: migration — это не просто SQL-файл. Это часть release process. Код приложения и состояние базы должны развиваться согласованно, иначе одна версия будет ожидать данные, которых еще нет, или перестанет понимать старые данные.

- What is the difference between migrations in SQL and NoSQL databases?

  **Ответ:** В SQL migrations чаще меняют строгую схему: tables, columns, constraints, indexes. В NoSQL схема может быть гибкой, поэтому migrations часто обновляют документы, добавляют новые поля, пересчитывают embedded structures или создают indexes. Но discipline версионирования все равно нужна.

- Why is rollback needed in migrations?

  **Ответ:** Rollback нужен, чтобы откатить неудачное изменение схемы или данных. На практике не все migrations безопасно откатываются автоматически, особенно destructive migrations. Поэтому важны backups, backward-compatible changes и staged rollout.

- How do migration systems determine which migrations have already been executed?

  **Ответ:** Migration tools хранят служебную таблицу или коллекцию с именами/версиями выполненных migrations, timestamp и иногда checksum. Перед запуском tool сравнивает файлы migrations с этой таблицей и выполняет только новые.

- What tools exist for automatic migration generation?

  **Ответ:** Для SQL часто используют Prisma Migrate, TypeORM migrations, Sequelize CLI, Knex migrations, Flyway, Liquibase, Alembic, Rails migrations. Automatic generation сравнивает model/schema definitions с текущей схемой, но результат все равно нужно review-ить.

  **Пример с Prisma**

  В Prisma source of truth — файл `schema.prisma`. Допустим, в интернет-магазине нужно добавить `status` к заказу.

  Было:

  ```prisma
  model Order {
    id        Int      @id @default(autoincrement())
    userId    Int
    total     Decimal
    createdAt DateTime @default(now())
  }
  ```

  Стало:

  ```prisma
  model Order {
    id        Int      @id @default(autoincrement())
    userId    Int
    total     Decimal
    status    String   @default("pending")
    createdAt DateTime @default(now())
  }
  ```

  После изменения модели запускают:

  ```bash
  npx prisma migrate dev --name add_order_status
  ```

  Prisma сравнит новую Prisma schema с текущим состоянием базы, создаст migration folder и сгенерирует SQL примерно такого вида:

  ```sql
  ALTER TABLE "Order"
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';
  ```

  Обычно структура выглядит так:

  ```txt
  prisma/
  └── migrations/
      └── 20260528143000_add_order_status/
          └── migration.sql
  ```

  В production обычно используют:

  ```bash
  npx prisma migrate deploy
  ```

  `migrate deploy` применяет уже созданные migrations, но не генерирует новые.

  **Пример с TypeORM**

  В TypeORM source of truth часто entity classes. Например, есть `Order` entity.

  Было:

  ```ts
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column('decimal')
    total!: string;
  }
  ```

  Добавляем поле:

  ```ts
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column('decimal')
    total!: string;

    @Column({ default: 'pending' })
    status!: string;
  }
  ```

  Затем генерируем migration:

  ```bash
  npx typeorm-ts-node-commonjs migration:generate src/database/migrations/AddOrderStatus -d src/data-source.ts
  ```

  TypeORM сравнит entities с текущей схемой базы и создаст migration class примерно такого вида:

  ```ts
  import { MigrationInterface, QueryRunner } from 'typeorm';

  export class AddOrderStatus1716900000000 implements MigrationInterface {
    name = 'AddOrderStatus1716900000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "orders" ADD "status" character varying NOT NULL DEFAULT 'pending'`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "orders" DROP COLUMN "status"`
      );
    }
  }
  ```

  Потом migration применяют:

  ```bash
  npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
  ```

  Важный момент: automatic migration generation ускоряет работу, но не заменяет review. Особенно внимательно нужно проверять destructive changes: `DROP COLUMN`, `DROP TABLE`, изменение типа поля, unique indexes на существующих данных и большие data migrations.

- What are seeds and how do they differ from migrations?

  **Ответ:** Seeds заполняют БД начальными или тестовыми данными. Migrations меняют структуру и обязательные data transformations. Seeds могут быть environment-specific, а migrations должны быть частью обязательной истории схемы.

- How can a new required field be added to an existing table through migrations?

  **Ответ:** Безопасный путь: добавить nullable column или column с default, backfill существующие строки, затем добавить `NOT NULL`. Для больших таблиц backfill лучше делать batch-ами, чтобы не заблокировать БД надолго.

  ```sql
  ALTER TABLE users ADD COLUMN status VARCHAR(20);
  UPDATE users SET status = 'active' WHERE status IS NULL;
  ALTER TABLE users ALTER COLUMN status SET NOT NULL;
  ```

- What are database transactions?

  **Ответ:** Transaction — это группа database operations, которая выполняется как одна логическая операция. Если все шаги успешны, изменения фиксируются через `COMMIT`. Если хотя бы один шаг не удался, изменения откатываются через `ROLLBACK`.

  Пример из интернет-магазина: создание заказа обычно включает несколько действий:

  - создать запись в `orders`;
  - создать `order_items`;
  - уменьшить остатки товаров на складе;
  - очистить корзину пользователя;
  - возможно записать audit/payment event.

  Эти действия должны пройти вместе. Плохая ситуация: заказ создался, но остатки товара не уменьшились. Или остатки уменьшились, но заказ не создался. Transaction защищает от таких частично примененных изменений.

  Транзакции описывают через ACID:

  - **Atomicity** — все операции внутри transaction применяются целиком или не применяется ничего.
  - **Consistency** — transaction переводит базу из одного валидного состояния в другое, не нарушая constraints/business invariants.
  - **Isolation** — параллельные transactions не должны некорректно мешать друг другу.
  - **Durability** — после `COMMIT` данные не должны потеряться при обычном сбое процесса/сервера БД.

  Как запустить transaction в SQL:

  ```sql
  BEGIN;

  INSERT INTO orders (user_id, status, total)
  VALUES (42, 'pending', 150);

  UPDATE products
  SET stock = stock - 1
  WHERE id = 10
    AND stock > 0;

  DELETE FROM cart_items
  WHERE user_id = 42
    AND product_id = 10;

  COMMIT;
  ```

  Если между `BEGIN` и `COMMIT` произошла ошибка, нужно выполнить:

  ```sql
  ROLLBACK;
  ```

  Обычно application code делает это через `try/catch`:

  ```ts
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'INSERT INTO orders (user_id, status, total) VALUES ($1, $2, $3)',
      [userId, 'pending', total]
    );

    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
      [quantity, productId]
    );

    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  ```

  В MongoDB transaction запускается через session. Для Mongoose это может выглядеть так:

  ```ts
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const [order] = await OrderModel.create(
        [
          {
            user: userId,
            products: cartItems,
            total,
          },
        ],
        { session }
      );

      await ProductModel.updateOne(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { session }
      );

      await UserModel.updateOne(
        { _id: userId },
        { $set: { cart: { items: [] } } },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }
  ```

  Важно: в MongoDB все операции, которые должны быть частью transaction, должны получить один и тот же `session`.

  Как соблюдать ACID на практике:

  - Держать transaction короткой: не делать внутри долгие HTTP calls, file operations, email sending.
  - Все связанные database writes выполнять внутри одной transaction/session.
  - Проверять бизнес-инварианты внутри transaction, например `stock >= quantity`.
  - Использовать constraints/indexes, например foreign keys, unique indexes, `CHECK`.
  - Правильно выбирать isolation level, если есть риск race conditions.
  - Обрабатывать retries, потому что transactions могут конфликтовать и падать при concurrency.
  - Не делать внешние side effects до `COMMIT`: email, payment capture, event publish лучше делать после commit или через outbox pattern.
  - Всегда иметь rollback/error handling.

  Хорошая mental model: transaction — это защитная граница вокруг группы изменений. Пока transaction не закоммичена, изменения считаются provisional. После `COMMIT` они становятся постоянной частью состояния базы.

- In which scenarios are transactions used?

  **Ответ:** Transactions нужны при изменении нескольких связанных записей: создание заказа и списание остатков, перевод денег, запись audit log вместе с основным изменением, обновление нескольких таблиц с инвариантами целостности.

- What types of transactions and isolation levels exist?

  **Ответ:** Transactions можно рассматривать по нескольким признакам: read-only/read-write, short/long-running, single-statement/multi-statement, local/distributed. Но чаще всего под "types of transactions" на интервью имеют в виду **isolation levels** — уровни изоляции между параллельными transactions.

  Isolation level определяет, насколько одна transaction видит изменения другой transaction и какие concurrency anomalies возможны.

  Основные уровни:

  - **Read Uncommitted** — самый слабый уровень, теоретически может читать uncommitted данные другой transaction.
  - **Read Committed** — читает только committed данные, но повторный `SELECT` может вернуть другой результат.
  - **Repeatable Read** — повторное чтение уже прочитанных данных внутри transaction дает стабильный результат.
  - **Serializable** — самый строгий уровень, результат должен быть как будто transactions выполнялись по очереди.

  Какие проблемы они решают:

  - **Dirty read** — transaction читает данные, которые другая transaction еще не закоммитила.
  - **Non-repeatable read** — повторное чтение той же строки дает другое значение.
  - **Phantom read** — повторный запрос по условию возвращает новые строки, добавленные другой transaction.
  - **Serialization anomaly** — набор параллельных transactions приводит к результату, невозможному при последовательном выполнении.

  Как установить isolation level в SQL:

  ```sql
  BEGIN;
  SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

  -- queries

  COMMIT;
  ```

  Для более строгого уровня:

  ```sql
  BEGIN;
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- critical queries

  COMMIT;
  ```

  В PostgreSQL можно сразу начать transaction с нужным уровнем:

  ```sql
  BEGIN ISOLATION LEVEL REPEATABLE READ;

  SELECT *
  FROM products
  WHERE category = 'electronics';

  COMMIT;
  ```

  Или:

  ```sql
  BEGIN ISOLATION LEVEL SERIALIZABLE;

  UPDATE products
  SET stock = stock - 1
  WHERE id = 10
    AND stock >= 1;

  COMMIT;
  ```

  В MySQL часто используют:

  ```sql
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  START TRANSACTION;

  SELECT *
  FROM orders
  WHERE user_id = 42;

  COMMIT;
  ```

  Можно установить default isolation level для session:

  ```sql
  SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
  ```

  Или global default, если есть права администратора:

  ```sql
  SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
  ```

  Пример в Node.js с PostgreSQL:

  ```ts
  const client = await pool.connect();

  try {
    await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');

    const result = await client.query(
      `
      UPDATE products
      SET stock = stock - $1
      WHERE id = $2
        AND stock >= $1
      RETURNING id, stock
      `,
      [quantity, productId]
    );

    if (result.rowCount === 0) {
      throw new Error('Not enough stock');
    }

    await client.query(
      'INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3)',
      [userId, productId, quantity]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  ```

  На `SERIALIZABLE` база может отклонить одну из concurrent transactions с serialization error. Это нормальное поведение: приложение должно повторить transaction или вернуть корректную ошибку.

  Как выбирать уровень на практике:

  - Для большинства web requests часто достаточно default уровня СУБД, например `Read Committed` в PostgreSQL.
  - Для отчетов, где нужен стабильный snapshot данных, подходит `Repeatable Read`.
  - Для критичных операций с инвариантами можно использовать `Serializable`, row locks или atomic conditional updates.
  - Чем выше isolation level, тем больше overhead, lock contention и вероятность retries.

  Важно: высокий isolation level не заменяет правильные constraints и атомарные updates. Например для остатков товара лучше использовать `UPDATE ... WHERE stock >= quantity` и проверять `rowCount`, а isolation level выбирать как дополнительную защиту под конкретный сценарий.

- What is Read Committed isolation level?

  **Ответ:** `Read Committed` позволяет читать только committed данные. Он предотвращает dirty reads, но повторное чтение той же строки в одной transaction может вернуть другое значение, если другая transaction успела commit.

- What is Repeatable Read isolation level?

  **Ответ:** `Repeatable Read` гарантирует, что повторное чтение уже прочитанных строк в рамках transaction даст тот же результат. В разных СУБД поведение с phantom reads отличается. В PostgreSQL `Repeatable Read` основан на snapshot isolation.

- What is Serializable isolation level?

  **Ответ:** `Serializable` — самый строгий isolation level. Результат concurrent transactions должен быть эквивалентен некоторому последовательному выполнению. Это снижает concurrency и может приводить к serialization failures, которые приложение должно retry-ить.

- How can changes be rolled back to a savepoint inside a transaction?

  **Ответ:** Savepoint позволяет откатить часть transaction без полного rollback. Создается через `SAVEPOINT`, откатывается через `ROLLBACK TO SAVEPOINT`, после чего transaction может продолжиться.

  ```sql
  BEGIN;
  INSERT INTO orders (id) VALUES (1);
  SAVEPOINT before_items;
  INSERT INTO order_items (order_id, product_id) VALUES (1, 999);
  ROLLBACK TO SAVEPOINT before_items;
  COMMIT;
  ```

- What is normalization in relational databases?

  **Ответ:** Normalization — это подход к проектированию relational schema, при котором данные раскладываются по связанным таблицам так, чтобы уменьшить дублирование и избежать ошибок при `INSERT`, `UPDATE`, `DELETE`.

  Простая идея: каждый факт должен храниться в одном месте. Если имя категории, email пользователя или цена товара дублируются в десятках строк, их сложнее обновлять без ошибок.

  Плохой пример для интернет-магазина — хранить всё в одной таблице заказов:

  ```txt
  orders_flat
  ├── order_id
  ├── user_name
  ├── user_email
  ├── product_title
  ├── product_category
  ├── product_price
  ├── quantity
  └── order_date
  ```

  Проблемы:

  - email пользователя дублируется в каждом заказе;
  - название категории повторяется у каждого товара;
  - если товар в заказе один, структура работает, а если товаров несколько — появляются повторяющиеся колонки или дубли строк;
  - если пользователь поменял email, нужно обновлять много строк;
  - если удалили последний заказ пользователя, можно случайно потерять информацию о пользователе;
  - легко получить inconsistent data: один и тот же товар в разных строках с разной категорией.

  Нормализованный вариант:

  ```txt
  users
  ├── id
  ├── name
  └── email

  categories
  ├── id
  └── name

  products
  ├── id
  ├── title
  ├── price
  └── category_id

  orders
  ├── id
  ├── user_id
  ├── status
  └── created_at

  order_items
  ├── id
  ├── order_id
  ├── product_id
  ├── quantity
  └── unit_price
  ```

  Связи:

  ```sql
  products.category_id -> categories.id
  orders.user_id -> users.id
  order_items.order_id -> orders.id
  order_items.product_id -> products.id
  ```

  Теперь:

  - пользователь хранится один раз в `users`;
  - категория хранится один раз в `categories`;
  - заказ хранит общую информацию в `orders`;
  - товары заказа лежат отдельно в `order_items`;
  - один заказ может иметь много товаров;
  - один товар может встречаться во многих заказах.

  Пример запроса для получения заказа:

  ```sql
  SELECT
    orders.id,
    users.email,
    products.title,
    order_items.quantity,
    order_items.unit_price
  FROM orders
  JOIN users ON users.id = orders.user_id
  JOIN order_items ON order_items.order_id = orders.id
  JOIN products ON products.id = order_items.product_id
  WHERE orders.id = 123;
  ```

  Основные normal forms на простом уровне:

  - **1NF** — в ячейках должны быть atomic values, а не списки. Например, не хранить `product_ids = "1,2,3"` в `orders`; лучше использовать `order_items`.
  - **2NF** — не хранить данные, которые зависят только от части composite key. Например, если `order_items` имеет key `(order_id, product_id)`, то `product_title` зависит от `product_id`, а не от всей строки заказа, поэтому ему место в `products`.
  - **3NF** — не хранить данные, которые зависят от другого non-key поля. Например, `category_name` не стоит хранить в `products`, если есть `category_id` и таблица `categories`.

  Какие anomalies предотвращает normalization:

  - **Update anomaly:** поменяли название категории в одном месте, но забыли в другом.
  - **Insert anomaly:** нельзя добавить категорию, пока нет товара этой категории.
  - **Delete anomaly:** удалили последний товар категории и потеряли саму категорию.

  Важно: в реальных системах иногда данные денормализуют осознанно. Например, `order_items.unit_price` часто сохраняют отдельно, хотя цена есть в `products.price`. Это нужно, чтобы старый заказ сохранил цену покупки, даже если текущая цена товара потом изменилась. Это не ошибка, а осознанная snapshot-денормализация бизнес-факта.

  Хорошая схема обычно начинается с normalization для целостности данных, а denormalization добавляют позже точечно, когда есть понятная причина: performance, reporting, caching или сохранение historical snapshot.

- What is denormalization?

  **Ответ:** Denormalization — осознанное добавление дублирования или precomputed данных ради производительности чтения. Например, хранить `order_total` в таблице orders, хотя его можно вычислить из order_items.

- Why are normalization and denormalization important in database design?

  **Ответ:** Normalization защищает целостность и упрощает обновления. Denormalization ускоряет чтение и упрощает некоторые запросы. Хороший дизайн выбирает баланс под реальные access patterns.

- What are the First, Second, and Third Normal Forms (1NF, 2NF, 3NF)?

  **Ответ:** 1NF, 2NF и 3NF — это правила проектирования relational tables. Их не "включают" отдельной SQL-командой. Их соблюдают через структуру таблиц: primary keys, foreign keys, отдельные таблицы для отдельных сущностей и отсутствие лишнего дублирования.

  **1NF — First Normal Form**

  Таблица находится в 1NF, если:

  - в каждой ячейке одно atomic value;
  - нет списков внутри одного поля;
  - нет повторяющихся групп колонок вроде `product_1`, `product_2`, `product_3`;
  - каждая строка идентифицируется key.

  Плохой пример:

  ```txt
  orders
  ├── id
  ├── user_id
  ├── product_ids       "10,15,20"
  └── quantities        "1,2,1"
  ```

  Здесь `product_ids` и `quantities` не atomic: внутри одного поля лежит список.

  Лучше:

  ```sql
  CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL
  );

  CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
  ```

  Теперь каждый товар заказа — отдельная строка в `order_items`.

  **2NF — Second Normal Form**

  2NF актуальна, когда у таблицы composite key, то есть primary key состоит из нескольких колонок. Правило: все non-key поля должны зависеть от всего ключа целиком, а не только от его части.

  Плохой пример:

  ```txt
  order_items
  primary key: (order_id, product_id)

  ├── order_id
  ├── product_id
  ├── product_title
  ├── quantity
  └── unit_price
  ```

  `quantity` зависит от пары `(order_id, product_id)`: в конкретном заказе конкретный товар имеет конкретное количество.

  Но `product_title` зависит только от `product_id`, а не от всего composite key. Значит это нарушение 2NF.

  Лучше вынести товарные данные в `products`:

  ```sql
  CREATE TABLE products (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL
  );

  CREATE TABLE order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
  ```

  Здесь `title` лежит в `products`, потому что это свойство продукта. А `quantity` и `unit_price` лежат в `order_items`, потому что это свойства строки конкретного заказа.

  Нюанс: `unit_price` можно оставить в `order_items`, хотя цена есть в `products.current_price`. Это business snapshot: заказ должен помнить цену на момент покупки.

  **3NF — Third Normal Form**

  3NF требует, чтобы non-key поля зависели только от key, а не от других non-key полей. Это убирает transitive dependency.

  Плохой пример:

  ```txt
  products
  ├── id
  ├── title
  ├── category_id
  └── category_name
  ```

  `category_name` зависит не от `products.id`, а от `category_id`. Значит категория должна быть отдельной таблицей.

  Лучше:

  ```sql
  CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE products (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
  ```

  Теперь название категории хранится один раз в `categories`. Если категорию переименовали, нужно изменить одну строку, а не все товары этой категории.

  Полный пример нормализованной схемы интернет-магазина:

  ```sql
  CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE products (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
  ```

  Как понять, что формы соблюдаются:

  - 1NF: нет массивов/списков в одной ячейке, повторяющиеся элементы вынесены в отдельные строки.
  - 2NF: в таблице с composite key каждое non-key поле зависит от всего ключа.
  - 3NF: non-key поля не описывают другие non-key поля, такие данные вынесены в отдельную таблицу.

  Короткая формула:

  ```txt
  1NF: одно значение в одной ячейке
  2NF: non-key поля зависят от всего ключа
  3NF: non-key поля зависят только от ключа
  ```

- How do normalization and denormalization affect data integrity and performance?

  **Ответ:** Normalization повышает integrity и снижает дублирование, но может требовать больше joins. Denormalization уменьшает количество joins и ускоряет чтение, но создает риск рассинхронизации дублированных данных.

- What are the trade-offs between normalization and denormalization?

  **Ответ:** Trade-off в том, что normalization делает запись и поддержку целостности проще, а denormalization делает некоторые чтения быстрее. Denormalized данные требуют механизмов синхронизации: transactions, triggers, application logic, jobs или materialized views.

- What is the difference between vertical and horizontal database scaling?

  **Ответ:** Vertical scaling — увеличить ресурсы одного сервера: CPU, RAM, disk. Horizontal scaling — добавить больше узлов и распределить нагрузку или данные между ними. Vertical проще, но имеет предел; horizontal сложнее, но лучше масштабируется.

- What is a database backup?

  **Ответ:** Backup — копия данных и/или журналов изменений, которая позволяет восстановить БД после ошибки, удаления данных, corruption или disaster. Backup должен быть проверяемым: непроверенный backup нельзя считать надежным.

- How can backups be created in SQL databases?

  **Ответ:** Способы: logical dump (`pg_dump`, `mysqldump`), physical backup файлов БД, snapshots на уровне storage, continuous archiving/WAL, managed cloud backups. Выбор зависит от размера БД и требований к RPO/RTO.

- What backup strategies and best practices exist?

  **Ответ:** Практики: full/incremental backups, point-in-time recovery, offsite storage, encryption, retention policy, регулярные restore drills, monitoring backup jobs и принцип 3-2-1: три копии, два типа носителей, одна копия вне основной среды.

- What backup tools are commonly used?

  **Ответ:** Для PostgreSQL: `pg_dump`, `pg_basebackup`, WAL archiving, pgBackRest, Barman. Для MySQL: `mysqldump`, MySQL Enterprise Backup, Percona XtraBackup. В cloud часто используют managed snapshots и automated backups.

- What is database replication?

  **Ответ:** Replication — копирование данных с одного узла БД на другой. Она может быть synchronous или asynchronous и используется для availability, read scaling, disaster recovery и географического распределения.

- Why is replication used?

  **Ответ:** Replication повышает отказоустойчивость, позволяет читать с replicas, уменьшает latency для разных регионов и помогает восстановиться после сбоя primary node. Но она добавляет lag и сложность consistency.

- What types of replication exist?

  **Ответ:** Встречаются primary-replica, multi-primary, logical replication, physical replication, synchronous/asynchronous replication, snapshot и transactional replication. Конкретная терминология зависит от СУБД.

- What is the difference between Snapshot Replication and Transactional Replication?

  **Ответ:** Snapshot replication периодически копирует полный снимок данных. Transactional replication передает изменения почти по мере их появления, используя log/transaction stream. Snapshot проще, но тяжелее и менее realtime; transactional сложнее, но дает меньший lag.

- What is database sharding?

  **Ответ:** Sharding — горизонтальное разделение данных на части, где каждый shard хранит подмножество строк/документов. Например, users можно распределить по `user_id`. Это позволяет масштабировать storage и write/read нагрузку.

- How is sharding implemented in practice?

  **Ответ:** Нужно выбрать shard key, shard map/routing, стратегию rebalancing, способ выполнения cross-shard запросов и transaction policy. Routing может делать приложение, proxy/router или сама БД.

- What types of sharding exist?

  **Ответ:** Основные типы: range-based, hash-based, directory-based, geo-based и composite sharding. Также бывает tenant-based sharding для multi-tenant систем.

- What are the differences between sharding strategies?

  **Ответ:** Range sharding удобен для range queries, но может давать hot shards. Hash sharding лучше распределяет нагрузку, но усложняет range queries. Directory-based гибкий, но требует надежного metadata service. Geo sharding снижает latency в регионах, но усложняет consistency.

- Which databases support sharding out of the box?

  **Ответ:** Примеры: MongoDB, Cassandra, CockroachDB, YugabyteDB, Google Spanner, Azure Cosmos DB. В PostgreSQL шардирование часто делают через extensions вроде Citus или через application-level partitioning; MySQL часто шардируют на уровне приложения/proxy или через Vitess.

- What are NoSQL databases?

  **Ответ:** NoSQL databases — нереляционные БД, которые обычно не используют строгую табличную модель SQL. Они оптимизированы под разные модели данных: documents, key-value, wide-column, graph, time-series. NoSQL не означает отсутствие запросов, а означает альтернативу классической relational model.

- What types of NoSQL databases exist?

  **Ответ:** Основные типы: document-oriented, key-value, wide-column, graph, time-series и search engines. Примеры: MongoDB — document, Redis — key-value, Cassandra — wide-column, Neo4j — graph, InfluxDB — time-series, Elasticsearch — search.

- What are the advantages of NoSQL databases compared to relational databases?

  **Ответ:** NoSQL часто дает гибкую схему, горизонтальное масштабирование, удобную модель для вложенных данных, высокую write throughput и проще хранит агрегаты как документы. Но это может стоить weaker consistency, отсутствия joins или сложной аналитики.

- What is the difference between document-oriented and key-value databases?

  **Ответ:** Document DB хранит структурированные документы и обычно умеет индексировать/запрашивать поля внутри документа. Key-value DB хранит значение по ключу и чаще воспринимает value как opaque blob или простую структуру. MongoDB — document DB, Redis — key-value store.

- Does MongoDB support ACID transactions and locking?

  **Ответ:** Да. MongoDB поддерживает ACID transactions, включая multi-document transactions в replica sets и sharded clusters. Также MongoDB использует locking/concurrency control на уровне storage engine; современный WiredTiger применяет document-level concurrency control и MVCC-подобные механизмы.

- What are the advantages of BSON over JSON in MongoDB?

  **Ответ:** BSON — binary serialization format. Он поддерживает дополнительные типы, например `ObjectId`, `Date`, binary data, decimal, int32/int64. BSON быстрее парсится в некоторых сценариях, хранит type metadata и оптимизирован для internal storage/query processing MongoDB.

- How does normalization differ in NoSQL databases?

  **Ответ:** В NoSQL normalization не является универсальной целью. Данные часто моделируют вокруг access patterns: то, что читается вместе, хранится вместе. Вместо строгого разделения сущностей часто используют embedded documents и controlled duplication.

- What is denormalization in NoSQL?

  **Ответ:** Denormalization в NoSQL — хранение связанных или дублированных данных внутри одного документа/partition для быстрого чтения. Например, в order document хранить snapshot названия товара и цены на момент покупки.

- How are relationships implemented in MongoDB?

  **Ответ:** Связи делают через embedded documents или references. Embedded подходит для данных, которые живут и читаются вместе. References используют, когда связанная сущность большая, часто обновляется отдельно или имеет many-to-many/large cardinality.

  ```js
  {
    _id: ObjectId("..."),
    email: "user@example.com",
    addresses: [{ city: "Warsaw", street: "Main" }]
  }
  ```

- When should embedded documents be used instead of references?

  **Ответ:** Embedded documents стоит использовать, когда данные имеют сильную ownership-связь, небольшой размер, читаются вместе и не требуют независимой частой модификации. Не стоит embed-ить бесконечно растущие массивы или данные, которые часто меняются независимо.

- What is a graph database?

  **Ответ:** Graph database — это база данных, где основная модель данных строится вокруг связей. Данные хранятся как граф:

  - **nodes** — сущности;
  - **edges/relationships** — связи между сущностями;
  - **properties** — поля у nodes и edges.

  В relational database связь часто выражается через foreign key и `JOIN`. В graph database связь сама является полноценной частью модели, по которой можно быстро ходить: от пользователя к друзьям, от товара к похожим товарам, от карты к транзакциям, от сотрудника к permissions.

  Простой пример:

  ```txt
  (User:Alex)-[:FRIENDS_WITH]->(User:Maria)
  (User:Alex)-[:PURCHASED]->(Product:Laptop)
  (Product:Laptop)-[:BELONGS_TO]->(Category:Electronics)
  ```

  У nodes могут быть properties:

  ```txt
  User {
    id: 42,
    email: "alex@example.com",
    city: "Warsaw"
  }
  ```

  У edges тоже могут быть properties:

  ```txt
  PURCHASED {
    quantity: 1,
    price: 1200,
    purchasedAt: "2026-05-29"
  }
  ```

  Что хранится в graph databases в реальной жизни:

  - **Социальные сети:** пользователи, друзья, подписки, лайки, группы, общие знакомые.
  - **Рекомендательные системы:** пользователь купил товар, товар похож на другой товар, пользователи с похожим поведением покупали похожие товары.
  - **Fraud detection:** аккаунты, карты, телефоны, адреса, устройства, IP, транзакции и подозрительные цепочки связей.
  - **Маршруты и логистика:** города, склады, дороги, расстояния, стоимость доставки, оптимальные пути.
  - **Access control:** users, roles, groups, permissions, resources и наследование прав.
  - **Knowledge graph:** люди, компании, статьи, технологии, события и смысловые связи между ними.
  - **Network topology:** servers, routers, services, dependencies, incidents.
  - **Dependency analysis:** packages, modules, services и связи "зависит от".

  Пример из интернет-магазина:

  ```txt
  (User)-[:VIEWED]->(Product)
  (User)-[:ADDED_TO_CART]->(Product)
  (User)-[:PURCHASED]->(Product)
  (Product)-[:SIMILAR_TO]->(Product)
  (Product)-[:BELONGS_TO]->(Category)
  (User)-[:LIVES_IN]->(City)
  ```

  На такой модели удобно отвечать на вопросы:

  - какие товары часто покупают вместе;
  - что рекомендовать пользователю на основе похожих пользователей;
  - есть ли подозрительная связь между несколькими аккаунтами и одной картой;
  - какие товары связаны с категорией через несколько уровней;
  - какие пользователи имеют доступ к определенному ресурсу через group/role hierarchy.

  Пример Cypher-запроса в Neo4j: найти товары, которые покупали пользователи, купившие тот же товар, что и текущий пользователь.

  ```cypher
  MATCH (u:User {id: 42})-[:PURCHASED]->(p:Product)<-[:PURCHASED]-(other:User)
  MATCH (other)-[:PURCHASED]->(recommendation:Product)
  WHERE NOT (u)-[:PURCHASED]->(recommendation)
  RETURN recommendation, COUNT(*) AS score
  ORDER BY score DESC
  LIMIT 10;
  ```

  Graph database особенно полезна, когда главный вопрос не "найди строку по id", а "найди связи и пути между сущностями". Если приложение постоянно делает много JOIN-ов, рекурсивные запросы или анализ цепочек связей, graph model может быть естественнее и быстрее.

- What are nodes and edges in graph databases?

  **Ответ:** Node — сущность, например User, Product, Company. Edge — связь между nodes, например `FRIENDS_WITH`, `PURCHASED`, `WORKS_AT`. И nodes, и edges могут иметь properties.

- What are common use cases for graph databases?

  **Ответ:** Graph DB полезны для social graphs, recommendation systems, fraud detection, network topology, knowledge graphs, access control graphs и dependency analysis.

- How do MIN and MAX functions work in SQL?

  **Ответ:** `MIN()` возвращает минимальное значение в группе или всей выборке, `MAX()` — максимальное. `NULL` значения обычно игнорируются aggregate-функциями.

  ```sql
  SELECT MIN(price), MAX(price)
  FROM products;
  ```

- How does the IN operator work?

  **Ответ:** `IN` проверяет, входит ли значение в список или результат subquery. Он удобен для фильтра по нескольким допустимым значениям.

  ```sql
  SELECT *
  FROM orders
  WHERE status IN ('paid', 'shipped');
  ```

- How does the LIKE operator work?

  **Ответ:** `LIKE` выполняет pattern matching по строкам. `%` означает любую последовательность символов, `_` — один символ. Case sensitivity зависит от СУБД, collation и оператора.

  ```sql
  SELECT *
  FROM users
  WHERE email LIKE '%@example.com';
  ```

- How does BETWEEN work?

  **Ответ:** `BETWEEN` проверяет, находится ли значение между двумя границами включительно. Эквивалентно `value >= low AND value <= high`.

  ```sql
  SELECT *
  FROM products
  WHERE price BETWEEN 10 AND 100;
  ```

- How does EXISTS work?

  **Ответ:** `EXISTS` проверяет, возвращает ли subquery хотя бы одну строку. Он часто эффективен для проверки наличия связанных данных, потому что СУБД может остановиться после первой найденной строки.

  ```sql
  SELECT *
  FROM users u
  WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
  );
  ```

- How do LIMIT and OFFSET work?

  **Ответ:** `LIMIT` ограничивает количество строк, `OFFSET` пропускает первые N строк. Это удобно для pagination, но большой `OFFSET` может быть медленным. Для больших таблиц часто лучше keyset pagination.

  ```sql
  SELECT *
  FROM products
  ORDER BY id
  LIMIT 20 OFFSET 40;
  ```

- How does DISTINCT work?

  **Ответ:** `DISTINCT` удаляет дубликаты из результата по выбранным колонкам. Если выбрано несколько колонок, уникальность считается по комбинации их значений.

  ```sql
  SELECT DISTINCT status
  FROM orders;
  ```

- How does ORDER BY work?

  **Ответ:** `ORDER BY` сортирует результат по одной или нескольким колонкам или выражениям. Можно указать `ASC` или `DESC`. Для стабильной pagination стоит добавлять уникальный tie-breaker, например `ORDER BY created_at DESC, id DESC`.

- How do JOIN operations work?

  **Ответ:** `JOIN` объединяет строки из двух или больше таблиц по условию связи. Обычно это связь primary key -> foreign key.

  Пример интернет-магазина:

  ```txt
  users
  id | email
  ---|------------------
  1  | alex@example.com
  2  | maria@example.com

  orders
  id  | user_id | total
  ----|---------|------
  101 | 1       | 120
  102 | 1       | 80
  103 | 3       | 50
  ```

  Здесь `orders.user_id` должен ссылаться на `users.id`.

  **INNER JOIN**

  Возвращает только строки, где есть совпадение в обеих таблицах.

  ```sql
  SELECT
    users.email,
    orders.id AS order_id,
    orders.total
  FROM users
  INNER JOIN orders ON orders.user_id = users.id;
  ```

  Результат:

  ```txt
  alex@example.com | 101 | 120
  alex@example.com | 102 | 80
  ```

  `maria@example.com` не попадет в результат, потому что у нее нет заказов. `order 103` тоже не попадет, потому что нет пользователя с `id = 3`.

  **LEFT JOIN**

  Возвращает все строки из левой таблицы и matching строки из правой. Если справа совпадения нет, правые колонки будут `NULL`.

  ```sql
  SELECT
    users.email,
    orders.id AS order_id,
    orders.total
  FROM users
  LEFT JOIN orders ON orders.user_id = users.id;
  ```

  Результат:

  ```txt
  alex@example.com  | 101  | 120
  alex@example.com  | 102  | 80
  maria@example.com | NULL | NULL
  ```

  Это полезно, когда нужно показать всех пользователей, даже тех, у кого нет заказов.

  **RIGHT JOIN**

  Возвращает все строки из правой таблицы и matching строки из левой. Если слева совпадения нет, левые колонки будут `NULL`.

  ```sql
  SELECT
    users.email,
    orders.id AS order_id,
    orders.total
  FROM users
  RIGHT JOIN orders ON orders.user_id = users.id;
  ```

  Результат:

  ```txt
  alex@example.com | 101 | 120
  alex@example.com | 102 | 80
  NULL             | 103 | 50
  ```

  На практике `RIGHT JOIN` часто заменяют на `LEFT JOIN`, просто поменяв таблицы местами, потому что так обычно легче читать запрос.

  **FULL OUTER JOIN**

  Возвращает все строки из обеих таблиц. Где совпадение есть — объединяет. Где совпадения нет — заполняет отсутствующую сторону `NULL`.

  ```sql
  SELECT
    users.email,
    orders.id AS order_id,
    orders.total
  FROM users
  FULL OUTER JOIN orders ON orders.user_id = users.id;
  ```

  Результат:

  ```txt
  alex@example.com  | 101  | 120
  alex@example.com  | 102  | 80
  maria@example.com | NULL | NULL
  NULL              | 103  | 50
  ```

  Это полезно для поиска рассинхронизации данных, orphan records или сравнения двух наборов.

  **CROSS JOIN**

  Возвращает Cartesian product: каждая строка из первой таблицы соединяется с каждой строкой из второй.

  ```sql
  SELECT
    products.title,
    sizes.name AS size
  FROM products
  CROSS JOIN sizes;
  ```

  Если товаров 100, а размеров 5, результат будет 500 строк. Это полезно для генерации комбинаций, но опасно случайно: можно получить огромный результат.

  **SELF JOIN**

  Таблица соединяется сама с собой. Для этого используют aliases.

  Пример: категории с parent category.

  ```sql
  SELECT
    child.name AS category,
    parent.name AS parent_category
  FROM categories AS child
  LEFT JOIN categories AS parent ON child.parent_id = parent.id;
  ```

  Результат может быть таким:

  ```txt
  Laptops | Electronics
  Phones  | Electronics
  Sale    | NULL
  ```

  **JOIN нескольких таблиц**

  Получить заказ с пользователем и товарами:

  ```sql
  SELECT
    orders.id AS order_id,
    users.email,
    products.title,
    order_items.quantity,
    order_items.unit_price
  FROM orders
  JOIN users ON users.id = orders.user_id
  JOIN order_items ON order_items.order_id = orders.id
  JOIN products ON products.id = order_items.product_id
  WHERE orders.id = 101;
  ```

  В Node.js это обычный SQL query:

  ```ts
  const result = await client.query(
    `
    SELECT
      orders.id AS order_id,
      users.email,
      products.title,
      order_items.quantity,
      order_items.unit_price
    FROM orders
    JOIN users ON users.id = orders.user_id
    JOIN order_items ON order_items.order_id = orders.id
    JOIN products ON products.id = order_items.product_id
    WHERE orders.id = $1
    `,
    [orderId]
  );
  ```

  В query builder стиле это может выглядеть так:

  ```ts
  const rows = await db('orders')
    .join('users', 'users.id', 'orders.user_id')
    .join('order_items', 'order_items.order_id', 'orders.id')
    .join('products', 'products.id', 'order_items.product_id')
    .where('orders.id', orderId)
    .select(
      'orders.id as order_id',
      'users.email',
      'products.title',
      'order_items.quantity',
      'order_items.unit_price'
    );
  ```

  Важные практические правила:

  - `INNER JOIN` убирает строки без совпадения.
  - `LEFT JOIN` сохраняет все строки слева.
  - `RIGHT JOIN` сохраняет все строки справа.
  - `FULL JOIN` сохраняет все строки с обеих сторон.
  - `CROSS JOIN` создает все комбинации.
  - Условия `JOIN ... ON` должны опираться на indexed keys, иначе запрос может быть медленным.
  - Для `LEFT JOIN` фильтры по правой таблице нужно писать осторожно: `WHERE orders.status = 'paid'` может превратить результат фактически в `INNER JOIN`.
  - Query planner физически может выполнить join разными алгоритмами: nested loop, hash join, merge join.

- How do COUNT(), AVG(), and SUM() functions work?

  **Ответ:** `COUNT()` считает строки или non-null значения, `AVG()` возвращает среднее, `SUM()` — сумму. Они могут работать по всей выборке или по группам через `GROUP BY`.

  ```sql
  SELECT customer_id, COUNT(*), SUM(total)
  FROM orders
  GROUP BY customer_id;
  ```

- What are SQL aliases and how does AS work?

  **Ответ:** Alias временно переименовывает колонку или таблицу в рамках запроса. `AS` делает alias явным, хотя для таблиц и колонок часто может быть опущен.

  ```sql
  SELECT u.email AS user_email
  FROM users AS u;
  ```

- How does GROUP BY work?

  **Ответ:** `GROUP BY` объединяет строки с одинаковыми значениями указанных колонок и позволяет применять aggregate functions к каждой группе. В `SELECT` можно указывать grouped columns и aggregates.

- How does HAVING work?

  **Ответ:** `HAVING` фильтрует группы после `GROUP BY`. В отличие от `WHERE`, он может использовать aggregate functions.

  ```sql
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 5;
  ```

- What is UNION ALL?

  **Ответ:** `UNION ALL` объединяет результаты нескольких `SELECT` без удаления дубликатов. Он быстрее, чем `UNION`, потому что не делает distinct/sort для устранения повторов.

- How do ANY and ALL operators work?

  **Ответ:** `ANY` проверяет условие хотя бы для одного значения из subquery/list. `ALL` требует, чтобы условие было истинно для всех значений. Они часто используются с операторами сравнения.

  ```sql
  SELECT *
  FROM products
  WHERE price > ALL (SELECT price FROM products WHERE category = 'discount');
  ```

- How does CASE expression work?

  **Ответ:** `CASE` возвращает значение в зависимости от условий. Это SQL-аналог conditional expression, который можно использовать в `SELECT`, `ORDER BY`, `GROUP BY` и других местах.

  ```sql
  SELECT
    id,
    CASE
      WHEN total >= 100 THEN 'large'
      ELSE 'regular'
    END AS order_size
  FROM orders;
  ```

- How does JOIN ... ON work?

  **Ответ:** `JOIN ... ON` задает условие соединения таблиц. Обычно оно сравнивает primary key одной таблицы с foreign key другой, но может содержать и дополнительные условия.

  ```sql
  SELECT *
  FROM orders o
  JOIN users u ON u.id = o.user_id;
  ```

- What are subqueries and how are they used?

  **Ответ:** Subquery — запрос внутри другого запроса. Он может использоваться в `SELECT`, `FROM`, `WHERE`, `HAVING`, `EXISTS`, `IN`. Subqueries бывают scalar, row, table и correlated, когда внутренний запрос ссылается на внешний.

  ```sql
  SELECT *
  FROM products
  WHERE price > (
    SELECT AVG(price)
    FROM products
  );
  ```
