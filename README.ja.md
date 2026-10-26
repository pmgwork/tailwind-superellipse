# tailwind-superellipse

Tailwind CSS v4 用の superellipse 角丸ユーティリティです。`corner-*` クラスで、カードやボタンなどに CSS ネイティブの滑らかな角を適用できます。

[English](./README.md) · [日本語](./README.ja.md)

- CSS のみで動作し、実行時の JavaScript は不要です。
- 利用側の Tailwind の角丸テーマを参照します。
- レスポンシブや状態に応じたバリアントに対応します。
- `corner-shape` 非対応ブラウザでは通常の角丸にフォールバックします。

## インストール

**Tailwind CSS v4 の 4.1 以降**が必要です。このパッケージはソース CSS を提供するため、ビルド時に Tailwind で処理してください。

```sh
npm install tailwind-superellipse
```

エントリー CSS で、Tailwind の後に読み込みます。

```css
@import "tailwindcss";
@import "tailwind-superellipse";
```

## 使い方

```html
<div class="corner-lg bg-gray-100 p-6">Card</div>
<div class="corner-md md:corner-xl">Responsive card</div>
<button class="corner-lg hover:corner-xl px-4 py-2">Button</button>
<div class="corner-full px-4 py-2">Badge</div>
```

`rounded-*` を使う場所に、そのまま `corner-*` を使えます。各ユーティリティが半径を設定し、対応ブラウザでは角の形状も設定します。

### ユーティリティ一覧

| パターン | 例 | 半径 |
| --- | --- | --- |
| `corner` | `corner` | `0.25rem`（`rounded` と同じ） |
| `corner-{size}` | `corner-lg` | `var(--radius-lg)`。`xs`〜`4xl` はテーマの値 |
| `corner-none` | `corner-none` | `0` |
| `corner-full` | `corner-full` | `1000px` |
| `corner-[value]` | `corner-[20px]` | 任意の長さ |
| `corner-(length:--var)` | `corner-(length:--card-radius)` | `var(--card-radius)` |

上のパターンはすべて、`rounded-*` と同じように辺や角を指定できます。

| 接頭辞 | 対象 |
| --- | --- |
| `corner-t-*`、`corner-r-*`、`corner-b-*`、`corner-l-*` | 上・右・下・左の辺 |
| `corner-s-*`、`corner-e-*` | インライン方向の開始側・終了側の辺 |
| `corner-tl-*`、`corner-tr-*`、`corner-br-*`、`corner-bl-*` | 物理的な角 |
| `corner-ss-*`、`corner-se-*`、`corner-ee-*`、`corner-es-*` | 論理的な角 |

```html
<div class="corner-xl corner-b-none">上だけ丸める</div>
<div class="corner-[20px] md:corner-tl-3xl">任意の値</div>
<div class="corner-(length:--card-radius)">CSS 変数</div>
```

テーマのサイズも任意の値も、同じ方法で半径を補正します。対応ブラウザでは、既定で **1.5 倍**にし、`superellipse(1.5)` を適用します。`corner-none` は `0` のままです。`corner-full` は固定の半径を維持し、`superellipse(1.1)` を適用します。

## カスタマイズ

既存の `--radius-*` を再定義せず、利用側のテーマ値を参照します。

```css
@theme {
  --radius-lg: 0.75rem;
}
```

CSS カスタムプロパティで、角の形状や半径の補正倍率を変更できます。

```css
:root {
  --superellipse-exponent: 1.5;
  --superellipse-scale: 1.5;
}

/* 特定の要素やその子孫で形状を変更します。 */
.soft-corners {
  --superellipse-exponent: 1.25;
}
```

| プロパティ | 既定値 | 効果 |
| --- | --- | --- |
| `--superellipse-exponent` | `1.5`（`corner-full` は `1.1`） | `superellipse()` に渡す引数。明示的に指定すると、両方の既定値を上書きします。 |
| `--superellipse-scale` | `1.5` | 対応ブラウザでの半径の補正倍率。`corner-full` には適用しません。 |

これらのプロパティは親要素から継承されます。`superellipse()` の引数は Figma の corner smoothing の割合とは異なります。

## ブラウザ対応

次の機能クエリ内で、superellipse の形状と半径の補正を適用します。

```css
@supports (corner-shape: superellipse(1.5)) {
  /* Superellipse の角丸 */
}
```

非対応ブラウザでは、補正前のテーマの半径を使います。`corner-full` の半径は `1000px` です。CSS ネイティブの機能を使っており、非対応ブラウザで同じ形状を再現するポリフィルは含みません。

ブラウザ別の視覚検証はまだ行っていません。

## 開発

```sh
npm install
npm test
npm pack --dry-run
```

テストでは Tailwind で CSS を生成し、各サイズ・機能クエリ・バリアント・テーマ参照・未使用クラスの除外を確認します。実ブラウザでの見た目の確認は別途必要です。`npm publish` の前にもテストが自動実行されます。

## ライセンス

[MIT](./LICENSE)
