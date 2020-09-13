import Koa from "koa";
import Router from "@koa/router";
import send from "koa-send";
import logger from "koa-logger";
import Twitter from "twitter-lite";
import type { IconParams, TweetQuery } from "./model";

const app = new Koa();
const router = new Router();
const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY ?? "",
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET ?? "",
    access_token_key: process.env.TWITTER_TOKEN ?? "",
    access_token_secret: process.env.TWITTER_TOKEN_SECRET ?? "",
});

router.get("/healthz", (ctx, next) => {
    ctx.body = "OK";
});

router.get("/recotw/1/tweet/get_tweet_all", async (ctx, next) => {
    const query = ctx.query as TweetQuery;
    if (query.since_id) {
        ctx.body = [];
        return;
    }

    return send(ctx, "data/all_tweets.json");
});

router.get("/icon/:screen_name", async (ctx, next) => {
    try {
        const params = ctx.params as IconParams;
        const response = await twitter.get<TwitterUser>("users/show", { screen_name: params.screen_name });
        ctx.redirect(response.profile_image_url_https.replace(/_normal/u, "_200x200"));
    } catch (e: unknown) {
        ctx.redirect("https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png");
    }
});

const server = app
    .use(logger())
    .use(router.routes())
    .listen(process.env.PORT ?? "8080");

server.keepAliveTimeout = 0;
process
    .on("SIGINT", () => server.close(() => process.exit()))
    .on("SIGTERM", () => server.close(() => process.exit()));
