import * as Koa from "koa";
import * as Router from "@koa/router";
import * as send from "koa-send";
import * as logger from "koa-logger";
import fetch from "node-fetch";
import { IconParams, TweetQuery } from "./model";

const app = new Koa();
const router = new Router();

router.get("/healthz", (ctx, next) => {
    ctx.body = "OK";
});

router.get("/recotw/1/tweet/get_tweet_all", (ctx, next) => {
    const query: TweetQuery = ctx.query;
    if (query.since_id) {
        ctx.body = [];
        return;
    }

    send(ctx, "all_tweets.json");
});

router.get("/icon/:screen_name", async (ctx, next) => {
    try {
        const params: IconParams = ctx.params;
        const response = await fetch(`https://twitter.com/intent/user?screen_name=${params.screen_name}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const [ , result ] = /src=(?:"|')(https:\/\/[ap]bs\.twimg\.com\/[^"']+)/u.exec(await response.text()) ?? [];
        if (!result) {
            ctx.status = 500;
            return;
        }
        ctx.redirect(result);
    } catch (e) {
        ctx.redirect("https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png");
    }
});

const server = app
    .use(logger())
    .use(router.routes())
    .listen(process.env.PORT ?? "8080");

process
    .on("SIGINT", () => server.close(() => process.exit()))
    .on("SIGTERM", () => server.close(() => process.exit()));
