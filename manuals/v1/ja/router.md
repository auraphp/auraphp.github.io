---
layout: docs-ja
title: ルーティング
permalink: /manuals/v1/ja/routing/
---

# ルーティング #

フレームワークのルーティングには、Aura.Router が使われています。
Aura Router は PHP パッケージで、Web のルーティング機能がまとめられています。
URI パスと `$_SERVER` のコピーを渡すとルートのマッチングが行われ、マッチしたアプリケーションルートのコントローラー、アクション、パラメーターの値が返されます。

マッチしたルートの情報からコントローラーを呼び出す処理は、アプリケーション基盤またはフレームワーク側で行う必要があります。
URI パスと `$_SERVER` のコピーを渡すことさえできれば、どのようなシステムでも Aura Router を使えます。

Aura Router は [Solar rewrite
rules](http://solarphp.com/manual/dispatch-cycle.rewrite-rules) と
<http://routes.groovie.org> から多くを学んでいます。

## ルートの追加 ##

Aura.Router にルートを追加するには `add()` メソッドを使います。

{% highlight php %}
<?php
// パラメータなしの単純な名前付きルートを追加する
$di->get('router_map')->add('home', '/');

// パラメータのある、単純な無名ルートを追加する
$di->get('router_map')->add(null, '/{:controller}/{:action}/{:id:(\d+)}');

// 複雑な名前付きルートを追加する
$di->get('router_map')->add('read', '/blog/read/{:id}{:format}', [
    'params' => [
        'id'     => '(\d+)',
        'format' => '(\..+)?',
    ],
    'values' => [
        'controller' => 'blog',
        'action'     => 'read',
        'format'     => 'html',
    ],
]);
{% endhighlight %}

## ルートパスの生成 ##

### コントローラ内 ###

リンク作成のためにルートから URI パスを生成するには、ルーターオブジェクトの `generate()` メソッドをルート名を引数にして呼び出します。

{% highlight php %}
<?php
// $path => "/blog/read/42.atom"
$path = $this->router->generate('read', [
    'id' => 42,
    'format' => '.atom',
]);
{% endhighlight %}

Aura Router では、ルート生成時に動的なルートのマッチングは行われません。
URI パスを生成したいルートには、必ずルート名を指定してください。

上の例では、2つめの引数に指定した配列の値から、実際のルートパスが生成されていることが分かります。
2つめの引数の指定は任意ですが、ルートパスのパラメータに対応するデータが渡されていない場合、ルートパス中の `{:param}` トークンは置換されずそのままになります。
また、渡されたデータにルートパスのパラメータとして存在しないキーがあっても、生成されるパスに追加されることはありません。

## 高度な使い方 ##

## 複雑なルートの記述 ##

複雑な仕様のルートを追加したい場合は、パスに関連する情報を以下のオプションをキーにして配列に追記します。

- `params` -- パスパラメーターに対する正規表現のサブパターンを指定します。パス中のパラメーターは、この設定で上書きされます。
        
{% highlight php %}
'params' => [
    'id' => '(\d+)',
]
{% endhighlight %}
        
  ルートパスのパラメーター部分に直接正規表現を埋め込むこともできます。
  (例 `/read/{:id:(\d+)}`)
  こちらの方が読みやすい場合もあります。

- `values` -- ルートのデフォルト値を定義するのに使います。マッチしたパスの値で上書きされます。

{% highlight php %}
'values' => [
    'controller' => 'blog',
    'action' => 'read',
    'id' => 1,
]
{% endhighlight %}
        
- `method` -- 配列を指定します。配列中の値と `$server['REQUEST_METHOD']` とのマッチングが行われます。

- `secure` -- `true` を指定した場合は、`$server['HTTPS']` がオンになっているか、リクエストされたポートが 443 の時にのみルートにマッチします。
`false` を指定した場合は、どちらにも当てはまらない時にのみルートにマッチします。

- `routable` -- `false` を指定すると、このルートはマッチングには使われず、パスの生成のみに制限されます。

- `is_match` -- マッチング用のカスタムコールバックまたはクロージャーを指定します。
シグニチャーは `function(array $server, \ArrayObject $matches)` で、マッチした場合に true を返し、マッチしない場合は false を返すようにします。
これを使うと、ルートに対して開発者が任意のマッチングロジックを実装でき、パスから得られた `$matches` の値を変更することもできます。

- `generate` -- パスの生成用のカスタムコールバックまたはクロージャーを指定します。
シグニチャーは `function(\aura\router\Route $route, array $data)` で、パスの生成に使う `$data` を返します。

すべてのオプションを含む `read` という名前のルートを指定する例は次のとおりです。

{% highlight php %}
<?php
$di->get('router_map')->add('read', '/blog/read/{:id}{:format}', [
    'params' => [
        'id' => '(\d+)',
        'format' => '(\..+)?',
    ],
    'values' => [
        'controller' => 'blog',
        'action' => 'read',
        'id' => 1,
        'format' => '.html',
    ],
    'secure' => false,
    'method' => ['GET'],
    'routable' => true,
    'is_match' => function(array $server, \ArrayObject $matches) {
            
        // リファラーが example.com の場合はルートにマッチしないようにする
        if ($server['HTTP_REFERER'] == 'http://example.com') {
            return false;
        }
        
        // マッチング結果の配列に $server のリファラーの値を追加する
        $matches['referer'] = $server['HTTP_REFERER'];
        return true;
        
    },
    'generate' => function(\Aura\Router\Route $route, array $data) {
        $data['foo'] = 'bar';
        return $data;
    }
]);
{% endhighlight %}


コールバックの代わりにクロージャーを使うと、ルーターに対して `serialize()` や `var_export()` が使えずキャッシュできなくなることに注意してください。


## 単純なルート ##

上で説明した複雑な設定をすべてのルートに対して行う必要はありません。2つめの引数に配列を指定する代わりに、次のように単純に文字列を渡すこともできます。

   
{% highlight php %}
<?php
$di->get('router_map')->add('archive', '/archive/{:year}/{:month}/{:day}');
{% endhighlight %}

こうすると、各パスパラメーターに対してスラッシュ以外のすべての文字にマッチするデフォルトのサブパターンを使ってマッチングが行われます。`'action'` のデフォルト値としてルート名が使われます。
したがって、上の短い形式の指定は、配列を使った次の長い形式の指定と同じことになります。

{% highlight php %}
<?php
$di->get('router_map')->add('archive', '/archive/{:year}/{:month}/{:day}', [
    'params' => [
        'year'  => '([^/]+)',
        'month' => '([^/]+)',
        'day'   => '([^/]+)',
    ],
    'values' => [
        'action' => 'archive',
    ],
]);
{% endhighlight %}

## ワイルドカードを含むルート ##

パスの後続部分を任意にしたい場合があります。
このような "ワイルドカード" を含むルートを指定する方法は2種類あります。
なお、ワイルドカードルーティングは、パスの末尾でのみ機能します。

1つめの方法は "任意の値" ワイルドカードで、パスの末尾に `/{:foo*}` という形式で指定します。
こうすると、指定した部分以降は空の場合も含めて任意の文字にマッチします。
マッチした場合、スラッシュで分割され `'foo'` というキーに配列として格納されます。
ワイルドカードに対応する部分が空のパスでは、末尾のスラッシュの有無に関わらずマッチすることに注意してください。

{% highlight php %}
<?php
$di->get('router_map')->add('wild_post', '/post/{:id}/{:other*}');

// 次のコードでは、コードの下に示す2つの値にマッチします
$route = $di->get('router_map')->match('/post/88/foo/bar/baz', $_SERVER);
// $route->values['id'] = 88;
// $route->values['other'] = ['foo', 'bar', 'baz'];

// 次のコードでは、コードの下に示す2つの値にマッチします(末尾にスラッシュがあることに注意してください)
$route = $di->get('router_map')->match('/post/88/', $_SERVER);
// $route->values['id'] = 88;
// $route->values['other'] = [];

// 次のように末尾にスラッシュがなくてもマッチします
$route = $di->get('router_map')->match('/post/88', $_SERVER);
// $route->values['id'] = 88;
// $route->values['other'] = [];
{% endhighlight %}

2つめの方法は "必須の値" ワイルドカードで、パスの末尾に `/{:foo+}` という形式で指定します。
こうすると、指定した部分以降が任意の文字にマッチしますが、ワイルドカードの前にスラッシュがあり、ワイルドカード部分に何らかの文字がないとマッチしません。
マッチした場合、スラッシュで分割され `'foo'` というキーに配列として格納されます。

{% highlight php %}
<?php
$di->get('router_map')->add('wild_post', '/post/{:id}/{:other+}');

// 次のコードでは、コードの下に示す2つの値にマッチします
$route = $di->get('router_map')->match('/post/88/foo/bar/baz', $_SERVER);
// $route->values['id'] = 88;
// $route->values['other'] = ['foo', 'bar', 'baz'];

// 以下ではマッチしません
$route = $di->get('router_map')->match('/post/88/', $_SERVER);
$route = $di->get('router_map')->match('/post/88', $_SERVER);
{% endhighlight %}


> 注意: Router の以前のリリースでは、ワイルドカードの指定に `'/*'` を使っていました。
> また、マッチしたワイルドカード部分をスラッシュで分割した配列を格納するキーとして `'*'` を使っていました。
> この動作は現在も利用可能ですが、非推奨です。


## ルートグループのアタッチ ##

複数のルートを、アプリケーションの1つ "マウントポイント" に接続することができます。
たとえば、ブログに関連するすべてのルートを `'/blog'` にマウントしたい場合は、次のようにします。

{% highlight php %}
<?php
$di->get('router_map')->attach('/blog', [
    
    // アタッチするルートの配列
    'routes' => [
        
        // 'browse' という名前のルートの短い形式
        'browse' => '/',
        
        // 'read' という名前のルート
        'read' => [
            'path' => '/{:id}{:format}',
            'params' => [
                'id'     => '(\d+)',
                'format' => '(\.json|\.atom)?'
            ],
            'values' => [
                'format' => '.html',
            ],
        ],
        
        // 'edit' という名前のルートの短い形式
        'edit' => '/{:id:(\d+)}/edit',
    ],
]);
{% endhighlight %}

    
各ルートのパスには `/blog` プレフィックスがつくようになるので、結果として次のようなパスになります。

- `browse: /blog/`
- `read:   /blog/{:id}{:format}`
- `edit:   /blog/{:id}/edit`

ルート定義用のキーを、マウントを定義する配列の一部として記述することもできます。
こうすると、接続される各ルートに共通するデフォルト値として利用されるので、同じ情報をルートごとに繰り返し記述する必要がなくなります。

{% highlight php %}
<?php
$di->get('router_map')->attach('/blog', [
    
    // ルートの共通パラメーター
    'params' => [
        'id'     => '(\d+)',
        'format' => '(\.json|\.atom)?',
    ],
    
    // ルートに共通する値
    'values' => [
        'controller' => 'blog',
        'format'     => '.html',
    ],

    // アタッチするルートの配列
    'routes' => [
        'browse' => '/',
        'read'   => '/{:id}{:format}',
        'edit'   => '/{:id}/edit',
    ],
));
{% endhighlight %}

## コントローラー内 ##

コントローラー内では `$this->router` により RouterMap オブジェクトを利用できます。

{% highlight php %}
$this->router->generategenerate('read', [
    'id' => 42,
    'format' => '.atom',
]);
{% endhighlight %}

## ビュー内 ##

ビューでは次のようにルートを生成できます。

{% highlight php %}
$this->route('read', [
    'id' => 42,
    'format' => '.atom',
]);
{% endhighlight %}
