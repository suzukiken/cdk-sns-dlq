+++
title = "SNSのデッドレターキュー"
date = "2021-04-27"
tags = ["SNS"]
+++

SNSのメッセージはもれなくサブスクライバーのSQSやLambdaが受け取っているのだろうか、ということが気になった場合、その配信に失敗したメッセージをデッドレターキューに格納するという機能がある。（へえー）

特定のサブスクライバに対する配信の失敗を通知するものなので、サブスクライバーごとに設定する必要がある。

[AWSのドキュメント](https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html)

IAMポリシーの設定の部分がわかりにくかったがSQSとLambdaをサブスクライバにして、デッドレターキューを設定するように作ってみた。

[Githubのリポジトリ](https://github.com/suzukiken/cdksns-filter)

SNSがFIFOの場合はデッドレターキューもFIFOにする必要がある。

デッドレターの発生を確認するにはサブスクライバーとなっているSQSやLambdaを削除してからSNSにメッセージを投稿すると機能していることがわかる。