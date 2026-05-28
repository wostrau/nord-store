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

  **Ответ:** Index — структура данных, которая ускоряет поиск, сортировку, join и фильтрацию по колонкам. Чаще всего используется B-tree. Индекс похож на оглавление книги: он позволяет найти строки без полного сканирования таблицы.

- How can a constraint or rule be removed from a table?

  **Ответ:** Constraint удаляется через `ALTER TABLE ... DROP CONSTRAINT`. Синтаксис и имена constraints зависят от СУБД. Индексы обычно удаляются через `DROP INDEX`.

  ```sql
  ALTER TABLE users DROP CONSTRAINT users_email_unique;
  DROP INDEX users_email_idx;
  ```

- What types of indexes exist?

  **Ответ:** Распространенные типы: B-tree, Hash, GiST, GIN, BRIN, full-text, unique, composite, partial/filtered, covering indexes. Доступность зависит от СУБД. Например, PostgreSQL поддерживает GIN для JSONB/full-text, а B-tree подходит для большинства equality/range запросов.

- What are the disadvantages of indexes?

  **Ответ:** Индексы занимают место, замедляют `INSERT`, `UPDATE`, `DELETE`, требуют обслуживания и могут быть бесполезны при низкой селективности. Избыточные индексы усложняют query planner и увеличивают storage cost.

- What is a CHECK constraint?

  **Ответ:** `CHECK` задает условие, которому должна соответствовать строка. Он полезен для бизнес-правил, которые можно выразить на уровне одной строки.

  ```sql
  ALTER TABLE products
  ADD CONSTRAINT products_price_positive CHECK (price >= 0);
  ```

- What is a trigger?

  **Ответ:** Trigger — процедура, которая автоматически выполняется при событии в таблице: `INSERT`, `UPDATE`, `DELETE` или иногда `TRUNCATE`. Триггеры используют для audit logs, derived fields, validation и синхронизации данных, но ими нельзя злоупотреблять, потому что они скрывают side effects.

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

  **Ответ:** Migration — версионированное изменение структуры или данных БД: создание таблицы, добавление колонки, изменение индекса, перенос данных. Миграции позволяют воспроизводимо менять схему между environments и версиями приложения.

- What is the difference between migrations in SQL and NoSQL databases?

  **Ответ:** В SQL migrations чаще меняют строгую схему: tables, columns, constraints, indexes. В NoSQL схема может быть гибкой, поэтому migrations часто обновляют документы, добавляют новые поля, пересчитывают embedded structures или создают indexes. Но discipline версионирования все равно нужна.

- Why is rollback needed in migrations?

  **Ответ:** Rollback нужен, чтобы откатить неудачное изменение схемы или данных. На практике не все migrations безопасно откатываются автоматически, особенно destructive migrations. Поэтому важны backups, backward-compatible changes и staged rollout.

- How do migration systems determine which migrations have already been executed?

  **Ответ:** Migration tools хранят служебную таблицу или коллекцию с именами/версиями выполненных migrations, timestamp и иногда checksum. Перед запуском tool сравнивает файлы migrations с этой таблицей и выполняет только новые.

- What tools exist for automatic migration generation?

  **Ответ:** Для SQL часто используют Prisma Migrate, TypeORM migrations, Sequelize CLI, Knex migrations, Flyway, Liquibase, Alembic, Rails migrations. Automatic generation сравнивает model/schema definitions с текущей схемой, но результат все равно нужно review-ить.

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

  **Ответ:** Transaction — группа операций, которая выполняется как единое целое. Она должна соблюдать ACID: atomicity, consistency, isolation, durability. Если одна часть не удалась, изменения можно откатить.

- In which scenarios are transactions used?

  **Ответ:** Transactions нужны при изменении нескольких связанных записей: создание заказа и списание остатков, перевод денег, запись audit log вместе с основным изменением, обновление нескольких таблиц с инвариантами целостности.

- What types of transactions and isolation levels exist?

  **Ответ:** Isolation levels обычно включают `Read Uncommitted`, `Read Committed`, `Repeatable Read`, `Serializable`. Они определяют, какие concurrent anomalies допустимы: dirty reads, non-repeatable reads, phantom reads и serialization anomalies.

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

  **Ответ:** Normalization — проектирование схемы так, чтобы уменьшить дублирование и anomalies при insert/update/delete. Данные раскладываются по таблицам согласно зависимостям и связываются ключами.

- What is denormalization?

  **Ответ:** Denormalization — осознанное добавление дублирования или precomputed данных ради производительности чтения. Например, хранить `order_total` в таблице orders, хотя его можно вычислить из order_items.

- Why are normalization and denormalization important in database design?

  **Ответ:** Normalization защищает целостность и упрощает обновления. Denormalization ускоряет чтение и упрощает некоторые запросы. Хороший дизайн выбирает баланс под реальные access patterns.

- What are the First, Second, and Third Normal Forms (1NF, 2NF, 3NF)?

  **Ответ:** 1NF требует атомарных значений и отсутствия повторяющихся групп. 2NF требует, чтобы неключевые поля зависели от всего composite key, а не от его части. 3NF требует, чтобы неключевые поля зависели только от ключа, а не от других неключевых полей.

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

  **Ответ:** Graph database хранит данные как граф: nodes, edges и properties. Она оптимизирована для traversals и поиска связей, где JOIN-подобные операции в relational DB стали бы сложными или дорогими.

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

  **Ответ:** `JOIN` объединяет строки из таблиц по условию. Основные виды: `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`, `CROSS JOIN`. Query planner выбирает физический алгоритм: nested loop, hash join или merge join.

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
