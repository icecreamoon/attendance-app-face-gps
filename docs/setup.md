このドキュメントは、勤怠管理アプリの初期構築における技術的な手順と、遭遇したエラーの対応記録をまとめたものです。

#　勤怠管理アプリ 初期構築ログ

## 使用技術
- React + Vite
- Tailwind CSS
- AWS Amplify Gen 1
- DynamoDB / Cognito / AppSync

## 初期構築の流れ
1. `npm create vite@latest` → React + Tailwind環境構築
2. `amplify configure` → IAMユーザー作成 & AWSプロファイル設定
3. `amplify init` → プロジェクト初期化（`kintaiapp`）
4. `amplify add api` → GraphQL API追加（`PunchLog` モデル定義）
5. `amplify push` → バックエンドをAWSにデプロイ
6. `amplify codegen` → クエリ・ミューテーション自動生成

### IAM権限不足による CloudFormation 失敗

#### 発生したエラー
```text
User is not authorized to perform: iam:GetRole on resource: amplify-kintaiapp-dev-authRole

Amplify CLI が CloudFormation 経由で IAM ロールを作成・取得・削除しようとした際に、 IAM ユーザー Takami に必要な権限がなく、403 AccessDenied エラーが発生。

＊対応方法
・AWS コンソール → IAM → ユーザー → Takami を選択
・「アクセス権限」タブ → 「ポリシーをアタッチ」
・ポリシーを追加：AdministratorAccess
→これにより Amplify CLI が必要な IAM 操作（GetRole, CreateRole, DeleteRole など）を実行可能に。
・CloudFormation スタックが ROLLBACK_FAILED になった場合は、AWS コンソールから手動で削除
・再度 amplify init を実行して初期化をやり直すことで解決

##### 今後の予定
- Reactから `createPunchLog` を使って打刻履歴を保存  
- 顔認証・GPS連携の実装  
- UI/UXのブラッシュアップ  
- 認証ルールの強化（@auth ディレクティブの追加）
