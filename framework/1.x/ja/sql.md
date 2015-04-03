---
layout: docs-ja
title: Aura SQL
permalink: /framework/1.x/ja/sql/
---

#Aura SQL#

Aura SQLパッケージはMySQL、PostgreSQL、それにSqliteなどのデータベースのクエリーとその接続を提供します。
接続のほとんどは[PDO](http://php.net/PDO)接続でラップされたものです。

Aura SQL は４つの接続アダプターをサポートします。`'mysql'`はMySQL、 `'pgsql'`はPostgreSQL、
 `'sqlite'`はSQLite3それに`'sqlsrv'` は Microsoft SQL Serverに使われます。


## インストール ##

もしAura.SqlをDIで使うならこの章はスキップできます。

`scripts/instance.php`スクリプトを使い`ConnectionFactory` を取得して接続するのが始めるのに簡単な方法です。

{% highlight php %}
<?php
$connection_factory = include '/path/to/Aura.Sql/scripts/instance.php';
$connection = $connection_factory->newInstance(

    // adapter name
    'mysql',

    // DSN elements for PDO; this can also be
    // an array of key-value pairs
    'host=localhost;dbname=database_name',

    // username for the connection
    'username',

    // password for the connection
    'password'
);
{% endhighlight %}

代わりに、別のautoloaderに`'/path/to/Aura.Sql/src'`を加えて手動で接続を取得する事もできます。

{% highlight php %}
<?php
use Aura\Sql\ConnectionFactory;
$connection_factory = new ConnectionFactory;
$connection = $connection_factory->newInstance(...);
{% endhighlight %}

## 接続 ##

接続はクエリーを発行したときに遅延接続されます。つまり接続オブジェクトを作成しても、もしクエリーを発行しなければデータベースに接続される事はありません。

手動で`connect()`を使って接続する事もできます。

{% highlight php %}
<?php
$connection->connect();
{% endhighlight %}

## 結果の取得 ##

一度接続すれば、データベースから結果を取得することもできます。

{% highlight php %}
<?php
// returns all rows
$result = $connection->fetchAll('SELECT * FROM foo');
{% endhighlight %}

これらのメソッドを使って結果を取得することができます。

- `fetchAll()`は全ての行の連続した配列を返します。行は列の名前をキーとした連想配列が返ります。

 returns a sequential array of all rows. The rows themselves are
  associative arrays where the keys are the column names.

- `fetchAssoc()` は最初の列がキーとなった全ての行の連想配列が返ります。

- `fetchCol()` は最初の列の全ての値を連続した配列として返します。

- `fetchOne()`は最初の行を列名をキーとした連想配列で返します。

- `fetchPairs()`は最初の列をキーとして次の列を値とした連想配列を返します。

- `fetchValue()` 最初の列の最初の行の値を返します。

## SQLインジェクションの防御 ##

通常、ユーザーが提供するデータをクエリーに組み入れる必要があります。
つまり、全ての値をクオートしてクエリー文字列に差し込む[SQL injectionの防止](http://bobby-tables.com/)をしなければなりません。

Aura SQLはクオートするメソッドを提供していますが、それよりプリペアードステートを使って値をバインドする方が良いでしょう。
その為にクエリーの文字列中に名前を使ったプレースフォルダーを置いて、そのプレースフォルダに配列の値をバインドします。

{% highlight php %}
<?php
// the text of the query
$text = 'SELECT * FROM foo WHERE id = :id';

// values to bind to query placeholders
$bind = [
    'id' => 1,
];

// returns one row; the data has been parameterized
// into a prepared statement for you
$result = $connection->fetchOne($text, $bind);
{% endhighlight %}

Aura SQL は配列とクオートする値をカンマ区切りのリストとして、認識します。

{% highlight php %}
<?php
// the text of the query
$text = 'SELECT * FROM foo WHERE id = :id AND bar IN(:bar_list)';

// values to bind to query placeholders
$bind = [
    'id' => 1,
    'bar_list' => ['a', 'b', 'c'],
];

// returns all rows; the query ends up being
// "SELECT * FROM foo WHERE id = 1 AND bar IN('a', 'b', 'c')"
$result = $connection->fetchOne($text, $bind);
{% endhighlight %}

## クエリーオブジェクト ##

Aura SQLは４つのタイプのクエリーオブジェクトを用意します。
それによってオブジェクト指向スタイルで記述することができます。

## Select ##

新しい`Select`オブジェクトを取得するのには`newSelect()`メソッドを接続の時に実行します。
それから`Select` オブジェクトを変更して、`query()`や`fetch*()`メソッドに渡します。

{% highlight php %}
<?php
// create a new Select object
$select = $connection->newSelect();

// SELECT * FROM foo WHERE bar > :bar ORDER BY baz
$select->cols(['*'])
       ->from('foo')
       ->where('bar > :bar')
       ->orderBy('baz');

$bind = ['bar' => '88'];

$list = $connection->fetchAll($select, $bind);
{% endhighlight %}

`Select`オブジェクトはこれらのメソッド以上のものを提供します。
更なる情報はソースコードをご覧になってください。

- `distinct()`: `SELECT DISTINCT`に`true`をセットします。

- `cols()`: コラム（列）をセレクトします。

- `from()`: テーブルをセレクトします。

- `join()`: 特定条件のテーブルをジョインします。

- `where()`: 条件に`WHERE`を使います。（`AND`を使用します）

- `orWhere()`: 条件に`WHERE`を使います。（`OR`を使用します）

- `groupBy()`: コラム（列）を`GROUP BY`します。

- `having()`: 条件に`HAVING`を使います。 （`AND`を使用します）

- `orHaving()`: 条件に`HAVING`を使います。 （`OR`を使用します）

- `orderBy()`: コラム（列）を`ORDER BY`します。

- `limit()`: ロー（行）に対して`LIMIT`します。

- `offset()`: ロー（行）に対して`OFFSET`します。

- `union()`: `SELECT`に`UNION`を続けます。

- `unionAll()`: `SELECT`に`UNION ALL`を続けます。

## Insert ##

新しい`Insert`オブジェクトを取得するのには`newInsert()`メソッドを接続の時に実行します。
それから`Insert` オブジェクトを変更して、`query()`メソッドに渡します。

{% highlight php %}
<?php
// create a new Insert object
$insert = $connection->newInsert();

// INSERT INTO foo (bar, baz, date) VALUES (:bar, :baz, NOW());
$insert->into('foo')
       ->cols(['bar', 'baz'])
       ->set('date', 'NOW()');

$bind = [
    'bar' => null,
    'baz' => 'zim',
];

$stmt = $connection->query($insert, $bind);
{% endhighlight %}

## Update ##

新しい`Update`オブジェクトを取得するのには`newUpdate()`メソッドを接続の時に実行します。
それから`Update` オブジェクトを変更して、`query()`メソッドに渡します。


{% highlight php %}
<?php
// create a new Update object
$update = $connection->newUpdate();

// UPDATE foo SET bar = :bar, baz = :baz, date = NOW() WHERE zim = :zim OR gir = :gir
$update->table('foo')
       ->cols(['bar', 'baz'])
       ->set('date', 'NOW()')
       ->where('zim = :zim')
       ->orWhere('gir = :gir');

$bind = [
    'bar' => 'barbar',
    'baz' => 99,
    'zim' => 'dib',
    'gir' => 'doom',
];

$stmt = $connection->query($update, $bind);
{% endhighlight %}

## Delete ##

新しい`Delete`オブジェクトを取得するのには`newDelete()`メソッドを接続の時に実行します。
それから`Delete` オブジェクトを変更して、`query()`メソッドに渡します。

{% highlight php %}
<?php
// create a new Delete object
$delete = $connection->newDelete();

// DELETE FROM WHERE zim = :zim OR gir = :gir
$delete->from('foo')
       ->where('zim = :zim')
       ->orWhere('gir = :gir');

$bind = [
    'zim' => 'dib',
    'gir' => 'doom',
];

$stmt = $connection->query($delete, $bind);
{% endhighlight %}

## テーブル情報の取得 ##

データベースのテーブル情報を取得するには`fetchTableList()`を発行します：

{% highlight php %}
<?php
// get the list of tables
$list = $connection->fetchTableList();

// show them
foreach ($list as $table) {
    echo $table . PHP_EOL;
}
{% endhighlight %}

テーブルのカラムについての情報を取得するには`fetchTableCols()`を発行します；

{% highlight php %}
<?php
// the table to get cols for
$table = 'foo';

// get the cols
$cols = $connection->fetchTableCols($table);

// show them
foreach ($cols as $name => $col) {
    echo "Column $name is of type "
       . $col->type
       . " with a size of "
       . $col->size
       . PHP_EOL;
}
{% endhighlight %}

それぞれのコラムは以下のプロパティを持つ`Column`オブジェクトとして表されます。

- `name`: (string) コラム名

- `type`: (string) データベースにより伝えられるコラムのデータの型。

- `size`: (int) コラムサイズ

- `scale`: (int) （もしあれば）コラムの数

- `notnull`: (bool) `NOT NULL`とマークされてるコラムの数

- `default`: (mixed) コラムのデフォルト値。`timestamp`が自動でセットされる場合は`null`の時があることに注意。

- `autoinc`: (bool) `auto-incremented`のコラムかどうか

- `primary`: (bool) プライマリーキーかどうか

## トランザクション ##

Aura SQL接続はいつもautocommitモードで始まります（PDOと同じです）
これをオフにしてトランザクションは`beginTransaction()`で開始して`commit()`または `rollBack()` することができます。
コミットとロールバックは接続をautocommitモードに戻します。

{% highlight php %}
<?php
// turn off autocommit and start a transaction
$connection->beginTransaction();

try {
    // ... perform some queries ...
    // now commit to the database:
    $connection->commit();
} catch (Exception $e) {
    // there was an error, roll back the queries
    $connection->rollBack();
}

// at this point we are back in autocommit mode
{% endhighlight %}

## マニュアルクエリー ##

手動でのクエリーも可能です。`query()`メソッドでこのようにします；

{% highlight php %}
<?php
$text = "SELECT * FROM foo WHERE id = :id";
$bind = ['id' => 1];
$stmt = $connection->query($text, $bind);
{% endhighlight %}

返される`$stmt`は[PDOStatement](http://php.net/PDOStatement)で自由に操作できます。

## プロファイリング ##

クエリーがどのように実行されているかプロファイルする事もできます。

{% highlight php %}
<?php
// turn on the profiler
$connection->getProfiler()->setActive(true);

// issue a query
$result = $connection->fetchAll('SELECT * FROM foo');

// now get the profiler information
foreach ($connection->getProfiler()->getProfiles() as $i => $profile) {
    echo 'Query #' . ($i + 1)
       . ' took ' . $profile->time . ' seconds.'
       . PHP_EOL;
}
{% endhighlight %}

プロファイルオブジェクトはそれぞれ以下のプロパティを持ちます。 operties:

- `text`: (string) クエリー文字列

- `time`: (float) クエリーが完了するまでの時間。単位は秒。

- `data`: (array) クエリーにバインドされたデータ。

- `trace`: (array) クエリーがどうやって呼ばれたかを知る事のできる[debug_backtrace](http://php.net/debug_backtrace)