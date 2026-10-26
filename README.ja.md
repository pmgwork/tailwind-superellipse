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

通常の `rounded-*` の代わりに `corner-*` を使います。各ユーティリティが半径を設定し、対応ブラウザでは角の形状も設定します。

### ユーティリティ一覧

| クラス | 基準となる半径 |
| --- | --- |
| `corner-xs` | `var(--radius-xs)` |
| `corner-sm` | `var(--radius-sm)` |
| `corner-md` | `var(--radius-md)` |
| `corner-lg` | `var(--radius-lg)` |
| `corner-xl` | `var(--radius-xl)` |
| `corner-2xl` | `var(--radius-2xl)` |
| `corner-3xl` | `var(--radius-3xl)` |
| `corner-4xl` | `var(--radius-4xl)` |
| `corner-full` | `1000px` |

対応ブラウザでは、既定でテーマの半径を **1.5 倍**に補正し、`superellipse(1.5)` を適用します。`corner-full` は固定の半径を維持し、`superellipse(1.1)` を適用します。

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
